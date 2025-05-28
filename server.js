
const express = require('express');
const path = require('path');
const KeepAliveService = require('./keepalive');
const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve widget.js from the root
app.get('/widget.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'widget.js'));
});

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Keep-alive mechanism
setInterval(() => {
  console.log('Server is alive at', new Date().toISOString());
}, 300000); // Every 5 minutes

// Health check endpoint for keep-alive
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'alive', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    platform: 'replit',
    service: 'immoupload-widget'
  });
});

// Keep-alive ping endpoint for external services
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Status endpoint with detailed information
app.get('/status', (req, res) => {
  res.status(200).json({
    status: 'running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    deployment: process.env.REPLIT_DEPLOYMENT ? 'production' : 'development',
    version: '1.0.0'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`📡 Ping endpoint: http://0.0.0.0:${PORT}/ping`);
  
  // Start internal keep-alive service after server is ready
  setTimeout(() => {
    const serverUrl = process.env.REPLIT_DEPLOYMENT 
      ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/health`
      : `http://0.0.0.0:${PORT}/health`;
    
    const keepAlive = new KeepAliveService(serverUrl, 240000); // 4 minutes
    keepAlive.start();
    
    console.log('✅ Keep-alive service started for lovable.com hosting');
  }, 5000);
});
