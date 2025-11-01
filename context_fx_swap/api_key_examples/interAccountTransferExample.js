import { signRequest, sendRequest, authenticator } from './helpers.js';
import { apiKey, traderBaseUrl, authenticatorSecret } from './configs.js';

async function createInterAccountTransfer(fromAccountId, toAccountId, secret) {
  const body = {
    code: authenticator.generate(secret), // authenticator code
    assetId: 'usd',
    amount: 1.5,
    accountId: toAccountId, // account id TO which you want to send the money,
  };

  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;',
    },
    body: JSON.stringify(body),
  };

  const url = `/api/wallet/${fromAccountId}/inter-account-transfer`;
  signRequest(apiKey, url, request);
  await sendRequest(`${traderBaseUrl}${url}`, request, 'InterAccountTransferRequest');
}

await createInterAccountTransfer(
  '68266eab-3a6c-46e4-92eb-a4fdd65f2d99',
  '7e7ef8db-30e1-411d-b376-3923f520c18a',
  authenticatorSecret,
);
