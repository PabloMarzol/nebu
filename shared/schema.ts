import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  decimal,
  timestamp,
  varchar,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  
  // Authentication fields
  passwordHash: varchar("password_hash"),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: varchar("email_verification_token"),
  passwordResetToken: varchar("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  
  // 2FA fields
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: varchar("two_factor_secret"),
  twoFactorBackupCodes: text("two_factor_backup_codes").array(),
  
  // KYC and account status
  kycStatus: varchar("kyc_status").default("none"), // none, pending, approved, rejected
  kycLevel: integer("kyc_level").default(0), // 0, 1, 2, 3
  accountTier: varchar("account_tier").default("basic"), // basic, verified, premium, institutional
  
  // Account limits based on tier
  dailyTradingLimit: varchar("daily_trading_limit").default("1000"),
  dailyWithdrawalLimit: varchar("daily_withdrawal_limit").default("500"),
  withdrawalLimit: decimal("withdrawal_limit", { precision: 18, scale: 2 }).default("1000"),
  tradingPermissions: jsonb("trading_permissions").default("{}"), // spot, futures, options
  riskProfile: varchar("risk_profile").default("conservative"), // conservative, moderate, aggressive
  
  // Phone verification
  phoneNumber: varchar("phone_number"),
  phoneVerified: boolean("phone_verified").default(false),
  phoneVerificationCode: varchar("phone_verification_code"),
  phoneVerificationExpires: timestamp("phone_verification_expires"),
  smsNotifications: boolean("sms_notifications").default(true),
  
  // Account status
  accountStatus: varchar("account_status").default("active"), // active, suspended, closed
  lastLoginAt: timestamp("last_login_at"),
  loginAttempts: integer("login_attempts").default(0),
  lockedUntil: timestamp("locked_until"),
  
  // External integrations
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  symbol: text("symbol").notNull(),
  balance: decimal("balance", { precision: 18, scale: 8 }).notNull(),
  lockedBalance: decimal("locked_balance", { precision: 18, scale: 8 }).default("0"),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  symbol: text("symbol").notNull(),
  side: text("side").notNull(), // 'buy' or 'sell'
  type: text("type").notNull(), // 'market', 'limit', 'stop'
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  price: decimal("price", { precision: 18, scale: 8 }),
  status: text("status").notNull().default("pending"), // 'pending', 'filled', 'cancelled'
  createdAt: timestamp("created_at").defaultNow()
});

export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  buyOrderId: integer("buy_order_id").references(() => orders.id).notNull(),
  sellOrderId: integer("sell_order_id").references(() => orders.id).notNull(),
  symbol: text("symbol").notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Staking positions
export const stakingPositions = pgTable("staking_positions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  asset: varchar("asset").notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  stakingType: varchar("staking_type").notNull(), // flexible, fixed
  duration: integer("duration"), // days for fixed staking
  apy: decimal("apy", { precision: 5, scale: 2 }).notNull(),
  rewards: decimal("rewards", { precision: 18, scale: 8 }).default("0"),
  status: varchar("status").default("active"), // active, unstaking, completed
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow()
});

// P2P Orders
export const p2pOrders = pgTable("p2p_orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type").notNull(), // buy, sell
  asset: varchar("asset").notNull(),
  fiatCurrency: varchar("fiat_currency").notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  price: decimal("price", { precision: 18, scale: 2 }).notNull(),
  paymentMethods: jsonb("payment_methods").notNull(),
  minLimit: decimal("min_limit", { precision: 18, scale: 2 }),
  maxLimit: decimal("max_limit", { precision: 18, scale: 2 }),
  terms: text("terms"),
  status: varchar("status").default("active"), // active, completed, cancelled
  createdAt: timestamp("created_at").defaultNow()
});

// P2P Trades
export const p2pTrades = pgTable("p2p_trades", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => p2pOrders.id).notNull(),
  buyerId: varchar("buyer_id").references(() => users.id).notNull(),
  sellerId: varchar("seller_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  fiatAmount: decimal("fiat_amount", { precision: 18, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method").notNull(),
  status: varchar("status").default("pending"), // pending, paid, completed, disputed, cancelled
  escrowReleased: boolean("escrow_released").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// OTC Deals
export const otcDeals = pgTable("otc_deals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type").notNull(), // buy, sell
  asset: varchar("asset").notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  price: decimal("price", { precision: 18, scale: 8 }),
  totalValue: decimal("total_value", { precision: 18, scale: 2 }).notNull(),
  minCounterpartyRating: decimal("min_counterparty_rating", { precision: 3, scale: 1 }).default("0"),
  visibility: varchar("visibility").default("public"), // public, private, institutional
  escrowRequired: boolean("escrow_required").default(true),
  kycRequired: boolean("kyc_required").default(true),
  institutionalOnly: boolean("institutional_only").default(false),
  status: varchar("status").default("pending"), // pending, matched, executing, completed, cancelled
  expiresAt: timestamp("expires_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});

// Launchpad Projects
export const launchpadProjects = pgTable("launchpad_projects", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  symbol: varchar("symbol").notNull(),
  description: text("description"),
  longDescription: text("long_description"),
  category: varchar("category").notNull(),
  logo: varchar("logo"),
  website: varchar("website"),
  whitepaper: varchar("whitepaper"),
  totalSupply: decimal("total_supply", { precision: 30, scale: 0 }).notNull(),
  launchPrice: decimal("launch_price", { precision: 18, scale: 8 }).notNull(),
  targetRaise: decimal("target_raise", { precision: 18, scale: 2 }).notNull(),
  currentRaise: decimal("current_raise", { precision: 18, scale: 2 }).default("0"),
  maxParticipants: integer("max_participants"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: varchar("status").default("upcoming"), // upcoming, live, completed, cancelled
  allocation: jsonb("allocation"), // public, private, team percentages
  vestingSchedule: text("vesting_schedule"),
  minimumBuy: decimal("minimum_buy", { precision: 18, scale: 2 }),
  maximumBuy: decimal("maximum_buy", { precision: 18, scale: 2 }),
  chainId: varchar("chain_id"),
  contractAddress: varchar("contract_address"),
  socialLinks: jsonb("social_links"),
  team: jsonb("team"),
  roadmap: jsonb("roadmap"),
  tokenomics: jsonb("tokenomics"),
  riskFactors: jsonb("risk_factors"),
  highlights: jsonb("highlights"),
  createdAt: timestamp("created_at").defaultNow()
});

// Launchpad Participations
export const launchpadParticipations = pgTable("launchpad_participations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => launchpadProjects.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  tokensAllocated: decimal("tokens_allocated", { precision: 18, scale: 8 }),
  status: varchar("status").default("pending"), // pending, confirmed, cancelled
  tier: varchar("tier"), // bronze, silver, gold, platinum
  createdAt: timestamp("created_at").defaultNow()
});

// Copy Trading
export const copyTradingMasters = pgTable("copy_trading_masters", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  displayName: varchar("display_name").notNull(),
  bio: text("bio"),
  verified: boolean("verified").default(false),
  tier: varchar("tier").default("bronze"), // bronze, silver, gold, platinum, diamond
  totalReturn: decimal("total_return", { precision: 10, scale: 2 }).default("0"),
  monthlyReturn: decimal("monthly_return", { precision: 10, scale: 2 }).default("0"),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).default("0"),
  followers: integer("followers").default(0),
  aum: decimal("aum", { precision: 18, scale: 2 }).default("0"), // assets under management
  maxDrawdown: decimal("max_drawdown", { precision: 5, scale: 2 }).default("0"),
  tradingStyle: varchar("trading_style"),
  riskScore: integer("risk_score").default(5), // 1-10
  avgTradeDuration: varchar("avg_trade_duration"),
  copyFee: decimal("copy_fee", { precision: 5, scale: 2 }).default("0"), // percentage
  minCopyAmount: decimal("min_copy_amount", { precision: 18, scale: 2 }).default("100"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Copy Trading Followers
export const copyTradingFollows = pgTable("copy_trading_follows", {
  id: serial("id").primaryKey(),
  followerId: varchar("follower_id").references(() => users.id).notNull(),
  masterId: integer("master_id").references(() => copyTradingMasters.id).notNull(),
  copyRatio: decimal("copy_ratio", { precision: 5, scale: 2 }).default("100"), // percentage
  maxCopyAmount: decimal("max_copy_amount", { precision: 18, scale: 2 }),
  stopLoss: decimal("stop_loss", { precision: 5, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// KYC Verifications
export const kycVerifications = pgTable("kyc_verifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  level: integer("level").notNull(), // 1, 2, 3
  documentType: varchar("document_type"), // passport, driver_license, national_id
  documentNumber: varchar("document_number"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  dateOfBirth: timestamp("date_of_birth"),
  nationality: varchar("nationality"),
  address: text("address"),
  city: varchar("city"),
  country: varchar("country"),
  postalCode: varchar("postal_code"),
  phoneNumber: varchar("phone_number"),
  status: varchar("status").default("pending"), // pending, approved, rejected, expired
  rejectionReason: text("rejection_reason"),
  expiresAt: timestamp("expires_at"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow()
});

// Market Data (for caching)
export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol").notNull(),
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  change24h: decimal("change_24h", { precision: 10, scale: 4 }),
  volume24h: decimal("volume_24h", { precision: 18, scale: 2 }),
  marketCap: decimal("market_cap", { precision: 20, scale: 2 }),
  high24h: decimal("high_24h", { precision: 18, scale: 8 }),
  low24h: decimal("low_24h", { precision: 18, scale: 8 }),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
}).extend({
  price: z.string().optional(),
});

export const insertStakingPositionSchema = createInsertSchema(stakingPositions).omit({
  id: true,
  createdAt: true,
  startDate: true,
});

export const insertP2POrderSchema = createInsertSchema(p2pOrders).omit({
  id: true,
  createdAt: true,
});

export const insertOTCDealSchema = createInsertSchema(otcDeals).omit({
  id: true,
  createdAt: true,
});

export const insertLaunchpadProjectSchema = createInsertSchema(launchpadProjects).omit({
  id: true,
  createdAt: true,
  currentRaise: true,
});

export const insertKYCVerificationSchema = createInsertSchema(kycVerifications).omit({
  id: true,
  createdAt: true,
  verifiedAt: true,
});

// Enhanced Business Operations Tables for Admin Panels

// Admin Panel - User KYC Queue Management
export const kycQueue = pgTable("kyc_queue", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  kycLevel: integer("kyc_level").notNull(),
  status: varchar("status").default("pending"), // pending, under_review, approved, rejected
  priority: varchar("priority").default("normal"), // low, normal, high, urgent
  assignedTo: varchar("assigned_to"), // admin user ID
  documentScans: jsonb("document_scans").default("{}"),
  livenessCheck: jsonb("liveness_check").default("{}"),
  riskFlags: text("risk_flags").array().default([]),
  adminNotes: text("admin_notes"),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// AML/Sanctions Monitoring
export const amlAlerts = pgTable("aml_alerts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  alertType: varchar("alert_type").notNull(), // high_risk_transaction, sanctions_match, velocity_check
  severity: varchar("severity").default("medium"), // low, medium, high, critical
  transactionId: varchar("transaction_id"),
  amount: decimal("amount", { precision: 18, scale: 2 }),
  currency: varchar("currency"),
  flagReason: text("flag_reason").notNull(),
  status: varchar("status").default("open"), // open, investigating, resolved, false_positive
  assignedTo: varchar("assigned_to"),
  sarGenerated: boolean("sar_generated").default(false),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by"),
  createdAt: timestamp("created_at").defaultNow()
});

// SAR/STR Reports
export const sarReports = pgTable("sar_reports", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  reportType: varchar("report_type").notNull(), // SAR, STR, CTR
  reportNumber: varchar("report_number").unique().notNull(),
  status: varchar("status").default("draft"), // draft, submitted, acknowledged
  filingDate: timestamp("filing_date"),
  regulatoryBody: varchar("regulatory_body"), // FinCEN, FCA, etc.
  suspiciousActivity: text("suspicious_activity").notNull(),
  transactionDetails: jsonb("transaction_details").default("{}"),
  narrativeDescription: text("narrative_description"),
  attachments: jsonb("attachments").default("[]"),
  submittedBy: varchar("submitted_by"),
  createdAt: timestamp("created_at").defaultNow()
});

// Audit Trails
export const auditTrails = pgTable("audit_trails", {
  id: serial("id").primaryKey(),
  entityType: varchar("entity_type").notNull(), // user, kyc, transaction, admin_action
  entityId: varchar("entity_id").notNull(),
  action: varchar("action").notNull(), // create, update, delete, approve, reject
  changes: jsonb("changes").default("{}"),
  oldValues: jsonb("old_values").default("{}"),
  newValues: jsonb("new_values").default("{}"),
  performedBy: varchar("performed_by").notNull(),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address"),
  sessionId: varchar("session_id"),
  createdAt: timestamp("created_at").defaultNow()
});

// Finance & Treasury - Wallet Management
export const walletBalances = pgTable("wallet_balances", {
  id: serial("id").primaryKey(),
  walletType: varchar("wallet_type").notNull(), // hot, cold, exchange
  asset: varchar("asset").notNull(),
  address: varchar("address").notNull(),
  balance: decimal("balance", { precision: 30, scale: 18 }).notNull(),
  lockedBalance: decimal("locked_balance", { precision: 30, scale: 18 }).default("0"),
  pendingDeposits: decimal("pending_deposits", { precision: 30, scale: 18 }).default("0"),
  pendingWithdrawals: decimal("pending_withdrawals", { precision: 30, scale: 18 }).default("0"),
  lastReconciled: timestamp("last_reconciled"),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Withdrawal Approval Queue
export const withdrawalQueue = pgTable("withdrawal_queue", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  asset: varchar("asset").notNull(),
  amount: decimal("amount", { precision: 30, scale: 18 }).notNull(),
  destinationAddress: varchar("destination_address").notNull(),
  status: varchar("status").default("pending"), // pending, approved, rejected, processing, completed
  priority: varchar("priority").default("normal"), // low, normal, high, urgent
  riskScore: integer("risk_score").default(0),
  requiresMultiSig: boolean("requires_multi_sig").default(false),
  approvals: jsonb("approvals").default("[]"), // array of admin approvals
  requiredApprovals: integer("required_approvals").default(1),
  rejectionReason: text("rejection_reason"),
  transactionHash: varchar("transaction_hash"),
  networkFee: decimal("network_fee", { precision: 30, scale: 18 }),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow()
});

// Revenue Analytics
export const revenueMetrics = pgTable("revenue_metrics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  tradingFees: decimal("trading_fees", { precision: 18, scale: 2 }).default("0"),
  withdrawalFees: decimal("withdrawal_fees", { precision: 18, scale: 2 }).default("0"),
  spreadIncome: decimal("spread_income", { precision: 18, scale: 2 }).default("0"),
  otcRevenue: decimal("otc_revenue", { precision: 18, scale: 2 }).default("0"),
  listingFees: decimal("listing_fees", { precision: 18, scale: 2 }).default("0"),
  affiliatePayouts: decimal("affiliate_payouts", { precision: 18, scale: 2 }).default("0"),
  totalRevenue: decimal("total_revenue", { precision: 18, scale: 2 }).default("0"),
  activeUsers: integer("active_users").default(0),
  tradingVolume: decimal("trading_volume", { precision: 30, scale: 18 }).default("0"),
  createdAt: timestamp("created_at").defaultNow()
});

// Trading Operations - Market Making
export const marketMakerConfig = pgTable("market_maker_config", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol").notNull(),
  isActive: boolean("is_active").default(true),
  spreadBps: integer("spread_bps").default(10), // basis points
  maxPositionSize: decimal("max_position_size", { precision: 30, scale: 18 }),
  orderRefreshInterval: integer("order_refresh_interval").default(30), // seconds
  volatilityThreshold: decimal("volatility_threshold", { precision: 5, scale: 4 }).default("0.05"),
  emergencyHalt: boolean("emergency_halt").default(false),
  lastPriceUpdate: timestamp("last_price_update"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Trading Incidents
export const tradingIncidents = pgTable("trading_incidents", {
  id: serial("id").primaryKey(),
  incidentType: varchar("incident_type").notNull(), // failed_order, price_anomaly, ddos, system_error
  severity: varchar("severity").default("medium"), // low, medium, high, critical
  symbol: varchar("symbol"),
  description: text("description").notNull(),
  affectedUsers: integer("affected_users").default(0),
  affectedOrders: jsonb("affected_orders").default("[]"),
  status: varchar("status").default("open"), // open, investigating, resolved
  resolution: text("resolution"),
  assignedTo: varchar("assigned_to"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow()
});

// OTC Desk Management
export const otcRequests = pgTable("otc_requests", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  requestType: varchar("request_type").notNull(), // rfq, block_trade, custom_settlement
  asset: varchar("asset").notNull(),
  amount: decimal("amount", { precision: 30, scale: 18 }).notNull(),
  side: varchar("side").notNull(), // buy, sell
  targetPrice: decimal("target_price", { precision: 18, scale: 8 }),
  maxSlippage: decimal("max_slippage", { precision: 5, scale: 4 }),
  timeframe: varchar("timeframe"), // immediate, day, week
  status: varchar("status").default("pending"), // pending, quoted, executed, rejected, expired
  assignedTo: varchar("assigned_to"),
  quotedPrice: decimal("quoted_price", { precision: 18, scale: 8 }),
  quotedAt: timestamp("quoted_at"),
  executedAt: timestamp("executed_at"),
  margin: decimal("margin", { precision: 5, scale: 4 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});

// Customer Support & CRM
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  ticketNumber: varchar("ticket_number").unique().notNull(),
  userId: varchar("user_id").references(() => users.id),
  subject: varchar("subject").notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(), // technical, trading, kyc, payment, general
  priority: varchar("priority").default("normal"), // low, normal, high, urgent
  status: varchar("status").default("open"), // open, in_progress, waiting_user, resolved, closed
  assignedTo: varchar("assigned_to"),
  tags: text("tags").array().default([]),
  slaDeadline: timestamp("sla_deadline"),
  firstResponseAt: timestamp("first_response_at"),
  resolvedAt: timestamp("resolved_at"),
  closedAt: timestamp("closed_at"),
  satisfaction: integer("satisfaction"), // 1-5 rating
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Support Messages
export const supportMessages = pgTable("support_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").references(() => supportTickets.id).notNull(),
  senderId: varchar("sender_id").notNull(), // user ID or admin ID
  senderType: varchar("sender_type").notNull(), // user, admin
  message: text("message").notNull(),
  attachments: jsonb("attachments").default("[]"),
  isInternal: boolean("is_internal").default(false), // admin-only notes
  createdAt: timestamp("created_at").defaultNow()
});

// User 360 View Data
export const userActivity = pgTable("user_activity", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  activityType: varchar("activity_type").notNull(), // login, trade, deposit, withdrawal, kyc_update
  details: jsonb("details").default("{}"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  sessionId: varchar("session_id"),
  createdAt: timestamp("created_at").defaultNow()
});

// Affiliate Management
export const affiliatePrograms = pgTable("affiliate_programs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  affiliateCode: varchar("affiliate_code").unique().notNull(),
  status: varchar("status").default("pending"), // pending, approved, rejected, suspended
  tier: varchar("tier").default("bronze"), // bronze, silver, gold, platinum
  commissionRate: decimal("commission_rate", { precision: 5, scale: 4 }).default("0.0010"), // 0.1%
  totalEarnings: decimal("total_earnings", { precision: 18, scale: 2 }).default("0"),
  totalReferrals: integer("total_referrals").default(0),
  activeReferrals: integer("active_referrals").default(0),
  payoutMethod: varchar("payout_method").default("crypto"), // crypto, bank_transfer
  payoutAddress: varchar("payout_address"),
  lastPayoutAt: timestamp("last_payout_at"),
  createdAt: timestamp("created_at").defaultNow()
});

// Affiliate Commissions
export const affiliateCommissions = pgTable("affiliate_commissions", {
  id: serial("id").primaryKey(),
  affiliateId: integer("affiliate_id").references(() => affiliatePrograms.id).notNull(),
  referredUserId: varchar("referred_user_id").references(() => users.id).notNull(),
  commissionType: varchar("commission_type").notNull(), // trading_fee, deposit_fee, referral_bonus
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  currency: varchar("currency").default("USDT"),
  status: varchar("status").default("pending"), // pending, paid, cancelled
  paidAt: timestamp("paid_at"),
  transactionId: varchar("transaction_id"),
  createdAt: timestamp("created_at").defaultNow()
});

// System Logs & Monitoring
export const systemLogs = pgTable("system_logs", {
  id: serial("id").primaryKey(),
  logLevel: varchar("log_level").notNull(), // info, warning, error, critical
  service: varchar("service").notNull(), // api, trading_engine, wallet_service, etc.
  message: text("message").notNull(),
  metadata: jsonb("metadata").default("{}"),
  traceId: varchar("trace_id"),
  userId: varchar("user_id"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow()
});

// Admin Permissions & RBAC
export const adminRoles = pgTable("admin_roles", {
  id: serial("id").primaryKey(),
  roleName: varchar("role_name").unique().notNull(),
  description: text("description"),
  permissions: jsonb("permissions").notNull(), // array of permission strings
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  roleId: integer("role_id").references(() => adminRoles.id).notNull(),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// Mobile App Backend Tables
export const mobileDevices = pgTable("mobile_devices", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  deviceId: varchar("device_id").unique().notNull(),
  platform: varchar("platform").notNull(), // ios, android
  deviceModel: varchar("device_model"),
  osVersion: varchar("os_version"),
  appVersion: varchar("app_version"),
  pushToken: varchar("push_token"),
  isJailbroken: boolean("is_jailbroken").default(false),
  riskScore: integer("risk_score").default(0),
  isActive: boolean("is_active").default(true),
  lastSeen: timestamp("last_seen"),
  createdAt: timestamp("created_at").defaultNow()
});

export const pushNotifications = pgTable("push_notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  deviceId: varchar("device_id"),
  title: varchar("title").notNull(),
  body: text("body").notNull(),
  data: jsonb("data").default("{}"),
  type: varchar("type").notNull(), // trade_fill, security_alert, price_alert, news
  status: varchar("status").default("pending"), // pending, sent, delivered, failed
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow()
});

// Type definitions for admin panel operations
export type KYCQueue = typeof kycQueue.$inferSelect;
export type InsertKYCQueue = typeof kycQueue.$inferInsert;
export type AMLAlert = typeof amlAlerts.$inferSelect;
export type InsertAMLAlert = typeof amlAlerts.$inferInsert;
export type SARReport = typeof sarReports.$inferSelect;
export type InsertSARReport = typeof sarReports.$inferInsert;
export type AuditTrail = typeof auditTrails.$inferSelect;
export type InsertAuditTrail = typeof auditTrails.$inferInsert;
export type WalletBalance = typeof walletBalances.$inferSelect;
export type InsertWalletBalance = typeof walletBalances.$inferInsert;
export type WithdrawalQueue = typeof withdrawalQueue.$inferSelect;
export type InsertWithdrawalQueue = typeof withdrawalQueue.$inferInsert;
export type RevenueMetric = typeof revenueMetrics.$inferSelect;
export type InsertRevenueMetric = typeof revenueMetrics.$inferInsert;
export type MarketMakerConfig = typeof marketMakerConfig.$inferSelect;
export type InsertMarketMakerConfig = typeof marketMakerConfig.$inferInsert;
export type TradingIncident = typeof tradingIncidents.$inferSelect;
export type InsertTradingIncident = typeof tradingIncidents.$inferInsert;
export type OTCRequest = typeof otcRequests.$inferSelect;
export type InsertOTCRequest = typeof otcRequests.$inferInsert;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;
export type SupportMessage = typeof supportMessages.$inferSelect;
export type InsertSupportMessage = typeof supportMessages.$inferInsert;
export type UserActivity = typeof userActivity.$inferSelect;
export type InsertUserActivity = typeof userActivity.$inferInsert;
export type AffiliateProgram = typeof affiliatePrograms.$inferSelect;
export type InsertAffiliateProgram = typeof affiliatePrograms.$inferInsert;
export type AffiliateCommission = typeof affiliateCommissions.$inferSelect;
export type InsertAffiliateCommission = typeof affiliateCommissions.$inferInsert;
export type SystemLog = typeof systemLogs.$inferSelect;
export type InsertSystemLog = typeof systemLogs.$inferInsert;
export type AdminRole = typeof adminRoles.$inferSelect;
export type InsertAdminRole = typeof adminRoles.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;
export type MobileDevice = typeof mobileDevices.$inferSelect;
export type InsertMobileDevice = typeof mobileDevices.$inferInsert;
export type PushNotification = typeof pushNotifications.$inferSelect;
export type InsertPushNotification = typeof pushNotifications.$inferInsert;

// Insert schemas for admin operations
export const insertKYCQueueSchema = createInsertSchema(kycQueue).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAMLAlertSchema = createInsertSchema(amlAlerts).omit({
  id: true,
  createdAt: true,
});

export const insertSARReportSchema = createInsertSchema(sarReports).omit({
  id: true,
  createdAt: true,
});

export const insertAuditTrailSchema = createInsertSchema(auditTrails).omit({
  id: true,
  createdAt: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupportMessageSchema = createInsertSchema(supportMessages).omit({
  id: true,
  createdAt: true,
});

export const insertOTCRequestSchema = createInsertSchema(otcRequests).omit({
  id: true,
  createdAt: true,
});

export const insertAffiliateProgramSchema = createInsertSchema(affiliatePrograms).omit({
  id: true,
  createdAt: true,
});

export const insertMobileDeviceSchema = createInsertSchema(mobileDevices).omit({
  id: true,
  createdAt: true,
});

export const insertPushNotificationSchema = createInsertSchema(pushNotifications).omit({
  id: true,
  createdAt: true,
});

// API Keys for programmatic access
export const apiKeys = pgTable("api_keys", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  keyId: varchar("key_id").unique().notNull(),
  keySecret: varchar("key_secret").notNull(),
  permissions: text("permissions").array().notNull(),
  isActive: boolean("is_active").default(true),
  lastUsed: timestamp("last_used"),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;

export const insertApiKeySchema = createInsertSchema(apiKeys).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Customer Segmentation & CRM
export const customerSegments = pgTable("customer_segments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  segment: varchar("segment").notNull(), // retail, vip, institutional, high_risk
  segmentScore: decimal("segment_score", { precision: 10, scale: 2 }).default("0"),
  assignedManager: varchar("assigned_manager"),
  riskLevel: varchar("risk_level").default("low"), // low, medium, high, critical
  lifetimeValue: decimal("lifetime_value", { precision: 18, scale: 2 }).default("0"),
  lastContactDate: timestamp("last_contact_date"),
  nextReviewDate: timestamp("next_review_date"),
  tags: text("tags").array(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});



// Wallet Reconciliation & Treasury
export const walletReconciliations = pgTable("wallet_reconciliations", {
  id: serial("id").primaryKey(),
  reconciliationDate: timestamp("reconciliation_date").notNull(),
  walletType: varchar("wallet_type").notNull(), // hot, cold, omnibus
  asset: varchar("asset").notNull(),
  expectedBalance: decimal("expected_balance", { precision: 18, scale: 8 }).notNull(),
  actualBalance: decimal("actual_balance", { precision: 18, scale: 8 }).notNull(),
  difference: decimal("difference", { precision: 18, scale: 8 }).notNull(),
  status: varchar("status").default("pending"), // pending, reconciled, discrepancy
  discrepancyReason: text("discrepancy_reason"),
  resolvedBy: varchar("resolved_by"),
  resolvedAt: timestamp("resolved_at"),
  blockchainTxHash: varchar("blockchain_tx_hash"),
  createdAt: timestamp("created_at").defaultNow()
});

// Incident Management
export const incidents = pgTable("incidents", {
  id: serial("id").primaryKey(),
  incidentNumber: varchar("incident_number").unique().notNull(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(), // security, technical, compliance, operational
  severity: varchar("severity").notNull(), // low, medium, high, critical
  status: varchar("status").default("open"), // open, investigating, resolved, closed
  priority: varchar("priority").default("medium"),
  affectedSystems: text("affected_systems").array(),
  affectedUsers: integer("affected_users").default(0),
  reportedBy: varchar("reported_by").notNull(),
  assignedTo: varchar("assigned_to"),
  escalatedTo: varchar("escalated_to"),
  rootCause: text("root_cause"),
  resolution: text("resolution"),
  preventiveMeasures: text("preventive_measures"),
  estimatedImpact: decimal("estimated_impact", { precision: 18, scale: 2 }),
  actualImpact: decimal("actual_impact", { precision: 18, scale: 2 }),
  mttr: integer("mttr"), // Mean Time To Recovery in minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at")
});

// Revenue Tracking & Financial Operations
export const revenueStreams = pgTable("revenue_streams", {
  id: serial("id").primaryKey(),
  streamType: varchar("stream_type").notNull(), // trading_fees, spread, otc_commission, affiliate, staking_rewards
  userId: varchar("user_id").references(() => users.id),
  orderId: integer("order_id").references(() => orders.id),
  tradeId: integer("trade_id").references(() => trades.id),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  currency: varchar("currency").notNull(),
  feeRate: decimal("fee_rate", { precision: 5, scale: 4 }),
  description: text("description"),
  transactionDate: timestamp("transaction_date").defaultNow(),
  settlementDate: timestamp("settlement_date"),
  status: varchar("status").default("pending"), // pending, settled, disputed
  createdAt: timestamp("created_at").defaultNow()
});



// Market Making & Liquidity Management
export const liquidityOrders = pgTable("liquidity_orders", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol").notNull(),
  side: varchar("side").notNull(), // buy, sell
  orderType: varchar("order_type").default("market_making"), // market_making, inventory_management
  quantity: decimal("quantity", { precision: 18, scale: 8 }).notNull(),
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  spreadTarget: decimal("spread_target", { precision: 5, scale: 4 }).notNull(),
  maxExposure: decimal("max_exposure", { precision: 18, scale: 8 }).notNull(),
  currentExposure: decimal("current_exposure", { precision: 18, scale: 8 }).default("0"),
  isActive: boolean("is_active").default(true),
  algorithmType: varchar("algorithm_type").default("grid"), // grid, volume_weighted, smart_order
  riskParameters: jsonb("risk_parameters"),
  performanceMetrics: jsonb("performance_metrics"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// API Management & Rate Limiting
export const apiCredentials = pgTable("api_credentials", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  credentialName: varchar("credential_name").notNull(),
  apiKey: varchar("api_key").unique().notNull(),
  apiSecret: varchar("api_secret").notNull(),
  permissions: text("permissions").array(), // read, trade, withdraw
  rateLimit: integer("rate_limit").default(1000), // requests per minute
  ipWhitelist: text("ip_whitelist").array(),
  isActive: boolean("is_active").default(true),
  lastUsed: timestamp("last_used"),
  totalRequests: integer("total_requests").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at")
});

// Order Book Health Monitoring
export const orderBookHealth = pgTable("order_book_health", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  bidDepth: decimal("bid_depth", { precision: 18, scale: 8 }).notNull(),
  askDepth: decimal("ask_depth", { precision: 18, scale: 8 }).notNull(),
  spread: decimal("spread", { precision: 18, scale: 8 }).notNull(),
  spreadPercent: decimal("spread_percent", { precision: 5, scale: 4 }).notNull(),
  midPrice: decimal("mid_price", { precision: 18, scale: 8 }).notNull(),
  volume24h: decimal("volume_24h", { precision: 18, scale: 2 }).notNull(),
  orderCount: integer("order_count").notNull(),
  avgOrderSize: decimal("avg_order_size", { precision: 18, scale: 8 }).notNull(),
  latency: integer("latency"), // milliseconds
  healthScore: decimal("health_score", { precision: 5, scale: 2 }).notNull() // 0-100
});

// Enhanced schemas for new tables
export const insertCustomerSegmentSchema = createInsertSchema(customerSegments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});



export const insertIncidentSchema = createInsertSchema(incidents).omit({
  id: true,
  incidentNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRevenueStreamSchema = createInsertSchema(revenueStreams).omit({
  id: true,
  createdAt: true,
});



// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;


export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Portfolio = typeof portfolios.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type Trade = typeof trades.$inferSelect;
export type StakingPosition = typeof stakingPositions.$inferSelect;
export type InsertStakingPosition = z.infer<typeof insertStakingPositionSchema>;
export type P2POrder = typeof p2pOrders.$inferSelect;
export type InsertP2POrder = z.infer<typeof insertP2POrderSchema>;
export type P2PTrade = typeof p2pTrades.$inferSelect;
export type OTCDeal = typeof otcDeals.$inferSelect;
export type InsertOTCDeal = z.infer<typeof insertOTCDealSchema>;
export type LaunchpadProject = typeof launchpadProjects.$inferSelect;
export type InsertLaunchpadProject = z.infer<typeof insertLaunchpadProjectSchema>;
export type LaunchpadParticipation = typeof launchpadParticipations.$inferSelect;
export type CopyTradingMaster = typeof copyTradingMasters.$inferSelect;
export type CopyTradingFollow = typeof copyTradingFollows.$inferSelect;
export type KYCVerification = typeof kycVerifications.$inferSelect;
export type InsertKYCVerification = z.infer<typeof insertKYCVerificationSchema>;
export type MarketData = typeof marketData.$inferSelect;
export type CustomerSegment = typeof customerSegments.$inferSelect;
export type InsertCustomerSegment = z.infer<typeof insertCustomerSegmentSchema>;
// Duplicates removed - already defined above
export type WalletReconciliation = typeof walletReconciliations.$inferSelect;
export type LiquidityOrder = typeof liquidityOrders.$inferSelect;
export type ApiCredential = typeof apiCredentials.$inferSelect;
export type OrderBookHealth = typeof orderBookHealth.$inferSelect;

// SMS Notifications table
export const smsNotifications = pgTable("sms_notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull(), // alert, notification, security, general
  status: varchar("status").default("pending"), // pending, sent, failed, delivered
  provider: varchar("provider"),
  messageId: varchar("message_id"),
  cost: decimal("cost", { precision: 10, scale: 4 }),
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Price Alerts table for SMS notifications
export const priceAlerts = pgTable("price_alerts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  symbol: varchar("symbol").notNull(),
  targetPrice: decimal("target_price", { precision: 18, scale: 8 }).notNull(),
  direction: varchar("direction").notNull(), // above, below
  isActive: boolean("is_active").default(true),
  notificationMethod: varchar("notification_method").default("sms"), // sms, email, push
  phoneNumber: varchar("phone_number"),
  lastTriggered: timestamp("last_triggered"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSMSNotificationSchema = createInsertSchema(smsNotifications);
export type InsertSMSNotification = z.infer<typeof insertSMSNotificationSchema>;
export type SMSNotification = typeof smsNotifications.$inferSelect;

export const insertPriceAlertSchema = createInsertSchema(priceAlerts);
export type InsertPriceAlert = z.infer<typeof insertPriceAlertSchema>;
export type PriceAlert = typeof priceAlerts.$inferSelect;

// Email verification tokens
export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  token: varchar("token").notNull(),
  email: varchar("email").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Password reset tokens
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  token: varchar("token").notNull(),
  email: varchar("email").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Account tier configurations
export const accountTiers = pgTable("account_tiers", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(), // basic, verified, premium, institutional
  displayName: varchar("display_name").notNull(),
  dailyTradingLimit: decimal("daily_trading_limit", { precision: 18, scale: 2 }),
  dailyWithdrawalLimit: decimal("daily_withdrawal_limit", { precision: 18, scale: 2 }),
  monthlyWithdrawalLimit: decimal("monthly_withdrawal_limit", { precision: 18, scale: 2 }),
  maxOpenOrders: integer("max_open_orders").default(10),
  kycRequired: boolean("kyc_required").default(false),
  phoneVerificationRequired: boolean("phone_verification_required").default(false),
  twoFactorRequired: boolean("two_factor_required").default(false),
  tradingFeeDiscount: decimal("trading_fee_discount", { precision: 5, scale: 2 }).default("0"),
  features: jsonb("features").default("{}"), // Available features
  createdAt: timestamp("created_at").defaultNow(),
});

// Login attempts tracking
export const loginAttempts = pgTable("login_attempts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  email: varchar("email"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  successful: boolean("successful").default(false),
  failureReason: varchar("failure_reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Security events log
export const securityEvents = pgTable("security_events", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  eventType: varchar("event_type").notNull(), // login, logout, password_change, 2fa_enable, etc.
  description: text("description"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Authentication schemas
export const insertEmailVerificationTokenSchema = createInsertSchema(emailVerificationTokens);
export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens);
export const insertLoginAttemptSchema = createInsertSchema(loginAttempts);
export const insertSecurityEventSchema = createInsertSchema(securityEvents);

// Authentication types
export type EmailVerificationToken = typeof emailVerificationTokens.$inferSelect;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type AccountTier = typeof accountTiers.$inferSelect;
export type LoginAttempt = typeof loginAttempts.$inferSelect;
export type SecurityEvent = typeof securityEvents.$inferSelect;

// Crypto payments schema (moved from end of file)
export const cryptoPayments = pgTable("crypto_payments", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  currency: varchar("currency").notNull(), // ETH, BTC, USDT, USDC
  toAddress: varchar("to_address").notNull(),
  fromAddress: varchar("from_address"),
  transactionHash: varchar("transaction_hash"),
  blockNumber: integer("block_number"),
  confirmations: integer("confirmations").default(0),
  requiredConfirmations: integer("required_confirmations").default(3),
  status: varchar("status").default("pending"), // pending, confirmed, failed, expired
  network: varchar("network").default("mainnet"), // mainnet, testnet
  gasPrice: decimal("gas_price", { precision: 18, scale: 8 }),
  gasUsed: integer("gas_used"),
  exchangeRate: decimal("exchange_rate", { precision: 18, scale: 8 }),
  usdValue: decimal("usd_value", { precision: 18, scale: 2 }),
  description: text("description"),
  metadata: jsonb("metadata"),
  expiresAt: timestamp("expires_at"),
  confirmedAt: timestamp("confirmed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCryptoPaymentSchema = createInsertSchema(cryptoPayments);
export type InsertCryptoPayment = z.infer<typeof insertCryptoPaymentSchema>;
export type CryptoPayment = typeof cryptoPayments.$inferSelect;

// Wallet Infrastructure Tables
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  currency: varchar("currency").notNull(),
  network: varchar("network").default("mainnet"),
  address: varchar("address").notNull(),
  balance: decimal("balance", { precision: 18, scale: 8 }).default("0"),
  availableBalance: decimal("available_balance", { precision: 18, scale: 8 }).default("0"),
  frozenBalance: decimal("frozen_balance", { precision: 18, scale: 8 }).default("0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type").notNull(), // deposit, withdrawal, trade, fee
  currency: varchar("currency").notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  fee: decimal("fee", { precision: 18, scale: 8 }).default("0"),
  status: varchar("status").default("pending"), // pending, completed, failed, cancelled
  txHash: varchar("tx_hash"),
  blockNumber: integer("block_number"),
  confirmations: integer("confirmations").default(0),
  network: varchar("network").default("mainnet"),
  fromAddress: varchar("from_address"),
  toAddress: varchar("to_address"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



// Enhanced Orders table for advanced order types
export const advancedOrders = pgTable("advanced_orders", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  symbol: varchar("symbol").notNull(),
  type: varchar("type").notNull(), // market, limit, stop, stop_limit, oco, trailing_stop
  side: varchar("side").notNull(), // buy, sell
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  price: decimal("price", { precision: 18, scale: 8 }),
  stopPrice: decimal("stop_price", { precision: 18, scale: 8 }),
  trailingAmount: decimal("trailing_amount", { precision: 18, scale: 8 }),
  timeInForce: varchar("time_in_force").default("GTC"), // GTC, IOC, FOK, DAY
  status: varchar("status").default("pending"), // pending, open, filled, cancelled, rejected, triggered
  linkedOrderId: varchar("linked_order_id"),
  executedAmount: decimal("executed_amount", { precision: 18, scale: 8 }).default("0"),
  averagePrice: decimal("average_price", { precision: 18, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fiat Gateway Integration
export const fiatGateways = pgTable("fiat_gateways", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(), // stripe, bank_wire, sepa, ach
  displayName: varchar("display_name").notNull(),
  type: varchar("type").notNull(), // card, bank_transfer, digital_wallet
  supportedCurrencies: text("supported_currencies").array(),
  supportedCountries: text("supported_countries").array(),
  minAmount: decimal("min_amount", { precision: 18, scale: 2 }),
  maxAmount: decimal("max_amount", { precision: 18, scale: 2 }),
  processingTime: varchar("processing_time"), // instant, 1-3_days, 3-5_days
  fees: jsonb("fees"), // fee structure
  isActive: boolean("is_active").default(true),
  configuration: jsonb("configuration"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fiatTransactions = pgTable("fiat_transactions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  gatewayId: integer("gateway_id").references(() => fiatGateways.id).notNull(),
  type: varchar("type").notNull(), // deposit, withdrawal
  currency: varchar("currency").notNull(), // USD, EUR, GBP
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  fee: decimal("fee", { precision: 18, scale: 2 }).default("0"),
  netAmount: decimal("net_amount", { precision: 18, scale: 2 }).notNull(),
  status: varchar("status").default("pending"),
  externalReference: varchar("external_reference"),
  paymentMethod: jsonb("payment_method"),
  bankDetails: jsonb("bank_details"),
  metadata: jsonb("metadata"),
  failureReason: text("failure_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Margin Trading Tables (Basic Implementation)
export const marginAccounts = pgTable("margin_accounts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  collateralValue: decimal("collateral_value", { precision: 18, scale: 2 }).default("0"),
  borrowedValue: decimal("borrowed_value", { precision: 18, scale: 2 }).default("0"),
  availableMargin: decimal("available_margin", { precision: 18, scale: 2 }).default("0"),
  marginRatio: decimal("margin_ratio", { precision: 5, scale: 2 }).default("0"),
  liquidationThreshold: decimal("liquidation_threshold", { precision: 5, scale: 2 }).default("80"),
  isActive: boolean("is_active").default(false),
  riskScore: integer("risk_score").default(5),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const marginPositions = pgTable("margin_positions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  marginAccountId: integer("margin_account_id").references(() => marginAccounts.id).notNull(),
  symbol: varchar("symbol").notNull(),
  side: varchar("side").notNull(), // long, short
  size: decimal("size", { precision: 18, scale: 8 }).notNull(),
  entryPrice: decimal("entry_price", { precision: 18, scale: 8 }).notNull(),
  markPrice: decimal("mark_price", { precision: 18, scale: 8 }),
  unrealizedPnl: decimal("unrealized_pnl", { precision: 18, scale: 8 }).default("0"),
  realizedPnl: decimal("realized_pnl", { precision: 18, scale: 8 }).default("0"),
  leverage: decimal("leverage", { precision: 5, scale: 2 }).default("1"),
  liquidationPrice: decimal("liquidation_price", { precision: 18, scale: 8 }),
  status: varchar("status").default("open"), // open, closed, liquidated
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wallet and transaction schemas
export const insertWalletSchema = createInsertSchema(wallets);
export const insertTransactionSchema = createInsertSchema(transactions);
export const insertWithdrawalQueueSchema = createInsertSchema(withdrawalQueue);
export const insertAdvancedOrderSchema = createInsertSchema(advancedOrders);
export const insertFiatGatewaySchema = createInsertSchema(fiatGateways);
export const insertFiatTransactionSchema = createInsertSchema(fiatTransactions);
export const insertMarginAccountSchema = createInsertSchema(marginAccounts);
export const insertMarginPositionSchema = createInsertSchema(marginPositions);

// Wallet and transaction types
export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
// Duplicates removed - already defined above
export type AdvancedOrder = typeof advancedOrders.$inferSelect;
export type InsertAdvancedOrder = z.infer<typeof insertAdvancedOrderSchema>;
export type FiatGateway = typeof fiatGateways.$inferSelect;
export type InsertFiatGateway = z.infer<typeof insertFiatGatewaySchema>;
export type FiatTransaction = typeof fiatTransactions.$inferSelect;
export type InsertFiatTransaction = z.infer<typeof insertFiatTransactionSchema>;
export type MarginAccount = typeof marginAccounts.$inferSelect;
export type InsertMarginAccount = z.infer<typeof insertMarginAccountSchema>;
export type MarginPosition = typeof marginPositions.$inferSelect;
export type InsertMarginPosition = z.infer<typeof insertMarginPositionSchema>;

// Social and Educational Features Tables
export const sentimentAnalysis = pgTable('sentiment_analysis', {
  id: serial('id').primaryKey(),
  userId: varchar("user_id", { length: 36 })  // <-- change from integer to varchar
    .notNull()
    .references(() => users.id),
  asset: text('asset').notNull(), // 'BTC', 'ETH', etc.
  sentiment: text('sentiment').notNull(), // 'bullish', 'bearish', 'neutral'
  confidence: decimal('confidence', { precision: 5, scale: 3 }).notNull(), // 0.0 - 1.0
  source: text('source').notNull(), // 'twitter', 'reddit', 'news', 'social'
  rawData: text('raw_data'), // Original text/data
  timestamp: timestamp('timestamp').defaultNow(),
  marketImpact: decimal('market_impact', { precision: 8, scale: 3 }), // Predicted impact score
  createdAt: timestamp('created_at').defaultNow()
});

export const cryptoLearningGames = pgTable('crypto_learning_games', {
  id: serial('id').primaryKey(),
  gameId: text('game_id').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(), // 'trading', 'defi', 'security', 'basics'
  difficulty: text('difficulty').notNull(), // 'beginner', 'intermediate', 'advanced'
  xpReward: integer('xp_reward').default(100),
  tokenReward: decimal('token_reward', { precision: 10, scale: 4 }).default('0'),
  questions: text('questions').array(), // JSON array of questions
  correctAnswers: text('correct_answers').array(), // Correct answer indices
  timeLimit: integer('time_limit').default(300), // seconds
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

export const gameProgress = pgTable('game_progress', {
  id: serial('id').primaryKey(),
  userId: varchar("user_id", { length: 36 })  // <-- change from integer to varchar
    .notNull()
    .references(() => users.id),
  gameId: text('game_id').references(() => cryptoLearningGames.gameId),
  score: integer('score').notNull(),
  xpEarned: integer('xp_earned').notNull(),
  tokensEarned: decimal('tokens_earned', { precision: 10, scale: 4 }).default('0'),
  completionTime: integer('completion_time'), // seconds
  answers: text('answers').array(), // User's answers
  completed: boolean('completed').default(false),
  attempts: integer('attempts').default(1),
  bestScore: integer('best_score'),
  createdAt: timestamp('created_at').defaultNow()
});

export const socialTrainingCommunity = pgTable('social_training_community', {
  id: serial('id').primaryKey(),
  userId: varchar("user_id", { length: 36 })  // <-- change from integer to varchar
    .notNull()
    .references(() => users.id),
  username: text('username').notNull(),
  displayName: text('display_name'),
  avatar: text('avatar'),
  totalXp: integer('total_xp').default(0),
  level: integer('level').default(1),
  rank: integer('rank'),
  badges: text('badges').array(), // Array of badge IDs
  achievements: text('achievements').array(),
  tradingScore: decimal('trading_score', { precision: 10, scale: 2 }).default('0'),
  communityPoints: integer('community_points').default(0),
  followers: integer('followers').default(0),
  following: integer('following').default(0),
  joinedAt: timestamp('joined_at').defaultNow(),
  lastActive: timestamp('last_active').defaultNow()
});

export const leaderboards = pgTable('leaderboards', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(), // 'daily', 'weekly', 'monthly', 'all_time'
  category: text('category').notNull(), // 'xp', 'trading', 'games', 'community'
  userId: varchar("user_id", { length: 36 })  // <-- change from integer to varchar
    .notNull()
    .references(() => users.id),
  username: text('username').notNull(),
  score: decimal('score', { precision: 10, scale: 2 }).notNull(),
  rank: integer('rank').notNull(),
  change: integer('change').default(0), // Position change from previous period
  period: text('period').notNull(), // '2025-01-01' for tracking periods
  metadata: text('metadata'), // JSON for additional data
  updatedAt: timestamp('updated_at').defaultNow()
});

export const portfolioWellness = pgTable('portfolio_wellness', {
  id: serial('id').primaryKey(),
  userId: varchar("user_id", { length: 36 })  // <-- change from integer to varchar
    .notNull()
    .references(() => users.id),
  overallScore: decimal('overall_score', { precision: 5, scale: 2 }).notNull(), // 0-100
  diversificationScore: decimal('diversification_score', { precision: 5, scale: 2 }).notNull(),
  riskScore: decimal('risk_score', { precision: 5, scale: 2 }).notNull(),
  performanceScore: decimal('performance_score', { precision: 5, scale: 2 }).notNull(),
  volatilityScore: decimal('volatility_score', { precision: 5, scale: 2 }).notNull(),
  recommendations: text('recommendations').array(),
  riskLevel: text('risk_level').notNull(), // 'conservative', 'moderate', 'aggressive'
  healthStatus: text('health_status').notNull(), // 'excellent', 'good', 'needs_attention', 'critical'
  improvements: text('improvements').array(),
  nextReview: timestamp('next_review'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const educationConsent = pgTable('education_consent', {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id),
  consentType: text('consent_type').notNull(), // 'risk_disclosure', 'investment_education', 'trading_terms'
  consentText: text('consent_text').notNull(),
  agreedAt: timestamp('agreed_at').defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  documentVersion: text('document_version').notNull(),
  isActive: boolean('is_active').default(true),
  revokedAt: timestamp('revoked_at'),
  legalCompliance: text('legal_compliance').array(), // Jurisdictions covered
  createdAt: timestamp('created_at').defaultNow()
});

// Insert schemas for new tables
export const insertSentimentAnalysisSchema = createInsertSchema(sentimentAnalysis).omit({
  id: true,
  createdAt: true,
  timestamp: true
});

export const insertCryptoLearningGameSchema = createInsertSchema(cryptoLearningGames).omit({
  id: true,
  createdAt: true
});

export const insertGameProgressSchema = createInsertSchema(gameProgress).omit({
  id: true,
  createdAt: true
});

export const insertSocialTrainingCommunitySchema = createInsertSchema(socialTrainingCommunity).omit({
  id: true,
  joinedAt: true,
  lastActive: true
});

export const insertLeaderboardSchema = createInsertSchema(leaderboards).omit({
  id: true,
  updatedAt: true
});

export const insertPortfolioWellnessSchema = createInsertSchema(portfolioWellness).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertEducationConsentSchema = createInsertSchema(educationConsent).omit({
  id: true,
  createdAt: true,
  agreedAt: true
});

// Type exports for new tables
export type SentimentAnalysis = typeof sentimentAnalysis.$inferSelect;
export type InsertSentimentAnalysis = z.infer<typeof insertSentimentAnalysisSchema>;
export type CryptoLearningGame = typeof cryptoLearningGames.$inferSelect;
export type InsertCryptoLearningGame = z.infer<typeof insertCryptoLearningGameSchema>;
export type GameProgress = typeof gameProgress.$inferSelect;
export type InsertGameProgress = z.infer<typeof insertGameProgressSchema>;
export type SocialTrainingCommunity = typeof socialTrainingCommunity.$inferSelect;
export type InsertSocialTrainingCommunity = z.infer<typeof insertSocialTrainingCommunitySchema>;
export type Leaderboard = typeof leaderboards.$inferSelect;
export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;
export type PortfolioWellness = typeof portfolioWellness.$inferSelect;
export type InsertPortfolioWellness = z.infer<typeof insertPortfolioWellnessSchema>;
export type EducationConsent = typeof educationConsent.$inferSelect;
export type InsertEducationConsent = z.infer<typeof insertEducationConsentSchema>;

// Note: Relations are commented out to avoid import issues
// They can be added back when needed for advanced querying

// Re-export AI schema tables and types for AI trading functionality
export * from "./ai-schema";
