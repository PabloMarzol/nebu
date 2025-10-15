import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table for OTC clients
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  company: varchar("company"),
  jobTitle: varchar("job_title"),
  phone: varchar("phone"),
  country: varchar("country"),
  kycStatus: varchar("kyc_status").default("pending"),
  kycLevel: integer("kyc_level").default(1),
  tradingLimit: decimal("trading_limit", { precision: 20, scale: 8 }).default("100000"),
  isInstitutional: boolean("is_institutional").default(false),
  riskScore: integer("risk_score").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// OTC Deals table
export const otcDeals = pgTable("otc_deals", {
  id: serial("id").primaryKey(),
  dealId: varchar("deal_id").unique().notNull(),
  clientId: varchar("client_id").references(() => users.id).notNull(),
  counterpartyId: varchar("counterparty_id").references(() => users.id),
  dealType: varchar("deal_type").notNull(), // buy, sell
  baseCurrency: varchar("base_currency").notNull(),
  quoteCurrency: varchar("quote_currency").notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  totalValue: decimal("total_value", { precision: 20, scale: 8 }).notNull(),
  status: varchar("status").default("pending"), // pending, matched, executing, completed, cancelled
  visibility: varchar("visibility").default("public"), // public, private, institutional
  minAmount: decimal("min_amount", { precision: 20, scale: 8 }),
  maxAmount: decimal("max_amount", { precision: 20, scale: 8 }),
  settlementMethod: varchar("settlement_method").default("escrow"),
  validUntil: timestamp("valid_until"),
  executedAt: timestamp("executed_at"),
  settledAt: timestamp("settled_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// OTC Quotes table for price requests
export const otcQuotes = pgTable("otc_quotes", {
  id: serial("id").primaryKey(),
  quoteId: varchar("quote_id").unique().notNull(),
  clientId: varchar("client_id").references(() => users.id).notNull(),
  dealType: varchar("deal_type").notNull(),
  baseCurrency: varchar("base_currency").notNull(),
  quoteCurrency: varchar("quote_currency").notNull(),
  requestedAmount: decimal("requested_amount", { precision: 20, scale: 8 }).notNull(),
  quotedPrice: decimal("quoted_price", { precision: 20, scale: 8 }),
  spread: decimal("spread", { precision: 5, scale: 4 }),
  validFor: integer("valid_for").default(300), // seconds
  status: varchar("status").default("pending"), // pending, quoted, accepted, expired, cancelled
  marketPrice: decimal("market_price", { precision: 20, scale: 8 }),
  notes: text("notes"),
  expiresAt: timestamp("expires_at"),
  quotedAt: timestamp("quoted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Block Trading table for large orders
export const blockTrades = pgTable("block_trades", {
  id: serial("id").primaryKey(),
  tradeId: varchar("trade_id").unique().notNull(),
  buyerId: varchar("buyer_id").references(() => users.id).notNull(),
  sellerId: varchar("seller_id").references(() => users.id).notNull(),
  baseCurrency: varchar("base_currency").notNull(),
  quoteCurrency: varchar("quote_currency").notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  totalValue: decimal("total_value", { precision: 20, scale: 8 }).notNull(),
  blockType: varchar("block_type").default("standard"), // standard, iceberg, time_weighted
  executionType: varchar("execution_type").default("immediate"), // immediate, scheduled, twap, vwap
  scheduledFor: timestamp("scheduled_for"),
  executionPeriod: integer("execution_period"), // minutes for TWAP/VWAP
  status: varchar("status").default("pending"),
  executedAt: timestamp("executed_at"),
  settledAt: timestamp("settled_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Liquidity Pools for OTC market making
export const liquidityPools = pgTable("liquidity_pools", {
  id: serial("id").primaryKey(),
  poolId: varchar("pool_id").unique().notNull(),
  providerId: varchar("provider_id").references(() => users.id).notNull(),
  baseCurrency: varchar("base_currency").notNull(),
  quoteCurrency: varchar("quote_currency").notNull(),
  baseAmount: decimal("base_amount", { precision: 20, scale: 8 }).notNull(),
  quoteAmount: decimal("quote_amount", { precision: 20, scale: 8 }).notNull(),
  bidSpread: decimal("bid_spread", { precision: 5, scale: 4 }).notNull(),
  askSpread: decimal("ask_spread", { precision: 5, scale: 4 }).notNull(),
  minTradeSize: decimal("min_trade_size", { precision: 20, scale: 8 }).notNull(),
  maxTradeSize: decimal("max_trade_size", { precision: 20, scale: 8 }).notNull(),
  isActive: boolean("is_active").default(true),
  utilization: decimal("utilization", { precision: 5, scale: 4 }).default("0"),
  volume24h: decimal("volume_24h", { precision: 20, scale: 8 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Settlement Instructions
export const settlementInstructions = pgTable("settlement_instructions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  currency: varchar("currency").notNull(),
  method: varchar("method").notNull(), // bank_wire, crypto_wallet, swift, fedwire
  bankName: varchar("bank_name"),
  accountNumber: varchar("account_number"),
  routingNumber: varchar("routing_number"),
  swiftCode: varchar("swift_code"),
  iban: varchar("iban"),
  walletAddress: varchar("wallet_address"),
  network: varchar("network"),
  beneficiaryName: varchar("beneficiary_name"),
  beneficiaryAddress: text("beneficiary_address"),
  isVerified: boolean("is_verified").default(false),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Credit Lines for institutional clients
export const creditLines = pgTable("credit_lines", {
  id: serial("id").primaryKey(),
  clientId: varchar("client_id").references(() => users.id).notNull(),
  currency: varchar("currency").notNull(),
  creditLimit: decimal("credit_limit", { precision: 20, scale: 8 }).notNull(),
  availableCredit: decimal("available_credit", { precision: 20, scale: 8 }).notNull(),
  utilizationRate: decimal("utilization_rate", { precision: 5, scale: 4 }).default("0"),
  interestRate: decimal("interest_rate", { precision: 5, scale: 4 }).notNull(),
  collateralRequired: decimal("collateral_required", { precision: 20, scale: 8 }).default("0"),
  maturityDate: timestamp("maturity_date"),
  status: varchar("status").default("active"), // active, suspended, expired
  riskRating: varchar("risk_rating").default("medium"), // low, medium, high
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Market Data for OTC pricing
export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol").unique().notNull(),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  bidPrice: decimal("bid_price", { precision: 20, scale: 8 }),
  askPrice: decimal("ask_price", { precision: 20, scale: 8 }),
  spread: decimal("spread", { precision: 5, scale: 4 }),
  volume24h: decimal("volume_24h", { precision: 20, scale: 8 }).default("0"),
  change24h: decimal("change_24h", { precision: 10, scale: 4 }).default("0"),
  high24h: decimal("high_24h", { precision: 20, scale: 8 }),
  low24h: decimal("low_24h", { precision: 20, scale: 8 }),
  marketCap: decimal("market_cap", { precision: 30, scale: 8 }),
  liquidity: decimal("liquidity", { precision: 20, scale: 8 }),
  volatility: decimal("volatility", { precision: 5, scale: 4 }),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOTCDealSchema = createInsertSchema(otcDeals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOTCQuoteSchema = createInsertSchema(otcQuotes).omit({
  id: true,
  createdAt: true,
});

export const insertBlockTradeSchema = createInsertSchema(blockTrades).omit({
  id: true,
  createdAt: true,
});

export const insertLiquidityPoolSchema = createInsertSchema(liquidityPools).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSettlementInstructionSchema = createInsertSchema(settlementInstructions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCreditLineSchema = createInsertSchema(creditLines).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type OTCDeal = typeof otcDeals.$inferSelect;
export type InsertOTCDeal = z.infer<typeof insertOTCDealSchema>;

export type OTCQuote = typeof otcQuotes.$inferSelect;
export type InsertOTCQuote = z.infer<typeof insertOTCQuoteSchema>;

export type BlockTrade = typeof blockTrades.$inferSelect;
export type InsertBlockTrade = z.infer<typeof insertBlockTradeSchema>;

export type LiquidityPool = typeof liquidityPools.$inferSelect;
export type InsertLiquidityPool = z.infer<typeof insertLiquidityPoolSchema>;

export type SettlementInstruction = typeof settlementInstructions.$inferSelect;
export type InsertSettlementInstruction = z.infer<typeof insertSettlementInstructionSchema>;

export type CreditLine = typeof creditLines.$inferSelect;
export type InsertCreditLine = z.infer<typeof insertCreditLineSchema>;

export type MarketData = typeof marketData.$inferSelect;