Gasless
Gasless API endpoints

getPrice
Get the indicative price for a gasless swap

query Parameters
chainId
required
integer > 0
Example: chainId=1
Chain ID. See here for the list of supported chains

buyToken
required
string^0x(?!0{40})[a-fA-F0-9]{40}$
Example: buyToken=0xdac17f958d2ee523a2206206994597c13d831ec7
The contract address of the token to buy

sellToken
required
string^0x(?!0{40})[a-fA-F0-9]{40}$
Example: sellToken=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
The contract address of the token to sell. Native token is not supported

sellAmount
required
string
Example: sellAmount=300000000
The amount of sellToken in sellToken base units to sell

taker	
string^0x[a-fA-F0-9]{40}$
Example: taker=0x70a9f34f9b34c64957b9c401a97bfed35b95049e
The address which holds the sellToken balance and has the allowance set for the swap

recipient	
string^0x[a-fA-F0-9]{40}$
The address to receive the buyToken. If not provided, defaults to the taker address. Not supported for wrap/unwrap operations.

swapFeeRecipient	
string^0x[a-fA-F0-9]{40}$
The wallet address to receive the specified trading fees. You must also specify the swapFeeToken and swapFeeBps in the request to use this feature. Learn more about setting up a trading fee/commission in the FAQs

swapFeeBps	
integer [ 0 .. 10000 ]
The amount in Bps of the swapFeeToken to charge and deliver to the swapFeeRecipient. You must also specify the swapFeeRecipient and swapFeeToken in the request to use this feature. For security, this field has a default limit of 1000 Bps. If your application requires a higher value, please reach out to us.

swapFeeToken	
string^0x(?!0{40})[a-fA-F0-9]{40}$
The contract address of the token to receive trading fees in. If provided, this must be set to the value of either the buyToken or the sellToken. If omitted, the fee token will be determined by 0x with preference to stablecoins and highly liquid assets. You must also specify the swapFeeRecipient and swapFeeBps to charge integrator fees

tradeSurplusRecipient	
string^0x[a-fA-F0-9]{40}$
The address to receive any trade surplus. If specified, this address will receive trade surplus when applicable. Otherwise, the taker will receive the surplus. This feature is only available to selected integrators on a custom pricing plan. In other cases, the surplus will be collected by 0x. For assistance with a custom plan, please contact support.

tradeSurplusMaxBps	
integer [ 1 .. 10000 ]
The maximum trade surplus (positive slippage) that can be collected in Bps of the buy amount. If not provided, defaults to 10000 (100%). Must be used together with tradeSurplusRecipient.

slippageBps	
integer [ 30 .. 10000 ]
The maximum acceptable slippage of the buyToken in Bps. 0x sets the optimal slippage tolerance per trade by default. To mitigate the risk of MEV attacks, we recommend adjusting this value only when trading low-liquidity tokens.

excludedSources	
string
Liquidity sources e.g. Uniswap_V3, SushiSwap, 0x_RFQ to exclude from the provided quote. See https://api.0x.org/sources?chainId= with the desired chain's ID for a full list of sources. Separate multiple sources with a comma

header Parameters
0x-api-key
required
string
Visit dashboard.0x.org to get your API Key

0x-version
required
string
Example: v2
API version

Responses
200
Successful response

Response Schema: application/json
Any of objectobject
allowanceTarget
required
string or null^0x[a-fA-F0-9]{40}$
The target contract address for which the taker needs to have an allowance in order to be able to complete the swap. For swaps with the native asset (ie "ETH" or "BNB") as the sellToken, wrapping the native asset (i.e. "ETH" to "WETH") or unwrapping, no allowance is needed

blockNumber
required
string^[-+]?(0|[1-9]\d*)(\.\d+)?$
The block number at which the liquidity sources were sampled to generate the quote. This indicates the freshness of the quote

buyAmount
required
string^[-+]?(0|[1-9]\d*)(\.\d+)?$
The amount of buyToken (in buyToken units) that will be bought in the swap

buyToken
required
string^0x[a-fA-F0-9]{40}$
The contract address of the token to buy in the swap

fees
required
object
Fees to be deducted in this transaction. It contains the integratorFee, zeroExFee and gasFee

issues
required
object
An object containing potential issues discovered during 0x validation that can prevent the swap from being executed successfully by the taker

liquidityAvailable
required
boolean
Value: true
This validates the availability of liquidity for the quote requested. The rest of the fields will only be returned if true

minBuyAmount
required
string^[-+]?(0|[1-9]\d*)(\.\d+)?$
The price which must be met or else the entire transaction will revert. This price is influenced by the slippageBps parameter. On-chain sources may encounter price movements from quote to settlement

route
required
object
The path of liquidity sources to be used in executing this swap

sellAmount
required
string^[-+]?(0|[1-9]\d*)(\.\d+)?$
The amount of sellToken (in sellToken units) that will be sold in this swap

sellToken
required
string^0x[a-fA-F0-9]{40}$
The contract address of the token to sell in the swap

target
required
string^0x[a-fA-F0-9]{40}$
The address of the target contract that the transaction will be submitted to

tokenMetadata
required
object
Swap-related metadata for the buy and sell token in the swap

zid
required
string
The unique ZeroEx identifier of the request

400
400 error response

Response Schema: application/json
Any of INPUT_INVALIDRECIPIENT_NOT_SUPPORTEDUNABLE_TO_CALCULATE_GAS_FEESELL_AMOUNT_TOO_SMALLSWAP_VALIDATION_FAILEDTOKEN_NOT_SUPPORTEDUSER_NOT_AUTHORIZEDTOKEN_PAIR_NOT_SUPPORTED
name
required
string
Value: "SWAP_VALIDATION_FAILED"
message
required
string
data
required
object
403
403 error response

Response Schema: application/json
Any of TAKER_NOT_AUTHORIZED_FOR_TRADE
name
required
string
Value: "TAKER_NOT_AUTHORIZED_FOR_TRADE"
message
required
string
data
required
object
422
422 error response

Response Schema: application/json
Any of BUY_TOKEN_NOT_AUTHORIZED_FOR_TRADESELL_TOKEN_NOT_AUTHORIZED_FOR_TRADE
name
required
string
Value: "BUY_TOKEN_NOT_AUTHORIZED_FOR_TRADE"
message
required
string
data
required
object
500
500 error response

Response Schema: application/json
Any of INTERNAL_SERVER_ERRORUNCATEGORIZED
name
required
string
Value: "INTERNAL_SERVER_ERROR"
message
required
string
data
required
object

get
/gasless/price
Response samples
200400403422500
Content type
application/json

Copy
Expand allCollapse all
{
"allowanceTarget": "0x000000000022d473030f116ddee9f6b43ac78ba3",
"blockNumber": "20114764",
"buyAmount": "291527064",
"buyToken": "0xdac17f958d2ee523a2206206994597c13d831ec7",
"fees": {
"integratorFee": null,
"zeroExFee": {},
"gasFee": {}
},
"issues": {
"allowance": {},
"balance": {},
"simulationIncomplete": false,
"invalidSourcesPassed": [ ]
},
"liquidityAvailable": true,
"minBuyAmount": "290652483",
"route": {
"fills": [],
"tokens": []
},
"sellAmount": "300000000",
"sellToken": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
"target": "0x7c39a136ea20b3483e402ea031c1f3c019bab24b",
"tokenMetadata": {
"buyToken": {},
"sellToken": {}
},
"zid": "0x111111111111111111111111"
}
getQuote
Get the firm quote for a gasless swap

query Parameters
chainId
required
integer > 0
Example: chainId=1
Chain ID. See here for the list of supported chains

buyToken
required
string^0x(?!0{40})[a-fA-F0-9]{40}$
Example: buyToken=0xdac17f958d2ee523a2206206994597c13d831ec7
The contract address of the token to buy

sellToken
required
string^0x(?!0{40})[a-fA-F0-9]{40}$
Example: sellToken=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
The contract address of the token to sell. Native token is not supported

sellAmount
required
string
Example: sellAmount=300000000
The amount of sellToken in sellToken base units to sell

taker
required
string^0x[a-fA-F0-9]{40}$
Example: taker=0x70a9f34f9b34c64957b9c401a97bfed35b95049e
The address which holds the sellToken balance and has the allowance set for the swap

recipient	
string^0x[a-fA-F0-9]{40}$
The address to receive the buyToken. If not provided, defaults to the taker address. Not supported for wrap/unwrap operations.

swapFeeRecipient	
string^0x[a-fA-F0-9]{40}$
The wallet address to receive the specified trading fees. You must also specify the swapFeeToken and swapFeeBps in the request to use this feature. Learn more about setting up a trading fee/commission in the FAQs

swapFeeBps	
integer [ 0 .. 10000 ]
The amount in Bps of the swapFeeToken to charge and deliver to the swapFeeRecipient. You must also specify the swapFeeRecipient and swapFeeToken in the request to use this feature. For security, this field has a default limit of 1000 Bps. If your application requires a higher value, please reach out to us.

swapFeeToken	
string^0x(?!0{40})[a-fA-F0-9]{40}$
The contract address of the token to receive trading fees in. If provided, this must be set to the value of either the buyToken or the sellToken. If omitted, the fee token will be determined by 0x with preference to stablecoins and highly liquid assets. You must also specify the swapFeeRecipient and swapFeeBps to charge integrator fees

tradeSurplusRecipient	
string^0x[a-fA-F0-9]{40}$
The address to receive any trade surplus. If specified, this address will receive trade surplus when applicable. Otherwise, the taker will receive the surplus. This feature is only available to selected integrators on a custom pricing plan. In other cases, the surplus will be collected by 0x. For assistance with a custom plan, please contact support.

tradeSurplusMaxBps	
integer [ 1 .. 10000 ]
The maximum trade surplus (positive slippage) that can be collected in Bps of the buy amount. If not provided, defaults to 10000 (100%). Must be used together with tradeSurplusRecipient.

slippageBps	
integer [ 30 .. 10000 ]
The maximum acceptable slippage of the buyToken in Bps. 0x sets the optimal slippage tolerance per trade by default. To mitigate the risk of MEV attacks, we recommend adjusting this value only when trading low-liquidity tokens.

excludedSources	
string
Liquidity sources e.g. Uniswap_V3, SushiSwap, 0x_RFQ to exclude from the provided quote. See https://api.0x.org/sources?chainId= with the desired chain's ID for a full list of sources. Separate multiple sources with a comma

header Parameters
0x-api-key
required
string
Visit dashboard.0x.org to get your API Key

0x-version
required
string
Example: v2
API version

Responses
200
Successful response

Response Schema: application/json
Any of objectobject
allowanceTarget
required
string or null^0x[a-fA-F0-9]{40}$
The target contract address for which the taker needs to have an allowance in order to be able to complete the swap. For swaps with the native asset (ie "ETH" or "BNB") as the sellToken, wrapping the native asset (i.e. "ETH" to "WETH") or unwrapping, no allowance is needed

approval
required
object or null
This is the “approval” object which contains the necessary information to process a gasless approval

blockNumber
required
string^[-+]?(0|[1-9]\d*)(\.\d+)?$
The block number at which the liquidity sources were sampled to generate the quote. This indicates the freshness of the quote.

buyAmount
required
string^[-+]?(0|[1-9]\d*)(\.\d+)?$
The amount of buyToken (in buyToken units) that will be bought in the swap

buyToken
required
string^0x[a-fA-F0-9]{40}$
The contract address of the token to buy in the swap

fees
required
object
issues
required
object
An object containing potential issues discovered during 0x validation that can prevent the swap from being executed successfully by the taker

liquidityAvailable
required
boolean
Value: true
This validates the availability of liquidity for the quote requested. The rest of the fields will only be returned if true

minBuyAmount
required
string^[-+]?(0|[1-9]\d*)(\.\d+)?$
The price which must be met or else the transaction will revert. This price is influenced by the slippageBps parameter. On-chain sources may encounter price movements from quote to settlement

route
required
object
The path of liquidity sources to be used in executing this swap

sellAmount
required
string^[-+]?(0|[1-9]\d*)(\.\d+)?$
The amount of sellToken (in sellToken units) that will be sold in this swap

sellToken
required
string^0x[a-fA-F0-9]{40}$
The contract address of the token to sell in the swap

target
required
string^0x[a-fA-F0-9]{40}$
The address of the target contract that the transaction will be submitted to

tokenMetadata
required
object
Swap-related metadata for the buy and sell token in the swap

trade
required
object
This is the “trade” object which contains the necessary information to process a gasless trade

zid
required
string
The unique ZeroEx identifier of the request

400
400 error response

Response Schema: application/json
Any of INPUT_INVALIDINSUFFICIENT_BALANCERECIPIENT_NOT_SUPPORTEDUNABLE_TO_CALCULATE_GAS_FEESELL_AMOUNT_TOO_SMALLSWAP_VALIDATION_FAILEDTOKEN_NOT_SUPPORTEDUSER_NOT_AUTHORIZEDTOKEN_PAIR_NOT_SUPPORTED
name
required
string
Value: "INPUT_INVALID"
message
required
string
data
required
object
403
403 error response

Response Schema: application/json
Any of TAKER_NOT_AUTHORIZED_FOR_TRADE
name
required
string
Value: "TAKER_NOT_AUTHORIZED_FOR_TRADE"
message
required
string
data
required
object
422
422 error response

Response Schema: application/json
Any of BUY_TOKEN_NOT_AUTHORIZED_FOR_TRADESELL_TOKEN_NOT_AUTHORIZED_FOR_TRADE
name
required
string
Value: "BUY_TOKEN_NOT_AUTHORIZED_FOR_TRADE"
message
required
string
data
required
object
500
500 error response

Response Schema: application/json
Any of INTERNAL_SERVER_ERRORUNCATEGORIZED
name
required
string
Value: "INTERNAL_SERVER_ERROR"
message
required
string
data
required
object

get
/gasless/quote
Response samples
200400403422500
Content type
application/json

Copy
Expand allCollapse all
{
"allowanceTarget": "0x000000000022d473030f116ddee9f6b43ac78ba3",
"approval": {
"type": "permit",
"hash": "0xf3849ebcd806e518f2d3457b76d31ccf41be07fe64f0a25bbe798f1b9edde872",
"eip712": {}
},
"blockNumber": "20114747",
"buyAmount": "292995086",
"buyToken": "0xdac17f958d2ee523a2206206994597c13d831ec7",
"fees": {
"integratorFee": null,
"zeroExFee": {},
"gasFee": {}
},
"issues": {
"allowance": {},
"balance": {},
"simulationIncomplete": false,
"invalidSourcesPassed": [ ]
},
"liquidityAvailable": true,
"minBuyAmount": "292116101",
"route": {
"fills": [],
"tokens": []
},
"sellAmount": "300000000",
"sellToken": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
"target": "0x7c39a136ea20b3483e402ea031c1f3c019bab24b",
"tokenMetadata": {
"buyToken": {},
"sellToken": {}
},
"trade": {
"type": "settler_metatransaction",
"hash": "0x3ff032fa3a970a3f2b763afce093fd133ced63c0b097ab12ae1441b42de4a167",
"eip712": {}
},
"zid": "0x111111111111111111111111"
}
submit
Submit a gasless swap

header Parameters
0x-api-key
required
string
Visit dashboard.0x.org to get your API Key

0x-version
required
string
Example: v2
API version

Request Body schema: application/json
required
chainId
required
integer > 0
Chain ID. See here for the list of supported chains

approval	
object or null
The gasless approval object from the quote endpoint including its signature

trade
required
object
The trade object from the quote endpoint including its signature

Responses
200
Successful response

Response Schema: application/json
tradeHash
required
string
The hash for the trade according to EIP-712

type
required
string
Enum: "settler_metatransaction" "settler_intent"
The transaction type determined by the trade route. This is currently just settler_metatransaction and could expand to more types in the future

zid
required
string
The unique ZeroEx identifier of the request

400
400 error response

Response Schema: application/json
Any of INPUT_INVALIDINSUFFICIENT_BALANCE_OR_ALLOWANCEINVALID_SIGNATUREINVALID_SIGNERMETA_TRANSACTION_EXPIRY_TOO_SOONMETA_TRANSACTION_INVALIDPENDING_TRADES_ALREADY_EXIST
name
required
string
Value: "INPUT_INVALID"
message
required
string
data
required
object
500
500 error response

Response Schema: application/json
Any of INTERNAL_SERVER_ERRORUNCATEGORIZED
name
required
string
Value: "INTERNAL_SERVER_ERROR"
message
required
string
data
required
object

post
/gasless/submit
Request samples
Payload
Content type
application/json

Copy
Expand allCollapse all
{
"approval": {
"type": "permit",
"hash": "0xe285dfa7b911cdfe64a4c92240d9b5af795e41571163c1cb5d78d7ba5d04fda3",
"eip712": {},
"signature": {}
},
"chainId": 8453,
"trade": {
"type": "settler_metatransaction",
"hash": "0xb9d8cbda2a8edf0172631f9026da65387692a17d855f27ae6bb7154521f17659",
"eip712": {},
"signature": {}
}
}
Response samples
200400500
Content type
application/json

Copy
{
"tradeHash": "0xcb3285b35c024fca76037bea9ea4cb68645fed3bdd84030956577de2f1592aa9",
"type": "settler_metatransaction",
"zid": "0x111111111111111111111111"
}
getStatus
Get the status of a gasless swap

path Parameters
tradeHash
required
string
Example: 0x6c89e4ac46b246ab72cba02a9fb4f3525b9f8a11ea74262d5dd8ff0e024daf60
The hash for the trade according to EIP-712

query Parameters
chainId
required
integer > 0
Example: chainId=8453
here for the list of supported chains

header Parameters
0x-api-key
required
string
Visit dashboard.0x.org to get your API Key

0x-version
required
string
Example: v2
API version

Responses
200
Successful response

Response Schema: application/json
Any of objectobject
approvalTransactions	
Array of objects
Details of the gasless approval transaction

status
required
string
Enum: "pending" "submitted" "succeeded" "confirmed"
pending means that the order has been queued on 0x. submitted means that it has been submitted onchain,succeeded means it has been included in a block and confirmed means it has at least 3 confirmations onchain

transactions
required
Array of objects
Details of the gasless swap transaction. If the trade is pending, no transaction will be returned. If submitted, multiple transactions may be returned, but only one will be mined. If succeeded and confirmed, the mined transaction will be returned

zid
required
string
The unique ZeroEx identifier of the request

400
400 error response

Response Schema: application/json
Any of INPUT_INVALID
name
required
string
Value: "INPUT_INVALID"
message
required
string
data
required
object
404
404 error response

Response Schema: application/json
Any of META_TRANSACTION_STATUS_NOT_FOUND
name
required
string
Value: "META_TRANSACTION_STATUS_NOT_FOUND"
message
required
string
data
required
object
500
500 error response

Response Schema: application/json
Any of INTERNAL_SERVER_ERRORUNCATEGORIZED
name
required
string
Value: "INTERNAL_SERVER_ERROR"
message
required
string
data
required
object

get
/gasless/status/{tradeHash}
Response samples
200400404500
Content type
application/json

Copy
Expand allCollapse all
{
"status": "confirmed",
"transactions": [
{}
],
"zid": "0x111111111111111111111111"
}
getGaslessApprovalTokens
Get token addresses that support gasless approvals

query Parameters
chainId
required
integer > 0
Example: chainId=8453
Chain ID. See here for the list of supported chains

header Parameters
0x-api-key
required
string
Visit dashboard.0x.org to get your API Key

0x-version
required
string
Example: v2
API version

Responses
200
Successful response

Response Schema: application/json
tokens
required
Array of strings[^0x[a-fA-F0-9]{40}$]
The list of tokens that can be used for gasless approvals

zid
required
string
The unique ZeroEx identifier of the request

400
400 error response

Response Schema: application/json
Any of INPUT_INVALID
name
required
string
Value: "INPUT_INVALID"
message
required
string
data
required
object
500
500 error response

Response Schema: application/json
Any of INTERNAL_SERVER_ERRORUNCATEGORIZED
name
required
string
Value: "INTERNAL_SERVER_ERROR"
message
required
string
data
required
object

get
/gasless/gasless-approval-tokens
Response samples
200400500
Content type
application/json

Copy
Expand allCollapse all
{
"tokens": [
"0x111111111117dc0aa78b770fa6a738034120c302",
"0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
"0xb98d4c97425d9908e66e53a6fdf673acca0be986",
"0xed04915c23f00a313a544955524eb7dbd823143d",
"0x6b0b3a982b4634ac68dd83a4dbf02311ce324181",
"0xac51066d7bec65dc4589368da368b212745d63e8"
],
"zid": "0x111111111111111111111111"
}
getChains
Get list of supported chains for gasless

header Parameters
0x-api-key
required
string
Visit dashboard.0x.org to get your API Key

0x-version
required
string
Example: v2
API version

Responses
200
Successful response

Response Schema: application/json
chains
required
Array of objects
zid
required
string
The unique ZeroEx identifier of the request

500
500 error response

Response Schema: application/json
Any of INTERNAL_SERVER_ERRORUNCATEGORIZED
name
required
string
Value: "INTERNAL_SERVER_ERROR"
message
required
string
data
required
object

get
/gasless/chains
Response samples
200500
Content type
application/json

Copy
Expand allCollapse all
[
{
"chainName": "Ethereum",
"chainId": "1"
},
{
"chainName": "Optimism",
"chainId": "10"
},
{
"chainName": "BSC",
"chainId": "56"
},
{
"chainName": "Polygon",
"chainId": "137"
},
{
"chainName": "Base",
"chainId": "8453"
},
{
"chainName": "Arbitrum",
"chainId": "42161"
},
{
"chainName": "Avalanche",
"chainId": "43114"
},
{
"chainName": "Scroll",
"chainId": "534352"
},
{
"chainName": "Mantle",
"chainId": "5000"
},
{
"chainName": "Blast",
"chainId": "81457"
},
{
"chainName": "Mode",
"chainId": "34443"
}
]