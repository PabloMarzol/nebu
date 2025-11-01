import { signRequest, sendRequest } from './helpers.js';
import { apiKey, traderBaseUrl } from './configs.js';

async function createOrder(accountId) {
  const body = {
    order: {
      instrument: 'xrp_usd',
      type: 'buy',
      amount: 1,
      price: 0.01,
      isLimit: true,
      isStop: false,
      activationPrice: 0,
    },
  };
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;',
    },
    body: JSON.stringify(body),
  };
  const url = `/api/${accountId}/order`;
  signRequest(apiKey, url, request);
  await sendRequest(`${traderBaseUrl}${url}`, request, 'CreateOrderRequest');
}

await createOrder('');
