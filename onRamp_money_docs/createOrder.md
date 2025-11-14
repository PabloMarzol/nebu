# Create Order

{% hint style="info" %}
**Note**:

**This API will be applicable when entire whitelabel flow is implemented.**
{% endhint %}

<mark style="color:green;">`POST`</mark> `https://api.onramp.money/onramp-merchants/widget/createOrder`

#### Headers

| Name                                                 | Type   | Description                         |
| ---------------------------------------------------- | ------ | ----------------------------------- |
| X-ONRAMP-APIKEY<mark style="color:red;">\*</mark>    | String | Your api key                        |
| X-ONRAMP-PAYLOAD<mark style="color:red;">\*</mark>   | String | payload generated for the request   |
| X-ONRAMP-SIGNATURE<mark style="color:red;">\*</mark> | String | signature generated for the request |

#### Request Body

| Name                                         | Type   | Description                                                                      |
| -------------------------------------------- | ------ | -------------------------------------------------------------------------------- |
| coinId<mark style="color:red;">\*</mark>     | String | coinId from networkList API                                                      |
| chainId<mark style="color:red;">\*</mark>    | String | chainId from networkList API                                                     |
| coinAmount<mark style="color:red;">\*</mark> | String | <p>The cryptocurrency amount to be used for the transaction. <br>Ex: "2.00".</p> |

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
async function createOrder() {
  try {
        let body = {
          coinId: '54',         //required
          chainId: '3',         //required
          coinAmount: '2.00',   //required
      }
    let payload = {
      timestamp: new Date().getTime(),
      body
    }

    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp-merchants/widget/createOrder',
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
createOrder();
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

def create_order():
    try:
        body = {
            'coinId': '54',         # required
            'chainId': '3',         # required
            'coinAmount': '2.00',   # required
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

        response = requests.post('https://api.onramp.money/onramp-merchants/widget/createOrder', headers=headers, json=body)
        print(response.json())

    except requests.RequestException as e:
        print(e.response.json() if e.response else str(e))

create_order()
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
    "address": "",
    "startTime": "",
    "endTime": "",
    "orderId": ""
  }
}
```

{% endtab %}

{% tab title="Explanation" %}

* **status**: Indicates the overall status of the API response.
* **code**: The HTTP status code of the response.
* **data**: Contains details related to the API request. The specifics include:
  * **address**: Deposit address for this transactions.
  * **startTime**: The timestamp (in Unix format) representing when the order or transaction started.
  * **endTime**: The timestamp (in Unix format) representing when the order or transaction expiry time.
  * **orderId**: The unique identifier for the order or transaction.&#x20;
    {% endtab %}
    {% endtabs %}
