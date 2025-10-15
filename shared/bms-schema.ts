import {
  pgTable,
  text,
  varchar,
  integer,
  decimal,
  timestamp,
  boolean,
  jsonb,
  uuid,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums for BMS system
export const departmentEnum = pgEnum("department", [
  "executive", "compliance", "finance", "operations", "security", 
  "support", "legal", "hr", "marketing", "tech"
]);

export const priorityEnum = pgEnum("priority", ["low", "medium", "high", "critical"]);
export const statusEnum = pgEnum("status", ["pending", "in_progress", "completed", "cancelled"]);
export const riskLevelEnum = pgEnum("risk_level", ["low", "medium", "high", "critical"]);
export const incidentSeverityEnum = pgEnum("incident_severity", ["minor", "major", "critical", "catastrophic"]);

// A. Executive Management & Dashboard
export const executiveDashboards = pgTable("executive_dashboards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull(),
  dashboardType: varchar("dashboard_type").notNull(), // "ceo", "coo", "cto", "board"
  widgets: jsonb("widgets").notNull().default('[]'),
  kpiPreferences: jsonb("kpi_preferences").notNull().default('{}'),
  refreshInterval: integer("refresh_interval").default(30), // seconds
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const boardReports = pgTable("board_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportType: varchar("report_type").notNull(), // "monthly", "quarterly", "annual"
  period: varchar("period").notNull(), // "2024-Q1"
  financialData: jsonb("financial_data").notNull(),
  complianceStatus: jsonb("compliance_status").notNull(),
  riskMetrics: jsonb("risk_metrics").notNull(),
  kpiSummary: jsonb("kpi_summary").notNull(),
  generatedBy: varchar("generated_by").notNull(),
  approvedBy: varchar("approved_by"),
  status: statusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
});

// B. User Lifecycle & KYC Management
export const kycWorkflows = pgTable("kyc_workflows", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull(),
  currentStage: varchar("current_stage").notNull(), // "email", "phone", "identity", "address"
  kycLevel: integer("kyc_level").default(0), // 0-3
  riskScore: decimal("risk_score", { precision: 5, scale: 2 }),
  riskLevel: riskLevelEnum("risk_level").default("low"),
  documents: jsonb("documents").default('[]'),
  verificationResults: jsonb("verification_results").default('{}'),
  amlFlags: jsonb("aml_flags").default('[]'),
  sanctionsCheck: jsonb("sanctions_check").default('{}'),
  pepCheck: jsonb("pep_check").default('{}'),
  assignedReviewer: varchar("assigned_reviewer"),
  reviewNotes: text("review_notes"),
  approvedBy: varchar("approved_by"),
  rejectedReason: text("rejected_reason"),
  status: statusEnum("status").default("pending"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userSegments = pgTable("user_segments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull(),
  segmentType: varchar("segment_type").notNull(), // "vip", "retail", "business", "high_risk"
  tierLevel: integer("tier_level").default(1),
  tradingVolume30d: decimal("trading_volume_30d", { precision: 18, scale: 8 }),
  depositAmount30d: decimal("deposit_amount_30d", { precision: 18, scale: 2 }),
  riskFlags: jsonb("risk_flags").default('[]'),
  specialNotes: text("special_notes"),
  assignedManager: varchar("assigned_manager"),
  lastReviewDate: timestamp("last_review_date"),
  nextReviewDate: timestamp("next_review_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// C. Wallet & Treasury Management
export const walletOperations = pgTable("wallet_operations", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletType: varchar("wallet_type").notNull(), // "hot", "cold", "multisig"
  asset: varchar("asset").notNull(),
  operationType: varchar("operation_type").notNull(), // "sweep", "deposit", "withdrawal", "reconciliation"
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  sourceAddress: varchar("source_address"),
  destinationAddress: varchar("destination_address"),
  transactionHash: varchar("transaction_hash"),
  blockNumber: integer("block_number"),
  confirmations: integer("confirmations").default(0),
  requiredConfirmations: integer("required_confirmations").default(6),
  requiredApprovals: integer("required_approvals").default(1),
  currentApprovals: integer("current_approvals").default(0),
  approvers: jsonb("approvers").default('[]'),
  fees: decimal("fees", { precision: 18, scale: 8 }),
  status: statusEnum("status").default("pending"),
  scheduledFor: timestamp("scheduled_for"),
  executedAt: timestamp("executed_at"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const treasuryReports = pgTable("treasury_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportDate: timestamp("report_date").notNull(),
  totalAssets: jsonb("total_assets").notNull(), // {BTC: "123.45", ETH: "678.90"}
  hotWalletBalances: jsonb("hot_wallet_balances").notNull(),
  coldWalletBalances: jsonb("cold_wallet_balances").notNull(),
  customerLiabilities: jsonb("customer_liabilities").notNull(),
  reserveRatio: decimal("reserve_ratio", { precision: 5, scale: 4 }), // 1.05 = 105%
  proofOfReservesHash: varchar("proof_of_reserves_hash"),
  reconciliationStatus: varchar("reconciliation_status").default("pending"),
  discrepancies: jsonb("discrepancies").default('[]'),
  generatedBy: varchar("generated_by").notNull(),
  verifiedBy: varchar("verified_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

// D. Trading Operations & Risk Controls
export const tradingPairControls = pgTable("trading_pair_controls", {
  id: uuid("id").primaryKey().defaultRandom(),
  symbol: varchar("symbol").notNull(), // "BTC/USDT"
  baseAsset: varchar("base_asset").notNull(),
  quoteAsset: varchar("quote_asset").notNull(),
  isActive: boolean("is_active").default(true),
  tickSize: decimal("tick_size", { precision: 18, scale: 8 }),
  minOrderSize: decimal("min_order_size", { precision: 18, scale: 8 }),
  maxOrderSize: decimal("max_order_size", { precision: 18, scale: 8 }),
  circuitBreakerUpper: decimal("circuit_breaker_upper", { precision: 5, scale: 4 }), // 1.10 = 10% up
  circuitBreakerLower: decimal("circuit_breaker_lower", { precision: 5, scale: 4 }), // 0.90 = 10% down
  tradingFees: jsonb("trading_fees").notNull(), // {maker: 0.001, taker: 0.002}
  liquidityProviders: jsonb("liquidity_providers").default('[]'),
  riskLimits: jsonb("risk_limits").default('{}'),
  lastUpdatedBy: varchar("last_updated_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const riskMonitoring = pgTable("risk_monitoring", {
  id: uuid("id").primaryKey().defaultRandom(),
  monitoringType: varchar("monitoring_type").notNull(), // "position", "concentration", "liquidity", "market"
  symbol: varchar("symbol"), // optional, for pair-specific risks
  riskMetric: varchar("risk_metric").notNull(), // "var", "concentration", "leverage"
  currentValue: decimal("current_value", { precision: 18, scale: 8 }),
  threshold: decimal("threshold", { precision: 18, scale: 8 }),
  riskLevel: riskLevelEnum("risk_level").default("low"),
  alertTriggered: boolean("alert_triggered").default(false),
  alertMessage: text("alert_message"),
  assignedTo: varchar("assigned_to"),
  resolvedBy: varchar("resolved_by"),
  resolutionNotes: text("resolution_notes"),
  status: statusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// E. Compliance & Legal Suite
export const complianceReports = pgTable("compliance_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportType: varchar("report_type").notNull(), // "sar", "str", "ctr", "fbar"
  jurisdiction: varchar("jurisdiction").notNull(),
  userId: varchar("user_id"),
  transactionIds: jsonb("transaction_ids").default('[]'),
  suspiciousActivity: text("suspicious_activity").notNull(),
  investigationNotes: text("investigation_notes"),
  riskScore: decimal("risk_score", { precision: 5, scale: 2 }),
  filedWith: varchar("filed_with"), // regulatory body
  filingReference: varchar("filing_reference"),
  filedBy: varchar("filed_by").notNull(),
  approvedBy: varchar("approved_by"),
  dueDate: timestamp("due_date"),
  filedAt: timestamp("filed_at"),
  status: statusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull(),
  action: varchar("action").notNull(), // "login", "trade", "withdrawal", "admin_action"
  resourceType: varchar("resource_type"), // "user", "wallet", "order", "settings"
  resourceId: varchar("resource_id"),
  details: jsonb("details").notNull(),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  sessionId: varchar("session_id"),
  department: departmentEnum("department"),
  riskLevel: riskLevelEnum("risk_level").default("low"),
  flagged: boolean("flagged").default(false),
  reviewedBy: varchar("reviewed_by"),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const legalDocuments = pgTable("legal_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentType: varchar("document_type").notNull(), // "tos", "privacy", "aml", "risk_disclosure"
  title: varchar("title").notNull(),
  version: varchar("version").notNull(),
  content: text("content").notNull(),
  effectiveDate: timestamp("effective_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  approvedBy: varchar("approved_by"),
  jurisdictions: jsonb("jurisdictions").default('[]'), // ["US", "EU", "UK"]
  isActive: boolean("is_active").default(true),
  previousVersionId: uuid("previous_version_id"),
  digitalSignature: text("digital_signature"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
});

// F. CRM & Support Management
export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketNumber: varchar("ticket_number").notNull(),
  userId: varchar("user_id").notNull(),
  category: varchar("category").notNull(), // "account", "trading", "technical", "compliance"
  subcategory: varchar("subcategory"),
  priority: priorityEnum("priority").default("medium"),
  severity: varchar("severity").default("low"), // "low", "medium", "high", "critical"
  subject: varchar("subject").notNull(),
  description: text("description").notNull(),
  status: varchar("status").default("open"), // "open", "pending", "resolved", "closed"
  assignedTo: varchar("assigned_to"),
  assignedTeam: departmentEnum("assigned_team"),
  escalationLevel: integer("escalation_level").default(0),
  slaDeadline: timestamp("sla_deadline"),
  firstResponseTime: timestamp("first_response_time"),
  resolutionTime: timestamp("resolution_time"),
  customerSatisfaction: integer("customer_satisfaction"), // 1-5 rating
  tags: jsonb("tags").default('[]'),
  attachments: jsonb("attachments").default('[]'),
  internalNotes: text("internal_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const ticketMessages = pgTable("ticket_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketId: uuid("ticket_id").notNull().references(() => supportTickets.id),
  senderId: varchar("sender_id").notNull(),
  senderType: varchar("sender_type").notNull(), // "user", "agent", "system"
  message: text("message").notNull(),
  isInternal: boolean("is_internal").default(false),
  attachments: jsonb("attachments").default('[]'),
  readBy: jsonb("read_by").default('[]'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customerProfiles = pgTable("customer_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull(),
  customerTier: varchar("customer_tier").default("standard"), // "standard", "premium", "vip", "enterprise"
  lifetimeValue: decimal("lifetime_value", { precision: 18, scale: 2 }),
  totalTradingVolume: decimal("total_trading_volume", { precision: 18, scale: 8 }),
  averageMonthlyVolume: decimal("average_monthly_volume", { precision: 18, scale: 8 }),
  riskProfile: varchar("risk_profile").default("low"), // "low", "medium", "high"
  preferredCommunication: varchar("preferred_communication").default("email"), // "email", "sms", "phone"
  relationshipManager: varchar("relationship_manager"),
  onboardingDate: timestamp("onboarding_date"),
  lastActivityDate: timestamp("last_activity_date"),
  specialRequirements: text("special_requirements"),
  complianceNotes: text("compliance_notes"),
  marketingOptIn: boolean("marketing_opt_in").default(false),
  vipStatus: boolean("vip_status").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// G. Affiliate & Partnership Management
export const affiliatePrograms = pgTable("affiliate_programs", {
  id: uuid("id").primaryKey().defaultRandom(),
  programName: varchar("program_name").notNull(),
  programType: varchar("program_type").notNull(), // "referral", "partner", "influencer", "institutional"
  commissionStructure: jsonb("commission_structure").notNull(), // {type: "percentage", rate: 0.3, tiers: [...]}
  eligibilityCriteria: jsonb("eligibility_criteria").default('{}'),
  paymentSchedule: varchar("payment_schedule").default("monthly"), // "weekly", "monthly", "quarterly"
  minimumPayout: decimal("minimum_payout", { precision: 18, scale: 2 }).default("100"),
  trackingMethod: varchar("tracking_method").default("code"), // "code", "link", "email"
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const affiliateTracking = pgTable("affiliate_tracking", {
  id: uuid("id").primaryKey().defaultRandom(),
  affiliateId: varchar("affiliate_id").notNull(),
  programId: uuid("program_id").notNull().references(() => affiliatePrograms.id),
  referredUserId: varchar("referred_user_id"),
  referralCode: varchar("referral_code"),
  referralSource: varchar("referral_source"), // "link", "code", "email"
  conversionType: varchar("conversion_type"), // "signup", "deposit", "trade", "kyc"
  conversionValue: decimal("conversion_value", { precision: 18, scale: 2 }),
  commissionEarned: decimal("commission_earned", { precision: 18, scale: 2 }),
  commissionPaid: decimal("commission_paid", { precision: 18, scale: 2 }).default("0"),
  paymentStatus: varchar("payment_status").default("pending"), // "pending", "paid", "cancelled"
  fraudScore: decimal("fraud_score", { precision: 5, scale: 2 }),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
  paidAt: timestamp("paid_at"),
});

// H. Financial Management & Accounting
export const revenueReports = pgTable("revenue_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportPeriod: varchar("report_period").notNull(), // "2024-01", "2024-Q1"
  tradingFees: decimal("trading_fees", { precision: 18, scale: 2 }),
  withdrawalFees: decimal("withdrawal_fees", { precision: 18, scale: 2 }),
  depositFees: decimal("deposit_fees", { precision: 18, scale: 2 }),
  affiliateCommissions: decimal("affiliate_commissions", { precision: 18, scale: 2 }),
  otcRevenue: decimal("otc_revenue", { precision: 18, scale: 2 }),
  stakingRevenue: decimal("staking_revenue", { precision: 18, scale: 2 }),
  listingFees: decimal("listing_fees", { precision: 18, scale: 2 }),
  totalRevenue: decimal("total_revenue", { precision: 18, scale: 2 }),
  revenueByAsset: jsonb("revenue_by_asset").default('{}'),
  revenueByRegion: jsonb("revenue_by_region").default('{}'),
  operatingExpenses: decimal("operating_expenses", { precision: 18, scale: 2 }),
  netProfit: decimal("net_profit", { precision: 18, scale: 2 }),
  generatedBy: varchar("generated_by").notNull(),
  verifiedBy: varchar("verified_by"),
  createdAt: timestamp("created_at").defaultNow(),
  verifiedAt: timestamp("verified_at"),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceNumber: varchar("invoice_number").notNull(),
  clientId: varchar("client_id").notNull(),
  clientType: varchar("client_type").notNull(), // "otc", "institutional", "partner", "vendor"
  invoiceType: varchar("invoice_type").notNull(), // "trading_fees", "otc_commission", "service_fee"
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD"),
  taxAmount: decimal("tax_amount", { precision: 18, scale: 2 }),
  totalAmount: decimal("total_amount", { precision: 18, scale: 2 }).notNull(),
  description: text("description"),
  lineItems: jsonb("line_items").default('[]'),
  paymentTerms: varchar("payment_terms").default("NET30"), // "NET15", "NET30", "DUE_ON_RECEIPT"
  dueDate: timestamp("due_date").notNull(),
  status: varchar("status").default("draft"), // "draft", "sent", "paid", "overdue", "cancelled"
  paidAmount: decimal("paid_amount", { precision: 18, scale: 2 }).default("0"),
  paymentMethod: varchar("payment_method"),
  paymentReference: varchar("payment_reference"),
  issuedBy: varchar("issued_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  sentAt: timestamp("sent_at"),
  paidAt: timestamp("paid_at"),
});

// I. Security & Incident Management
export const securityIncidents = pgTable("security_incidents", {
  id: uuid("id").primaryKey().defaultRandom(),
  incidentType: varchar("incident_type").notNull(), // "breach", "ddos", "fraud", "suspicious_activity"
  severity: incidentSeverityEnum("severity").default("minor"),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  affectedSystems: jsonb("affected_systems").default('[]'),
  affectedUsers: jsonb("affected_users").default('[]'),
  detectedBy: varchar("detected_by"), // "system", "user", "external"
  detectionMethod: varchar("detection_method"),
  assignedTo: varchar("assigned_to"),
  escalationLevel: integer("escalation_level").default(0),
  status: varchar("status").default("open"), // "open", "investigating", "contained", "resolved"
  riskLevel: riskLevelEnum("risk_level").default("medium"),
  estimatedImpact: text("estimated_impact"),
  containmentActions: text("containment_actions"),
  rootCause: text("root_cause"),
  remediationSteps: text("remediation_steps"),
  lessonsLearned: text("lessons_learned"),
  reportedToRegulator: boolean("reported_to_regulator").default(false),
  reportedToLawEnforcement: boolean("reported_to_law_enforcement").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  detectedAt: timestamp("detected_at"),
  containedAt: timestamp("contained_at"),
  resolvedAt: timestamp("resolved_at"),
});

export const securityAlerts = pgTable("security_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  alertType: varchar("alert_type").notNull(), // "login_anomaly", "brute_force", "suspicious_transaction"
  severity: varchar("severity").default("low"), // "low", "medium", "high", "critical"
  userId: varchar("user_id"),
  ipAddress: varchar("ip_address"),
  description: text("description").notNull(),
  riskScore: decimal("risk_score", { precision: 5, scale: 2 }),
  detectionRules: jsonb("detection_rules").default('[]'),
  rawData: jsonb("raw_data").default('{}'),
  isAutoResolved: boolean("is_auto_resolved").default(false),
  assignedTo: varchar("assigned_to"),
  investigationNotes: text("investigation_notes"),
  resolution: text("resolution"),
  status: varchar("status").default("open"), // "open", "investigating", "resolved", "false_positive"
  createdAt: timestamp("created_at").defaultNow(),
  acknowledgedAt: timestamp("acknowledged_at"),
  resolvedAt: timestamp("resolved_at"),
});

// J. Analytics & Reporting
export const customDashboards = pgTable("custom_dashboards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull(),
  dashboardName: varchar("dashboard_name").notNull(),
  department: departmentEnum("department"),
  layout: jsonb("layout").notNull(), // widget positions and configurations
  dataFilters: jsonb("data_filters").default('{}'),
  refreshInterval: integer("refresh_interval").default(300), // seconds
  isPublic: boolean("is_public").default(false),
  sharedWith: jsonb("shared_with").default('[]'), // user IDs
  lastViewedAt: timestamp("last_viewed_at"),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const systemAlerts = pgTable("system_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  alertName: varchar("alert_name").notNull(),
  alertType: varchar("alert_type").notNull(), // "threshold", "anomaly", "system", "business"
  department: departmentEnum("department"),
  metric: varchar("metric").notNull(), // "trading_volume", "kyc_backlog", "system_latency"
  thresholdValue: decimal("threshold_value", { precision: 18, scale: 8 }),
  currentValue: decimal("current_value", { precision: 18, scale: 8 }),
  comparisonOperator: varchar("comparison_operator").notNull(), // "gt", "lt", "eq", "gte", "lte"
  priority: priorityEnum("priority").default("medium"),
  isActive: boolean("is_active").default(true),
  notificationChannels: jsonb("notification_channels").default('[]'), // ["email", "sms", "slack", "telegram"]
  recipients: jsonb("recipients").default('[]'), // user IDs or email addresses
  escalationRules: jsonb("escalation_rules").default('{}'),
  suppressionRules: jsonb("suppression_rules").default('{}'),
  lastTriggered: timestamp("last_triggered"),
  triggerCount: integer("trigger_count").default(0),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// K. HR & Internal Operations
export const staffDirectory = pgTable("staff_directory", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: varchar("employee_id").notNull(),
  userId: varchar("user_id").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  department: departmentEnum("department").notNull(),
  position: varchar("position").notNull(),
  level: varchar("level"), // "junior", "senior", "lead", "manager", "director"
  directManager: varchar("direct_manager"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: varchar("status").default("active"), // "active", "inactive", "terminated"
  accessLevel: integer("access_level").default(1), // 1-5, higher = more access
  permissions: jsonb("permissions").default('[]'),
  lastLogin: timestamp("last_login"),
  workLocation: varchar("work_location"), // "remote", "office", "hybrid"
  phoneNumber: varchar("phone_number"),
  emergencyContact: jsonb("emergency_contact").default('{}'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const performanceMetrics = pgTable("performance_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: varchar("employee_id").notNull(),
  metricType: varchar("metric_type").notNull(), // "kpi", "sla", "quality", "productivity"
  metricName: varchar("metric_name").notNull(),
  targetValue: decimal("target_value", { precision: 18, scale: 4 }),
  actualValue: decimal("actual_value", { precision: 18, scale: 4 }),
  unit: varchar("unit"), // "percentage", "number", "time", "currency"
  period: varchar("period").notNull(), // "2024-01", "2024-Q1"
  score: decimal("score", { precision: 5, scale: 2 }), // calculated performance score
  notes: text("notes"),
  reviewedBy: varchar("reviewed_by"),
  createdAt: timestamp("created_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

// Type exports
export type ExecutiveDashboard = typeof executiveDashboards.$inferSelect;
export type InsertExecutiveDashboard = typeof executiveDashboards.$inferInsert;

export type BoardReport = typeof boardReports.$inferSelect;
export type InsertBoardReport = typeof boardReports.$inferInsert;

export type KycWorkflow = typeof kycWorkflows.$inferSelect;
export type InsertKycWorkflow = typeof kycWorkflows.$inferInsert;

export type UserSegment = typeof userSegments.$inferSelect;
export type InsertUserSegment = typeof userSegments.$inferInsert;

export type WalletOperation = typeof walletOperations.$inferSelect;
export type InsertWalletOperation = typeof walletOperations.$inferInsert;

export type TreasuryReport = typeof treasuryReports.$inferSelect;
export type InsertTreasuryReport = typeof treasuryReports.$inferInsert;

export type TradingPairControl = typeof tradingPairControls.$inferSelect;
export type InsertTradingPairControl = typeof tradingPairControls.$inferInsert;

export type RiskMonitoring = typeof riskMonitoring.$inferSelect;
export type InsertRiskMonitoring = typeof riskMonitoring.$inferInsert;

export type ComplianceReport = typeof complianceReports.$inferSelect;
export type InsertComplianceReport = typeof complianceReports.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

export type LegalDocument = typeof legalDocuments.$inferSelect;
export type InsertLegalDocument = typeof legalDocuments.$inferInsert;

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

export type TicketMessage = typeof ticketMessages.$inferSelect;
export type InsertTicketMessage = typeof ticketMessages.$inferInsert;

export type CustomerProfile = typeof customerProfiles.$inferSelect;
export type InsertCustomerProfile = typeof customerProfiles.$inferInsert;

export type AffiliateProgram = typeof affiliatePrograms.$inferSelect;
export type InsertAffiliateProgram = typeof affiliatePrograms.$inferInsert;

export type AffiliateTracking = typeof affiliateTracking.$inferSelect;
export type InsertAffiliateTracking = typeof affiliateTracking.$inferInsert;

export type RevenueReport = typeof revenueReports.$inferSelect;
export type InsertRevenueReport = typeof revenueReports.$inferInsert;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

export type SecurityIncident = typeof securityIncidents.$inferSelect;
export type InsertSecurityIncident = typeof securityIncidents.$inferInsert;

export type SecurityAlert = typeof securityAlerts.$inferSelect;
export type InsertSecurityAlert = typeof securityAlerts.$inferInsert;

export type CustomDashboard = typeof customDashboards.$inferSelect;
export type InsertCustomDashboard = typeof customDashboards.$inferInsert;

export type SystemAlert = typeof systemAlerts.$inferSelect;
export type InsertSystemAlert = typeof systemAlerts.$inferInsert;

export type StaffDirectory = typeof staffDirectory.$inferSelect;
export type InsertStaffDirectory = typeof staffDirectory.$inferInsert;

export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetric = typeof performanceMetrics.$inferInsert;

// Insert schemas
export const insertExecutiveDashboardSchema = createInsertSchema(executiveDashboards);
export const insertBoardReportSchema = createInsertSchema(boardReports);
export const insertKycWorkflowSchema = createInsertSchema(kycWorkflows);
export const insertUserSegmentSchema = createInsertSchema(userSegments);
export const insertWalletOperationSchema = createInsertSchema(walletOperations);
export const insertTreasuryReportSchema = createInsertSchema(treasuryReports);
export const insertTradingPairControlSchema = createInsertSchema(tradingPairControls);
export const insertRiskMonitoringSchema = createInsertSchema(riskMonitoring);
export const insertComplianceReportSchema = createInsertSchema(complianceReports);
export const insertAuditLogSchema = createInsertSchema(auditLogs);
export const insertLegalDocumentSchema = createInsertSchema(legalDocuments);
export const insertSupportTicketSchema = createInsertSchema(supportTickets);
export const insertTicketMessageSchema = createInsertSchema(ticketMessages);
export const insertCustomerProfileSchema = createInsertSchema(customerProfiles);
export const insertAffiliateProgramSchema = createInsertSchema(affiliatePrograms);
export const insertAffiliateTrackingSchema = createInsertSchema(affiliateTracking);
export const insertRevenueReportSchema = createInsertSchema(revenueReports);
export const insertInvoiceSchema = createInsertSchema(invoices);
export const insertSecurityIncidentSchema = createInsertSchema(securityIncidents);
export const insertSecurityAlertSchema = createInsertSchema(securityAlerts);
export const insertCustomDashboardSchema = createInsertSchema(customDashboards);
export const insertSystemAlertSchema = createInsertSchema(systemAlerts);
export const insertStaffDirectorySchema = createInsertSchema(staffDirectory);
export const insertPerformanceMetricSchema = createInsertSchema(performanceMetrics);