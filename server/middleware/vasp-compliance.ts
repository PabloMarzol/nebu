import { Request, Response, NextFunction } from "express";
import { travelRuleService } from "../services/travel-rule-service";
import { storage } from "../storage";

// VASP compliance middleware for transactions
export const vaspComplianceCheck = (transactionType: 'withdrawal' | 'deposit' | 'trade') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const { amount, currency, symbol } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Extract amount and currency based on transaction type
      let transactionAmount = 0;
      let transactionCurrency = 'USD';

      if (transactionType === 'trade' && symbol && amount) {
        // For trading, use quote currency amount
        const [base, quote] = symbol.split('/');
        transactionAmount = parseFloat(amount) * (parseFloat(req.body.price) || 0);
        transactionCurrency = quote;
      } else if (amount && currency) {
        transactionAmount = parseFloat(amount);
        transactionCurrency = currency;
      }

      // Evaluate transaction for VASP compliance
      const monitoring = await travelRuleService.evaluateTransaction(
        userId,
        transactionAmount,
        transactionCurrency,
        transactionType
      );

      // Check if Travel Rule applies
      if (monitoring.travelRuleRequired) {
        // Check if Travel Rule info already provided
        const hasTravelRuleInfo = req.body.travelRuleInfo;
        
        if (!hasTravelRuleInfo) {
          return res.status(400).json({
            message: "Travel Rule information required for transactions over $1,000",
            code: "TRAVEL_RULE_REQUIRED",
            transactionId: monitoring.transactionId,
            requiredFields: [
              "originatorName",
              "originatorAddress", 
              "beneficiaryName",
              "beneficiaryAddress",
              "transactionPurpose"
            ]
          });
        }

        // Validate and store Travel Rule information
        try {
          await travelRuleService.collectTravelRuleInfo(
            monitoring.transactionId,
            req.body.travelRuleInfo
          );
        } catch (error) {
          return res.status(400).json({
            message: "Invalid Travel Rule information",
            error: error.message
          });
        }
      }

      // Check risk score
      if (monitoring.riskScore >= 8) {
        // Flag for manual review
        await storage.logSecurityEvent(
          userId,
          'high_risk_transaction',
          'Transaction flagged for manual review',
          {
            transactionId: monitoring.transactionId,
            riskScore: monitoring.riskScore,
            flags: monitoring.flags
          }
        );

        return res.status(400).json({
          message: "Transaction requires manual review",
          code: "MANUAL_REVIEW_REQUIRED",
          transactionId: monitoring.transactionId
        });
      }

      // Attach monitoring info to request for downstream processing
      req.complianceInfo = monitoring;
      next();

    } catch (error) {
      console.error('[VASP] Compliance check error:', error);
      res.status(500).json({ message: "Compliance verification failed" });
    }
  };
};

// Enhanced KYC verification for VASP compliance
export const enhancedKycCheck = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check KYC status
    if (!user.kycLevel || user.kycLevel < 1) {
      return res.status(403).json({
        message: "Identity verification required for VASP compliance",
        code: "KYC_REQUIRED",
        requiredDocuments: [
          "Government-issued photo ID",
          "Proof of address (utility bill or bank statement)"
        ]
      });
    }

    // Check KYC expiration (annual renewal requirement)
    const kycDate = new Date(user.kycVerifiedAt || 0);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    if (kycDate < oneYearAgo) {
      return res.status(403).json({
        message: "KYC verification expired - annual renewal required",
        code: "KYC_EXPIRED",
        lastVerified: user.kycVerifiedAt
      });
    }

    // Check sanctions screening status
    if (user.sanctionsScreening !== 'clear') {
      return res.status(403).json({
        message: "Account under compliance review",
        code: "SANCTIONS_REVIEW"
      });
    }

    next();
  } catch (error) {
    console.error('[VASP] Enhanced KYC check error:', error);
    res.status(500).json({ message: "KYC verification failed" });
  }
};

// PEP (Politically Exposed Person) screening
export const pepScreening = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) return next();

    // Check if user is flagged as PEP
    if (user.pepStatus === 'confirmed') {
      // Enhanced monitoring required
      await storage.logSecurityEvent(
        user.id,
        'pep_transaction',
        'Transaction by Politically Exposed Person',
        {
          pepLevel: user.pepLevel,
          transactionType: req.method + ' ' + req.path
        }
      );
    }

    next();
  } catch (error) {
    console.error('[VASP] PEP screening error:', error);
    next(); // Don't block transaction on screening error
  }
};

// Transaction limits enforcement
export const transactionLimitsCheck = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { amount, currency } = req.body;

    if (!user || !amount) return next();

    // Get user's daily and monthly limits
    const limits = await getUserTransactionLimits(user);
    const usdAmount = await convertToUSD(parseFloat(amount), currency || 'USD');

    // Check daily limit
    const todayTransactions = await getTodayTransactionVolume(user.id);
    if (todayTransactions + usdAmount > limits.dailyLimit) {
      return res.status(400).json({
        message: "Daily transaction limit exceeded",
        code: "DAILY_LIMIT_EXCEEDED",
        limit: limits.dailyLimit,
        used: todayTransactions,
        requested: usdAmount
      });
    }

    // Check monthly limit
    const monthTransactions = await getMonthTransactionVolume(user.id);
    if (monthTransactions + usdAmount > limits.monthlyLimit) {
      return res.status(400).json({
        message: "Monthly transaction limit exceeded", 
        code: "MONTHLY_LIMIT_EXCEEDED",
        limit: limits.monthlyLimit,
        used: monthTransactions,
        requested: usdAmount
      });
    }

    next();
  } catch (error) {
    console.error('[VASP] Transaction limits check error:', error);
    next(); // Don't block on limit check error
  }
};

// Helper functions
async function getUserTransactionLimits(user: any): Promise<{
  dailyLimit: number;
  monthlyLimit: number;
}> {
  const kycLevel = user.kycLevel || 0;
  
  const limits = {
    0: { dailyLimit: 500, monthlyLimit: 2000 },      // Trial
    1: { dailyLimit: 3000, monthlyLimit: 15000 },    // Basic VASP
    2: { dailyLimit: 25000, monthlyLimit: 100000 },  // Enhanced
    3: { dailyLimit: 500000, monthlyLimit: 2000000 } // Institutional
  };

  return limits[kycLevel as keyof typeof limits] || limits[0];
}

async function convertToUSD(amount: number, currency: string): Promise<number> {
  if (currency === 'USD' || currency === 'USDT' || currency === 'USDC') {
    return amount;
  }

  // Simplified conversion - in production use real rates
  const rates: { [key: string]: number } = {
    'BTC': 45000,
    'ETH': 2800,
    'EUR': 1.1,
    'GBP': 1.3
  };

  return amount * (rates[currency] || 1);
}

async function getTodayTransactionVolume(userId: string): Promise<number> {
  // Implementation would query transaction history for today
  return 0;
}

async function getMonthTransactionVolume(userId: string): Promise<number> {
  // Implementation would query transaction history for current month
  return 0;
}

// Extend Request interface
declare global {
  namespace Express {
    interface Request {
      complianceInfo?: any;
    }
  }
}