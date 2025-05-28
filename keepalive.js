import https from 'https';
import http from 'http';

class KeepAliveService {
  constructor(url, interval = 300000) { // Default 5 minutes
    this.url = url;
    this.interval = interval;
    this.intervalId = null;
    this.isRunning = false;
    this.failureCount = 0;
    this.maxFailures = 3;
    this.lastPing = null;

    console.log(`🔄 KeepAlive service initialized for: ${url}`);
    console.log(`⏰ Ping interval: ${interval / 1000}s`);
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
        console.log(`💚 Keep-alive ping successful: ${res.statusCode} - ${responseTime}ms [${this.lastPing}]`);

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
      console.error(`❌ Keep-alive ping failed: ${error.message} - ${new Date().toISOString()}`);
      console.log(`❌ [KEEPALIVE] Error code: ${error.code}, URL: ${this.url}`);

      if (this.failureCount >= this.maxFailures) {
        console.log(`🚨 [KEEPALIVE] Max failures reached. Service may be down.`);
        console.log(`🚨 [KEEPALIVE] Consider checking server logs or restarting service.`);
      }
    });

    req.setTimeout(15000, () => {
      req.destroy();
      this.failureCount++;
      console.error(`⏰ Keep-alive ping timeout - ${new Date().toISOString()}`);
      console.log(`⏰ [KEEPALIVE] Ping timeout (${this.failureCount}/${this.maxFailures}) - URL: ${this.url}`);
    });

    // Schedule next ping with exponential backoff on failures
    const nextInterval = this.failureCount > 0
      ? Math.min(this.interval * Math.pow(2, this.failureCount), 600000) // Max 10 minutes
      : this.interval;

    console.log(`⏳ [KEEPALIVE] Next ping in ${nextInterval / 1000} seconds`);

    this.intervalId = setTimeout(() => {
      this.ping();
    }, nextInterval);
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️ KeepAlive service is already running');
      return;
    }

    console.log('🚀 Starting KeepAlive service...');
    this.isRunning = true;

    // Initial ping
    this.ping();

    // Set up recurring pings
    this.intervalId = setInterval(() => {
      this.ping();
    }, this.interval);

    console.log('✅ KeepAlive service started successfully');
  }

  stop() {
    if (!this.isRunning) {
      console.log('⚠️ KeepAlive service is not running');
      return;
    }

    console.log('🛑 Stopping KeepAlive service...');

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    console.log('✅ KeepAlive service stopped');
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      url: this.url,
      interval: this.interval,
      timestamp: new Date().toISOString()
    };
  }
}

// Auto-start if running as main module
if (process.argv[1] === require.resolve(__filename)) {
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

export default KeepAliveService;