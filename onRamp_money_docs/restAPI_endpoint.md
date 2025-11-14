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

# AllGasfees (external withdrawal fees)

<mark style="color:blue;">`GET`</mark> `https://api.onramp.money/onramp/api/v1/public/allGasFee`

{% tabs %}
{% tab title="200: OK " %}

```json
{
    "status": 1,
    "code": 200,
    "data": {
        "allGasFee": {
            "0": {
                "native": {
                    "withdrawalFee": 0.0005,
                    "minimumWithdrawal": 0.001,
                    "nodeInSync": 1
                }
            },
            "6": {
                "0": {
                    "withdrawalFee": 0.007416,
                    "minimumWithdrawal": 0.008157600000000001,
                    "nodeInSync": 1
                },
                "3": {
                    "withdrawalFee": 0.00017319,
                    "minimumWithdrawal": 0.0008659500000000001,
                    "nodeInSync": 1
                }
            },
            "54": {
                "0": {
                    "withdrawalFee": 8.96,
                    "minimumWithdrawal": 9.856,
                    "nodeInSync": 1
                },
                "1": {
                    "withdrawalFee": 1.78,
                    "minimumWithdrawal": 8.9,
                    "nodeInSync": 1
                },
                "2": {
                    "withdrawalFee": 4,
                    "minimumWithdrawal": 12,
                    "nodeInSync": 1
                },
                "3": {
                    "withdrawalFee": 0.21,
                    "minimumWithdrawal": 1.05,
                    "nodeInSync": 1
                }
            },
            "72": {
                "1": {
                    "withdrawalFee": 0.0075,
                    "minimumWithdrawal": 0.0375,
                    "nodeInSync": 1
                },
                "5": {
                    "withdrawalFee": 0.01,
                    "minimumWithdrawal": 0.05,
                    "nodeInSync": 1
                }
            },
            "83": {
                "0": {
                    "withdrawalFee": 12.71,
                    "minimumWithdrawal": 13.981,
                    "nodeInSync": 1
                },
                "3": {
                    "withdrawalFee": 0.3,
                    "minimumWithdrawal": 1.5,
                    "nodeInSync": 1
                }
            },
            "116": {
                "1": {
                    "withdrawalFee": 1.77,
                    "minimumWithdrawal": 8.85,
                    "nodeInSync": 1
                },
                "3": {
                    "withdrawalFee": 0.21,
                    "minimumWithdrawal": 1.05,
                    "nodeInSync": 1
                }
            },
            "144": {
                "1": {
                    "withdrawalFee": 1.77,
                    "minimumWithdrawal": 8.85,
                    "nodeInSync": 1
                }
            }
        }
    }
}
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Nodejs" %}

```javascript
const axios = require('axios');
let url = 'https://api.onramp.money/onramp/api/v1/public/allGasFee'

const getGasFee = async () => {
    try {
        const response = await axios.get(url);
        console.log(JSON.stringify(response.data, null, 2)); // The "2" here adds indentation to the output
    } catch (error) {
        console.error(`Error: ${error}`);
    }
};

getGasFee();
```

{% endtab %}

{% tab title="Untitled" %}

```python
import requests

def all_gas_fee():
    url = f'https://api.onramp.money/onramp/api/v1/public/allGasFee'
    response = requests.get(url)

    if response.status_code == 200:
        print(response.json())
    else:
        print(f"Request failed with status code {response.status_code}")

all_gas_fee()
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
        "allGasFee": {
            "0": {
                "native": {
                    "withdrawalFee": 0.0005,
                    "minimumWithdrawal": 0.001,
                    "nodeInSync": 1
                }
            },
            "6": {
                "0": {
                    "withdrawalFee": 0.007416,
                    "minimumWithdrawal": 0.008157600000000001,
                    "nodeInSync": 1
                },
                "3": {
                    "withdrawalFee": 0.00017319,
                    "minimumWithdrawal": 0.0008659500000000001,
                    "nodeInSync": 1
                }
            },
            "54": {
                "0": {
                    "withdrawalFee": 8.96,
                    "minimumWithdrawal": 9.856,
                    "nodeInSync": 1
                },
                "1": {
                    "withdrawalFee": 1.78,
                    "minimumWithdrawal": 8.9,
                    "nodeInSync": 1
                },
                "2": {
                    "withdrawalFee": 4,
                    "minimumWithdrawal": 12,
                    "nodeInSync": 1
                },
                "3": {
                    "withdrawalFee": 0.21,
                    "minimumWithdrawal": 1.05,
                    "nodeInSync": 1
                }
            },
            "72": {
                "1": {
                    "withdrawalFee": 0.0075,
                    "minimumWithdrawal": 0.0375,
                    "nodeInSync": 1
                },
                "5": {
                    "withdrawalFee": 0.01,
                    "minimumWithdrawal": 0.05,
                    "nodeInSync": 1
                }
            },
            "83": {
                "0": {
                    "withdrawalFee": 12.71,
                    "minimumWithdrawal": 13.981,
                    "nodeInSync": 1
                },
                "3": {
                    "withdrawalFee": 0.3,
                    "minimumWithdrawal": 1.5,
                    "nodeInSync": 1
                }
            },
            "116": {
                "1": {
                    "withdrawalFee": 1.77,
                    "minimumWithdrawal": 8.85,
                    "nodeInSync": 1
                },
                "3": {
                    "withdrawalFee": 0.21,
                    "minimumWithdrawal": 1.05,
                    "nodeInSync": 1
                }
            },
            "144": {
                "1": {
                    "withdrawalFee": 1.77,
                    "minimumWithdrawal": 8.85,
                    "nodeInSync": 1
                }
            }
        }
    }
}
```

{% endtab %}

{% tab title="Explanation" %}

* status -> 0 is for unsuccessful request, 1 is for a successful one
* withdrawalFee -> fee required for onchain transaction.
* minimumWithdrawal -> minimum amount required to initiate a withdrawal.
* nodeInSync -> status of the nodes&#x20;
  * 1 denotes -> In sync
  * 0 denotes -> out of sync
* allGasFee -> returns a detailed response for withdrawal details,&#x20;
  * the response starts with is the coinId, e.g. 54 denotes USDT
  * the response in the coinId is networks, e.g. 0 denotes erc20

**Note:**

* The fees are updated based on onchain fees, congestion and activity.
  {% endtab %}
  {% endtabs %}


# Quotes API - onramp

{% hint style="info" %}
**Note:**

* **Supported Currencies**: To view the list of all the fiat currencies supported by Onramp, click [here](https://docs.onramp.money/onramp/supported-assets-and-fiat/fiat-currencies).
* **Supported Payment Methods**: To view the list of all the supported payment methods for various currencies supported by Onramp, click [here](https://docs.onramp.money/onramp/supported-assets-and-fiat/payment-methods).
* **Only coinId or coinCode is now mandatory** — at least one of these fields must be provided in every request.
* **Only chainId or network is now mandatory** — at least one of these fields must be provided in every request.
* **Only fiatType or countryCode is now mandatory** — at least one of these fields must be provided in every request.
  {% endhint %}

<mark style="color:green;">`POST`</mark> `https://api.onramp.money/onramp/api/v2/common/transaction/quotes`

#### Headers

| Name                                                 | Type   | Description                         |
| ---------------------------------------------------- | ------ | ----------------------------------- |
| X-ONRAMP-APIKEY<mark style="color:red;">\*</mark>    | String | Your api key                        |
| X-ONRAMP-PAYLOAD<mark style="color:red;">\*</mark>   | String | payload generated for the request   |
| X-ONRAMP-SIGNATURE<mark style="color:red;">\*</mark> | String | signature generated for the request |

#### Request Body

| Name                                         | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                        |         |       |                           |                                                |                                                                                                                                                             |                                                                                                                                                          |
| -------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | ----- | ------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| coinId                                       | Integer | coinId from config file                                                                                                                                                                                                                                                                                                                                                                                            |         |       |                           |                                                |                                                                                                                                                             |                                                                                                                                                          |
| chainId                                      | Integer | chainId from config file                                                                                                                                                                                                                                                                                                                                                                                           |         |       |                           |                                                |                                                                                                                                                             |                                                                                                                                                          |
| fiatAmount<mark style="color:red;">\*</mark> | Float   | Fiat Amount                                                                                                                                                                                                                                                                                                                                                                                                        |         |       |                           |                                                |                                                                                                                                                             |                                                                                                                                                          |
| fiatType                                     | Integer | <p>fiat type used for the transaction <br></p><p>1 -> India (Default) INR</p><p>2 -> Turkey (TRY)</p><p>3 -> Arab Emirates Dirham (AED)</p><p>4 -> Mexican Peso (MXN)</p><p>5 -> Vietnamese dong (VND)</p><p>6 -> Nigerian Naira (NGN)</p><p>etc</p><p></p><p><strong>Note:</strong> For a complete list of supported fiat currencies, please visit the "Fiat Currencies" page under "Supported Assets & Fiat"</p> |         |       |                           |                                                |                                                                                                                                                             |                                                                                                                                                          |
| type<mark style="color:red;">\*</mark>       | Integer | <p>refers to the type of transaction<br><br>1 -> onramp </p><p></p>                                                                                                                                                                                                                                                                                                                                                |         |       |                           |                                                |                                                                                                                                                             |                                                                                                                                                          |
| coinCode                                     | String  | <p>Name of the coin (also denoted as key in data.allCoinConfig in the response returned in the <strong>allConfig</strong> endpoint) </p><p></p><p><strong>E.g.</strong> </p><p>usdt                                                                                                                                                                                                                                | usdc    | busd  | eth                       | bnb                                            | matic                                                                                                                                                       | sol</p><p></p><p><strong>Note:</strong></p><p>either coinId or coinCode, can be passed. When passed both, <strong>coinCode</strong> takes precedence</p> |
| network                                      | String  | <p>supported networks by onramp for onchain transactions </p><p></p><p><strong>E.g.</strong> of supported networks: </p><p>usdt - bep20                                                                                                                                                                                                                                                                            | matic20 | erc20 | trc20 </p><p>usdc - bep20 | matic20 </p><p>busd - bep20 </p><p>eth - erc20 | matic20</p><p></p><p><strong>Note:</strong></p><p>either chainId or network, can be passed. When passed both, <strong>network</strong> takes precedence</p> |                                                                                                                                                          |
| countryCode                                  | String  | <p>2 digit ISO country code<br><strong>E.g.</strong> IN, TR, AT, DE</p>                                                                                                                                                                                                                                                                                                                                            |         |       |                           |                                                |                                                                                                                                                             |                                                                                                                                                          |

{% tabs %}
{% tab title="200: OK " %}
Please see detailed response below
{% endtab %}
{% endtabs %}

#### Sample Request

{% tabs %}
{% tab title="Nodejs" %}

```javascript
var CryptoJS = require('crypto-js');
var axios = require('axios');
async function getQuotes() {
  try {
    let body = {
      coinId: 54,   
      coinCode: "usdt",  // (if both coinId and coinCode are passed -> coinCode takes precedence)
      chainId: 3,    
      network: "bep20",  //(if both chainId and network are passed -> network takes precedence)
      fiatAmount: 200, 
      fiatType: 1,     // Fiat Type from config file 1 for INR || 2 for TRY || 3 for AED || 4 for MXN etc
      type: 1          // 1 -> onramp || 2 -> offramp 
    }
    let payload = {
      timestamp: new Date().getTime(),
      body
    }
    let apiKey = 'API_KEY', apiSecret = 'API_SECRET';
    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp/api/v2/common/transaction/quotes',
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
    let data = await axios(options)
    console.log(data?.data);
  } catch (error) {
    console.log(error?.response?.data)
  }
}
getQuotes();
```

{% endtab %}

{% tab title="Python" %}

```python
import json
import time
import base64
import hmac
import hashlib
import requests

def quotes():
    try:
        body = {
        'coinId': 54,
        'coinCode': "usdt",  # (if both coinId and coinCode are passed -> coinCode takes precedence)
        'chainId': 3,
        'network': "bep20",  #(if both chainId and network are passed -> network takes precedence)
        'fiatAmount': 200,
        'fiatType': 1,       #Fiat Type from config file(1 for INR || 2 for TRY)
        'type': 1            # 1 -> onramp || 2 -> offramp 
        }
        payload = {
            "timestamp": int(time.time() * 1000),  # to get timestamp in milliseconds
            "body": body
        }
        api_key = 'API_KEY'
        api_secret = 'API_SECRET'

        payload = base64.b64encode(json.dumps(payload).encode()).decode()
        signature = hmac.new(api_secret.encode(), payload.encode(), hashlib.sha512).hexdigest()
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'X-ONRAMP-SIGNATURE': signature,
            'X-ONRAMP-APIKEY': api_key,
            'X-ONRAMP-PAYLOAD': payload
        }
        url = 'https://api.onramp.money/onramp/api/v2/common/transaction/quotes'
        response = requests.post(url, headers=headers, data=json.dumps(body))
        print(response.json())
    except Exception as e:
        print(str(e))

quotes()
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Response" %}

```json
{
   "status":1,
   "data":{
      "rate":24.41,
      "quantity":7.88,
      "onrampFee":0.5,
      "clientFee":0,
      "gatewayFee":0,
      "gasFee":7.08
   },
   "code":200
}
```

{% endtab %}

{% tab title="Explanation" %}

* status -> 0 is for unsuccessful request, 1 is for a successful one
* quantity -> amount of crypto estimate
* rate -> expected price estimate shown at the beginning of the transaction
* onRampFee -> fee charged by onramp in pct&#x20;
* clientFee -> fee charged by client&#x20;
* gatewayFee -> fee charged by gateway&#x20;
* gasFee -> Onchain transaction fee charged&#x20;

{% endtab %}
{% endtabs %}


# Sample Request for Endpoints

Below is a sample code that demonstrates how to fetch information from merchant REST endpoints, You can call all the merchant endpoints in a similar manner, making sure to update the endpoint URLs and parameters passed in the request body as needed.

{% tabs %}
{% tab title="Nodejs" %}

```javascript
var CryptoJS = require('crypto-js');
var axios = require('axios');
async function getAllTransactions() {
  try {
    let body = {
      page: 1,
      pageSize: 50
    }
    let payload = {
      timestamp: new Date().getTime(),
      body: body
    }
    let apiKey = 'API_KEY', apiSecret = 'API_SECRET';
    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp/api/v1/transaction/merchantHistory',
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
    let data = await axios(options)
    console.log(data?.data);
  } catch (error) {
    console.log(error?.response?.data)
  }
}
getAllTransactions();
```

{% endtab %}

{% tab title="Python" %}

```python
import json
import time
import base64
import hmac
import hashlib
import requests

def merchant_history():
    try:
        body = {
        'page': 1,
        'pageSize': 50,
        'since': '2022-10-07T22:29:51.999Z',
        'order': 'DESC',  # ASC or DESC
        'type': 1         # 1 -> onramp, 2 -> offramp
        }
        payload = {
            "timestamp": int(time.time() * 1000),  # to get timestamp in milliseconds
            "body": body
        }
        api_key = 'API_KEY'
        api_secret = 'API_SECRET'

        payload = base64.b64encode(json.dumps(payload).encode()).decode()
        signature = hmac.new(api_secret.encode(), payload.encode(), hashlib.sha512).hexdigest()
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'X-ONRAMP-SIGNATURE': signature,
            'X-ONRAMP-APIKEY': api_key,
            'X-ONRAMP-PAYLOAD': payload
        }
        url = 'https://api.onramp.money/onramp/api/v1/transaction/merchantHistory'
        response = requests.post(url, headers=headers, data=json.dumps(body))
        print(response.json())
    except Exception as e:
        print(str(e))

merchant_history()
```

{% endtab %}
{% endtabs %}


# Merchant Transaction History

<mark style="color:green;">`POST`</mark> `https://api.onramp.money/onramp/api/v1/transaction/merchantHistory`

#### Headers

| Name                                                 | Type   | Description                         |
| ---------------------------------------------------- | ------ | ----------------------------------- |
| X-ONRAMP-APIKEY<mark style="color:red;">\*</mark>    | String | Your api key                        |
| X-ONRAMP-PAYLOAD<mark style="color:red;">\*</mark>   | String | payload generated for the request   |
| X-ONRAMP-SIGNATURE<mark style="color:red;">\*</mark> | String | signature generated for the request |

#### Request Body

| Name     | Type    | Description                                                                                                                                                  |
| -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| page     | Integer | Default value 1                                                                                                                                              |
| pageSize | Integer | Min: 1, Max: 500, Default: 50                                                                                                                                |
| since    | String  | '2022-10-07T22:29:52.000Z'                                                                                                                                   |
| order    | String  | ASC or DESC (ASC for ascending order of data DESC for descending, Default: ASC)                                                                              |
| type     | Integer | <p>1 -> Onramp</p><p>2 -> Offramp</p><p></p><p>Onramp transactions are returned incase the field is empty.</p>                                               |
| fiatType | String  | <p>1 -> India (Default) INR</p><p>2 -> Turkey (TRY)</p><p>3 -> Arab Emirates Dirham (AED)</p><p>4 -> Mexican Peso (MXN)</p><p>5 -> Vietnamese dong (VND)</p> |

{% tabs %}
{% tab title="200: OK " %}

<pre class="language-json"><code class="lang-json">{
    "status": 1,
    "data": [
<strong>            {
</strong>                    "orderId": 1,
                    "walletAddress": "",
                    "coinId": 54,
                    "fiatType": 12,
                    "expectedPrice": 0.94846,
                    "fiatAmount": 478.49,
                    "expectedCryptoAmount": 100.18,
                    "actualPrice": 0,
                    "actualCryptoAmount": 0,
                    "kycNeeded": 0,
                    "createdAt": "2024-12-06T11:24:59.000Z",
                    "updatedAt": "2024-12-06T12:06:14.000Z",
                    "status": 1,
                    "transactionHash": "",
                    "referenceId": null,
                    "chainId": 2,
                    "onRampFee": 1.2,
                    "gasFee": 0,
                    "clientFee": 0,
                    "gatewayFee": 3.11,
                    "merchantRecognitionId": "",
                    "paymentType": 2
        }
    ],
    "code": 200
}
</code></pre>

{% endtab %}
{% endtabs %}

**Note** -&#x20;

1. Transactions updated on or before "2022-11-09T16:58:07.000Z" UTC will have "2022-11-09T16:58:07.000Z" as the updatedAt field value. Transactions thereon will have the actual last updated timestamp.
2. For Status codes and its meaning, please to refer to [link](https://docs.onramp.money/onramp/response-codes/order-status-codes).

#### Sample Request

{% tabs %}
{% tab title="Nodejs" %}

```javascript
var CryptoJS = require('crypto-js');
var axios = require('axios');
async function getAllTransactions() {
  try {
    let body = {
      page: 1,
      pageSize: 50,
      since: '2022-10-07T22:29:51.999Z',
      order: 'DESC',  // ASC or DESC
      type: 1         // 1 -> onramp, 2 -> offramp
    }
    let payload = {
      timestamp: new Date().getTime(),
      body
    }
    let apiKey = 'API_KEY', apiSecret = 'API_SECRET';
    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp/api/v1/transaction/merchantHistory',
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
    let data = await axios(options)
    console.log(data?.data);
  } catch (error) {
    console.log(error?.response?.data)
  }
}
getAllTransactions();
```

{% endtab %}

{% tab title="Python" %}

```python
import json
import time
import base64
import hmac
import hashlib
import requests

def merchant_history():
    try:
        body = {
        'page': 1,
        'pageSize': 50,
        'since': '2022-10-07T22:29:51.999Z',
        'order': 'DESC',  # ASC or DESC
        'type': 1         # 1 -> onramp, 2 -> offramp
        }
        payload = {
            "timestamp": int(time.time() * 1000),  # to get timestamp in milliseconds
            "body": body
        }
        api_key = 'API_KEY'
        api_secret = 'API_SECRET'

        payload = base64.b64encode(json.dumps(payload).encode()).decode()
        signature = hmac.new(api_secret.encode(), payload.encode(), hashlib.sha512).hexdigest()
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'X-ONRAMP-SIGNATURE': signature,
            'X-ONRAMP-APIKEY': api_key,
            'X-ONRAMP-PAYLOAD': payload
        }
        url = 'https://api.onramp.money/onramp/api/v1/transaction/merchantHistory'
        response = requests.post(url, headers=headers, data=json.dumps(body))
        print(response.json())
    except Exception as e:
        print(str(e))

merchant_history()
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Response" %}

```json
// Onramp resopnse
{
   "status":1,
   "data":[
      {
         "orderId":338,
         "walletAddress":"0x72c6668306f1d89425e86899b7444a0c2e5f25cf",
         "coinId":54,
         "fiatType":1,
         "paymentType":1,
         "expectedPrice":87,
         "fiatAmount":250,
         "expectedCryptoAmount":2.61,
         "actualPrice":0,
         "actualCryptoAmount":2.87,
         "kycNeeded":0,
         "createdAt":"2022-10-07T22:29:52.000Z",
         "updatedAt":"2022-11-09T16:58:07.000Z",
         "status":5,
         "transactionHash":"0x0ba7ec6883efb0aj7c3cd746a5fe77e82a599efcf03350667d91av70126a2169",
         "referenceId":"228066179164",
         "chainId":3,
         "onRampFee":0.63,
         "gasFee":0.25,
         "clientFee":0,
         "gatewayFee":0,
         "merchantRecognitionId":"23"
      }
   ],
   "code":200
}

//Offramp response
{
   "status":1,
   "data":[
      {
         "orderId":517,
         "coinId":54,
         "chainId":3,
         "walletAddress":"0x9C85C3761E0721c759b8015AC22EfE066dbB73EC",
         "expectedPrice":86,
         "expectedQuantity":1115,
         "onrampFee":2.79,
         "clientFee":0,
         "gatewayFee":8.26,
         "tdsFee":11.12,
         "merchantRecognitionId":'23',
         "paymentType":1,
         "fiatType":1,
         "actualPrice":86,
         "actualQuantity":1115,
         "actualFiatAmount":94685.48,
         "createdAt":"2023-03-31T05:26:18.000Z",
         "updatedAt":"2023-03-31T05:27:16.000Z",
         "status":6,
         "transactionHash":"0xe1s635ef8c1386c30dcdc176d85294c457bceea87289193cc4fb6046f110a070"
      }
   ]
}
```

{% endtab %}

{% tab title="Explanation" %}
**Onramp Explanation**

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
  * 1 -> KYC needed to process this transaction\\

**Offramp Explanation** (additional fields)

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
  * 5,13,30,31,32,33,34,35,36 -> fiat withdrawal initiated to bank&#x20;
  * 6,14,40 -> fiat withdrawal processed.
  * 7,15,41 -> webhook sent
  * 17 -> provide alternate bank
  * 18 -> processing to alternate bank
  * 19 -> success

{% hint style="info" %}
**Note**:&#x20;

* If the **`pageSize`** parameter is not specified, the default number of records returned will be 50. The maximum number of records that can be retrieved per API call is 500.
* If webhooks are not enabled, transactions that complete successfully will be assigned a status code of either **4** or **15**.
  {% endhint %}
  {% endtab %}
  {% endtabs %}


# Order status

## Returns the order status of the transaction

<mark style="color:green;">`POST`</mark> `https://api.onramp.money/onramp/api/v2/common/transaction/orderStatus`

#### Headers

| Name                                                 | Type   | Description                         |
| ---------------------------------------------------- | ------ | ----------------------------------- |
| X-ONRAMP-APIKEY<mark style="color:red;">\*</mark>    | String | Your api key                        |
| X-ONRAMP-PAYLOAD<mark style="color:red;">\*</mark>   | String | payload generated for the request   |
| X-ONRAMP-SIGNATURE<mark style="color:red;">\*</mark> | String | signature generated for the request |

#### Request Body

| Name                                      | Type    | Description                           |
| ----------------------------------------- | ------- | ------------------------------------- |
| orderId<mark style="color:red;">\*</mark> | Integer | order id of the transaction           |
| type<mark style="color:red;">\*</mark>    | Integer | <p>1 -> Onramp</p><p>2 -> Offramp</p> |

{% tabs %}
{% tab title="200: OK " %}

```json
{
   "status":1,
   "code":200,
   "data":{
      "orderStatus":4
   }
}
```

{% endtab %}
{% endtabs %}

#### Sample Request

{% tabs %}
{% tab title="Nodejs" %}

```javascript
var CryptoJS = require('crypto-js');
var axios = require('axios');
async function orderStatus() {
  try {
    let body = {
      orderId: '89912',
      type: 1         // 1 -> onramp, 2 -> offramp
    }
    let payload = {
      timestamp: new Date().getTime(),
      body
    }
    let apiKey = 'API_KEY', apiSecret = 'API_SECRET';
    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp/api/v2/common/transaction/orderStatus',
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
    let data = await axios(options)
    console.log(data?.data);
  } catch (error) {
    console.log(error?.response?.data)
  }
}
orderStatus();
```

{% endtab %}

{% tab title="Python" %}

```python
import json
import time
import base64
import hmac
import hashlib
import requests

def order_status():
    try:
        body = {
            'orderId': '89912',
	    'type': 1
        }
        payload = {
            "timestamp": int(time.time() * 1000),  # to get timestamp in milliseconds
            "body": body
        }
        api_key = 'API_KEY'
        api_secret = 'API_SECRET'

        payload = base64.b64encode(json.dumps(payload).encode()).decode()
        signature = hmac.new(api_secret.encode(), payload.encode(), hashlib.sha512).hexdigest()
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'X-ONRAMP-SIGNATURE': signature,
            'X-ONRAMP-APIKEY': api_key,
            'X-ONRAMP-PAYLOAD': payload
        }
        url = 'https://api.onramp.money/onramp/api/v2/common/transaction/orderStatus'
        response = requests.post(url, headers=headers, data=json.dumps(body))
        print(response.json())
    except Exception as e:
        print(str(e))

order_status()
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Response" %}

```json
{
   "status":1,
   "code":200,
   "data":{
      "orderStatus":4
   }
}
```

{% endtab %}

{% tab title="Explanation" %}
**Onramp Explanation**

* status -> 0 is for unsuccessful request, 1 is for a successful one
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

**Offramp Explanation** (additional fields)

* status -> denotes the status of the order
  * -4 -> amount mismatch
  * -2 -> transaction abandoned.&#x20;
  * -1 -> transaction time out. &#x20;
  * 0 -> order created.&#x20;
  * 1 -> order confirmed i.e. hash generated. &#x20;
  * 2,10,11 -> hash found status.&#x20;
  * 3 -> over limit (If the user sends a quantity of cryptocurrency that exceeds their KYC limit, their funds will be withheld until reviewed manually).
  * 4,12 -> crypto sold.&#x20;
  * 5,13,30,31,32,33,34,35,36 -> fiat withdrawal initiated to bank&#x20;
  * 6,14,40 -> fiat withdrawal processed.
  * 7,15,41 -> webhook sent
  * 17 -> provide alternate bank
  * 18 -> processing to alternate bank
  * 19 -> success
    {% endtab %}
    {% endtabs %}


# All Config Mapping

{% hint style="info" %}
Note: Rate limit for this API is 10req/min.
{% endhint %}

## Returns the all Config mapping

<mark style="color:green;">`POST`</mark> `https://api.onramp.money/onramp/api/v2/common/transaction/allConfigMapping`

#### Headers

| Name                                                 | Type   | Description                         |
| ---------------------------------------------------- | ------ | ----------------------------------- |
| X-ONRAMP-APIKEY<mark style="color:red;">\*</mark>    | String | Your api key                        |
| X-ONRAMP-PAYLOAD<mark style="color:red;">\*</mark>   | String | payload generated for the request   |
| X-ONRAMP-SIGNATURE<mark style="color:red;">\*</mark> | String | signature generated for the request |

{% tabs %}
{% tab title="200: OK " %}

```json
{
    "status": 1,
    "code": 200,
    "data": {
        "fiatSymbolMapping": {
            "INR": 1,
            "TRY": 2,
            "AED": 3,
            "MXN": 4,
            "VND": 5,
            "NGN": 6,
            "BRL": 7,
            "PEN": 8,
        },
        "coinSymbolMapping": {
            "eth": "6",
            "usdt": "54",
            "matic": "83",
            "rage": 396,
            "gari": "460",
            "tlc": 536,
            "btc": "0",
            "neo": "2",
        },
        "chainSymbolMapping": {
            "erc20": 0,
            "bep20": 1,
            "trc20": 2,
            "matic20": 3,
            "spl": 4,
            "bep2": 5,
            "nep5": 7,
            "eos": 8,
            "klay": 9,
            "matic20-test": 10,
            "okc": 11,
            "wemix 3.0": 12,
            "arbitrum": 13,
            "energi": 21,
            "eth": 0,
            "bsc": 1,
            "trx": 2,
            "matic": 3,
            "sol": 4,
            "bnb": 5,
        }
    }
}
```

{% endtab %}
{% endtabs %}

#### Sample Request

{% tabs %}
{% tab title="Nodejs" %}

```javascript
var CryptoJS = require('crypto-js');
var axios = require('axios');
async function allConfigMapping() {
  try {
    let body = {}
    let payload = {
      timestamp: new Date().getTime(),
      body
    }
    let apiKey = 'API_KEY', apiSecret = 'API_SECRET';
    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp/api/v2/common/transaction/allConfigMapping',
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
    let data = await axios(options)
    console.log(data?.data);
  } catch (error) {
    console.log(error?.response?.data)
  }
}
allConfigMapping();
```

{% endtab %}

{% tab title="Python" %}

```python
import json
import requests
import hashlib
import hmac
from base64 import b64encode
from datetime import datetime

def all_config_mapping():
    try:
        body = {}
        payload = {
            "timestamp": int(datetime.now().timestamp() * 1000),
            "body": body
        }
        api_key = 'API_KEY'
        api_secret = 'API_SECRET'
        
        payload_base64 = b64encode(json.dumps(payload).encode()).decode()
        signature = hmac.new(api_secret.encode(), payload_base64.encode(), hashlib.sha512).hexdigest()

        url = 'https://api.onramp.money/onramp/api/v2/common/transaction/allConfigMapping'
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'X-ONRAMP-SIGNATURE': signature,
            'X-ONRAMP-APIKEY': api_key,
            'X-ONRAMP-PAYLOAD': payload_base64
        }
        
        options = {
            'url': url,
            'method': 'POST',
            'headers': headers,
            'json': body
        }
        
        response = requests.post(**options)
        print(response.json())
        
    except Exception as error:
        print(error)

all_config_mapping()
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
        "fiatSymbolMapping": {
            "INR": 1,
            "TRY": 2,
            "AED": 3,
            "MXN": 4,
            "VND": 5,
            "NGN": 6,
            "BRL": 7,
            "PEN": 8,
        },
        "coinSymbolMapping": {
            "eth": "6",
            "usdt": "54",
            "matic": "83",
            "rage": 396,
            "gari": "460",
            "tlc": 536,
            "btc": "0",
            "neo": "2",
        },
        "chainSymbolMapping": {
            "erc20": 0,
            "bep20": 1,
            "trc20": 2,
            "matic20": 3,
            "spl": 4,
            "bep2": 5,
            "nep5": 7,
            "eos": 8,
            "klay": 9,
            "matic20-test": 10,
            "okc": 11,
            "wemix 3.0": 12,
            "arbitrum": 13,
            "energi": 21,
            "eth": 0,
            "bsc": 1,
            "trx": 2,
            "matic": 3,
            "sol": 4,
            "bnb": 5,
        }
    }
}
```

{% endtab %}

{% tab title="Explanation" %}
**Onramp Explanation**

* status -> 0 is for unsuccessful request, 1 is for a successful one.
* fiatSymbolMapping -> json containing all fiatSymbol to fiatId mapping.
* coinSymbolMapping -> json containing all coinSymbol to coinId mapping.
* chainSymbolMapping -> json containing all chainSymbol to chainId mapping.
  {% endtab %}
  {% endtabs %}


# All Chain Mapping

{% hint style="info" %}
Note: Rate limit for this API is 10req/min.
{% endhint %}

## Returns the all Chain mapping

<mark style="color:green;">`POST`</mark> `https://api.onramp.money/onramp/api/v2/common/transaction/allChainMapping`

#### Headers

| Name                                                 | Type   | Description                         |
| ---------------------------------------------------- | ------ | ----------------------------------- |
| X-ONRAMP-APIKEY<mark style="color:red;">\*</mark>    | String | Your api key                        |
| X-ONRAMP-PAYLOAD<mark style="color:red;">\*</mark>   | String | payload generated for the request   |
| X-ONRAMP-SIGNATURE<mark style="color:red;">\*</mark> | String | signature generated for the request |

{% tabs %}
{% tab title="200: OK " %}

```json
{
        "status": 1,
        "code": 200,
        "data": {
            "allCoinConfig": {
                "usdc": {
                  "coinId": 116,
                  "coinName": "USD Coin",
                  "coinIcon": "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
                  "balanceFloatPlaces": 2,
                  "tradeFloatPlaces": 2,
                  "networks": [0,1,16],
                  "exchanges": {
                    "1": [0,1,3]
                    "2": [10446,10163,10013,10159,4,10431,0,10076,10042,16,13],
                    "5": [],
                    "10": [18]
                  },
                  "markets": {
                    "decimals": {
                      "usdt": 4,
                      "inr": 4
                    }
                  }
                },
                "usdt": {
                  "coinId": 54,
                  "coinName": "Tether",
                  "coinIcon": "https://onramp.money/assets/img/coinIcons/usdt.png",
                  "balanceFloatPlaces": 2,
                  "tradeFloatPlaces": 2,
                  "networks": [0,1,2,4,15],
                  "exchanges": {
                    "1": [0,1,3]
                    "2": [10446,10163,10013,10159,4,10431,0,10076,10042,16,13],
                    "5": [],
                    "10": [18]
                  },
                  "markets": {
                    "decimals": {
                      "usdt": 4,
                      "inr": 4
                    }
                  }
                }
            },
            "networkConfig": {
                "0": {
                    "chainSymbol": "erc20",
                    "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
                    "memoRegex": "",
                    "chainName": "Ethereum Network",
                    "networkId": 1,
                    "nativeToken": 6,
                    "startingWith": [
                        "0x"
                    ],
                    "hashLink": "https://etherscan.io/tx/",
                    "node": 6
                },
                "1": {
                    "chainSymbol": "bep20",
                    "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
                    "memoRegex": "",
                    "chainName": "Binance Smart Chain",
                    "networkId": 56,
                    "nativeToken": 72,
                    "startingWith": [
                        "0x"
                    ],
                    "hashLink": "https://bscscan.com/tx/",
                    "node": 110
                },
                "2": {
                    "chainSymbol": "trc20",
                    "addressRegex": "^T[1-9A-HJ-NP-Za-km-z]{33}$",
                    "memoRegex": "",
                    "chainName": "TRC20 Token Standard",
                    "networkId": -1,
                    "nativeToken": 16,
                    "startingWith": [
                        "T"
                    ],
                    "hashLink": "https://tronscan.org/#/transaction/",
                    "node": 16
                },
                "3": {
                    "chainSymbol": "matic20",
                    "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
                    "memoRegex": "",
                    "chainName": "Polygon Mainnet",
                    "networkId": 137,
                    "nativeToken": 83,
                    "startingWith": [
                        "0x"
                    ],
                    "hashLink": "https://polygonscan.com/tx/",
                    "node": 83
                },
                "4": {
                    "chainSymbol": "spl",
                    "addressRegex": "^[1-9A-HJ-NP-Za-km-z]{32,44}$",
                    "memoRegex": "",
                    "chainName": "Solana Program Library Network",
                    "networkId": -1,
                    "nativeToken": 138,
                    "hashLink": "https://explorer.solana.com/tx/",
                    "node": 138
                },
                "13": {
                    "chainSymbol": "arbitrum",
                    "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
                    "memoRegex": "",
                    "chainName": "Arbitrum",
                    "networkId": 42161,
                    "nativeToken": 6,
                    "startingWith": [
                        "0x"
                    ],
                    "hashLink": "https://arbiscan.io/tx/",
                    "node": 6
                },
                "15": {
                    "chainSymbol": "ton",
                    "chainName": "Ton",
                    "startingWith": [
                        ""
                    ],
                    "confirmations": 30,
                    "hashLink": "https://tonscan.org/tx/",
                    "node": 83,
                    "nativeToken": 529,
                    "networkId": -1
                }
            }
        }
    }
}
```

{% endtab %}
{% endtabs %}

#### Sample Request

{% tabs %}
{% tab title="Nodejs" %}

```javascript
var CryptoJS = require('crypto-js');
var axios = require('axios');
async function allConfigMapping() {
  try {
    let body = {}
    let payload = {
      timestamp: new Date().getTime(),
      body
    }
    let apiKey = 'API_KEY', apiSecret = 'API_SECRET';
    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp/api/v2/common/transaction/allChainMapping',
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
    let data = await axios(options)
    console.log(data?.data);
  } catch (error) {
    console.log(error?.response?.data)
  }
}
allConfigMapping();
```

{% endtab %}

{% tab title="Python" %}

```python
import json
import requests
import hashlib
import hmac
from base64 import b64encode
from datetime import datetime

def all_config_mapping():
    try:
        body = {}
        payload = {
            "timestamp": int(datetime.now().timestamp() * 1000),
            "body": body
        }
        api_key = 'API_KEY'
        api_secret = 'API_SECRET'
        
        payload_base64 = b64encode(json.dumps(payload).encode()).decode()
        signature = hmac.new(api_secret.encode(), payload_base64.encode(), hashlib.sha512).hexdigest()

        url = 'https://api.onramp.money/onramp/api/v2/common/transaction/allChainMapping'
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'X-ONRAMP-SIGNATURE': signature,
            'X-ONRAMP-APIKEY': api_key,
            'X-ONRAMP-PAYLOAD': payload_base64
        }
        
        options = {
            'url': url,
            'method': 'POST',
            'headers': headers,
            'json': body
        }
        
        response = requests.post(**options)
        print(response.json())
        
    except Exception as error:
        print(error)

all_config_mapping()
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
            "allCoinConfig": {
                "usdc": {
                  "coinId": 116,
                  "coinName": "USD Coin",
                  "coinIcon": "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
                  "balanceFloatPlaces": 2,
                  "tradeFloatPlaces": 2,
                  "networks": [0,1,16],
                  "exchanges": {
                    "1": [0,1,3]
                    "2": [10446,10163,10013,10159,4,10431,0,10076,10042,16,13],
                    "5": [],
                    "10": [18]
                  },
                  "markets": {
                    "decimals": {
                      "usdt": 4,
                      "inr": 4
                    }
                  }
                },
                "usdt": {
                  "coinId": 54,
                  "coinName": "Tether",
                  "coinIcon": "https://onramp.money/assets/img/coinIcons/usdt.png",
                  "balanceFloatPlaces": 2,
                  "tradeFloatPlaces": 2,
                  "networks": [0,1,2,4,15],
                  "exchanges": {
                    "1": [0,1,3]
                    "2": [10446,10163,10013,10159,4,10431,0,10076,10042,16,13],
                    "5": [],
                    "10": [18]
                  },
                  "markets": {
                    "decimals": {
                      "usdt": 4,
                      "inr": 4
                    }
                  }
                }
            },
            "networkConfig": {
                "0": {
                    "chainSymbol": "erc20",
                    "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
                    "memoRegex": "",
                    "chainName": "Ethereum Network",
                    "networkId": 1,
                    "nativeToken": 6,
                    "startingWith": [
                        "0x"
                    ],
                    "hashLink": "https://etherscan.io/tx/",
                    "node": 6
                },
                "1": {
                    "chainSymbol": "bep20",
                    "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
                    "memoRegex": "",
                    "chainName": "Binance Smart Chain",
                    "networkId": 56,
                    "nativeToken": 72,
                    "startingWith": [
                        "0x"
                    ],
                    "hashLink": "https://bscscan.com/tx/",
                    "node": 110
                },
                "2": {
                    "chainSymbol": "trc20",
                    "addressRegex": "^T[1-9A-HJ-NP-Za-km-z]{33}$",
                    "memoRegex": "",
                    "chainName": "TRC20 Token Standard",
                    "networkId": -1,
                    "nativeToken": 16,
                    "startingWith": [
                        "T"
                    ],
                    "hashLink": "https://tronscan.org/#/transaction/",
                    "node": 16
                },
                "3": {
                    "chainSymbol": "matic20",
                    "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
                    "memoRegex": "",
                    "chainName": "Polygon Mainnet",
                    "networkId": 137,
                    "nativeToken": 83,
                    "startingWith": [
                        "0x"
                    ],
                    "hashLink": "https://polygonscan.com/tx/",
                    "node": 83
                },
                "4": {
                    "chainSymbol": "spl",
                    "addressRegex": "^[1-9A-HJ-NP-Za-km-z]{32,44}$",
                    "memoRegex": "",
                    "chainName": "Solana Program Library Network",
                    "networkId": -1,
                    "nativeToken": 138,
                    "hashLink": "https://explorer.solana.com/tx/",
                    "node": 138
                },
                "13": {
                    "chainSymbol": "arbitrum",
                    "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
                    "memoRegex": "",
                    "chainName": "Arbitrum",
                    "networkId": 42161,
                    "nativeToken": 6,
                    "startingWith": [
                        "0x"
                    ],
                    "hashLink": "https://arbiscan.io/tx/",
                    "node": 6
                },
                "15": {
                    "chainSymbol": "ton",
                    "chainName": "Ton",
                    "startingWith": [
                        ""
                    ],
                    "confirmations": 30,
                    "hashLink": "https://tonscan.org/tx/",
                    "node": 83,
                    "nativeToken": 529,
                    "networkId": -1
                }
            }
        }
    }
}
```

{% endtab %}

{% tab title="Explanation" %}
**Onramp Explanation**

* status -> 0 is for unsuccessful request, 1 is for a successful one.
* data -> Network details based on the chainId. (Retrieve chainId from the allConfig API).
  {% endtab %}
  {% endtabs %}

# All Gas Fee Mapping

{% hint style="info" %}
Note: Rate limit for this API is 10req/min
{% endhint %}

## Returns the all Gas Fee mapping

<mark style="color:green;">`POST`</mark> `https://api.onramp.money/onramp/api/v2/common/transaction/allGasFee`

#### Headers

| Name                                                 | Type   | Description                         |
| ---------------------------------------------------- | ------ | ----------------------------------- |
| X-ONRAMP-APIKEY<mark style="color:red;">\*</mark>    | String | Your api key                        |
| X-ONRAMP-PAYLOAD<mark style="color:red;">\*</mark>   | String | payload generated for the request   |
| X-ONRAMP-SIGNATURE<mark style="color:red;">\*</mark> | String | signature generated for the request |

{% tabs %}
{% tab title="200: OK " %}

```json
{
    "status": 1,
    "code": 200,
    "data": {
        "0": {
            "0": {
                "withdrawalFee": "0.00019",
                "minimumWithdrawal": "0.00041800",
                "nodeInSync": 1,
                "depositEnable": 1
            },
            "1": {
                "withdrawalFee": "0.0000087",
                "minimumWithdrawal": "0.00001870",
                "nodeInSync": 1,
                "depositEnable": 1
            },
            "5": {
                "withdrawalFee": "0.0000036",
                "minimumWithdrawal": "0.00000792",
                "nodeInSync": 1,
                "depositEnable": 1
            },
            "10002": {
                "withdrawalFee": "0.00025",
                "minimumWithdrawal": "0.00088000",
                "nodeInSync": 1,
                "depositEnable": 1
            },
            "10004": {
                "withdrawalFee": "0.00062",
                "minimumWithdrawal": "0.00165000",
                "nodeInSync": 0,
                "depositEnable": 1
            },
            "10116": {
                "withdrawalFee": "0.00002",
                "minimumWithdrawal": "0.00090",
                "nodeInSync": 0,
                "depositEnable": 1
            },
            "10172": {
                "withdrawalFee": "0.0005",
                "minimumWithdrawal": "0.00138",
                "nodeInSync": 0,
                "depositEnable": 1
            }
        },
        "1": {
            "0": {
                "withdrawalFee": "15",
                "minimumWithdrawal": "33.00",
                "nodeInSync": 1,
                "depositEnable": 1
            },
            "1": {
                "withdrawalFee": "0.7",
                "minimumWithdrawal": "1.54",
                "nodeInSync": 1,
                "depositEnable": 1
            },
            "5": {
                "withdrawalFee": "0.29",
                "minimumWithdrawal": "0.64",
                "nodeInSync": 1,
                "depositEnable": 1
            },
            "10007": {
                "withdrawalFee": "0.2",
                "minimumWithdrawal": "16.50",
                "nodeInSync": 1,
                "depositEnable": 1
            }
        },
    }
}
```

{% endtab %}
{% endtabs %}

#### Sample Request

{% tabs %}
{% tab title="Nodejs" %}

```javascript
var CryptoJS = require('crypto-js');
var axios = require('axios');
async function allGasFeeMapping() {
  try {
    let body = {}
    let payload = {
      timestamp: new Date().getTime(),
      body
    }
    let apiKey = 'API_KEY', apiSecret = 'API_SECRET';
    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp/api/v2/common/transaction/allGasFee',
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
    let data = await axios(options)
    console.log(data?.data);
  } catch (error) {
    console.log(error?.response?.data)
  }
}
allGasFeeMapping();
```

{% endtab %}

{% tab title="Python" %}

```python
import json
import requests
import hashlib
import hmac
from base64 import b64encode
from datetime import datetime

async def all_gas_fee_mapping():
    try:
        body = {}
        payload = {
            "timestamp": int(datetime.now().timestamp() * 1000),
            "body": body
        }
        api_key = 'API_KEY'
        api_secret = 'API_SECRET'

        payload_base64 = b64encode(json.dumps(payload).encode()).decode()
        signature = hmac.new(api_secret.encode(), payload_base64.encode(), hashlib.sha512).hexdigest()

        url = 'https://api.onramp.money/onramp/api/v2/common/transaction/allGasFee'
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'X-ONRAMP-SIGNATURE': signature,
            'X-ONRAMP-APIKEY': api_key,
            'X-ONRAMP-PAYLOAD': payload_base64
        }

        options = {
            'url': url,
            'method': 'POST',
            'headers': headers,
            'json': body
        }

        response = await requests.post(**options)
        print(response.json())

    except Exception as error:
        print(error)

await all_gas_fee_mapping()
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
        "0": {
            "0": {
                "withdrawalFee": "0.00019",
                "minimumWithdrawal": "0.00041800",
                "nodeInSync": 1,
                "depositEnable": 1
            },
            "1": {
                "withdrawalFee": "0.0000087",
                "minimumWithdrawal": "0.00001870",
                "nodeInSync": 1,
                "depositEnable": 1
            },
            "5": {
                "withdrawalFee": "0.0000036",
                "minimumWithdrawal": "0.00000792",
                "nodeInSync": 1,
                "depositEnable": 1
            },
            "10002": {
                "withdrawalFee": "0.00025",
                "minimumWithdrawal": "0.00088000",
                "nodeInSync": 1,
                "depositEnable": 1
            },
            "10004": {
                "withdrawalFee": "0.00062",
                "minimumWithdrawal": "0.00165000",
                "nodeInSync": 0,
                "depositEnable": 1
            },
            "10116": {
                "withdrawalFee": "0.00002",
                "minimumWithdrawal": "0.00090",
                "nodeInSync": 0,
                "depositEnable": 1
            },
            "10172": {
                "withdrawalFee": "0.0005",
                "minimumWithdrawal": "0.00138",
                "nodeInSync": 0,
                "depositEnable": 1
            }
        },
        "1": {
            "0": {
                "withdrawalFee": "15",
                "minimumWithdrawal": "33.00",
                "nodeInSync": 1,
                "depositEnable": 1
            },
            "1": {
                "withdrawalFee": "0.7",
                "minimumWithdrawal": "1.54",
                "nodeInSync": 1,
                "depositEnable": 1
            },
            "5": {
                "withdrawalFee": "0.29",
                "minimumWithdrawal": "0.64",
                "nodeInSync": 1,
                "depositEnable": 1
            },
            "10007": {
                "withdrawalFee": "0.2",
                "minimumWithdrawal": "16.50",
                "nodeInSync": 1,
                "depositEnable": 1
            }
        },
    }
}
```

{% endtab %}

{% tab title="Explanation" %}
**Onramp Explanation**

* status -> 0 is for unsuccessful request, 1 is for a successful one.
* data -> JSON with gasFee mapping will follow the structure (coinId: {chainId: {withdrawalFee, minimumWithdrawal, nodeInSync, depositEnable}}).\
  This is the same coinId/chainId returned from allConfigMapping API.
  {% endtab %}
  {% endtabs %}


# Limits Mapping

{% hint style="info" %}
Note: Rate limit for this API is 10req/min
{% endhint %}

## Returns the all Config mapping

<mark style="color:green;">`POST`</mark> `https://api.onramp.money/onramp/api/v2/common/transaction/limits`

#### Headers

| Name                                                 | Type   | Description                         |
| ---------------------------------------------------- | ------ | ----------------------------------- |
| X-ONRAMP-APIKEY<mark style="color:red;">\*</mark>    | String | Your api key                        |
| X-ONRAMP-PAYLOAD<mark style="color:red;">\*</mark>   | String | payload generated for the request   |
| X-ONRAMP-SIGNATURE<mark style="color:red;">\*</mark> | String | signature generated for the request |

#### Request Body

| Name                                   | Type   | Description                                     |
| -------------------------------------- | ------ | ----------------------------------------------- |
| type<mark style="color:red;">\*</mark> | String | <p>1 -> onramp<br>2 -> offramp<br>3 -> both</p> |

{% tabs %}
{% tab title="200: OK " %}

```json
{
    "status": 1,
    "code": 200,
    "data": {
        "onramp": {
            "1": {
                "min": 100,
                "max": 500000
            },
            "2": {
                "min": 300,
                "max": 50000
            },
            "3": {
                "min": 50,
                "max": 75000
            },
            "4": {
                "min": 200,
                "max": 500000
            },
            "5": {
                "min": 300000,
                "max": 450000000
            },
            "6": {
                "min": 5000,
                "max": 2000000
            },
            "7": {
                "min": 55,
                "max": 50000
            },
            "8": {
                "min": 19,
                "max": 45000
            },
            "9": {
                "min": 20000,
                "max": 41000000
            },
            "10": {
                "min": 5000,
                "max": 8000000
            },
            "12": {
                "min": 12,
                "max": 8000000
            },
            "14": {
                "min": 160000,
                "max": 1000000000
            }
        }
    }
}
```

{% endtab %}
{% endtabs %}

#### Sample Request

{% tabs %}
{% tab title="Nodejs" %}

```javascript
var CryptoJS = require('crypto-js');
var axios = require('axios');
async function allLimitsMapping() {
  try {
    let body = {
      type: 1
    }
    let payload = {
      timestamp: new Date().getTime(),
      body
    }
    let apiKey = 'API_KEY', apiSecret = 'API_SECRET';
    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp/api/v2/common/transaction/limits',
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
    let data = await axios(options)
    console.log(data?.data);
  } catch (error) {
    console.log(error?.response?.data)
  }
}
allLimitsMapping();
```

{% endtab %}

{% tab title="Python" %}

```python
import json
import requests
import hashlib
import hmac
from base64 import b64encode
from datetime import datetime

async def all_limits_mapping():
    try:
        body = {
          type: 1
        }
        payload = {
            "timestamp": int(datetime.now().timestamp() * 1000),
            "body": body
        }
        api_key = 'API_KEY'
        api_secret = 'API_SECRET'

        payload_base64 = b64encode(json.dumps(payload).encode()).decode()
        signature = hmac.new(api_secret.encode(), payload_base64.encode(), hashlib.sha512).hexdigest()

        url = 'https://api.onramp.money/onramp/api/v2/common/transaction/limits'
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'X-ONRAMP-SIGNATURE': signature,
            'X-ONRAMP-APIKEY': api_key,
            'X-ONRAMP-PAYLOAD': payload_base64
        }

        options = {
            'url': url,
            'method': 'POST',
            'headers': headers,
            'json': body
        }

        response = await requests.post(**options)
        print(response.json())

    except Exception as error:
        print(error)

await all_limits_mapping()
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
        "onramp": {
            "1": {
                "min": 100,
                "max": 500000
            },
            "2": {
                "min": 300,
                "max": 50000
            },
            "3": {
                "min": 50,
                "max": 75000
            },
            "4": {
                "min": 200,
                "max": 500000
            },
            "5": {
                "min": 300000,
                "max": 450000000
            },
            "6": {
                "min": 5000,
                "max": 2000000
            },
            "7": {
                "min": 55,
                "max": 50000
            },
            "8": {
                "min": 19,
                "max": 45000
            },
            "9": {
                "min": 20000,
                "max": 41000000
            },
            "10": {
                "min": 5000,
                "max": 8000000
            },
            "12": {
                "min": 12,
                "max": 8000000
            },
            "14": {
                "min": 160000,
                "max": 1000000000
            }
        }
    }
}
```

{% endtab %}

{% tab title="Explanation" %}
**Onramp Explanation**

* status -> 0 is for unsuccessful request, 1 is for a successful one.
* data -> json containing onramp, offramp limits mapping.
  {% endtab %}
  {% endtabs %}


# Coin limits mapping

{% hint style="info" %}
Note: Rate limit for this API is 10req/min
{% endhint %}

## Returns the all coin limits mapping

<mark style="color:green;">`POST`</mark> `https://api.onramp.money/onramp/api/v2/common/transaction/allCoinLimits`

#### Headers

| Name                                                 | Type   | Description                         |
| ---------------------------------------------------- | ------ | ----------------------------------- |
| X-ONRAMP-APIKEY<mark style="color:red;">\*</mark>    | String | Your api key                        |
| X-ONRAMP-PAYLOAD<mark style="color:red;">\*</mark>   | String | payload generated for the request   |
| X-ONRAMP-SIGNATURE<mark style="color:red;">\*</mark> | String | signature generated for the request |

#### Request Body

| Name                                       | Type   | Description                                        |
| ------------------------------------------ | ------ | -------------------------------------------------- |
| fiatType<mark style="color:red;">\*</mark> | String | fiatType as returned from the all Config endpoint. |

{% tabs %}
{% tab title="200: OK " %}

```json
{
    "status": 1,
    "code": 200,
    "data": {
        "0": { // coinId 
            "0": 2123.14, // chainId: fiatAmountLimit
            "1": 182,
            "5": 182,
            "10002": 4423.22,
            "10004": 4423.22,
            "10116": 3619,
            "10168": 182,
            "10174": 5549.13
        },
        "1": {
            "0": 2112.28,
            "1": 182,
            "5": 182,
            "10007": 990.13
        },
        "2": {
            "10008": 1250.62,
            "10009": 1250.62,
            "10175": 1250.62
        },
        "3": {
            "10008": 795.77,
            "10009": 182,
            "10175": 578.74
        },
        "4": {
            "1": 182,
            "10010": 329.08
        },
        "5": {
            "10011": 182,
            "10176": 182
        },
        "6": {
            "0": 2388.42,
            "1": 182,
            "2": 586.25,
            "3": 100,
            "5": 182,
            "13": 191.07,
            "16": 1365,
            "17": 1365,
            "18": 1365,
            "19": 1365,
            "20": 1365,
            "21": 1365,
            "10013": 238.84,
            "10116": 2453.56,
            "10169": 238.84,
            "10171": 238.84,
            "10173": 2496.98
        },
        "10": {
            "1": 182,
            "5": 182,
            "10014": 182
        },
        "13": {
            "1": 182,
            "5": 182,
            "10017": 791.82
        },
        "14": {
            "0": 2167.59,
            "1": 182,
            "5": 182,
            "10018": 182,
            "10177": 182
        },
        "15": {
            "10019": 182
        },
        "16": {
            "0": 2163.03,
            "1": 182,
            "2": 182,
            "5": 182
        },
        "18": {
            "1": 182,
            "5": 182,
            "10008": 182,
            "10021": 182
        },
        "19": {
            "1": 182,
            "10022": 182
        },
        "20": {
            "1": 182,
            "5": 182,
            "8": 182
        },
        "22": {
            "10024": 182
        },
        "24": {
            "1": 182,
            "5": 182,
            "10025": 420.42
        },
        "26": {
            "10026": 182
        },
        "27": {
            "1": 182,
            "10027": 182
        },
        "28": {
            "0": 2177.72
        },
        "29": {
            "0": 2153.21
        },
        "32": {
            "0": 2161.28
        },
        "34": {
            "0": 2772.89,
            "1": 182,
            "10028": 182
        },
        "35": {
            "10029": 182
        },
        "37": {
            "10179": 182
        },
        "40": {
            "0": 2103.79,
            "1": 182
        },
        "42": {
            "0": 2212.29,
            "1": 182
        },
        "43": {
            "0": 2094,
            "3": 182
        },
        "46": {
            "0": 2112
        },
        "50": {
            "0": 2164.11
        },
        "51": {
            "10033": 182
        },
        "52": {
            "0": 2143.2,
            "1": 182,
            "10180": 182
        },
        "53": {
            "0": 1604.31
        },
        "54": {
            "0": 5005,
            "1": 182,
            "2": 1001,
            "3": 100,
            "4": 200.2,
            "5": 1001,
            "8": 1001,
            "10": 100,
            "11": 100.1,
            "13": 1001,
            "10013": 1001,
            "10039": 1001,
            "10042": 1001,
            "10046": 1092,
            "10076": 5005,
            "10116": 182,
            "10163": 1001,
            "10181": 391.3,
            "10208": 1001
        },
    }
}
```

{% endtab %}
{% endtabs %}

#### Sample Request

{% tabs %}
{% tab title="Nodejs" %}

```javascript
var CryptoJS = require('crypto-js');
var axios = require('axios');
async function allLimitsMapping() {
  try {
    let body = {
      fiatType: 1
    }
    let payload = {
      timestamp: new Date().getTime(),
      body
    }
    let apiKey = 'API_KEY', apiSecret = 'API_SECRET';
    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp/api/v2/common/transaction/allCoinLimits',
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
    let data = await axios(options)
    console.log(data?.data);
  } catch (error) {
    console.log(error?.response?.data)
  }
}
allLimitsMapping();
```

{% endtab %}

{% tab title="Python" %}

```python
import json
import requests
import hashlib
import hmac
from base64 import b64encode
from datetime import datetime

async def all_limits_mapping():
    try:
        body = {
          fiatType: 1
        }
        payload = {
            "timestamp": int(datetime.now().timestamp() * 1000),
            "body": body
        }
        api_key = 'API_KEY'
        api_secret = 'API_SECRET'

        payload_base64 = b64encode(json.dumps(payload).encode()).decode()
        signature = hmac.new(api_secret.encode(), payload_base64.encode(), hashlib.sha512).hexdigest()

        url = 'https://api.onramp.money/onramp/api/v2/common/transaction/allCoinLimits'
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'X-ONRAMP-SIGNATURE': signature,
            'X-ONRAMP-APIKEY': api_key,
            'X-ONRAMP-PAYLOAD': payload_base64
        }

        options = {
            'url': url,
            'method': 'POST',
            'headers': headers,
            'json': body
        }

        response = await requests.post(**options)
        print(response.json())

    except Exception as error:
        print(error)

await all_limits_mapping()
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
        "0": {
            "0": 2123.14,
            "1": 182,
            "5": 182,
            "10002": 4423.22,
            "10004": 4423.22,
            "10116": 3619,
            "10168": 182,
            "10174": 5549.13
        },
        "1": {
            "0": 2112.28,
            "1": 182,
            "5": 182,
            "10007": 990.13
        },
        "2": {
            "10008": 1250.62,
            "10009": 1250.62,
            "10175": 1250.62
        },
        "3": {
            "10008": 795.77,
            "10009": 182,
            "10175": 578.74
        },
        "4": {
            "1": 182,
            "10010": 329.08
        },
        "5": {
            "10011": 182,
            "10176": 182
        },
        "6": {
            "0": 2388.42,
            "1": 182,
            "2": 586.25,
            "3": 100,
            "5": 182,
            "13": 191.07,
            "16": 1365,
            "17": 1365,
            "18": 1365,
            "19": 1365,
            "20": 1365,
            "21": 1365,
            "10013": 238.84,
            "10116": 2453.56,
            "10169": 238.84,
            "10171": 238.84,
            "10173": 2496.98
        },
        "10": {
            "1": 182,
            "5": 182,
            "10014": 182
        },
        "13": {
            "1": 182,
            "5": 182,
            "10017": 791.82
        },
        "14": {
            "0": 2167.59,
            "1": 182,
            "5": 182,
            "10018": 182,
            "10177": 182
        },
        "15": {
            "10019": 182
        },
        "16": {
            "0": 2163.03,
            "1": 182,
            "2": 182,
            "5": 182
        },
        "18": {
            "1": 182,
            "5": 182,
            "10008": 182,
            "10021": 182
        },
        "19": {
            "1": 182,
            "10022": 182
        },
        "20": {
            "1": 182,
            "5": 182,
            "8": 182
        },
        "22": {
            "10024": 182
        },
        "24": {
            "1": 182,
            "5": 182,
            "10025": 420.42
        },
        "26": {
            "10026": 182
        },
        "27": {
            "1": 182,
            "10027": 182
        },
        "28": {
            "0": 2177.72
        },
        "29": {
            "0": 2153.21
        },
        "32": {
            "0": 2161.28
        },
        "34": {
            "0": 2772.89,
            "1": 182,
            "10028": 182
        },
        "35": {
            "10029": 182
        },
        "37": {
            "10179": 182
        },
        "40": {
            "0": 2103.79,
            "1": 182
        },
        "42": {
            "0": 2212.29,
            "1": 182
        },
        "43": {
            "0": 2094,
            "3": 182
        },
        "46": {
            "0": 2112
        },
        "50": {
            "0": 2164.11
        },
        "51": {
            "10033": 182
        },
        "52": {
            "0": 2143.2,
            "1": 182,
            "10180": 182
        },
        "53": {
            "0": 1604.31
        },
        "54": {
            "0": 5005,
            "1": 182,
            "2": 1001,
            "3": 100,
            "4": 200.2,
            "5": 1001,
            "8": 1001,
            "10": 100,
            "11": 100.1,
            "13": 1001,
            "10013": 1001,
            "10039": 1001,
            "10042": 1001,
            "10046": 1092,
            "10076": 5005,
            "10116": 182,
            "10163": 1001,
            "10181": 391.3,
            "10208": 1001
        },
    }
}
```

{% endtab %}

{% tab title="Explanation" %}
**Onramp Explanation**

* status -> 0 is for unsuccessful request, 1 is for a successful one.
* data -> JSON that encompasses a mapping of coin limits. The JSON structure adheres to the format: {coinId: {chainId: {}}}.
  {% endtab %}
  {% endtabs %}


# All Country Configuration

{% hint style="info" %}
Note: Rate limit for this API is 10req/min
{% endhint %}

## Returns the all country configuration

<mark style="color:green;">`GET`</mark> `https://api.onramp.money/onramp/api/v2/common/public/fetchAllCountryConfig`

#### Headers

| Name                                                 | Type   | Description                         |
| ---------------------------------------------------- | ------ | ----------------------------------- |
| X-ONRAMP-APIKEY<mark style="color:red;">\*</mark>    | String | Your api key                        |
| X-ONRAMP-PAYLOAD<mark style="color:red;">\*</mark>   | String | payload generated for the request   |
| X-ONRAMP-SIGNATURE<mark style="color:red;">\*</mark> | String | signature generated for the request |

{% tabs %}
{% tab title="200: OK " %}

```json
{
  "status": 1,
  "code": 200,
  "data": {
    "buy": {
      "1": {
        "isActive": 1,
        "paymentMethods": {
          "UPI": 1,
          "IMPS": 2
        }
      },
      "2": {
        "isActive": 1,
        "paymentMethods": {
          "TRY_BANK_TRANSFER": 2
        }
      },
      "3": {
        "isActive": 1,
        "paymentMethods": {
          "AED-BANK-TRANSFER": 2
        }
      },
      "4": {
        "isActive": 0,
        "paymentMethods": {
          "SPEI": 2
        }
      },
      "5": {
        "isActive": 1,
        "paymentMethods": {
          "VIET-QR": 1
        }
      },
      "6": {
        "isActive": 1,
        "paymentMethods": {
          "NG-BANK-TRANSFER": 2
        }
      },
      "7": {
        "isActive": 1,
        "paymentMethods": {
          "PIX": 2
        }
      },
      "8": {
        "isActive": 1,
        "paymentMethods": {
          "WIREPE-INTERBANK": 2
        }
      },
      "9": {
        "isActive": 0,
        "paymentMethods": {
          "PALOMMA": 1
        }
      },
      "10": {
        "isActive": 1,
        "paymentMethods": {
          "KHIPU": 1
        }
      },
      "11": {
        "isActive": 0,
        "paymentMethods": {}
      },
      "12": {
        "isActive": 1,
        "paymentMethods": {
          "SEPA_BANK_TRANSFER": 2
        }
      },
      "14": {
        "isActive": 1,
        "paymentMethods": {
          "IDR_BANK_TRANSFER": 2
        }
      },
      "15": {
        "isActive": 0,
        "paymentMethods": {
          "MPESA_PAYBILL": 2
        }
      },
      "16": {
        "isActive": 1,
        "paymentMethods": {}
      },
      "17": {
        "isActive": 0,
        "paymentMethods": {
          "ZAR-BANK-TRANSFER": 2
        }
      },
      "18": {
        "isActive": 0,
        "paymentMethods": {}
      },
      "19": {
        "isActive": 0,
        "paymentMethods": {}
      },
      "21": {
        "isActive": 1,
        "paymentMethods": {}
      },
      "27": {
        "isActive": 1,
        "paymentMethods": {
          "THAI_QR": 1
        }
      },
      "28": {
        "isActive": 0,
        "paymentMethods": {
          "MY-BANK-TRANSFER": 2
        }
      },
      "29": {
        "isActive": 1,
        "paymentMethods": {
          "WIREAR": 1
        }
      },
    },
    "sell": {
      "1": {
        "isActive": 1,
        "paymentMethods": {
          "IMPS": 2
        }
      },
      "2": {
        "isActive": 1,
        "paymentMethods": {
          "TRY_BANK_TRANSFER": 2
        }
      },
      "3": {
        "isActive": 0,
        "paymentMethods": {
          "AED-BANK-TRANSFER": 2
        }
      },
      "4": {
        "isActive": 1,
        "paymentMethods": {
          "SPEI": 2
        }
      },
      "5": {
        "isActive": 0,
        "paymentMethods": {}
      },
      "6": {
        "isActive": 1,
        "paymentMethods": {
          "NG-BANK-TRANSFER": 2
        }
      },
      "7": {
        "isActive": 1,
        "paymentMethods": {}
      },
      "8": {
        "isActive": 1,
        "paymentMethods": {
          "PERU_BANK_TRANSFER": 2
        }
      },
      "9": {
        "isActive": 1,
        "paymentMethods": {
          "COLOMBIA_BANK_TRANSFER": 2
        }
      },
      "10": {
        "isActive": 1,
        "paymentMethods": {
          "CHILE_BANK_TRANSFER": 2
        }
      },
      "11": {
        "isActive": 1,
        "paymentMethods": {
          "PHP_BANK_TRANSFER": 2
        }
      },
      "12": {
        "isActive": 1,
        "paymentMethods": {
          "SEPA_BANK_TRANSFER": 2
        }
      },
      "14": {
        "isActive": 1,
        "paymentMethods": {
          "IDR_BANK_TRANSFER": 2
        }
      },
      "15": {
        "isActive": 0,
        "paymentMethods": {}
      },
      "16": {
        "isActive": 0,
        "paymentMethods": {}
      },
      "17": {
        "isActive": 0,
        "paymentMethods": {}
      },
      "18": {
        "isActive": 0,
        "paymentMethods": {}
      }
    }
  }
}
```

{% endtab %}
{% endtabs %}

#### Sample Request

{% tabs %}
{% tab title="Nodejs" %}

```javascript
var CryptoJS = require('crypto-js');
var axios = require('axios');
async function allCountryConfig() {
  try {
    let body = {
    }
    let payload = {
      timestamp: new Date().getTime(),
      body
    }
    let apiKey = 'API_KEY', apiSecret = 'API_SECRET';
    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp/api/v2/common/public/fetchAllCountryConfig',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'X-ONRAMP-SIGNATURE': signature,
        'X-ONRAMP-APIKEY': apiKey,
        'X-ONRAMP-PAYLOAD': payload
      },
      data: body
    };
    let data = await axios(options)
    console.log(data?.data);
  } catch (error) {
    console.log(error?.response?.data)
  }
}
allCountryConfig();
```

{% endtab %}

{% tab title="Python" %}

```python
import json
import requests
import hashlib
import hmac
from base64 import b64encode
from datetime import datetime

async def all_country_config():
    try:
        body = {
        }
        payload = {
            "timestamp": int(datetime.now().timestamp() * 1000),
            "body": body
        }
        api_key = 'API_KEY'
        api_secret = 'API_SECRET'

        payload_base64 = b64encode(json.dumps(payload).encode()).decode()
        signature = hmac.new(api_secret.encode(), payload_base64.encode(), hashlib.sha512).hexdigest()

        url = 'https://api.onramp.money/onramp/api/v2/common/public/fetchAllCountryConfig'
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'X-ONRAMP-SIGNATURE': signature,
            'X-ONRAMP-APIKEY': api_key,
            'X-ONRAMP-PAYLOAD': payload_base64
        }

        options = {
            'url': url,
            'method': 'GET',
            'headers': headers,
            'json': body
        }

        response = await requests.post(**options)
        print(response.json())

    except Exception as error:
        print(error)

await all_country_config()
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
    "buy": {
      "1": {
        "isActive": 1,
        "paymentMethods": {
          "UPI": 1,
          "IMPS": 2
        }
      },
      "2": {
        "isActive": 1,
        "paymentMethods": {
          "TRY_BANK_TRANSFER": 2
        }
      },
      "3": {
        "isActive": 1,
        "paymentMethods": {
          "AED-BANK-TRANSFER": 2
        }
      },
      "4": {
        "isActive": 0,
        "paymentMethods": {
          "SPEI": 2
        }
      },
      "5": {
        "isActive": 1,
        "paymentMethods": {
          "VIET-QR": 1
        }
      },
      "6": {
        "isActive": 1,
        "paymentMethods": {
          "NG-BANK-TRANSFER": 2
        }
      },
      "7": {
        "isActive": 1,
        "paymentMethods": {
          "PIX": 2
        }
      },
      "8": {
        "isActive": 1,
        "paymentMethods": {
          "WIREPE-INTERBANK": 2
        }
      },
      "9": {
        "isActive": 0,
        "paymentMethods": {
          "PALOMMA": 1
        }
      },
      "10": {
        "isActive": 1,
        "paymentMethods": {
          "KHIPU": 1
        }
      },
      "11": {
        "isActive": 0,
        "paymentMethods": {}
      },
      "12": {
        "isActive": 1,
        "paymentMethods": {
          "SEPA_BANK_TRANSFER": 2
        }
      },
      "14": {
        "isActive": 1,
        "paymentMethods": {
          "IDR_BANK_TRANSFER": 2
        }
      },
      "15": {
        "isActive": 0,
        "paymentMethods": {
          "MPESA_PAYBILL": 2
        }
      },
      "16": {
        "isActive": 1,
        "paymentMethods": {}
      },
      "17": {
        "isActive": 0,
        "paymentMethods": {
          "ZAR-BANK-TRANSFER": 2
        }
      },
      "18": {
        "isActive": 0,
        "paymentMethods": {}
      },
      "19": {
        "isActive": 0,
        "paymentMethods": {}
      },
      "21": {
        "isActive": 1,
        "paymentMethods": {}
      },
      "27": {
        "isActive": 1,
        "paymentMethods": {
          "THAI_QR": 1
        }
      },
      "28": {
        "isActive": 0,
        "paymentMethods": {
          "MY-BANK-TRANSFER": 2
        }
      },
      "29": {
        "isActive": 1,
        "paymentMethods": {
          "WIREAR": 1
        }
      },
    },
    "sell": {
      "1": {
        "isActive": 1,
        "paymentMethods": {
          "IMPS": 2
        }
      },
      "2": {
        "isActive": 1,
        "paymentMethods": {
          "TRY_BANK_TRANSFER": 2
        }
      },
      "3": {
        "isActive": 0,
        "paymentMethods": {
          "AED-BANK-TRANSFER": 2
        }
      },
      "4": {
        "isActive": 1,
        "paymentMethods": {
          "SPEI": 2
        }
      },
      "5": {
        "isActive": 0,
        "paymentMethods": {}
      },
      "6": {
        "isActive": 1,
        "paymentMethods": {
          "NG-BANK-TRANSFER": 2
        }
      },
      "7": {
        "isActive": 1,
        "paymentMethods": {}
      },
      "8": {
        "isActive": 1,
        "paymentMethods": {
          "PERU_BANK_TRANSFER": 2
        }
      },
      "9": {
        "isActive": 1,
        "paymentMethods": {
          "COLOMBIA_BANK_TRANSFER": 2
        }
      },
      "10": {
        "isActive": 1,
        "paymentMethods": {
          "CHILE_BANK_TRANSFER": 2
        }
      },
      "11": {
        "isActive": 1,
        "paymentMethods": {
          "PHP_BANK_TRANSFER": 2
        }
      },
      "12": {
        "isActive": 1,
        "paymentMethods": {
          "SEPA_BANK_TRANSFER": 2
        }
      },
      "14": {
        "isActive": 1,
        "paymentMethods": {
          "IDR_BANK_TRANSFER": 2
        }
      },
      "15": {
        "isActive": 0,
        "paymentMethods": {}
      },
      "16": {
        "isActive": 0,
        "paymentMethods": {}
      },
      "17": {
        "isActive": 0,
        "paymentMethods": {}
      },
      "18": {
        "isActive": 0,
        "paymentMethods": {}
      }
    }
  }
}
```

{% endtab %}

{% tab title="Explanation" %}
**Onramp Explanation**

* **status** -> 0: Unsuccessful request, 1: Successful request.
* **data** -> JSON containing available payment methods for **buy** and **sell** options, structured by region and activity status.
  * **buy**: A mapping of active payment options for purchasing, identified by a unique region ID (e.g., `1`, `2`, `3`), where:
    * **isActive**: Indicates if the payment method is active (1) or inactive (0).
    * **paymentMethods**: A mapping of payment methods available for that region, with each method represented by a string (e.g., `UPI`, `IMPS`).
  * **sell**: A mapping of active payment options for selling, structured similarly to **buy**:
    * **isActive**: Indicates whether the selling option is active (1) or inactive (0).
    * **paymentMethods**: A mapping of supported selling payment methods (e.g., `IMPS`, `TRY_BANK_TRANSFER`).
      {% endtab %}
      {% endtabs %}


# Set/Update Webhook URL

{% hint style="info" %}
**Your webhook URL must be a server endpoint that accepts HTTP POST requests. This is essential, as webhook events are delivered via POST.**
{% endhint %}

<mark style="color:green;">`POST`</mark> `https://api.onramp.money/onramp/api/v1/merchant/setWebhookUrl`

#### Headers

| Name                                                 | Type   | Description                         |
| ---------------------------------------------------- | ------ | ----------------------------------- |
| X-ONRAMP-APIKEY<mark style="color:red;">\*</mark>    | String | Your api key                        |
| X-ONRAMP-PAYLOAD<mark style="color:red;">\*</mark>   | String | payload generated for the request   |
| X-ONRAMP-SIGNATURE<mark style="color:red;">\*</mark> | String | signature generated for the request |

#### Request Body

| Name                                         | Type   | Description      |
| -------------------------------------------- | ------ | ---------------- |
| webhookUrl<mark style="color:red;">\*</mark> | String | Your webhook url |

{% tabs %}
{% tab title="200: OK " %}

```json
{
  status: 1,
  code: 200,
  data: 'Webhook url set to https://yourWebhookUrl.com'
}
```

{% endtab %}
{% endtabs %}

#### Sample Request

{% tabs %}
{% tab title="Nodejs" %}

```javascript
var CryptoJS = require('crypto-js');
var axios = require('axios');
async function main() {
  try {
    let body = {
      webhookUrl: 'https://yourWebhookUrl.com'
    }
    let payload = {
      timestamp: new Date().getTime(),
      body
    }
    let apiKey = 'API_KEY', apiSecret = 'API_SECRET';
    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp/api/v1/merchant/setWebhookUrl',
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
    let data = await axios(options)
    console.log(data?.data);
  } catch (error) {
    console.log(error?.response?.data)
  }
}
main();
```

{% endtab %}

{% tab title="Python" %}

```python
import json
import time
import base64
import hmac
import hashlib
import requests

def set_webhook_url():
    try:
        body = {
            'webhookUrl': 'https://yourWebhookUrl.com'
        }
        payload = {
            "timestamp": int(time.time() * 1000),  # to get timestamp in milliseconds
            "body": body
        }
        api_key = 'API_KEY'
        api_secret = 'API_SECRET'

        payload = base64.b64encode(json.dumps(payload).encode()).decode()
        signature = hmac.new(api_secret.encode(), payload.encode(), hashlib.sha512).hexdigest()
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'X-ONRAMP-SIGNATURE': signature,
            'X-ONRAMP-APIKEY': api_key,
            'X-ONRAMP-PAYLOAD': payload
        }
        url = 'https://api.onramp.money/onramp/api/v1/merchant/setWebhookUrl'
        response = requests.post(url, headers=headers, data=json.dumps(body))
        print(response.json())
    except Exception as e:
        print(str(e))

set_webhook_url()
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Response" %}

```json
{
  status: 1,
  code: 200,
  data: 'Webhook url set to https://yourWebhookUrl.com'
}
```

{% endtab %}

{% tab title="Explanation" %}

* status -> 0 is for unsuccessful request, 1 is for a successful one
* code -> Provides more specific information about the status of the webhook update request. Below are some possible values and their meanings:
  * 200 -> Webhook was successfully updated.&#x20;
  * 400 -> A required parameter is missing in the request.
  * 500 -> Onramp.money servers are currently down; please try again later
    {% endtab %}
    {% endtabs %}

# Resend Webhook

This endpoint allows you to resend a webhook to your server

<mark style="color:green;">`POST`</mark> `https://api.onramp.money/onramp/api/v1/merchant/resendWebhook`

#### Headers

| Name                                                 | Type   | Description                         |
| ---------------------------------------------------- | ------ | ----------------------------------- |
| X-ONRAMP-SIGNATURE<mark style="color:red;">\*</mark> | String | Your api key                        |
| X-ONRAMP-PAYLOAD<mark style="color:red;">\*</mark>   | String | payload generated for the request   |
| X-ONRAMP-APIKEY<mark style="color:red;">\*</mark>    | String | signature generated for the request |

#### Request Body

| Name                                      | Type   | Description                                           |
| ----------------------------------------- | ------ | ----------------------------------------------------- |
| orderId<mark style="color:red;">\*</mark> | String | Order id of the order for which webhook is to be sent |

{% tabs %}
{% tab title="200: OK " %}

```javascript
{ status: 1, code: 200, data: 'Response received from your server' }
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Nodejs" %}

```javascript
var CryptoJS = require('crypto-js');
var axios = require('axios');
async function main() {
  try {
    let body = {
      orderId: 123
    }
    let payload = {
      timestamp: new Date().getTime(),
      body
    }
    let apiKey = 'API_KEY', apiSecret = 'API_SECRET';
    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp/api/v1/merchant/resendWebhook',
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
    let data = await axios(options)
    console.log(data?.data);
  } catch (error) {
    console.log(error?.response?.data)
  }
}
main();
```

{% endtab %}

{% tab title="Python" %}

```python
import json
import time
import base64
import hmac
import hashlib
import requests

def resend_webhook():
    try:
        body = {
            'orderId': 141
        }
        payload = {
            "timestamp": int(time.time() * 1000),  # to get timestamp in milliseconds
            "body": body
        }
        api_key = 'API_KEY'
        api_secret = 'API_SECRET'

        payload = base64.b64encode(json.dumps(payload).encode()).decode()
        signature = hmac.new(api_secret.encode(), payload.encode(), hashlib.sha512).hexdigest()
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'X-ONRAMP-SIGNATURE': signature,
            'X-ONRAMP-APIKEY': api_key,
            'X-ONRAMP-PAYLOAD': payload
        }
        url = 'https://api.onramp.money/onramp/api/v1/merchant/resendWebhook'
        response = requests.post(url, headers=headers, data=json.dumps(body))
        print(response.json())
    except Exception as e:
        print(str(e))

resend_webhook()
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
   "walletAddress":"0x12345678900987654321",
   "coinId":54,
   "fiatType":1,
   "expectedPrice":87,
   "fiatAmount":100,
   "expectedCryptoAmount":0.89,
   "actualPrice":87,
   "actualCryptoAmount":0.88,
   "kycNeeded": 0,
   "createdAt":"2022-10-08T06:25:17.000Z",
   "updatedAt":"2022-11-09T16:58:07.000Z",
   "status":4,
   "referenceId":"227912121212",
   "chainId":3,
   "onRampFee":2.49,
   "gasFee":0.25,
   "clientFee":2.49,
   "gatewayFee":2.5,
   "transactionHash":"0x61refuyiasfdvisuaogdhsaidur35624324",
   "merchantRecognitionId":'13422'
}
```

{% endtab %}

{% tab title="Explanation" %}

* orderId -> order id of the transaction
* walletAddress -> Onchain wallet address to which the crypto was withdrawn to.
* coinId -> Id of the coin (e.g. 54 denotes to USDT)
* fiatType -> fiat type used for the transaction&#x20;
  * 1 -> India (Default) INR
  * 2 -> Turkey (TRY)
  * 3 -> Arab Emirates Dirham (AED)
  * 4 -> Mexican Peso (MXN)
  * 5 -> Vietnamese dong (VND)
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
* transactionHash -> hash id of the transaction sent onchain.&#x20;
* referenceId -> Reference Id entered by the user after completing fiat payment.
* kycNeeded -> KYC status of the user&#x20;
  * 0 -> basic KYC, no additional information required
  * 1 -> KYC needed to process this transaction
* merchantRecognitionId -> Specific string that can be passed by the merchant/Partner at the time of making the request.
  {% endtab %}
  {% endtabs %}


# Send Dummy Webhook

This endpoint allows you to send a dummy webhook to your server

<mark style="color:green;">`POST`</mark> `https://api.onramp.money/onramp/api/v1/merchant/sendDummyWebhook`

#### Headers

| Name                                                 | Type   | Description                         |
| ---------------------------------------------------- | ------ | ----------------------------------- |
| X-ONRAMP-SIGNATURE<mark style="color:red;">\*</mark> | String | Your api key                        |
| X-ONRAMP-PAYLOAD<mark style="color:red;">\*</mark>   | String | payload generated for the request   |
| X-ONRAMP-APIKEY<mark style="color:red;">\*</mark>    | String | signature generated for the request |

#### Request Body

| Name       | Type   | Description                                                                                                                                             |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webhookUrl | String | <p>Url to which you wish to receive dummy transaction details <br><br>If parameter is not sent. The url currently set for your appId will be used. </p> |

{% tabs %}
{% tab title="200: OK " %}

```json
{
   "status":1,
   "code":200,
   "data":"Sent webhook"
}
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Nodejs" %}

```javascript
var CryptoJS = require('crypto-js');
var axios = require('axios');
async function main() {
  try {
    let body = {
      webhookUrl: 'http://yourWebsite.com/webhook'
    }
    let payload = {
      timestamp: new Date().getTime(),
      body
    }
    let apiKey = 'API_KEY', apiSecret = 'API_SECRET';
    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, apiSecret));
    let options = {
      url: 'https://api.onramp.money/onramp/api/v1/merchant/sendDummyWebhook',
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
    let data = await axios(options)
    console.log(data?.data);
  } catch (error) {
    console.log(error?.response?.data)
  }
}
main();
```

{% endtab %}

{% tab title="Python" %}

```python
import json
import time
import base64
import hmac
import hashlib
import requests

def send_dummy_webhook():
    try:
        body = {
            'webhookUrl': 'http://yourWebsite.com/webhook'
        }
        payload = {
            "timestamp": int(time.time() * 1000),  # to get timestamp in milliseconds
            "body": body
        }
        api_key = 'API_KEY'
        api_secret = 'API_SECRET'

        payload = base64.b64encode(json.dumps(payload).encode()).decode()
        signature = hmac.new(api_secret.encode(), payload.encode(), hashlib.sha512).hexdigest()
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'X-ONRAMP-SIGNATURE': signature,
            'X-ONRAMP-APIKEY': api_key,
            'X-ONRAMP-PAYLOAD': payload
        }
        url = 'https://api.onramp.money/onramp/api/v1/merchant/sendDummyWebhook'
        response = requests.post(url, headers=headers, data=json.dumps(body))
        print(response.json())
    except Exception as e:
        print(str(e))

send_dummy_webhook()
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Response" %}
**Response from Endpoint**

```json
{
   "status":1,
   "code":200,
   "data":"Sent webhook"
}
```

\
**Response from webhook**

```json
{
   "orderId":9,
   "walletAddress":"0x638E25137871...aAF9d807Ea0d138",
   "coinId":54,
   "fiatType":1,
   "expectedPrice":87,
   "fiatAmount":100,
   "paymentType": 1
   "expectedCryptoAmount":0.89,
   "actualPrice":87,
   "actualCryptoAmount":0.88,
   "kycNeeded": 0,
   "createdAt":"2022-10-08T06:25:17.000Z",
   "updatedAt":"2022-11-09T16:58:07.000Z",
   "status":4,
   "referenceId":"227912121212",
   "chainId":3,
   "onRampFee":2.49,
   "gasFee":0.25,
   "clientFee":2.49,
   "gatewayFee":2.5,
   "transactionHash":"0x5999ce9ae014a58f23c2886...f0a5e69ea7c92461e2bb4c9226e",
   "merchantRecognitionId":'13422',
   "webhookTrials": 0
}
```

{% endtab %}

{% tab title="Explanation " %}

* orderId -> order id of the transaction
* walletAddress -> Onchain wallet address to which the crypto was withdrawn to.
* coinId -> Id of the coin (e.g. 54 denotes to USDT)
* fiatType -> fiat type used for the transaction&#x20;
  * 1 -> Indian Rupee (INR)
  * 2 -> Turkish lira (TRY)
  * 3 -> Arab Emirates Dirham (AED)
  * 4 -> Mexican Peso (MXN)
* paymentType -> payment method in fiat&#x20;
  * 1 -> Instant transfer (e.g. UPI)&#x20;
  * 2 -> Bank transfer (e.g. IMPS/FAST)
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
* transactionHash -> hash id of the transaction sent onchain.&#x20;
* referenceId -> Reference Id entered by the user after completing fiat payment.
* kycNeeded -> KYC status of the user&#x20;
  * 0 -> basic KYC, no additional information required
  * 1 -> KYC needed to process this transaction
* merchantRecognitionId -> Specific string that can be passed by the merchant/Partner at the time of making the request.
* webhookTrials -> The number of attempts made to reach the intended endpoint using a webhook.
  {% endtab %}
  {% endtabs %}

# Current Timestamp

The Current Server Timestamp endpoint is designed to return the current timestamp at the server level. This will be particularly useful when you need to synchronize payload and signature generation between your local system and the server, ensuring that both have the same timestamp for a consistent and secure signature.

{% hint style="info" %}
**Note**: We recommend using this endpoint only if you encounter issues with the timestamp using your current timestamp method. This is intended as a troubleshooting step to reconcile any discrepancies between the local and server-generated timestamps.
{% endhint %}

<mark style="color:blue;">`GET`</mark> `https://api.onramp.money/onramp/api/v2/common/public/currentTimestamp`

{% tabs %}
{% tab title="Nodejs" %}

```javascript
const axios = require('axios');

const currentTimestamp = async () => {
    try {
        const response = await axios.get(`https://api.onramp.money/onramp/api/v2/common/public/currentTimestamp`);
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error(`Error: ${error}`);
    }
};

currentTimestamp();
```

{% endtab %}

{% tab title="Python" %}

```python
import requests

def current_timestamp():
    url = 'https://api.onramp.money/onramp/api/v2/common/public/currentTimestamp'
    response = requests.get(url)

    if response.status_code == 200:
        print(response.json())
    else:
        print(f"Request failed with status code {response.status_code}")

current_timestamp()
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Response" %}

```json
{
  "status": 1,
  "code": 200,
  "data": 1692864725606
}
```

{% endtab %}

{% tab title="Explanation " %}

* status -> 0 is for unsuccessful request, 1 is for a successful one
* data -> current timestamp from server
  {% endtab %}
  {% endtabs %}

# Synchronisation  - Troubleshooting guide

{% hint style="info" %}
**Note**:&#x20;

* Refer to [Current timestamp](https://docs.onramp.money/onramp/rest-api-endpoints/current-timestamp) doc for detailed information.
* We **recommend** only using this approach when you encounter timestamp-related issues. For regular use, your local system's timestamp should suffice
* Always make sure that your system time is accurate and try to keep it synchronised with a reliable source
  {% endhint %}

If you're receiving a **`"Ahead of Time"`** 401 error, it likely indicates a mismatch between your local timestamp and the server timestamp. This discrepancy can lead to failed authentication, thus triggering a 401 error.

#### You can follow the steps below to resolve the issue:

1. **Fetch Server Timestamp**: Use the Server Timestamp endpoint to obtain the current timestamp from the server, using the link [here](https://docs.onramp.money/onramp/rest-api-endpoints/current-timestamp).
2. **Generate Signature with Server Timestamp**: Use the fetched server timestamp to generate the signature for your API requests.
3. **Re-attempt API Request**: Send your API request again, this time using the signature generated with the server's timestamp.

#### Here is a reference code to utilise server timestamp:

{% tabs %}
{% tab title="Nodejs" %}

```javascript
var CryptoJS = require('crypto-js');
const axios = require('axios');

const currentTimestamp = async () => {
    try {
        const response = await axios.get(`https://api.onramp.money/onramp/api/v2/common/public/currentTimestamp`);
        // console.log("Timestamp API Response:", JSON.stringify(response.data.data, null, 2));
        return response.data.data;
    } catch (error) {
        console.error("Timestamp API Error:", error);
        return null;
    }
};

async function main() {
  try {
    const API_KEY = "API_KEY";
    const API_SECRET = "API_SECRET";


    let body = {
      page: 2,
      pageSize: 50,
      order: "ASC"
    };

    let current_timestamp = await currentTimestamp();
		//let current_timestamp = new Date().getTime();  // local timestamp
    if (!current_timestamp) {
      current_timestamp = new Date().getTime();
    }
    console.log("Current Timestamp:", current_timestamp);

    let payload = {
      timestamp: current_timestamp,
      body: body
    };

    payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, API_SECRET));

    let options = {
      url: 'https://api.onramp.money/onramp/api/v1/transaction/merchantHistory',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'X-RECON-SIGNATURE': signature,
        'X-RECON-APIKEY': API_KEY,
        'X-RECON-PAYLOAD': payload
      },
      data: body
    };

    console.log("API Request Options:", options);

    let data = await axios(options);
    console.log("API Response:", data?.data);
  } catch (error) {
    console.log("Error Details:", error);
  }
}

main();
```

{% endtab %}
{% endtabs %}
