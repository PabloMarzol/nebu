# Get all coin details - V2

{% hint style="info" %}
**V2 endpoint** now supports over 300+ pairs, this API endpoint provides comprehensive information on the tokens/coins and their prices, enabling developers to build effective and efficient integrations with Onramp.
{% endhint %}

<mark style="color:blue;">`GET`</mark> `https://api.onramp.money/onramp/api/v2/sell/public/allConfig`

{% tabs %}
{% tab title="200: OK " %}

```json
{
   "status":1,
   "code":200,
   "data":{
      "allCoinConfig":{
         "eth":{
            "coinId":6,
            "coinName":"Ethereum",
            "coinIcon":"https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
            "balanceFloatPlaces":8,
            "tradeFloatPlaces":8,
            "markets":{
               "decimals":{
                  "usdt":2,
                  "inr":2
               }
            },
            "networks":[
               1,
               0,
               13,
               5,
               10013,
               3
            ]
         }
      },
      "networkConfig":{
         "0":{
            "chainSymbol":"erc20",
            "addressRegex":"^(0x)[0-9A-Fa-f]{40}$",
            "memoRegex":"",
            "chainName":"Ethereum Network",
            "startingWith":[
               "0x"
            ],
            "hashLink":"https://etherscan.io/tx/",
            "node":6,
            "networkId":1,
            "nativeToken":6
         }
      },
      "coinData":{
         "0":2521023.02,
         "1":38.8832,
         "2":1168.99,
         "3":310.424,
         "4":8.1437,
         "5":3.564,
         "6":{
            "0":161528.499,
            "1":161528.499,
            "3":174152.35,
            "5":161528.499,
            "13":174152.35,
            "10013":161528.499
         }
      },
      "minimumBuyAmount":{
         "0":{
            "0":1000,
            "1":1000,
            "5":1000,
            "10002":2773.13,
            "10004":2773.13
         }
      },
      "allGasFee":{
         "0":{
            "0":{
               "withdrawalFee":"0.00017",
               "minimumWithdrawal":"0.00037400",
               "nodeInSync":1
            },
            "1":{
               "withdrawalFee":"0.0000039",
               "minimumWithdrawal":"0.00000858",
               "nodeInSync":1
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
let url = 'https://api.onramp.money/onramp/api/v2/sell/public/allConfig'

const allConfig = async () => {
    try {
        const response = await axios.get(url);
        console.log(JSON.stringify(response.data, null, 2)); // The "2" here adds indentation to the output
    } catch (error) {
        console.error(`Error: ${error}`);
    }
};

allConfig();
```

{% endtab %}

{% tab title="Python" %}

```python
import requests

def all_config():
    url = 'https://api.onramp.money/onramp/api/v2/sell/public/allConfig'
    response = requests.get(url)

    if response.status_code == 200:
        print(response.json())
    else:
        print(f"Request failed with status code {response.status_code}")

all_config()
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
      "allCoinConfig":{
         "btc":{
            "coinId":0,
            "coinName":"Bitcoin",
            "coinIcon":"https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
            "balanceFloatPlaces":8,
            "tradeFloatPlaces":8,
            "networks":[
               0,
               1,
               5,
               10002,
               10004,
               10164
            ],
            "markets":{
               "decimals":{
                  "usdt":2,
                  "inr":2
               }
            }
         },
      },
      "networkConfig":{
         "0":{
            "chainSymbol":"erc20",
            "addressRegex":"^(0x)[0-9A-Fa-f]{40}$",
            "memoRegex":"",
            "chainName":"Ethereum Network",
            "networkId":1,
            "nativeToken":6,
            "startingWith":[
               "0x"
            ],
            "hashLink":"https://etherscan.io/tx/",
            "node":6
         },
      },
      "coinData":{
         "0":2568231.16,
         "1":60.5139,
         "2":762.15,
         "3":231.113,
         "4":12.5645,
         "5":2.52876,
         "6":163146.24,
         "10":7857.65,
      },
      "allGasFee":{
         "0":{
            "0":{
               "depositFee":0,
               "minimumDeposit":0,
               "nodeInSync":1
            },
            "1":{
               "depositFee":0,
               "minimumDeposit":0,
               "nodeInSync":1
            },
            "10002":{
               "depositFee":0,
               "minimumDeposit":0,
               "nodeInSync":1
            },
            "10004":{
               "depositFee":0,
               "minimumDeposit":0,
               "nodeInSync":1
            },

         },
      },
      "gatewayFee":{
         "1":{
            "1000":2.36,
            "25000":3.54,
            "500000":8.26
         }
      },
      "minimumSellAmount":{
         "1":100
      }
   }
}
```

{% endtab %}

{% tab title="Explanation" %}

* status -> 0 is for unsuccessful request, 1 is for a successful one
* coinId -> Id associated for the coin
* coinIcon -> Icon associated for the coin
* coinName -> Name of the coin
* balanceFloatPlaces -> denotes how many float places for the coin would be supported for reflecting the balance of the coin.
* tradeFloatPlaces -> denotes how many float places are supported for the coin while swapping/trading.
* minimumTradeAmount -> Minimum required amount to swap a coin.&#x20;
* decimals -> the number of float places the underlying currency, e.g. INR -> 2 i.e ₹99.99.
* networks -> supported networks for onchain transactions
* address -> returns the starting letters of the onchain address&#x20;
* startingLetter -> denotes the starting characters of the onchain address.
* chainName -> Name of the chain which can be used for onchain transactions.
* confirmations -> The number of confirmations required for successful transaction.
* hashLink -> upon concatenating with the transaction hash, a link to view the transaction details onchain would be possible via our preferred onchain scanners.
* &#x20;node -> used internally.&#x20;
* coinData -> current prices of the coins (currently denoted in INR)
* addressRegex -> Regular express of the wallet address for matching.
* memoRegex ->  Regular express of the memo for memo based blockchains, foe matching.
* gatewayFee -> Fee charge by the payment gateway when making a fiat withdrawal to the user's bank account
* minimumSellAmount -> Minimum amount required to sell on Onramp platform, with schema as fiatType followed by the amount&#x20;
  * `e.g.` -> 1 -> refers to Indian rupee (INR) \
    &#x20;              100 -> refers to the amount in Rupees&#x20;
    {% endtab %}
    {% endtabs %}
