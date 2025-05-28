
module.exports = {
  // Lovable.com hosting configuration
  hosting: {
    platform: 'lovable.com',
    domain: 'immoupload.com',
    widget_endpoint: '/widget.js'
  },
  
  // Keep-alive settings
  keepAlive: {
    internal: {
      enabled: true,
      interval: 240000, // 4 minutes
      timeout: 15000,   // 15 seconds
      maxFailures: 3
    },
    external: {
      enabled: true,
      interval: 240000, // 4 minutes  
      maxRetries: 3,
      retryDelay: 5000, // 5 seconds
      endpoints: ['/health', '/ping', '/status']
    }
  },
  
  // Monitoring settings
  monitoring: {
    logLevel: 'info',
    includeMemoryStats: true,
    includeSystemStats: true,
    timestampFormat: 'ISO'
  },
  
  // Environment specific settings
  environments: {
    development: {
      baseUrl: 'http://0.0.0.0:8080',
      verbose: true
    },
    production: {
      baseUrl: process.env.REPL_URL || 'https://your-repl.replit.dev',
      verbose: false
    }
  }
};
