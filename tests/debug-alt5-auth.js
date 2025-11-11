import { alt5TradingService } from './server/services/alt5-trading-service.ts';

async function debugAuth() {
    console.log('Starting ALT5 authentication debug...');
    
    try {
        const result = await alt5TradingService.authenticate();
        console.log('Authentication result:', result);
        
        if (result) {
            console.log('✅ Authentication successful!');
        } else {
            console.log('❌ Authentication failed');
        }
    } catch (error) {
        console.error('❌ Authentication error:', error);
    }
}

debugAuth();
