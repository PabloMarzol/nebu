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

