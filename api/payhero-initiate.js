// Vercel Serverless API Route: POST /api/payhero/initiate
// PayHero STK Push — sends M-Pesa prompt directly to phone

const PAYHERO_BASE_URL = 'https://backend.payhero.co.ke';

// QOHEL Africa PayHero Credentials — Channel 11757
const PAYHERO_AUTH_TOKEN =
  'Basic Qk5WTml3RjhPSTRXbVBlV3M1RjY6TFFMUEtuRlEwNUFhMW9LOVdEZ29lYVdiTTN6Q21uanN4UHY2bmIxag==';
const PAYHERO_CHANNEL_ID = 11757;

function normalizePhoneNumber(phone) {
  if (!phone) return null;
  const cleaned = String(phone).replace(/\D/g, '');
  // Accept 07XXXXXXXX (10 digits starting 0)
  if (cleaned.startsWith('0') && cleaned.length === 10) return cleaned;
  // Accept 2547XXXXXXXX → convert to 07XXXXXXXX
  if (cleaned.startsWith('254') && cleaned.length === 12) return `0${cleaned.slice(3)}`;
  // Accept 7XXXXXXXX or 1XXXXXXXX (9 digits)
  if ((cleaned.startsWith('7') || cleaned.startsWith('1')) && cleaned.length === 9) {
    return `0${cleaned}`;
  }
  return null;
}

function getAuthHeader() {
  const token = process.env.PAYHERO_AUTH_TOKEN || PAYHERO_AUTH_TOKEN;
  return token.startsWith('Basic ') ? token : `Basic ${token}`;
}

function extractReference(data) {
  const direct =
    data.reference ??
    data.Reference ??
    data.checkoutId ??
    data.checkoutRequestId ??
    data.CheckoutRequestID;
  if (typeof direct === 'string' && direct.trim()) return direct;

  const nested = data.data;
  if (nested && typeof nested === 'object') {
    const ref =
      nested.reference ??
      nested.Reference ??
      nested.checkoutId ??
      nested.checkoutRequestId ??
      nested.CheckoutRequestID;
    if (typeof ref === 'string' && ref.trim()) return ref;
  }
  return null;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const authHeader = getAuthHeader();
  const channelId = Number(process.env.PAYHERO_CHANNEL_ID || PAYHERO_CHANNEL_ID);

  try {
    const body = req.body || {};

    // Accept phone from multiple field names
    const rawPhone =
      (typeof body.phone === 'string' ? body.phone : undefined) ??
      (typeof body.phoneNumber === 'string' ? body.phoneNumber : undefined) ??
      (typeof body.phone_number === 'string' ? body.phone_number : undefined);

    const normalizedPhone = normalizePhoneNumber(rawPhone);
    if (!normalizedPhone) {
      return res.status(400).json({ success: false, message: 'Invalid phone number. Use 07XXXXXXXX format.' });
    }

    const amount = Number(String(body.amount || body.tierPrice || 0).replace(/[^0-9.]/g, ''));
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    // Build a branded reference for QOHEL
    const tierCode = typeof body.tierCode === 'string' ? body.tierCode : 'DELEGATE';
    const externalReference =
      typeof body.reference === 'string'
        ? body.reference
        : `QOHEL-${tierCode}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const customerName =
      typeof body.delegateName === 'string' ? body.delegateName :
      typeof body.customer_name === 'string' ? body.customer_name : undefined;

    const description =
      typeof body.description === 'string' ? body.description :
      typeof body.tierName === 'string' ? `TWC 2026 Pass: ${body.tierName}` :
      'TWC 2026 — QOHEL Africa Group';

    const payload = {
      amount: Math.round(amount),
      phone_number: normalizedPhone,
      channel_id: channelId,
      provider: 'm-pesa',
      external_reference: externalReference,
      customer_name: customerName,
      description,
    };

    console.log('[PayHero] Initiating STK push:', { phone: normalizedPhone, amount, externalReference });

    const payheroRes = await fetch(`${PAYHERO_BASE_URL}/api/v2/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(payload),
    });

    const data = await payheroRes.json().catch(() => null);

    if (!payheroRes.ok || !data) {
      console.error('[PayHero] Initiation failed:', data);
      return res.status(payheroRes.status || 500).json({
        success: false,
        message:
          (typeof data?.message === 'string' ? data.message : null) ??
          (typeof data?.error === 'string' ? data.error : null) ??
          'STK push failed',
        raw: data,
      });
    }

    const checkoutId = extractReference(data);
    const success =
      data.success === true ||
      String(data.status ?? '').toLowerCase() === 'success' ||
      Boolean(checkoutId);

    if (!success || !checkoutId) {
      return res.status(400).json({
        success: false,
        message: typeof data.message === 'string' ? data.message : 'Payment initiation failed',
        raw: data,
      });
    }

    console.log('[PayHero] STK push sent. CheckoutId:', checkoutId);

    return res.status(200).json({
      success: true,
      checkoutId,
      checkoutRequestId: checkoutId,
      reference: externalReference,
      normalizedPhone: `254${normalizedPhone.slice(1)}`,
      message: typeof data.message === 'string' ? data.message : 'STK push sent to phone',
      raw: data,
    });

  } catch (err) {
    console.error('[PayHero] Exception:', err.message);
    return res.status(500).json({ success: false, message: err.message || 'Payment initiation failed' });
  }
};
