#!/usr/bin/env node

/**
 * Minimal NebulaX Deployment Script
 * Ultra-simple version with no shell commands
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 NebulaX Minimal Deployment Script');
console.log('=====================================');
console.log('Starting deployment validation...\n');

// Simple check function
function check(condition, message) {
  if (condition) {
    console.log(`✅ ${message}`);
    return true;
  } else {
    console.log(`❌ ${message}`);
    return false;
  }
}

try {
  // Step 1: Basic environment info
  console.log('📋 Step 1: Environment Information');
  console.log('- Node version:', process.version);
  console.log('- Platform:', process.platform);
  console.log('- Current directory:', process.cwd());
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'development (default)');
  console.log('');

  // Step 2: Check required files
  console.log('📋 Step 2: Required Files Check');
  const requiredFiles = [
    'package.json',
    'render.yaml', 
    'server/index.ts',
    'client/index.html'
  ];
  
  let allFilesExist = true;
  for (const file of requiredFiles) {
    const exists = fs.existsSync(file);
    if (!check(exists, `${file} exists`)) {
      allFilesExist = false;
    }
  }
  
  if (!allFilesExist) {
    console.log('\n❌ Missing required files - cannot proceed with deployment');
    process.exit(1);
  }
  console.log('');

  // Step 3: Check package.json
  console.log('📋 Step 3: Package Configuration');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log('- Project name:', packageJson.name);
    console.log('- Version:', packageJson.version);
    console.log('- Dependencies:', Object.keys(packageJson.dependencies || {}).length);
    console.log('- Scripts available:', Object.keys(packageJson.scripts || {}).length);
    console.log('✅ Package.json validated');
  } catch (error) {
    console.log('❌ Error reading package.json:', error.message);
    process.exit(1);
  }
  console.log('');

  // Step 4: Check environment
  console.log('📋 Step 4: Environment Variables');
  console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configured' : '❌ Not set');
  console.log('- PORT:', process.env.PORT || '5000 (default)');
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'development (default)');
  console.log('✅ Environment check completed');
  console.log('');

  // Step 5: Create deployment info
  console.log('📋 Step 5: Creating Deployment Summary');
  const deploymentInfo = {
    timestamp: new Date().toISOString(),
    status: 'ready_for_deployment',
    nodeVersion: process.version,
    platform: process.platform,
    environment: process.env.NODE_ENV || 'development',
    databaseConfigured: !!process.env.DATABASE_URL,
    port: process.env.PORT || 5000
  };
  
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log('✅ Deployment info saved to deployment-info.json');
  console.log('');

  console.log('🎉 DEPLOYMENT VALIDATION COMPLETE!');
  console.log('');
  console.log('🚀 READY FOR PRODUCTION DEPLOYMENT!');
  console.log('');
  console.log('Next Steps:');
  console.log('1. ✅ Your application is validated and ready');
  console.log('2. 🎯 Use the Render deploy button below');
  console.log('3. 🔧 Configure API keys in Render dashboard');
  console.log('4. 📊 Monitor deployment at dashboard.render.com');
  console.log('');
  console.log('🌐 DEPLOY NOW:');
  console.log('https://render.com/deploy?repo=https://github.com/PabloMarzol/nebu');

} catch (error) {
  console.error('\n❌ DEPLOYMENT VALIDATION FAILED!');
  console.error('Error:', error.message);
  if (error.stack) {
    console.error('Stack trace:', error.stack.split('\n').slice(0, 3).join('\n'));
  }
  process.exit(1);
}
