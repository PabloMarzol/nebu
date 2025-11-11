# Parse Coin and Network Details

To extract the available coins and their supported networks from [allCoinDetails](https://docs.onramp.money/onramp/offramp-widget-integration/get-all-coin-details-v2) endpoint supported by Onramp, please refer the code below.

{% tabs %}
{% tab title="Nodejs" %}

```javascript
const fetch = require('node-fetch')

let url = 'https://api.onramp.money/onramp/api/v2/sell/public/allConfig'

let settings = { method: 'GET' }
let networkslist = []
let coinsList = []

async function getOnrampdata() {
  fetch(url, settings)
    .then(res => res.json())
    .then(obj => {
      saveNetworks(obj.data.networkConfig)
      saveCoinConfig(obj.data.allCoinConfig)
    })
}

function saveNetworks(networkjson) {
  //console.log(networkjson)
  var keys = Object.keys(networkjson)
  for (var i = 0; i < keys.length; i++) {
    networkslist.push([parseInt(keys[i]), networkjson[keys[i]]['chainSymbol']])
  }
  console.log('networksList :>> ', networkslist);
}

function lookupnetwork(chainId) {
  return networkslist.filter(nw => nw[0] === chainId)[0][1]
}

function saveCoinConfig(coinjson) {
  var keys = Object.keys(coinjson)
  let coinCode, networks
  for (var i = 0; i < keys.length; i++) {
    coinCode = keys[i]
    networks = coinjson[keys[i]]['networks']
    coinsList.push(coinCode)
    let coinnetwork = []
    for (var j = 0; j < networkslist.length; j++) {
      if (networks.includes(networkslist[j][0])) {
        coinnetwork.push(lookupnetwork(networkslist[j][0]))
        //console.log('coinCode,coinnetwork :>> ', coinCode,coinnetwork);
      }
    }
    coinsList.push(coinnetwork)
  }
  console.log(coinsList)
}

getOnrampdata()
```

{% endtab %}

{% tab title="Python" %}

```python
import requests
import json

url = 'https://api.onramp.money/onramp/api/v2/sell/public/allConfig'

networkslist = []
coinsList = []

def get_onramp_data():
    response = requests.get(url)
    data = response.json()

    save_networks(data['data']['networkConfig'])
    save_coin_config(data['data']['allCoinConfig'])

def save_networks(networkjson):
    keys = networkjson.keys()
    for key in keys:
        networkslist.append([int(key), networkjson[key]['chainSymbol']])
    print('networksList :>> ', networkslist)

def lookup_network(chainId):
    for nw in networkslist:
        if nw[0] == chainId:
            return nw[1]
    return None

def save_coin_config(coinjson):
    keys = coinjson.keys()
    for key in keys:
        coinCode = key
        networks = coinjson[key]['networks']
        coinsList.append(coinCode)
        coinnetwork = []
        for nw in networkslist:
            if nw[0] in networks:
                coinnetwork.append(lookup_network(nw[0]))
        coinsList.append(coinnetwork)
    print(coinsList)

get_onramp_data()
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="networksList Response" %}

```markdown
[  [0, 'erc20'],
  [1, 'bep20'],
  [2, 'trc20'],
  [3, 'matic20'],
  [4, 'spl'],
  [5, 'bep2'],
  [7, 'nep5'],
  [8, 'eos'],
  [9, 'klay'],
  [10, 'matic20-test'],
  [11, 'okc'],
  [12, 'wemix 3.0'],
  [13, 'arbitrum'],
  [14, 'yota'],
  [15, 'ton']
]
```

{% endtab %}

{% tab title="coinsList Response" %}

```markdown
[  'usdt',  ['erc20', 'bep20', 'trc20', 'matic20', 'matic20-test', 'okc', 'arbitrum'],
  'usdc',
  ['bep20', 'matic20', 'arbitrum'],
  'busd',
  ['bep20'],
  'matic',
  ['matic20'],
  'eth',
  ['erc20', 'matic20', 'arbitrum'],
  'yota',
  ['matic20-test', 'yota']
]

```

{% endtab %}
{% endtabs %}
