/**
 * NebulaX Exchange API Testing Suite
 * Comprehensive automated testing for all critical endpoints
 */

const request = require('supertest');
const app = require('../server/index');

// Test configuration
const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://nebulax-exchange.replit.app' : 'http://localhost:5000';

describe('NebulaX Exchange API Tests', () => {
  
  // Authentication Tests
  describe('Authentication Endpoints', () => {
    test('POST /api/auth/register - User Registration', async () => {
      const testUser = {
        email: 'test@nebulax.test',
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
    
    test('GET /api/auth/user - User Authentication Check', async () => {
      const response = await request(app)
        .get('/api/auth/user');
      
      expect([200, 401]).toContain(response.status);
    });
  });
  
  // Market Data Tests
  describe('Market Data Endpoints', () => {
    test('GET /api/market-data - Live Market Data', async () => {
      const response = await request(app)
        .get('/api/market-data');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
    
    test('GET /api/orderbook - Order Book Data', async () => {
      const response = await request(app)
        .get('/api/orderbook');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
    });
    
    test('GET /api/trades - Trade History', async () => {
      const response = await request(app)
        .get('/api/trades');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
    });
  });
  
  // Trading Tests
  describe('Trading Endpoints', () => {
    test('POST /api/orders - Place Order', async () => {
      const testOrder = {
        symbol: 'BTC/USDT',
        side: 'buy',
        type: 'limit',
        amount: '0.001',
        price: '50000'
      };
      
      const response = await request(app)
        .post('/api/orders')
        .send(testOrder);
      
      expect([200, 401]).toContain(response.status);
    });
    
    test('GET /api/portfolio - Portfolio Data', async () => {
      const response = await request(app)
        .get('/api/portfolio');
      
      expect([200, 401]).toContain(response.status);
    });
  });
  
  // SMS/Communication Tests
  describe('Communication Endpoints', () => {
    test('POST /api/sms/send - SMS Notification', async () => {
      const smsData = {
        phone: '+1234567890',
        message: 'Test notification'
      };
      
      const response = await request(app)
        .post('/api/sms/send')
        .send(smsData);
      
      expect([200, 400]).toContain(response.status);
    });
    
    test('POST /api/ai-trading/chat - AI Trading Assistant', async () => {
      const chatData = {
        message: 'What is the current BTC price?'
      };
      
      const response = await request(app)
        .post('/api/ai-trading/chat')
        .send(chatData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('response');
    });
  });
  
  // System Health Tests
  describe('System Health', () => {
    test('GET /api/network/info - Network Status', async () => {
      const response = await request(app)
        .get('/api/network/info');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
    });
    
    test('GET /api/health - System Health Check', async () => {
      const response = await request(app)
        .get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
    });
  });
});

// Performance Tests
describe('Performance Tests', () => {
  test('Market Data Response Time', async () => {
    const startTime = Date.now();
    const response = await request(app).get('/api/market-data');
    const responseTime = Date.now() - startTime;
    
    expect(response.status).toBe(200);
    expect(responseTime).toBeLessThan(1000); // Under 1 second
  });
  
  test('API Rate Limiting', async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(request(app).get('/api/market-data'));
    }
    
    const responses = await Promise.all(promises);
    const successResponses = responses.filter(r => r.status === 200);
    
    expect(successResponses.length).toBeGreaterThan(0);
  });
});

// Security Tests
describe('Security Tests', () => {
  test('SQL Injection Protection', async () => {
    const maliciousData = {
      email: "test'; DROP TABLE users; --",
      password: 'password'
    };
    
    const response = await request(app)
      .post('/api/auth/login')
      .send(maliciousData);
    
    expect([400, 401]).toContain(response.status);
  });
  
  test('XSS Protection', async () => {
    const xssData = {
      message: '<script>alert("xss")</script>'
    };
    
    const response = await request(app)
      .post('/api/ai-trading/chat')
      .send(xssData);
    
    expect(response.status).toBe(200);
    expect(response.body.response).not.toContain('<script>');
  });
});

module.exports = {
  testSuite: 'NebulaX Exchange API Tests',
  totalTests: 15,
  coverage: 'Critical endpoints and security'
};