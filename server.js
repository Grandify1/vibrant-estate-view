
const express = require('express');
const path = require('path');
const fs = require('fs');
const KeepAliveService = require('./keepalive');
const app = express();
const PORT = process.env.PORT || 8080;

// Debug startup
console.log('🚀 Starting Express Server with debugging...');
console.log('📁 Current directory:', __dirname);
console.log('📂 Dist directory exists:', fs.existsSync(path.join(__dirname, 'dist')));
console.log('📄 widget.js exists:', fs.existsSync(path.join(__dirname, 'dist', 'widget.js')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve widget.js from the root with debugging
app.get('/widget.js', (req, res) => {
  const widgetPath = path.join(__dirname, 'dist', 'widget.js');
  console.log('🔍 Widget.js requested, path:', widgetPath);
  console.log('🔍 File exists:', fs.existsSync(widgetPath));
  
  if (fs.existsSync(widgetPath)) {
    res.sendFile(widgetPath);
    console.log('✅ Widget.js served successfully');
  } else {
    console.log('❌ Widget.js not found!');
    res.status(404).send('widget.js not found');
  }
});

// Health check endpoint for keep-alive
app.get('/health', (req, res) => {
  const healthData = { 
    status: 'alive', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    platform: 'replit',
    service: 'immoupload-widget',
    files: {
      distExists: fs.existsSync(path.join(__dirname, 'dist')),
      widgetExists: fs.existsSync(path.join(__dirname, 'dist', 'widget.js')),
      indexExists: fs.existsSync(path.join(__dirname, 'dist', 'index.html'))
    }
  };
  
  console.log('🏥 Health check requested:', healthData.status);
  res.status(200).json(healthData);
});

// Keep-alive ping endpoint for external services
app.get('/ping', (req, res) => {
  console.log('🏓 Ping received');
  res.status(200).send('pong');
});

// Status endpoint with detailed information
app.get('/status', (req, res) => {
  const statusData = {
    status: 'running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    deployment: process.env.REPLIT_DEPLOYMENT ? 'production' : 'development',
    version: '1.0.0',
    debug: {
      port: PORT,
      host: '0.0.0.0',
      distPath: path.join(__dirname, 'dist'),
      widgetPath: path.join(__dirname, 'dist', 'widget.js')
    }
  };
  
  console.log('📊 Status requested');
  res.status(200).json(statusData);
});

// Debug endpoint to list files
app.get('/debug/files', (req, res) => {
  try {
    const distPath = path.join(__dirname, 'dist');
    const files = fs.existsSync(distPath) ? fs.readdirSync(distPath) : [];
    res.json({
      distPath,
      files,
      widgetExists: fs.existsSync(path.join(distPath, 'widget.js'))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  console.log('🌐 SPA fallback for:', req.url);
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.log('❌ index.html not found!');
    res.status(404).send('Application not built. Please run build first.');
  }
});

// Internal keep-alive with debugging
setInterval(() => {
  console.log('💗 Internal server heartbeat:', new Date().toISOString());
}, 300000); // Every 5 minutes

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Express Server successfully started!`);
  console.log(`🌐 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`📡 Ping endpoint: http://0.0.0.0:${PORT}/ping`);
  console.log(`🔍 Debug files: http://0.0.0.0:${PORT}/debug/files`);
  console.log(`📄 Widget.js: http://0.0.0.0:${PORT}/widget.js`);
  
  // Test widget.js availability immediately
  const widgetPath = path.join(__dirname, 'dist', 'widget.js');
  console.log('🔍 Initial widget.js check:', fs.existsSync(widgetPath) ? '✅ EXISTS' : '❌ MISSING');
  
  // Start internal keep-alive service after server is ready
  setTimeout(() => {
    const serverUrl = process.env.REPLIT_DEPLOYMENT 
      ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/health`
      : `http://0.0.0.0:${PORT}/health`;
    
    console.log(`🔄 Starting keep-alive service for: ${serverUrl}`);
    const keepAlive = new KeepAliveService(serverUrl, 240000); // 4 minutes
    keepAlive.start();
    
    console.log('✅ Keep-alive service started for lovable.com hosting');
  }, 5000);
});
