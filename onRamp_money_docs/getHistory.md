# Get History

{% hint style="info" %}
**Note:**\
**page Number starts with 0.**

**Latest order will come first in the response. Per page limit is 50.**
{% endhint %}

<mark style="color:green;">`POST`</mark> `https://api.onramp.money/onramp-merchants/widget/getHistory`

#### Headers

| Name                                                 | Type   | Description                         |
| ---------------------------------------------------- | ------ | ----------------------------------- |
| X-ONRAMP-APIKEY<mark style="color:red;">\*</mark>    | String | Your api key                        |
| X-ONRAMP-PAYLOAD<mark style="color:red;">\*</mark>   | String | payload generated for the request   |
| X-ONRAMP-SIGNATURE<mark style="color:red;">\*</mark> | String | signature generated for the request |

#### Request Body

| Name                                   | Type   | Description                        |
| -------------------------------------- | ------ | ---------------------------------- |
| page<mark style="color:red;">\*</mark> | String | page number for retrieving orders. |

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
async function getHistory() {
  try {
        let body = {
          "page": "0"
      }
    let payload = {
      timestamp: new Date().getTime(),
      body
    }

    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp-merchants/widget/getHistory',
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
getHistory();
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

def get_history():
    try:
        body = {
            "page": "0"
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

        response = requests.post('https://api.onramp.money/onramp-merchants/widget/getHistory', headers=headers, json=body)
        print(response.json())

    except requests.RequestException as e:
        print(e.response.json() if e.response else str(e))

get_history()
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Response" %}

```json
{
  "status": 1,
  "data": [
    {
      "orderId": 1,
      "coinCode": "usdt",
      "network": "matic",
      "coinAmount": 0.1,
      "status": 2,
      "startTime": 1721837658,
      "endTime": 1721838258,
      "depositHash": ""
    },
    {
      "orderId": 2,
      "coinCode": "usdc",
      "network": "matic",
      "coinAmount": 0.1,
      "status": -3,
      "startTime": 1721826845,
      "endTime": 1721828645,
      "depositHash": ""
    }
  ],
  "code": 200
}

```

{% endtab %}

{% tab title="Explanation" %}

* **status**: Indicates the status of the API response.
* **1**: The response is successful.
* **data**: Contains a list of orders.
  * **orderId**: The unique identifier for the order (e.g., `1442`).
  * **coinCode**: The symbol of the cryptocurrency used in the order (e.g., `usdt`).
  * **network**: The blockchain network on which the order was processed (e.g., `matic`).
  * **coinAmount**: The amount of cryptocurrency involved in the order (e.g., `0.1`).
  * **status**: The status of the order. Values may include:
    * **-3**: Order Cancelled.
    * **-1**: Order Failed.
    * **0**: Waiting for Payment.
    * **1**: Payment received, waiting for block confirmation.
    * **2**: Payment completed with confirmation.
  * **startTime**: The timestamp (in Unix format) when the order was initiated (e.g., `1721837658`).
  * **endTime**: The timestamp (in Unix format) when the order was completed or ended (e.g., `1721838258`).
  * **paymentHash**: A unique hash for the payment transaction. An empty string indicates no hash was generated (e.g., `0xc089d60282fb5384b62b97505a4b1258049cee8ec2b3776a`).
* **code**: The HTTP status code of the response.
* **200**: Indicates that the request was successfully processed.
  {% endtab %}
  {% endtabs %}
