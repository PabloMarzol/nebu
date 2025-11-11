# Sandbox Mode

{% hint style="info" %}
**Note:** This endpoint is for development and testing purposes only, please **do not send any funds** when using this endpoint.
{% endhint %}

### Sandbox details&#x20;

* The sandbox environment aims to recreate product flow as close to the production as possible, currently only **USDT-MATIC20** is supported on **polygon mumbai testnet.**
* **appId** needs to be set to **2**, as it the official test app Id.

### Simple Integration

Integrating in hosted mode is pretty straight forward, the only thing you would need to do is redirect to [onramp](https://onramp.money/main/buy/?appId=2) (link below), this would work for both on desktop and mobile, just  adding a link to your app.

<mark style="color:blue;">`GET`</mark> `https://onramp.money/main/buy/?appId=2`&#x20;

#### Parameters customisation

If you want to set some custom options for your integration, just add them as query parameters to the URL.

For example, let's set a `walletAddress` param so that it'll be pre-filled for the user, for detailed customisation refer to the block below.

## Customisation options via query params

<mark style="color:blue;">`GET`</mark>  [`https://onramp.money/main/buy/?appId=2&coinCode=usdt&network=matic20-test`](https://onramp.money/main/buy/?appId=2\&walletAddress=0xf142123879b4611Cd4a30C1E0929217C0d4fB37f\&coinCode=usdt\&network=matic20-test\&fiatAmount=150\&fiatType=1\&paymentMethod=1)

User is redirected to the onramp site, will configs set in query params.

#### Path Parameters

| Name                                    | Type         | Description                                                                                                                                                                            |
| --------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| coinAmount                              | 10           | <p>amount denoted in the native coin/token.</p><p></p><p>either coinAmount or fiatAmount, can be passed.<br>When passed both <strong>coinAmount</strong> takes precedence</p>          |
| network                                 | matic20-test | <p>supported networks by onramp for onchain transactions<br><br>current supported networks:<br>usdt - matic20 (<strong>Mumbai testnet</strong>)<br></p>                                |
| fiatAmount                              | 1000         | amount denoted in fiat amount. (only ₹ INR is currently supported)                                                                                                                     |
| coinCode                                | usdt         | <p>Name of the coin (also denoted as key in data.allCoinConfig in the response returned in the <strong>allConfig</strong> endpoint)<br><br>current supported coins:</p><p>usdt<br></p> |
| appId<mark style="color:red;">\*</mark> | 2            | <p>App Id of the merchant/Partner\*<br><br>\*Sandbox appId in this case</p>                                                                                                            |
| walletAddress                           | 0x7c8D..596  | Onchain wallet address to which the crypto will be withdrawn to.                                                                                                                       |
| merchantRecognitionId                   | 13422        | Specific string that can be passed by the merchant/Partner at the time of making the request, this would reflect via update from webhook.                                              |

{% tabs %}
{% tab title="200: OK " %}

```javascript
{
    // Response
}
```

{% endtab %}
{% endtabs %}
