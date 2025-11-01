Here you can find examples of the different requests. Basically you can use swagger and adjust code for any request, but if you run into some difficulties during integration, ask our support and we'll add an example for your task. 

If you want to run an example and see the result, follow the steps below

1. Set up environment in `config.js`. Authenticator secrect is required for withdrawal operations only. If you already have a configured authenticator and don't know how to fetch a secret from it, you can switch back to email and then to authenticator again on the profile -> security tab. You'll find the secret right under the QR code.
2. Run `npm i` from the root folder
3. Run `node {someExample.js}` to see the result, e.g. `node createOrderExample.js`

Below you'll find links to swagger specification. Please not that you will only be shown those endpoints to which you have access. So for authorized endpoints you must **log in** first.

Trader Swagger location: https://exchange.digitalpaydev.com/frontoffice/swagger/index.html
Identity Swagger location: https://exchange.digitalpaydev.com/identity/swagger/index.html