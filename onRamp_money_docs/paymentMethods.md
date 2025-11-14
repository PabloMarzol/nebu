# Payment Methods

Onramp Supported Payment Methods

Onramp is committed to providing a smooth and user-friendly experience for fiat onramp and offramp conversions. We understand the importance of convenience in the payment process and are constantly striving to add more methods that resonate with local practices in different regions.

{% hint style="info" %}
**Note:**&#x20;

* This endpoint does not require any authentication or request body.
* **Instant Transfer (UPI, etc.):** This method is represented by the value **`1`** in the **`paymentMethod`** parameter
* **Instant Bank Transfer (IMPS, FAST, etc.)**: This method refers to an immediate bank-to-bank transfer service. In the Onramp configuration, this method is represented by the value **`2`** in the **`paymentMethod`** parameter.
* **Minimum Limits:** For obtaining the minimum limits of all currencies, please consult the [coinNetwork](https://docs.onramp.money/onramp/onramp-widget-integration/allconfig-all-coin-details/coinnetwork-get-all-supported-networks) endpoint, specifically the '**data** > **minimumBuyAmount**' section.
  {% endhint %}

## Fetch supported fiat payment methods

<mark style="color:green;">`GET`</mark> [`https://api.onramp.money/onramp/api/v2/common/public/fetchPaymentMethodType`](https://api.onramp.money/onramp/api/v2/common/public/fetchPaymentMethodType)

#### Sample Request

{% tabs %}
{% tab title="Node.js" %}

```javascript
var axios = require('axios');

async function fetchPaymentMethod() {
  try {
   let options = {
      url: 'https://api.onramp.money/onramp/api/v2/common/public/fetchPaymentMethodType',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    };
    let data = await axios(options)
    console.log(data?.data);
  } catch (error) {
    console.log(error?.response?.data)
  }
}

fetchPaymentMethod();
```

{% endtab %}

{% tab title="Python" %}

```python
import requests

def fetch_payment_method():

    try:
    
        url = 'https://api.onramp.money/onramp/api/v2/common/public/fetchPaymentMethodType'
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }

        options = {
            'url': url,
            'headers': headers,
        }
        
        response = requests.get(**options)
        print(response.json())
        
    except Exception as error:
        print(error)


fetch_payment_method()

```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Response (200 OK)" %}

```json
{
   "status":1,
   "code":200,
   "data":{
      "1":{
         "UPI":1,
         "IMPS":2
      },
      "2":{
         "TRY_BANK_TRANSFER":2
      },
      "3":{
         "AED-BANK-TRANSFER":2
      },
      "4":{
         "SPEI":2
      },
      "5":{
         "VIET-QR":1
      },
      "6":{
         "NG-BANK-TRANSFER":2
      },
      "7":{
         "PIX":1
      },
      "8":{
         "WIREPE-INTERBANK":2
      },
      "9":{
         "BANCOLOMBIA":1
      },
      "10":{
         "KHIPU":1
      },
      "11":{
         "GCASH":1
      },
      "12":{
         "OPEN_BANKING":1,
         "SEPA_BANK_TRANSFER":2
      },
      "14":{
         "IDR_BANK_TRANSFER":2
      },
      "15":{
         "MPESA_PAYBILL":2
      },
      "16":{
         "MOBILE-CARRIER":1
      },
      "17":{
         "ZAR-BANK-TRANSFER":2
      },
      "19":{
         "MOBILE-MONEY":1
      },
      "20":{
         "FASTER_PAYMENTS":2
      },
      "21":{
         "WIRE":1,
         "ACH":2
      },
      "22":{
         "MOBILE-MONEY":1
      },
      "23":{
         "MOBILE-MONEY":1
      },
      "24":{
         "MOBILE-MONEY":1
      },
      "25":{
         "MOBILE-MONEY":1
      },
      "26":{
         "MOBILE-MONEY":1
      },
      "27":{
         "THAI_QR":1
      },
      "28":{
         "MY-BANK-TRANSFER":2
      },
      "29":{
         "WIREAR":1
      }
   }
}
```

{% endtab %}

{% tab title="Explanation" %}

* **status** **->** 0 is for unsuccessful request, 1 is for a successful one
* **data ->** This is the main object containing all payment method mappings organised by country.
  * Each key within the `data` object (e.g., "1", "2", "3") represents a unique country identifier (fiatType).
  * The value for each country identifier is an object that lists payment methods and their associated transfer types.
    * **Payment method**: The key within this object (e.g., "UPI", "IMPS", "AED-BANK-TRANSFER").
    * **Transfer type**: The value associated with each payment method, where `1` denotes an instant transfer and `2` denotes an instant bank transfer.
* **Json structure ->**\
  &#x20;   **data** : {\
  &#x20;          fiatType : {\
  &#x20;                   paymentMethod : transferType\
  &#x20;                }\
  &#x20;         }
  {% endtab %}
  {% endtabs %}

By understanding that different regions have varying preferences for payment methods, Onramp has incorporated a variety of popular local and international payment methods. Below is the list of payment methods currently supported by Onramp (For the updated details, please refer to the endpoint outlined in the requests above.) :

|    Icon    |                    Currency                   | Instant Transfer |           Instant Bank transfer          |                  Description                 | Payment Method | fiatType |
| :--------: | :-------------------------------------------: | :--------------: | :--------------------------------------: | :------------------------------------------: | :------------: | -------- |
| :flag\_in: |                  Indian Rupee                 |        UPI       |                                          |          Unified Payments Interface          |        1       | 1        |
| :flag\_in: |                  Indian Rupee                 |                  |                   IMPS                   |           Immediate Payment Service          |        2       | 1        |
| :flag\_tr: |                  Turkish lira                 |                  |                   FAST                   | The Instant and Continuous Transfer of Funds |        2       | 2        |
| :flag\_ae: |              Arab Emirates Dirham             |                  |               Bank Transfer              |                                              |        2       | 3        |
| :flag\_mx: |                  Mexican Peso                 |                  |                   SPEI                   |    Interbanking Electronic Payment System    |        2       | 4        |
| :flag\_vn: |                Vietnamese dong                |                  |                  VietQR                  |                                              |        1       | 5        |
| :flag\_ng: |                 Nigerian Naira                |                  |               Bank Transfer              |                                              |        2       | 6        |
| :flag\_br: |                 Brazilian Real                |                  |                    PIX                   |            Instant Payment System            |        2       | 7        |
| :flag\_pe: |                  Peruvian sol                 |                  |                   Khipu                  |                                              |        2       | 8        |
|    🇨🇴    |                 Columbian Peso                |                  |                   Khipu                  |                                              |        2       | 9        |
| :flag\_cl: |                  Chilean Peso                 |                  |                   Khipu                  |                                              |        2       | 10       |
| :flag\_ph: |                Philippines Peso               |                  |                 E Wallet                 |                                              |        3       | 11       |
| :flag\_eu: |                      Euro                     |                  | <p>Open Banking and <br>SEPA instant</p> |           Single Euro Payments Area          |        2       | 12       |
| :flag\_id: |               Indonesian Rupiah               |                  |                   QRIS                   |    Quick Response Code Indonesia Standard    |        1       | 14       |
| :flag\_id: |               Indonesian Rupiah               |                  |              Bank Transfers              |                                              |        2       | 14       |
| :flag\_id: |               Indonesian Rupiah               |                  |                 E Wallet                 |                                              |        3       | 14       |
|    🇰🇪    |                 Kenya Shilling                |                  |                   MOMO                   |                 Mobile Money                 |                | 15       |
| :flag\_gh: |                  Ghanian Cedi                 |                  |                   MOMO                   |                 Mobile Money                 |                | 16       |
| :flag\_za: |               South African Rand              |                  |           <p>Instant<br>EFT</p>          |           Electronic Fund Transfer           |        2       | 17       |
|    🇷🇼    |                 Rwandan Franc                 |                  |                   MOMO                   |                 Mobile Money                 |                | 18       |
|    🇨🇲    |           Central African CFA franc           |                  |                   MOMO                   |                 Mobile Money                 |                | 19       |
|    🇬🇧    |              Great Britain Pounds             |                  |          Faster Payment Service          |             Instant Bank Transfer            |                | 20       |
| :flag\_us: |             United States Dollars             |                  |               ACH and Wire               |           Automated Clearing House           |                | 21       |
|    🇧🇼    |                 Botswana Pula                 |                  |                   MOMO                   |                 Mobile Money                 |                | 22       |
|    🇲🇼    |                Malawian Kwacha                |                  |                   MOMO                   |                 Mobile Money                 |                | 23       |
|    🇹🇿    |               Tanzanian Shilling              |                  |                   MOMO                   |                 Mobile Money                 |                | 24       |
|    🇺🇬    |                Ugandan Shilling               |                  |                   MOMO                   |                 Mobile Money                 |                | 25       |
|    🇿🇲    |                 Zambian Kwacha                |                  |                   MOMO                   |                 Mobile Money                 |                | 26       |
| :flag\_th: |                   Thai Baht                   |                  |                coming soon               |                                              |                | 27       |
|    🇲🇾    |               Malaysian Ringgit               |                  |                coming soon               |                                              |                | 28       |
| :flag\_ar: |                 Argentine Peso                |                  |                   Khipu                  |             Instant Bank Transfer            |                | 29       |
|    🇦🇺    |               Australian Dollar               |                  |                coming soon               |                                              |                | 30       |
| :flag\_eg: |                 Egyptian Pound                |                  |                coming soon               |                                              |                | 31       |
| :flag\_lk: |               Sri Lankan Rupees               |                  |                coming soon               |                                              |                | 32       |
|    🇵🇱    |                  Polish Zloty                 |                  |                   BLIK                   |             Instant Bank Transfer            |                | 33       |
|    🇹🇼    |               New Taiwan Dollar               |                  |                coming soon               |                                              |                | 34       |
|    🇸🇬    |                Singapore Dollar               |                  |                coming soon               |                                              |                | 35       |
|    🇳🇿    |               New Zealand Dollar              |                  |                coming soon               |                                              |                | 36       |
|    🇯🇵    |                  Japanese Yen                 |                  |                coming soon               |                                              |                | 37       |
|    🇰🇷    |                South Korean Won               |                  |                coming soon               |                                              |                | 38       |
|    🇧🇯    |         West African CFA Franc (Benin)        |                  |                   MOMO                   |                 Mobile Money                 |                | 39       |
|    🇨🇩    |                Congolese Franc                |                  |                   MOMO                   |                 Mobile Money                 |                | 40       |
|    🇬🇦    |       Central African CFA Franc (Gabon)       |                  |              Bank Transfers              |                                              |                | 41       |
|    🇨🇬    | Central African CFA franc (Republic of Congo) |                  |              Bank Transfers              |                                              |                | 42       |
|    🇪🇨    |         United States Dollar (Ecuador)        |                  |              Bank Transfers              |                                              |                | 43       |
|    🇵🇾    |               Paraguayan Guarani              |                  |              Bank Transfers              |                                              |                | 44       |
|    🇺🇾    |                 Uruguayan Peso                |                  |              Bank Transfers              |                                              |                | 45       |
|    🇵🇦    |         United States Dollar (Panama)         |                  |              Bank Transfers              |                                              |                | 46       |
|    🇨🇷    |               Costa Rican Colón               |                  |              Bank Transfers              |                                              |                | 47       |
|    🇬🇹    |               Guatemalan Quetzal              |                  |              Bank Transfers              |                                              |                | 48       |
|    🇸🇻    |       United States Dollar (El Salvador)      |                  |              Bank Transfers              |                                              |                | 49       |
|    🇨🇦    |                Canadian Dollar                |                  |                  Interac                 |                                              |                | 50       |
|    🇧🇴    |               Bolivian Boliviano              |                  |              Bank Transfers              |                                              |                | 51       |
|    🇻🇪    |       United States Dollar (El Salvador)      |                  |              Bank Transfers              |                                              |                | 53       |
