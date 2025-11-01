CREATE TABLE "account_tiers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"display_name" varchar NOT NULL,
	"daily_trading_limit" numeric(18, 2),
	"daily_withdrawal_limit" numeric(18, 2),
	"monthly_withdrawal_limit" numeric(18, 2),
	"max_open_orders" integer DEFAULT 10,
	"kyc_required" boolean DEFAULT false,
	"phone_verification_required" boolean DEFAULT false,
	"two_factor_required" boolean DEFAULT false,
	"trading_fee_discount" numeric(5, 2) DEFAULT '0',
	"features" jsonb DEFAULT '{}',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_name" varchar NOT NULL,
	"description" text,
	"permissions" jsonb NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_roles_role_name_unique" UNIQUE("role_name")
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"role_id" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_login" timestamp,
	"two_factor_enabled" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "advanced_orders" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"symbol" varchar NOT NULL,
	"type" varchar NOT NULL,
	"side" varchar NOT NULL,
	"amount" numeric(18, 8) NOT NULL,
	"price" numeric(18, 8),
	"stop_price" numeric(18, 8),
	"trailing_amount" numeric(18, 8),
	"time_in_force" varchar DEFAULT 'GTC',
	"status" varchar DEFAULT 'pending',
	"linked_order_id" varchar,
	"executed_amount" numeric(18, 8) DEFAULT '0',
	"average_price" numeric(18, 8),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "affiliate_commissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"affiliate_id" integer NOT NULL,
	"referred_user_id" varchar NOT NULL,
	"commission_type" varchar NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"currency" varchar DEFAULT 'USDT',
	"status" varchar DEFAULT 'pending',
	"paid_at" timestamp,
	"transaction_id" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "affiliate_programs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"affiliate_code" varchar NOT NULL,
	"status" varchar DEFAULT 'pending',
	"tier" varchar DEFAULT 'bronze',
	"commission_rate" numeric(5, 4) DEFAULT '0.0010',
	"total_earnings" numeric(18, 2) DEFAULT '0',
	"total_referrals" integer DEFAULT 0,
	"active_referrals" integer DEFAULT 0,
	"payout_method" varchar DEFAULT 'crypto',
	"payout_address" varchar,
	"last_payout_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "affiliate_programs_affiliate_code_unique" UNIQUE("affiliate_code")
);
--> statement-breakpoint
CREATE TABLE "aml_alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"alert_type" varchar NOT NULL,
	"severity" varchar DEFAULT 'medium',
	"transaction_id" varchar,
	"amount" numeric(18, 2),
	"currency" varchar,
	"flag_reason" text NOT NULL,
	"status" varchar DEFAULT 'open',
	"assigned_to" varchar,
	"sar_generated" boolean DEFAULT false,
	"resolved_at" timestamp,
	"resolved_by" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "api_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"credential_name" varchar NOT NULL,
	"api_key" varchar NOT NULL,
	"api_secret" varchar NOT NULL,
	"permissions" text[],
	"rate_limit" integer DEFAULT 1000,
	"ip_whitelist" text[],
	"is_active" boolean DEFAULT true,
	"last_used" timestamp,
	"total_requests" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	CONSTRAINT "api_credentials_api_key_unique" UNIQUE("api_key")
);
--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"key_id" varchar NOT NULL,
	"key_secret" varchar NOT NULL,
	"permissions" text[] NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_used" timestamp,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "api_keys_key_id_unique" UNIQUE("key_id")
);
--> statement-breakpoint
CREATE TABLE "audit_trails" (
	"id" serial PRIMARY KEY NOT NULL,
	"entity_type" varchar NOT NULL,
	"entity_id" varchar NOT NULL,
	"action" varchar NOT NULL,
	"changes" jsonb DEFAULT '{}',
	"old_values" jsonb DEFAULT '{}',
	"new_values" jsonb DEFAULT '{}',
	"performed_by" varchar NOT NULL,
	"user_agent" text,
	"ip_address" varchar,
	"session_id" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "copy_trading_follows" (
	"id" serial PRIMARY KEY NOT NULL,
	"follower_id" varchar NOT NULL,
	"master_id" integer NOT NULL,
	"copy_ratio" numeric(5, 2) DEFAULT '100',
	"max_copy_amount" numeric(18, 2),
	"stop_loss" numeric(5, 2),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "copy_trading_masters" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"display_name" varchar NOT NULL,
	"bio" text,
	"verified" boolean DEFAULT false,
	"tier" varchar DEFAULT 'bronze',
	"total_return" numeric(10, 2) DEFAULT '0',
	"monthly_return" numeric(10, 2) DEFAULT '0',
	"win_rate" numeric(5, 2) DEFAULT '0',
	"followers" integer DEFAULT 0,
	"aum" numeric(18, 2) DEFAULT '0',
	"max_drawdown" numeric(5, 2) DEFAULT '0',
	"trading_style" varchar,
	"risk_score" integer DEFAULT 5,
	"avg_trade_duration" varchar,
	"copy_fee" numeric(5, 2) DEFAULT '0',
	"min_copy_amount" numeric(18, 2) DEFAULT '100',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "crypto_learning_games" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"difficulty" text NOT NULL,
	"xp_reward" integer DEFAULT 100,
	"token_reward" numeric(10, 4) DEFAULT '0',
	"questions" text[],
	"correct_answers" text[],
	"time_limit" integer DEFAULT 300,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "crypto_learning_games_game_id_unique" UNIQUE("game_id")
);
--> statement-breakpoint
CREATE TABLE "crypto_payments" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"amount" numeric(18, 8) NOT NULL,
	"currency" varchar NOT NULL,
	"to_address" varchar NOT NULL,
	"from_address" varchar,
	"transaction_hash" varchar,
	"block_number" integer,
	"confirmations" integer DEFAULT 0,
	"required_confirmations" integer DEFAULT 3,
	"status" varchar DEFAULT 'pending',
	"network" varchar DEFAULT 'mainnet',
	"gas_price" numeric(18, 8),
	"gas_used" integer,
	"exchange_rate" numeric(18, 8),
	"usd_value" numeric(18, 2),
	"description" text,
	"metadata" jsonb,
	"expires_at" timestamp,
	"confirmed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "customer_segments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"segment" varchar NOT NULL,
	"segment_score" numeric(10, 2) DEFAULT '0',
	"assigned_manager" varchar,
	"risk_level" varchar DEFAULT 'low',
	"lifetime_value" numeric(18, 2) DEFAULT '0',
	"last_contact_date" timestamp,
	"next_review_date" timestamp,
	"tags" text[],
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "education_consent" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"consent_type" text NOT NULL,
	"consent_text" text NOT NULL,
	"agreed_at" timestamp DEFAULT now(),
	"ip_address" text,
	"user_agent" text,
	"document_version" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"revoked_at" timestamp,
	"legal_compliance" text[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "email_verification_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"token" varchar NOT NULL,
	"email" varchar NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fiat_gateways" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"display_name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"supported_currencies" text[],
	"supported_countries" text[],
	"min_amount" numeric(18, 2),
	"max_amount" numeric(18, 2),
	"processing_time" varchar,
	"fees" jsonb,
	"is_active" boolean DEFAULT true,
	"configuration" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fiat_transactions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"gateway_id" integer NOT NULL,
	"type" varchar NOT NULL,
	"currency" varchar NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"fee" numeric(18, 2) DEFAULT '0',
	"net_amount" numeric(18, 2) NOT NULL,
	"status" varchar DEFAULT 'pending',
	"external_reference" varchar,
	"payment_method" jsonb,
	"bank_details" jsonb,
	"metadata" jsonb,
	"failure_reason" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "game_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"game_id" text,
	"score" integer NOT NULL,
	"xp_earned" integer NOT NULL,
	"tokens_earned" numeric(10, 4) DEFAULT '0',
	"completion_time" integer,
	"answers" text[],
	"completed" boolean DEFAULT false,
	"attempts" integer DEFAULT 1,
	"best_score" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "incidents" (
	"id" serial PRIMARY KEY NOT NULL,
	"incident_number" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"category" varchar NOT NULL,
	"severity" varchar NOT NULL,
	"status" varchar DEFAULT 'open',
	"priority" varchar DEFAULT 'medium',
	"affected_systems" text[],
	"affected_users" integer DEFAULT 0,
	"reported_by" varchar NOT NULL,
	"assigned_to" varchar,
	"escalated_to" varchar,
	"root_cause" text,
	"resolution" text,
	"preventive_measures" text,
	"estimated_impact" numeric(18, 2),
	"actual_impact" numeric(18, 2),
	"mttr" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"resolved_at" timestamp,
	CONSTRAINT "incidents_incident_number_unique" UNIQUE("incident_number")
);
--> statement-breakpoint
CREATE TABLE "kyc_queue" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"kyc_level" integer NOT NULL,
	"status" varchar DEFAULT 'pending',
	"priority" varchar DEFAULT 'normal',
	"assigned_to" varchar,
	"document_scans" jsonb DEFAULT '{}',
	"liveness_check" jsonb DEFAULT '{}',
	"risk_flags" text[] DEFAULT '{}',
	"admin_notes" text,
	"reviewed_at" timestamp,
	"reviewed_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kyc_verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"level" integer NOT NULL,
	"document_type" varchar,
	"document_number" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"date_of_birth" timestamp,
	"nationality" varchar,
	"address" text,
	"city" varchar,
	"country" varchar,
	"postal_code" varchar,
	"phone_number" varchar,
	"status" varchar DEFAULT 'pending',
	"rejection_reason" text,
	"expires_at" timestamp,
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "launchpad_participations" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"tokens_allocated" numeric(18, 8),
	"status" varchar DEFAULT 'pending',
	"tier" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "launchpad_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"symbol" varchar NOT NULL,
	"description" text,
	"long_description" text,
	"category" varchar NOT NULL,
	"logo" varchar,
	"website" varchar,
	"whitepaper" varchar,
	"total_supply" numeric(30, 0) NOT NULL,
	"launch_price" numeric(18, 8) NOT NULL,
	"target_raise" numeric(18, 2) NOT NULL,
	"current_raise" numeric(18, 2) DEFAULT '0',
	"max_participants" integer,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" varchar DEFAULT 'upcoming',
	"allocation" jsonb,
	"vesting_schedule" text,
	"minimum_buy" numeric(18, 2),
	"maximum_buy" numeric(18, 2),
	"chain_id" varchar,
	"contract_address" varchar,
	"social_links" jsonb,
	"team" jsonb,
	"roadmap" jsonb,
	"tokenomics" jsonb,
	"risk_factors" jsonb,
	"highlights" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leaderboards" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"category" text NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"username" text NOT NULL,
	"score" numeric(10, 2) NOT NULL,
	"rank" integer NOT NULL,
	"change" integer DEFAULT 0,
	"period" text NOT NULL,
	"metadata" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "liquidity_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" varchar NOT NULL,
	"side" varchar NOT NULL,
	"order_type" varchar DEFAULT 'market_making',
	"quantity" numeric(18, 8) NOT NULL,
	"price" numeric(18, 8) NOT NULL,
	"spread_target" numeric(5, 4) NOT NULL,
	"max_exposure" numeric(18, 8) NOT NULL,
	"current_exposure" numeric(18, 8) DEFAULT '0',
	"is_active" boolean DEFAULT true,
	"algorithm_type" varchar DEFAULT 'grid',
	"risk_parameters" jsonb,
	"performance_metrics" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "login_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"email" varchar,
	"ip_address" varchar,
	"user_agent" text,
	"successful" boolean DEFAULT false,
	"failure_reason" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "margin_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"collateral_value" numeric(18, 2) DEFAULT '0',
	"borrowed_value" numeric(18, 2) DEFAULT '0',
	"available_margin" numeric(18, 2) DEFAULT '0',
	"margin_ratio" numeric(5, 2) DEFAULT '0',
	"liquidation_threshold" numeric(5, 2) DEFAULT '80',
	"is_active" boolean DEFAULT false,
	"risk_score" integer DEFAULT 5,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "margin_positions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"margin_account_id" integer NOT NULL,
	"symbol" varchar NOT NULL,
	"side" varchar NOT NULL,
	"size" numeric(18, 8) NOT NULL,
	"entry_price" numeric(18, 8) NOT NULL,
	"mark_price" numeric(18, 8),
	"unrealized_pnl" numeric(18, 8) DEFAULT '0',
	"realized_pnl" numeric(18, 8) DEFAULT '0',
	"leverage" numeric(5, 2) DEFAULT '1',
	"liquidation_price" numeric(18, 8),
	"status" varchar DEFAULT 'open',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" varchar NOT NULL,
	"price" numeric(18, 8) NOT NULL,
	"change_24h" numeric(10, 4),
	"volume_24h" numeric(18, 2),
	"market_cap" numeric(20, 2),
	"high_24h" numeric(18, 8),
	"low_24h" numeric(18, 8),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_maker_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" varchar NOT NULL,
	"is_active" boolean DEFAULT true,
	"spread_bps" integer DEFAULT 10,
	"max_position_size" numeric(30, 18),
	"order_refresh_interval" integer DEFAULT 30,
	"volatility_threshold" numeric(5, 4) DEFAULT '0.05',
	"emergency_halt" boolean DEFAULT false,
	"last_price_update" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mobile_devices" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"device_id" varchar NOT NULL,
	"platform" varchar NOT NULL,
	"device_model" varchar,
	"os_version" varchar,
	"app_version" varchar,
	"push_token" varchar,
	"is_jailbroken" boolean DEFAULT false,
	"risk_score" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"last_seen" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "mobile_devices_device_id_unique" UNIQUE("device_id")
);
--> statement-breakpoint
CREATE TABLE "order_book_health" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" varchar NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"bid_depth" numeric(18, 8) NOT NULL,
	"ask_depth" numeric(18, 8) NOT NULL,
	"spread" numeric(18, 8) NOT NULL,
	"spread_percent" numeric(5, 4) NOT NULL,
	"mid_price" numeric(18, 8) NOT NULL,
	"volume_24h" numeric(18, 2) NOT NULL,
	"order_count" integer NOT NULL,
	"avg_order_size" numeric(18, 8) NOT NULL,
	"latency" integer,
	"health_score" numeric(5, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"symbol" text NOT NULL,
	"side" text NOT NULL,
	"type" text NOT NULL,
	"amount" numeric(18, 8) NOT NULL,
	"price" numeric(18, 8),
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "otc_deals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"asset" varchar NOT NULL,
	"amount" numeric(18, 8) NOT NULL,
	"price" numeric(18, 8),
	"total_value" numeric(18, 2) NOT NULL,
	"min_counterparty_rating" numeric(3, 1) DEFAULT '0',
	"visibility" varchar DEFAULT 'public',
	"escrow_required" boolean DEFAULT true,
	"kyc_required" boolean DEFAULT true,
	"institutional_only" boolean DEFAULT false,
	"status" varchar DEFAULT 'pending',
	"expires_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "otc_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"request_type" varchar NOT NULL,
	"asset" varchar NOT NULL,
	"amount" numeric(30, 18) NOT NULL,
	"side" varchar NOT NULL,
	"target_price" numeric(18, 8),
	"max_slippage" numeric(5, 4),
	"timeframe" varchar,
	"status" varchar DEFAULT 'pending',
	"assigned_to" varchar,
	"quoted_price" numeric(18, 8),
	"quoted_at" timestamp,
	"executed_at" timestamp,
	"margin" numeric(5, 4),
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "p2p_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"asset" varchar NOT NULL,
	"fiat_currency" varchar NOT NULL,
	"amount" numeric(18, 8) NOT NULL,
	"price" numeric(18, 2) NOT NULL,
	"payment_methods" jsonb NOT NULL,
	"min_limit" numeric(18, 2),
	"max_limit" numeric(18, 2),
	"terms" text,
	"status" varchar DEFAULT 'active',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "p2p_trades" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"buyer_id" varchar NOT NULL,
	"seller_id" varchar NOT NULL,
	"amount" numeric(18, 8) NOT NULL,
	"fiat_amount" numeric(18, 2) NOT NULL,
	"payment_method" varchar NOT NULL,
	"status" varchar DEFAULT 'pending',
	"escrow_released" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"token" varchar NOT NULL,
	"email" varchar NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "portfolio_wellness" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"overall_score" numeric(5, 2) NOT NULL,
	"diversification_score" numeric(5, 2) NOT NULL,
	"risk_score" numeric(5, 2) NOT NULL,
	"performance_score" numeric(5, 2) NOT NULL,
	"volatility_score" numeric(5, 2) NOT NULL,
	"recommendations" text[],
	"risk_level" text NOT NULL,
	"health_status" text NOT NULL,
	"improvements" text[],
	"next_review" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"symbol" text NOT NULL,
	"balance" numeric(18, 8) NOT NULL,
	"locked_balance" numeric(18, 8) DEFAULT '0',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"symbol" varchar NOT NULL,
	"target_price" numeric(18, 8) NOT NULL,
	"direction" varchar NOT NULL,
	"is_active" boolean DEFAULT true,
	"notification_method" varchar DEFAULT 'sms',
	"phone_number" varchar,
	"last_triggered" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "push_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"device_id" varchar,
	"title" varchar NOT NULL,
	"body" text NOT NULL,
	"data" jsonb DEFAULT '{}',
	"type" varchar NOT NULL,
	"status" varchar DEFAULT 'pending',
	"sent_at" timestamp,
	"delivered_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "revenue_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"trading_fees" numeric(18, 2) DEFAULT '0',
	"withdrawal_fees" numeric(18, 2) DEFAULT '0',
	"spread_income" numeric(18, 2) DEFAULT '0',
	"otc_revenue" numeric(18, 2) DEFAULT '0',
	"listing_fees" numeric(18, 2) DEFAULT '0',
	"affiliate_payouts" numeric(18, 2) DEFAULT '0',
	"total_revenue" numeric(18, 2) DEFAULT '0',
	"active_users" integer DEFAULT 0,
	"trading_volume" numeric(30, 18) DEFAULT '0',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "revenue_streams" (
	"id" serial PRIMARY KEY NOT NULL,
	"stream_type" varchar NOT NULL,
	"user_id" varchar,
	"order_id" integer,
	"trade_id" integer,
	"amount" numeric(18, 8) NOT NULL,
	"currency" varchar NOT NULL,
	"fee_rate" numeric(5, 4),
	"description" text,
	"transaction_date" timestamp DEFAULT now(),
	"settlement_date" timestamp,
	"status" varchar DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sar_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"report_type" varchar NOT NULL,
	"report_number" varchar NOT NULL,
	"status" varchar DEFAULT 'draft',
	"filing_date" timestamp,
	"regulatory_body" varchar,
	"suspicious_activity" text NOT NULL,
	"transaction_details" jsonb DEFAULT '{}',
	"narrative_description" text,
	"attachments" jsonb DEFAULT '[]',
	"submitted_by" varchar,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "sar_reports_report_number_unique" UNIQUE("report_number")
);
--> statement-breakpoint
CREATE TABLE "security_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"event_type" varchar NOT NULL,
	"description" text,
	"ip_address" varchar,
	"user_agent" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sentiment_analysis" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"asset" text NOT NULL,
	"sentiment" text NOT NULL,
	"confidence" numeric(5, 3) NOT NULL,
	"source" text NOT NULL,
	"raw_data" text,
	"timestamp" timestamp DEFAULT now(),
	"market_impact" numeric(8, 3),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sms_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"message" text NOT NULL,
	"type" varchar NOT NULL,
	"status" varchar DEFAULT 'pending',
	"provider" varchar,
	"message_id" varchar,
	"cost" numeric(10, 4),
	"sent_at" timestamp,
	"delivered_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_training_community" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"username" text NOT NULL,
	"display_name" text,
	"avatar" text,
	"total_xp" integer DEFAULT 0,
	"level" integer DEFAULT 1,
	"rank" integer,
	"badges" text[],
	"achievements" text[],
	"trading_score" numeric(10, 2) DEFAULT '0',
	"community_points" integer DEFAULT 0,
	"followers" integer DEFAULT 0,
	"following" integer DEFAULT 0,
	"joined_at" timestamp DEFAULT now(),
	"last_active" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "staking_positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"asset" varchar NOT NULL,
	"amount" numeric(18, 8) NOT NULL,
	"staking_type" varchar NOT NULL,
	"duration" integer,
	"apy" numeric(5, 2) NOT NULL,
	"rewards" numeric(18, 8) DEFAULT '0',
	"status" varchar DEFAULT 'active',
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "support_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticket_id" integer NOT NULL,
	"sender_id" varchar NOT NULL,
	"sender_type" varchar NOT NULL,
	"message" text NOT NULL,
	"attachments" jsonb DEFAULT '[]',
	"is_internal" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticket_number" varchar NOT NULL,
	"user_id" varchar,
	"subject" varchar NOT NULL,
	"description" text NOT NULL,
	"category" varchar NOT NULL,
	"priority" varchar DEFAULT 'normal',
	"status" varchar DEFAULT 'open',
	"assigned_to" varchar,
	"tags" text[] DEFAULT '{}',
	"sla_deadline" timestamp,
	"first_response_at" timestamp,
	"resolved_at" timestamp,
	"closed_at" timestamp,
	"satisfaction" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "support_tickets_ticket_number_unique" UNIQUE("ticket_number")
);
--> statement-breakpoint
CREATE TABLE "system_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"log_level" varchar NOT NULL,
	"service" varchar NOT NULL,
	"message" text NOT NULL,
	"metadata" jsonb DEFAULT '{}',
	"trace_id" varchar,
	"user_id" varchar,
	"ip_address" varchar,
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trades" (
	"id" serial PRIMARY KEY NOT NULL,
	"buy_order_id" integer NOT NULL,
	"sell_order_id" integer NOT NULL,
	"symbol" text NOT NULL,
	"amount" numeric(18, 8) NOT NULL,
	"price" numeric(18, 8) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trading_incidents" (
	"id" serial PRIMARY KEY NOT NULL,
	"incident_type" varchar NOT NULL,
	"severity" varchar DEFAULT 'medium',
	"symbol" varchar,
	"description" text NOT NULL,
	"affected_users" integer DEFAULT 0,
	"affected_orders" jsonb DEFAULT '[]',
	"status" varchar DEFAULT 'open',
	"resolution" text,
	"assigned_to" varchar,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"currency" varchar NOT NULL,
	"amount" numeric(18, 8) NOT NULL,
	"fee" numeric(18, 8) DEFAULT '0',
	"status" varchar DEFAULT 'pending',
	"tx_hash" varchar,
	"block_number" integer,
	"confirmations" integer DEFAULT 0,
	"network" varchar DEFAULT 'mainnet',
	"from_address" varchar,
	"to_address" varchar,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_activity" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"activity_type" varchar NOT NULL,
	"details" jsonb DEFAULT '{}',
	"ip_address" varchar,
	"user_agent" text,
	"session_id" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"password_hash" varchar,
	"email_verified" boolean DEFAULT false,
	"email_verification_token" varchar,
	"password_reset_token" varchar,
	"password_reset_expires" timestamp,
	"two_factor_enabled" boolean DEFAULT false,
	"two_factor_secret" varchar,
	"two_factor_backup_codes" text[],
	"kyc_status" varchar DEFAULT 'none',
	"kyc_level" integer DEFAULT 0,
	"account_tier" varchar DEFAULT 'basic',
	"daily_trading_limit" varchar DEFAULT '1000',
	"daily_withdrawal_limit" varchar DEFAULT '500',
	"withdrawal_limit" numeric(18, 2) DEFAULT '1000',
	"trading_permissions" jsonb DEFAULT '{}',
	"risk_profile" varchar DEFAULT 'conservative',
	"phone_number" varchar,
	"phone_verified" boolean DEFAULT false,
	"phone_verification_code" varchar,
	"phone_verification_expires" timestamp,
	"sms_notifications" boolean DEFAULT true,
	"account_status" varchar DEFAULT 'active',
	"last_login_at" timestamp,
	"login_attempts" integer DEFAULT 0,
	"locked_until" timestamp,
	"stripe_customer_id" varchar,
	"stripe_subscription_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wallet_balances" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_type" varchar NOT NULL,
	"asset" varchar NOT NULL,
	"address" varchar NOT NULL,
	"balance" numeric(30, 18) NOT NULL,
	"locked_balance" numeric(30, 18) DEFAULT '0',
	"pending_deposits" numeric(30, 18) DEFAULT '0',
	"pending_withdrawals" numeric(30, 18) DEFAULT '0',
	"last_reconciled" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "wallet_reconciliations" (
	"id" serial PRIMARY KEY NOT NULL,
	"reconciliation_date" timestamp NOT NULL,
	"wallet_type" varchar NOT NULL,
	"asset" varchar NOT NULL,
	"expected_balance" numeric(18, 8) NOT NULL,
	"actual_balance" numeric(18, 8) NOT NULL,
	"difference" numeric(18, 8) NOT NULL,
	"status" varchar DEFAULT 'pending',
	"discrepancy_reason" text,
	"resolved_by" varchar,
	"resolved_at" timestamp,
	"blockchain_tx_hash" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"currency" varchar NOT NULL,
	"network" varchar DEFAULT 'mainnet',
	"address" varchar NOT NULL,
	"balance" numeric(18, 8) DEFAULT '0',
	"available_balance" numeric(18, 8) DEFAULT '0',
	"frozen_balance" numeric(18, 8) DEFAULT '0',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "withdrawal_queue" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"asset" varchar NOT NULL,
	"amount" numeric(30, 18) NOT NULL,
	"destination_address" varchar NOT NULL,
	"status" varchar DEFAULT 'pending',
	"priority" varchar DEFAULT 'normal',
	"risk_score" integer DEFAULT 0,
	"requires_multi_sig" boolean DEFAULT false,
	"approvals" jsonb DEFAULT '[]',
	"required_approvals" integer DEFAULT 1,
	"rejection_reason" text,
	"transaction_hash" varchar,
	"network_fee" numeric(30, 18),
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_learning_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"data_type" varchar(50) NOT NULL,
	"user_id" varchar(50),
	"symbol" varchar(20),
	"data_payload" jsonb NOT NULL,
	"labels" jsonb,
	"features" jsonb,
	"processed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_market_analysis" (
	"id" serial PRIMARY KEY NOT NULL,
	"analysis_id" varchar(100) NOT NULL,
	"market_sentiment" varchar(20) NOT NULL,
	"confidence" integer NOT NULL,
	"key_factors" jsonb,
	"risk_assessment" jsonb,
	"predictions" jsonb,
	"data_sources_used" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "ai_market_analysis_analysis_id_unique" UNIQUE("analysis_id")
);
--> statement-breakpoint
CREATE TABLE "ai_model_performance" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_type" varchar(50) NOT NULL,
	"model_version" varchar(20) NOT NULL,
	"prediction_id" varchar(100) NOT NULL,
	"actual_outcome" jsonb,
	"predicted_outcome" jsonb,
	"accuracy" numeric(5, 4),
	"confidence" integer,
	"time_to_realization" integer,
	"profit_loss" numeric(20, 8),
	"created_at" timestamp DEFAULT now(),
	"evaluated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "ai_natural_language_commands" (
	"id" serial PRIMARY KEY NOT NULL,
	"command_id" varchar(100) NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"original_command" text NOT NULL,
	"parsed_command" jsonb NOT NULL,
	"confidence" integer NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"execution_result" jsonb,
	"error_message" text,
	"created_at" timestamp DEFAULT now(),
	"executed_at" timestamp,
	CONSTRAINT "ai_natural_language_commands_command_id_unique" UNIQUE("command_id")
);
--> statement-breakpoint
CREATE TABLE "ai_order_routing" (
	"id" serial PRIMARY KEY NOT NULL,
	"routing_id" varchar(100) NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"symbol" varchar(20) NOT NULL,
	"side" varchar(10) NOT NULL,
	"amount" numeric(20, 8) NOT NULL,
	"recommended_strategy" varchar(50),
	"execution_plan" jsonb,
	"total_cost" numeric(20, 8),
	"price_improvement" numeric(10, 4),
	"reasoning" text,
	"order_books_analyzed" jsonb,
	"status" varchar(20) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "ai_order_routing_routing_id_unique" UNIQUE("routing_id")
);
--> statement-breakpoint
CREATE TABLE "ai_portfolio_optimizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"optimization_id" varchar(100) NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"current_allocation" jsonb NOT NULL,
	"recommended_allocation" jsonb NOT NULL,
	"expected_return" numeric(10, 4),
	"risk_score" integer,
	"reasoning" text,
	"actions" jsonb,
	"risk_tolerance" varchar(20),
	"investment_goal" text,
	"status" varchar(20) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "ai_portfolio_optimizations_optimization_id_unique" UNIQUE("optimization_id")
);
--> statement-breakpoint
CREATE TABLE "ai_risk_assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"assessment_id" varchar(100) NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"portfolio_snapshot" jsonb NOT NULL,
	"proposed_trade" jsonb NOT NULL,
	"market_conditions" jsonb,
	"risk_score" integer NOT NULL,
	"risk_factors" jsonb,
	"recommendations" jsonb,
	"position_size_suggestion" numeric(20, 8),
	"max_loss_estimate" numeric(20, 8),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "ai_risk_assessments_assessment_id_unique" UNIQUE("assessment_id")
);
--> statement-breakpoint
CREATE TABLE "ai_trading_signals" (
	"id" serial PRIMARY KEY NOT NULL,
	"signal_id" varchar(100) NOT NULL,
	"user_id" varchar(50),
	"symbol" varchar(20) NOT NULL,
	"action" varchar(10) NOT NULL,
	"confidence" integer NOT NULL,
	"price_target" numeric(20, 8),
	"stop_loss" numeric(20, 8),
	"time_horizon" varchar(10) NOT NULL,
	"reasoning" text,
	"technical_indicators" jsonb,
	"status" varchar(20) DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	CONSTRAINT "ai_trading_signals_signal_id_unique" UNIQUE("signal_id")
);
--> statement-breakpoint
CREATE TABLE "ai_user_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"enabled_features" jsonb DEFAULT '[]'::jsonb,
	"risk_tolerance" varchar(20) DEFAULT 'moderate',
	"trading_style" varchar(20),
	"preferred_signal_types" jsonb,
	"notification_preferences" jsonb,
	"learning_mode" boolean DEFAULT true,
	"confidence_threshold" integer DEFAULT 70,
	"max_position_size" numeric(10, 4),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "ai_user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_role_id_admin_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."admin_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "advanced_orders" ADD CONSTRAINT "advanced_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_commissions" ADD CONSTRAINT "affiliate_commissions_affiliate_id_affiliate_programs_id_fk" FOREIGN KEY ("affiliate_id") REFERENCES "public"."affiliate_programs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_commissions" ADD CONSTRAINT "affiliate_commissions_referred_user_id_users_id_fk" FOREIGN KEY ("referred_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_programs" ADD CONSTRAINT "affiliate_programs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aml_alerts" ADD CONSTRAINT "aml_alerts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_credentials" ADD CONSTRAINT "api_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "copy_trading_follows" ADD CONSTRAINT "copy_trading_follows_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "copy_trading_follows" ADD CONSTRAINT "copy_trading_follows_master_id_copy_trading_masters_id_fk" FOREIGN KEY ("master_id") REFERENCES "public"."copy_trading_masters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "copy_trading_masters" ADD CONSTRAINT "copy_trading_masters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crypto_payments" ADD CONSTRAINT "crypto_payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_segments" ADD CONSTRAINT "customer_segments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education_consent" ADD CONSTRAINT "education_consent_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fiat_transactions" ADD CONSTRAINT "fiat_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fiat_transactions" ADD CONSTRAINT "fiat_transactions_gateway_id_fiat_gateways_id_fk" FOREIGN KEY ("gateway_id") REFERENCES "public"."fiat_gateways"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_progress" ADD CONSTRAINT "game_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_progress" ADD CONSTRAINT "game_progress_game_id_crypto_learning_games_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."crypto_learning_games"("game_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kyc_queue" ADD CONSTRAINT "kyc_queue_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kyc_verifications" ADD CONSTRAINT "kyc_verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "launchpad_participations" ADD CONSTRAINT "launchpad_participations_project_id_launchpad_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."launchpad_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "launchpad_participations" ADD CONSTRAINT "launchpad_participations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboards" ADD CONSTRAINT "leaderboards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "login_attempts" ADD CONSTRAINT "login_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "margin_accounts" ADD CONSTRAINT "margin_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "margin_positions" ADD CONSTRAINT "margin_positions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "margin_positions" ADD CONSTRAINT "margin_positions_margin_account_id_margin_accounts_id_fk" FOREIGN KEY ("margin_account_id") REFERENCES "public"."margin_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mobile_devices" ADD CONSTRAINT "mobile_devices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "otc_deals" ADD CONSTRAINT "otc_deals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "otc_requests" ADD CONSTRAINT "otc_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "p2p_orders" ADD CONSTRAINT "p2p_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "p2p_trades" ADD CONSTRAINT "p2p_trades_order_id_p2p_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."p2p_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "p2p_trades" ADD CONSTRAINT "p2p_trades_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "p2p_trades" ADD CONSTRAINT "p2p_trades_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_wellness" ADD CONSTRAINT "portfolio_wellness_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_notifications" ADD CONSTRAINT "push_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revenue_streams" ADD CONSTRAINT "revenue_streams_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revenue_streams" ADD CONSTRAINT "revenue_streams_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revenue_streams" ADD CONSTRAINT "revenue_streams_trade_id_trades_id_fk" FOREIGN KEY ("trade_id") REFERENCES "public"."trades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sar_reports" ADD CONSTRAINT "sar_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sentiment_analysis" ADD CONSTRAINT "sentiment_analysis_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sms_notifications" ADD CONSTRAINT "sms_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_training_community" ADD CONSTRAINT "social_training_community_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staking_positions" ADD CONSTRAINT "staking_positions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_ticket_id_support_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_tickets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_buy_order_id_orders_id_fk" FOREIGN KEY ("buy_order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_sell_order_id_orders_id_fk" FOREIGN KEY ("sell_order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawal_queue" ADD CONSTRAINT "withdrawal_queue_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");--> statement-breakpoint
CREATE INDEX "ai_learning_type_idx" ON "ai_learning_data" USING btree ("data_type");--> statement-breakpoint
CREATE INDEX "ai_learning_processed_idx" ON "ai_learning_data" USING btree ("processed");--> statement-breakpoint
CREATE INDEX "ai_analysis_sentiment_idx" ON "ai_market_analysis" USING btree ("market_sentiment");--> statement-breakpoint
CREATE INDEX "ai_analysis_created_idx" ON "ai_market_analysis" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "ai_performance_model_idx" ON "ai_model_performance" USING btree ("model_type");--> statement-breakpoint
CREATE INDEX "ai_performance_accuracy_idx" ON "ai_model_performance" USING btree ("accuracy");--> statement-breakpoint
CREATE INDEX "ai_commands_user_idx" ON "ai_natural_language_commands" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_commands_status_idx" ON "ai_natural_language_commands" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ai_routing_user_idx" ON "ai_order_routing" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_routing_symbol_idx" ON "ai_order_routing" USING btree ("symbol");--> statement-breakpoint
CREATE INDEX "ai_optimization_user_idx" ON "ai_portfolio_optimizations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_optimization_status_idx" ON "ai_portfolio_optimizations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ai_risk_user_idx" ON "ai_risk_assessments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_risk_score_idx" ON "ai_risk_assessments" USING btree ("risk_score");--> statement-breakpoint
CREATE INDEX "ai_signals_symbol_idx" ON "ai_trading_signals" USING btree ("symbol");--> statement-breakpoint
CREATE INDEX "ai_signals_user_idx" ON "ai_trading_signals" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_signals_status_idx" ON "ai_trading_signals" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ai_prefs_user_idx" ON "ai_user_preferences" USING btree ("user_id");