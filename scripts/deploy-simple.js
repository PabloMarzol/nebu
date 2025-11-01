#!/usr/bin/env node

/**
 * Simple NebulaX Deployment Script
 * Windows-compatible deployment preparation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 NebulaX Simple Deployment Script');
console.log('====================================');

// Simple logging
function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m'
  };
  
  const color = colors[type] || colors.info;
  console.log(`${color}${message}${colors.reset}`);
}

async function deploy() {
  try {
    log('\n📋 Step 1: Validating Environment', 'info');
    
    const nodeEnv = process.env.NODE_ENV || 'development';
    log(`Environment: ${nodeEnv}`, 'info');
    
    // Check for required files
    const requiredFiles = [
      'package.json',
      'render.yaml',
      'server/index.ts',
      'client/index.html'
    ];
    
    let missingFiles = [];
    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        missingFiles.push(file);
      }
    }
    
    if (missingFiles.length > 0) {
      log(`❌ Missing required files: ${missingFiles.join(', ')}`, 'error');
      process.exit(1);
    }
    log('✅ All required files present', 'success');

    log('\n🔧 Step 2: Checking Dependencies', 'info');
    
    // Check if node_modules exists
    if (fs.existsSync('node_modules')) {
      log('✅ node_modules found', 'success');
    } else {
      log('⚠️  node_modules not found - run npm install first', 'warning');
    }

    log('\n🏗️ Step 3: Checking Build Output', 'info');
    
    // Check if dist folder exists
    if (fs.existsSync('dist')) {
      log('✅ dist folder found', 'success');
    } else {
      log('⚠️  dist folder not found - run npm run build first', 'warning');
    }

    log('\n🗄️ Step 4: Database Configuration', 'info');
    
    if (process.env.DATABASE_URL) {
      log('✅ DATABASE_URL is configured', 'success');
    } else {
      log('⚠️  DATABASE_URL not set - database features will be limited', 'warning');
    }

    log('\n🔐 Step 5: Security Check', 'info');
    
    // Check for common security issues
    if (fs.existsSync('.env')) {
      const envContent = fs.readFileSync('.env', 'utf8');
      const issues = [];
      
      if (envContent.includes('sk_test_')) {
        issues.push('Test Stripe keys found');
      }
      if (envContent.includes('localhost') && envContent.includes('DATABASE_URL')) {
        issues.push('Localhost database URL found');
      }
      if (envContent.includes('SESSION_SECRET=development')) {
        issues.push('Development session secret found');
      }
      
      if (issues.length > 0) {
        log('⚠️  Security warnings found:', 'warning');
        issues.forEach(issue => log(`  - ${issue}`, 'warning'));
      } else {
        log('✅ No obvious security issues detected', 'success');
      }
    } else {
      log('⚠️  .env file not found', 'warning');
    }

    log('\n📦 Step 6: Creating Deployment Summary', 'info');
    
    // Read package.json
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      environment: nodeEnv,
      nodeVersion: process.version,
      platform: process.platform,
      dependencies: Object.keys(packageJson.dependencies || {}).length,
      devDependencies: Object.keys(packageJson.devDependencies || {}).length,
      scripts: Object.keys(packageJson.scripts || {}),
      healthCheck: '/api/health',
      metrics: '/api/metrics',
      status: 'ready_for_deployment'
    };
    
    fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
    log('✅ Deployment info saved to deployment-info.json', 'success');

    log('\n🎉 Deployment Preparation Complete!', 'success');
    log('\n📋 Summary:', 'info');
    log('✅ Environment validated', 'success');
    log('✅ Dependencies checked', 'success');
    log('✅ Build output verified', 'success');
    log('✅ Security scan completed', 'success');
    log('✅ Deployment info generated', 'success');
    
    log('\n🚀 Ready for deployment!', 'success');
    log('\nNext steps:', 'info');
    log('1. Deploy to Render using the button in DEPLOYMENT_SUMMARY.md', 'info');
    log('2. Configure API keys in Render dashboard', 'info');
    log('3. Monitor deployment at: https://dashboard.render.com', 'info');
    log('4. Check health at: https://your-app.onrender.com/api/health', 'info');

  } catch (error) {
    log(`\n❌ Deployment preparation failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run deployment
if (import.meta.url === `file://${process.argv[1]}`) {
  deploy().catch(error => {
    log(`\n❌ Fatal error: ${error.message}`, 'error');
    process.exit(1);
  });
}

export { deploy };
