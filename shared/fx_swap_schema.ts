import {
  pgTable,
  serial,
  varchar,
  decimal,
  timestamp,
  text,
  integer,
  jsonb,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./schema";

// FX Swap Orders - Main order tracking table
export const fxSwapOrders = pgTable(
  "fx_swap_orders",
  {
    id: varchar("id", { length: 36 }).primaryKey(), // UUID format
    userId: varchar("user_id", { length: 36 })
      .references(() => users.id)
      .notNull(),
    
    // Stripe payment details
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }).notNull().unique(),
    clientOrderId: varchar("client_order_id", { length: 255 }).notNull().unique(),
    
    // Fiat input
    fiatCurrency: varchar("fiat_currency", { length: 10 }).notNull(), // GBP, EUR, USD
    fiatAmount: decimal("fiat_amount", { precision: 18, scale: 2 }).notNull(),
    
    // Target crypto output
    targetToken: varchar("target_token", { length: 20 }).notNull(), // USDT, USDC, DAI
    targetTokenAmount: decimal("target_token_amount", { precision: 30, scale: 18 }),
    destinationWallet: varchar("destination_wallet", { length: 42 }).notNull(), // 0x...
    
    // FX rate snapshot
    fxRate: decimal("fx_rate", { precision: 18, scale: 8 }).notNull(), // GBP->USD rate
    fxRateSource: varchar("fx_rate_source", { length: 50 }).notNull(), // chainlink, pyth, coingecko
    fxRateTimestamp: timestamp("fx_rate_timestamp").notNull(),
    
    // Fees
    platformFeePercent: decimal("platform_fee_percent", { precision: 5, scale: 4 }).notNull(), // e.g., 0.5%
    platformFeeAmount: decimal("platform_fee_amount", { precision: 18, scale: 8 }),
    networkFeeAmount: decimal("network_fee_amount", { precision: 30, scale: 18 }), // Gas fee in ETH/native token
    totalFeesUsd: decimal("total_fees_usd", { precision: 18, scale: 2 }),
    
    // 0x swap execution details
    zeroXQuoteId: varchar("zero_x_quote_id", { length: 255 }),
    zeroXSwapData: jsonb("zero_x_swap_data"), // Full quote response
    executedPrice: decimal("executed_price", { precision: 30, scale: 18 }), // Actual execution price
    slippagePercent: decimal("slippage_percent", { precision: 5, scale: 4 }), // Actual slippage
    
    // Transaction hashes
    swapTxHash: varchar("swap_tx_hash", { length: 66 }), // 0x + 64 chars
    transferTxHash: varchar("transfer_tx_hash", { length: 66 }), // Transfer to user wallet
    
    // Status tracking
    status: varchar("status", { length: 30 }).notNull().default("pending"),
    // Status flow: pending -> stripe_confirmed -> fx_rate_locked -> swap_executing -> swap_completed -> transfer_executing -> completed
    // Or: pending -> stripe_failed / swap_failed / transfer_failed -> refund_pending -> refunded
    
    // Error handling
    errorMessage: text("error_message"),
    errorCode: varchar("error_code", { length: 50 }),
    retryCount: integer("retry_count").default(0),
    
    // Timestamps for each stage
    createdAt: timestamp("created_at").defaultNow().notNull(),
    stripeConfirmedAt: timestamp("stripe_confirmed_at"),
    fxRateLockedAt: timestamp("fx_rate_locked_at"),
    swapStartedAt: timestamp("swap_started_at"),
    swapCompletedAt: timestamp("swap_completed_at"),
    transferStartedAt: timestamp("transfer_started_at"),
    completedAt: timestamp("completed_at"),
    failedAt: timestamp("failed_at"),
    
    // Audit fields
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
  },
  (table) => [
    index("idx_fx_swap_user").on(table.userId),
    index("idx_fx_swap_stripe_payment").on(table.stripePaymentIntentId),
    index("idx_fx_swap_status").on(table.status),
    index("idx_fx_swap_created").on(table.createdAt),
  ]
);

// FX Rate Snapshots - Historical rate tracking for audit & compliance
export const fxRateSnapshots = pgTable(
  "fx_rate_snapshots",
  {
    id: serial("id").primaryKey(),
    
    // Rate details
    fromCurrency: varchar("from_currency", { length: 10 }).notNull(),
    toCurrency: varchar("to_currency", { length: 10 }).notNull(),
    rate: decimal("rate", { precision: 18, scale: 8 }).notNull(),
    
    // Source details
    source: varchar("source", { length: 50 }).notNull(), // chainlink, pyth, coingecko, aggregated
    sourceMetadata: jsonb("source_metadata"), // API response, oracle address, etc.
    
    // Quality metrics
    confidenceScore: decimal("confidence_score", { precision: 5, scale: 4 }), // 0-1 confidence
    spreadPercent: decimal("spread_percent", { precision: 5, scale: 4 }), // Bid-ask spread
    
    // Timing
    timestamp: timestamp("timestamp").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_fx_rate_pair").on(table.fromCurrency, table.toCurrency),
    index("idx_fx_rate_timestamp").on(table.timestamp),
  ]
);

// Wallet Operations - Track all USDT transfers to user wallets
export const fxWalletOperations = pgTable(
  "fx_wallet_operations",
  {
    id: serial("id").primaryKey(),
    fxSwapOrderId: varchar("fx_swap_order_id", { length: 36 })
      .references(() => fxSwapOrders.id)
      .notNull(),
    
    // Operation details
    operationType: varchar("operation_type", { length: 30 }).notNull(), // transfer_to_user, refund
    token: varchar("token", { length: 20 }).notNull(),
    amount: decimal("amount", { precision: 30, scale: 18 }).notNull(),
    
    // Addresses
    fromAddress: varchar("from_address", { length: 42 }).notNull(), // Platform hot wallet
    toAddress: varchar("to_address", { length: 42 }).notNull(), // User wallet or refund address
    
    // Blockchain details
    chainId: integer("chain_id").notNull(), // 1 for mainnet, 11155111 for sepolia
    network: varchar("network", { length: 30 }).notNull(), // mainnet, sepolia
    txHash: varchar("tx_hash", { length: 66 }),
    blockNumber: integer("block_number"),
    confirmations: integer("confirmations").default(0),
    requiredConfirmations: integer("required_confirmations").default(3),
    
    // Gas tracking
    gasPrice: decimal("gas_price", { precision: 30, scale: 18 }), // in wei
    gasUsed: integer("gas_used"),
    gasFeePaid: decimal("gas_fee_paid", { precision: 30, scale: 18 }), // in native token
    gasFeeUsd: decimal("gas_fee_usd", { precision: 18, scale: 2 }),
    
    // Status
    status: varchar("status", { length: 30 }).notNull().default("pending"),
    // pending -> broadcast -> confirming -> confirmed / failed
    
    errorMessage: text("error_message"),
    
    // Timing
    createdAt: timestamp("created_at").defaultNow().notNull(),
    broadcastAt: timestamp("broadcast_at"),
    confirmedAt: timestamp("confirmed_at"),
    failedAt: timestamp("failed_at"),
  },
  (table) => [
    index("idx_fx_wallet_order").on(table.fxSwapOrderId),
    index("idx_fx_wallet_tx_hash").on(table.txHash),
    index("idx_fx_wallet_status").on(table.status),
  ]
);

// Platform Balance Reconciliation - Daily/hourly balance checks
export const fxBalanceReconciliations = pgTable(
  "fx_balance_reconciliations",
  {
    id: serial("id").primaryKey(),
    
    // Reconciliation period
    periodStart: timestamp("period_start").notNull(),
    periodEnd: timestamp("period_end").notNull(),
    reconciliationType: varchar("reconciliation_type", { length: 30 }).notNull(), // hourly, daily, manual
    
    // Fiat side (Stripe)
    stripeFiatCurrency: varchar("stripe_fiat_currency", { length: 10 }).notNull(),
    stripeOpeningBalance: decimal("stripe_opening_balance", { precision: 18, scale: 2 }),
    stripeInflows: decimal("stripe_inflows", { precision: 18, scale: 2 }), // Total deposits
    stripeOutflows: decimal("stripe_outflows", { precision: 18, scale: 2 }), // Total withdrawals/refunds
    stripeClosingBalance: decimal("stripe_closing_balance", { precision: 18, scale: 2 }),
    stripeExpectedBalance: decimal("stripe_expected_balance", { precision: 18, scale: 2 }),
    stripeDifference: decimal("stripe_difference", { precision: 18, scale: 2 }),
    
    // Crypto side (On-chain wallets)
    cryptoToken: varchar("crypto_token", { length: 20 }).notNull(),
    cryptoOpeningBalance: decimal("crypto_opening_balance", { precision: 30, scale: 18 }),
    cryptoSwapAcquired: decimal("crypto_swap_acquired", { precision: 30, scale: 18 }), // Bought via 0x
    cryptoTransferredOut: decimal("crypto_transferred_out", { precision: 30, scale: 18 }), // Sent to users
    cryptoClosingBalance: decimal("crypto_closing_balance", { precision: 30, scale: 18 }),
    cryptoExpectedBalance: decimal("crypto_expected_balance", { precision: 30, scale: 18 }),
    cryptoDifference: decimal("crypto_difference", { precision: 30, scale: 18 }),
    
    // Status
    status: varchar("status", { length: 30 }).notNull().default("pending"),
    // pending -> reconciled -> discrepancy_found -> resolved
    
    discrepancyNotes: text("discrepancy_notes"),
    resolvedBy: varchar("resolved_by", { length: 36 }), // Admin user ID
    resolvedAt: timestamp("resolved_at"),
    
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_fx_reconciliation_period").on(table.periodEnd),
    index("idx_fx_reconciliation_status").on(table.status),
  ]
);

// FX Swap Configuration - Platform settings
export const fxSwapConfigs = pgTable("fx_swap_configs", {
  id: serial("id").primaryKey(),
  
  // Fee configuration
  platformFeePercent: decimal("platform_fee_percent", { precision: 5, scale: 4 }).notNull().default("0.5"), // 0.5%
  minPlatformFeeUsd: decimal("min_platform_fee_usd", { precision: 18, scale: 2 }).default("1.00"),
  maxPlatformFeeUsd: decimal("max_platform_fee_usd", { precision: 18, scale: 2 }).default("50.00"),
  
  // Limits
  minSwapAmountGbp: decimal("min_swap_amount_gbp", { precision: 18, scale: 2 }).notNull().default("5.00"),
  maxSwapAmountGbp: decimal("max_swap_amount_gbp", { precision: 18, scale: 2 }).notNull().default("10000.00"),
  dailyUserLimitGbp: decimal("daily_user_limit_gbp", { precision: 18, scale: 2 }).default("5000.00"),
  
  // Risk parameters
  maxSlippagePercent: decimal("max_slippage_percent", { precision: 5, scale: 4 }).default("1.0"), // 1%
  fxRateValiditySeconds: integer("fx_rate_validity_seconds").default(30), // Rate locked for 30s
  requiredBlockConfirmations: integer("required_block_confirmations").default(3),
  
  // FX rate sources (ordered by priority)
  fxRateSources: text("fx_rate_sources").array().notNull(), // ['chainlink', 'pyth', 'coingecko']
  
  // Hot wallet configuration
  hotWalletAddress: varchar("hot_wallet_address", { length: 42 }).notNull(),
  hotWalletMinBalance: decimal("hot_wallet_min_balance", { precision: 30, scale: 18 }).notNull(), // Alert threshold
  
  // Operational settings
  isActive: boolean("is_active").notNull().default(true),
  maintenanceMode: boolean("maintenance_mode").default(false),
  maintenanceMessage: text("maintenance_message"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertFxSwapOrderSchema = createInsertSchema(fxSwapOrders).omit({
  createdAt: true,
});

export const insertFxRateSnapshotSchema = createInsertSchema(fxRateSnapshots).omit({
  id: true,
  createdAt: true,
});

export const insertFxWalletOperationSchema = createInsertSchema(fxWalletOperations).omit({
  id: true,
  createdAt: true,
});

export const insertFxBalanceReconciliationSchema = createInsertSchema(fxBalanceReconciliations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFxSwapConfigSchema = createInsertSchema(fxSwapConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type FxSwapOrder = typeof fxSwapOrders.$inferSelect;
export type InsertFxSwapOrder = z.infer<typeof insertFxSwapOrderSchema>;

export type FxRateSnapshot = typeof fxRateSnapshots.$inferSelect;
export type InsertFxRateSnapshot = z.infer<typeof insertFxRateSnapshotSchema>;

export type FxWalletOperation = typeof fxWalletOperations.$inferSelect;
export type InsertFxWalletOperation = z.infer<typeof insertFxWalletOperationSchema>;

export type FxBalanceReconciliation = typeof fxBalanceReconciliations.$inferSelect;
export type InsertFxBalanceReconciliation = z.infer<typeof insertFxBalanceReconciliationSchema>;

export type FxSwapConfig = typeof fxSwapConfigs.$inferSelect;
export type InsertFxSwapConfig = z.infer<typeof insertFxSwapConfigSchema>;

// Status enums for type safety
export const FxSwapOrderStatus = {
  PENDING: "pending",
  STRIPE_CONFIRMED: "stripe_confirmed",
  FX_RATE_LOCKED: "fx_rate_locked",
  SWAP_EXECUTING: "swap_executing",
  SWAP_COMPLETED: "swap_completed",
  TRANSFER_EXECUTING: "transfer_executing",
  COMPLETED: "completed",
  STRIPE_FAILED: "stripe_failed",
  SWAP_FAILED: "swap_failed",
  TRANSFER_FAILED: "transfer_failed",
  REFUND_PENDING: "refund_pending",
  REFUNDED: "refunded",
} as const;

export const WalletOperationStatus = {
  PENDING: "pending",
  BROADCAST: "broadcast",
  CONFIRMING: "confirming",
  CONFIRMED: "confirmed",
  FAILED: "failed",
} as const;

export const ReconciliationStatus = {
  PENDING: "pending",
  RECONCILED: "reconciled",
  DISCREPANCY_FOUND: "discrepancy_found",
  RESOLVED: "resolved",
} as const;