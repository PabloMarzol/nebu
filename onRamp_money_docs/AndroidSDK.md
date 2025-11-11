# Android SDK Integration

This guide will help you understand how to integrate the Onramp SDK into your Android app

### General Requirements

Here are the minimum requirements to use the Onramp SDK:

* `minSdkVersion`: 21
* `compileSdkVersion`: 33
* The SDK requires the **INTERNET** permission to function properly:\
  \
  `<uses-permission android:name="android.permission.INTERNET"/>`

### Setup

#### Dependencies

In your app level `build.gradle` file, add the following dependencies:

```kotlin
dependencies {
    ...
    implementation 'money.onramp.onrampwebview:OnrampSDK:1.1.7'
}
```

#### Usage Example

build.gradle (Module: app)

```kotlin
dependencies {
    ...
    implementation  'money.onramp.onrampwebview:OnrampSDK:1.1.7'
}
```

#### Initialize the SDK

Start the Onramp SDK by calling the **`startOnrampSDK`** function and pass the necessary configuration parameters:

```kotlin
OnrampSDK.startOnrampSDK(
  context: this // replace this with the context of the activity where sdk is initialized
  appId: 1, // replace this with the appID you got during onboarding process
  walletAddress: '0x495f519017eF0368e82Af52b4B64461542a5430B', // replace with user's wallet address
  flowtype: 1 // 1 -> onramp || 2 -> offramp || 3 -> Merchant checkout
  fiatType: 1 // 1 -> INR || 2 -> TRY
  paymentMethod: 1 // 1 -> Instant transafer(UPI) || 2 -> Bank transfer(IMPS/FAST)
  // ... pass other configs here
)
```

{% hint style="info" %}
**Note:**

* **Supported Currencies**: To view the list of all the fiat currencies supported by Onramp, click [here](https://docs.onramp.money/onramp/supported-assets-and-fiat/fiat-currencies).
* **Supported Payment Methods**: To view the list of all the supported payment methods for various currencies supported by Onramp, click [here](https://docs.onramp.money/onramp/supported-assets-and-fiat/payment-methods).
  {% endhint %}

Next, register an event listener for the SDK:

```kotlin
OnrampSDK.registerOnrampSDKEventListener(this)
```

#### Listening to SDK Events

In your Activity class declaration, add the **`OnrampSDKEventListener`** interface:

```kotlin
class MainActivity : AppCompatActivity(), OnrampSDKEventListener {
  ...
}

```

Implement the **`onDataReceived(event: WidgetResponse)`** method in your activity class to handle the various SDK events:

```kotlin
override fun onDataReceived(event: WidgetResponse) {
        when(event.type){
          // handle various sdk events based on type of event here

          //Example events usage:

          "ONRAMP_WIDGET_TX_COMPLETED" -> {
              //handle success code here
          }
          "ONRAMP_WIDGET_TX_FAILED" -> {
              //handle failure code here
            }
          "ONRAMP_WIDGET_CLOSE_REQUEST_CONFIRMED" -> {
              //handle failure code here when user cancels the transaction              
            }
        }
    }

```

#### SDK Lifecycle

You can disable the OnrampSDK at any time using the following code:

```kotlin
OnrampSDK.stopOnrampSDK()
```

#### KYC SDK

To use the kyc widget in Onramp, initialize the `initiateOnrampKyc` function and pass the kyc config parametes (mandatory) to start the sdk.

```kotlin
OnrampSDK.initiateOnrampKyc(
    context: this, // replace this with the context of the activity where sdk is initialized
    appId: 1, // replace this with the appID you got during onboarding process
    payload:"enter payload string here",
    signature:"enter signature string here",
    customerId:"enter customerId here",
    apiKey:"enter apiKey here",
    lang:"en" // optional parameter, replace with desired language code
)
```

In the next step, we need to initialize the event listener for the SDK, which you’ll later use to capture SDK events in your app.

```kotlin
OnrampSDK.registerOnrampSDKEventListener(this)
```

#### LOGIN SDK

To use the login widget in Onramp, initialize the `startOnrampLogin` function and pass the config parametes to start the sdk.

```kotlin
OnrampSDK.startOnrampLogin(
    context: this, // replace this with the context of the activity where sdk is initialized
    appId: 1, // replace this with the appID you got during onboarding process
    closeAfterLogin: true/false, // toggle this value based on if you want to close widget after login or not
    lang:"en" // optional parameter, replace with desired language code
)
```

In the next step, we need to initialize the event listener for the SDK, which you’ll later use to capture SDK events in your app.

```kotlin
OnrampSDK.registerOnrampSDKEventListener(this)
```

#### Widget Transactions Events

{% tabs %}
{% tab title="Events" %}
TX\_EVENTS

```
ONRAMP_WIDGET_TX_INIT, 
ONRAMP_WIDGET_TX_FINDING, 
ONRAMP_WIDGET_TX_PURCHASING, 
ONRAMP_WIDGET_TX_SENDING, 
ONRAMP_WIDGET_TX_COMPLETED,
ONRAMP_WIDGET_TX_SENDING_FAILED, 
ONRAMP_WIDGET_TX_PURCHASING_FAILED, 
ONRAMP_WIDGET_TX_FINDING_FAILED
```

WIDGET\_EVENTS

```
ONRAMP_WIDGET_READY, 
ONRAMP_WIDGET_FAILED, 
ONRAMP_WIDGET_CLOSE_REQUEST_CONFIRMED,
ONRAMP_WIDGET_CLOSE_REQUEST_CANCELLED,
ONRAMP_WIDGET_CONTENT_COPIED
```

{% endtab %}

{% tab title="Explanation" %}
**TX\_EVENTS**

* ONRAMP\_WIDGET\_TX\_INIT -> when user sees the payment details on screen
* ONRAMP\_WIDGET\_TX\_FINDING -> when user submits the reference number for INR deposit
* ONRAMP\_WIDGET\_TX\_PURCHASING -> when system finds the deposit against reference / UTR submitted by user
* ONRAMP\_WIDGET\_TX\_SENDING -> when system is done purchasing the crypto & starts withdrawal
* ONRAMP\_WIDGET\_TX\_COMPLETED -> when system gets the tx hash for the deposit
* ONRAMP\_WIDGET\_TX\_SENDING\_FAILED -> if Failed before getting the tx hash
* ONRAMP\_WIDGET\_TX\_PURCHASING\_FAILED -> if failed while making the crypto purchase
* ONRAMP\_WIDGET\_TX\_FINDING\_FAILED -> if system failed at finding the deposit against the reference / UTR

**WIDGET\_EVENTS**

* ONRAMP\_WIDGET\_READY -> sent when widget is ready for user interaction
* ONRAMP\_WIDGET\_FAILED -> sent when widget render failed due to multiple reasons like wrong params combination or missing params etc.
* ONRAMP\_WIDGET\_CLOSE\_REQUEST\_CONFIRMED -> sent when widget is closed
* ONRAMP\_WIDGET\_CLOSE\_REQUEST\_CANCELLED -> sent when user dismisses close widget request modal.
* ONRAMP\_WIDGET\_CONTENT\_COPIED -> sent when copy to clipboard event is performed in widget, sends along the content copied.
  {% endtab %}
  {% endtabs %}

#### Widget Event Data

{% tabs %}
{% tab title="Onramp" %}

The events triggered by the SDK come with an associated data field. This provides partners with a streamlined way to track order statuses. Here's a breakdown of a sample response and its interpretation.

{% tabs %}
{% tab title="Data response" %}
ONRAMP\_WIDGET\_TX\_INIT

```json
"data": {
    "coinRate": 90.2,
    "cryptoAmount": 1.02,
    "fiatAmount": 101,
    "paymentMethod": "UPI"
  }
```

ONRAMP\_WIDGET\_TX\_FINDING

```json
"data": {
    }
```

ONRAMP\_WIDGET\_TX\_PURCHASING

```json
"data": {
    "kycNeeded": 0
  }
```

ONRAMP\_WIDGET\_TX\_SENDING

```json
"data": {
    "actualCryptoAmount": 1.11,
    "actualPrice": 90.2,
    "gasFee": 0.09
  }
```

ONRAMP\_WIDGET\_TX\_COMPLETED

```json
"data": {
    "actualCryptoAmount": 1.11,
    "actualPrice": 90.2,
    "chainId": 3,
    "clientFee": 0,
    "coinId": 54,
    "createdAt": "2023-10-13T07:49:58.000Z",
    "expectedCryptoAmount": 1.03,
    "expectedPrice": 90.2,
    "fiatAmount": 101,
    "fiatType": 1,
    "gasFee": 0.09,
    "gatewayFee": 0,
    "kycNeeded": 0,
    "merchantRecognitionId": null,
    "onRampFee": 0.25,
    "orderId": 302342,
    "orderStatus": 4,
    "referenceId": "327624383007",
    "transactionHash": "0xc1a8aaa9c887ca8f0c3b929caa71b2337c840b353939d3b6b340948ae5d",
    "updatedAt": "2023-10-13T07:56:04.000Z",
    "walletAddress": "0x63dDcda9ABC022Ce0E179A0F6f033Ea3282807b"
  }
```

{% endtab %}

{% tab title="Data explanation " %}

* status -> 0 is for unsuccessful request, 1 is for a successful one
* orderId -> order id of the transaction
* walletAddress -> Onchain wallet address to which the crypto was withdrawn to.
* coinId -> Id of the coin (e.g. 54 denotes to USDT)
* fiatType -> fiat type used for the transaction&#x20;
  * 1 -> INR (Indian Rupee)
  * 2 -> TRY (Turkish lira)
  * 3 -> Arab Emirates Dirham (AED)
  * 4 -> Mexican Peso (MXN)
  * 5 -> Vietnamese dong (VND)
* paymentType -> payment method in fiat&#x20;
  * 1 -> Instant transfer (e.g. UPI)&#x20;
  * 2 -> Bank transfer (e.g. IMPS/FAST)
* fiatAmount -> Amount of fiat received by the onramp.money.
* expectedCryptoAmount -> amount of crypto estimate shown at the beginning of the transaction&#x20;
* expectedPrice -> expected price estimate shown at the beginning of the transaction&#x20;
* createdAt -> time at which the transaction was created.&#x20;
* appId -> App Id of the merchant/Partner.
* status -> denotes the status of the order
  * -4 -> wrong amount sent
  * -3 -> bank and kyc name mismatch
  * -2 -> transaction abandoned
  * -1 -> transaction timed out
  * 0 -> transaction created
  * 1 -> referenceId claimed
  * 2 -> deposit secured
  * 3, 13 -> crypto purchased
  * 4, 15 -> withdrawal complete
  * 5, 16 -> webhook sent
  * 11 -> order placement initiated
  * 12 -> purchasing crypto
  * 14 -> withdrawal initiated
* chainId -> denotes which chain the coin was sent on (e.g. 3 denotes MATIC20)&#x20;
* onRampFee -> fee charged by onramp in pct&#x20;
* clientFee -> fee charged by client&#x20;
* gatewayFee -> fee charged by gateway&#x20;
* gasFee -> Onchain transaction fee charged&#x20;
* actualCryptoAmount -> actual amount of crypto bought at the time of swap/trade.
* actualPrice ->  actual price at time of swap/trade.
* transactionHash -> hash id of the transaction sent/received onchain.&#x20;
* referenceId -> Reference Id entered by the user after completing fiat payment.
* kycNeeded -> KYC status of the user&#x20;
  * 0 -> basic KYC, no additional information required
  * 1 -> KYC needed to process this transaction
    {% endtab %}
    {% endtabs %}

{% hint style="info" %}
**Note**:

* Each instance of the SDK maps directly to a single widget instance. Should you wish to close and subsequently reopen Onramp Instant, a fresh SDK initialization is required.
  {% endhint %}
  {% endtab %}

{% tab title="Offramp" %}
The events triggered by the SDK come with an associated data field. This provides partners with a streamlined way to track order statuses. Here's a breakdown of a sample response and its interpretation.

{% tabs %}
{% tab title="Data Response" %}
ONRAMP\_WIDGET\_TX\_INIT

```json
"data": {
    "coinRate": 88.7,
    "cryptoAmount": 1.16,
    "fiatAmount": 100,
    "walletAddress": "0xf123456789abcdef0123456789abcdef01234567"
  }
```

ONRAMP\_WIDGET\_TX\_FINDING

```json
"data": {
    "authToken": null,
    "chainData": {
      "address": "0x55d398326f99059ff775485246999027b3197955",
      "chainType": 0
    },
    "coinId": 54,
    "coinMinSell": 100,
    "coinRate": 88.7,
    "cryptoAmount": 1.16,
    "depositAddress": "0x0123456789abcdef0123456789abcdef01234567",
    "exchangeIdList": [1, 2],
    "feeBreakdown": {
      "onRampFeeVal": 0.258459,
      "clientFeeVal": 0,
      "gatewayFeeVal": 2.36,
      "tdsFeeVal": 1.0236
    },
    "fiatAmount": 100,
    "freezePaymentMethod": true,
    "isPoolPrice": true,
    "isTestNetwork": false,
    "memo": undefined,
    "merchantRecognitionId": null,
    "network": 1,
    "networkChainId": 56,
    "orderId": 65354,
    "paymentMethod": 2,
    "redirectURL": "",
    "selectedBank": {
      "bankId": 7,
      "bankAccount": "98765432101234",
      "ifsc": "SBI1234567",
      "details": "{\"name\": \"VIJAY KUMAR\", \"mobile\": \"9876543210\", \"bankName\": \"SBI Bank\", \"branchName\": \"MUMBAI MAIN\"}"
    },
```

ONRAMP\_WIDGET\_TX\_SELLING

```json
"data": {
    "actualFiatAmount": null,
    "actualPrice": null,
    "actualQuantity": null,
    "authToken": null,
    "chainData": {
      "address": "0x55d398326f99059ff775485246999027b3197955",
      "chainType": 0
    },
    "chainId": 1,
    "clientFee": 0,
    "coinId": 54,
    "coinMinSell": 100,
    "coinRate": 88.7,
    "cryptoAmount": 1.16,
    "depositAddress": "0x0123456789abcdef0123456789abcdef01234567",
    "exchangeIdList": [1, 2],
    "expectedPrice": 88.7,
    "expectedQuantity": 1.16,
    "feeBreakdown": {
      "onRampFeeVal": 0.258459,
      "clientFeeVal": 0,
      "gatewayFeeVal": 2.36,
      "tdsFeeVal": 1.0236
    },
    "fiatAmount": 100,
    "fiatType": 1,
    "freezePaymentMethod": true,
    "gatewayFee": 2.36,
    "isPoolPrice": true,
    "isTestNetwork": false,
    "memo": undefined,
    "merchantRecognitionId": null,
    "network": 1,
    "networkChainId": 56,
    "onrampFee": 1,
    "orderId": 12345,
    "orderStatus": 10,
    "paymentMethod": 2,
    "redirectURL": "",
    "selectedBank": {
      "bankId": 9,
      "bankAccount": "98765432101234",
      "ifsc": "SBI1234567",
      "details": "{\"name\": \"VIJAY KUMAR\", \"mobile\": \"9876543210\", \"bankName\": \"SBI Bank\", \"branchName\": \"MUMBAI MAIN\"}"
    },
    "staleOrderId": -1,
    "tdsFee": 1,
    "transactionHash": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
    "walletAddress": "0x0123456789abcdef0123456789abcdef01234567",
    "walletType": 102
  }
```

ONRAMP\_WIDGET\_TX\_SENDING

```json
"data": {
    "actualFiatAmount": null,
    "actualPrice": null,
    "actualQuantity": null,
    "authToken": null,
    "chainData": {
      "address": "0x55d398326f99059ff775485246999027b3197955",
      "chainType": 0
    },
    "chainId": 1,
    "clientFee": 0,
    "coinId": 54,
    "coinMinSell": 100,
    "coinRate": 88.7,
    "cryptoAmount": 1.16,
    "depositAddress": "0x0123456789abcdef0123456789abcdef01234567",
    "exchangeIdList": [1, 2],
    "expectedPrice": 88.7,
    "expectedQuantity": 1.16,
    "feeBreakdown": {
      "onRampFeeVal": 0.258459,
      "clientFeeVal": 0,
      "gatewayFeeVal": 2.36,
      "tdsFeeVal": 1.0236
    },
    "fiatAmount": 100,
    "fiatType": 1,
    "freezePaymentMethod": true,
    "gatewayFee": 2.36,
    "isPoolPrice": true,
    "isTestNetwork": false,
    "memo": undefined,
    "merchantRecognitionId": null,
    "network": 1,
    "networkChainId": 56,
    "onrampFee": 1,
    "orderId": 12345,
    "orderStatus": 12,
    "paymentMethod": 2,
    "redirectURL": "",
    "selectedBank": {
      "bankId": 9,
      "bankAccount": "98765432101234",
      "ifsc": "SBI1234567",
      "details": "{\"name\": \"VIJAY KUMAR\", \"mobile\": \"9876543210\", \"bankName\": \"SBI Bank\", \"branchName\": \"MUMBAI MAIN\"}"
    }
```

ONRAMP\_WIDGET\_TX\_SENT

```json
"data": {
    "actualFiatAmount": 98.75,
    "actualPrice": 88.7,
    "actualQuantity": null,
    "authToken": null,
    "chainData": {
      "address": "0x55d398326f99059ff775485246999027b3197955",
      "chainType": 0
    },
    "chainId": 1,
    "clientFee": 0,
    "coinId": 54,
    "coinMinSell": 100,
    "coinRate": 88.7,
    "cryptoAmount": 1.16,
    "depositAddress": "0x0123456789abcdef0123456789abcdef01234567",
    "exchangeIdList": [1, 2],
    "expectedPrice": 88.7,
    "expectedQuantity": 1.16,
    "feeBreakdown": {
      "onRampFeeVal": 0.258459,
      "clientFeeVal": 0,
      "gatewayFeeVal": 2.36,
      "tdsFeeVal": 1.0236
    },
    "fiatAmount": 100,
    "fiatType": 1,
    "freezePaymentMethod": true,
    "gatewayFee": 2.36,
    "isPoolPrice": true,
    "isTestNetwork": false,
    "memo": undefined,
    "merchantRecognitionId": null,
    "network": 1,
    "networkChainId": 56,
    "onrampFee": 1,
    "orderId": 12345,
    "orderStatus": 13,
    "paymentMethod": 2,
    "redirectURL": "",
    "selectedBank": {
      "bankId": 9,
      "bankAccount": "98765432101234",
      "ifsc": "SBI1234567",
      "details": "{\"name\": \"VIJAY KUMAR\", \"mobile\": \"9876543210\", \"bankName\": \"SBI Bank\", \"branchName\": \"MUMBAI MAIN\"}"
    },
    "staleOrderId": -1,
    "tdsFee": 1,
    "transactionHash": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
    "walletAddress": "0x0123456789abcdef0123456789abcdef01234567",
    "walletType": 102
  }
```

ONRAMP\_WIDGET\_TX\_COMPLETED

```json
"data": {
    "actualFiatAmount": 98.75,
    "actualPrice": 88.7,
    "actualQuantity": null,
    "authToken": null,
    "chainData": {
      "address": "0x55d398326f99059ff775485246999027b3197955",
      "chainType": 0
    },
    "chainId": 1,
    "clientFee": 0,
    "coinId": 54,
    "coinMinSell": 100,
    "coinRate": 88.7,
    "cryptoAmount": 1.16,
    "depositAddress": "0x0123456789abcdef0123456789abcdef01234567",
    "exchangeIdList": [1, 2],
    "expectedPrice": 88.7,
    "expectedQuantity": 1.16,
    "feeBreakdown": {
      "onRampFeeVal": 0.258459,
      "clientFeeVal": 0,
      "gatewayFeeVal": 2.36,
      "tdsFeeVal": 1.0236
    },
    "fiatAmount": 100,
    "fiatType": 1,
    "freezePaymentMethod": true,
    "gatewayFee": 2.36,
    "isPoolPrice": true,
    "isTestNetwork": false,
    "memo": undefined,
    "merchantRecognitionId": null,
    "network": 1,
    "networkChainId": 56,
    "onrampFee": 1,
    "orderId": 54321,
    "orderStatus": 14,
    "paymentMethod": 2,
    "redirectURL": "",
    "selectedBank": {
      "bankId": 9,
      "bankAccount": "98765432101234",
      "ifsc": "SBI1234567",
      "details": "{\"name\": \"VIJAY KUMAR\", \"mobile\": \"9876543210\", \"bankName\": \"SBI Bank\", \"branchName\": \"MUMBAI MAIN\"}"
    },
    "staleOrderId": -1,
    "tdsFee": 1,
    "transactionHash": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
    "walletAddress": "0x0123456789abcdef0123456789abcdef01234567",
    "walletType": 102
  }
```

{% endtab %}

{% tab title="Data Explanation " %}

* status -> 0 is for unsuccessful request, 1 is for a successful one
* orderId -> order id of the transaction
* walletAddress -> Onchain wallet address to which the crypto was withdrawn to.
* coinId -> Id of the coin (e.g. 54 denotes to USDT)
* fiatType -> fiat type used for the transaction&#x20;
  * 1 -> INR (Indian Rupee)
  * 2 -> TRY (Turkish lira)
  * 3 -> Arab Emirates Dirham (AED)
  * 4 -> Mexican Peso (MXN)
  * 5 -> Vietnamese dong (VND)
* paymentType -> payment method in fiat&#x20;
  * 1 -> Instant transfer (e.g. UPI)&#x20;
  * 2 -> Bank transfer (e.g. IMPS/FAST)
* fiatAmount -> Amount of fiat received by the onramp.money.
* expectedCryptoAmount -> amount of crypto estimate shown at the beginning of the transaction&#x20;
* expectedPrice -> expected price estimate shown at the beginning of the transaction&#x20;
* createdAt -> time at which the transaction was created.&#x20;
* appId -> App Id of the merchant/Partner.
* chainId -> denotes which chain the coin was sent on (e.g. 3 denotes MATIC20)&#x20;
* onRampFee -> fee charged by onramp in pct&#x20;
* clientFee -> fee charged by client&#x20;
* gatewayFee -> fee charged by gateway&#x20;
* gasFee -> Onchain transaction fee charged&#x20;
* actualCryptoAmount -> actual amount of crypto bought at the time of swap/trade.
* actualPrice ->  actual price at time of swap/trade.
* transactionHash -> hash id of the transaction sent/received onchain.&#x20;
* referenceId -> Reference Id entered by the user after completing fiat payment.
* kycNeeded -> KYC status of the user&#x20;
  * 0 -> basic KYC, no additional information required
  * 1 -> KYC needed to process this transaction
* expectedQuantity -> quantity of cryptocurrency that is expected to be received&#x20;
* actualQuantity -> The quantity of cryptocurrency that is actually received post block confirmations.
* actualFiatAmount -> The fiat amount that is sent to the user's bank account  post conversion of crypto to fiat.
* tdsFee -> 1% fee charged in compliance with the Indian tax law.
* paymentType -> the method of payout done in fiat
  * 1 -> UPI&#x20;
  * 2 -> IMPS
* status -> denotes the status of the order
  * -4 -> amount mismatch
  * -2 -> transaction abandoned.&#x20;
  * -1 -> transaction time out. &#x20;
  * 0 -> order created.&#x20;
  * 1 -> order confirmed i.e. hash generated. &#x20;
  * 2,10,11 -> hash found status.&#x20;
  * 3 -> over limit (If the user sends a quantity of cryptocurrency that exceeds their KYC limit, their funds will be withheld until reviewed manually).
  * 4,12 -> crypto sold.&#x20;
  * 5,13 -> fiat withdrawal initiated to bank&#x20;
  * 6,14 -> fiat withdrawal processed.
  * 7,15 -> webhook sent
  * 17 -> provide alternate bank
  * 18 -> processing to alternate bank
  * 19 -> success
    {% endtab %}
    {% endtabs %}

{% hint style="info" %}
It's important to remember that one instance of the SDK corresponds to one instance of the widget - if you want to close Offramp Instant and open it again, you'll need to initialise our SDK again
{% endhint %}
{% endtab %}
{% endtabs %}
