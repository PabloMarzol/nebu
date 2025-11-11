#!/usr/bin/env node

/**
 * ALT5 Configuration Validation Script
 * Validates environment variables and tests ALT5 connectivity
 */

// require('dotenv').config();
// const axios = require('axios');
// const speakeasy = require('speakeasy');

import axios from "axios";
import speakeasy from "speakeasy";
import dotenv from "dotenv";
dotenv.config()

console.log('🔍 ALT5 Configuration Validation\n');

// Check environment variables
console.log('📋 Environment Variables Check:');
const requiredVars = [
  'ALT5_TRADING_EMAIL',
  'ALT5_TRADING_PASSWORD',
  'ALT5_TRADING_BASE_URL',
  'ALT5_2FA_TOTP_SECRET_PRODUCTION'
];

const missingVars = [];
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    missingVars.push(varName);
    console.log(`❌ ${varName}: MISSING`);
  } else {
    console.log(`✅ ${varName}: ${varName.includes('SECRET') || varName.includes('PASSWORD') ? '***' : value}`);
  }
});

if (missingVars.length > 0) {
  console.error(`\n❌ Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Test TOTP generation
console.log('\n🔐 TOTP Token Generation Test:');
const secret = process.env.ALT5_2FA_TOTP_SECRET_PRODUCTION;
try {
  const token = speakeasy.totp({
    secret: secret,
    encoding: 'base32'
  });
  console.log(`✅ Generated TOTP token: ${token}`);
} catch (error) {
  console.error(`❌ TOTP generation failed: ${error.message}`);
  process.exit(1);
}

// Test basic connectivity
async function testConnectivity() {
  console.log('\n🌐 Testing ALT5 Connectivity...');
  
  const baseUrl = process.env.ALT5_TRADING_BASE_URL;
  const email = process.env.ALT5_TRADING_EMAIL;
  const password = process.env.ALT5_TRADING_PASSWORD;
  
  try {
    // Test 1: Check if base URL is reachable
    console.log(`Testing base URL: ${baseUrl}`);
    const healthCheck = await axios.get(`${baseUrl}/health`, {
      timeout: 10000,
      validateStatus: () => true
    });
    console.log(`Health check status: ${healthCheck.status}`);
    
    // Test 2: Try authentication flow
    console.log('\n🔑 Testing Authentication Flow...');
    
    // Step 1: Initial login
    const loginResponse = await axios.post(
      `${baseUrl}/identity/api/v2/identity/exchange-users/users/signin/`,
      { email, password },
      { timeout: 10000, validateStatus: () => true }
    );
    
    console.log(`Login response status: ${loginResponse.status}`);
    
    if (loginResponse.status === 200) {
      console.log('✅ Initial login successful');
      
      // Check for 2FA requirement
      const cookies = loginResponse.headers['set-cookie'];
      const twoFactorCookie = cookies?.find(cookie => 
        cookie.includes('Identity.TwoFactorUserId')
      );
      
      if (twoFactorCookie) {
        console.log('✅ 2FA cookie found, proceeding with 2FA');
        
        // Generate TOTP
        const totpToken = speakeasy.totp({
          secret: secret,
          encoding: 'base32'
        });
        
        console.log(`Generated TOTP: ${totpToken}`);
        
        // Step 2: 2FA verification
        const twoFactorResponse = await axios.post(
          `${baseUrl}/identity/api/v2/identity/exchange-users/users/signin/2fa`,
          { VerificationCode: totpToken },
          {
            headers: { Cookie: twoFactorCookie },
            timeout: 10000,
            validateStatus: () => true
          }
        );
        
        console.log(`2FA response status: ${twoFactorResponse.status}`);
        
        if (twoFactorResponse.status === 200) {
          console.log('✅ 2FA verification successful');
          
          // Step 3: Get account info
          const sessionCookies = twoFactorResponse.headers['set-cookie'];
          const sessionToken = sessionCookies?.find(cookie => 
            cookie.includes('.AspNetCore.Identity.Scheme') || 
            cookie.includes('Identity.Session')
          );
          
          if (sessionToken) {
            console.log('✅ Session token obtained');
            
            const accountResponse = await axios.get(
              `${baseUrl}/frontoffice/api/accounts`,
              {
                headers: { Cookie: sessionToken },
                timeout: 10000,
                validateStatus: () => true
              }
            );
            
            console.log(`Account info status: ${accountResponse.status}`);
            
            if (accountResponse.status === 200 && accountResponse.data?.data?.length > 0) {
              console.log(`✅ Account found: ${accountResponse.data.data[0].id}`);
              console.log('\n🎉 All tests passed! ALT5 configuration is valid.');
            } else {
              console.log('⚠️  No accounts found or unexpected response structure');
              console.log('Response:', accountResponse.data);
            }
          } else {
            console.log('⚠️  No session token found in 2FA response');
          }
        } else {
          console.error(`❌ 2FA verification failed: ${twoFactorResponse.status}`);
          console.error('Response:', twoFactorResponse.data);
        }
      } else {
        console.log('⚠️  No 2FA cookie found - account may not require 2FA');
      }
    } else {
      console.error(`❌ Login failed: ${loginResponse.status}`);
      console.error('Response:', loginResponse.data);
    }
    
  } catch (error) {
    console.error(`❌ Connectivity test failed: ${error.message}`);
  }
}

// Run tests
testConnectivity().catch(console.error);
