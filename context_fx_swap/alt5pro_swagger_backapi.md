GET
/admin/accounts/owned-by-internal/{ownerId}
Get accounts by owner id for internal not-authorized access calls
Parameters
Try it out
Name	Description
ownerId *
string
(path)
ownerId
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
    "id": 0,
    "externalId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "ownerId": "string",
    "mainAsset": "string"
  }
]