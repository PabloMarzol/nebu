console.log('Testing ALT5 trading service...');
const { alt5TradingService } = require('../server/services/alt5-trading-service');

async function testAlt5Service() {
    try {
        console.log('Attempting to authenticate with ALT5 master account...');
        const authResult = await alt5TradingService.authenticate();
        console.log('Auth result:', authResult);
        
        if (authResult) {
            console.log('✅ ALT5 trading service authentication successful!');
        } else {
            console.log('❌ ALT5 trading service authentication failed');
        }
    } catch (error) {
        console.error('❌ Auth error:', error.message);
        console.error('Full error:', error);
    }
}

testAlt5Service();
