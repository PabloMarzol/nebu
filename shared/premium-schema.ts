import { pgTable, varchar, text, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User subscription tiers
export const userSubscriptions = pgTable("user_subscriptions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull(),
  tier: varchar("tier").notNull(), // basic, pro, premium, elite
  billingCycle: varchar("billing_cycle").notNull(), // monthly, yearly
  status: varchar("status").notNull(), // active, canceled, expired
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  autoRenew: boolean("auto_renew").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Premium features usage tracking
export const featureUsage = pgTable("feature_usage", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull(),
  feature: varchar("feature").notNull(), // ai_trading, copy_trading, etc
  usageCount: integer("usage_count").default(0),
  lastUsed: timestamp("last_used").defaultNow(),
  monthlyLimit: integer("monthly_limit"),
  resetDate: timestamp("reset_date"),
  createdAt: timestamp("created_at").defaultNow()
});

// AI trading bot configurations
export const aiTradingBots = pgTable("ai_trading_bots", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull(),
  name: varchar("name").notNull(),
  strategy: varchar("strategy").notNull(), // momentum, mean_reversion, arbitrage
  isActive: boolean("is_active").default(false),
  riskLevel: varchar("risk_level").notNull(), // low, medium, high
  maxInvestment: decimal("max_investment", { precision: 20, scale: 8 }),
  allocatedAmount: decimal("allocated_amount", { precision: 20, scale: 8 }),
  performance: decimal("performance", { precision: 10, scale: 4 }),
  trades: integer("trades").default(0),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }),
  configuration: text("configuration"), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Copy trading relationships
export const copyTradingFollows = pgTable("copy_trading_follows", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  followerId: varchar("follower_id").notNull(),
  masterId: varchar("master_id").notNull(),
  allocationPercent: decimal("allocation_percent", { precision: 5, scale: 2 }),
  maxCopyAmount: decimal("max_copy_amount", { precision: 20, scale: 8 }),
  isActive: boolean("is_active").default(true),
  totalCopied: decimal("total_copied", { precision: 20, scale: 8 }).default("0"),
  totalProfit: decimal("total_profit", { precision: 20, scale: 8 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Master trader performance stats
export const masterTraderStats = pgTable("master_trader_stats", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull(),
  totalFollowers: integer("total_followers").default(0),
  totalCopiedVolume: decimal("total_copied_volume", { precision: 20, scale: 8 }).default("0"),
  performance30d: decimal("performance_30d", { precision: 10, scale: 4 }),
  performance90d: decimal("performance_90d", { precision: 10, scale: 4 }),
  performance1y: decimal("performance_1y", { precision: 10, scale: 4 }),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }),
  sharpeRatio: decimal("sharpe_ratio", { precision: 10, scale: 4 }),
  maxDrawdown: decimal("max_drawdown", { precision: 10, scale: 4 }),
  totalTrades: integer("total_trades").default(0),
  avgTradeSize: decimal("avg_trade_size", { precision: 20, scale: 8 }),
  riskScore: decimal("risk_score", { precision: 5, scale: 2 }),
  verificationLevel: varchar("verification_level").default("unverified"), // unverified, verified, pro
  commission: decimal("commission", { precision: 5, scale: 2 }).default("0"), // percentage
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Premium notifications settings
export const premiumNotifications = pgTable("premium_notifications", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull(),
  type: varchar("type").notNull(), // price_alert, ai_signal, copy_trade, etc
  configuration: text("configuration"), // JSON string
  isEnabled: boolean("is_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Mobile app sessions
export const mobileAppSessions = pgTable("mobile_app_sessions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull(),
  deviceId: varchar("device_id").notNull(),
  platform: varchar("platform").notNull(), // ios, android, pwa
  appVersion: varchar("app_version"),
  sessionStart: timestamp("session_start").defaultNow(),
  sessionEnd: timestamp("session_end"),
  isActive: boolean("is_active").default(true),
  pushToken: varchar("push_token"),
  biometricEnabled: boolean("biometric_enabled").default(false),
  lastActivity: timestamp("last_activity").defaultNow()
});

// Types
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;

export type FeatureUsage = typeof featureUsage.$inferSelect;
export type InsertFeatureUsage = typeof featureUsage.$inferInsert;

export type AITradingBot = typeof aiTradingBots.$inferSelect;
export type InsertAITradingBot = typeof aiTradingBots.$inferInsert;

export type CopyTradingFollow = typeof copyTradingFollows.$inferSelect;
export type InsertCopyTradingFollow = typeof copyTradingFollows.$inferInsert;

export type MasterTraderStats = typeof masterTraderStats.$inferSelect;
export type InsertMasterTraderStats = typeof masterTraderStats.$inferInsert;

export type PremiumNotification = typeof premiumNotifications.$inferSelect;
export type InsertPremiumNotification = typeof premiumNotifications.$inferInsert;

export type MobileAppSession = typeof mobileAppSessions.$inferSelect;
export type InsertMobileAppSession = typeof mobileAppSessions.$inferInsert;

// Zod schemas
export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions);
export const insertFeatureUsageSchema = createInsertSchema(featureUsage);
export const insertAITradingBotSchema = createInsertSchema(aiTradingBots);
export const insertCopyTradingFollowSchema = createInsertSchema(copyTradingFollows);
export const insertMasterTraderStatsSchema = createInsertSchema(masterTraderStats);
export const insertPremiumNotificationSchema = createInsertSchema(premiumNotifications);
export const insertMobileAppSessionSchema = createInsertSchema(mobileAppSessions);