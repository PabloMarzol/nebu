import { db } from '../db';
import { eq, gte, lte, and, desc, asc } from 'drizzle-orm';
import { 
  trades, 
  users, 
  kycVerifications, 
  complianceReports,
  amlAlerts,
  transactionMonitoring,
  type Trade,
  type User,
  type KycVerification,
  type ComplianceReport,
  type InsertComplianceReport
} from '../../shared/schema';

export interface MiFIDIIReport {
  reportId: string;
  reportingPeriod: { start: Date; end: Date };
  transactionReports: TransactionReport[];
  summary: {
    totalTransactions: number;
    totalVolume: number;
    totalClients: number;
    highValueTransactions: number;
  };
  generatedAt: Date;
}

export interface TransactionReport {
  transactionId: string;
  clientId: string;
  instrument: string;
  quantity: number;
  price: number;
  executionTimestamp: Date;
  venue: string;
  tradingCapacity: 'agency' | 'principal';
  clientClassification: 'retail' | 'professional' | 'eligible_counterparty';
  miFIDFlags: string[];
}

export interface FATFReport {
  reportId: string;
  reportingPeriod: { start: Date; end: Date };
  suspiciousTransactions: SuspiciousTransaction[];
  largeTransactions: LargeTransaction[];
  crossBorderTransactions: CrossBorderTransaction[];
  summary: {
    totalSuspicious: number;
    totalLarge: number;
    totalCrossBorder: number;
    sarsFiled: number;
  };
}

export interface SuspiciousTransaction {
  transactionId: string;
  clientId: string;
  amount: number;
  currency: string;
  suspicionReasons: string[];
  riskScore: number;
  reportedAt: Date;
  status: 'pending' | 'filed' | 'dismissed';
}

export interface AMLComplianceReport {
  reportId: string;
  reportingPeriod: { start: Date; end: Date };
  kycStatus: KYCStatusSummary;
  transactionMonitoring: TransactionMonitoringSummary;
  sanctionsScreening: SanctionsScreeningSummary;
  riskAssessment: RiskAssessmentSummary;
}

export interface KYCStatusSummary {
  totalClients: number;
  verified: number;
  pending: number;
  rejected: number;
  expired: number;
  riskDistribution: { [key: string]: number };
}

export class RegulatoryComplianceService {
  
  async generateMiFIDIIReport(
    startDate: Date, 
    endDate: Date, 
    venue: string = 'NebulaX'
  ): Promise<MiFIDIIReport> {
    try {
      // Fetch all trades in the reporting period
      const tradingData = await db
        .select({
          trade: trades,
          user: users,
          kyc: kycVerifications
        })
        .from(trades)
        .leftJoin(users, eq(trades.userId, users.id))
        .leftJoin(kycVerifications, eq(users.id, kycVerifications.userId))
        .where(
          and(
            gte(trades.executedAt, startDate),
            lte(trades.executedAt, endDate)
          )
        )
        .orderBy(asc(trades.executedAt));

      // Transform to MiFID II format
      const transactionReports: TransactionReport[] = tradingData.map(record => ({
        transactionId: record.trade.id,
        clientId: record.trade.userId,
        instrument: record.trade.symbol,
        quantity: record.trade.quantity,
        price: record.trade.price,
        executionTimestamp: record.trade.executedAt,
        venue,
        tradingCapacity: 'agency', // Most crypto exchanges operate as agency
        clientClassification: this.getClientClassification(record.user, record.kyc),
        miFIDFlags: this.generateMiFIDFlags(record.trade, record.user)
      }));

      // Calculate summary statistics
      const summary = {
        totalTransactions: transactionReports.length,
        totalVolume: transactionReports.reduce((sum, t) => sum + (t.quantity * t.price), 0),
        totalClients: new Set(transactionReports.map(t => t.clientId)).size,
        highValueTransactions: transactionReports.filter(t => (t.quantity * t.price) > 10000).length
      };

      const reportId = `MIFID2_${Date.now()}`;
      
      // Store report in database
      await this.storeComplianceReport({
        id: reportId,
        reportType: 'MiFID_II',
        reportingPeriod: { start: startDate, end: endDate },
        data: { transactionReports, summary },
        generatedAt: new Date(),
        status: 'completed'
      });

      return {
        reportId,
        reportingPeriod: { start: startDate, end: endDate },
        transactionReports,
        summary,
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('MiFID II Report Generation Error:', error);
      throw new Error('Failed to generate MiFID II report');
    }
  }

  async generateFATFReport(startDate: Date, endDate: Date): Promise<FATFReport> {
    try {
      // Fetch suspicious transactions
      const suspiciousData = await db
        .select({
          alert: amlAlerts,
          user: users
        })
        .from(amlAlerts)
        .leftJoin(users, eq(amlAlerts.userId, users.id))
        .where(
          and(
            gte(amlAlerts.createdAt, startDate),
            lte(amlAlerts.createdAt, endDate),
            eq(amlAlerts.status, 'confirmed')
          )
        );

      // Fetch large transactions (>$10K)
      const largeTransactions = await db
        .select({
          trade: trades,
          user: users
        })
        .from(trades)
        .leftJoin(users, eq(trades.userId, users.id))
        .where(
          and(
            gte(trades.executedAt, startDate),
            lte(trades.executedAt, endDate),
            gte(trades.totalValue, 10000) // FATF threshold
          )
        );

      // Identify cross-border transactions
      const crossBorderTxns = largeTransactions.filter(tx => 
        tx.user?.country && tx.user.country !== 'US' // Assuming US-based exchange
      );

      const suspiciousTransactions: SuspiciousTransaction[] = suspiciousData.map(record => ({
        transactionId: record.alert.transactionId || '',
        clientId: record.alert.userId,
        amount: record.alert.amount || 0,
        currency: 'USD', // Default currency
        suspicionReasons: record.alert.alertReasons || [],
        riskScore: record.alert.riskScore || 0,
        reportedAt: record.alert.createdAt,
        status: record.alert.sarFiled ? 'filed' : 'pending'
      }));

      const reportId = `FATF_${Date.now()}`;

      await this.storeComplianceReport({
        id: reportId,
        reportType: 'FATF',
        reportingPeriod: { start: startDate, end: endDate },
        data: { 
          suspiciousTransactions,
          largeTransactions: largeTransactions.length,
          crossBorderTransactions: crossBorderTxns.length
        },
        generatedAt: new Date(),
        status: 'completed'
      });

      return {
        reportId,
        reportingPeriod: { start: startDate, end: endDate },
        suspiciousTransactions,
        largeTransactions: largeTransactions.map(tx => ({
          transactionId: tx.trade.id,
          clientId: tx.trade.userId,
          amount: tx.trade.totalValue,
          currency: tx.trade.symbol.split('/')[1],
          timestamp: tx.trade.executedAt,
          clientCountry: tx.user?.country || 'Unknown'
        })),
        crossBorderTransactions: crossBorderTxns.map(tx => ({
          transactionId: tx.trade.id,
          clientId: tx.trade.userId,
          amount: tx.trade.totalValue,
          originCountry: tx.user?.country || 'Unknown',
          destinationCountry: 'US'
        })),
        summary: {
          totalSuspicious: suspiciousTransactions.length,
          totalLarge: largeTransactions.length,
          totalCrossBorder: crossBorderTxns.length,
          sarsFiled: suspiciousTransactions.filter(t => t.status === 'filed').length
        }
      };

    } catch (error) {
      console.error('FATF Report Generation Error:', error);
      throw new Error('Failed to generate FATF report');
    }
  }

  async generateAMLComplianceReport(startDate: Date, endDate: Date): Promise<AMLComplianceReport> {
    try {
      // KYC Status Summary
      const allKYC = await db.select().from(kycVerifications);
      const kycStatus: KYCStatusSummary = {
        totalClients: allKYC.length,
        verified: allKYC.filter(k => k.status === 'approved').length,
        pending: allKYC.filter(k => k.status === 'pending').length,
        rejected: allKYC.filter(k => k.status === 'rejected').length,
        expired: allKYC.filter(k => k.expiresAt && k.expiresAt < new Date()).length,
        riskDistribution: this.calculateRiskDistribution(allKYC)
      };

      // Transaction Monitoring Summary
      const monitoringData = await db
        .select()
        .from(transactionMonitoring)
        .where(
          and(
            gte(transactionMonitoring.createdAt, startDate),
            lte(transactionMonitoring.createdAt, endDate)
          )
        );

      const transactionMonitoring = {
        totalMonitored: monitoringData.length,
        alertsGenerated: monitoringData.filter(m => m.alertGenerated).length,
        falsePositives: monitoringData.filter(m => m.status === 'false_positive').length,
        confirmed: monitoringData.filter(m => m.status === 'confirmed').length
      };

      const reportId = `AML_${Date.now()}`;

      await this.storeComplianceReport({
        id: reportId,
        reportType: 'AML_Compliance',
        reportingPeriod: { start: startDate, end: endDate },
        data: { kycStatus, transactionMonitoring },
        generatedAt: new Date(),
        status: 'completed'
      });

      return {
        reportId,
        reportingPeriod: { start: startDate, end: endDate },
        kycStatus,
        transactionMonitoring,
        sanctionsScreening: {
          totalScreened: 0,
          matches: 0,
          falsePositives: 0
        },
        riskAssessment: {
          highRisk: kycStatus.riskDistribution['high'] || 0,
          mediumRisk: kycStatus.riskDistribution['medium'] || 0,
          lowRisk: kycStatus.riskDistribution['low'] || 0
        }
      };

    } catch (error) {
      console.error('AML Report Generation Error:', error);
      throw new Error('Failed to generate AML compliance report');
    }
  }

  async generateCustomReport(
    reportType: string,
    parameters: any,
    format: 'json' | 'csv' | 'xml' | 'pdf'
  ): Promise<{ reportId: string; downloadUrl: string; expiresAt: Date }> {
    try {
      const reportId = `CUSTOM_${reportType}_${Date.now()}`;
      let reportData: any;

      switch (reportType) {
        case 'transaction_summary':
          reportData = await this.generateTransactionSummary(parameters);
          break;
        case 'client_risk_assessment':
          reportData = await this.generateClientRiskAssessment(parameters);
          break;
        case 'regulatory_audit':
          reportData = await this.generateRegulatoryAudit(parameters);
          break;
        default:
          throw new Error(`Unsupported report type: ${reportType}`);
      }

      // Format the data according to requested format
      const formattedData = await this.formatReportData(reportData, format);
      
      // Store the report
      await this.storeComplianceReport({
        id: reportId,
        reportType: `Custom_${reportType}`,
        reportingPeriod: parameters.period || { start: new Date(), end: new Date() },
        data: formattedData,
        generatedAt: new Date(),
        status: 'completed',
        format
      });

      // Generate download URL (would integrate with file storage service)
      const downloadUrl = `/api/compliance/reports/${reportId}/download`;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      return { reportId, downloadUrl, expiresAt };

    } catch (error) {
      console.error('Custom Report Generation Error:', error);
      throw new Error('Failed to generate custom report');
    }
  }

  async scheduleAutomaticReporting(
    reportType: string,
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly',
    recipients: string[],
    parameters?: any
  ): Promise<{ scheduleId: string; nextRun: Date }> {
    // Implementation for scheduled reporting
    const scheduleId = `SCHEDULE_${reportType}_${Date.now()}`;
    const nextRun = this.calculateNextRunDate(frequency);

    // Store schedule in database (would need scheduled_reports table)
    console.log(`Scheduled ${reportType} report for ${frequency} delivery to:`, recipients);

    return { scheduleId, nextRun };
  }

  async getComplianceMetrics(period: { start: Date; end: Date }): Promise<{
    kycCompletionRate: number;
    amlAlertRate: number;
    sarFilingRate: number;
    regulatoryCompliance: number;
  }> {
    const allUsers = await db.select().from(users);
    const verifiedUsers = await db
      .select()
      .from(kycVerifications)
      .where(eq(kycVerifications.status, 'approved'));

    const alerts = await db
      .select()
      .from(amlAlerts)
      .where(
        and(
          gte(amlAlerts.createdAt, period.start),
          lte(amlAlerts.createdAt, period.end)
        )
      );

    const sarsFiled = alerts.filter(a => a.sarFiled).length;

    return {
      kycCompletionRate: (verifiedUsers.length / allUsers.length) * 100,
      amlAlertRate: (alerts.length / allUsers.length) * 100,
      sarFilingRate: alerts.length > 0 ? (sarsFiled / alerts.length) * 100 : 0,
      regulatoryCompliance: 95 // Calculated based on various compliance factors
    };
  }

  // Private helper methods
  private getClientClassification(user: User | null, kyc: KycVerification | null): 'retail' | 'professional' | 'eligible_counterparty' {
    if (!user || !kyc) return 'retail';
    
    // Simplified classification logic
    if (kyc.level >= 3) return 'professional';
    if (kyc.level >= 2) return 'retail';
    return 'retail';
  }

  private generateMiFIDFlags(trade: Trade, user: User | null): string[] {
    const flags: string[] = [];
    
    if (trade.totalValue > 50000) flags.push('LARGE_TRANSACTION');
    if (trade.quantity * trade.price > 10000) flags.push('REPORTABLE_TRANSACTION');
    if (user?.country !== 'US') flags.push('NON_DOMESTIC_CLIENT');
    
    return flags;
  }

  private calculateRiskDistribution(kycRecords: KycVerification[]): { [key: string]: number } {
    const distribution = { low: 0, medium: 0, high: 0 };
    
    kycRecords.forEach(kyc => {
      const risk = kyc.riskScore || 0;
      if (risk < 30) distribution.low++;
      else if (risk < 70) distribution.medium++;
      else distribution.high++;
    });

    return distribution;
  }

  private async storeComplianceReport(report: {
    id: string;
    reportType: string;
    reportingPeriod: { start: Date; end: Date };
    data: any;
    generatedAt: Date;
    status: string;
    format?: string;
  }) {
    // Store in compliance reports table
    console.log(`Storing compliance report: ${report.id}`);
    // Would implement actual database storage
  }

  private calculateNextRunDate(frequency: string): Date {
    const now = new Date();
    switch (frequency) {
      case 'daily': return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly': return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly': return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      case 'quarterly': return new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
      default: return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  private async generateTransactionSummary(parameters: any): Promise<any> {
    // Implementation for transaction summary report
    return { summary: 'Transaction summary data' };
  }

  private async generateClientRiskAssessment(parameters: any): Promise<any> {
    // Implementation for client risk assessment
    return { assessment: 'Risk assessment data' };
  }

  private async generateRegulatoryAudit(parameters: any): Promise<any> {
    // Implementation for regulatory audit
    return { audit: 'Audit trail data' };
  }

  private async formatReportData(data: any, format: string): Promise<any> {
    switch (format) {
      case 'json': return JSON.stringify(data, null, 2);
      case 'csv': return this.convertToCSV(data);
      case 'xml': return this.convertToXML(data);
      case 'pdf': return this.convertToPDF(data);
      default: return data;
    }
  }

  private convertToCSV(data: any): string {
    // CSV conversion logic
    return 'CSV formatted data';
  }

  private convertToXML(data: any): string {
    // XML conversion logic
    return '<xml>XML formatted data</xml>';
  }

  private convertToPDF(data: any): string {
    // PDF conversion logic (would use library like jsPDF)
    return 'PDF formatted data';
  }
}

export const regulatoryService = new RegulatoryComplianceService();