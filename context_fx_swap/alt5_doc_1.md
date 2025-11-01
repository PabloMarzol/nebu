Marketdata SignalR Api
April 28, 2021
Marketdata SignalR Api: marketdata/info
Methods
Method Input Input format Output
Book instrument base quote OrderBookInfo
MiniTicker interval quote tag QuoteInfo[]
Trades instrument base quote TradeInfo[]
Chart chart base quote@ {quote tag}TradeInfo[]
Available quote tags : 1m, 5m, 15m, 30m, 1h, 2h, 4h, 8h, 12h, 1d, 1w, 1M

1

2

Account WS /frontoffice/ws/account/{accountId:guid}
1. OrderInfoResponse[] OpenOrders()
OrderInfoResponse is the same object as returns by 
/frontoffice/api/orders/my. You can find it in swagger
2. Dictionary<string asset, decimal amount> Balance()
3. BalanceData BalanceUpdates()
BalanceData: 
{ assetId: string, available: decimal, orderLocked: decimal, 
transferLocked: decimal }
4. TransferData[] TransfersList({ Count: int })
TransferData is the same object at TransferData key in response 
from the next api /frontoffice/api/{accountId:guid}/deposit
Marketdata WS /marketdata/info
1. OrderBookInfo Book(string instrument)
OrderBookInfo: 
{
  instrument:string, bids:{amount: decimal, price: decimal}[], 
asks:{amount: decimal, price: decimal}[], 
  version:long, askTotalAmount:decimal, bidTotalAmount:decimal, 
snapshot:bool}
}
2. QuoteInfo[] MiniTicker(string interval)
QuoteInfo: 
{ instrument:string, start:DateTime, end:DateTime, low:decimal, 
high:decimal, volume:decimal, open:decimal, close:decimal }
3. TradeInfo[] Trades(string instrument)
TradeInfo:
{ tradeId:long, tradeTime:DateTime, amount:decimal, 
executionPrice:decimal, instrument:string, side:OrderSide }
4. QuoteInfo Chart(string chart)
QuoteInfo: see MiniTicker response

Curl

curl -X 'GET' \
  'https://trade.alt5pro.com/marketdata/instruments' \
  -H 'accept: application/json'
Request URL
https://trade.alt5pro.com/marketdata/instruments
Server response
Code	Details
200	
Response body
Download
[
  "bnb_usdt",
  "eurc_eur",
  "trump_usd",
  "usdc_usdt",
  "bsv_cad",
  "btc-cfd_usd",
  "mana_usdt",
  "bsv_eur",
  "usdt-trc_cad",
  "matic_usd",
  "doge_eur",
  "bnb_usd",
  "matic_cad",
  "clib_usd",
  "btc_usdt-trc",
  "hkd_usd",
  "clia_usd",
  "usd_mxn",
  "mxn_usd",
  "dai_usd",
  "btcn_usd",
  "bch_usdc",
  "qnt_usd",
  "ada_btc",
  "avax_btc",
  "dot_btc",
  "ada_usdt",
  "xrp_eur",
  "eos_usd",
  "atom_usd",
  "ftm_usd",
  "shib_cad",
  "ltc_btc",
  "btc_usdc",
  "ada_cad",
  "usdc_cad",
  "au_usdt",
  "ag_usdt",
  "dash_cad",
  "trump_usdt",
  "matic_eur",
  "xtz_usd",
  "matic_btc",
  "sol_usdc",
  "doge_usdc",
  "sol_usdt",
  "shib_usdt",
  "ape_usd",
  "bch_btc",
  "usdc_gbp",
  "usd_cad",
  "doge_gbp",
  "usdt-trc_eur",
  "usdt-trc_gbp",
  "avax_usd",
  "usdt-trc_usd",
  "eur_cad",
  "ada_eur",
  "xrp_gbp",
  "usdc_eur",
  "dash_usd",
  "eur_usd",
  "gbp_usd",
  "ltc_usdc",
  "eth_usdc",
  "trx_usd",
  "avax_gbp",
  "btc_usdt",
  "ada_gbp",
  "doge_cad",
  "eth_btc",
  "ltc_usdt",
  "btc_gbp",
  "xrp_usd",
  "doge_usd",
  "sol_usd",
  "algo_usd",
  "bat_usd",
  "sushi_usd",
  "btc_usd",
  "ada_usdc",
  "eth_eur",
  "sol_gbp",
  "eth_cad",
  "usdt_gbp",
  "ltc_eur",
  "dot_usdt",
  "bch_usdt",
  "bch_gbp",
  "usdt_cad",
  "usdc_usd",
  "bch_cad",
  "usdt_eur",
  "uni_cad",
  "dot_usdc",
  "matic_gbp",
  "link_cad",
  "bsv_usd",
  "ltc_gbp",
  "ltc_cad",
  "xrp_cad",
  "bch_eur",
  "eth_usdt",
  "xlm_usd",
  "bch_usd",
  "btc_eur",
  "link_usd",
  "sol_btc",
  "btc_cad",
  "dot_usd",
  "usdt_usd",
  "eth_gbp",
  "eth_usd",
  "ada_usd",
  "shib_usd",
  "enj_usd",
  "ltc_usd",
  "yfi_usd",
  "uni_usd",
  "mana_usd",
  "aave_usd",
  "bat_cad",
  "usdt_usdc",
  "mkr_usd",
  "yfi_cad",
  "snx_usd",
  "algo_usdc",
  "sol_cad",
  "snx_cad",
  "comp_cad",
  "aave_cad",
  "comp_usd",
  "mkr_cad",
  "au_btc",
  "au_usd",
  "ag_btc",
  "ag_usd"
]
Response headers
 content-length: 1472 
 content-type: application/json; charset=utf-8 
 date: Fri,15 Aug 2025 15:19:58 GMT 
 server: nginx 
 x-requestid: 168fd4cb-69dd-46f7-a896-3288a3d76616 
Responses
Code	Description	Links
200	
Success

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  "string"
]

Responses
Curl

curl -X 'GET' \
  'https://trade.alt5pro.com/marketdata/instruments/btc_usdt/history?startDate=2025-08-10&endDate=2025-08-15&type=1m&count=1000' \
  -H 'accept: application/json'
Request URL
https://trade.alt5pro.com/marketdata/instruments/btc_usdt/history?startDate=2025-08-10&endDate=2025-08-15&type=1m&count=1000
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "instrument": "btc_usdt",
  "data": [
    {
      "instrument": "btc_usdt",
      "start": "2025-08-14T07:21:00Z",
      "end": "2025-08-14T07:22:00Z",
      "low": 121726.365,
      "high": 121735.82,
      "volume": 0,
      "open": 121735.82,
      "close": 121726.365
    },
    {
      "instrument": "btc_usdt",
      "start": "2025-08-14T07:22:00Z",
      "end": "2025-08-14T07:23:00Z",
      "low": 121698.215,
      "high": 121730.115,
      "volume": 0,
      "open": 121726.365,
      "close": 121698.215
    }


}

]
Response headers
 content-length: 5823 
 content-type: application/json; charset=utf-8 
 date: Fri,15 Aug 2025 15:27:18 GMT 
 server: nginx 
 x-requestid: 01286389-1ab9-41dc-8d9a-04e78a58915b 
Responses
Code	Description	Links
200	
Success

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  {
    "id": "string",
    "can_deposit": true,
    "can_withdrawal": true,
    "image_url": "string",
    "asset_name": "string",
    "scale": 0,
    "liquid": true
  }
]

Responses
Curl

curl -X 'GET' \
  'https://trade.alt5pro.com/marketdata/api/v2/marketdata/ticker' \
  -H 'accept: application/json'
Request URL
https://trade.alt5pro.com/marketdata/api/v2/marketdata/ticker
Server response
Code	Details
200	
Response body
Download
[
  {
    "instrument": "mkr_cad",
    "start": "2025-08-15T00:00:00Z",
    "end": "2025-08-15T15:27:57.6236328Z",
    "low": 1591.11,
    "high": 1591.11,
    "volume": 0,
    "open": 1591.11,
    "close": 1591.11
  },
  {
    "instrument": "ada_cad",
    "start": "2025-08-15T00:00:00Z",
    "end": "2025-08-15T15:27:57.6236328Z",
    "low": 1.280355,
    "high": 1.282355,
    "volume": 0,
    "open": 1.281655,
    "close": 1.282105
  },


Response headers
 content-length: 23735 
 content-type: application/json; charset=utf-8 
 date: Fri,15 Aug 2025 15:27:57 GMT 
 server: nginx 
 x-requestid: c59257d3-872f-4575-9ca4-702178f756fa 
Responses
Code	Description	Links
200	
Success

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  {
    "instrument": "string",
    "start": "2025-08-15T15:27:58.054Z",
    "end": "2025-08-15T15:27:58.054Z",
    "low": 0,
    "high": 0,
    "volume": 0,
    "open": 0,
    "close": 0
  }
]

Responses
Curl

curl -X 'GET' \
  'https://trade.alt5pro.com/marketdata/api/v2/marketdata/depth/btc_usdt' \
  -H 'accept: application/json'
Request URL
https://trade.alt5pro.com/marketdata/api/v2/marketdata/depth/btc_usdt
Server response
Code	Details
200	
Response body
Download
{
  "instrument": "btc_usdt",
  "bids": [
    {
      "amount": 8,
      "price": 116781.47
    },
    {
      "amount": 10,
      "price": 116782.58
    }
}

Response headers
 content-length: 9343 
 content-type: application/json; charset=utf-8 
 date: Fri,15 Aug 2025 15:29:34 GMT 
 server: nginx 
 x-requestid: 6c8a374b-80f6-434b-b21e-1e44d4d18c84 
Responses
Code	Description	Links
200	
Success

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "instrument": "string",
  "bids": [
    {
      "amount": 0,
      "price": 0
    }
  ],
  "asks": [
    {
      "amount": 0,
      "price": 0
    }
  ],
  "version": 0,
  "askTotalAmount": 0,
  "bidTotalAmount": 0,
  "snapshot": true
}

Responses
Curl

curl -X 'GET' \
  'https://trade.alt5pro.com/marketdata/api/v2/marketdata/trades/btc_usdt' \
  -H 'accept: application/json'
Request URL
https://trade.alt5pro.com/marketdata/api/v2/marketdata/trades/btc_usdt
Server response
Code	Details
200	
Response body
Download
[
  {
    "tradeId": 4615168676,
    "tradeTime": "2025-08-14T15:39:15.118065Z",
    "amount": 0.336,
    "executionPrice": 117994.76,
    "instrument": "btc_usdt",
    "side": 0
  },
  {
    "tradeId": 4615168677,
    "tradeTime": "2025-08-14T15:39:15.118065Z",
    "amount": 0.508,
    "executionPrice": 117994.77,
    "instrument": "btc_usdt",
    "side": 0
  }

Response headers
 content-length: 1406 
 content-type: application/json; charset=utf-8 
 date: Fri,15 Aug 2025 15:30:55 GMT 
 server: nginx 
 x-requestid: 67e94252-c41b-4bc2-8e3c-7a6d36ff6bf6 
Responses
Code	Description	Links
200	
Success

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  {
    "tradeId": 0,
    "tradeTime": "2025-08-15T15:30:54.975Z",
    "amount": 0,
    "executionPrice": 0,
    "instrument": "string",
    "side": 0
  }
]

