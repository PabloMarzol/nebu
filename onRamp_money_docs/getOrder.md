# Get Order

{% hint style="info" %}
**Note:**&#x20;

**You must provide either an orderId returned from createOrder API response or a hash returned from createIntent API response.**
{% endhint %}

<mark style="color:green;">`POST`</mark> `https://api.onramp.money/onramp-merchants/widget/getOrder`

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
async function getOrder() {
  try {
        let body = {
          orderId,      //Provide either orderId or hash
          hash  
      }
    let payload = {
      timestamp: new Date().getTime(),
      body
    }

    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp-merchants/widget/getOrder',
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
getOrder();
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

def get_order():
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

        response = requests.post('https://api.onramp.money/onramp-merchants/widget/getOrder', headers=headers, json=body)
        print(response.json())

    except requests.RequestException as e:
        print(e.response.json() if e.response else str(e))

get_order()
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Response" %}

```json
{
  "status": 1,
  "code": 200,
  "data": {
    "orderId": 1328,
    "coinId": 54,
    "chainId": 3,
    "coinAmount": 0.5,
    "status": -1,
    "startTime": 1721124010,
    "endTime": 1721124610,
    "depositHash": ""
  }
}
```

{% endtab %}

{% tab title="Explanation" %}

* **status**: Indicates the status of the API response.
* **code**: The HTTP status code of the response.
* **data**: Contains the details of the specific order.
  * **orderId**: The unique identifier for the order.
  * **coinId**: The identifier for the cryptocurrency used in the order.
  * **chainId**: The identifier for the blockchain network where the order was processed.
  * **coinAmount**: The amount of cryptocurrency involved in the order.
  * **status**: The status of the order. Values may include:
    * **-3**: Order Cancelled.
    * **-1**: Order Failed.
    * **0**: Waiting for Payment.
    * **1**: Payment received, waiting for block confirmation.
    * **2**: Payment completed with confirmation.
  * **startTime**: The timestamp (in Unix format) when the order was initiated.
  * **endTime**: The timestamp (in Unix format) when the order was completed or ended.
  * **paymentHash**: A unique hash for the payment transaction. An empty string indicates no hash was generated.
    {% endtab %}
    {% endtabs %}
