Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
Rest API
Overview
Alt 5 Pay provides a standards-based REST interface which enables application developers to interact
with their Alt 5 Pay merchant account. Using the Alt 5 Pay API, clients can create depositing wallet
address to accept BTC, ETH, LTC and BCH for payment, real time digital asset to fiat rates and
receive notification of payments received.
Environments
The following environments are available -
Environment Base URL BTC
Blockchain
BTC Production https://api.alt5pay.com/usr/wallet/btc/create mainnet
BTC Sandbox https://api.digitalpaydev.com/usr/wallet/btc/create testnet
BCH
Production
https://api.alt5pay.com/usr/wallet/bch/create mainnet
BCH Sandbox https://api.digitalpaydev.com/usr/wallet/bch/create testnet
ETH Production https://api.alt5pay.com/usr/wallet/eth/create mainnet
ETH Sandbox https://api.digitalpaydev.com/usr/wallet/eth/create Goerli
LTC Production https://api.alt5pay.com/usr/wallet/ltc/create mainnet
LTC Sandbox https://api.digitalpaydev.com/usr/wallet/ltc/create testnet
DODGE
Production
https://api.alt5pay.com/usr/wallet/doge/create mainnet
DOGE
Sandbox
https://api.digitalpaydev.com/usr/wallet/doge/create testnet
USDT
Production
https://api.alt5pay.com/usr/wallet/erc20/usdt/create mainnet
USDT Sandbox NA Goerli
XRP
Production
https://api.alt5pay.com/usr/wallet/xrp/create mainnet
XRP Sandbox https://api.digitalpaydev.com/usr/wallet/xrp/create testnet
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
USDC
Production
https://api.alt5pay.com/usr/wallet/erc20/usdc/create mainnet
USDC Sandbox https://api.digitalpaydev.com/usr/wallet/erc20/usdc/create Goerli
USDT (TRC20)
Production
https://api.alt5pay.com/usr/wallet/usdt_tron/create mainnet
USDT (TRC20)
Sandbox
https://api.digitalpaydev.com/usr/wallet/usdt_tron/create testnet
SOL Production https://api.alt5pay.com/usr/wallet/sol/create mainnet
SOL Sandbox https://api.digitalpaydev.com/usr/wallet/sol/create testnet
BNB
Production
https://api.alt5pay.com/usr/wallet/bnb/create mainnet
BNB Sandbox https://api.digitalpaydev.com/usr/wallet/bnb/create testnet
DASH
Production
https://api.alt5pay.com/usr/wallet/dash/create mainnet
DASH Sandbox https://api.digitalpaydev.com/usr/wallet//dash/create testnet
ADA Cardano
Production
https://api.alt5pay.com/usr/wallet/ada/create mainnet
ADA Cardano
Sandbox
https://api.digitalpaydev.com/usr/wallet/ada/create testnet
AVAX
Avalanche
Production
https://api.alt5pay.com/usr/wallet/avax/create mainnet
AVAX
Avalanche
Sandbox
https://api.digitalpaydev.com/usr/wallet/avax/create testnet
Polygon (Matic)
Production
https://api.alt5pay.com/usr/wallet/matic_poly/create mainnet
Polygon (Matic)
Sandbox
https://api.digitalpaydev.com/usr/wallet/matic_poly/create testnet
SHIB
Production
https://api.alt5pay.com/usr/wallet/erc20/shib/create mainnet
SHIB Sandbox NA Goerli
Getting Started
In order to use Trade API, user will have to go through few simple steps:
1. API key
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
2. HMAC authorization header
API key
To use API, user will need to obtain API Public key and Secret Key, which are passed to API
with every request. API keys can be generated in your merchant dashboard at
dashboard.alt5pay.com under Settings > API Keys section.
HMAC authentication header value
Once user obtained API key, it is all set up! Now, the only thing left is to form HMAC
authorization header variable. In order to form this header, user will need following variables:
var apikey = 'public key'; // key obtained from alt5pay
var secretkey = 'secret key'; // secret obtained from alt5pay
var timestamp = Math.floor(Date.now() / 1000); // timestamp in seconds
var nonce = Math.floor(Math.random() * Math.floor(1000000)); // random nonce integer
The last variable, which is needed is Parameters from body (JSON), String consists of ALL
parameters from body separated by '&' sign if more than one (for example:
'ref_id=mk1231sa11&timestamp=1588364168&nonce=900288).
bodyString='ref_id=mk1231sa11&timestamp=1588364168&nonce=900288’
If the url and/or currency variables are being passed in the body, they must be added as
follows
bodyString='ref_id=mk1231sa11&url=https://yourwebhookurl.com&timestamp=1588364168&n
once=900288&currency=USD’
Finally, user has to put all of the variables together and encode them:
parameters from url and body
var hmacDigest = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(bodyString,
secretkey));
var authentication = btoa(apikey + ':' + hmacDigest);
That's it! User can now use variable 'authentication' as header to communicate with trade API.
Merchant id to be used in the header *Required
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
A merchant Id is required to be passed in the header.
User Merchant ID can be found in user Alt 5 Pay dashboard at dashboard.alt5pay.com or
sandbox.digitalpaydev.com under Settings > section Account information section.
Receiving Transaction Payments
Create Payment Wallet Address
Post Create Wallet Address API
<asset> variable = btc, eth, bch
https://api.alt5pay.com/usr/wallet/<asset>/create
https://api.digitalpaydev.com/usr/wallet/<asset>/create
Headers
apikey. 9c0c51ee6f3798e3aae63ea630ddd2b7265fe54f
 (public key value)
merchant_id (Merchant id in Account Information)

authentication. (authentication value generated)
RAW JSON BODY
{
 "ref_id": "user unique reference/invoice id per client",
"url": "https://yourwebhookurl.com", (optional field, this will override the webhook url set in the
API key options. )
 "timestamp": 1550838976,
 "nonce": 693795,
“currency”:”USD” ( options USD,CAD,EUR. If field is not included USD is used by default. )
}
Example Successful Response
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
{
 "status": "success",
 "data": {
 "ref_id": "cor121121",
 "price": 8632.59,
 "address": "moep287CANJhZoyssrigoHtkMwBiz6uhDt",
 "coin": "BTC",
 "expires": "2020-05-04 14:32:46.480"
 }
}
Example Failed Response
{
 "status": "error",
 "message": "Access Invalid"
}
Or
{
 "status": "error",
 "message": " Could Not Create Address
"
}
Alt 5 Pay Payment Webhook Call Back Notification
Instant Payment Notifications (IPNs) are sent from Alt 5 Pay upon every confirmed status
change. IPNs are POSTed to your webhook URL specified in user Alt 5 Pay dashboard. If
the Alt 5 Pay gateway receives an HTTP/1.1 200 OK response from your server, the message
is deemed to have been correctly delivered.
NOTE: This does not mean user application correctly handled the data - only that it was
received successfully by user server!
If an HTTP error code is received by the gateway, Alt 5 Pay server will attempt to resend the
IPN at increasing time intervals.
The amount of time between each re-post is as follows: 1 minute delay, 2 minute delay, 4
minute delay, 8 minute delay, 20 minute delay, 40 minute delay, 80 minute delay, 160
minute delay, 320 minute delay, 640 minute delay and 1,280 minute delay. The IPN system
stops re-posting when:
Alt 5 Pay receives a basic HTTP "200 OK" response from your web server, or
when 1,280 minutes have passed since the initial post.
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
Note: This functionality applies to both Sandbox and Live accounts.
Webhook URL (IPN) Response
Headers
signature CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(Body, secretkey));
Body
{"ref_id":"wm_123323",
"price":8550.26,
"amount":0.0006,
"total":5.13,
"date_time":"1588354319000",
"transaction_id":"c3c2920e4705cc37c57d0937576d6346c27ca81f2b9e507fd47a1de113b7bba
9",
"coin":"BTC",
"network":"testnet",
"currency":"USD",
"confirmation":"6",
"status":"Paid",
"fee":"0.2",
"source_address":" 0x3C965939Ca2d63962b4D0bdF84863262870eE198",
"type":"Payment" (Payment | Reused)
}
Get Transaction Status by Address
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
https://api.alt5pay.com/usr/wallet/transactions
https://api.digitalpaydev.com/usr/wallet/transactions
Headers
apikey. 9c0c51ee6f3798e3aae63ea630ddd2b7265fe54f
 (public key value)
merchant_id (Merchant id in Account Information)

authentication. (authentication value generated)
RAW JSON BODY
{

"address": "bchtest:qpggts6de95hnutg8wrxx55mh9z2dnxp2v64tuqn73",
“all”:false, (optional true | false)
 "timestamp": 1550838976,
 "nonce": 693795
}
Example Successful Response
{
 "status": "success",
 "data{
 "date_time": "2022-08-02T17:45:15.000Z",
 "address": "0xEAF8C52666d55D763aF5865a0189922384a6aE02",
 "status": "Paid", (Paid,Pending)
 "payment_amount": 0.03,
 "total_payment": 49.4,
 "txid": "0x5c413b29ef14416a7d438110200d57f55358b36a69020b40f893b94a7bf0ee66",
 "price": 1646.71,
 "currency": "USD",
 "coin": "ETH",
 "source_address": "0x3C965939Ca2d63962b4D0bdF84863262870eE198"
 }
}
Example Successful Response if all = true
{
 "status": "success",
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
 "data":[
 {
 "date_time": "2022-08-02T17:48:53.000Z",
 "address": "0xEAF8C52666d55D763aF5865a0189922384a6aE02",
 "status": "Paid", (Paid,Pending)
 "payment_amount": 0.01,
 "total_payment": 16.43,
 "txid": "0xaf7fa880e032c9b301755ebde31c25695fbcb4912997ddc05c316ac1c72a6c42",
 "price": 1642.91,
 "currency": "USD",
 "coin": "ETH",
 "source_address": "0x3C965939Ca2d63962b4D0bdF84863262870eE198"
 },
 {
 "date_time": "2022-08-02T17:45:15.000Z",
 "address": "0xEAF8C52666d55D763aF5865a0189922384a6aE02",
 "status": "Paid",
 "payment_amount": 0.03,
 "total_payment": 49.4,
 "txid": "0x5c413b29ef14416a7d438110200d57f55358b36a69020b40f893b94a7bf0ee66",
 "price": 1646.71,
 "currency": "USD",
 "coin": "ETH",
 "source_address": "0x3C965939Ca2d63962b4D0bdF84863262870eE198"
 }
 ]
}
Get Transaction Status by tx
https://api.alt5pay.com/usr/wallet/transactionsbytx
https://api.digitalpaydev.com/usr/wallet/transactionsbytx
Headers
apikey. 9c0c51ee6f3798e3aae63ea630ddd2b7265fe54f
 (public key value)
merchant_id (Merchant id in Account Information)

Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
authentication. (authentication value generated)
RAW JSON BODY
{

"txid": "0bd4d3c2ab491649bc5c7328aba8d46b2c2c856ca5cd8261d489a7e01c2a5f12",,
“all”:false, (optional true | false)
 "timestamp": 1550838976,
 "nonce": 693795
}
Example Successful Response
{
 "status": "success",
 "data{
 "date_time": "2022-08-02T17:45:15.000Z",
 "address": "0xEAF8C52666d55D763aF5865a0189922384a6aE02",
 "status": "Paid", (Paid,Pending)
 "payment_amount": 0.03,
 "total_payment": 49.4,
 "txid": "0x5c413b29ef14416a7d438110200d57f55358b36a69020b40f893b94a7bf0ee66",
 "price": 1646.71,
 "currency": "USD",
 "coin": "ETH",
 "source_address": "0x3C965939Ca2d63962b4D0bdF84863262870eE198"
 }
}
Example Successful Response if all = true
{
 "status": "success",
 "data":[
 {
 "date_time": "2022-08-02T17:48:53.000Z",
 "address": "0xEAF8C52666d55D763aF5865a0189922384a6aE02",
 "status": "Paid", (Paid,Pending)
 "payment_amount": 0.01,
 "total_payment": 16.43,
 "txid": "0xaf7fa880e032c9b301755ebde31c25695fbcb4912997ddc05c316ac1c72a6c42",
 "price": 1642.91,
 "currency": "USD",
 "coin": "ETH",
 "source_address": "0x3C965939Ca2d63962b4D0bdF84863262870eE198"
 },
 {
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
 "date_time": "2022-08-02T17:45:15.000Z",
 "address": "0xEAF8C52666d55D763aF5865a0189922384a6aE02",
 "status": "Paid",
 "payment_amount": 0.03,
 "total_payment": 49.4,
 "txid": "0x5c413b29ef14416a7d438110200d57f55358b36a69020b40f893b94a7bf0ee66",
 "price": 1646.71,
 "currency": "USD",
 "coin": "ETH",
 "source_address": "0x3C965939Ca2d63962b4D0bdF84863262870eE198"
 }
 ]
}
Get Transaction Status by RefID
https://api.alt5pay.com/usr/wallet/transactionsbyref
https://api.digitalpaydev.com/usr/wallet/transactionsbyref
Headers
apikey. 9c0c51ee6f3798e3aae63ea630ddd2b7265fe54f
 (public key value)
merchant_id (Merchant id in Account Information)

authentication. (authentication value generated)
RAW JSON BODY
{

"ref_id": "89012121-1212",
“all”:false, (optional true | false)
 "timestamp": 1550838976,
 "nonce": 693795
}
Example Successful Response
{
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
 "status": "success",
 "data{
 "date_time": "2022-08-02T17:45:15.000Z",
 "address": "0xEAF8C52666d55D763aF5865a0189922384a6aE02",
 "status": "Paid", (Paid,Pending)
 "payment_amount": 0.03,
 "total_payment": 49.4,
 "txid": "0x5c413b29ef14416a7d438110200d57f55358b36a69020b40f893b94a7bf0ee66",
 "price": 1646.71,
 "currency": "USD",
 "coin": "ETH",
 "source_address": "0x3C965939Ca2d63962b4D0bdF84863262870eE198"
 }
}
Example Successful Response if all = true
{
 "status": "success",
 "data":[
 {
 "date_time": "2022-08-02T17:48:53.000Z",
 "address": "0xEAF8C52666d55D763aF5865a0189922384a6aE02",
 "status": "Paid", (Paid,Pending)
 "payment_amount": 0.01,
 "total_payment": 16.43,
 "txid": "0xaf7fa880e032c9b301755ebde31c25695fbcb4912997ddc05c316ac1c72a6c42",
 "price": 1642.91,
 "currency": "USD",
 "coin": "ETH",
 "source_address": "0x3C965939Ca2d63962b4D0bdF84863262870eE198"
 },
 {
 "date_time": "2022-08-02T17:45:15.000Z",
 "address": "0xEAF8C52666d55D763aF5865a0189922384a6aE02",
 "status": "Paid",
 "payment_amount": 0.03,
 "total_payment": 49.4,
 "txid": "0x5c413b29ef14416a7d438110200d57f55358b36a69020b40f893b94a7bf0ee66",
 "price": 1646.71,
 "currency": "USD",
 "coin": "ETH",
 "source_address": "0x3C965939Ca2d63962b4D0bdF84863262870eE198"
 }
 ]
}
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
Get Wallet Addresses by RefID
https://api.alt5pay.com/usr/wallet/addressbyref
https://api.digitalpaydev.com/usr/wallet/addressbyref
Headers
apikey. 9c0c51ee6f3798e3aae63ea630ddd2b7265fe54f
 (public key value)
merchant_id (Merchant id in Account Information)

authentication. (authentication value generated)
RAW JSON BODY
{

"ref_id": "89012121-1212",
 "timestamp": 1550838976,
 "nonce": 693795
}
Example Successful Response
{
 "status": "success",
 "data": [
 {
 "address": "tb1qhc0fkupe0n50dcv4rkl545x7494grk9t2wyhmk",
 "tag": "",
 "coin": "BTC",
 "date": "2022-08-25T14:34:26.263Z"
 }
 ]
}
Get Current Price
https://api.alt5pay.com/usr/price
https://api.digitalpaydev.com/usr/price
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
Headers
apikey. 9c0c51ee6f3798e3aae63ea630ddd2b7265fe54f
 (public key value)
merchant_id (Merchant id in Account Information)

authentication. (authentication value generated)
RAW JSON BODY
{

"coin": "BTC", (BTC,ETH,LTC,BCH)
"currency": "USD", (USD,CAD,EUR)
 "timestamp": 1550838976,
 "nonce": 693795
}
Example Successful Response
{
 "status": "success",
 "data": {
 "price": "11314.69",
 "coin": "BTC",
 "date_time": "2020-08-28 11:04:02.460",
 "currency": "USD"
 }
}
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
Create Invoice
Production: POST https://api.alt5pay.com/usr/invoice/create
Sandbox: POST https://api.digitalpaydev.com/usr/invoice/create
Headers
apikey. 9c0c51ee6f3798e3aae63ea630ddd2b7265fe54f
 (public key value)
merchant_id (Merchant id in Account Information)

authentication. (authentication value generated)
RAW JSON BODY
{
"contact": {"email":"name@email.com",
"firstname":"first name",
"lastname":"last name",
"company":"company name",
"address":"address",
"city":"city",
"prov_state":"province or state",
"country":"country",
"postal_zip":"postal/zip code",
"phone":"phone"},
"ref_id":"your invoice ref number",
"items":[{"item":"product name","cost":"5","quantity":"2"}],
"total_amount":"10",
"currency":"USD", (USD|CAD|EUR)
"due_date":"2021-07-23",
"sendemail":false, (default true)
"url":"https://yourwebhookurl", (not required)
"timestamp": 1627050940,
"nonce": 51487
}
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
Example string of above payload to HMAC
contact={"email":"name@email.com","firstname":"first name","lastname":"last
name","company":"company name","address":"address","city":"city","prov_state":"province or
state","country":"country","postal_zip":"postal/zip code","phone":"phone"}&
ref_id=your invoice ref number&items=[{"item":"product
name","cost":"5","quantity":"2"}]&total_amount=10&due_date=2021-07-
23&sendemail=false&url=https://yourwebhookurl&timestamp=1627050940&nonce=51487
Success Response
{
 "status": "success",
 "data": {
 "invoice_id": "1cc1fe7e-b37b-5247-a0cc-5dc4a6a004ebc",
 "invoice_url": "https://digitalpaydev.com/payinvoice/?inv=1cc1fe7e-b37b-5247-a0cc5dc4a6a004ebc",
 "ref_id": "your invoice ref number"
 }
}
Get Fees
Environment Base URL
Production https://api.alt5pay.com/usr/fees
Sandbox https://api.digitalpaydev.com/usr/fees
Headers
apikey. 9c0c51ee6f3798e3aae63ea630ddd2b7265fe54f
 (public key value)
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
merchant_id (Merchant id in Account Information)

authentication. (authentication value generated)
RAW JSON BODY
{
"timestamp": 1627050940,
"nonce": 51487
}
Example string of above payload to HMAC
timestamp=1627050940&nonce=51487
Success Response
{
 "status": "success",
 "fees": {
 "main": {
 "feeprecent": 2,
 "extrafee": 0
 },
 "erc": {
 "feeprecent": 2,
 "extrafee": 15
 },
 "eth": {
 "feeprecent": 2.5,
 "extrafee": 0
 }
 }
}
Get Transactions
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
Environment Base URL
Production https://api.alt5pay.com/usr/transactions
Sandbox https://api.digitalpaydev.com/usr/transactions
Headers
apikey. 9c0c51ee6f3798e3aae63ea630ddd2b7265fe54f
 (public key value)
merchant_id (Merchant id in Account Information)

authentication. (authentication value generated)
RAW JSON BODY
{
"timestamp": 1627050940,
"nonce": 51487,
"startDate": ‘YYYY-MM-DD’
"endDate": ‘YYYY-MM-DD’
}
Example string of above payload to HMAC
timestamp=1627050940&nonce=51487& startDate=2022-06-01& endDate =2022-06-02
Success Response
{
 "status": "success",
 "data": [
 {
 "ref_id": "YourInvoiceId",
 "date_time": "2022-06-03T13:51:44.000Z",
 "address": "0x2C2c678ad144DA45616E9A676BFb7630e46E534e",
 "tag": "",
 "txid": "0xcc2a3181d4ff5926fe6b50d2e1884987bf52af432be17cbf7447b6d75a795fa7",
 "price": 1789.78,
 "payment_amount": 0.000558,
 "total_payment": 1,
 "coin": "ETH",
 "status": "Paid",
 "currency": "USD",
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
 "settled_currency": "USD",
 "settled_payment": ".975",
 "settled_fee": 0.025,
 "type": "Payment",
 "note": ""
}]


}
Get Balances
Environment Base URL
Production https://api.alt5pay.com/usr/balances
Sandbox https://api.digitalpaydev.com/usr/balances
Headers
apikey. 9c0c51ee6f3798e3aae63ea630ddd2b7265fe54f
 (public key value)
merchant_id (Merchant id in Account Information)

authentication. (authentication value generated)
RAW JSON BODY
{
 "timestamp": 1550838976,
 "nonce": 693795
}
Example Successful Response
{
 "status": "success",
 "data [ { coin: 'BTC',
 blalance: 0
},
 { coin: 'BCH',
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
 blalance: 0.000098
},]
}
Get Assets
Environment Base URL
Production https://api.alt5pay.com/assets
Sandbox https://api.digitalpaydev.com/assets
RAW JSON BODY
{
 "apps": “true” (optional field true (available on apps and API | false (available only through
the API)
}
Example Successful Response
{
 "status": "success",
 "data": [
 {
 "name": "Bitcoin",
 "asset_id": "BTC",
 "explorer_url": "https://blockexplorer.one/btc/testnet/tx/",
 "icon_url": "https://sandbox.digitalpaydev.com/assets/icons/bitcoin.png"
 },
 {
 "name": "Bitcoin Cash",
 "asset_id": "BCH",
 "explorer_url": "https://blockexplorer.one/bch/testnet/tx/",
 "icon_url": "https://sandbox.digitalpaydev.com/assets/icons/bitcoincash.png"
 }

 ]
}
Request Payment
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
Environment Base URL
Production https://api.alt5pay.com/usr/request_payment
Sandbox https://api.digitalpaydev.com/usr/request_payment
Headers
apikey. 9c0c51ee6f3798e3aae63ea630ddd2b7265fe54f
 (public key value)
merchant_id (Merchant id in Account Information)

authentication. (authentication value generated)
RAW JSON BODY
{
"currency": “USD”, (options : USD | CAD | EUR | BTC | BCH | LTC | ETH | USDT | USDC |
DASH | XRP | SOL | USDT_TRON )
“type”:”Wire”, (only for USD | CAD | EUR options: Wire | ACH (USD only)| e-Transfer ( CAD
only)
 "timestamp": 1550838976,
 "nonce": 693795
}
Example Successful Response
{
 "status": "success",
 "data": {
 "amount": 174.5547,
 "fee": 20,
 "currency": "USD",
 "type": "Wire"
 }
}
Settlement Payments
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
Environment Base URL
Production https://api.alt5pay.com/usr/payments
Sandbox https://api.digitalpaydev.com/usr/payments
Headers
apikey. 9c0c51ee6f3798e3aae63ea630ddd2b7265fe54f
 (public key value)
merchant_id (Merchant id in Account Information)

authentication. (authentication value generated)
RAW JSON BODY
{
"timestamp": 1627050940,
"nonce": 51487,
"startDate": "YYYY-MM-DD", (optional (default all)– if used endDate must also be supplied)
"endDate": "YYYY-MM-DD", (optional (default all)– – if used startDate must also be supplied)
}
Example string of above payload to HMAC
timestamp=1627050940&nonce=51487& startDate=2022-06-01& endDate =2022-06-02
Success Response
{
 "status": "success",
"data": [
 {
 "amount_paid": 3249.69,
 "fee_amount": 82.53126,
 "date": "2022-07-15T19:03:18.130Z",
 "currency": "USD",
 "payment_type_fee": 0,
 "payment_type": "USDC",
 "notes": "qwqwqwqwq"
 },
 {
 "amount_paid": 3.99,
 "fee_amount": 0,
Copyright © 2023 Alt5pay.com – info@alt5pay.com
Release: Jan 18th 2023 v.2.10.10
 "date": "2021-07-20T15:56:10.447Z",
 "currency": "BTC",
 "payment_type_fee": 0.01,
 "payment_type": "BTC",
 "notes": ""
 }}


}