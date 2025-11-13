-- Migration: Add onramp_money_orders table

BEGIN;

-- Create onramp_money_orders table
CREATE TABLE onramp_money_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id VARCHAR(255) UNIQUE, -- OnRamp Money orderId (set after redirect)
    merchant_recognition_id VARCHAR(255) NOT NULL UNIQUE, -- Our internal tracking ID
    fiat_amount NUMERIC(18, 2) NOT NULL,
    fiat_currency VARCHAR(10) NOT NULL, -- INR, TRY, AED, MXN, VND, NGN, etc
    fiat_type INTEGER NOT NULL, -- 1=INR, 2=TRY, 3=AED, etc
    crypto_amount NUMERIC(18, 8), -- Estimated amount (set by OnRamp Money)
    crypto_currency VARCHAR(20) NOT NULL, -- usdt, usdc, busd, eth, bnb, matic, sol
    network VARCHAR(50) NOT NULL, -- bep20, matic20, erc20, trc20
    wallet_address VARCHAR(255) NOT NULL, -- Destination wallet
    payment_method INTEGER NOT NULL, -- 1=Instant (UPI), 2=Bank transfer
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, success, failed
    onramp_url TEXT NOT NULL, -- Full OnRamp Money URL
    redirect_url TEXT, -- Callback URL after transaction
    phone_number VARCHAR(50), -- User phone (optional)
    language VARCHAR(10) DEFAULT 'en', -- UI language
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    CONSTRAINT valid_status CHECK (status IN ('pending', 'success', 'failed', 'expired'))
);

-- Create indexes for onramp_money_orders
CREATE INDEX idx_onramp_orders_user ON onramp_money_orders(user_id);
CREATE INDEX idx_onramp_orders_status ON onramp_money_orders(status);
CREATE INDEX idx_onramp_orders_order_id ON onramp_money_orders(order_id);
CREATE INDEX idx_onramp_orders_merchant_id ON onramp_money_orders(merchant_recognition_id);
CREATE INDEX idx_onramp_orders_created ON onramp_money_orders(created_at DESC);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_onramp_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_onramp_orders_updated_at
    BEFORE UPDATE ON onramp_money_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_onramp_orders_updated_at();

COMMIT;
