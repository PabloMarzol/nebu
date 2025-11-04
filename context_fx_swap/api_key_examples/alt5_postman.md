{
	"info": {
		"_postman_id": "0349468b-cf09-4155-a715-6d412bff0bb5",
		"name": "API documentation",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "877061"
	},
	"item": [
		{
			"name": "Auth",
			"item": [
				{
					"name": "Login",
					"item": [
						{
							"name": "Login 1st step",
							"request": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"email\": \"{{email}}\",\n    \"password\": \"{{password}}\"\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{baseUrl}}/identity/api/v2/identity/{{securityGroup}}/users/signin/",
									"host": [
										"{{baseUrl}}"
									],
									"path": [
										"identity",
										"api",
										"v2",
										"identity",
										"{{securityGroup}}",
										"users",
										"signin",
										""
									]
								},
								"description": "First step of sign-in (email + password)"
							},
							"response": []
						},
						{
							"name": "Login 2nd step: 2FA Confirmation",
							"event": [
								{
									"listen": "prerequest",
									"script": {
										"exec": [
											""
										],
										"type": "text/javascript",
										"packages": {}
									}
								},
								{
									"listen": "test",
									"script": {
										"exec": [
											"// Stores the user id in an environment or global variable",
											"var responseBody = pm.response.json();",
											"var userId = responseBody.id;",
											"pm.environment.set(\"userId\", userId);",
											""
										],
										"type": "text/javascript",
										"packages": {}
									}
								}
							],
							"request": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"VerificationCode\": \"12345\"\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{baseUrl}}/identity/api/v2/identity/{{securityGroup}}/users/signin/2fa",
									"host": [
										"{{baseUrl}}"
									],
									"path": [
										"identity",
										"api",
										"v2",
										"identity",
										"{{securityGroup}}",
										"users",
										"signin",
										"2fa"
									],
									"query": [
										{
											"key": "",
											"value": "",
											"disabled": true
										}
									]
								},
								"description": "Second step of sign-in (confirm login with 2fa). You **must** attach the `Identity.TwoFactorUserId`\n\ncookie received in the previous step."
							},
							"response": []
						},
						{
							"name": "Get my Account",
							"event": [
								{
									"listen": "test",
									"script": {
										"exec": [
											"var response = pm.response.json();",
											"var accountId = response.data[0] && response.data[0].id;",
											"pm.environment.set(\"accountId\", accountId);",
											""
										],
										"type": "text/javascript",
										"packages": {}
									}
								}
							],
							"protocolProfileBehavior": {
								"disableBodyPruning": true
							},
							"request": {
								"method": "GET",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{baseUrl}}/frontoffice/api/accounts",
									"host": [
										"{{baseUrl}}"
									],
									"path": [
										"frontoffice",
										"api",
										"accounts"
									],
									"query": [
										{
											"key": "OwnerId",
											"value": "{{userId}}",
											"description": "Optional. Can be used if you have accounts of other users under your control to filter the accounts.",
											"disabled": true
										}
									]
								},
								"description": "This endpoint will help you to find you accountId"
							},
							"response": []
						}
					],
					"description": "### This section contains all endpoints you need to log into exchange and identify your accountId\n\nAuthentication consists of 2 steps\n\n- First step is login + password sign-in. In response you'll receive a `Identity.TwoFactorUserId` cookie which holds the unique key which is used in the second step of authentication\n    \n- Second step is confirmation your login by 2fa code. You must attach the cookie from the first step and send the 2fa code. If you're going to automate the process you must switch the 2fa provider from Email to Authenticator in the Frontend, during this process you'll receive the QR and a secret under it. Use this secret to generate a 2fa token by any TOTP library."
				}
			]
		},
		{
			"name": "Trade",
			"item": [
				{
					"name": "Create Order",
					"protocolProfileBehavior": {
						"protocolVersion": "http2"
					},
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"Order\": {\n        \"Instrument\": \"xrp_usd\",\n        \"Type\": \"buy\", // buy | sell\n        \"Amount\": 0.01,\n        \"Price\": 0.01, // Leave empty for market orders\n        \"ActivationPrice\": null, // set only for stop orders\n        \"IsLimit\": true, // true for limit and false for market orders\n        \"IsStop\": false,\n        \"TimeInForce\": null, // goodTillCancel = 0, immediateOrCancel = 1, fillOrKill = 2. Only limit orders support GTC TIM. By default GTC for limit and IOC for market orders\n        \"RequestedQuoteAmount\": null // either amount or RequestedQuoteAmount must be specified. This field is used to buy the base asset for a specified amount of the quote asset. E.g. for btc_usdt, RequestedQuoteAmount = 1000 means buying BTC for the equivalent of 1000 usdt\n    }\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{baseUrl}}/frontoffice/api/{{accountId}}/order",
							"host": [
								"{{baseUrl}}"
							],
							"path": [
								"frontoffice",
								"api",
								"{{accountId}}",
								"order"
							]
						}
					},
					"response": []
				},
				{
					"name": "Cancel Order",
					"request": {
						"method": "DELETE",
						"header": [],
						"url": {
							"raw": "{{baseUrl}}/frontoffice/api/{{accountId}}/orders/c4f614dd-ea56-47e0-90fd-2433cc9df7cf",
							"host": [
								"{{baseUrl}}"
							],
							"path": [
								"frontoffice",
								"api",
								"{{accountId}}",
								"orders",
								"c4f614dd-ea56-47e0-90fd-2433cc9df7cf"
							]
						},
						"description": "Specify the orderId of the order to be cancelled at the end of the URL."
					},
					"response": []
				},
				{
					"name": "Cancel all orders",
					"request": {
						"method": "DELETE",
						"header": [],
						"url": {
							"raw": "{{baseUrl}}/frontoffice/api/{{accountId}}/orders",
							"host": [
								"{{baseUrl}}"
							],
							"path": [
								"frontoffice",
								"api",
								"{{accountId}}",
								"orders"
							],
							"query": [
								{
									"key": "market",
									"value": "xrp_usd",
									"description": "Optional.",
									"disabled": true
								}
							]
						},
						"description": "Cancell all your orders if market is not specified or all of your orders for the specified market if specified"
					},
					"response": []
				},
				{
					"name": "My Orders",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseUrl}}/frontoffice/api/{{accountId}}/orders/my",
							"host": [
								"{{baseUrl}}"
							],
							"path": [
								"frontoffice",
								"api",
								"{{accountId}}",
								"orders",
								"my"
							]
						},
						"description": "Returns a list of your active orders. Сompleted / canceled / rejected and other orders in a final state are not included. To retrieve such orders use `Order History` endpoint."
					},
					"response": []
				},
				{
					"name": "TradeHistory",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"method": "GET",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{baseUrl}}/frontoffice/api/{{accountId}}/trade_history?ascOrder=TradeSeq",
							"host": [
								"{{baseUrl}}"
							],
							"path": [
								"frontoffice",
								"api",
								"{{accountId}}",
								"trade_history"
							],
							"query": [
								{
									"key": "market",
									"value": "",
									"description": "Optional. Instrument name.",
									"disabled": true
								},
								{
									"key": "side",
									"value": "sell",
									"description": "Optional. buy = 0 | sell = 1.",
									"disabled": true
								},
								{
									"key": "startDate",
									"value": "2025-01-02T13:00:00+01:00",
									"description": "Optional.",
									"disabled": true
								},
								{
									"key": "endDate",
									"value": "2025-01-02T13:05:01+01:00",
									"description": "Optional.",
									"disabled": true
								},
								{
									"key": "ascOrder",
									"value": "TradeSeq",
									"description": "Optional. TradeSeq | TradeTime | Amount | Instrument | Side | ExecutionPrice | Commission. This parameter is case sensitive.\n"
								},
								{
									"key": "descOrder",
									"value": "",
									"description": "Optional. TradeSeq | TradeTime | Amount | Instrument | Side | ExecutionPrice | Commission. This parameter is case sensitive.\n",
									"disabled": true
								},
								{
									"key": "page",
									"value": "1",
									"description": "Optional. Page number.",
									"disabled": true
								},
								{
									"key": "perPage",
									"value": "15",
									"description": "Optional. Page size. Max is 250, default is 15.",
									"disabled": true
								}
							]
						},
						"description": "Return your trade history. Default page size is 15, max size is 250. Pages numbering starts at 1."
					},
					"response": []
				},
				{
					"name": "Orders History",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseUrl}}/frontoffice/api/{{accountId}}/order_history?ascOrder=CreatedAt",
							"host": [
								"{{baseUrl}}"
							],
							"path": [
								"frontoffice",
								"api",
								"{{accountId}}",
								"order_history"
							],
							"query": [
								{
									"key": "startDate",
									"value": "2025-01-01T13:05:01+01:00",
									"description": "Optional.",
									"disabled": true
								},
								{
									"key": "endDate",
									"value": "2025-01-02T13:05:01+01:00",
									"description": "Optional.",
									"disabled": true
								},
								{
									"key": "ascOrder",
									"value": "CreatedAt",
									"description": "Optional. Status | CreatedAt. This parameter is case sensitive."
								},
								{
									"key": "descOrder",
									"value": "Status",
									"description": "Optional. Status | CreatedAt. This parameter is case sensitive.",
									"disabled": true
								},
								{
									"key": "isHideCanceled",
									"value": "",
									"description": "Optional. boolean, nullable, false by default",
									"disabled": true
								},
								{
									"key": "Page",
									"value": "1",
									"description": "Optional. Page number.",
									"disabled": true
								},
								{
									"key": "PerPage",
									"value": "15",
									"description": "Optional. Page size. Max is 250, default is 15.",
									"disabled": true
								}
							]
						}
					},
					"response": []
				}
			],
			"description": "## Trading section"
		},
		{
			"name": "Transfers",
			"item": [
				{
					"name": "List of Payment Systems",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseUrl}}/wallet/api/v2/payment_systems",
							"host": [
								"{{baseUrl}}"
							],
							"path": [
								"wallet",
								"api",
								"v2",
								"payment_systems"
							]
						},
						"description": "Returns the list of the available paymentSystems. PaymentSystem may support multiple assets."
					},
					"response": []
				},
				{
					"name": "Get deposit address",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{baseUrl}}/frontoffice/api/wallet/{{accountId}}/deposit?paymentSystem=FireblocksBitcoin&assetId=btc",
							"host": [
								"{{baseUrl}}"
							],
							"path": [
								"frontoffice",
								"api",
								"wallet",
								"{{accountId}}",
								"deposit"
							],
							"query": [
								{
									"key": "paymentSystem",
									"value": "FireblocksBitcoin",
									"description": "Required. Use `List of Payment Systems` endpoint to find supported payment systems."
								},
								{
									"key": "assetId",
									"value": "btc",
									"description": "Required."
								}
							]
						},
						"description": "Returns the deposit address for the specified asset & payment system. For wire transfers returns the bank information."
					},
					"response": []
				},
				{
					"name": "Create bank wire transfer deposit request",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    // you must get the accountInfo from GET deposit request first, which returns to you the bank details for money transfering\n    \"accountInfo\": {\n        \"beneficiary\": \"Alt 5 Sigma Canada\",\n        \"beneficiaryAddress\": \"3500 Boulevard de Maisonneuve Ouest, Suite 2401, Westmount, Quebec Canada, H3Z 3G1\",\n        \"bankName\": \"bankname1\"\n    },\n    \"amount\": \"1\",\n    \"paymentSystem\": \"BankWireTransfer\",\n    \"assetId\": \"usd\",\n    \"nonce\": \"{{$guid}}\" // generate guid here, this field is used to provide idempotency. In case you haven't got a response from the server, just send the request with the same nonce, we have a guarantee that your request will be processed only once.\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{baseUrl}}/frontoffice/api/wallet/{{accountId}}/deposit",
							"host": [
								"{{baseUrl}}"
							],
							"path": [
								"frontoffice",
								"api",
								"wallet",
								"{{accountId}}",
								"deposit"
							]
						},
						"description": "Create a request to process a manually initiated bank wire. Your request will be handled by one of the exchange managers."
					},
					"response": []
				}
			]
		}
	],
	"event": [
		{
			"listen": "prerequest",
			"script": {
				"type": "text/javascript",
				"exec": [
					""
				]
			}
		},
		{
			"listen": "test",
			"script": {
				"type": "text/javascript",
				"exec": [
					""
				]
			}
		}
	],
	"variable": [
		{
			"key": "securityGroup",
			"value": "exchange-users",
			"type": "string"
		},
		{
			"key": "email",
			"value": "email",
			"type": "string"
		},
		{
			"key": "password",
			"value": "password",
			"type": "string"
		},
		{
			"key": "baseUrl",
			"value": "https://exchange.digitalpaydev.com/",
			"type": "string"
		}
	]
}