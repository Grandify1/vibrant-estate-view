
const https = require('https');
const http = require('http');

class KeepAliveService {
  constructor(url, interval = 240000) { // 4 minutes default for lovable.com
    this.url = url;
    this.interval = interval;
    this.isRunning = false;
    this.timeoutId = null;
    this.failureCount = 0;
    this.maxFailures = 3;
    this.lastPing = null;
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
    this.lastPing = new Date().toISOString();

    console.log(`🔄 [KEEPALIVE] Starting ping to: ${this.url}`);
    console.log(`🔄 [KEEPALIVE] Attempt ${this.failureCount + 1}, Last ping: ${this.lastPing}`);

    const req = client.get(this.url, (res) => {
      const responseTime = Date.now() - startTime;
      this.failureCount = 0; // Reset failure count on success
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✅ [KEEPALIVE] Ping successful (${res.statusCode}) - ${responseTime}ms [${this.lastPing}]`);
        
        // Log response data if it's JSON
        try {
          const responseData = JSON.parse(data);
          console.log(`📊 [KEEPALIVE] Server status:`, responseData.status);
          console.log(`💾 [KEEPALIVE] Memory usage: ${Math.round(responseData.memory?.heapUsed / 1024 / 1024)}MB`);
        } catch (e) {
          console.log(`📄 [KEEPALIVE] Response (first 100 chars):`, data.substring(0, 100));
        }
      });
    });

    req.on('error', (error) => {
      this.failureCount++;
      console.log(`❌ [KEEPALIVE] Ping failed (${this.failureCount}/${this.maxFailures}): ${error.message}`);
      console.log(`❌ [KEEPALIVE] Error code: ${error.code}, URL: ${this.url}`);
      
      if (this.failureCount >= this.maxFailures) {
        console.log(`🚨 [KEEPALIVE] Max failures reached. Service may be down.`);
        console.log(`🚨 [KEEPALIVE] Consider checking server logs or restarting service.`);
      }
    });

    req.setTimeout(15000, () => {
      req.destroy();
      this.failureCount++;
      console.log(`⏰ [KEEPALIVE] Ping timeout (${this.failureCount}/${this.maxFailures}) - URL: ${this.url}`);
    });

    // Schedule next ping with exponential backoff on failures
    const nextInterval = this.failureCount > 0 
      ? Math.min(this.interval * Math.pow(2, this.failureCount), 600000) // Max 10 minutes
      : this.interval;
      
    console.log(`⏳ [KEEPALIVE] Next ping in ${nextInterval / 1000} seconds`);
    
    this.timeoutId = setTimeout(() => {
      this.ping();
    }, nextInterval);
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
