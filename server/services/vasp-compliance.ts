import { db } from "../db";
import { users, transactions, kycVerifications } from "@shared/schema";
import { eq, and, desc, gte, lte, sum } from "drizzle-orm";

interface ComplianceCheck {
  userId: string;
  transactionType: 'deposit' | 'withdrawal' | 'trade';
  amount: string;
  currency: string;
  destination?: string;
}

interface ComplianceResult {
  approved: boolean;
  requiresKYC: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  limits: {
    daily: string;
    monthly: string;
    remaining: string;
  };
  reason?: string;
}

export class VASPComplianceService {
  // VASP-compliant transaction limits (minimal KYC approach)
  private readonly limits = {
    unverified: {
      daily: 1000,    // $1,000 daily
      monthly: 5000   // $5,000 monthly
    },
    email_verified: {
      daily: 25000,   // $25,000 daily
      monthly: 100000 // $100,000 monthly
    },
    phone_verified: {
      daily: 250000,  // $250,000 daily
      monthly: 1000000 // $1,000,000 monthly
    },
    full_kyc: {
      daily: 5000000,   // $5,000,000 daily
      monthly: 50000000 // $50,000,000 monthly
    }
  };

  // Check transaction compliance (VASP-minimal approach)
  async checkTransactionCompliance(request: ComplianceCheck): Promise<ComplianceResult> {
    const { userId, transactionType, amount, currency } = request;
    
    // Get user KYC status
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return {
        approved: false,
        requiresKYC: true,
        riskLevel: 'high',
        limits: { daily: "0", monthly: "0", remaining: "0" },
        reason: "User not found"
      };
    }

    // Determine user tier based on verification
    const userTier = this.getUserTier(user);
    const tierLimits = this.limits[userTier];
    
    // Calculate USD equivalent (simplified)
    const usdAmount = await this.convertToUSD(amount, currency);
    
    // Check daily/monthly usage
    const usage = await this.getTransactionUsage(userId);
    const dailyUsed = usage.daily;
    const monthlyUsed = usage.monthly;
    
    // Check limits
    const dailyRemaining = tierLimits.daily - dailyUsed;
    const monthlyRemaining = tierLimits.monthly - monthlyUsed;
    const transactionAllowed = usdAmount <= Math.min(dailyRemaining, monthlyRemaining);
    
    // Risk assessment (simplified VASP approach)
    const riskLevel = this.assessRiskLevel(user, usdAmount, transactionType);
    
    // Large transaction warnings (VASP requirement)
    let requiresKYC = false;
    if (usdAmount > 10000 && userTier === 'unverified') {
      requiresKYC = true;
    }
    if (usdAmount > 100000 && userTier === 'email_verified') {
      requiresKYC = true;
    }

    return {
      approved: transactionAllowed && !requiresKYC,
      requiresKYC,
      riskLevel,
      limits: {
        daily: tierLimits.daily.toString(),
        monthly: tierLimits.monthly.toString(),
        remaining: Math.min(dailyRemaining, monthlyRemaining).toString()
      },
      reason: !transactionAllowed ? "Transaction exceeds limits" : undefined
    };
  }

  // Minimal KYC verification (VASP compliant)
  async verifyUser(userId: string, verificationType: 'email' | 'phone' | 'document'): Promise<{ success: boolean; newTier: string }> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return { success: false, newTier: 'unverified' };
    }

    let newKycLevel = user.kycLevel || 0;
    let newKycStatus = user.kycStatus || 'none';

    switch (verificationType) {
      case 'email':
        newKycLevel = Math.max(newKycLevel, 1);
        newKycStatus = 'basic';
        break;
      case 'phone':
        newKycLevel = Math.max(newKycLevel, 2);
        newKycStatus = 'enhanced';
        break;
      case 'document':
        newKycLevel = Math.max(newKycLevel, 3);
        newKycStatus = 'complete';
        break;
    }

    // Update user verification
    await db.update(users)
      .set({
        kycLevel: newKycLevel,
        kycStatus: newKycStatus,
        emailVerified: verificationType === 'email' ? true : user.emailVerified,
        phoneVerified: verificationType === 'phone' ? true : user.phoneVerified
      })
      .where(eq(users.id, userId));

    const newTier = this.getTierFromKycLevel(newKycLevel);
    return { success: true, newTier };
  }

  // Auto-approve low-risk transactions (VASP efficient processing)
  async autoApproveTransaction(userId: string, amount: string, currency: string): Promise<boolean> {
    const usdAmount = await this.convertToUSD(amount, currency);
    
    // Auto-approve small transactions under $1,000
    if (usdAmount < 1000) {
      return true;
    }

    // Auto-approve medium transactions for verified users
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, userId));

    if (user && user.emailVerified && usdAmount < 10000) {
      return true;
    }

    return false;
  }

  // Travel Rule compliance (VASP requirement for >$1000 transfers)
  async checkTravelRule(amount: string, currency: string, destination?: string): Promise<{ required: boolean; threshold: number }> {
    const usdAmount = await this.convertToUSD(amount, currency);
    const threshold = 1000; // $1,000 USD threshold for travel rule
    
    return {
      required: usdAmount >= threshold,
      threshold
    };
  }

  // Sanctions screening (basic implementation)
  async screenForSanctions(userId: string, address?: string): Promise<{ flagged: boolean; reason?: string }> {
    // Basic sanctions check - in production, integrate with OFAC/EU lists
    const sanctionedAddresses = new Set([
      '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Example sanctioned address
      '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy'  // Example sanctioned address
    ]);

    if (address && sanctionedAddresses.has(address)) {
      return { flagged: true, reason: "Address on sanctions list" };
    }

    // Check user against basic watchlist (simplified)
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, userId));

    if (user?.email?.includes('sanctioned.example.com')) {
      return { flagged: true, reason: "User domain flagged" };
    }

    return { flagged: false };
  }

  // Generate compliance report
  async generateComplianceReport(startDate: Date, endDate: Date): Promise<any> {
    const totalTransactions = await db.select()
      .from(transactions)
      .where(and(
        gte(transactions.createdAt, startDate),
        lte(transactions.createdAt, endDate)
      ));

    const suspiciousTransactions = totalTransactions.filter(tx => {
      const amount = parseFloat(tx.amount);
      return amount > 10000; // Flag transactions > $10k for review
    });

    return {
      period: { start: startDate, end: endDate },
      totalTransactions: totalTransactions.length,
      suspiciousTransactions: suspiciousTransactions.length,
      complianceRate: ((totalTransactions.length - suspiciousTransactions.length) / totalTransactions.length * 100).toFixed(2),
      largeTransactions: suspiciousTransactions.map(tx => ({
        id: tx.id,
        userId: tx.userId,
        amount: tx.amount,
        currency: tx.currency,
        date: tx.createdAt
      }))
    };
  }

  // Helper methods
  private getUserTier(user: any): keyof typeof this.limits {
    if (user.kycLevel >= 3) return 'full_kyc';
    if (user.phoneVerified) return 'phone_verified';
    if (user.emailVerified) return 'email_verified';
    return 'unverified';
  }

  private getTierFromKycLevel(level: number): string {
    if (level >= 3) return 'full_kyc';
    if (level >= 2) return 'phone_verified';
    if (level >= 1) return 'email_verified';
    return 'unverified';
  }

  private async convertToUSD(amount: string, currency: string): Promise<number> {
    // Simplified conversion - in production, use real exchange rates
    const rates: { [key: string]: number } = {
      'USD': 1,
      'EUR': 1.1,
      'GBP': 1.25,
      'BTC': 45000,
      'ETH': 3000,
      'USDT': 1,
      'USDC': 1
    };

    return parseFloat(amount) * (rates[currency] || 1);
  }

  private assessRiskLevel(user: any, amount: number, type: string): 'low' | 'medium' | 'high' {
    if (amount > 100000) return 'high';
    if (amount > 10000 || type === 'withdrawal') return 'medium';
    return 'low';
  }

  private async getTransactionUsage(userId: string): Promise<{ daily: number; monthly: number }> {
    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const dailyTxs = await db.select()
      .from(transactions)
      .where(and(
        eq(transactions.userId, userId),
        gte(transactions.createdAt, dayStart)
      ));

    const monthlyTxs = await db.select()
      .from(transactions)
      .where(and(
        eq(transactions.userId, userId),
        gte(transactions.createdAt, monthStart)
      ));

    const dailyTotal = dailyTxs.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    const monthlyTotal = monthlyTxs.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    return { daily: dailyTotal, monthly: monthlyTotal };
  }
}

export const vaspCompliance = new VASPComplianceService();