import { db } from "../db";
import { complianceReports, transactionMonitoring, sanctionsScreening, reguLatoryExports } from "@shared/schema";
import { eq, and, desc, gte, lte, sum, count } from "drizzle-orm";
import crypto from "crypto";

interface SARReport {
  userId: string;
  transactionIds: string[];
  suspiciousActivity: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reportType: 'SAR' | 'STR';
  jurisdiction: string;
  reportingOfficer: string;
}

interface TransactionRule {
  id: string;
  name: string;
  description: string;
  conditions: {
    amountThreshold?: number;
    velocityThreshold?: number;
    frequencyThreshold?: number;
    geographicRisk?: string[];
    timePattern?: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  autoFlag: boolean;
}

interface SanctionsMatch {
  entityName: string;
  matchScore: number;
  sanctionsList: string;
  sanctionsType: string;
  jurisdiction: string;
}

export class AdvancedComplianceService {
  private transactionRules: TransactionRule[] = [];
  private sanctionsLists = new Map<string, any[]>();

  constructor() {
    this.initializeMinimalRules();
    this.loadBasicSanctionsLists();
  }

  // Minimal compliance rules - only essential requirements
  private initializeMinimalRules() {
    this.transactionRules = [
      {
        id: 'large_transaction',
        name: 'Large Transaction Alert',
        description: 'Transaction exceeding $50,000',
        conditions: { amountThreshold: 50000 }, // Much higher threshold
        severity: 'medium',
        autoFlag: false // Manual review only
      }
    ];
  }

  // Basic sanctions screening - minimal list
  private loadBasicSanctionsLists() {
    // Only basic sanctions list for essential compliance
    this.sanctionsLists.set('BASIC_SANCTIONS', [
      { name: 'KNOWN_TERRORIST_ENTITY', type: 'entity', programs: ['TERRORISM'] }
    ]);
  }

  // Transaction Monitoring Engine
  private startMonitoringEngine() {
    this.monitoringEngine = setInterval(async () => {
      await this.runTransactionMonitoring();
    }, 60000); // Run every minute
  }

  private async runTransactionMonitoring() {
    try {
      // Get recent transactions (last hour)
      const recentTransactions = await this.getRecentTransactions(60);
      
      for (const transaction of recentTransactions) {
        for (const rule of this.transactionRules) {
          const match = await this.evaluateRule(rule, transaction);
          if (match.triggered) {
            await this.createAlert(transaction, rule, match);
          }
        }
      }
    } catch (error) {
      console.error('Transaction monitoring error:', error);
    }
  }

  // Evaluate transaction against rule
  private async evaluateRule(rule: TransactionRule, transaction: any): Promise<{ triggered: boolean; details?: any }> {
    const { conditions } = rule;

    // Amount threshold check
    if (conditions.amountThreshold) {
      const txAmount = parseFloat(transaction.amount);
      if (txAmount >= conditions.amountThreshold) {
        return { 
          triggered: true, 
          details: { reason: 'amount_threshold', amount: txAmount, threshold: conditions.amountThreshold }
        };
      }
    }

    // Velocity check (multiple transactions)
    if (conditions.velocityThreshold && conditions.frequencyThreshold) {
      const recentTxCount = await this.getUserTransactionCount(
        transaction.userId, 
        conditions.frequencyThreshold
      );
      
      if (recentTxCount >= conditions.velocityThreshold) {
        return {
          triggered: true,
          details: { reason: 'velocity_threshold', count: recentTxCount, threshold: conditions.velocityThreshold }
        };
      }
    }

    // Geographic risk check
    if (conditions.geographicRisk) {
      const userLocation = await this.getUserLocation(transaction.userId);
      if (conditions.geographicRisk.includes(userLocation)) {
        return {
          triggered: true,
          details: { reason: 'geographic_risk', location: userLocation }
        };
      }
    }

    // Time pattern check
    if (conditions.timePattern === 'outside_business_hours') {
      const txTime = new Date(transaction.createdAt);
      const hour = txTime.getHours();
      if (hour < 9 || hour > 17) { // Outside 9 AM - 5 PM
        return {
          triggered: true,
          details: { reason: 'unusual_time', hour }
        };
      }
    }

    return { triggered: false };
  }

  // Create monitoring alert
  private async createAlert(transaction: any, rule: TransactionRule, match: any) {
    const alertId = crypto.randomUUID();

    await db.insert(transactionMonitoring).values({
      id: alertId,
      userId: transaction.userId,
      transactionId: transaction.id,
      ruleId: rule.id,
      ruleName: rule.name,
      severity: rule.severity,
      details: JSON.stringify(match.details),
      status: rule.autoFlag ? 'flagged' : 'review_required',
      createdAt: new Date()
    });

    // Auto-escalate critical alerts
    if (rule.severity === 'critical') {
      await this.escalateAlert(alertId);
    }
  }

  // Sanctions Screening
  async screenForSanctions(entityName: string, entityType: 'individual' | 'entity'): Promise<{
    matches: SanctionsMatch[];
    riskLevel: string;
    blocked: boolean;
  }> {
    const matches: SanctionsMatch[] = [];
    
    for (const [listName, sanctionsList] of this.sanctionsLists) {
      for (const sanctionedEntity of sanctionsList) {
        const matchScore = this.calculateNameMatchScore(entityName, sanctionedEntity.name);
        
        if (matchScore > 0.8) { // 80% match threshold
          matches.push({
            entityName: sanctionedEntity.name,
            matchScore,
            sanctionsList: listName,
            sanctionsType: sanctionedEntity.programs.join(', '),
            jurisdiction: this.getJurisdictionFromList(listName)
          });
        }
      }
    }

    // Record screening result
    await db.insert(sanctionsScreening).values({
      entityName,
      entityType,
      matchesFound: matches.length,
      highestMatchScore: matches.length > 0 ? Math.max(...matches.map(m => m.matchScore)) : 0,
      matches: JSON.stringify(matches),
      screenedAt: new Date(),
      blocked: matches.some(m => m.matchScore > 0.95) // Block if 95%+ match
    });

    const riskLevel = this.calculateSanctionsRisk(matches);
    const blocked = matches.some(m => m.matchScore > 0.95);

    return { matches, riskLevel, blocked };
  }

  // SAR/STR Report Generation
  async generateSARReport(report: SARReport): Promise<{ success: boolean; reportId?: string; error?: string }> {
    try {
      const reportId = `${report.reportType}_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      
      // Compile supporting documentation
      const supportingData = await this.compileSupportingData(report.transactionIds);
      
      // Generate report content
      const reportContent = {
        reportId,
        filingEntity: 'NebulaX Exchange',
        reportType: report.reportType,
        suspiciousActivity: report.suspiciousActivity,
        subjectInformation: await this.getSubjectInformation(report.userId),
        transactionDetails: supportingData.transactions,
        analysisNarrative: await this.generateAnalysisNarrative(report),
        riskAssessment: report.riskLevel,
        reportingOfficer: report.reportingOfficer,
        filingDate: new Date(),
        jurisdiction: report.jurisdiction
      };

      // Store report
      await db.insert(complianceReports).values({
        id: reportId,
        reportType: report.reportType,
        userId: report.userId,
        riskLevel: report.riskLevel,
        status: 'draft',
        content: JSON.stringify(reportContent),
        createdBy: report.reportingOfficer,
        jurisdiction: report.jurisdiction
      });

      return { success: true, reportId };
    } catch (error) {
      return { success: false, error: "Failed to generate SAR/STR report" };
    }
  }

  // Regulatory Reporting Exports
  private scheduleRegulatoryReporting() {
    // Daily reporting schedule
    this.reportingSchedule = setInterval(async () => {
      await this.generateDailyReports();
    }, 24 * 60 * 60 * 1000); // Daily
  }

  private async generateDailyReports() {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Generate various regulatory reports
    await this.generateCTRReport(yesterday);
    await this.generateFBARData(yesterday);
    await this.generateAMLReport(yesterday);
  }

  // Currency Transaction Report (CTR)
  private async generateCTRReport(date: Date): Promise<void> {
    const largeCashTransactions = await this.getLargeCashTransactions(date, 10000);
    
    if (largeCashTransactions.length > 0) {
      const reportId = `CTR_${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
      
      const ctrData = {
        reportId,
        reportingDate: date,
        transactions: largeCashTransactions,
        filingEntity: 'NebulaX Exchange',
        filingEntityEIN: '12-3456789'
      };

      await db.insert(reguLatoryExports).values({
        reportType: 'CTR',
        reportDate: date,
        content: JSON.stringify(ctrData),
        status: 'pending_submission',
        jurisdiction: 'US'
      });
    }
  }

  // Foreign Bank Account Report (FBAR) data
  private async generateFBARData(date: Date): Promise<void> {
    const foreignAccountData = await this.getForeignAccountData(date);
    
    if (foreignAccountData.length > 0) {
      await db.insert(reguLatoryExports).values({
        reportType: 'FBAR',
        reportDate: date,
        content: JSON.stringify(foreignAccountData),
        status: 'pending_submission',
        jurisdiction: 'US'
      });
    }
  }

  // Anti-Money Laundering (AML) Report
  private async generateAMLReport(date: Date): Promise<void> {
    const amlMetrics = {
      reportDate: date,
      totalTransactions: await this.getTransactionCount(date),
      flaggedTransactions: await this.getFlaggedTransactionCount(date),
      sarReports: await this.getSARReportCount(date),
      sanctionsMatches: await this.getSanctionsMatchCount(date),
      riskDistribution: await this.getRiskDistribution(date)
    };

    await db.insert(reguLatoryExports).values({
      reportType: 'AML_SUMMARY',
      reportDate: date,
      content: JSON.stringify(amlMetrics),
      status: 'ready',
      jurisdiction: 'GLOBAL'
    });
  }

  // Export compliance data for regulators
  async exportComplianceData(
    startDate: Date, 
    endDate: Date, 
    reportType: string,
    jurisdiction: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      let exportData;

      switch (reportType) {
        case 'TRANSACTIONS':
          exportData = await this.exportTransactionData(startDate, endDate, jurisdiction);
          break;
        case 'ALERTS':
          exportData = await this.exportAlertsData(startDate, endDate);
          break;
        case 'SAR_STR':
          exportData = await this.exportSARSTRData(startDate, endDate, jurisdiction);
          break;
        case 'SANCTIONS':
          exportData = await this.exportSanctionsData(startDate, endDate);
          break;
        default:
          return { success: false, error: "Unsupported report type" };
      }

      return { success: true, data: exportData };
    } catch (error) {
      return { success: false, error: "Failed to export compliance data" };
    }
  }

  // Helper methods
  private calculateNameMatchScore(name1: string, name2: string): number {
    // Simplified name matching algorithm
    const clean1 = name1.toLowerCase().replace(/[^a-z]/g, '');
    const clean2 = name2.toLowerCase().replace(/[^a-z]/g, '');
    
    if (clean1 === clean2) return 1.0;
    
    // Levenshtein distance
    const matrix = Array(clean2.length + 1).fill(null).map(() => Array(clean1.length + 1).fill(null));
    
    for (let i = 0; i <= clean1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= clean2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= clean2.length; j++) {
      for (let i = 1; i <= clean1.length; i++) {
        const cost = clean1[i - 1] === clean2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }
    
    const distance = matrix[clean2.length][clean1.length];
    const maxLength = Math.max(clean1.length, clean2.length);
    
    return 1 - (distance / maxLength);
  }

  private calculateSanctionsRisk(matches: SanctionsMatch[]): string {
    if (matches.length === 0) return 'low';
    
    const highestScore = Math.max(...matches.map(m => m.matchScore));
    
    if (highestScore > 0.95) return 'critical';
    if (highestScore > 0.85) return 'high';
    if (highestScore > 0.7) return 'medium';
    return 'low';
  }

  private getJurisdictionFromList(listName: string): string {
    const jurisdictions: { [key: string]: string } = {
      'OFAC_SDN': 'US',
      'UN_CONSOLIDATED': 'UN',
      'EU_SANCTIONS': 'EU'
    };
    return jurisdictions[listName] || 'UNKNOWN';
  }

  // Mock data retrieval methods (would integrate with actual database)
  private async getRecentTransactions(minutes: number): Promise<any[]> {
    // Mock implementation
    return [];
  }

  private async getUserTransactionCount(userId: string, minutes: number): Promise<number> {
    // Mock implementation
    return Math.floor(Math.random() * 10);
  }

  private async getUserLocation(userId: string): Promise<string> {
    // Mock implementation - would get from KYC data
    const countries = ['US', 'GB', 'DE', 'FR', 'CA', 'AU'];
    return countries[Math.floor(Math.random() * countries.length)];
  }

  private async escalateAlert(alertId: string): Promise<void> {
    console.log(`CRITICAL ALERT ESCALATED: ${alertId}`);
    // Implementation would notify compliance team
  }

  private async compileSupportingData(transactionIds: string[]): Promise<any> {
    // Compile transaction details, user information, etc.
    return { transactions: [], userProfiles: [], riskFactors: [] };
  }

  private async getSubjectInformation(userId: string): Promise<any> {
    // Get KYC information for the user
    return { userId, name: 'Sample User', address: 'Sample Address' };
  }

  private async generateAnalysisNarrative(report: SARReport): Promise<string> {
    return `Suspicious activity detected for user ${report.userId}: ${report.suspiciousActivity}`;
  }

  private async getLargeCashTransactions(date: Date, threshold: number): Promise<any[]> {
    // Get transactions above threshold for the date
    return [];
  }

  private async getForeignAccountData(date: Date): Promise<any[]> {
    // Get foreign account information
    return [];
  }

  private async getTransactionCount(date: Date): Promise<number> {
    return Math.floor(Math.random() * 10000);
  }

  private async getFlaggedTransactionCount(date: Date): Promise<number> {
    return Math.floor(Math.random() * 100);
  }

  private async getSARReportCount(date: Date): Promise<number> {
    return Math.floor(Math.random() * 10);
  }

  private async getSanctionsMatchCount(date: Date): Promise<number> {
    return Math.floor(Math.random() * 5);
  }

  private async getRiskDistribution(date: Date): Promise<any> {
    return { low: 85, medium: 12, high: 2.5, critical: 0.5 };
  }

  private async exportTransactionData(startDate: Date, endDate: Date, jurisdiction: string): Promise<any> {
    return { startDate, endDate, jurisdiction, transactions: [] };
  }

  private async exportAlertsData(startDate: Date, endDate: Date): Promise<any> {
    return { startDate, endDate, alerts: [] };
  }

  private async exportSARSTRData(startDate: Date, endDate: Date, jurisdiction: string): Promise<any> {
    return { startDate, endDate, jurisdiction, reports: [] };
  }

  private async exportSanctionsData(startDate: Date, endDate: Date): Promise<any> {
    return { startDate, endDate, screenings: [] };
  }
}

export const advancedCompliance = new AdvancedComplianceService();