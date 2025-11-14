# User flow

**Crypto Widget Whitelabel Flow:**

1. Partner creates an order for payment and get a orderId, deposit address and endTime.
2. Partner can then show the address to user along with endTime.
3. User can then deposit funds to the address provided.
4. User also has option to extend the endTime to make payment.
5. Partner can keep on polling getOrder API to get live status of the transaction.
6. Once the payment is done, partner can show success in their app.

**Crypto Widget Flow:**

1. Partner creates an intent for payment and get a hash.
2. Partner can then append hash to WIDGET\_URL and redirect the user to Onramp.
3. User goes ahead with payment on Onramp.
4. Once the payment is done, user gets redirected back to REDIRECT\_URL specified while creating intent .
5. Partner can also call orderStatus to get current status of any payment.
