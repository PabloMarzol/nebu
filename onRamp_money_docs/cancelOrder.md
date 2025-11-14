# Cancel Order

{% hint style="info" %}
**Note:**&#x20;

**You must provide either an orderId returned from createOrder API response or a hash returned from createIntent API response.**
{% endhint %}

<mark style="color:green;">`POST`</mark> `https://api.onramp.money/onramp-merchants/widget/cancelOrder`

#### Headers

| Name                                                 | Type   | Description                         |
| ---------------------------------------------------- | ------ | ----------------------------------- |
| X-ONRAMP-APIKEY<mark style="color:red;">\*</mark>    | String | Your api key                        |
| X-ONRAMP-PAYLOAD<mark style="color:red;">\*</mark>   | String | payload generated for the request   |
| X-ONRAMP-SIGNATURE<mark style="color:red;">\*</mark> | String | signature generated for the request |

#### Request Body

| Name    | Type   | Description                                        |
| ------- | ------ | -------------------------------------------------- |
| orderId | String | OrderId obtained from the createOrder API response |
| hash    | String | Hash obtained from the createIntent API response   |

{% tabs %}
{% tab title="200: OK " %}
Please see detailed response below
{% endtab %}
{% endtabs %}

#### Sample Request

{% tabs %}
{% tab title="Nodejs" %}

```javascript
const CryptoJS = require('crypto-js');
const axios = require('axios');
async function cancelOrder() {
  try {
        let body = {
          'orderId',  //Provide either orderId or hash
          'hash'
      }
    let payload = {
      timestamp: new Date().getTime(),
      body
    }

    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp-merchants//widget/cancelOrder',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'X-ONRAMP-SIGNATURE': signature,
        'X-ONRAMP-APIKEY': apiKey,
        'X-ONRAMP-PAYLOAD': payload
      },
      data: body
    };
    let response = await axios(options)
    console.log(response?.data);
  } catch (error) {
    console.log(error?.response?.data)
  }
}
cancelOrder();
```

{% endtab %}

{% tab title="Python" %}

```python
import base64
import json
import time
import hmac
import hashlib
import requests

# Define your API keys and secrets
api_secret = 'your_api_secret'
api_key = 'your_api_key'

def cancel_order():
    try:
        body = {
         'orderId',
          'hash'
        }

        payload = {
            'timestamp': int(time.time() * 1000),
            'body': body
        }

        payload_str = json.dumps(payload)
        payload_base64 = base64.b64encode(payload_str.encode()).decode()
        signature = hmac.new(api_secret.encode(), payload_base64.encode(), hashlib.sha512).hexdigest()

        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'X-ONRAMP-SIGNATURE': signature,
            'X-ONRAMP-APIKEY': api_key,
            'X-ONRAMP-PAYLOAD': payload_base64
        }

        response = requests.post('https://api.onramp.money/onramp-merchants/widget/cancelOrder', headers=headers, json=body)
        print(response.json())

    except requests.RequestException as e:
        print(e.response.json() if e.response else str(e))

cancel_order()
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Response" %}

```json
{
  "status": 1,
  "data": {
    "orderId": "1443",
    "status": -3
  },
  "code": 200
}
```

{% endtab %}

{% tab title="Explanation" %}

* **status**: Indicates the overall status of the API response.
* **data**: Contains details about the specific order.
  * **orderId**: The unique identifier for the order.
  * **status**: The current status of the order. Values may include:
    * **-3**: Represents the cancelled state of the order.
* **code**: The HTTP status code of the response.
  {% endtab %}
  {% endtabs %}
