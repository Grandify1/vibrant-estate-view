
#!/usr/bin/env node

/**
 * External Keep-Alive Script
 * This can be run from anywhere (GitHub Actions, external server, etc.)
 */

const https = require('https');
const http = require('http');

const REPL_URL = process.env.REPL_URL || 'https://your-repl-name.your-username.repl.co';
const PING_INTERVAL = parseInt(process.env.PING_INTERVAL) || 240000; // 4 minutes

console.log(`Starting external keep-alive for: ${REPL_URL}`);
console.log(`Ping interval: ${PING_INTERVAL / 1000} seconds`);

function pingServer() {
  const startTime = Date.now();
  const client = REPL_URL.startsWith('https') ? https : http;
  
  const req = client.get(`${REPL_URL}/health`, (res) => {
    const responseTime = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ✓ Server alive (${res.statusCode}) - ${responseTime}ms`);
  });

  req.on('error', (error) => {
    console.log(`[${new Date().toISOString()}] ✗ Ping failed: ${error.message}`);
  });

  req.setTimeout(15000, () => {
    req.destroy();
    console.log(`[${new Date().toISOString()}] ✗ Ping timeout`);
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
