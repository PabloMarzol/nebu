CREATE TABLE "fx_balance_reconciliations" (
	"id" serial PRIMARY KEY NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"reconciliation_type" varchar(30) NOT NULL,
	"stripe_fiat_currency" varchar(10) NOT NULL,
	"stripe_opening_balance" numeric(18, 2),
	"stripe_inflows" numeric(18, 2),
	"stripe_outflows" numeric(18, 2),
	"stripe_closing_balance" numeric(18, 2),
	"stripe_expected_balance" numeric(18, 2),
	"stripe_difference" numeric(18, 2),
	"crypto_token" varchar(20) NOT NULL,
	"crypto_opening_balance" numeric(30, 18),
	"crypto_swap_acquired" numeric(30, 18),
	"crypto_transferred_out" numeric(30, 18),
	"crypto_closing_balance" numeric(30, 18),
	"crypto_expected_balance" numeric(30, 18),
	"crypto_difference" numeric(30, 18),
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"discrepancy_notes" text,
	"resolved_by" varchar(36),
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fx_rate_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_currency" varchar(10) NOT NULL,
	"to_currency" varchar(10) NOT NULL,
	"rate" numeric(18, 8) NOT NULL,
	"source" varchar(50) NOT NULL,
	"source_metadata" jsonb,
	"confidence_score" numeric(5, 4),
	"spread_percent" numeric(5, 4),
	"timestamp" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fx_swap_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform_fee_percent" numeric(5, 4) DEFAULT '0.5' NOT NULL,
	"min_platform_fee_usd" numeric(18, 2) DEFAULT '1.00',
	"max_platform_fee_usd" numeric(18, 2) DEFAULT '50.00',
	"min_swap_amount_gbp" numeric(18, 2) DEFAULT '10.00' NOT NULL,
	"max_swap_amount_gbp" numeric(18, 2) DEFAULT '10000.00' NOT NULL,
	"daily_user_limit_gbp" numeric(18, 2) DEFAULT '5000.00',
	"max_slippage_percent" numeric(5, 4) DEFAULT '1.0',
	"fx_rate_validity_seconds" integer DEFAULT 30,
	"required_block_confirmations" integer DEFAULT 3,
	"fx_rate_sources" text[] NOT NULL,
	"hot_wallet_address" varchar(42) NOT NULL,
	"hot_wallet_min_balance" numeric(30, 18) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"maintenance_mode" boolean DEFAULT false,
	"maintenance_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fx_swap_orders" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"stripe_payment_intent_id" varchar(255) NOT NULL,
	"client_order_id" varchar(255) NOT NULL,
	"fiat_currency" varchar(10) NOT NULL,
	"fiat_amount" numeric(18, 2) NOT NULL,
	"target_token" varchar(20) NOT NULL,
	"target_token_amount" numeric(30, 18),
	"destination_wallet" varchar(42) NOT NULL,
	"fx_rate" numeric(18, 8) NOT NULL,
	"fx_rate_source" varchar(50) NOT NULL,
	"fx_rate_timestamp" timestamp NOT NULL,
	"platform_fee_percent" numeric(5, 4) NOT NULL,
	"platform_fee_amount" numeric(18, 8),
	"network_fee_amount" numeric(30, 18),
	"total_fees_usd" numeric(18, 2),
	"zero_x_quote_id" varchar(255),
	"zero_x_swap_data" jsonb,
	"executed_price" numeric(30, 18),
	"slippage_percent" numeric(5, 4),
	"swap_tx_hash" varchar(66),
	"transfer_tx_hash" varchar(66),
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"error_code" varchar(50),
	"retry_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"stripe_confirmed_at" timestamp,
	"fx_rate_locked_at" timestamp,
	"swap_started_at" timestamp,
	"swap_completed_at" timestamp,
	"transfer_started_at" timestamp,
	"completed_at" timestamp,
	"failed_at" timestamp,
	"ip_address" varchar(45),
	"user_agent" text,
	CONSTRAINT "fx_swap_orders_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id"),
	CONSTRAINT "fx_swap_orders_client_order_id_unique" UNIQUE("client_order_id")
);
--> statement-breakpoint
CREATE TABLE "fx_wallet_operations" (
	"id" serial PRIMARY KEY NOT NULL,
	"fx_swap_order_id" varchar(36) NOT NULL,
	"operation_type" varchar(30) NOT NULL,
	"token" varchar(20) NOT NULL,
	"amount" numeric(30, 18) NOT NULL,
	"from_address" varchar(42) NOT NULL,
	"to_address" varchar(42) NOT NULL,
	"chain_id" integer NOT NULL,
	"network" varchar(30) NOT NULL,
	"tx_hash" varchar(66),
	"block_number" integer,
	"confirmations" integer DEFAULT 0,
	"required_confirmations" integer DEFAULT 3,
	"gas_price" numeric(30, 18),
	"gas_used" integer,
	"gas_fee_paid" numeric(30, 18),
	"gas_fee_usd" numeric(18, 2),
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"broadcast_at" timestamp,
	"confirmed_at" timestamp,
	"failed_at" timestamp
);
--> statement-breakpoint
DROP TABLE "account_tiers" CASCADE;--> statement-breakpoint
DROP TABLE "admin_roles" CASCADE;--> statement-breakpoint
DROP TABLE "admin_users" CASCADE;--> statement-breakpoint
DROP TABLE "advanced_orders" CASCADE;--> statement-breakpoint
DROP TABLE "affiliate_commissions" CASCADE;--> statement-breakpoint
DROP TABLE "affiliate_programs" CASCADE;--> statement-breakpoint
DROP TABLE "aml_alerts" CASCADE;--> statement-breakpoint
DROP TABLE "api_credentials" CASCADE;--> statement-breakpoint
DROP TABLE "api_keys" CASCADE;--> statement-breakpoint
DROP TABLE "audit_trails" CASCADE;--> statement-breakpoint
DROP TABLE "copy_trading_follows" CASCADE;--> statement-breakpoint
DROP TABLE "copy_trading_masters" CASCADE;--> statement-breakpoint
DROP TABLE "crypto_learning_games" CASCADE;--> statement-breakpoint
DROP TABLE "crypto_payments" CASCADE;--> statement-breakpoint
DROP TABLE "customer_segments" CASCADE;--> statement-breakpoint
DROP TABLE "education_consent" CASCADE;--> statement-breakpoint
DROP TABLE "email_verification_tokens" CASCADE;--> statement-breakpoint
DROP TABLE "fiat_gateways" CASCADE;--> statement-breakpoint
DROP TABLE "fiat_transactions" CASCADE;--> statement-breakpoint
DROP TABLE "game_progress" CASCADE;--> statement-breakpoint
DROP TABLE "incidents" CASCADE;--> statement-breakpoint
DROP TABLE "kyc_queue" CASCADE;--> statement-breakpoint
DROP TABLE "kyc_verifications" CASCADE;--> statement-breakpoint
DROP TABLE "launchpad_participations" CASCADE;--> statement-breakpoint
DROP TABLE "launchpad_projects" CASCADE;--> statement-breakpoint
DROP TABLE "leaderboards" CASCADE;--> statement-breakpoint
DROP TABLE "liquidity_orders" CASCADE;--> statement-breakpoint
DROP TABLE "login_attempts" CASCADE;--> statement-breakpoint
DROP TABLE "margin_accounts" CASCADE;--> statement-breakpoint
DROP TABLE "margin_positions" CASCADE;--> statement-breakpoint
DROP TABLE "market_data" CASCADE;--> statement-breakpoint
DROP TABLE "market_maker_config" CASCADE;--> statement-breakpoint
DROP TABLE "mobile_devices" CASCADE;--> statement-breakpoint
DROP TABLE "order_book_health" CASCADE;--> statement-breakpoint
DROP TABLE "orders" CASCADE;--> statement-breakpoint
DROP TABLE "otc_deals" CASCADE;--> statement-breakpoint
DROP TABLE "otc_requests" CASCADE;--> statement-breakpoint
DROP TABLE "p2p_orders" CASCADE;--> statement-breakpoint
DROP TABLE "p2p_trades" CASCADE;--> statement-breakpoint
DROP TABLE "password_reset_tokens" CASCADE;--> statement-breakpoint
DROP TABLE "portfolio_wellness" CASCADE;--> statement-breakpoint
DROP TABLE "portfolios" CASCADE;--> statement-breakpoint
DROP TABLE "price_alerts" CASCADE;--> statement-breakpoint
DROP TABLE "push_notifications" CASCADE;--> statement-breakpoint
DROP TABLE "revenue_metrics" CASCADE;--> statement-breakpoint
DROP TABLE "revenue_streams" CASCADE;--> statement-breakpoint
DROP TABLE "sar_reports" CASCADE;--> statement-breakpoint
DROP TABLE "security_events" CASCADE;--> statement-breakpoint
DROP TABLE "sentiment_analysis" CASCADE;--> statement-breakpoint
DROP TABLE "sessions" CASCADE;--> statement-breakpoint
DROP TABLE "sms_notifications" CASCADE;--> statement-breakpoint
DROP TABLE "social_training_community" CASCADE;--> statement-breakpoint
DROP TABLE "staking_positions" CASCADE;--> statement-breakpoint
DROP TABLE "support_messages" CASCADE;--> statement-breakpoint
DROP TABLE "support_tickets" CASCADE;--> statement-breakpoint
DROP TABLE "system_logs" CASCADE;--> statement-breakpoint
DROP TABLE "trades" CASCADE;--> statement-breakpoint
DROP TABLE "trading_incidents" CASCADE;--> statement-breakpoint
DROP TABLE "transactions" CASCADE;--> statement-breakpoint
DROP TABLE "user_activity" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
DROP TABLE "wallet_balances" CASCADE;--> statement-breakpoint
DROP TABLE "wallet_reconciliations" CASCADE;--> statement-breakpoint
DROP TABLE "wallets" CASCADE;--> statement-breakpoint
DROP TABLE "withdrawal_queue" CASCADE;--> statement-breakpoint
DROP TABLE "ai_learning_data" CASCADE;--> statement-breakpoint
DROP TABLE "ai_market_analysis" CASCADE;--> statement-breakpoint
DROP TABLE "ai_model_performance" CASCADE;--> statement-breakpoint
DROP TABLE "ai_natural_language_commands" CASCADE;--> statement-breakpoint
DROP TABLE "ai_order_routing" CASCADE;--> statement-breakpoint
DROP TABLE "ai_portfolio_optimizations" CASCADE;--> statement-breakpoint
DROP TABLE "ai_risk_assessments" CASCADE;--> statement-breakpoint
DROP TABLE "ai_trading_signals" CASCADE;--> statement-breakpoint
DROP TABLE "ai_user_preferences" CASCADE;--> statement-breakpoint
ALTER TABLE "fx_swap_orders" ADD CONSTRAINT "fx_swap_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fx_wallet_operations" ADD CONSTRAINT "fx_wallet_operations_fx_swap_order_id_fx_swap_orders_id_fk" FOREIGN KEY ("fx_swap_order_id") REFERENCES "public"."fx_swap_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_fx_reconciliation_period" ON "fx_balance_reconciliations" USING btree ("period_end");--> statement-breakpoint
CREATE INDEX "idx_fx_reconciliation_status" ON "fx_balance_reconciliations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_fx_rate_pair" ON "fx_rate_snapshots" USING btree ("from_currency","to_currency");--> statement-breakpoint
CREATE INDEX "idx_fx_rate_timestamp" ON "fx_rate_snapshots" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "idx_fx_swap_user" ON "fx_swap_orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_fx_swap_stripe_payment" ON "fx_swap_orders" USING btree ("stripe_payment_intent_id");--> statement-breakpoint
CREATE INDEX "idx_fx_swap_status" ON "fx_swap_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_fx_swap_created" ON "fx_swap_orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_fx_wallet_order" ON "fx_wallet_operations" USING btree ("fx_swap_order_id");--> statement-breakpoint
CREATE INDEX "idx_fx_wallet_tx_hash" ON "fx_wallet_operations" USING btree ("tx_hash");--> statement-breakpoint
CREATE INDEX "idx_fx_wallet_status" ON "fx_wallet_operations" USING btree ("status");