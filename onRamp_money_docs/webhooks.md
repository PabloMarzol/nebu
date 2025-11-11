# Webhook updates

{% hint style="info" %}
During onboarding merchants can give webhook endpoint to get updates of user transactions. This is sample webhook response sent to the endpoint. Values can be checked against the values in [`config file`](https://docs.onramp.money/onramp/onramp-widget-integration/allconfig-all-coin-details)
{% endhint %}

To get your API key and secret, please fill out the [form.](https://forms.gle/i1hpWi8oq5Zv2jpt8)

{% hint style="info" %}
**We only send a webhook when a transaction is successfully completed and fiat withdrawal is processed. If the webhook url is not set before the transaction is completed, the webhook would  not be sent.**
{% endhint %}

**We expect a response to the webhook call within 5 seconds. If response is not received we will mark it as a webhook failure and will send the webhook again.**

**Kindly use an HTTPS endpoint with a valid SSL certificate that is trusted by your browser else it would result in missing webhook updates at times.**

Webhook endpoints might occasionally receive the same event more than once. We advise you to guard against duplicated event receipts by making your event processing [idempotent](https://en.wikipedia.org/wiki/Idempotence). One way of doing this is logging the events you’ve processed, and then not processing already logged events.

**Note :**

1. **The updatedAt field in the webhook is for internal purposes and should not to be used by the client. It will soon be deprecated from the data sent in the webhook.**
2. **For Status codes and its meaning, please to refer to** [**link**](https://docs.onramp.money/onramp/response-codes/order-status-codes)**.**
3. **If webhooks are not enabled, transactions that complete successfully will be assigned a status code of either 14 or 19 or 40.**

#### Authentication code webhook

{% tabs %}
{% tab title="Nodejs" %}

```javascript
var CryptoJS = require('crypto-js');
var express = require('express');
var router = express.router();

function verifyWebhook(req, res, next) {
  let payload = req.headers['x-onramp-payload'];
  let signature = req.headers['x-onramp-signature'];
  const localSignature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, 'YOUR_API_SECRET'));
  if(localSignature == signature){
    // signature verified
    return next();
  }
  return res.status(403).send("Invalid signature passed");
}

router.post('/webhookEndpoint', verifyWebhook, (req, res) => {
  // whatever you need to do with the data
  res.status(200).send("Received data :)");
})
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Response" %}

```json
// headers received in webhook
{
   "x-onramp-payload": "SOME_VALUE",
   "x-onramp-signature": "SOME_SIGNATURE"
}

// data received in webhook
{
   "orderId":9,
   "eventType":"offramp",
   "walletAddress":"0x12345678900987654321",
   "coinId":54,
   "fiatType":1,
   "expectedPrice":87,
   "actualFiatAmount":162.91,
   "paymentType": 1
   "actualPrice":87,
   "actualQuantity":2.02,
   "kycNeeded": 0,
   "createdAt":"2022-10-08T06:25:17.000Z",
   "updatedAt":"2022-11-09T16:58:07.000Z",
   "status":14,
   "statusDescription": "SUCCESS",
   "referenceId":"227912121212",
   "chainId":3,
   "onRampFee":2.49,
   "clientFee":2.49,
   "gatewayFee":2.5,
   "transactionHash":"0x61refuyiasfdvisuaogdhsaidur35624324",
   "merchantRecognitionId":'13422',
   "coinCode":"usdt",
   "paymentType": "2",
   "network":"matic20",
}
```

{% endtab %}

{% tab title="Explanation" %}

* orderId -> order id of the transaction
* eventType -> offramp(wehbooks for offramp)
* walletAddress -> Onchain wallet address to which the crypto was withdrawn to.
* coinId -> Id of the coin (e.g. 54 denotes to USDT)
* fiatType -> fiat type used for the transaction&#x20;
  * 1 -> INR (Indian rupee)
  * 2 -> TRY (Turkish lira)
  * 3 -> Arab Emirates Dirham (AED)
  * 4 -> Mexican Peso (MXN)
* paymentType -> payment method in fiat&#x20;
  * 1 -> Instant transfer (e.g. UPI)&#x20;
  * 2 -> Bank transfer (e.g. IMPS/FAST)
* expectedCryptoAmount -> amount of crypto estimate shown at the beginning of the transaction&#x20;
* actualFiatAmount -> actual amount of fiat currency
* expectedPrice -> expected price estimate shown at the beginning of the transaction&#x20;
* actualPrice -> actual price at which crypto sold&#x20;
* createdAt -> time at which the transaction was created.&#x20;
* appId -> App Id of the merchant/Partner.
* status -> denotes the status of the order
  * -4 -> wrong amount sent
  * -2 -> transaction abandoned
  * -1 -> transaction timed out
  * 0 -> transaction created
  * 1 -> referenceId claimed
  * 2,10,11 -> deposit secured
  * 3 -> The user sent a quantity of cryptocurrency that exceeds their KYC limit, and their funds are withheld pending manual review.
  * 4,12 -> The cryptocurrency has been sold.
  * 5,13,30,31,32,33,34,35,36 -> The process of fiat withdrawal has started.
  * 6,14,40 -> The fiat withdrawal process is complete.
  * 7,15,41 -> The webhook notification has been sent.
  * 17 -> The user has the option to provide an alternate bank account for the transaction.
  * 18 -> The transaction is being processed to the alternate bank account provided.
  * 19 -> The fiat has been processed and the transaction has been successfully completed.
* status description -> Description of status code
* chainId -> denotes which chain the coin was sent on (e.g. 3 denotes MATIC20)&#x20;
* onRampFee -> fee charged by onramp in pct&#x20;
* clientFee -> fee charged by client&#x20;
* gatewayFee -> fee charged by gateway&#x20;
* actualQuantity -> actual amount of crypto sold at the time of swap/trade.
* actualPrice ->  actual price at time of swap/trade.
* transactionHash -> hash id of the transaction sent onchain.&#x20;
* referenceId -> Reference Id entered by the user after completing fiat payment.
* kycNeeded -> KYC status of the user&#x20;
  * 0 -> basic KYC, no additional information required
  * 1 -> KYC needed to process this transaction
* merchantRecognitionId -> Specific string that can be passed by the merchant/Partner at the time of making the request.
* webhookTrials -> The number of attempts made to reach the intended endpoint using a webhook.
* coinCode -> Name of the coin returned as type string. (e.g. usdt)
* network -> Name of the network on which the coin/token was sent (e.g. erc20, btc, matic20)
  {% endtab %}
  {% endtabs %}
