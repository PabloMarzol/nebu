/**
 * NebulaX Exchange Manual API Testing
 * Direct API endpoint validation
 */

const http = require('http');
const https = require('https');

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://nebulax-exchange.replit.app' 
  : 'http://localhost:5000';

console.log(`🔍 Testing API endpoints on: ${BASE_URL}`);

// Test endpoints
const endpoints = [
  { method: 'GET', path: '/api/health', name: 'Health Check' },
  { method: 'GET', path: '/api/metrics', name: 'System Metrics' },
  { method: 'GET', path: '/api/security', name: 'Security Status' },
  { method: 'GET', path: '/api/market-data', name: 'Market Data' },
  { method: 'GET', path: '/api/orderbook', name: 'Order Book' },
  { method: 'GET', path: '/api/trades', name: 'Trade History' },
  { method: 'GET', path: '/api/network/info', name: 'Network Info' },
  { method: 'GET', path: '/api/auth/user', name: 'Auth Status' }
];

let testResults = [];
let completedTests = 0;

function makeRequest(endpoint) {
  return new Promise((resolve) => {
    const url = new URL(BASE_URL + endpoint.path);
    const client = url.protocol === 'https:' ? https : http;
    
    const startTime = Date.now();
    
    const req = client.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NebulaX-Test-Suite/1.0'
      },
      timeout: 5000
    }, (res) => {
      const responseTime = Date.now() - startTime;
      let data = '';
      
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const result = {
          endpoint: endpoint.name,
          path: endpoint.path,
          method: endpoint.method,
          status: res.statusCode,
          responseTime,
          success: res.statusCode >= 200 && res.statusCode < 500,
          contentType: res.headers['content-type'],
          dataSize: data.length
        };
        
        try {
          if (res.headers['content-type']?.includes('application/json')) {
            result.jsonResponse = JSON.parse(data);
          }
        } catch (e) {
          result.parseError = 'Invalid JSON response';
        }
        
        testResults.push(result);
        resolve(result);
      });
    });
    
    req.on('error', (error) => {
      const result = {
        endpoint: endpoint.name,
        path: endpoint.path,
        method: endpoint.method,
        status: 0,
        responseTime: Date.now() - startTime,
        success: false,
        error: error.message
      };
      
      testResults.push(result);
      resolve(result);
    });
    
    req.on('timeout', () => {
      req.destroy();
      const result = {
        endpoint: endpoint.name,
        path: endpoint.path,
        method: endpoint.method,
        status: 0,
        responseTime: 5000,
        success: false,
        error: 'Request timeout'
      };
      
      testResults.push(result);
      resolve(result);
    });
    
    req.end();
  });
}

async function runTests() {
  console.log(`\n📋 Testing ${endpoints.length} API endpoints...\n`);
  
  for (const endpoint of endpoints) {
    console.log(`⏳ Testing: ${endpoint.name} (${endpoint.method} ${endpoint.path})`);
    
    const result = await makeRequest(endpoint);
    
    if (result.success) {
      console.log(`✅ ${endpoint.name} - ${result.status} (${result.responseTime}ms)`);
    } else {
      console.log(`❌ ${endpoint.name} - ${result.error || result.status} (${result.responseTime}ms)`);
    }
    
    completedTests++;
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 API TEST RESULTS');
  console.log('='.repeat(60));
  
  const successfulTests = testResults.filter(r => r.success).length;
  const averageResponseTime = testResults.reduce((sum, r) => sum + r.responseTime, 0) / testResults.length;
  
  console.log(`Total Endpoints Tested: ${testResults.length}`);
  console.log(`Successful Responses: ${successfulTests}`);
  console.log(`Failed Responses: ${testResults.length - successfulTests}`);
  console.log(`Success Rate: ${Math.round((successfulTests / testResults.length) * 100)}%`);
  console.log(`Average Response Time: ${Math.round(averageResponseTime)}ms`);
  
  // Detailed results
  console.log('\n📋 Detailed Results:');
  testResults.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.endpoint.padEnd(20)} | ${result.status.toString().padStart(3)} | ${result.responseTime.toString().padStart(4)}ms`);
  });
  
  // Performance analysis
  const slowEndpoints = testResults.filter(r => r.responseTime > 1000);
  if (slowEndpoints.length > 0) {
    console.log('\n⚠️  Slow Endpoints (>1000ms):');
    slowEndpoints.forEach(r => {
      console.log(`   ${r.endpoint}: ${r.responseTime}ms`);
    });
  }
  
  // Error analysis
  const errorEndpoints = testResults.filter(r => !r.success);
  if (errorEndpoints.length > 0) {
    console.log('\n❌ Failed Endpoints:');
    errorEndpoints.forEach(r => {
      console.log(`   ${r.endpoint}: ${r.error || 'HTTP ' + r.status}`);
    });
  }
  
  console.log('\n🏁 API testing completed.');
  
  // Return success status
  process.exit(successfulTests === testResults.length ? 0 : 1);
}

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled promise rejection:', err);
  process.exit(1);
});

// Start tests
runTests().catch(error => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});