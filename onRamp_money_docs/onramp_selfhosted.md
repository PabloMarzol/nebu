# Hosted Mode

The hosted mode is the quickest method to add onramp support to your app.

### Onramp integration&#x20;

#### Simple Integration(onramp)

Integrating in hosted mode is pretty straight forward, the only thing you would need to do is redirect your user to onramp (link below), this would work for both on desktop and mobile, just  add a link to your app.

[`https://onramp.money/app/?appId=1`](https://onramp.money/app/?appId=1)

{% hint style="info" %}
**Note:**

* **Supported Currencies**: To view the list of all the fiat currencies supported by Onramp, click [here](https://docs.onramp.money/onramp/supported-assets-and-fiat/fiat-currencies).
* **Supported Payment Methods**: To view the list of all the supported payment methods for various currencies supported by Onramp, click [here](https://docs.onramp.money/onramp/supported-assets-and-fiat/payment-methods).
  {% endhint %}

#### Customisation (onramp)

If you want to set some custom options for your integration, just add them as query parameters to the URL.

For example, let's set a `walletAddress` param so that it'll be pre-filled for the user, for detailed customisation refer to the block below.

## Customisation options via query params

<mark style="color:blue;">`GET`</mark> `https://onramp.money/app/?appId=1`

User is redirected to the onramp site, with configs set in query params.

#### Path Parameters

| Name                                    | Type               | Description                                                                                                                                                                                                                                                                                                                                                          |         |       |                       |                                                                                         |                 |             |
| --------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----- | --------------------- | --------------------------------------------------------------------------------------- | --------------- | ----------- |
| coinAmount                              | 10                 | <p>amount denoted in the native coin/token.</p><p></p><p>either coinAmount or fiatAmount, can be passed.<br>When passed both <strong>coinAmount</strong> takes precedence</p>                                                                                                                                                                                        |         |       |                       |                                                                                         |                 |             |
| network                                 | bep20              | <p>supported networks by onramp for onchain transactions<br><br>current supported networks:<br>usdt - bep20                                                                                                                                                                                                                                                          | matic20 | erc20 | trc20<br>usdc - bep20 | matic20 </p><p>busd - bep20 </p><p>matic - matic20 </p><p>bnb - bep20</p><p>eth - erc20 | matic20<br></p> |             |
| fiatAmount                              | 1000               | amount denoted in fiat amount. (only ₹ INR is currently supported)                                                                                                                                                                                                                                                                                                   |         |       |                       |                                                                                         |                 |             |
| coinCode                                | usdt               | <p>Name of the coin (also denoted as key in data.allCoinConfig in the response returned in the <strong>allConfig</strong> endpoint)<br><br>current supported coins:</p><p>usdt                                                                                                                                                                                       | usdc    | busd  | eth                   | bnb                                                                                     | matic           | sol<br></p> |
| appId<mark style="color:red;">\*</mark> | 1                  | App Id of the merchant/Partner                                                                                                                                                                                                                                                                                                                                       |         |       |                       |                                                                                         |                 |             |
| walletAddress                           | 0x7c8D..596        | Onchain wallet address to which the crypto will be withdrawn to.                                                                                                                                                                                                                                                                                                     |         |       |                       |                                                                                         |                 |             |
| merchantRecognitionId                   | 13422              | Specific string that can be passed by the merchant/Partner at the time of making the request, this would reflect via update from webhook.                                                                                                                                                                                                                            |         |       |                       |                                                                                         |                 |             |
| paymentMethod                           | 1                  | <p>Type of method the user would choose to pay in.<br><br></p><p>1 -> Instant transfer (e.g. UPI) </p><p>2 -> Bank transfer (e.g. IMPS/FAST)</p>                                                                                                                                                                                                                     |         |       |                       |                                                                                         |                 |             |
| redirectUrl                             | onramp-example.com | <p>URL to which the user would be redirected after a successful transaction.\* <br><br>\*Applicable only in hosted mode</p>                                                                                                                                                                                                                                          |         |       |                       |                                                                                         |                 |             |
| addressTag                              | 334552             | <p>memo/tag associated with the transaction can be useful for certain cryptocurrencies that require this information to identify the recipient of a transaction or deposit.</p><p>E.g. XRP, XLM etc</p>                                                                                                                                                              |         |       |                       |                                                                                         |                 |             |
| fiatType                                | 1                  | <p>1 -> India (Default) INR</p><p>2 -> Turkey (TRY)</p><p>3 -> Arab Emirates Dirham (AED)</p><p>4 -> Mexican Peso (MXN)</p><p>5 -> Vietnamese dong (VND)</p><p>6 -> Nigerian Naira (NGN)</p><p>etc</p><p></p><p><strong>Note:</strong> For a complete list of supported fiat currencies, please visit the "Fiat Currencies" page under "Supported Assets & Fiat"</p> |         |       |                       |                                                                                         |                 |             |
| phoneNumber                             | %2B90-9993749865   | <p>The user's phone number should be URL-encoded, with the country code and phone number separated by a hyphen.<br><br>e.g. the number +90-9993749865 would be encoded as %2B90-9993749865.</p>                                                                                                                                                                      |         |       |                       |                                                                                         |                 |             |
| lang                                    | en\|vi\|es\|tr     | <p>lang feature is available.. please set it using queryParam<br><br>en -> 'English', (default)</p><p>tr -> 'Türkçe',<br>vi -> 'Tiếng Việt',<br>es -> 'Español',<br>pt -> 'Portuguese',<br>fil -> 'Filipino',<br>th -> 'Thai',<br>sw -> 'Swahili',<br>id -> 'Indonesian',</p>                                                                                        |         |       |                       |                                                                                         |                 |             |

{% tabs %}
{% tab title="200: OK " %}

```javascript
{
    // Response
}
```

{% endtab %}
{% endtabs %}

Integrating in hosted mode is pretty straight forward, the only thing you would need to do is redirect your user to Onramp (link below), this would work for both on desktop and mobile, just  add a link to your app.

This method is designed to streamline the payment process within applications by allowing certain parameters to be pre-filled. This pre-filling of parameters enables users to be redirected directly to the payment confirmation page, thus enhancing the user experience by removing unnecessary steps.

#### Example url

[`https://onramp.money/main/buy/?appId=1&walletAddress=0xf142123879b4611Cd4a30C1E0929217C0d4fB37f&coinCode=usdt&network=matic20&fiatAmount=150&fiatType=1&paymentMethod=1`](https://onramp.money/main/buy/?appId=1\&walletAddress=0xf142123879b4611Cd4a30C1E0929217C0d4fB37f\&coinCode=usdt\&network=matic20\&fiatAmount=150\&fiatType=1\&paymentMethod=1)

The parameters that can be pre-filled are:

* `appId`: The application ID that is unique to the client's application.
* `walletAddress`: The user's wallet address where they will receive the cryptocurrency.
* `coinCode`: The code of the cryptocurrency to be purchased (in this case, USDT).
* `network`: The blockchain network on which the transaction will occur (in this case, MATIC20).
* `fiatAmount`: The amount of fiat currency (in this case, INR) that the user is spending.
* `fiatType`: The type of fiat currency being used. (in this case 1 -> INR).
* `paymentMethod`: The payment method chosen by the user. (in this case 1 -> UPI).

By customising the URL with these parameters, Onramp provides a seamless experience where the user is taken directly to the payment page with all the necessary details already filled in, pending only their confirmation to proceed with the transaction. This method simplifies the process for the user, making it more efficient and user-friendly. &#x20;

<figure><img src="https://2429027697-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FLjGi8TfFqGtUxIX4Qv76%2Fuploads%2FvqgLy725Xgi9RVUOds0w%2Fimage.png?alt=media&#x26;token=9fa6481f-0f31-4d9e-99db-9e30927eca0e" alt=""><figcaption><p>Overview of onramp page</p></figcaption></figure>

{% tabs %}
{% tab title="Redirect Response" %}
The Onramp widget URL allows the inclusion of a `redirectUrl` parameter. Upon completion of a purchase, Onramp will redirect the user to the specified URL using this parameter. This feature can be utilised by your application to detect the completion of a transaction and execute subsequent actions, such as providing the user with purchase status notifications.

if your app name is **onramp-example**, and the parameter is set to `redirectUrl = http://onramp-example.com`

the redirect would be as the following

```
//after successful transaction
http://onramp-example.com?orderId=123&status=success

//incase transaction is pending
http://onramp-example.com?orderId=123&status=pending
```

{% endtab %}
{% endtabs %}
