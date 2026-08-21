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

// In-memory / cache ticket registry (with auto-sync)
const ticketRegistry = new Map();

// Ticket API endpoints
app.post('/api/tickets', (req, res) => {
  const ticket = req.body;
  if (!ticket || !ticket.id) return res.status(400).json({ error: 'Invalid ticket payload' });
  ticketRegistry.set(ticket.id.toUpperCase(), ticket);
  res.json({ success: true, ticket });
});

app.get('/api/tickets/:id', (req, res) => {
  const ticket = ticketRegistry.get(req.params.id.toUpperCase());
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  res.json(ticket);
});

app.post('/api/verify/:id', (req, res) => {
  const id = req.params.id.toUpperCase();
  const ticket = ticketRegistry.get(id);
  if (!ticket) return res.status(404).json({ status: 'unknown' });
  if (!Array.isArray(ticket.scans)) ticket.scans = [];
  if (ticket.scans.length >= (ticket.seats || 1)) {
    return res.json({ status: 'exhausted', ticket });
  }
  ticket.scans.push(new Date().toISOString());
  ticketRegistry.set(id, ticket);
  res.json({ status: 'valid', ticket });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'QOHEL AFRICA GROUP Payment Gateway',
    gateway: 'PesaPal API v3 (Live/Production)',
    timestamp: new Date().toISOString(),
  });
});

// Dedicated HTML Routes
app.get('/ticket/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'ticket.html'));
});
app.get('/ticket', (req, res) => {
  res.sendFile(path.join(__dirname, 'ticket.html'));
});

app.get('/verify/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'verify.html'));
});
app.get('/verify', (req, res) => {
  res.sendFile(path.join(__dirname, 'verify.html'));
});

app.get('/dossier/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'dossier.html'));
});
app.get('/dossier', (req, res) => {
  res.sendFile(path.join(__dirname, 'dossier.html'));
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
