# Order status codes

### Onramp Status codes

The [merchantHistory](https://docs.onramp.money/onramp/rest-api-endpoints/merchant-transaction-history) and [webhook](https://docs.onramp.money/onramp/onramp-widget-integration/webhook-updates) updates endpoints provide status updates for transactions initiated through the API. The status code included in the response indicates the current stage of the order. The following status codes and their respective meanings are listed below:

<table><thead><tr><th width="188" align="center">Status code</th><th>Meaning</th><th>Description</th></tr></thead><tbody><tr><td align="center">-4</td><td>amount mismatch</td><td>The sent amount does not match the required amount.</td></tr><tr><td align="center">-3</td><td>bank and kyc name mismatch</td><td>The names on the bank account and KYC do not match.</td></tr><tr><td align="center">-2</td><td>transaction abandoned</td><td>The user has abandoned the transaction.</td></tr><tr><td align="center">-1</td><td>transaction timed out</td><td>The transaction has exceeded the allowable time limit.</td></tr><tr><td align="center">0</td><td>transaction created</td><td>The transaction has been successfully created.</td></tr><tr><td align="center">1</td><td>referenceId claimed</td><td>The Reference ID has been successfully claimed.</td></tr><tr><td align="center">2</td><td>deposit secured</td><td>The deposit for the transaction has been secured.</td></tr><tr><td align="center">3, 13</td><td>crypto purchased</td><td>The desired cryptocurrency has been purchased.</td></tr><tr><td align="center">4, 15</td><td>withdrawal complete</td><td>The withdrawal process is completed.</td></tr><tr><td align="center">5, 16</td><td>webhook sent</td><td>The webhook notification has been sent.</td></tr><tr><td align="center">11</td><td>order placement initiated</td><td>The process of placing the order has begun.</td></tr><tr><td align="center">12</td><td>purchasing crypto</td><td>The cryptocurrency purchase is in progress.</td></tr><tr><td align="center">14</td><td>withdrawal initiated</td><td>The withdrawal process has started.</td></tr></tbody></table>

{% hint style="info" %}
**Note**:&#x20;

* If webhooks are not enabled, transactions that complete successfully will be assigned a status code of either 4 or 15.
  {% endhint %}

### Offramp status codes&#x20;

The [merchantHistory](https://docs.onramp.money/onramp/rest-api-endpoints/merchant-transaction-history) endpoint in onramp.money's API provides status updates for transactions that are initiated through the platform's offramp service. The status code returned in the response corresponds to the current stage of the transaction. Below are the status codes and their respective meanings:

<table><thead><tr><th width="186" align="center">Status code</th><th>Meaning</th><th>Description</th></tr></thead><tbody><tr><td align="center">-4</td><td>amount mismatch</td><td>The sent amount does not match the required amount.</td></tr><tr><td align="center">-2</td><td>Transaction Abandoned</td><td>The user has abandoned the transaction.</td></tr><tr><td align="center">-1</td><td>Transaction Timed Out</td><td>The transaction has exceeded the allowable time limit.</td></tr><tr><td align="center">0</td><td>order created </td><td>The order has been successfully created.</td></tr><tr><td align="center">1</td><td>Order Confirmed</td><td>The order has been confirmed and a transaction hash has been generated.</td></tr><tr><td align="center">2,10,11</td><td>deposit found, selling crypto </td><td>The transaction hash has been successfully located.</td></tr><tr><td align="center">3</td><td>over limit</td><td>The user sent a quantity of cryptocurrency that exceeds their KYC limit, and their funds are withheld pending manual review.</td></tr><tr><td align="center">4,12</td><td>crypto sold </td><td>The cryptocurrency has been sold.</td></tr><tr><td align="center">5,13,30,31,32,33,34,35,36</td><td>fiat withdrawal initiated to bank</td><td>The process of fiat withdrawal has started.</td></tr><tr><td align="center">6,14,40</td><td>fiat withdrawal processed</td><td>The fiat withdrawal process is complete.</td></tr><tr><td align="center">7,15,41</td><td>webhook sent</td><td>The webhook notification has been sent.</td></tr><tr><td align="center">17</td><td>Provide Alternate Bank</td><td>The user has the option to provide an alternate bank account for the transaction.</td></tr><tr><td align="center">18</td><td>Processing to Alternate Bank</td><td>The transaction is being processed to the alternate bank account provided.</td></tr><tr><td align="center">19</td><td>Success</td><td>The fiat has been processed and the transaction has been successfully completed.</td></tr></tbody></table>

### Swap status codes&#x20;

| Status code | Meaning                         | Description                                                     |
| ----------- | ------------------------------- | --------------------------------------------------------------- |
| -1          | Order Expired                   | The order has expired.                                          |
| 0           | Swap transaction created        | Initial swap transaction has been created.                      |
| 1           | Deposit Secured                 | The crypto deposit has been secured, waiting for confirmations. |
| 2           | Deposit Confirmed               | The crypto deposit has been confirmed.                          |
| 3           | Placing Swap Order              | Swap order is currently being placed.                           |
| 4           | Swap Order Placed Successfully  | Swap order has been placed successfully.                        |
| 5           | Error: Contact Admin            | An error occurred; please contact the admin.                    |
| 6           | Swap Order Processing           | Swap order is currently being processed.                        |
| 7           | Swap Order Processed            | Swap order has been processed.                                  |
| 8           | Error in withdrawing token      | An error occurred during token withdrawal.                      |
| 9           | Withdraw Initiated              | Withdrawal process has been initiated.                          |
| 10          | Withdraw processed successfully | Withdrawal has been processed successfully.                     |

{% hint style="info" %}
**Note**:&#x20;

* status updates are only available for [merchantHistory](https://docs.onramp.money/onramp/rest-api-endpoints/merchant-transaction-history). Webhook support would be added soon.
  {% endhint %}



# Error codes

**HTTP error status codes**

In the event of an error, Onramp will return HTTP error status codes to facilitate swift troubleshooting. The response body will also contain an error field providing additional context about the error.

<table><thead><tr><th width="157" align="center">code</th><th>meaning</th><th>Description</th></tr></thead><tbody><tr><td align="center">200</td><td>null -- requested action has been performed without any problems</td><td>The requested action has been successfully performed without any problems.</td></tr><tr><td align="center">400</td><td>Invalid Request -- Invalid request format</td><td>The request format is invalid.</td></tr><tr><td align="center">401</td><td>Invalid client credentials/signature</td><td>Invalid client credentials or signature provided.</td></tr><tr><td align="center">403</td><td>Undefined -- this request is forbidden</td><td>The requested action is not allowed.</td></tr><tr><td align="center">406</td><td>Coin name not supplied or not yet supported -- coin name applied is incorrect</td><td>The coin name provided is either not supplied or not currently supported.</td></tr><tr><td align="center">409</td><td>parameter type not correct -- parameters entered is incorrect</td><td>The parameter type entered is incorrect.</td></tr><tr><td align="center">413</td><td>volume asked not acceptable -- Desired volume is not within bounds</td><td>The requested volume is not within acceptable bounds.</td></tr><tr><td align="center">416</td><td>Oops ! Not sufficient balance to purchase currency -- wallet balance is not sufficient</td><td>Wallet balance is not sufficient to purchase the requested currency</td></tr><tr><td align="center">417</td><td>Oops ! Order doesn't exist any more -- Order has already been deleted</td><td>The order doesn't exist anymore, possibly due to deletion.</td></tr><tr><td align="center">428</td><td>Price seems Irregular from current market price. -- Entered price is more than current price</td><td>The entered price significantly deviates from the current market price.</td></tr><tr><td align="center">429</td><td>Too many requests</td><td>Too many requests have been sent in a short period of time.</td></tr><tr><td align="center">500</td><td>Problem with our servers, try again later</td><td>There is a problem with our servers, please try again later.</td></tr><tr><td align="center">503</td><td>currently down for maintenance</td><td>The system is currently down for maintenance.</td></tr></tbody></table>
