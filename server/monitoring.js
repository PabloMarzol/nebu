/**
 * NebulaX Exchange Monitoring & Logging System
 * Comprehensive monitoring for production readiness
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

class MonitoringService {
  constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTime: [],
      activeConnections: 0,
      memoryUsage: 0,
      cpuUsage: 0
    };
    
    this.logs = [];
    this.startTime = Date.now();
    this.logFile = path.join(__dirname, '../logs/system.log');
    
    // Ensure logs directory exists
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    this.startMonitoring();
  }
  
  startMonitoring() {
    // Monitor system resources every 30 seconds
    setInterval(() => {
      this.collectMetrics();
      this.checkThresholds();
    }, 30000);
    
    // Log rotation every hour
    setInterval(() => {
      this.rotateLogs();
    }, 3600000);
  }
  
  collectMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    this.metrics.memoryUsage = memUsage.heapUsed / 1024 / 1024; // MB
    this.metrics.cpuUsage = (cpuUsage.user + cpuUsage.system) / 1000000; // seconds
    
    this.log('INFO', `Memory: ${this.metrics.memoryUsage.toFixed(2)}MB, CPU: ${this.metrics.cpuUsage.toFixed(2)}s`);
  }
  
  checkThresholds() {
    // Memory threshold: 500MB
    if (this.metrics.memoryUsage > 500) {
      this.log('WARNING', `High memory usage: ${this.metrics.memoryUsage.toFixed(2)}MB`);
    }
    
    // Error rate threshold: 5%
    const errorRate = this.metrics.requests > 0 ? (this.metrics.errors / this.metrics.requests) * 100 : 0;
    if (errorRate > 5) {
      this.log('CRITICAL', `High error rate: ${errorRate.toFixed(2)}%`);
    }
    
    // Response time threshold: 2 seconds
    const avgResponseTime = this.metrics.responseTime.length > 0 
      ? this.metrics.responseTime.reduce((a, b) => a + b, 0) / this.metrics.responseTime.length
      : 0;
    if (avgResponseTime > 2000) {
      this.log('WARNING', `Slow response time: ${avgResponseTime.toFixed(2)}ms`);
    }
  }
  
  log(level, message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level}: ${message}`;
    
    this.logs.push(logEntry);
    console.log(logEntry);
    
    // Write to file
    fs.appendFileSync(this.logFile, logEntry + '\n');
    
    // Keep only last 1000 logs in memory
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }
  
  trackRequest(req, res) {
    const startTime = Date.now();
    this.metrics.requests++;
    this.metrics.activeConnections++;
    
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      this.metrics.responseTime.push(responseTime);
      this.metrics.activeConnections--;
      
      if (res.statusCode >= 400) {
        this.metrics.errors++;
        this.log('ERROR', `${req.method} ${req.url} - ${res.statusCode} - ${responseTime}ms`);
      } else {
        this.log('INFO', `${req.method} ${req.url} - ${res.statusCode} - ${responseTime}ms`);
      }
      
      // Keep only last 100 response times
      if (this.metrics.responseTime.length > 100) {
        this.metrics.responseTime = this.metrics.responseTime.slice(-100);
      }
    });
  }
  
  getMetrics() {
    const uptime = Date.now() - this.startTime;
    const avgResponseTime = this.metrics.responseTime.length > 0 
      ? this.metrics.responseTime.reduce((a, b) => a + b, 0) / this.metrics.responseTime.length
      : 0;
    
    return {
      uptime: uptime,
      requests: this.metrics.requests,
      errors: this.metrics.errors,
      errorRate: this.metrics.requests > 0 ? (this.metrics.errors / this.metrics.requests) * 100 : 0,
      activeConnections: this.metrics.activeConnections,
      avgResponseTime: avgResponseTime,
      memoryUsage: this.metrics.memoryUsage,
      cpuUsage: this.metrics.cpuUsage,
      systemInfo: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        totalMemory: os.totalmem() / 1024 / 1024 / 1024, // GB
        freeMemory: os.freemem() / 1024 / 1024 / 1024 // GB
      }
    };
  }
  
  getLogs(limit = 100) {
    return this.logs.slice(-limit);
  }
  
  rotateLogs() {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const archiveFile = path.join(__dirname, '../logs', `system-${timestamp}.log`);
    
    if (fs.existsSync(this.logFile)) {
      fs.renameSync(this.logFile, archiveFile);
      this.log('INFO', 'Log rotation completed');
    }
  }
  
  // Express middleware
  middleware() {
    return (req, res, next) => {
      this.trackRequest(req, res);
      next();
    };
  }
}

// Health check endpoint
const healthCheck = (monitoring) => {
  return (req, res) => {
    const metrics = monitoring.getMetrics();
    const isHealthy = metrics.errorRate < 10 && metrics.memoryUsage < 1000;
    
    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      metrics: metrics
    });
  };
};

// System status endpoint
const systemStatus = (monitoring) => {
  return (req, res) => {
    res.json({
      status: 'operational',
      metrics: monitoring.getMetrics(),
      logs: monitoring.getLogs(50)
    });
  };
};

module.exports = {
  MonitoringService,
  healthCheck,
  systemStatus
};

// ES6 export for TypeScript compatibility
exports.MonitoringService = MonitoringService;
exports.healthCheck = healthCheck;
exports.systemStatus = systemStatus;