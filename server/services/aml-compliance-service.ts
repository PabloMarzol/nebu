import { auditLoggingService } from './audit-logging-service';
import { storage } from '../storage';

interface TransactionMonitor {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'trade' | 'transfer';
  amount: number;
  currency: string;
  fromAddress?: string;
  toAddress?: string;
  status: 'pending' | 'monitoring' | 'approved' | 'flagged' | 'blocked';
  riskScore: number;
  flags: string[];
  timestamp: Date;
  blockchainTxId?: string;
  counterparty?: string;
}

interface AMLAlert {
  id: string;
  userId: string;
  alertType: 'structuring' | 'velocity' | 'high_value' | 'sanctions' | 'pep' | 'unusual_pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  triggerAmount?: number;
  timeWindow?: string;
  relatedTransactions: string[];
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
  notes: string[];
  createdAt: Date;
  resolvedAt?: Date;
}

interface ComplianceRule {
  id: string;
  name: string;
  type: 'threshold' | 'velocity' | 'pattern' | 'sanctions' | 'geography';
  enabled: boolean;
  parameters: {
    amount?: number;
    timeWindow?: number;
    frequency?: number;
    countries?: string[];
    patterns?: string[];
  };
  action: 'flag' | 'block' | 'review' | 'report';
  priority: number;
}

interface SARReport {
  id: string;
  userId: string;
  reportType: 'SAR' | 'CTR' | 'FBAR' | 'OFAC';
  amount: number;
  currency: string;
  description: string;
  suspiciousActivity: string[];
  relatedTransactions: string[];
  status: 'draft' | 'submitted' | 'acknowledged';
  filingDate: Date;
  dueDate: Date;
  submittedTo?: string;
}

class AMLComplianceService {
  private transactions: Map<string, TransactionMonitor> = new Map();
  private alerts: AMLAlert[] = [];
  private rules: ComplianceRule[] = [];
  private reports: SARReport[] = [];
  private watchlists: {
    sanctions: Set<string>;
    pep: Set<string>;
    countries: Set<string>;
  } = {
    sanctions: new Set(),
    pep: new Set(),
    countries: new Set(['IR', 'KP', 'SY', 'MM']) // Example sanctioned countries
  };

  constructor() {
    this.initializeComplianceRules();
    this.loadWatchlists();
    this.startComplianceMonitoring();
  }

  // Initialize default compliance rules
  private initializeComplianceRules(): void {
    this.rules = [
      {
        id: 'rule_001',
        name: 'High Value Transaction Threshold',
        type: 'threshold',
        enabled: true,
        parameters: { amount: 10000 },
        action: 'flag',
        priority: 1
      },
      {
        id: 'rule_002',
        name: 'Rapid Transaction Velocity',
        type: 'velocity',
        enabled: true,
        parameters: { amount: 5000, timeWindow: 3600, frequency: 5 }, // 5 transactions of $5k+ in 1 hour
        action: 'flag',
        priority: 2
      },
      {
        id: 'rule_003',
        name: 'Structuring Detection',
        type: 'pattern',
        enabled: true,
        parameters: { amount: 9000, timeWindow: 86400, frequency: 3 }, // 3+ transactions just under $10k in 24h
        action: 'flag',
        priority: 1
      },
      {
        id: 'rule_004',
        name: 'Sanctions Screening',
        type: 'sanctions',
        enabled: true,
        parameters: {},
        action: 'block',
        priority: 0
      },
      {
        id: 'rule_005',
        name: 'PEP Monitoring',
        type: 'sanctions',
        enabled: true,
        parameters: {},
        action: 'review',
        priority: 1
      }
    ];
  }

  // Load watchlists (in production, these would come from OFAC, UN, etc.)
  private loadWatchlists(): void {
    // Example sanctioned entities (in production, load from official sources)
    this.watchlists.sanctions.add('1234567890abcdef'); // Example address
    this.watchlists.pep.add('politically_exposed_person_id');
    
    console.log('[AMLCompliance] Watchlists loaded');
  }

  // Monitor transaction for AML compliance
  async monitorTransaction(
    userId: string,
    type: TransactionMonitor['type'],
    amount: number,
    currency: string,
    details: {
      fromAddress?: string;
      toAddress?: string;
      blockchainTxId?: string;
      counterparty?: string;
      ipAddress?: string;
    }
  ): Promise<TransactionMonitor> {
    const transaction: TransactionMonitor = {
      id: this.generateTransactionId(),
      userId,
      type,
      amount,
      currency,
      fromAddress: details.fromAddress,
      toAddress: details.toAddress,
      status: 'monitoring',
      riskScore: 0,
      flags: [],
      timestamp: new Date(),
      blockchainTxId: details.blockchainTxId,
      counterparty: details.counterparty
    };

    // Run compliance checks
    await this.runComplianceChecks(transaction);
    
    // Store transaction
    this.transactions.set(transaction.id, transaction);
    
    // Log for audit
    await auditLoggingService.logCompliance(
      'transaction_monitored',
      userId,
      details.ipAddress || 'system',
      {
        transactionId: transaction.id,
        type,
        amount,
        currency,
        riskScore: transaction.riskScore,
        flags: transaction.flags,
        status: transaction.status
      }
    );

    console.log(`[AMLCompliance] Monitored transaction ${transaction.id}: ${transaction.status} (Risk: ${transaction.riskScore})`);
    return transaction;
  }

  // Run compliance checks on transaction
  private async runComplianceChecks(transaction: TransactionMonitor): Promise<void> {
    let riskScore = 0;
    const flags: string[] = [];

    // Check each compliance rule
    for (const rule of this.rules.filter(r => r.enabled)) {
      const ruleResult = await this.evaluateRule(rule, transaction);
      
      if (ruleResult.triggered) {
        riskScore += ruleResult.riskPoints || 10;
        flags.push(...ruleResult.flags);
        
        // Take action based on rule
        if (rule.action === 'block') {
          transaction.status = 'blocked';
        } else if (rule.action === 'flag' && transaction.status !== 'blocked') {
          transaction.status = 'flagged';
        }

        // Create alert if significant
        if (rule.priority <= 1) {
          await this.createAMLAlert(transaction, rule, ruleResult);
        }
      }
    }

    transaction.riskScore = riskScore;
    transaction.flags = flags;

    // Approve if no issues found
    if (transaction.status === 'monitoring' && riskScore < 30) {
      transaction.status = 'approved';
    }
  }

  // Evaluate individual compliance rule
  private async evaluateRule(rule: ComplianceRule, transaction: TransactionMonitor): Promise<{
    triggered: boolean;
    riskPoints?: number;
    flags: string[];
    details?: any;
  }> {
    const flags: string[] = [];
    let triggered = false;
    let riskPoints = 0;

    switch (rule.type) {
      case 'threshold':
        if (rule.parameters.amount && transaction.amount >= rule.parameters.amount) {
          triggered = true;
          riskPoints = 15;
          flags.push(`High value transaction: $${transaction.amount}`);
        }
        break;

      case 'velocity':
        const velocityCheck = await this.checkVelocity(transaction, rule.parameters);
        if (velocityCheck.triggered) {
          triggered = true;
          riskPoints = 25;
          flags.push(`High velocity: ${velocityCheck.count} transactions in ${rule.parameters.timeWindow}s`);
        }
        break;

      case 'pattern':
        const patternCheck = await this.checkStructuring(transaction, rule.parameters);
        if (patternCheck.triggered) {
          triggered = true;
          riskPoints = 30;
          flags.push(`Potential structuring: ${patternCheck.count} transactions near threshold`);
        }
        break;

      case 'sanctions':
        const sanctionsCheck = this.checkSanctions(transaction);
        if (sanctionsCheck.triggered) {
          triggered = true;
          riskPoints = 100;
          flags.push(`Sanctions match: ${sanctionsCheck.reason}`);
        }
        break;
    }

    return { triggered, riskPoints, flags };
  }

  // Check transaction velocity
  private async checkVelocity(transaction: TransactionMonitor, params: any): Promise<{
    triggered: boolean;
    count: number;
  }> {
    const timeWindow = params.timeWindow || 3600; // 1 hour default
    const threshold = params.frequency || 5;
    const amountThreshold = params.amount || 1000;
    
    const cutoff = new Date(transaction.timestamp.getTime() - timeWindow * 1000);
    
    const recentTransactions = Array.from(this.transactions.values())
      .filter(tx => 
        tx.userId === transaction.userId &&
        tx.timestamp >= cutoff &&
        tx.amount >= amountThreshold
      );

    return {
      triggered: recentTransactions.length >= threshold,
      count: recentTransactions.length + 1 // Include current transaction
    };
  }

  // Check for structuring patterns
  private async checkStructuring(transaction: TransactionMonitor, params: any): Promise<{
    triggered: boolean;
    count: number;
  }> {
    const timeWindow = params.timeWindow || 86400; // 24 hours default
    const threshold = params.frequency || 3;
    const amountThreshold = params.amount || 9000;
    
    const cutoff = new Date(transaction.timestamp.getTime() - timeWindow * 1000);
    
    const suspiciousTransactions = Array.from(this.transactions.values())
      .filter(tx => 
        tx.userId === transaction.userId &&
        tx.timestamp >= cutoff &&
        tx.amount >= amountThreshold &&
        tx.amount < 10000 // Just under reporting threshold
      );

    return {
      triggered: suspiciousTransactions.length >= threshold,
      count: suspiciousTransactions.length + 1
    };
  }

  // Check against sanctions lists
  private checkSanctions(transaction: TransactionMonitor): {
    triggered: boolean;
    reason?: string;
  } {
    // Check addresses against sanctions list
    if (transaction.fromAddress && this.watchlists.sanctions.has(transaction.fromAddress)) {
      return { triggered: true, reason: `Sanctioned source address: ${transaction.fromAddress}` };
    }
    
    if (transaction.toAddress && this.watchlists.sanctions.has(transaction.toAddress)) {
      return { triggered: true, reason: `Sanctioned destination address: ${transaction.toAddress}` };
    }

    // Check user against PEP list
    if (this.watchlists.pep.has(transaction.userId)) {
      return { triggered: true, reason: 'Politically Exposed Person (PEP)' };
    }

    return { triggered: false };
  }

  // Create AML alert
  private async createAMLAlert(
    transaction: TransactionMonitor,
    rule: ComplianceRule,
    ruleResult: any
  ): Promise<void> {
    const alert: AMLAlert = {
      id: this.generateAlertId(),
      userId: transaction.userId,
      alertType: this.mapRuleToAlertType(rule),
      severity: this.calculateSeverity(transaction.riskScore, rule.priority),
      description: `${rule.name}: ${ruleResult.flags.join(', ')}`,
      triggerAmount: transaction.amount,
      relatedTransactions: [transaction.id],
      status: 'open',
      notes: [],
      createdAt: new Date()
    };

    this.alerts.push(alert);
    
    // Keep only last 1000 alerts
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000);
    }

    // Auto-generate SAR if critical
    if (alert.severity === 'critical') {
      await this.generateSAR(alert, transaction);
    }

    console.log(`[AMLAlert] ${alert.severity.toUpperCase()} - ${alert.alertType}: User ${transaction.userId}`);
  }

  // Generate Suspicious Activity Report
  private async generateSAR(alert: AMLAlert, transaction: TransactionMonitor): Promise<void> {
    const report: SARReport = {
      id: this.generateReportId(),
      userId: transaction.userId,
      reportType: 'SAR',
      amount: transaction.amount,
      currency: transaction.currency,
      description: alert.description,
      suspiciousActivity: transaction.flags,
      relatedTransactions: [transaction.id],
      status: 'draft',
      filingDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days to file
    };

    this.reports.push(report);
    
    await auditLoggingService.logCompliance(
      'report_generated',
      transaction.userId,
      'system',
      {
        reportId: report.id,
        reportType: report.reportType,
        alert: alert.id,
        transaction: transaction.id
      }
    );

    console.log(`[AMLCompliance] Generated SAR report ${report.id} for user ${transaction.userId}`);
  }

  // Get transaction status
  getTransactionStatus(transactionId: string): TransactionMonitor | undefined {
    return this.transactions.get(transactionId);
  }

  // Get AML alerts for user
  getUserAMLAlerts(userId: string): AMLAlert[] {
    return this.alerts
      .filter(alert => alert.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Get all pending alerts
  getPendingAlerts(): AMLAlert[] {
    return this.alerts
      .filter(alert => alert.status === 'open')
      .sort((a, b) => {
        // Sort by severity first, then by creation date
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
        if (severityDiff !== 0) return severityDiff;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }

  // Update alert status
  updateAlertStatus(
    alertId: string,
    status: AMLAlert['status'],
    assignedTo?: string,
    note?: string
  ): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) return false;

    alert.status = status;
    if (assignedTo) alert.assignedTo = assignedTo;
    if (note) alert.notes.push(`${new Date().toISOString()}: ${note}`);
    if (status === 'resolved') alert.resolvedAt = new Date();

    return true;
  }

  // Get compliance statistics
  getComplianceStats(): {
    totalTransactions: number;
    transactionsByStatus: Record<string, number>;
    alertsByType: Record<string, number>;
    alertsBySeverity: Record<string, number>;
    recentAlerts: AMLAlert[];
    pendingReports: number;
    riskDistribution: { range: string; count: number }[];
  } {
    const transactionsByStatus: Record<string, number> = {};
    const alertsByType: Record<string, number> = {};
    const alertsBySeverity: Record<string, number> = {};
    const riskDistribution = [
      { range: '0-10', count: 0 },
      { range: '11-30', count: 0 },
      { range: '31-60', count: 0 },
      { range: '61-100', count: 0 },
      { range: '100+', count: 0 }
    ];

    Array.from(this.transactions.values()).forEach(tx => {
      transactionsByStatus[tx.status] = (transactionsByStatus[tx.status] || 0) + 1;
      
      if (tx.riskScore <= 10) riskDistribution[0].count++;
      else if (tx.riskScore <= 30) riskDistribution[1].count++;
      else if (tx.riskScore <= 60) riskDistribution[2].count++;
      else if (tx.riskScore <= 100) riskDistribution[3].count++;
      else riskDistribution[4].count++;
    });

    this.alerts.forEach(alert => {
      alertsByType[alert.alertType] = (alertsByType[alert.alertType] || 0) + 1;
      alertsBySeverity[alert.severity] = (alertsBySeverity[alert.severity] || 0) + 1;
    });

    const recentAlerts = this.alerts
      .filter(alert => Date.now() - alert.createdAt.getTime() < 24 * 60 * 60 * 1000)
      .slice(-20);

    const pendingReports = this.reports.filter(r => r.status === 'draft').length;

    return {
      totalTransactions: this.transactions.size,
      transactionsByStatus,
      alertsByType,
      alertsBySeverity,
      recentAlerts,
      pendingReports,
      riskDistribution
    };
  }

  // Helper methods
  private mapRuleToAlertType(rule: ComplianceRule): AMLAlert['alertType'] {
    const mapping: Record<string, AMLAlert['alertType']> = {
      'threshold': 'high_value',
      'velocity': 'velocity',
      'pattern': 'structuring',
      'sanctions': 'sanctions'
    };
    return mapping[rule.type] || 'unusual_pattern';
  }

  private calculateSeverity(riskScore: number, priority: number): AMLAlert['severity'] {
    if (riskScore >= 100 || priority === 0) return 'critical';
    if (riskScore >= 60 || priority === 1) return 'high';
    if (riskScore >= 30) return 'medium';
    return 'low';
  }

  private generateTransactionId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReportId(): string {
    return `sar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Start compliance monitoring
  private startComplianceMonitoring(): void {
    // Update watchlists daily
    setInterval(() => {
      this.loadWatchlists();
    }, 24 * 60 * 60 * 1000);

    console.log('[AMLCompliance] Compliance monitoring started');
  }
}

export const amlComplianceService = new AMLComplianceService();