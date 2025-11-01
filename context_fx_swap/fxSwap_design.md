High-level flow

User selects “Buy USDT with GBP” on UI, enters GBP amount and destination wallet.

Frontend creates Stripe PaymentIntent / Checkout session with metadata: { wallet, target_token, client_order_id }.

User completes payment (card, bank transfer). Stripe sends webhook payment_intent.succeeded to your backend.

Backend receives webhook and:

Validates signature & idempotency.

Looks up metadata wallet and client_order_id.

Fetches FX rate (GBP→USD) from chosen feed (Chainlink/Pyth/off-chain aggregator).

Computes targetStableAmount = (GBP * FX) * (1 - fees) in stablecoin units.

Gets 0x swap quote to buy targetStableAmount (or calculates sell amount in token you will spend).

Validates the 0x quote slippage and gas. Optionally create a quote reservation.

Execute swap (two possible routes):

On-chain route: Your backend wallet executes the 0x swap on-chain, receiving USDT, then transfers to user wallet.

CEX/OTC route: Your fiat ledger is used to buy USDT on CEX/OTC and withdraw to user wallet. (Useful for large volumes or liquidity guarantees.)

Post-execution:

Write transaction record to DB with tx_hash, amount_usdt, fee, fx_rate, stripe_payment_id.

Notify user via UI/webhook/email with tx hash and status.

Reconciliation & hedging:

Reconcile Stripe GBP balance vs on-chain outflows nightly.

If you use on-chain swaps, GBP stays with you in Stripe; periodically convert GBP balance to stablecoin / hedge via CEX to reduce FX exposure.

Failure handling:

If swap fails, refund (subject to policy) or hold funds and alert ops.

If Stripe chargeback occurs after crypto sent, you must absorb it unless you implemented delayed settlement/hold.