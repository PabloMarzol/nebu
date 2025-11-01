#!/usr/bin/env node

/**
 * Debug NebulaX Deployment Script
 * Ultra-simple version to identify the exact failure point
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 NebulaX Debug Deployment Script');
console.log('====================================');
console.log('Starting deployment check...\n');

try {
  // Step 1: Basic environment info
  console.log('📋 Step 1: Environment Info');
  console.log('- Node version:', process.version);
  console.log('- Platform:', process.platform);
  console.log('- Current directory:', process.cwd());
  console.log('- Script location:', __filename);
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'not set');
  console.log('✅ Environment info collected\n');

  // Step 2: Check for required files
  console.log('📋 Step 2: Checking Required Files');
  const requiredFiles = ['package.json', 'render.yaml', 'server/index.ts', 'client/index.html'];
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    const exists = fs.existsSync(file);
    console.log(`- ${file}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
    if (!exists) allFilesExist = false;
  }
  
  if (!allFilesExist) {
    console.log('\n❌ Some required files are missing!');
    process.exit(1);
  }
  console.log('✅ All required files present\n');

  // Step 3: Check package.json
  console.log('📋 Step 3: Reading package.json');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('- Project name:', packageJson.name);
  console.log('- Version:', packageJson.version);
  console.log('- Dependencies count:', Object.keys(packageJson.dependencies || {}).length);
  console.log('✅ package.json read successfully\n');

  // Step 4: Check environment
  console.log('📋 Step 4: Environment Check');
  console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '✅ SET' : '❌ NOT SET');
  console.log('- PORT:', process.env.PORT || '5000 (default)');
  console.log('✅ Environment check completed\n');

  // Step 5: Create simple deployment info
  console.log('📋 Step 5: Creating Deployment Info');
  const deploymentInfo = {
    timestamp: new Date().toISOString(),
    status: 'ready_for_deployment',
    nodeVersion: process.version,
    platform: process.platform,
    environment: process.env.NODE_ENV || 'development'
  };
  
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log('✅ deployment-info.json created\n');

  console.log('🎉 DEPLOYMENT PREPARATION COMPLETE!');
  console.log('\nNext steps:');
  console.log('1. Your application is ready for deployment!');
  console.log('2. Use the Render deploy button in DEPLOYMENT_SUMMARY.md');
  console.log('3. Configure your API keys in the Render dashboard');
  console.log('4. Monitor deployment at: https://dashboard.render.com');

} catch (error) {
  console.error('\n❌ DEPLOYMENT SCRIPT FAILED!');
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
