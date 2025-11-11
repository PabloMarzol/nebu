const testAlt5Flow = async () => {
  try {
    console.log('Testing ALT5 Trading On-Ramp Flow...');
    
    // Test 1: Check if service is available
    console.log('\n1. Testing service availability...');
    const testResponse = await fetch('http://localhost:5000/api/alt5-trading/test');
    const testResult = await testResponse.json();
    console.log('Test endpoint result:', testResult);
    
    if (!testResult.success) {
      console.log('❌ Service test failed - please check ALT5 configuration');
      return;
    }
    
    // Test 2: Try to create an order
    console.log('\n2. Testing order creation...');
    const orderData = {
      gbpAmount: 100,
      destinationWallet: "0x742d35Cc6634C0532925a3b844Bc454e443867dd",
      targetToken: "USDT",
      userId: "test-user-123",
      clientOrderId: `test-order-${Date.now()}`,
      paymentMethod: "bank_transfer"
    };
    
    console.log('Sending order data:', orderData);
    
    const orderResponse = await fetch('http://localhost:5000/api/alt5-trading/on-ramp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    
    const orderResult = await orderResponse.json();
    console.log('Order creation result:', orderResult);
    
    if (orderResult.success) {
      console.log('✅ Order created successfully!');
      console.log('Order ID:', orderResult.data.orderId);
      console.log('Bank details:', orderResult.data.bankTransferDetails);
      
      // Test 3: Check order status
      console.log('\n3. Testing order status check...');
      const statusResponse = await fetch(`http://localhost:5000/api/alt5-trading/order-status/${orderResult.data.orderId}`);
      const statusResult = await statusResponse.json();
      console.log('Order status result:', statusResult);
    } else {
      console.log('❌ Order creation failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

// Run the test
testAlt5Flow();
