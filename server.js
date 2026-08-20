/**
 * QOHEL AFRICA GROUP — Backend & Local Dev Server
 * Compatible with Vercel Serverless Functions (/api/*)
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const initiateHandler = require('./api/initiate');
const statusHandler = require('./api/status');
const ipnHandler = require('./api/pesapal-ipn');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Vercel Serverless Function adapter for Express
function adapt(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.error('API Error:', err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: err.message });
      }
    }
  };
}

// API Routes (matching Vercel serverless functions)
app.all('/api/initiate', adapt(initiateHandler));
app.all('/api/payment/initiate', adapt(initiateHandler));

app.all('/api/status', adapt(statusHandler));
app.all('/api/payment/status', adapt(statusHandler));
app.all('/api/payment/status/:id', (req, res) => {
  req.query.orderTrackingId = req.params.id;
  return adapt(statusHandler)(req, res);
});

app.all('/api/pesapal-ipn', adapt(ipnHandler));
app.all('/api/public/pesapal-ipn', adapt(ipnHandler));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'QOHEL AFRICA GROUP Payment Gateway',
    gateway: 'PesaPal API v3 (Live/Production)',
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend static files
app.use(express.static(__dirname));

// Fallback to index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Endpoint not found' });
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log('\n');
  console.log('  ╔══════════════════════════════════════════════════════╗');
  console.log('  ║     QOHEL AFRICA GROUP — PAYMENT API SERVER          ║');
  console.log('  ║     Sovereign Corporate & Enterprise Holdings         ║');
  console.log('  ╠══════════════════════════════════════════════════════╣');
  console.log('  ║  Local Portal: http://localhost:' + PORT + '                 ║');
  console.log('  ║  API Health:   http://localhost:' + PORT + '/api/health       ║');
  console.log('  ║  Vercel Ready: /api/initiate, /api/status            ║');
  console.log('  ╚══════════════════════════════════════════════════════╝\n');
});
