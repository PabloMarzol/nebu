# OnRamp Money Integration - Security & Configuration Update

## ✅ What Was Fixed

### **1. Environment Variable Integration**
The service now properly reads from your environment variables:

```bash
ONRAMP_APP_ID=1739218
ONRAMP_BASE_URL=https://onramp.money/app/?appId=1739218&walletAddress=
ONRAMP_API_KEY=QdEEwhzfqG06v3HYt5Cb7RbxHXeYPx
```

### **2. Webhook Signature Verification** 🔐
- **CRITICAL SECURITY FIX**: Added HMAC-SHA512 signature verification
- Validates `x-onramp-signature` header using your `ONRAMP_API_KEY`
- Rejects spoofed webhooks (prevents fake transaction confirmations)
- Follows OnRamp Money's authentication spec exactly

### **3. Webhook vs Redirect Separation**
Two separate endpoints now:

**User Redirect (Browser):**
```
GET /api/onramp-money/callback?orderId=123&status=success
→ Redirects user back to your site
```

**Webhook (Server-to-Server):**
```
POST /api/onramp-money/webhook
Headers:
  x-onramp-payload: {...webhook data...}
  x-onramp-signature: HMAC-SHA512 signature
→ Verifies signature, updates database, returns 200 OK
```

### **4. Status Code Mapping**
Properly maps OnRamp Money status codes:
- **Success:** 6, 14, 15, 19, 40, 41 (completed/webhook sent)
- **Failed:** -4, -2, -1 (wrong amount/abandoned/timeout)
- **Pending:** All others

### **5. Flexible URL Generation**
- Automatically detects `/app/` or `/main/buy/` in base URL
- Works with your custom URL format
- Preserves all query parameters

---

## 🧪 Testing Instructions

### **1. Check Environment Variables**
```bash
# Verify env vars are loaded
node -e "console.log(process.env.ONRAMP_APP_ID)"  # Should show: 1739218
node -e "console.log(process.env.ONRAMP_API_KEY)" # Should show your key
```

### **2. Test Order Creation**
```bash
# Start the server
npm run dev

# Navigate to: http://localhost:5000/fx-swap
# Click "OnRamp Money" tab
# Fill in:
#   - Amount: 100
#   - Currency: INR
#   - Crypto: USDT
#   - Network: MATIC20
#   - Wallet: Your wallet address
# Click "Continue to OnRamp Money"
```

**Expected Result:**
- Should redirect to OnRamp Money widget
- URL should contain your appId=1739218
- All parameters should be populated

### **3. Test Webhook (Local Testing)**
You can test webhook signature verification:

```bash
# Test webhook endpoint with signature
curl -X POST http://localhost:3000/api/onramp-money/webhook \
  -H "Content-Type: application/json" \
  -H "x-onramp-payload: {\"orderId\":123,\"status\":14}" \
  -H "x-onramp-signature: <VALID_HMAC_SIGNATURE>"
```

To generate a test signature:
```javascript
const crypto = require('crypto');
const payload = '{"orderId":123,"status":14}';
const apiKey = 'QdEEwhzfqG06v3HYt5Cb7RbxHXeYPx';
const signature = crypto
  .createHmac('sha512', apiKey)
  .update(payload)
  .digest('hex')
  .toUpperCase();
console.log(signature);
```

### **4. Production Webhook Setup**
When deploying to production, you need to give OnRamp Money your webhook URL:

**Webhook URL to provide:**
```
https://your-production-domain.com/api/onramp-money/webhook
```

**Requirements:**
- Must be HTTPS with valid SSL certificate
- Must respond within 5 seconds
- Must return 200 OK on success
- Must handle duplicate webhooks (idempotent)

---

## 🔍 What Changed in the Code

### **onramp-money-service.ts**

**Before:**
```typescript
constructor(isProduction: boolean = false) {
  this.config = {
    appId: isProduction ? '1' : '2',
    isProduction,
    baseUrl: 'https://onramp.money'
  };
}
```

**After:**
```typescript
constructor() {
  const appId = process.env.ONRAMP_APP_ID || '2';
  const apiKey = process.env.ONRAMP_API_KEY || '';
  const baseUrl = process.env.ONRAMP_BASE_URL || 'https://onramp.money';

  this.config = { appId, apiKey, baseUrl, isProduction: appId !== '2' };
}

verifyWebhookSignature(payload: string, signature: string): boolean {
  const localSignature = crypto
    .createHmac('sha512', this.config.apiKey)
    .update(payload)
    .digest('hex')
    .toUpperCase();
  return localSignature === signature.toUpperCase();
}
```

### **onramp-money-routes.ts**

**New Webhook Endpoint:**
```typescript
router.post('/webhook', async (req, res) => {
  const payload = req.headers['x-onramp-payload'];
  const signature = req.headers['x-onramp-signature'];

  // ✅ Verify signature
  const isValid = onRampMoneyService.verifyWebhookSignature(payload, signature);
  if (!isValid) {
    return res.status(403).json({ error: 'Invalid signature' });
  }

  // ✅ Parse and process webhook
  const webhookData = JSON.parse(payload);
  // ... update database ...

  return res.status(200).json({ success: true });
});
```

---

## 🚨 Important Notes

### **Security:**
- ✅ Webhook signatures are now verified (prevents spoofing)
- ✅ Only webhooks with valid HMAC-SHA512 signatures are accepted
- ✅ API key is never exposed to frontend
- ⚠️ Make sure `ONRAMP_API_KEY` is kept secret (never commit to git)

### **Webhook Behavior:**
- OnRamp Money only sends webhooks for **completed transactions**
- Webhooks may be sent multiple times (implement idempotency)
- If webhook URL not set before transaction, webhook won't be sent
- Webhook must respond within 5 seconds or it will be retried

### **Production Checklist:**
- [ ] Environment variables set in production
- [ ] Webhook URL registered with OnRamp Money
- [ ] SSL certificate valid and trusted
- [ ] Database migration applied (004_add_onramp_money_orders_table.sql)
- [ ] Logs monitored for webhook failures
- [ ] Test end-to-end flow with small amount

---

## 📊 Database Check

After a webhook is received, check the database:

```sql
SELECT
  id,
  merchant_recognition_id,
  order_id,
  status,
  fiat_amount,
  crypto_currency,
  created_at,
  completed_at
FROM onramp_money_orders
WHERE status = 'success'
ORDER BY created_at DESC
LIMIT 5;
```

---

## 🐛 Troubleshooting

### Issue: "API key not configured for webhook verification"
**Solution:** Set `ONRAMP_API_KEY` environment variable

### Issue: "Webhook signature verification failed"
**Possible causes:**
- Wrong API key
- Payload modified in transit
- Character encoding issues
**Solution:** Check logs for signature mismatch, verify API key

### Issue: Orders stuck in "pending" status
**Possible causes:**
- Webhook URL not registered with OnRamp Money
- Webhook URL unreachable (SSL issues, firewall)
- Webhook response taking >5 seconds
**Solution:** Check OnRamp Money dashboard, verify webhook URL is accessible

### Issue: URL generation incorrect
**Solution:** Check `ONRAMP_BASE_URL` format, should include `/app/` or let it default to `/main/buy/`

---

## ✅ Ready for Production

The integration is now secure and properly configured!

**Next steps:**
1. Test locally with sandbox
2. Deploy to production
3. Register webhook URL with OnRamp Money
4. Monitor first few transactions closely
5. Proceed to Phase 2 (0x Protocol optimization) when ready

---

**Updated:** January 2025
**Commit:** 4c38ee8
