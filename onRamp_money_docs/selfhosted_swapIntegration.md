# Hosted Mode

The hosted mode is the quickest method to add swap support to your app.

### **Swap integration**

#### **simple integration(swap)**

Integrating in hosted mode is pretty straight forward, the only thing you would need to do is redirect your user to swap (link below), this would work for both on desktop and mobile, just  add a link to your app.

[`https://onramp.money/main/swap/?appId=1`](https://onramp.money/main/sell/?appId=1)

#### Customisation(swap)&#x20;

If you want to set some custom options for your integration, just add them as query parameters to the URL.

For example, we can pre-fill the sellAmount, receiveAmount, sellCoinCode, receiveCoinCode etc so the user flow can be enhanced and seamless overall, for detailed customisation refer to the block below.

## customisation options via query params&#x20;

<mark style="color:blue;">`GET`</mark> `https://onramp.money/main/swap/?appId=1`

User is redirected to the swap page, with configs set in query params.

#### Path Parameters

| Name                                    | Type               | Description                                                                                                                                                             |         |       |                    |                                                                                      |             |         |
| --------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----- | ------------------ | ------------------------------------------------------------------------------------ | ----------- | ------- |
| appId<mark style="color:red;">\*</mark> | 1                  | App Id of the merchant/Partner                                                                                                                                          |         |       |                    |                                                                                      |             |         |
| sellAmount                              | 12                 | <p>amount denoted in the native coin/token.</p><p>either sellAmount or receiveAmount, can be passed. When passed both <strong>sellAmount</strong> takes precedence</p>  |         |       |                    |                                                                                      |             |         |
| receiveAmount                           | 10                 | amount denoted in the native coin/token.                                                                                                                                |         |       |                    |                                                                                      |             |         |
| sellCoinCode                            | usdc               | <p>Name of the coin (also denoted as key in data.allCoinConfig in the response returned in the <strong>allConfig</strong> endpoint) current supported coins:</p><p>usdt | usdc    | busd  | eth                | bnb                                                                                  | matic       | sol</p> |
| receiveCoinCode                         | usdt               | <p>Name of the coin (also denoted as key in data.allCoinConfig in the response returned in the <strong>allConfig</strong> endpoint) current supported coins:</p><p>usdt | usdc    | busd  | eth                | bnb                                                                                  | matic       | sol</p> |
| sellNetwork                             | 1000               | <p>supported networks by onramp for swap transactions<br>supported networks: usdt - bep20                                                                               | matic20 | erc20 | trc20 usdc - bep20 | matic20</p><p>busd - bep20</p><p>matic - matic20</p><p>bnb - bep20</p><p>eth - erc20 | matic20</p> |         |
| merchantRecognitionId                   | 13422              | Specific string that can be passed by the merchant/Partner at the time of making the request, this would reflect via update from webhook.                               |         |       |                    |                                                                                      |             |         |
| receiveNetwork                          | matic20            | <p>supported networks by onramp for swap transactions<br>supported networks: usdt - bep20                                                                               | matic20 | erc20 | trc20 usdc - bep20 | matic20</p><p>busd - bep20</p><p>matic - matic20</p><p>bnb - bep20</p><p>eth - erc20 | matic20</p> |         |
| redirectUrl                             | onramp-example.com | <p>URL to which the user would be redirected after a successful transaction.\*</p><p>\*Applicable only in hosted mode</p>                                               |         |       |                    |                                                                                      |             |         |

{% tabs %}
{% tab title="200: OK " %}

```javascript
{
    // Response
}
```

{% endtab %}
{% endtabs %}

{% hint style="info" %}
**Note:** After generating the token and initiating the order, Onramp.money will send a request to initiate the on-chain withdrawal to the destination address on behalf of the user.
{% endhint %}

Integrating in hosted mode is pretty straight forward, the only thing you would need to do is redirect your user to Onramp (link below), this would work for both on desktop and mobile, just  add a link to your app.

This method is designed to streamline the process within applications by allowing certain parameters to be pre-filled. This pre-filling of parameters enables users to be redirected directly to the payment confirmation page, thus enhancing the user experience by removing unnecessary steps.

#### Example url

<https://onramp.money/main/swap/?appId=1&sellAmount=12&sellCoinCode=usdt&receiveCoinCode=usdc&sellNetwork=bep20&receiveNetwork=matic20>

The parameters that can be pre-filled are:

* `appId`: The application ID that is unique to the client's application.
* `sellAmount`: The amount of cryptocurrency user will sell .
* `receiveAmount`: The amount of cryptocurrency user will receive .
* `sellCoinCode:` The code of the cryptocurrency to be sold (in this case, USDT).
* `receiveCoinCode`: The code of the cryptocurrency to receive (in this case, USDT).
* `sellNetwork:`The blockchain network on which the transaction will occur (in this case, MATIC20).
* `receiveNetwork:`The blockchain network on which the transaction will occur (in this case, MATIC20).

By customising the URL with these parameters, Onramp provides a seamless experience where the user is taken directly to the payment page with all the necessary details already filled in, pending only their confirmation to proceed with the transaction. This method simplifies the process for the user, making it more efficient and user-friendly. &#x20;

<figure><img src="https://2429027697-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FLjGi8TfFqGtUxIX4Qv76%2Fuploads%2FOdHsNJObJVWmCiRHBDPE%2FScreenshot%202024-09-12%20at%203.40.46%20AM.png?alt=media&#x26;token=7961323d-9f02-4098-a940-4c979146fde6" alt=""><figcaption></figcaption></figure>

{% tabs %}
{% tab title="Redirect Response" %}
The Onramp widget URL allows the inclusion of a `redirectUrl` parameter. Upon completion of a swap, Onramp will redirect the user to the specified URL using this parameter. This feature can be utilised by your application to detect the completion of a transaction and execute subsequent actions, such as providing the user with purchase status notifications.

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
