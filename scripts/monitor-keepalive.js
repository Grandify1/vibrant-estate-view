
#!/usr/bin/env node

/**
 * Keep-Alive Monitoring Script for Lovable.com Hosting
 * Monitors the health and status of the widget service
 */

const https = require('https');
const http = require('http');
const config = require('../keepalive.config.js');

class KeepAliveMonitor {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || config.environments.production.baseUrl;
    this.stats = {
      totalPings: 0,
      successfulPings: 0,
      failedPings: 0,
      averageResponseTime: 0,
      lastPing: null,
      startTime: Date.now()
    };
  }

  async checkHealth() {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const client = this.baseUrl.startsWith('https') ? https : http;
      
      const req = client.get(`${this.baseUrl}/health`, (res) => {
        const responseTime = Date.now() - startTime;
        let data = '';
        
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          this.stats.totalPings++;
          this.stats.lastPing = new Date().toISOString();
          
          if (res.statusCode === 200) {
            this.stats.successfulPings++;
            this.updateAverageResponseTime(responseTime);
            
            try {
              const healthData = JSON.parse(data);
              resolve({
                success: true,
                responseTime,
                data: healthData
              });
            } catch (e) {
              resolve({
                success: true,
                responseTime,
                data: { raw: data }
              });
            }
          } else {
            this.stats.failedPings++;
            resolve({
              success: false,
              statusCode: res.statusCode,
              responseTime
            });
          }
        });
      });

      req.on('error', (error) => {
        this.stats.totalPings++;
        this.stats.failedPings++;
        resolve({
          success: false,
          error: error.message
        });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        this.stats.totalPings++;
        this.stats.failedPings++;
        resolve({
          success: false,
          error: 'Timeout'
        });
      });
    });
  }

  updateAverageResponseTime(responseTime) {
    if (this.stats.successfulPings === 1) {
      this.stats.averageResponseTime = responseTime;
    } else {
      this.stats.averageResponseTime = 
        (this.stats.averageResponseTime * (this.stats.successfulPings - 1) + responseTime) / 
        this.stats.successfulPings;
    }
  }

  printStats() {
    const uptime = Math.round((Date.now() - this.stats.startTime) / 1000);
    const successRate = this.stats.totalPings > 0 ? 
      ((this.stats.successfulPings / this.stats.totalPings) * 100).toFixed(2) : 0;

    console.log('\n📊 Keep-Alive Monitor Stats:');
    console.log(`🕒 Monitor uptime: ${uptime}s`);
    console.log(`📡 Total pings: ${this.stats.totalPings}`);
    console.log(`✅ Successful: ${this.stats.successfulPings}`);
    console.log(`❌ Failed: ${this.stats.failedPings}`);
    console.log(`📈 Success rate: ${successRate}%`);
    console.log(`⏱️ Avg response: ${Math.round(this.stats.averageResponseTime)}ms`);
    console.log(`🕐 Last ping: ${this.stats.lastPing || 'Never'}`);
  }

  async start() {
    console.log(`🚀 Starting Keep-Alive Monitor for ${this.baseUrl}`);
    console.log(`🎯 Target: Lovable.com hosted widget`);
    
    // Initial health check
    const result = await this.checkHealth();
    console.log('Initial health check:', result.success ? '✅ OK' : '❌ FAILED');
    
    // Set up periodic monitoring
    setInterval(async () => {
      const result = await this.checkHealth();
      if (result.success) {
        console.log(`[${new Date().toISOString()}] ✅ Service healthy - ${result.responseTime}ms`);
      } else {
        console.log(`[${new Date().toISOString()}] ❌ Service unhealthy:`, result.error || result.statusCode);
      }
    }, 60000); // Check every minute

    // Print stats every 5 minutes
    setInterval(() => {
      this.printStats();
    }, 300000);
  }
}

// Start monitoring if run directly
if (require.main === module) {
  const url = process.env.WIDGET_URL || process.env.REPL_URL;
  const monitor = new KeepAliveMonitor(url);
  monitor.start();
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down monitor...');
    monitor.printStats();
    process.exit(0);
  });
}

module.exports = KeepAliveMonitor;
