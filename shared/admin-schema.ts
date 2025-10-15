import { pgTable, serial, text, timestamp, integer, boolean, decimal, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// User Forensics & Account Management
export const userForensics = pgTable('user_forensics', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  loginHistory: jsonb('login_history'),
  walletLinks: jsonb('wallet_links'),
  activityTimeline: jsonb('activity_timeline'),
  riskScore: decimal('risk_score', { precision: 5, scale: 2 }),
  behaviorPatterns: jsonb('behavior_patterns').$type<{
    structuring: boolean;
    rapidMovements: boolean;
    suspiciousPatterns: string[];
  }>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// AML Risk Intelligence
export const amlRiskProfiles = pgTable('aml_risk_profiles', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  riskLevel: text('risk_level').notNull(), // low, medium, high, critical
  aiRiskScore: decimal('ai_risk_score', { precision: 5, scale: 2 }),
  behaviorFlags: jsonb('behavior_flags').$type<{
    structuring: boolean;
    rapidMovements: boolean;
    unusualPatterns: boolean;
    jurisdictionRisk: boolean;
  }>(),
  suspiciousTransactions: jsonb('suspicious_transactions').$type<Array<{
    transactionId: string;
    amount: string;
    reason: string;
    reportedAt: string;
  }>>(),
  strSarReports: jsonb('str_sar_reports'),
  lastReviewedAt: timestamp('last_reviewed_at'),
  reviewedBy: text('reviewed_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Transaction Monitoring
export const transactionMonitoring = pgTable('transaction_monitoring', {
  id: serial('id').primaryKey(),
  transactionId: text('transaction_id').notNull(),
  userId: text('user_id').notNull(),
  amount: decimal('amount', { precision: 18, scale: 8 }),
  currency: text('currency'),
  type: text('type'), // deposit, withdrawal, trade
  status: text('status'), // pending, approved, flagged, rejected
  flagReason: text('flag_reason'),
  reviewedBy: text('reviewed_by'),
  approvedBy: text('approved_by'),
  sourceAddress: text('source_address'),
  destinationAddress: text('destination_address'),
  country: text('country'),
  isManualReview: boolean('is_manual_review').default(false),
  automatedFlags: jsonb('automated_flags').$type<string[]>(),
  reviewNotes: text('review_notes'),
  createdAt: timestamp('created_at').defaultNow(),
  reviewedAt: timestamp('reviewed_at')
});

// Compliance & Reporting
export const complianceReports = pgTable('compliance_reports', {
  id: serial('id').primaryKey(),
  reportType: text('report_type').notNull(), // fca, vara, mas, general
  reportPeriod: text('report_period'),
  status: text('status').default('draft'), // draft, submitted, approved
  generatedBy: text('generated_by'),
  submittedTo: text('submitted_to'),
  reportData: jsonb('report_data'),
  compliancePackPath: text('compliance_pack_path'),
  auditTrail: jsonb('audit_trail').$type<Array<{
    action: string;
    performedBy: string;
    timestamp: string;
    details: string;
  }>>(),
  regulatorComments: text('regulator_comments'),
  dueDate: timestamp('due_date'),
  submittedAt: timestamp('submitted_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Treasury Operations
export const walletOperations = pgTable('wallet_operations', {
  id: serial('id').primaryKey(),
  operationType: text('operation_type').notNull(), // reconciliation, sweep, approval
  walletType: text('wallet_type'), // hot, cold, user
  walletAddress: text('wallet_address'),
  amount: decimal('amount', { precision: 18, scale: 8 }),
  currency: text('currency'),
  status: text('status').default('pending'),
  requiresApproval: boolean('requires_approval').default(false),
  approvedBy: text('approved_by'),
  multiSigStatus: jsonb('multi_sig_status').$type<{
    required: number;
    signed: number;
    signers: string[];
  }>(),
  reconciliationData: jsonb('reconciliation_data'),
  performedBy: text('performed_by'),
  scheduledAt: timestamp('scheduled_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow()
});

// Support & Ticketing
export const supportTickets = pgTable('support_tickets', {
  id: serial('id').primaryKey(),
  ticketId: text('ticket_id').notNull().unique(),
  userId: text('user_id'),
  category: text('category'), // compliance, technical, withdrawals, general
  priority: text('priority').default('medium'), // low, medium, high, urgent
  status: text('status').default('open'), // open, in_progress, resolved, closed
  subject: text('subject'),
  description: text('description'),
  assignedTo: text('assigned_to'),
  tags: jsonb('tags').$type<string[]>(),
  escalationLevel: integer('escalation_level').default(1),
  responseTime: integer('response_time'), // in minutes
  resolutionTime: integer('resolution_time'), // in minutes
  customerSatisfaction: integer('customer_satisfaction'), // 1-5 rating
  internalNotes: text('internal_notes'),
  externalComments: jsonb('external_comments').$type<Array<{
    author: string;
    message: string;
    timestamp: string;
    isInternal: boolean;
  }>>(),
  integrationData: jsonb('integration_data'), // zendesk, intercom data
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  resolvedAt: timestamp('resolved_at')
});

// Business CRM - Accounts & Pipeline
export const crmAccounts = pgTable('crm_accounts', {
  id: serial('id').primaryKey(),
  accountName: text('account_name').notNull(),
  accountType: text('account_type'), // vip, otc, market_maker, investor, partner
  userId: text('user_id'), // linked platform user
  kybStatus: text('kyb_status'), // pending, approved, rejected
  dealValue: decimal('deal_value', { precision: 18, scale: 2 }),
  priority: text('priority').default('medium'),
  stage: text('stage').default('new_lead'), // new_lead, demo, kyc, funded, active
  assignedTo: text('assigned_to'),
  contactInfo: jsonb('contact_info').$type<{
    primaryContact: string;
    email: string;
    phone: string;
    company: string;
  }>(),
  platformActivity: jsonb('platform_activity').$type<{
    lastLogin: string;
    tradingVolume: string;
    accountBalance: string;
  }>(),
  riskFlags: jsonb('risk_flags').$type<string[]>(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// CRM Communication Log
export const crmCommunications = pgTable('crm_communications', {
  id: serial('id').primaryKey(),
  accountId: integer('account_id').references(() => crmAccounts.id),
  communicationType: text('communication_type'), // email, call, meeting, slack
  subject: text('subject'),
  content: text('content'),
  participants: jsonb('participants').$type<string[]>(),
  meetingNotes: text('meeting_notes'),
  followUpRequired: boolean('follow_up_required').default(false),
  followUpDate: timestamp('follow_up_date'),
  attachments: jsonb('attachments').$type<string[]>(),
  integrationData: jsonb('integration_data'), // zoom, slack, email thread data
  createdBy: text('created_by'),
  createdAt: timestamp('created_at').defaultNow()
});

// Regulatory Communications
export const regulatoryComms = pgTable('regulatory_communications', {
  id: serial('id').primaryKey(),
  regulator: text('regulator'), // fca, vara, mas, etc
  communicationType: text('communication_type'), // inquiry, filing, response
  subject: text('subject'),
  content: text('content'),
  status: text('status').default('pending'),
  dueDate: timestamp('due_date'),
  assignedTo: text('assigned_to'),
  documents: jsonb('documents').$type<Array<{
    name: string;
    path: string;
    type: string;
  }>>(),
  reminderSet: boolean('reminder_set').default(false),
  reminderDate: timestamp('reminder_date'),
  responseRequired: boolean('response_required').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  respondedAt: timestamp('responded_at')
});

// Contract & Token Tracking
export const contractTracking = pgTable('contract_tracking', {
  id: serial('id').primaryKey(),
  contractType: text('contract_type'), // saft, mou, nda, partnership
  contractName: text('contract_name'),
  counterparty: text('counterparty'),
  accountId: integer('account_id').references(() => crmAccounts.id),
  status: text('status').default('draft'), // draft, review, signed, active, expired
  contractValue: decimal('contract_value', { precision: 18, scale: 2 }),
  currency: text('currency'),
  tokenDetails: jsonb('token_details').$type<{
    tokenSymbol: string;
    allocation: string;
    vestingSchedule: Array<{
      date: string;
      percentage: number;
      amount: string;
    }>;
  }>(),
  keyDates: jsonb('key_dates').$type<{
    signedDate: string;
    effectiveDate: string;
    expiryDate: string;
    nextVesting: string;
  }>(),
  documentPath: text('document_path'),
  assignedLegal: text('assigned_legal'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// System Health & Monitoring
export const systemHealthMetrics = pgTable('system_health_metrics', {
  id: serial('id').primaryKey(),
  metricType: text('metric_type'), // api_response, db_performance, wallet_sync, etc
  metricName: text('metric_name'),
  value: decimal('value', { precision: 12, scale: 4 }),
  unit: text('unit'),
  threshold: decimal('threshold', { precision: 12, scale: 4 }),
  status: text('status'), // healthy, warning, critical
  details: jsonb('details'),
  alertTriggered: boolean('alert_triggered').default(false),
  acknowledgedBy: text('acknowledged_by'),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow()
});

// Schema exports
export const insertUserForensicsSchema = createInsertSchema(userForensics);
export const insertAmlRiskProfileSchema = createInsertSchema(amlRiskProfiles);
export const insertTransactionMonitoringSchema = createInsertSchema(transactionMonitoring);
export const insertComplianceReportSchema = createInsertSchema(complianceReports);
export const insertWalletOperationSchema = createInsertSchema(walletOperations);
export const insertSupportTicketSchema = createInsertSchema(supportTickets);
export const insertCrmAccountSchema = createInsertSchema(crmAccounts);
export const insertCrmCommunicationSchema = createInsertSchema(crmCommunications);
export const insertRegulatoryCommSchema = createInsertSchema(regulatoryComms);
export const insertContractTrackingSchema = createInsertSchema(contractTracking);
export const insertSystemHealthMetricSchema = createInsertSchema(systemHealthMetrics);

// Type exports
export type UserForensics = typeof userForensics.$inferSelect;
export type AmlRiskProfile = typeof amlRiskProfiles.$inferSelect;
export type TransactionMonitoring = typeof transactionMonitoring.$inferSelect;
export type ComplianceReport = typeof complianceReports.$inferSelect;
export type WalletOperation = typeof walletOperations.$inferSelect;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type CrmAccount = typeof crmAccounts.$inferSelect;
export type CrmCommunication = typeof crmCommunications.$inferSelect;
export type RegulatoryComm = typeof regulatoryComms.$inferSelect;
export type ContractTracking = typeof contractTracking.$inferSelect;
export type SystemHealthMetric = typeof systemHealthMetrics.$inferSelect;

export type InsertUserForensics = z.infer<typeof insertUserForensicsSchema>;
export type InsertAmlRiskProfile = z.infer<typeof insertAmlRiskProfileSchema>;
export type InsertTransactionMonitoring = z.infer<typeof insertTransactionMonitoringSchema>;
export type InsertComplianceReport = z.infer<typeof insertComplianceReportSchema>;
export type InsertWalletOperation = z.infer<typeof insertWalletOperationSchema>;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type InsertCrmAccount = z.infer<typeof insertCrmAccountSchema>;
export type InsertCrmCommunication = z.infer<typeof insertCrmCommunicationSchema>;
export type InsertRegulatoryComm = z.infer<typeof insertRegulatoryCommSchema>;
export type InsertContractTracking = z.infer<typeof insertContractTrackingSchema>;
export type InsertSystemHealthMetric = z.infer<typeof insertSystemHealthMetricSchema>;