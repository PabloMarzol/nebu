Asset


GET
/frontoffice/api/assets-info
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
  "data": [
    {
      "id": "string",
      "can_deposit": true,
      "can_withdraw": true,
      "allow_inter_account_transfers": true,
      "image_url": "string",
      "asset_name": "string",
      "withdrawal_fee": 0,
      "scale": 0,
      "withdrawal_min_kyc_level": 0,
      "deposit_min_kyc_level": 0,
      "type": 1,
      "is_archived": true,
      "country_rules": {
        "action": 0,
        "country_ids": [
          "string"
        ]
      }
    }
  ]
}

GET
/frontoffice/countries
Parameters
Try it out
Name	Description
Search
string
(query)
Search
Page
integer($int32)
(query)
Page
PerPage
integer($int32)
(query)
PerPage
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
  "filters": "string",
  "paging": {
    "page": 0,
    "per_page": 0,
    "total": 0
  },
  "data": [
    {
      "id": "string",
      "name": "string",
      "code": "string"
    }
  ]
}

GET
/frontoffice/countries/{id}
Parameters
Try it out
Name	Description
id *
string
(path)
id
Responses
Code	Description	Links
200	
Success

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "data": {
    "id": "string",
    "name": "string",
    "code": "string"
  }
}

GET
/frontoffice/api/info
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
  "serverTime": 0,
  "pairs": {
    "additionalProp1": {
      "baseAsset": "string",
      "quoteAsset": "string",
      "minPrice": 0,
      "maxPrice": 0,
      "minAmount": 0,
      "maxAmount": 0,
      "minTotalAmount": 0,
      "maxTotalAmount": 0,
      "makerFee": 0,
      "takerFee": 0,
      "priceScale": 0,
      "amountScale": 0,
      "minKycLevel": 0,
      "labels": [
        "string"
      ],
      "status": 0
    },
    "additionalProp2": {
      "baseAsset": "string",
      "quoteAsset": "string",
      "minPrice": 0,
      "maxPrice": 0,
      "minAmount": 0,
      "maxAmount": 0,
      "minTotalAmount": 0,
      "maxTotalAmount": 0,
      "makerFee": 0,
      "takerFee": 0,
      "priceScale": 0,
      "amountScale": 0,
      "minKycLevel": 0,
      "labels": [
        "string"
      ],
      "status": 0
    },
    "additionalProp3": {
      "baseAsset": "string",
      "quoteAsset": "string",
      "minPrice": 0,
      "maxPrice": 0,
      "minAmount": 0,
      "maxAmount": 0,
      "minTotalAmount": 0,
      "maxTotalAmount": 0,
      "makerFee": 0,
      "takerFee": 0,
      "priceScale": 0,
      "amountScale": 0,
      "minKycLevel": 0,
      "labels": [
        "string"
      ],
      "status": 0
    }
  }
}


GET
/frontoffice/api/build-info
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
  "buildDate": "2025-10-16T13:30:12.011Z",
  "buildBranch": "string",
  "buildCommitHash": "string"
}

