
#!/usr/bin/env node

/**
 * External Keep-Alive Script
 * This can be run from anywhere (GitHub Actions, external server, etc.)
 */

const https = require('https');
const http = require('http');

// Configuration for lovable.com hosting
const REPL_URL = process.env.REPL_URL || process.env.WIDGET_URL || 'https://your-repl-name.your-username.repl.co';
const PING_INTERVAL = parseInt(process.env.PING_INTERVAL) || 240000; // 4 minutes for lovable.com
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

console.log(`🚀 Starting external keep-alive for lovable.com hosted widget: ${REPL_URL}`);
console.log(`📊 Ping interval: ${PING_INTERVAL / 1000} seconds`);
console.log(`🔄 Max retries: ${MAX_RETRIES}`);

function pingServer(retryCount = 0) {
  const startTime = Date.now();
  const client = REPL_URL.startsWith('https') ? https : http;
  const timestamp = new Date().toISOString();
  
  const req = client.get(`${REPL_URL}/health`, (res) => {
    const responseTime = Date.now() - startTime;
    
    if (res.statusCode === 200) {
      console.log(`[${timestamp}] ✅ Lovable.com widget alive (${res.statusCode}) - ${responseTime}ms`);
      
      // Log response data if available
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const healthData = JSON.parse(data);
          console.log(`[${timestamp}] 📊 Uptime: ${Math.round(healthData.uptime)}s, Memory: ${Math.round(healthData.memory?.heapUsed / 1024 / 1024)}MB`);
        } catch (e) {
          // Silent fail if not JSON
        }
      });
    } else {
      console.log(`[${timestamp}] ⚠️ Unexpected status code: ${res.statusCode}`);
    }
  });

  req.on('error', (error) => {
    console.log(`[${timestamp}] ❌ Ping failed: ${error.message}`);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`[${timestamp}] 🔄 Retrying in ${RETRY_DELAY / 1000}s... (${retryCount + 1}/${MAX_RETRIES})`);
      setTimeout(() => pingServer(retryCount + 1), RETRY_DELAY);
    } else {
      console.log(`[${timestamp}] 🚨 Max retries reached. Service may be down.`);
    }
  });

  req.setTimeout(20000, () => {
    req.destroy();
    console.log(`[${timestamp}] ⏰ Ping timeout`);
    
    if (retryCount < MAX_RETRIES) {
      setTimeout(() => pingServer(retryCount + 1), RETRY_DELAY);
    }
  });
}

// Initial ping
pingServer();

// Set up interval
setInterval(pingServer, PING_INTERVAL);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nExternal keep-alive stopped');
  process.exit(0);
});
