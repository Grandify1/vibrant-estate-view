
const https = require('https');
const http = require('http');

class KeepAliveService {
  constructor(url, interval = 300000) { // 5 minutes default
    this.url = url;
    this.interval = interval;
    this.isRunning = false;
    this.timeoutId = null;
  }

  start() {
    if (this.isRunning) {
      console.log('Keep-alive service is already running');
      return;
    }

    this.isRunning = true;
    console.log(`Starting keep-alive service for ${this.url}`);
    console.log(`Ping interval: ${this.interval / 1000} seconds`);
    
    this.ping();
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.isRunning = false;
    console.log('Keep-alive service stopped');
  }

  ping() {
    if (!this.isRunning) return;

    const startTime = Date.now();
    const client = this.url.startsWith('https') ? https : http;

    const req = client.get(this.url, (res) => {
      const responseTime = Date.now() - startTime;
      console.log(`✓ Keep-alive ping successful (${res.statusCode}) - ${responseTime}ms`);
    });

    req.on('error', (error) => {
      console.log(`✗ Keep-alive ping failed: ${error.message}`);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.log('✗ Keep-alive ping timeout');
    });

    // Schedule next ping
    this.timeoutId = setTimeout(() => {
      this.ping();
    }, this.interval);
  }
}

// Auto-start if running as main module
if (require.main === module) {
  const url = process.env.KEEP_ALIVE_URL || 'http://localhost:8080';
  const interval = parseInt(process.env.KEEP_ALIVE_INTERVAL) || 300000;
  
  const keepAlive = new KeepAliveService(url, interval);
  keepAlive.start();

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down keep-alive service...');
    keepAlive.stop();
    process.exit(0);
  });
}

module.exports = KeepAliveService;
