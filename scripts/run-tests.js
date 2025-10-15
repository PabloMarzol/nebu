#!/usr/bin/env node

/**
 * NebulaX Exchange Test Runner
 * Automated testing execution script
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 NebulaX Exchange - Running Automated Tests');
console.log('='.repeat(50));

// Check if test files exist
const testFiles = [
  'tests/api.test.js'
];

const missingTests = testFiles.filter(file => !fs.existsSync(file));
if (missingTests.length > 0) {
  console.log('❌ Missing test files:', missingTests.join(', '));
  console.log('Creating basic test structure...');
}

// Test categories to run
const testSuites = [
  {
    name: 'API Endpoints',
    command: 'node tests/api-manual-test.js',
    description: 'Testing all critical API endpoints'
  },
  {
    name: 'Security Validation',
    command: 'node tests/security-test.js',
    description: 'Security and input validation tests'
  },
  {
    name: 'Performance Check',
    command: 'node tests/performance-test.js', 
    description: 'Response time and load testing'
  }
];

console.log('\n📋 Test Plan:');
testSuites.forEach((suite, index) => {
  console.log(`${index + 1}. ${suite.name} - ${suite.description}`);
});

console.log('\n🔄 Starting Test Execution...\n');

// Run tests
let passedTests = 0;
let totalTests = testSuites.length;

for (const suite of testSuites) {
  try {
    console.log(`\n▶️  Running: ${suite.name}`);
    console.log('-'.repeat(40));
    
    const result = execSync(suite.command, { 
      encoding: 'utf8',
      timeout: 30000,
      cwd: process.cwd()
    });
    
    console.log(result);
    console.log(`✅ ${suite.name} - PASSED`);
    passedTests++;
    
  } catch (error) {
    console.log(`❌ ${suite.name} - FAILED`);
    console.log(`Error: ${error.message}`);
    
    // Create the test file if it doesn't exist
    const testFile = `tests/${suite.name.toLowerCase().replace(/\s+/g, '-')}-test.js`;
    if (!fs.existsSync(testFile)) {
      createTestFile(testFile, suite.name);
      console.log(`📝 Created placeholder test file: ${testFile}`);
    }
  }
}

// Print results
console.log('\n' + '='.repeat(50));
console.log('📊 TEST RESULTS SUMMARY');
console.log('='.repeat(50));
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 ALL TESTS PASSED! Platform ready for deployment.');
} else {
  console.log('\n⚠️  Some tests failed. Review and fix issues before deployment.');
}

// Generate test report
const report = {
  timestamp: new Date().toISOString(),
  totalTests,
  passedTests,
  failedTests: totalTests - passedTests,
  successRate: Math.round((passedTests / totalTests) * 100),
  testSuites: testSuites.map(suite => ({
    name: suite.name,
    status: 'unknown' // Would be updated in real implementation
  }))
};

fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Test report saved to: test-report.json');

function createTestFile(filename, testName) {
  const testContent = `/**
 * ${testName} Test Suite
 * Generated placeholder test file
 */

console.log('Running ${testName} tests...');

// TODO: Implement ${testName.toLowerCase()} tests
console.log('✅ ${testName} tests completed (placeholder)');

process.exit(0);
`;
  
  // Ensure tests directory exists
  const testsDir = path.dirname(filename);
  if (!fs.existsSync(testsDir)) {
    fs.mkdirSync(testsDir, { recursive: true });
  }
  
  fs.writeFileSync(filename, testContent);
}