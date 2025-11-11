#!/usr/bin/env node

/**
 * Test script to validate signature processing logic
 * This tests the critical fix for signature recovery parameter extraction
 */

// const { ethers } = require('ethers');
const { ethers } = require('ethers');
// Test signature processing logic
async function testSignatureProcessing() {
  console.log('🧪 Testing Signature Processing Logic\n');

  // Create a test signature using ethers
  const privateKey = '0x' + '1'.repeat(64); // Test private key
  const wallet = new ethers.Wallet(privateKey);

  // Create a test message to sign
  const message = {
    domain: {
      name: 'Test',
      version: '1',
      chainId: 1,
      verifyingContract: '0x0000000000000000000000000000000000000000'
    },
    types: {
      Test: [
        { name: 'value', type: 'uint256' }
      ]
    },
    message: {
      value: '1000000000000000000' // 1 ETH in wei
    }
  };

  // Sign the typed data
  const signature = await wallet.signTypedData(
    message.domain,
    message.types,
    message.message
  );

  console.log('📝 Original Signature:', signature);
  console.log('🔑 Expected Recovery ID:', 28); // Should be 28 for this test

  // Test the FIXED signature processing logic
  const sigBytes = ethers.getBytes(signature);
  const r = ethers.dataSlice(sigBytes, 0, 32);
  const s = ethers.dataSlice(sigBytes, 32, 64);
  const v = sigBytes[64] === 0 ? 27 : 28; // FIXED: Direct byte comparison

  console.log('\n🔧 Signature Processing Results:');
  console.log('  r:', ethers.hexlify(r));
  console.log('  s:', ethers.hexlify(s));
  console.log('  v:', v);
  console.log('  Raw recovery byte:', sigBytes[64]);

  // Verify the signature
  const recoveredAddress = ethers.verifyTypedData(
    message.domain,
    message.types,
    message.message,
    { r: ethers.hexlify(r), s: ethers.hexlify(s), v }
  );

  console.log('\n✅ Verification Results:');
  console.log('  Recovered Address:', recoveredAddress);
  console.log('  Original Address: ', wallet.address);
  console.log('  Signature Valid:  ', recoveredAddress.toLowerCase() === wallet.address.toLowerCase());

  // Test the BROKEN logic (what we fixed)
  const brokenV = ethers.hexlify(sigBytes[64]) === '0x00' ? 27 : 28;
  console.log('\n❌ Broken Logic Test (what we fixed):');
  console.log('  Broken v value:', brokenV);
  console.log('  Would cause verification failure:', brokenV !== v);

  return {
    signature,
    processed: { r: ethers.hexlify(r), s: ethers.hexlify(s), v },
    valid: recoveredAddress.toLowerCase() === wallet.address.toLowerCase()
  };
}

// Run the test
if (require.main === module) {
  try {
    const result = testSignatureProcessing();
    console.log('\n🎉 Test completed successfully!');
    process.exit(result.valid ? 0 : 1);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

module.exports = { testSignatureProcessing };
