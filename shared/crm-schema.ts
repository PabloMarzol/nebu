import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  integer,
  decimal,
  boolean,
  uuid,
  index,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./schema"; // Import users table

// CRM Customer Management
export const crmCustomers = pgTable("crm_customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id),
  customerType: varchar("customer_type").notNull(), // individual, institutional, corporate
  tier: varchar("tier").notNull().default("basic"), // basic, pro, premium, elite, institutional
  status: varchar("status").notNull().default("active"), // active, suspended, closed, kyc_pending
  acquisitionChannel: varchar("acquisition_channel"), // organic, referral, marketing, social
  referralCode: varchar("referral_code"),
  referredBy: uuid("referred_by").references(() => crmCustomers.id),
  ltv: decimal("ltv", { precision: 15, scale: 2 }).default("0"), // lifetime value
  riskScore: integer("risk_score").default(50), // 0-100
  complianceStatus: varchar("compliance_status").default("pending"), // pending, approved, rejected, review
  lastActivity: timestamp("last_activity"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("crm_customers_user_id_idx").on(table.userId),
  index("crm_customers_tier_idx").on(table.tier),
  index("crm_customers_status_idx").on(table.status),
]);

// Customer Communications
export const crmCommunications = pgTable("crm_communications", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => crmCustomers.id).notNull(),
  type: varchar("type").notNull(), // email, sms, call, chat, notification, support_ticket
  channel: varchar("channel"), // sendgrid, twilio, internal, telegram
  direction: varchar("direction").notNull(), // inbound, outbound
  subject: text("subject"),
  content: text("content").notNull(),
  status: varchar("status").default("sent"), // sent, delivered, opened, clicked, failed
  metadata: jsonb("metadata"), // delivery info, tracking data
  agentId: varchar("agent_id"), // support agent or system
  campaignId: uuid("campaign_id").references(() => crmCampaigns.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("crm_communications_customer_idx").on(table.customerId),
  index("crm_communications_type_idx").on(table.type),
  index("crm_communications_created_idx").on(table.createdAt),
]);

// Transaction Management
export const crmTransactions = pgTable("crm_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => crmCustomers.id).notNull(),
  type: varchar("type").notNull(), // deposit, withdrawal, trade, fee, staking_reward, p2p, otc
  subtype: varchar("subtype"), // card, bank_transfer, crypto, trading_fee, maker_fee, taker_fee
  status: varchar("status").notNull(), // pending, completed, failed, cancelled, processing
  currency: varchar("currency").notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  fee: decimal("fee", { precision: 20, scale: 8 }).default("0"),
  netAmount: decimal("net_amount", { precision: 20, scale: 8 }).notNull(),
  exchangeRate: decimal("exchange_rate", { precision: 20, scale: 8 }),
  counterparty: text("counterparty"), // for P2P/OTC trades
  orderId: varchar("order_id"), // related trading order
  blockchainTxId: varchar("blockchain_tx_id"), // crypto transaction hash
  paymentMethod: varchar("payment_method"), // card_****1234, bank_account, crypto_wallet
  riskFlags: jsonb("risk_flags"), // AML, suspicious activity flags
  compliance: jsonb("compliance"), // KYC level, sanctions check
  metadata: jsonb("metadata"), // additional transaction data
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
}, (table) => [
  index("crm_transactions_customer_idx").on(table.customerId),
  index("crm_transactions_type_idx").on(table.type),
  index("crm_transactions_status_idx").on(table.status),
  index("crm_transactions_created_idx").on(table.createdAt),
]);

// User 360° Profile Extended
export const crmUserProfiles = pgTable("crm_user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => crmCustomers.id).notNull(),
  kycStatus: varchar("kyc_status").notNull().default("pending"), // pending, submitted, approved, rejected, expired
  kycLevel: integer("kyc_level").default(0), // 0=none, 1=basic, 2=enhanced, 3=institutional
  amlStatus: varchar("aml_status").default("pending"), // pending, cleared, flagged, blocked
  verificationLevel: integer("verification_level").default(1), // progressive verification tiers
  balancesSnapshot: jsonb("balances_snapshot"), // current crypto/fiat balances
  walletAddresses: jsonb("wallet_addresses"), // tracked wallet addresses
  assetPositions: jsonb("asset_positions"), // portfolio positions summary
  tradeVolumeMonthly: decimal("trade_volume_monthly", { precision: 20, scale: 2 }).default("0"),
  affiliateStatus: varchar("affiliate_status"), // none, active, suspended, vip
  deviceHistory: jsonb("device_history"), // login devices and IPs
  pepStatus: boolean("pep_status").default(false), // politically exposed person
  sanctionsFlags: jsonb("sanctions_flags"), // sanctions screening results
  adverseMediaFlags: jsonb("adverse_media_flags"), // negative news screening
  onboardingProgress: integer("onboarding_progress").default(0), // completion percentage
  lastKycUpdate: timestamp("last_kyc_update"),
  riskAssessmentDate: timestamp("risk_assessment_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("crm_user_profiles_customer_idx").on(table.customerId),
  index("crm_user_profiles_kyc_status_idx").on(table.kycStatus),
  index("crm_user_profiles_verification_level_idx").on(table.verificationLevel),
]);

// KYC/AML Compliance Center
export const crmKycCases = pgTable("crm_kyc_cases", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => crmCustomers.id).notNull(),
  caseType: varchar("case_type").notNull(), // initial_kyc, re_verification, upgrade, manual_review
  status: varchar("status").notNull().default("pending"), // pending, in_review, approved, rejected, escalated
  priority: varchar("priority").default("normal"), // low, normal, high, urgent
  assignedAgent: varchar("assigned_agent"), // compliance officer ID
  providerUsed: varchar("provider_used"), // sumsub, shufti_pro, jumio
  providerResponse: jsonb("provider_response"), // full API response
  documentsRequired: jsonb("documents_required"), // list of required documents
  documentsReceived: jsonb("documents_received"), // submitted documents
  reviewNotes: text("review_notes"), // manual review comments
  decisionReason: text("decision_reason"), // approval/rejection reason
  escalationReason: text("escalation_reason"), // why escalated
  autoFlags: jsonb("auto_flags"), // automated flags for manual review
  manualFlags: jsonb("manual_flags"), // manually added flags
  riskScore: integer("risk_score"), // calculated risk score
  dueDate: timestamp("due_date"), // SLA deadline
  reviewedAt: timestamp("reviewed_at"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("crm_kyc_cases_customer_idx").on(table.customerId),
  index("crm_kyc_cases_status_idx").on(table.status),
  index("crm_kyc_cases_priority_idx").on(table.priority),
  index("crm_kyc_cases_assigned_agent_idx").on(table.assignedAgent),
]);

// Transaction Monitoring & AML
export const crmAmlAlerts = pgTable("crm_aml_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => crmCustomers.id).notNull(),
  transactionId: uuid("transaction_id").references(() => crmTransactions.id),
  alertType: varchar("alert_type").notNull(), // large_transaction, velocity, structuring, sanctions, unusual_pattern
  severity: varchar("severity").notNull(), // low, medium, high, critical
  status: varchar("status").default("open"), // open, investigating, closed, escalated, false_positive
  assignedAnalyst: varchar("assigned_analyst"),
  triggerRules: jsonb("trigger_rules"), // which rules triggered the alert
  transactionPattern: jsonb("transaction_pattern"), // pattern analysis
  riskIndicators: jsonb("risk_indicators"), // specific risk factors
  investigationNotes: text("investigation_notes"),
  resolution: text("resolution"), // how alert was resolved
  sarFiled: boolean("sar_filed").default(false), // suspicious activity report filed
  sarReference: varchar("sar_reference"), // SAR filing reference
  escalatedTo: varchar("escalated_to"), // higher authority
  reviewedAt: timestamp("reviewed_at"),
  closedAt: timestamp("closed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("crm_aml_alerts_customer_idx").on(table.customerId),
  index("crm_aml_alerts_type_idx").on(table.alertType),
  index("crm_aml_alerts_severity_idx").on(table.severity),
  index("crm_aml_alerts_status_idx").on(table.status),
]);

// Support Ticketing Hub
export const crmSupportTickets = pgTable("crm_support_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => crmCustomers.id).notNull(),
  ticketNumber: varchar("ticket_number").notNull().unique(), // auto-generated ticket number
  source: varchar("source").notNull(), // web, email, chat, telegram, social, phone
  category: varchar("category").notNull(), // kyc, withdrawal, technical, trading, compliance, general
  subcategory: varchar("subcategory"), // specific issue type
  priority: varchar("priority").default("normal"), // low, normal, high, urgent, critical
  status: varchar("status").default("open"), // open, pending, in_progress, resolved, closed, escalated
  assignedAgent: varchar("assigned_agent"),
  assignedTeam: varchar("assigned_team"), // support, compliance, technical, vip
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  resolution: text("resolution"),
  customerSatisfaction: integer("customer_satisfaction"), // 1-5 rating
  internalNotes: text("internal_notes"),
  tags: jsonb("tags"), // searchable tags
  attachments: jsonb("attachments"), // file attachments
  linkedTickets: jsonb("linked_tickets"), // related tickets
  escalationHistory: jsonb("escalation_history"), // escalation trail
  slaTarget: timestamp("sla_target"), // response/resolution target
  firstResponseAt: timestamp("first_response_at"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("crm_support_tickets_customer_idx").on(table.customerId),
  index("crm_support_tickets_status_idx").on(table.status),
  index("crm_support_tickets_assigned_agent_idx").on(table.assignedAgent),
  index("crm_support_tickets_category_idx").on(table.category),
  index("crm_support_tickets_priority_idx").on(table.priority),
]);

// Affiliate & Referral Management
export const crmAffiliates = pgTable("crm_affiliates", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => crmCustomers.id).notNull(),
  affiliateCode: varchar("affiliate_code").notNull().unique(),
  tier: varchar("tier").default("standard"), // standard, premium, vip, institutional
  status: varchar("status").default("active"), // active, suspended, terminated, pending
  commissionRate: decimal("commission_rate", { precision: 5, scale: 4 }).default("0.1"), // 10% default
  totalReferrals: integer("total_referrals").default(0),
  activeReferrals: integer("active_referrals").default(0),
  totalCommissions: decimal("total_commissions", { precision: 20, scale: 2 }).default("0"),
  pendingCommissions: decimal("pending_commissions", { precision: 20, scale: 2 }).default("0"),
  paidCommissions: decimal("paid_commissions", { precision: 20, scale: 2 }).default("0"),
  fraudFlags: jsonb("fraud_flags"), // fraud detection flags
  payoutMethod: varchar("payout_method"), // crypto, bank_transfer, internal_balance
  payoutDetails: jsonb("payout_details"), // payout configuration
  trackingPixel: varchar("tracking_pixel"), // unique tracking identifier
  marketingMaterials: jsonb("marketing_materials"), // approved materials
  performanceMetrics: jsonb("performance_metrics"), // conversion rates, volumes
  suspensionReason: text("suspension_reason"),
  lastPayoutAt: timestamp("last_payout_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("crm_affiliates_customer_idx").on(table.customerId),
  index("crm_affiliates_code_idx").on(table.affiliateCode),
  index("crm_affiliates_status_idx").on(table.status),
  index("crm_affiliates_tier_idx").on(table.tier),
]);

// Affiliate Payouts
export const crmAffiliatePayout = pgTable("crm_affiliate_payouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  affiliateId: uuid("affiliate_id").references(() => crmAffiliates.id).notNull(),
  payoutReference: varchar("payout_reference").notNull().unique(),
  amount: decimal("amount", { precision: 20, scale: 2 }).notNull(),
  currency: varchar("currency").notNull(),
  method: varchar("method").notNull(), // crypto, bank_transfer, internal_balance
  status: varchar("status").default("pending"), // pending, processing, completed, failed, cancelled
  transactionHash: varchar("transaction_hash"), // blockchain transaction hash
  bankReference: varchar("bank_reference"), // bank transfer reference
  processingFee: decimal("processing_fee", { precision: 20, scale: 2 }).default("0"),
  netAmount: decimal("net_amount", { precision: 20, scale: 2 }).notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  referralsIncluded: integer("referrals_included"),
  auditTrail: jsonb("audit_trail"), // detailed breakdown
  processedBy: varchar("processed_by"), // admin who processed
  failureReason: text("failure_reason"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("crm_affiliate_payouts_affiliate_idx").on(table.affiliateId),
  index("crm_affiliate_payouts_status_idx").on(table.status),
  index("crm_affiliate_payouts_created_idx").on(table.createdAt),
]);

// Payment Methods
export const crmPaymentMethods = pgTable("crm_payment_methods", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => crmCustomers.id).notNull(),
  type: varchar("type").notNull(), // card, bank_account, crypto_wallet, swift
  provider: varchar("provider"), // stripe, bank_name, blockchain
  identifier: varchar("identifier"), // last 4 digits, account number, wallet address
  details: jsonb("details"), // encrypted payment details
  isDefault: boolean("is_default").default(false),
  isVerified: boolean("is_verified").default(false),
  status: varchar("status").default("active"), // active, expired, blocked
  verificationData: jsonb("verification_data"), // verification documents
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("crm_payment_methods_customer_idx").on(table.customerId),
  index("crm_payment_methods_type_idx").on(table.type),
]);



// Marketing Campaigns
export const crmCampaigns = pgTable("crm_campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // email, sms, push, referral, welcome, retention
  status: varchar("status").default("draft"), // draft, active, paused, completed
  targetSegment: jsonb("target_segment"), // customer segmentation criteria
  content: jsonb("content"), // email templates, messages
  schedule: jsonb("schedule"), // timing and frequency
  metrics: jsonb("metrics"), // open rates, click rates, conversions
  budget: decimal("budget", { precision: 10, scale: 2 }),
  spent: decimal("spent", { precision: 10, scale: 2 }).default("0"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("crm_campaigns_type_idx").on(table.type),
  index("crm_campaigns_status_idx").on(table.status),
]);

// Customer Analytics
export const crmCustomerAnalytics = pgTable("crm_customer_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => crmCustomers.id).notNull(),
  date: timestamp("date").notNull(),
  tradingVolume: decimal("trading_volume", { precision: 20, scale: 2 }).default("0"),
  depositAmount: decimal("deposit_amount", { precision: 20, scale: 2 }).default("0"),
  withdrawalAmount: decimal("withdrawal_amount", { precision: 20, scale: 2 }).default("0"),
  feesGenerated: decimal("fees_generated", { precision: 20, scale: 2 }).default("0"),
  loginCount: integer("login_count").default(0),
  sessionDuration: integer("session_duration_minutes").default(0),
  pagesViewed: integer("pages_viewed").default(0),
  ordersPlaced: integer("orders_placed").default(0),
  supportTickets: integer("support_tickets").default(0),
  riskScore: integer("risk_score").default(50),
  engagementScore: integer("engagement_score").default(0),
  churnProbability: decimal("churn_probability", { precision: 5, scale: 4 }).default("0"),
}, (table) => [
  index("crm_analytics_customer_date_idx").on(table.customerId, table.date),
]);

// Compliance Records
export const crmComplianceRecords = pgTable("crm_compliance_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => crmCustomers.id).notNull(),
  type: varchar("type").notNull(), // kyc, aml, sanctions, pep, enhanced_dd
  status: varchar("status").notNull(), // pending, approved, rejected, expired
  level: integer("level"), // KYC level 1-3
  documents: jsonb("documents"), // uploaded documents
  verificationData: jsonb("verification_data"), // verification results
  riskAssessment: jsonb("risk_assessment"), // risk factors and scores
  reviewNotes: text("review_notes"),
  reviewedBy: varchar("reviewed_by"),
  expiresAt: timestamp("expires_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("crm_compliance_customer_idx").on(table.customerId),
  index("crm_compliance_type_idx").on(table.type),
  index("crm_compliance_status_idx").on(table.status),
]);

// Customer Segments
export const crmCustomerSegments = pgTable("crm_customer_segments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  description: text("description"),
  criteria: jsonb("criteria").notNull(), // segmentation rules
  customerCount: integer("customer_count").default(0),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer Segment Memberships
export const crmCustomerSegmentMemberships = pgTable("crm_customer_segment_memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => crmCustomers.id).notNull(),
  segmentId: uuid("segment_id").references(() => crmCustomerSegments.id).notNull(),
  addedAt: timestamp("added_at").defaultNow(),
}, (table) => [
  index("crm_segment_memberships_customer_idx").on(table.customerId),
  index("crm_segment_memberships_segment_idx").on(table.segmentId),
]);

// Admin Controls & RBAC
export const crmAdminRoles = pgTable("crm_admin_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull().unique(),
  description: text("description"),
  permissions: jsonb("permissions").notNull(), // granular permission set
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const crmAdminUsers = pgTable("crm_admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().unique(), // link to main user system
  email: varchar("email").notNull().unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  roleId: uuid("role_id").references(() => crmAdminRoles.id).notNull(),
  status: varchar("status").default("active"), // active, suspended, inactive
  lastLogin: timestamp("last_login"),
  failedLoginAttempts: integer("failed_login_attempts").default(0),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  ipWhitelist: jsonb("ip_whitelist"), // allowed IP addresses
  sessionTimeout: integer("session_timeout").default(480), // minutes
  permissions: jsonb("permissions"), // additional/override permissions
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("crm_admin_users_role_idx").on(table.roleId),
  index("crm_admin_users_email_idx").on(table.email),
]);

// Action Logging & Audit Trail
export const crmAuditLogs = pgTable("crm_audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminUserId: uuid("admin_user_id").references(() => crmAdminUsers.id),
  action: varchar("action").notNull(), // view, create, update, delete, approve, reject
  resource: varchar("resource").notNull(), // customer, kyc_case, transaction, ticket, etc.
  resourceId: varchar("resource_id"), // ID of affected resource
  previousData: jsonb("previous_data"), // before state
  newData: jsonb("new_data"), // after state
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  sessionId: varchar("session_id"),
  reason: text("reason"), // reason for action
  riskLevel: varchar("risk_level").default("low"), // low, medium, high, critical
  requiresApproval: boolean("requires_approval").default(false),
  approvedBy: uuid("approved_by").references(() => crmAdminUsers.id),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("crm_audit_logs_admin_user_idx").on(table.adminUserId),
  index("crm_audit_logs_action_idx").on(table.action),
  index("crm_audit_logs_resource_idx").on(table.resource),
  index("crm_audit_logs_created_idx").on(table.createdAt),
]);

// Incident Response & Case Management
export const crmIncidents = pgTable("crm_incidents", {
  id: uuid("id").primaryKey().defaultRandom(),
  incidentNumber: varchar("incident_number").notNull().unique(),
  customerId: uuid("customer_id").references(() => crmCustomers.id),
  incidentType: varchar("incident_type").notNull(), // fraud, aml_alert, security_breach, compliance_violation
  severity: varchar("severity").notNull(), // low, medium, high, critical
  status: varchar("status").default("open"), // open, investigating, resolved, closed, escalated
  title: text("title").notNull(),
  description: text("description").notNull(),
  assignedTeam: varchar("assigned_team"), // fraud, compliance, security, legal
  assignedAgent: uuid("assigned_agent").references(() => crmAdminUsers.id),
  priority: varchar("priority").default("medium"), // low, medium, high, urgent
  timeline: jsonb("timeline"), // investigation timeline
  evidence: jsonb("evidence"), // collected evidence
  impact: text("impact"), // business impact assessment
  resolution: text("resolution"),
  lessonsLearned: text("lessons_learned"),
  preventiveMeasures: text("preventive_measures"),
  reportedBy: uuid("reported_by").references(() => crmAdminUsers.id),
  escalatedTo: varchar("escalated_to"), // higher authority
  dueDate: timestamp("due_date"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("crm_incidents_customer_idx").on(table.customerId),
  index("crm_incidents_type_idx").on(table.incidentType),
  index("crm_incidents_severity_idx").on(table.severity),
  index("crm_incidents_status_idx").on(table.status),
  index("crm_incidents_assigned_agent_idx").on(table.assignedAgent),
]);

// Automation & Workflow Rules
export const crmAutomationRules = pgTable("crm_automation_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  description: text("description"),
  trigger: varchar("trigger").notNull(), // customer_action, time_based, threshold_based
  conditions: jsonb("conditions").notNull(), // triggering conditions
  actions: jsonb("actions").notNull(), // automated actions
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(1000), // execution order
  executionCount: integer("execution_count").default(0),
  lastExecuted: timestamp("last_executed"),
  createdBy: uuid("created_by").references(() => crmAdminUsers.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("crm_automation_rules_trigger_idx").on(table.trigger),
  index("crm_automation_rules_active_idx").on(table.isActive),
]);

// Data Access & Privacy (GDPR/CCPA)
export const crmDataRequests = pgTable("crm_data_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => crmCustomers.id).notNull(),
  requestType: varchar("request_type").notNull(), // data_export, data_deletion, data_rectification
  requestMethod: varchar("request_method"), // email, support_ticket, api
  status: varchar("status").default("pending"), // pending, processing, completed, rejected
  requestDetails: text("request_details"),
  legalBasis: varchar("legal_basis"), // GDPR article, CCPA section
  processedBy: uuid("processed_by").references(() => crmAdminUsers.id),
  dataExported: jsonb("data_exported"), // what data was exported
  dataDeleted: jsonb("data_deleted"), // what data was deleted
  retentionOverride: boolean("retention_override").default(false),
  verificationMethod: varchar("verification_method"), // email, phone, document
  verificationData: jsonb("verification_data"),
  rejectionReason: text("rejection_reason"),
  completedAt: timestamp("completed_at"),
  dueDate: timestamp("due_date"), // regulatory deadline
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("crm_data_requests_customer_idx").on(table.customerId),
  index("crm_data_requests_type_idx").on(table.requestType),
  index("crm_data_requests_status_idx").on(table.status),
]);

// Scheduled Reports
export const crmScheduledReports = pgTable("crm_scheduled_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  reportType: varchar("report_type").notNull(), // compliance, performance, analytics, audit
  format: varchar("format").default("pdf"), // pdf, excel, csv
  schedule: varchar("schedule").notNull(), // daily, weekly, monthly, quarterly
  parameters: jsonb("parameters"), // report parameters
  recipients: jsonb("recipients"), // email recipients
  lastGenerated: timestamp("last_generated"),
  nextScheduled: timestamp("next_scheduled"),
  isActive: boolean("is_active").default(true),
  createdBy: uuid("created_by").references(() => crmAdminUsers.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("crm_scheduled_reports_type_idx").on(table.reportType),
  index("crm_scheduled_reports_schedule_idx").on(table.schedule),
  index("crm_scheduled_reports_next_idx").on(table.nextScheduled),
]);

// Integration & Webhook Logs
export const crmIntegrationLogs = pgTable("crm_integration_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  service: varchar("service").notNull(), // sumsub, sendgrid, twilio, slack, etc.
  endpoint: varchar("endpoint"),
  method: varchar("method"), // GET, POST, PUT, DELETE
  requestData: jsonb("request_data"),
  responseData: jsonb("response_data"),
  statusCode: integer("status_code"),
  responseTime: integer("response_time_ms"),
  success: boolean("success").default(true),
  errorMessage: text("error_message"),
  retryCount: integer("retry_count").default(0),
  customerId: uuid("customer_id").references(() => crmCustomers.id),
  triggeredBy: varchar("triggered_by"), // user_action, automation, scheduled
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("crm_integration_logs_service_idx").on(table.service),
  index("crm_integration_logs_success_idx").on(table.success),
  index("crm_integration_logs_created_idx").on(table.createdAt),
]);

// Referral System
export const crmReferrals = pgTable("crm_referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  referrerId: uuid("referrer_id").references(() => crmCustomers.id).notNull(),
  refereeId: uuid("referee_id").references(() => crmCustomers.id),
  referralCode: varchar("referral_code").notNull(),
  status: varchar("status").default("pending"), // pending, completed, cancelled
  rewardAmount: decimal("reward_amount", { precision: 10, scale: 2 }),
  rewardCurrency: varchar("reward_currency").default("USDT"),
  conversionDate: timestamp("conversion_date"),
  metadata: jsonb("metadata"), // tracking data
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("crm_referrals_referrer_idx").on(table.referrerId),
  index("crm_referrals_code_idx").on(table.referralCode),
]);

// Import users table reference (assuming it exists)
import { users } from "./schema";

// Export types
export type CRMCustomer = typeof crmCustomers.$inferSelect;
export type InsertCRMCustomer = typeof crmCustomers.$inferInsert;
export type CRMCommunication = typeof crmCommunications.$inferSelect;
export type InsertCRMCommunication = typeof crmCommunications.$inferInsert;
export type CRMTransaction = typeof crmTransactions.$inferSelect;
export type InsertCRMTransaction = typeof crmTransactions.$inferInsert;
export type CRMPaymentMethod = typeof crmPaymentMethods.$inferSelect;
export type InsertCRMPaymentMethod = typeof crmPaymentMethods.$inferInsert;
export type CRMSupportTicket = typeof crmSupportTickets.$inferSelect;
export type InsertCRMSupportTicket = typeof crmSupportTickets.$inferInsert;
export type CRMCampaign = typeof crmCampaigns.$inferSelect;
export type InsertCRMCampaign = typeof crmCampaigns.$inferInsert;
export type CRMCustomerAnalytics = typeof crmCustomerAnalytics.$inferSelect;
export type InsertCRMCustomerAnalytics = typeof crmCustomerAnalytics.$inferInsert;
export type CRMComplianceRecord = typeof crmComplianceRecords.$inferSelect;
export type InsertCRMComplianceRecord = typeof crmComplianceRecords.$inferInsert;
export type CRMReferral = typeof crmReferrals.$inferSelect;
export type InsertCRMReferral = typeof crmReferrals.$inferInsert;

// Zod schemas for validation
export const insertCRMCustomerSchema = createInsertSchema(crmCustomers);
export const insertCRMCommunicationSchema = createInsertSchema(crmCommunications);
export const insertCRMTransactionSchema = createInsertSchema(crmTransactions);
export const insertCRMPaymentMethodSchema = createInsertSchema(crmPaymentMethods);
export const insertCRMSupportTicketSchema = createInsertSchema(crmSupportTickets);
export const insertCRMCampaignSchema = createInsertSchema(crmCampaigns);
export const insertCRMComplianceRecordSchema = createInsertSchema(crmComplianceRecords);
export const insertCRMReferralSchema = createInsertSchema(crmReferrals);