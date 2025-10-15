import {
  pgTable,
  serial,
  text,
  varchar,
  decimal,
  timestamp,
  jsonb,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// AI Trading Signals
export const aiTradingSignals = pgTable(
  "ai_trading_signals",
  {
    id: serial("id").primaryKey(),
    signalId: varchar("signal_id", { length: 100 }).notNull().unique(),
    userId: varchar("user_id", { length: 50 }),
    symbol: varchar("symbol", { length: 20 }).notNull(),
    action: varchar("action", { length: 10 }).notNull(), // buy, sell, hold
    confidence: integer("confidence").notNull(), // 0-100
    priceTarget: decimal("price_target", { precision: 20, scale: 8 }),
    stopLoss: decimal("stop_loss", { precision: 20, scale: 8 }),
    timeHorizon: varchar("time_horizon", { length: 10 }).notNull(), // short, medium, long
    reasoning: text("reasoning"),
    technicalIndicators: jsonb("technical_indicators"),
    status: varchar("status", { length: 20 }).default("active"), // active, expired, executed
    createdAt: timestamp("created_at").defaultNow(),
    expiresAt: timestamp("expires_at"),
  },
  (table) => [
    index("ai_signals_symbol_idx").on(table.symbol),
    index("ai_signals_user_idx").on(table.userId),
    index("ai_signals_status_idx").on(table.status),
  ]
);

// Market Analysis
export const aiMarketAnalysis = pgTable(
  "ai_market_analysis",
  {
    id: serial("id").primaryKey(),
    analysisId: varchar("analysis_id", { length: 100 }).notNull().unique(),
    marketSentiment: varchar("market_sentiment", { length: 20 }).notNull(), // bullish, bearish, neutral
    confidence: integer("confidence").notNull(),
    keyFactors: jsonb("key_factors"),
    riskAssessment: jsonb("risk_assessment"),
    predictions: jsonb("predictions"),
    dataSourcesUsed: jsonb("data_sources_used"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("ai_analysis_sentiment_idx").on(table.marketSentiment),
    index("ai_analysis_created_idx").on(table.createdAt),
  ]
);

// Portfolio Optimizations
export const aiPortfolioOptimizations = pgTable(
  "ai_portfolio_optimizations",
  {
    id: serial("id").primaryKey(),
    optimizationId: varchar("optimization_id", { length: 100 }).notNull().unique(),
    userId: varchar("user_id", { length: 50 }).notNull(),
    currentAllocation: jsonb("current_allocation").notNull(),
    recommendedAllocation: jsonb("recommended_allocation").notNull(),
    expectedReturn: decimal("expected_return", { precision: 10, scale: 4 }),
    riskScore: integer("risk_score"), // 1-10
    reasoning: text("reasoning"),
    actions: jsonb("actions"),
    riskTolerance: varchar("risk_tolerance", { length: 20 }), // conservative, moderate, aggressive
    investmentGoal: text("investment_goal"),
    status: varchar("status", { length: 20 }).default("pending"), // pending, applied, expired
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("ai_optimization_user_idx").on(table.userId),
    index("ai_optimization_status_idx").on(table.status),
  ]
);

// Natural Language Commands
export const aiNaturalLanguageCommands = pgTable(
  "ai_natural_language_commands",
  {
    id: serial("id").primaryKey(),
    commandId: varchar("command_id", { length: 100 }).notNull().unique(),
    userId: varchar("user_id", { length: 50 }).notNull(),
    originalCommand: text("original_command").notNull(),
    parsedCommand: jsonb("parsed_command").notNull(),
    confidence: integer("confidence").notNull(),
    status: varchar("status", { length: 20 }).default("pending"), // pending, executed, failed, cancelled
    executionResult: jsonb("execution_result"),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at").defaultNow(),
    executedAt: timestamp("executed_at"),
  },
  (table) => [
    index("ai_commands_user_idx").on(table.userId),
    index("ai_commands_status_idx").on(table.status),
  ]
);

// Smart Order Routing Analysis
export const aiOrderRouting = pgTable(
  "ai_order_routing",
  {
    id: serial("id").primaryKey(),
    routingId: varchar("routing_id", { length: 100 }).notNull().unique(),
    userId: varchar("user_id", { length: 50 }).notNull(),
    symbol: varchar("symbol", { length: 20 }).notNull(),
    side: varchar("side", { length: 10 }).notNull(), // buy, sell
    amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
    recommendedStrategy: varchar("recommended_strategy", { length: 50 }),
    executionPlan: jsonb("execution_plan"),
    totalCost: decimal("total_cost", { precision: 20, scale: 8 }),
    priceImprovement: decimal("price_improvement", { precision: 10, scale: 4 }),
    reasoning: text("reasoning"),
    orderBooksAnalyzed: jsonb("order_books_analyzed"),
    status: varchar("status", { length: 20 }).default("pending"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("ai_routing_user_idx").on(table.userId),
    index("ai_routing_symbol_idx").on(table.symbol),
  ]
);

// Risk Assessments
export const aiRiskAssessments = pgTable(
  "ai_risk_assessments",
  {
    id: serial("id").primaryKey(),
    assessmentId: varchar("assessment_id", { length: 100 }).notNull().unique(),
    userId: varchar("user_id", { length: 50 }).notNull(),
    portfolioSnapshot: jsonb("portfolio_snapshot").notNull(),
    proposedTrade: jsonb("proposed_trade").notNull(),
    marketConditions: jsonb("market_conditions"),
    riskScore: integer("risk_score").notNull(), // 1-10
    riskFactors: jsonb("risk_factors"),
    recommendations: jsonb("recommendations"),
    positionSizeSuggestion: decimal("position_size_suggestion", { precision: 20, scale: 8 }),
    maxLossEstimate: decimal("max_loss_estimate", { precision: 20, scale: 8 }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("ai_risk_user_idx").on(table.userId),
    index("ai_risk_score_idx").on(table.riskScore),
  ]
);

// AI Model Performance Tracking
export const aiModelPerformance = pgTable(
  "ai_model_performance",
  {
    id: serial("id").primaryKey(),
    modelType: varchar("model_type", { length: 50 }).notNull(), // trading_signals, sentiment_analysis, etc.
    modelVersion: varchar("model_version", { length: 20 }).notNull(),
    predictionId: varchar("prediction_id", { length: 100 }).notNull(),
    actualOutcome: jsonb("actual_outcome"),
    predictedOutcome: jsonb("predicted_outcome"),
    accuracy: decimal("accuracy", { precision: 5, scale: 4 }),
    confidence: integer("confidence"),
    timeToRealization: integer("time_to_realization"), // in minutes
    profitLoss: decimal("profit_loss", { precision: 20, scale: 8 }),
    createdAt: timestamp("created_at").defaultNow(),
    evaluatedAt: timestamp("evaluated_at"),
  },
  (table) => [
    index("ai_performance_model_idx").on(table.modelType),
    index("ai_performance_accuracy_idx").on(table.accuracy),
  ]
);

// AI Learning Data
export const aiLearningData = pgTable(
  "ai_learning_data",
  {
    id: serial("id").primaryKey(),
    dataType: varchar("data_type", { length: 50 }).notNull(), // market_data, user_behavior, trade_outcome
    userId: varchar("user_id", { length: 50 }),
    symbol: varchar("symbol", { length: 20 }),
    dataPayload: jsonb("data_payload").notNull(),
    labels: jsonb("labels"), // for supervised learning
    features: jsonb("features"),
    processed: boolean("processed").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("ai_learning_type_idx").on(table.dataType),
    index("ai_learning_processed_idx").on(table.processed),
  ]
);

// User AI Preferences
export const aiUserPreferences = pgTable(
  "ai_user_preferences",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 50 }).notNull().unique(),
    enabledFeatures: jsonb("enabled_features").default([]),
    riskTolerance: varchar("risk_tolerance", { length: 20 }).default("moderate"),
    tradingStyle: varchar("trading_style", { length: 20 }), // conservative, aggressive, balanced
    preferredSignalTypes: jsonb("preferred_signal_types"),
    notificationPreferences: jsonb("notification_preferences"),
    learningMode: boolean("learning_mode").default(true),
    confidenceThreshold: integer("confidence_threshold").default(70),
    maxPositionSize: decimal("max_position_size", { precision: 10, scale: 4 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("ai_prefs_user_idx").on(table.userId),
  ]
);

// Type exports
export type AITradingSignal = typeof aiTradingSignals.$inferSelect;
export type InsertAITradingSignal = typeof aiTradingSignals.$inferInsert;

export type AIMarketAnalysis = typeof aiMarketAnalysis.$inferSelect;
export type InsertAIMarketAnalysis = typeof aiMarketAnalysis.$inferInsert;

export type AIPortfolioOptimization = typeof aiPortfolioOptimizations.$inferSelect;
export type InsertAIPortfolioOptimization = typeof aiPortfolioOptimizations.$inferInsert;

export type AINaturalLanguageCommand = typeof aiNaturalLanguageCommands.$inferSelect;
export type InsertAINaturalLanguageCommand = typeof aiNaturalLanguageCommands.$inferInsert;

export type AIOrderRouting = typeof aiOrderRouting.$inferSelect;
export type InsertAIOrderRouting = typeof aiOrderRouting.$inferInsert;

export type AIRiskAssessment = typeof aiRiskAssessments.$inferSelect;
export type InsertAIRiskAssessment = typeof aiRiskAssessments.$inferInsert;

export type AIModelPerformance = typeof aiModelPerformance.$inferSelect;
export type InsertAIModelPerformance = typeof aiModelPerformance.$inferInsert;

export type AILearningData = typeof aiLearningData.$inferSelect;
export type InsertAILearningData = typeof aiLearningData.$inferInsert;

export type AIUserPreferences = typeof aiUserPreferences.$inferSelect;
export type InsertAIUserPreferences = typeof aiUserPreferences.$inferInsert;

// Zod schemas
export const insertAITradingSignalSchema = createInsertSchema(aiTradingSignals);
export const insertAIMarketAnalysisSchema = createInsertSchema(aiMarketAnalysis);
export const insertAIPortfolioOptimizationSchema = createInsertSchema(aiPortfolioOptimizations);
export const insertAINaturalLanguageCommandSchema = createInsertSchema(aiNaturalLanguageCommands);
export const insertAIOrderRoutingSchema = createInsertSchema(aiOrderRouting);
export const insertAIRiskAssessmentSchema = createInsertSchema(aiRiskAssessments);
export const insertAIModelPerformanceSchema = createInsertSchema(aiModelPerformance);
export const insertAILearningDataSchema = createInsertSchema(aiLearningData);
export const insertAIUserPreferencesSchema = createInsertSchema(aiUserPreferences);