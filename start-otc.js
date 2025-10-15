#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting OTC Desk Pro on port 5001...');

const otcServer = spawn('tsx', ['server/otc-index.ts'], {
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: '5001'
  },
  stdio: 'inherit',
  cwd: process.cwd()
});

otcServer.on('error', (err) => {
  console.error('Failed to start OTC server:', err);
});

otcServer.on('close', (code) => {
  console.log(`OTC server exited with code ${code}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down OTC server...');
  otcServer.kill('SIGINT');
  process.exit(0);
});