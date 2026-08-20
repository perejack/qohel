// Vercel Serverless API Route: POST /api/initiate
const rawBase = process.env.PESAPAL_BASE_URL || "https://pay.pesapal.com/v3";
const BASE = rawBase.endsWith("/api") ? rawBase : rawBase.replace(/\/$/, "") + "/api";

function normalizePhone(raw) {
  const digits = String(raw).replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return "254" + digits.slice(1);
  return "254" + digits;
}

async function getToken(key, secret) {
  const res = await fetch(BASE + "/Auth/RequestToken", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ consumer_key: key, consumer_secret: secret }),
  });
  const json = await res.json();
  if (!json.token) {
    throw new Error(json.error?.message || json.message || "Could not authenticate with Pesapal");
  }
  return json.token;
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const {
      delegateName,
      email,
      phone,
      organization,
      tierName,
      tierPrice,
      tierCode,
      origin: clientOrigin
    } = req.body || {};

    const key = process.env.PESAPAL_CONSUMER_KEY || "gQSstjnS/AotrkwJMev+Rv1T2RCfxwxC";
    const secret = process.env.PESAPAL_CONSUMER_SECRET || "gUQNgRFiFG/gygGoj1T69hJjiO0=";

    if (!key || !secret) {
      return res.status(500).json({ success: false, error: "Pesapal credentials are not configured" });
    }

    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
    const proto = req.headers["x-forwarded-proto"] || "http";
    const origin = clientOrigin || (proto + "://" + host);

    const token = await getToken(key, secret);
    const authHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    };

    // Register IPN URL
    let ipnId = "f2b38c53-ac56-49e2-ba7e-da00bb8c44aa";
    try {
      const ipnRes = await fetch(BASE + "/URLSetup/RegisterIPN", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          url: origin + "/api/pesapal-ipn",
          ipn_notification_type: "GET",
        }),
      });
      const ipn = await ipnRes.json();
      if (ipn.ipn_id || ipn.id) {
        ipnId = ipn.ipn_id || ipn.id;
      }
    } catch (e) {
      console.warn("IPN registration notice:", e.message);
    }

    const cleanPhone = normalizePhone(phone || "0115475254");
    const reference = "QAG-TWC-" + Date.now();
    const amount = Number(String(tierPrice || 7500).replace(/[^0-9.]/g, "")) || 7500;

    const firstName = (delegateName || "Delegate").split(" ")[0] || "Delegate";
    const lastName = (delegateName || "").split(" ").slice(1).join(" ") || "";

    const orderRes = await fetch(BASE + "/Transactions/SubmitOrderRequest", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        id: reference,
        currency: "KES",
        amount: amount,
        description: "TWC 2026 Summit Pass: " + (tierName || "Delegate"),
        callback_url: origin + "/",
        notification_id: ipnId,
        branch: "QOHEL AFRICA GROUP",
        billing_address: {
          phone_number: cleanPhone,
          email_address: email || "delegate@qohelafrica.com",
          country_code: "KE",
          first_name: firstName,
          last_name: lastName,
          line_1: organization || "Qohel Delegate",
          city: "Nairobi",
        },
      }),
    });

    const order = await orderRes.json();

    const orderTrackingId = order.order_tracking_id || order.orderTrackingId || order.OrderTrackingId;
    const redirectUrl = order.redirect_url || order.redirectUrl || order.RedirectUrl;

    if (!orderTrackingId || !redirectUrl) {
      throw new Error(order.error?.message || order.message || "Pesapal rejected the order request");
    }

    return res.status(200).json({
      success: true,
      reference,
      phone: cleanPhone,
      orderTrackingId,
      redirectUrl,
      delegateName,
      tierName,
      amount,
      tierCode,
    });
  } catch (error) {
    console.error("Order initiate error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Payment initiation failed",
    });
  }
};
