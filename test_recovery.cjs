const http = require('http');

const data = JSON.stringify({
  paymentIntentId: "pi_3SLUOYDtIRr6guyX1S7tEHVU",
  userId: "cd58399b-b81c-4e1a-bc8c-a41cc76e4325",
  clientOrderId: "FX_1761248519675_9a7334f9",
  fiatAmount: "10.00",
  destinationWallet: "0x3b2495e0f639bd4f942efd6cae2c15caa4efd312",
  targetToken: "USDT"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/recovery/create-order',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', responseData);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(data);
req.end();
