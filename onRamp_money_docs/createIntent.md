# Create Intent

{% hint style="info" %}
**Note:**&#x20;

* **This API will be applicable when onramp merchant widget is directly integrated.**
* **coinId & chainId** can be fetched using the getNetworkList API.
* The list of supported `lang` parameters includes:
  * **en**: English
  * **tr**: Türkçe
  * **vi**: Tiếng Việt
  * **es**: Español
  * **pt**: Portuguese
  * **fil**: Filipino
  * **th**: Thai
  * **sw**: Swahili
  * **id**: Indonesian
    {% endhint %}

<mark style="color:green;">`POST`</mark> `https://api.onramp.money/onramp-merchants/widget/createIntent`

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
| redirectURL                                  | String | URL to which the user will be redirected after the transaction is completed.     |
| assetDescription                             | String | A description of the asset involved in the transaction.                          |
| assetImage                                   | String | URL pointing to an image of the asset involved in the transaction                |
| lang                                         | String | <p>The language code for the transaction interface. <br>Ex: "en"</p>             |

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
async function createIntent() {
  try {
        let body = {
          coinId: '54',         //required
          chainId: '3',         //required
          coinAmount: '2.00',   //required
          redirectURL,          //optional
          assetDescription,     //optional
          assetImage,           //optional
          lang                  //optional
                    }
    let payload = {
      timestamp: new Date().getTime(),
      body
    }

    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp-merchants/widget/createIntent',
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
createIntent();
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

def create_intent():
    try:
        body = {
            'coinId': '54',         # required
            'chainId': '3',         # required
            'coinAmount': '2.00',   # required
            'redirectURL': None,    # optional
            'assetDescription': None, # optional
            'assetImage': None,     # optional
            'lang': None            # optional
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

        response = requests.post('https://api.onramp.money/onramp-merchants/widget/createIntent', headers=headers, json=body)
        print(response.json())

    except requests.RequestException as e:
        print(e.response.json() if e.response else str(e))

create_intent()
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Response" %}

```json
{
  "status": 1,
  "data": {
    "hash": ""
  },
  "code": 200
}
```

{% endtab %}

{% tab title="Explanation" %}

* **status**: Indicates the overall status of the API response.
* **data**: Contains details specific to the API request.
  * **hash**: A unique identifier or reference for the transaction or operation. This field may contain a string value representing the hash which should be appended to the WIDGET\_URL to redirect users to payment page.
* **code**: The HTTP status code of the response.
  {% endtab %}
  {% endtabs %}
