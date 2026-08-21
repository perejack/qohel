// Vercel Serverless API Route: POST /api/payhero/status
// PayHero — Check STK push transaction status

const PAYHERO_BASE_URL = 'https://backend.payhero.co.ke';

// QOHEL Africa PayHero Credentials — Channel 11757
const PAYHERO_AUTH_TOKEN =
  'Basic Qk5WTml3RjhPSTRXbVBlV3M1RjY6TFFMUEtuRlEwNUFhMW9LOVdEZ29lYVdiTTN6Q21uanN4UHY2bmIxag==';

function getAuthHeader() {
  const token = process.env.PAYHERO_AUTH_TOKEN || PAYHERO_AUTH_TOKEN;
  return token.startsWith('Basic ') ? token : `Basic ${token}`;
}

function mapPayheroStatus(rawStatus) {
  const status = String(rawStatus || '').toUpperCase().trim();
  if (status === 'SUCCESS' || status === 'COMPLETED' || status === 'PAID') return 'paid';
  if (status === 'FAILED' || status === 'CANCELLED' || status === 'CANCELED') return 'failed';
  return 'pending';
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const authHeader = getAuthHeader();

  try {
    const body = req.body || {};
    // Accept reference from body or query string
    const reference =
      (typeof body.checkoutId === 'string' ? body.checkoutId : undefined) ??
      (typeof body.checkoutRequestId === 'string' ? body.checkoutRequestId : undefined) ??
      (typeof body.reference === 'string' ? body.reference : undefined) ??
      (typeof req.query?.checkoutId === 'string' ? req.query.checkoutId : undefined) ??
      (typeof req.query?.reference === 'string' ? req.query.reference : undefined);

    if (!reference) {
      return res.status(400).json({ status: 'error', message: 'Missing checkoutId / reference' });
    }

    console.log('[PayHero] Checking status for:', reference);

    const payheroRes = await fetch(
      `${PAYHERO_BASE_URL}/api/v2/transaction-status?reference=${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: { Authorization: authHeader },
      }
    );

    const data = await payheroRes.json().catch(() => null);

    if (!payheroRes.ok || !data) {
      console.error('[PayHero] Status check failed:', data);
      return res.status(payheroRes.status || 500).json({
        status: 'error',
        message:
          (typeof data?.message === 'string' ? data.message : null) ??
          (typeof data?.error === 'string' ? data.error : null) ??
          'Status check failed',
        raw: data,
      });
    }

    const rawStatus = String(data.status ?? data.Status ?? '').trim();
    const mappedStatus = mapPayheroStatus(rawStatus);
    const isPaid = mappedStatus === 'paid';
    const isFailed = mappedStatus === 'failed';

    console.log('[PayHero] Status result:', rawStatus, '-> mapped:', mappedStatus, 'isPaid:', isPaid);

    return res.status(200).json({
      success: isPaid,
      status: isPaid ? 'COMPLETED' : isFailed ? 'FAILED' : 'PENDING',
      state: mappedStatus,
      rawStatus,
      resultDesc:
        (typeof data.message === 'string' ? data.message : '') ||
        (typeof data.resultDesc === 'string' ? data.resultDesc : '') ||
        rawStatus,
      // M-Pesa receipt (if paid)
      confirmationCode:
        (typeof data.payment_reference === 'string' && data.payment_reference ? data.payment_reference : null) ??
        (typeof data.third_party_reference === 'string' && data.third_party_reference ? data.third_party_reference : null) ??
        (typeof data.provider_reference === 'string' && data.provider_reference ? data.provider_reference : null) ??
        '',
      receiptNumber:
        (typeof data.payment_reference === 'string' && data.payment_reference ? data.payment_reference : null) ??
        (typeof data.third_party_reference === 'string' && data.third_party_reference ? data.third_party_reference : null) ??
        null,
      raw: data,
    });

  } catch (err) {
    console.error('[PayHero] Status exception:', err.message);
    return res.status(500).json({ status: 'error', message: err.message || 'Status check failed' });
  }
};
