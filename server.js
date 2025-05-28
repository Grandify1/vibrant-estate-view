
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
    uptime: process.uptime()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  
  // Start internal keep-alive service after server is ready
  setTimeout(() => {
    const serverUrl = process.env.REPLIT_DEPLOYMENT 
      ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/health`
      : `http://localhost:${PORT}/health`;
    
    const keepAlive = new KeepAliveService(serverUrl, 240000); // 4 minutes
    keepAlive.start();
    
    console.log('✓ Keep-alive service started');
  }, 5000);
});
