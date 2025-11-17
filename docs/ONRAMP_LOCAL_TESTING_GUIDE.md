# OnRamp Money Local Testing Guide

This guide will help you test OnRamp Money integration locally with proper webhook support.

## 🔴 Current Issues & Solutions

### Issue 1: 401 Unauthorized Error ❌

**Problem:** You're getting a 401 error when trying to create an order.

**Cause:** The user is **NOT authenticated** with your backend. The `/api/onramp-money/create-order` endpoint requires wallet authentication.

**Solution:**
1. **Connect your wallet FIRST** on the frontend
2. Make sure you see "Wallet Connected" status
3. Then try to create an OnRamp Money order

**How to verify authentication:**
```javascript
// In browser console, check:
document.cookie // Should contain session token
```

---

### Issue 2: Wrong ONRAMP_BASE_URL ❌

**Problem:** Your `.env` has:
```bash
ONRAMP_BASE_URL=https://onramp.money/app/?appId=1739218&walletAddress=
```

**Solution:** Change to:
```bash
ONRAMP_BASE_URL=https://onramp.money
```

The service automatically builds the correct URL with all parameters.

---

### Issue 3: No Webhook for Local Testing ⚠️

**Problem:** Webhooks can't reach `localhost` from OnRamp Money servers.

**Solution:** Use ngrok to create a public tunnel.

---

## 🚀 Complete Setup Instructions

### Step 1: Fix Environment Variables

Update your `.env` file:

```bash
# OnRamp Money Configuration
ONRAMP_APP_ID=1739218
ONRAMP_BASE_URL=https://onramp.money
ONRAMP_API_KEY=QdEEwhzfqG06v3HYt5Cb7RbxHXeYPx
FRONTEND_URL=http://localhost:5000
```

### Step 2: Install Ngrok

```bash
# Option 1: Download from website
# Visit: https://ngrok.com/download

# Option 2: Install via npm
npm install -g ngrok

# Sign up for free account
# Visit: https://dashboard.ngrok.com/signup

# Get your auth token
# Visit: https://dashboard.ngrok.com/get-started/your-authtoken

# Configure ngrok with your token
ngrok authtoken YOUR_AUTH_TOKEN_HERE
```

### Step 3: Start Your Backend Server

```bash
# Terminal 1: Start your backend
npm run dev
# Note the port (usually 3000)
```

### Step 4: Start Ngrok Tunnel

```bash
# Terminal 2: Run the setup script
./scripts/setup-local-webhook.sh

# Or manually:
ngrok http 3000  # Replace 3000 with your backend port
```

You'll see output like:
```
Forwarding  https://abc123def456.ngrok.io -> http://localhost:3000
```

**Copy the HTTPS URL** (e.g., `https://abc123def456.ngrok.io`)

### Step 5: Configure Webhook in OnRamp Dashboard

1. Go to: https://dashboard.onramp.money
2. Navigate to: **Settings** > **Webhook Configuration**
3. Set webhook URL to:
   ```
   https://YOUR_NGROK_URL.ngrok.io/api/onramp-money/webhook
   ```
   Example: `https://abc123def456.ngrok.io/api/onramp-money/webhook`
4. **Save** the configuration

### Step 6: Test the Integration

#### A. Connect Wallet
1. Open your app: http://localhost:5000
2. Click **"Connect Wallet"**
3. Connect with MetaMask or your wallet
4. Verify you see **"Wallet Connected"** status

#### B. Create Test Order
1. Navigate to **FX Swap** page
2. Click **"OnRamp Money"** tab
3. Fill in the form:
   - **Fiat Amount**: 100 (minimum varies by currency)
   - **Fiat Currency**: INR (or your currency)
   - **Cryptocurrency**: USDT
   - **Network**: MATIC20
   - **Wallet Address**: (should auto-fill from connected wallet)
   - **Payment Method**: Instant (UPI)
4. Click **"Proceed to Payment"**

#### C. Expected Flow
1. ✅ Order created successfully
2. ✅ Redirect to OnRamp Money payment page
3. ✅ Complete payment (use test mode if available)
4. ✅ OnRamp Money sends webhook to your ngrok URL
5. ✅ Order status updates in your database
6. ✅ User sees updated status in UI

---

## 🔍 Debugging Steps

### Check Authentication

```bash
# Check if wallet is connected in browser console:
console.log(document.cookie)  # Should have session cookie

# Check backend logs:
# Look for: [OnRamp Money] Creating order: { userId: '...', ... }
```

### Check Webhook Receipt

```bash
# Terminal 3: Watch logs
tail -f /var/log/your-app.log | grep "OnRamp Money"

# Or check ngrok dashboard:
# Visit: http://localhost:4040
# Shows all requests to your ngrok tunnel
```

### Test Webhook Manually

```bash
# Generate test signature (use your API key)
echo -n '{"orderId":"test123","status":"success"}' | \
  openssl dgst -sha512 -hmac "YOUR_API_KEY" | \
  awk '{print toupper($2)}'

# Send test webhook
curl -X POST http://localhost:3000/api/onramp-money/webhook \
  -H "x-onramp-payload: {\"orderId\":\"test123\",\"status\":\"success\"}" \
  -H "x-onramp-signature: GENERATED_SIGNATURE"
```

### Check Database

```sql
-- Check recent orders
SELECT
  id, order_id, status,
  fiat_amount, crypto_currency,
  created_at, completed_at
FROM onramp_money_orders
ORDER BY created_at DESC
LIMIT 5;

-- Check order by merchant recognition ID
SELECT * FROM onramp_money_orders
WHERE merchant_recognition_id LIKE 'NEBULAX_%'
ORDER BY created_at DESC;
```

---

## 🚨 Common Issues & Solutions

### 1. "Authentication required" Error

**Cause:** Wallet not connected or session expired

**Fix:**
- Disconnect and reconnect wallet
- Clear browser cookies and reconnect
- Check if `requireAuth` middleware is working

### 2. Webhook Not Received

**Possible Causes:**
- Ngrok tunnel not running
- Wrong webhook URL in OnRamp dashboard
- Signature verification failing

**Fix:**
```bash
# Check ngrok status
curl http://localhost:4040/api/tunnels

# Check ngrok logs
# Visit: http://localhost:4040/inspect/http

# Verify webhook URL in OnRamp dashboard matches ngrok URL
```

### 3. Signature Verification Failed

**Cause:** Wrong API key or payload encoding

**Fix:**
```bash
# Verify your API key is correct
echo $ONRAMP_API_KEY

# Check server logs for expected vs received signature
grep "Expected signature" /var/log/app.log
```

### 4. Order Status Stuck on "Pending"

**Causes:**
- Webhook not configured
- Payment not completed
- Polling not working

**Fix:**
- Check if webhook is configured in OnRamp dashboard
- Verify polling is active (look for "Auto-refreshing" indicator)
- Manually refresh order status

---

## 📊 Testing Checklist

- [ ] Environment variables configured correctly
- [ ] Backend server running
- [ ] Ngrok tunnel active
- [ ] Webhook URL configured in OnRamp dashboard
- [ ] Wallet connected on frontend
- [ ] Can create test order
- [ ] Order redirects to OnRamp Money
- [ ] Webhook received after payment
- [ ] Order status updates correctly
- [ ] Polling works as fallback

---

## 🔐 Production Deployment

When deploying to production:

1. **Use Real Domain** instead of ngrok:
   ```bash
   WEBHOOK_URL=https://your-domain.com/api/onramp-money/webhook
   ```

2. **Update OnRamp Dashboard:**
   - Settings > Webhook Configuration
   - Set production webhook URL
   - Use HTTPS with valid SSL certificate

3. **Environment Variables:**
   ```bash
   ONRAMP_APP_ID=your_production_app_id
   ONRAMP_BASE_URL=https://onramp.money
   ONRAMP_API_KEY=your_production_api_key
   FRONTEND_URL=https://your-domain.com
   ```

4. **Test Thoroughly:**
   - Test with small amounts first
   - Verify webhook delivery
   - Monitor logs for errors
   - Test order status updates

---

## 📞 Support

If you still have issues:

1. **Check OnRamp Money docs:** https://docs.onramp.money
2. **Contact OnRamp support:** support@onramp.money
3. **Review server logs:** Look for `[OnRamp Money]` prefix
4. **Enable debug mode:** Set `DEBUG_0X=true` in localStorage

---

## 🎯 Quick Test Script

```bash
#!/bin/bash
# Quick test to verify everything is working

echo "🧪 OnRamp Money Integration Test"
echo "================================"
echo ""

# 1. Check environment variables
echo "1️⃣ Checking environment variables..."
if [ -z "$ONRAMP_APP_ID" ]; then
  echo "❌ ONRAMP_APP_ID not set"
else
  echo "✅ ONRAMP_APP_ID: $ONRAMP_APP_ID"
fi

if [ -z "$ONRAMP_API_KEY" ]; then
  echo "❌ ONRAMP_API_KEY not set"
else
  echo "✅ ONRAMP_API_KEY: ${ONRAMP_API_KEY:0:10}..."
fi

if [ -z "$ONRAMP_BASE_URL" ]; then
  echo "❌ ONRAMP_BASE_URL not set"
else
  echo "✅ ONRAMP_BASE_URL: $ONRAMP_BASE_URL"
fi

echo ""

# 2. Check if backend is running
echo "2️⃣ Checking backend server..."
if curl -s http://localhost:3000/health > /dev/null; then
  echo "✅ Backend server is running"
else
  echo "❌ Backend server not responding"
fi

echo ""

# 3. Check if ngrok is running
echo "3️⃣ Checking ngrok tunnel..."
if curl -s http://localhost:4040/api/tunnels > /dev/null; then
  NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok\.io' | head -1)
  echo "✅ Ngrok tunnel active: $NGROK_URL"
  echo "   Webhook URL: $NGROK_URL/api/onramp-money/webhook"
else
  echo "❌ Ngrok tunnel not running"
fi

echo ""
echo "================================"
echo "Test complete!"
```

Save this as `scripts/test-onramp-setup.sh` and run:
```bash
chmod +x scripts/test-onramp-setup.sh
./scripts/test-onramp-setup.sh
```
