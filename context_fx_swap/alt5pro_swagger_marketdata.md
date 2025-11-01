GET
/marketdata/instruments
Parameters
Try it out
No parameters

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

GET
/marketdata/instruments/{instrument}/history
Parameters
Try it out
Name	Description
instrument *
string
(path)
instrument
startDate *
string($date-time)
(query)
startDate
endDate *
string($date-time)
(query)
endDate
type
string
(query)
Default value : 1m

1m
count
integer($int32)
(query)
Default value : 1000

1000
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
  "success": true,
  "errorMessage": "string",
  "instrument": "string",
  "data": [
    {
      "instrument": "string",
      "start": "2025-10-16T13:51:20.624Z",
      "end": "2025-10-16T13:51:20.624Z",
      "low": 0,
      "high": 0,
      "volume": 0,
      "open": 0,
      "close": 0
    }
  ],
  "startDateTime": "2025-10-16T13:51:20.624Z",
  "endDateTime": "2025-10-16T13:51:20.624Z"
}

GET
/marketdata/api/v2/marketdata/assets
Parameters
Try it out
No parameters

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

GET
/marketdata/api/v2/marketdata/ticker
Parameters
Try it out
No parameters

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
    "start": "2025-10-16T14:06:03.682Z",
    "end": "2025-10-16T14:06:03.682Z",
    "low": 0,
    "high": 0,
    "volume": 0,
    "open": 0,
    "close": 0
  }
]

GET
/marketdata/api/v2/marketdata/depth/{instrument}
Parameters
Try it out
Name	Description
instrument *
string
(path)
instrument
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

GET
/marketdata/api/v2/marketdata/trades/{instrument}
Parameters
Try it out
Name	Description
instrument *
string
(path)
instrument
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
    "tradeTime": "2025-10-16T14:07:53.369Z",
    "amount": 0,
    "executionPrice": 0,
    "instrument": "string",
    "side": 0
  }
]

GET
/marketdata/api/v2/marketdata/mark-price/{instrument}
Parameters
Try it out
Name	Description
instrument *
string
(path)
instrument
time
string($date-time)
(query)
time
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
  "markPrices": [
    {
      "instrument": "string",
      "dateTime": "2025-10-16T14:08:09.814Z",
      "price": 0
    }
  ]
}

GET
/marketdata/api/v2/marketdata/mark-price/{instrument}/interval
Parameters
Try it out
Name	Description
instrument *
string
(path)
instrument
from
string($date-time)
(query)
from
to
string($date-time)
(query)
to
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
  "markPrices": [
    {
      "instrument": "string",
      "dateTime": "2025-10-16T14:08:25.641Z",
      "price": 0
    }
  ]
}

GET
/marketdata/api/v2/rates/liquid-assets
Parameters
Try it out
No parameters

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
  "assets": [
    "string"
  ]
}

GET
/marketdata/api/v2/rates
Parameters
Try it out
No parameters

Request body

application/json-patch+json
Example Value
Schema
{
  "items": [
    {
      "from": "string",
      "to": "string"
    }
  ]
}
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
  "items": [
    {
      "rate": "string",
      "from": "string",
      "to": "string"
    }
  ]
}

GET
/marketdata/api/v2/rates/{from}/{to}
Parameters
Try it out
Name	Description
from *
string
(path)
from
to *
string
(path)
to
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
  "rate": "string",
  "from": "string",
  "to": "string"
}

POST
/marketdata/api/v2/rates/history/{from}/{to}
Parameters
Try it out
Name	Description
from *
string
(path)
from
to *
string
(path)
to
Request body

application/json-patch+json
Example Value
Schema
[
  "2025-10-16T14:12:08.618Z"
]
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
  "rates": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "from": "string",
  "to": "string"
}






