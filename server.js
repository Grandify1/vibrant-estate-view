
const express = require('express');
const path = require('path');
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
