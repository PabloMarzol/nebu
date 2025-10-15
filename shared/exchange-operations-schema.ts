import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  decimal,
  integer,
  boolean,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ======= LIQUIDITY MANAGEMENT TABLES =======

export const liquidityProviders = pgTable("liquidity_providers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // market_maker, institutional, automated
  status: varchar("status", { length: 50 }).notNull(), // active, inactive, suspended
  contactInfo: jsonb("contact_info").$type<{
    email: string;
    phone?: string;
    primaryContact: string;
    company: string;
  }>(),
  tradingPairs: jsonb("trading_pairs").$type<string[]>(),
  minimumSpread: decimal("minimum_spread", { precision: 10, scale: 4 }),
  volume30d: decimal("volume_30d", { precision: 20, scale: 8 }),
  performance: jsonb("performance").$type<{
    uptime: number;
    avgSpread: number;
    fillRate: number;
    latency: number;
  }>(),
  feeStructure: jsonb("fee_structure").$type<{
    makerFee: number;
    takerFee: number;
    volumeDiscount: number;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const liquidityPools = pgTable("liquidity_pools", {
  id: uuid("id").primaryKey().defaultRandom(),
  pair: varchar("pair", { length: 20 }).notNull(),
  providerId: uuid("provider_id").references(() => liquidityProviders.id),
  totalLiquidity: decimal("total_liquidity", { precision: 20, scale: 8 }),
  bidLiquidity: decimal("bid_liquidity", { precision: 20, scale: 8 }),
  askLiquidity: decimal("ask_liquidity", { precision: 20, scale: 8 }),
  spread: decimal("spread", { precision: 10, scale: 4 }),
  lastUpdate: timestamp("last_update").defaultNow(),
  performance: jsonb("performance").$type<{
    volume24h: number;
    trades24h: number;
    avgSpread: number;
    depth: number;
  }>(),
  alerts: jsonb("alerts").$type<{
    lowLiquidity: boolean;
    highSpread: boolean;
    providerOffline: boolean;
  }>(),
});

// ======= REGULATORY COMPLIANCE TABLES =======

export const complianceMonitoring = pgTable("compliance_monitoring", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull(),
  transactionId: uuid("transaction_id"),
  type: varchar("type", { length: 50 }).notNull(), // aml, kyc, sanctions, suspicious_activity
  status: varchar("status", { length: 50 }).notNull(), // pending, reviewed, flagged, cleared
  priority: varchar("priority", { length: 20 }).notNull(), // low, medium, high, urgent
  riskScore: integer("risk_score"),
  flags: jsonb("flags").$type<string[]>(),
  details: jsonb("details").$type<{
    amount?: number;
    currency?: string;
    counterparty?: string;
    location?: string;
    reason: string;
    evidence: string[];
  }>(),
  assignedTo: varchar("assigned_to"),
  reviewedAt: timestamp("reviewed_at"),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const regulatoryReports = pgTable("regulatory_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type", { length: 50 }).notNull(), // sar, ctr, fbar, mifid, fatf
  jurisdiction: varchar("jurisdiction", { length: 50 }).notNull(),
  reportingPeriod: varchar("reporting_period", { length: 50 }),
  status: varchar("status", { length: 50 }).notNull(), // draft, pending, submitted, approved
  dueDate: timestamp("due_date"),
  submittedDate: timestamp("submitted_date"),
  data: jsonb("data").$type<{
    transactions: number;
    volume: number;
    suspiciousActivities: number;
    newUsers: number;
  }>(),
  fileLocation: varchar("file_location"),
  submittedBy: varchar("submitted_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ======= INSTITUTIONAL OPERATIONS TABLES =======

export const institutionalClients = pgTable("institutional_clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // hedge_fund, family_office, corporation, bank
  tier: varchar("tier", { length: 20 }).notNull(), // tier1, tier2, tier3
  status: varchar("status", { length: 50 }).notNull(),
  contactInfo: jsonb("contact_info").$type<{
    primaryContact: string;
    email: string;
    phone: string;
    address: string;
    country: string;
  }>(),
  tradingLimits: jsonb("trading_limits").$type<{
    dailyLimit: number;
    monthlyLimit: number;
    perTradeLimit: number;
    leverageLimit: number;
  }>(),
  services: jsonb("services").$type<{
    otcDesk: boolean;
    primeServices: boolean;
    custody: boolean;
    lending: boolean;
    derivatives: boolean;
  }>(),
  feeStructure: jsonb("fee_structure").$type<{
    tradingFees: number;
    custodyFees: number;
    withdrawalFees: number;
  }>(),
  volume30d: decimal("volume_30d", { precision: 20, scale: 8 }),
  lastActivity: timestamp("last_activity"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const otcDeals = pgTable("otc_deals", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").references(() => institutionalClients.id),
  type: varchar("type", { length: 50 }).notNull(), // spot, forward, swap, option
  side: varchar("side", { length: 10 }).notNull(), // buy, sell
  baseCurrency: varchar("base_currency", { length: 10 }).notNull(),
  quoteCurrency: varchar("quote_currency", { length: 10 }).notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  price: decimal("price", { precision: 20, scale: 8 }),
  totalValue: decimal("total_value", { precision: 20, scale: 8 }),
  status: varchar("status", { length: 50 }).notNull(), // quoted, negotiating, agreed, settled, cancelled
  executionDate: timestamp("execution_date"),
  settlementDate: timestamp("settlement_date"),
  counterparty: varchar("counterparty"),
  assignedTrader: varchar("assigned_trader").notNull(),
  margin: decimal("margin", { precision: 20, scale: 8 }),
  fees: decimal("fees", { precision: 20, scale: 8 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ======= TREASURY MANAGEMENT TABLES =======

export const treasuryAccounts = pgTable("treasury_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // hot_wallet, cold_wallet, exchange, bank
  currency: varchar("currency", { length: 10 }).notNull(),
  balance: decimal("balance", { precision: 20, scale: 8 }).notNull(),
  availableBalance: decimal("available_balance", { precision: 20, scale: 8 }),
  reservedBalance: decimal("reserved_balance", { precision: 20, scale: 8 }),
  address: varchar("address"),
  provider: varchar("provider"),
  status: varchar("status", { length: 50 }).notNull(),
  lastReconciled: timestamp("last_reconciled"),
  reconciliationStatus: varchar("reconciliation_status", { length: 50 }),
  alerts: jsonb("alerts").$type<{
    lowBalance: boolean;
    highOutflow: boolean;
    reconciliationFailed: boolean;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const treasuryTransactions = pgTable("treasury_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id").references(() => treasuryAccounts.id),
  type: varchar("type", { length: 50 }).notNull(), // deposit, withdrawal, transfer, fee
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  txHash: varchar("tx_hash"),
  blockNumber: integer("block_number"),
  confirmations: integer("confirmations"),
  fromAddress: varchar("from_address"),
  toAddress: varchar("to_address"),
  purpose: varchar("purpose"),
  approvedBy: varchar("approved_by"),
  executedBy: varchar("executed_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ======= RISK MANAGEMENT TABLES =======

export const riskProfiles = pgTable("risk_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  entityId: varchar("entity_id").notNull(), // user or institution id
  entityType: varchar("entity_type", { length: 50 }).notNull(), // user, institution, liquidity_provider
  riskScore: integer("risk_score").notNull(),
  riskLevel: varchar("risk_level", { length: 20 }).notNull(), // low, medium, high, extreme
  limits: jsonb("limits").$type<{
    dailyTrading: number;
    monthlyTrading: number;
    maxPosition: number;
    leverage: number;
  }>(),
  factors: jsonb("factors").$type<{
    geographic: number;
    transactional: number;
    behavioral: number;
    compliance: number;
  }>(),
  alerts: jsonb("alerts").$type<{
    limitBreached: boolean;
    suspiciousActivity: boolean;
    concentrationRisk: boolean;
  }>(),
  lastAssessed: timestamp("last_assessed"),
  assessedBy: varchar("assessed_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const riskEvents = pgTable("risk_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  entityId: varchar("entity_id").notNull(),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  severity: varchar("severity", { length: 20 }).notNull(), // low, medium, high, critical
  status: varchar("status", { length: 50 }).notNull(), // active, investigating, mitigated, resolved
  description: text("description").notNull(),
  impact: jsonb("impact").$type<{
    financial: number;
    operational: string;
    reputational: string;
  }>(),
  mitigation: text("mitigation"),
  assignedTo: varchar("assigned_to"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ======= OPERATIONAL TRACKING TABLES =======

export const operationalIncidents = pgTable("operational_incidents", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // technical, compliance, security, operational
  severity: varchar("severity", { length: 20 }).notNull(), // low, medium, high, critical
  status: varchar("status", { length: 50 }).notNull(), // reported, investigating, fixing, resolved
  description: text("description").notNull(),
  affectedSystems: jsonb("affected_systems").$type<string[]>(),
  impact: jsonb("impact").$type<{
    usersAffected: number;
    servicesDown: string[];
    financialImpact: number;
  }>(),
  resolution: text("resolution"),
  assignedTo: varchar("assigned_to"),
  reportedBy: varchar("reported_by"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const systemHealth = pgTable("system_health", {
  id: uuid("id").primaryKey().defaultRandom(),
  service: varchar("service", { length: 100 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(), // healthy, degraded, down
  metrics: jsonb("metrics").$type<{
    uptime: number;
    latency: number;
    errorRate: number;
    throughput: number;
  }>(),
  alerts: jsonb("alerts").$type<{
    highLatency: boolean;
    highErrorRate: boolean;
    serviceDown: boolean;
  }>(),
  lastCheck: timestamp("last_check").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ======= SCHEMA EXPORTS =======

export const insertLiquidityProviderSchema = createInsertSchema(liquidityProviders);
export const insertLiquidityPoolSchema = createInsertSchema(liquidityPools);
export const insertComplianceMonitoringSchema = createInsertSchema(complianceMonitoring);
export const insertRegulatoryReportSchema = createInsertSchema(regulatoryReports);
export const insertInstitutionalClientSchema = createInsertSchema(institutionalClients);
export const insertOtcDealSchema = createInsertSchema(otcDeals);
export const insertTreasuryAccountSchema = createInsertSchema(treasuryAccounts);
export const insertTreasuryTransactionSchema = createInsertSchema(treasuryTransactions);
export const insertRiskProfileSchema = createInsertSchema(riskProfiles);
export const insertRiskEventSchema = createInsertSchema(riskEvents);
export const insertOperationalIncidentSchema = createInsertSchema(operationalIncidents);
export const insertSystemHealthSchema = createInsertSchema(systemHealth);

// ======= TYPE EXPORTS =======

export type LiquidityProvider = typeof liquidityProviders.$inferSelect;
export type InsertLiquidityProvider = z.infer<typeof insertLiquidityProviderSchema>;
export type LiquidityPool = typeof liquidityPools.$inferSelect;
export type InsertLiquidityPool = z.infer<typeof insertLiquidityPoolSchema>;

export type ComplianceMonitoring = typeof complianceMonitoring.$inferSelect;
export type InsertComplianceMonitoring = z.infer<typeof insertComplianceMonitoringSchema>;
export type RegulatoryReport = typeof regulatoryReports.$inferSelect;
export type InsertRegulatoryReport = z.infer<typeof insertRegulatoryReportSchema>;

export type InstitutionalClient = typeof institutionalClients.$inferSelect;
export type InsertInstitutionalClient = z.infer<typeof insertInstitutionalClientSchema>;
export type OtcDeal = typeof otcDeals.$inferSelect;
export type InsertOtcDeal = z.infer<typeof insertOtcDealSchema>;

export type TreasuryAccount = typeof treasuryAccounts.$inferSelect;
export type InsertTreasuryAccount = z.infer<typeof insertTreasuryAccountSchema>;
export type TreasuryTransaction = typeof treasuryTransactions.$inferSelect;
export type InsertTreasuryTransaction = z.infer<typeof insertTreasuryTransactionSchema>;

export type RiskProfile = typeof riskProfiles.$inferSelect;
export type InsertRiskProfile = z.infer<typeof insertRiskProfileSchema>;
export type RiskEvent = typeof riskEvents.$inferSelect;
export type InsertRiskEvent = z.infer<typeof insertRiskEventSchema>;

export type OperationalIncident = typeof operationalIncidents.$inferSelect;
export type InsertOperationalIncident = z.infer<typeof insertOperationalIncidentSchema>;
export type SystemHealth = typeof systemHealth.$inferSelect;
export type InsertSystemHealth = z.infer<typeof insertSystemHealthSchema>;