import { signRequest, sendRequest } from './helpers.js';
import { apiKey, traderBaseUrl } from './configs.js';

// GET request using the example of getting a profile
async function getProfileInfo() {
  const request = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;',
    },
  };
  const url = '/api/profile';
  signRequest(apiKey, url, request);
  await sendRequest(`${traderBaseUrl}${url}`, request, 'GetProfileRequest');
}

await getProfileInfo();
