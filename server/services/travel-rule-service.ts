import { storage } from "../storage";

interface TravelRuleInfo {
  originatorName: string;
  originatorAddress: string;
  originatorAccountInfo: string;
  beneficiaryName: string;
  beneficiaryAddress: string;
  beneficiaryAccountInfo: string;
  transactionPurpose: string;
  sourceOfFunds: string;
}

interface TransactionMonitoring {
  transactionId: string;
  userId: string;
  amount: number;
  currency: string;
  type: 'withdrawal' | 'deposit' | 'trade';
  timestamp: Date;
  travelRuleRequired: boolean;
  travelRuleInfo?: TravelRuleInfo;
  riskScore: number;
  flags: string[];
}

class TravelRuleService {
  private readonly TRAVEL_RULE_THRESHOLD = 1000; // $1,000 USD equivalent
  private readonly HIGH_VALUE_THRESHOLD = 3000; // $3,000 USD for enhanced monitoring

  // Check if transaction requires Travel Rule compliance
  async evaluateTransaction(
    userId: string,
    amount: number,
    currency: string,
    type: 'withdrawal' | 'deposit' | 'trade',
    counterpartyInfo?: any
  ): Promise<TransactionMonitoring> {
    const usdAmount = await this.convertToUSD(amount, currency);
    const user = await storage.getUser(userId);
    
    const monitoring: TransactionMonitoring = {
      transactionId: this.generateTransactionId(),
      userId,
      amount: usdAmount,
      currency,
      type,
      timestamp: new Date(),
      travelRuleRequired: usdAmount >= this.TRAVEL_RULE_THRESHOLD,
      riskScore: 0,
      flags: []
    };

    // Calculate risk score
    monitoring.riskScore = await this.calculateRiskScore(user, monitoring, counterpartyInfo);
    
    // Add compliance flags
    monitoring.flags = this.generateComplianceFlags(monitoring, user);

    // Log transaction for compliance
    await this.logTransactionForCompliance(monitoring);

    return monitoring;
  }

  // Collect Travel Rule information
  async collectTravelRuleInfo(
    transactionId: string,
    travelRuleData: TravelRuleInfo
  ): Promise<void> {
    // Validate required fields
    this.validateTravelRuleData(travelRuleData);
    
    // Store Travel Rule information
    await storage.storeTravelRuleInfo(transactionId, travelRuleData);
    
    // Update transaction status
    await storage.updateTransactionComplianceStatus(transactionId, 'travel_rule_complete');
    
    console.log(`[TravelRule] Information collected for transaction: ${transactionId}`);
  }

  // Validate Travel Rule data completeness
  private validateTravelRuleData(data: TravelRuleInfo): void {
    const requiredFields = [
      'originatorName',
      'originatorAddress',
      'beneficiaryName',
      'beneficiaryAddress'
    ];

    for (const field of requiredFields) {
      if (!data[field as keyof TravelRuleInfo]) {
        throw new Error(`Travel Rule validation failed: ${field} is required`);
      }
    }
  }

  // Calculate transaction risk score
  private async calculateRiskScore(
    user: any,
    transaction: TransactionMonitoring,
    counterpartyInfo?: any
  ): Promise<number> {
    let riskScore = 0;

    // User risk factors
    if (!user?.kycLevel || user.kycLevel < 2) riskScore += 2;
    if (user?.countryCode && this.isHighRiskJurisdiction(user.countryCode)) riskScore += 3;
    
    // Transaction risk factors
    if (transaction.amount > this.HIGH_VALUE_THRESHOLD) riskScore += 2;
    if (transaction.type === 'withdrawal') riskScore += 1;
    
    // Counterparty risk (if available)
    if (counterpartyInfo?.isHighRisk) riskScore += 3;
    if (counterpartyInfo?.sanctioned) riskScore += 10;

    // Velocity risk
    const recentTransactions = await this.getRecentTransactions(transaction.userId, 24);
    if (recentTransactions.length > 5) riskScore += 2;

    return Math.min(riskScore, 10); // Cap at 10
  }

  // Generate compliance flags
  private generateComplianceFlags(
    transaction: TransactionMonitoring,
    user: any
  ): string[] {
    const flags: string[] = [];

    if (transaction.amount >= this.TRAVEL_RULE_THRESHOLD) {
      flags.push('TRAVEL_RULE_REQUIRED');
    }

    if (transaction.amount >= this.HIGH_VALUE_THRESHOLD) {
      flags.push('HIGH_VALUE_TRANSACTION');
    }

    if (transaction.riskScore >= 7) {
      flags.push('HIGH_RISK_TRANSACTION');
    }

    if (!user?.kycLevel || user.kycLevel < 2) {
      flags.push('INSUFFICIENT_KYC');
    }

    if (user?.countryCode && this.isHighRiskJurisdiction(user.countryCode)) {
      flags.push('HIGH_RISK_JURISDICTION');
    }

    return flags;
  }

  // Check if jurisdiction is high-risk
  private isHighRiskJurisdiction(countryCode: string): boolean {
    // FATF high-risk and monitored jurisdictions
    const highRiskCountries = [
      'IR', 'KP', 'MM', // High-risk
      'AL', 'BB', 'BF', 'KH', 'CG', 'GI', 'JM', 'JO', 'ML', 'MZ', 'NI', 'PK', 'PA', 'PH', 'SN', 'TZ', 'TR', 'UG', 'AE', 'YE', 'ZW' // Monitored
    ];
    
    return highRiskCountries.includes(countryCode.toUpperCase());
  }

  // Get recent transactions for velocity checking
  private async getRecentTransactions(userId: string, hours: number): Promise<any[]> {
    // Implementation would query recent transactions
    // For now, return empty array
    return [];
  }

  // Convert amount to USD equivalent
  private async convertToUSD(amount: number, currency: string): Promise<number> {
    if (currency === 'USD' || currency === 'USDT' || currency === 'USDC') {
      return amount;
    }

    // In production, use real exchange rates
    const exchangeRates: { [key: string]: number } = {
      'BTC': 45000,
      'ETH': 2800,
      'EUR': 1.1,
      'GBP': 1.3
    };

    return amount * (exchangeRates[currency] || 1);
  }

  // Generate unique transaction ID
  private generateTransactionId(): string {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Log transaction for compliance monitoring
  private async logTransactionForCompliance(monitoring: TransactionMonitoring): Promise<void> {
    try {
      await storage.logSecurityEvent(
        monitoring.userId,
        'transaction_monitoring',
        'Transaction evaluated for compliance',
        {
          transactionId: monitoring.transactionId,
          amount: monitoring.amount,
          currency: monitoring.currency,
          type: monitoring.type,
          travelRuleRequired: monitoring.travelRuleRequired,
          riskScore: monitoring.riskScore,
          flags: monitoring.flags
        }
      );
    } catch (error) {
      console.error('[TravelRule] Error logging transaction:', error);
    }
  }

  // Submit suspicious activity report
  async submitSAR(
    transactionId: string,
    userId: string,
    reason: string,
    details: any
  ): Promise<void> {
    const sarData = {
      transactionId,
      userId,
      reason,
      details,
      timestamp: new Date(),
      reportedBy: 'system'
    };

    // Log SAR submission
    await storage.logSecurityEvent(
      userId,
      'sar_submitted',
      'Suspicious Activity Report submitted',
      sarData
    );

    // In production, submit to regulatory authorities
    console.log(`[TravelRule] SAR submitted for transaction: ${transactionId}`);
  }

  // Generate compliance report
  async generateComplianceReport(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalTransactions: number;
    travelRuleTransactions: number;
    highRiskTransactions: number;
    sarsSubmitted: number;
    jurisdictionBreakdown: { [country: string]: number };
  }> {
    // Implementation would query transaction database
    // For now, return mock data structure
    return {
      totalTransactions: 0,
      travelRuleTransactions: 0,
      highRiskTransactions: 0,
      sarsSubmitted: 0,
      jurisdictionBreakdown: {}
    };
  }
}

export const travelRuleService = new TravelRuleService();