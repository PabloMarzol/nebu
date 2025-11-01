import fetch from 'node-fetch';
import { createHmac } from 'crypto';

export { authenticator } from 'otplib';

export const signRequest = (apiKey, url, fetchRequest) => {
  const timestamp = Date.now();
  const signatureSource = `${timestamp}${fetchRequest.method}${url}${
    fetchRequest.body || ''
  }`;
  const utf8Encoder = new TextEncoder();
  const signData = utf8Encoder.encode(signatureSource);

  var hmac = createHmac('sha512', apiKey.privateKey);
  const sign = hmac.update(signData).digest('hex').toUpperCase();
  console.log(`signature source: ${signatureSource}`);
  console.log(`signature data: ${signData}`);
  console.log(`generated hmac: ${sign}`);

  fetchRequest.headers ||= {};
  fetchRequest.headers['API-Key'] = apiKey.publicKey;
  fetchRequest.headers['API-Sign'] = sign;
  fetchRequest.headers['API-Timestamp'] = `${timestamp}`;
};

export const sendRequest = async (url, request, requestName) => {
  try {
    var response = await fetch(url, request);
  } catch (error) {
    console.log(`${requestName ? `${requestName} error` : 'error'}: ${error}`);
    throw error;
  }
  console.log(`${requestName || 'Result'}: status:${response.status}\nbody:${JSON.stringify(await response.text())}`);
};
