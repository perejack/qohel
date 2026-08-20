// Vercel Serverless API Route: POST /api/initiate
const axios = require("axios");

const BASE = "https://pay.pesapal.com/v3/api";

// Direct Live Production Keys for Qohel Africa Systems
const PESAPAL_KEY    = "gQSstjnS/AotrkwJMev+Rv1T2RCfxwxC";
const PESAPAL_SECRET = "gUQNgRFiFG/gygGoj1T69hJjiO0=";

function normalizePhone(raw) {
  const digits = String(raw).replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return "254" + digits.slice(1);
  return "254" + digits;
}

async function getToken() {
  try {
    const { data } = await axios.post(
      BASE + "/Auth/RequestToken",
      { consumer_key: PESAPAL_KEY, consumer_secret: PESAPAL_SECRET },
      { headers: { "Content-Type": "application/json", Accept: "application/json" } }
    );
    if (!data.token) {
      const msg = data.error?.message || data.error?.code || data.message || JSON.stringify(data.error) || "No token returned";
      throw new Error(msg);
    }
    return data.token;
  } catch (err) {
    const detail = err.response?.data?.error?.message || err.response?.data?.message || err.message;
    console.error("[PesaPal Auth Error]:", err.response?.data || err.message);
    throw new Error("Could not authenticate with Pesapal: " + detail);
  }
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

    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
    const proto = req.headers["x-forwarded-proto"] || "https";
    const origin = clientOrigin || (proto + "://" + host);

    const token = await getToken();
    const authHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    };

    // Register IPN URL
    let ipnId = "f2b38c53-ac56-49e2-ba7e-da00bb8c44aa";
    try {
      const ipnRes = await axios.post(
        BASE + "/URLSetup/RegisterIPN",
        {
          url: origin + "/api/pesapal-ipn",
          ipn_notification_type: "GET",
        },
        { headers: authHeaders }
      );
      const ipn = ipnRes.data;
      if (ipn.ipn_id || ipn.id) {
        ipnId = ipn.ipn_id || ipn.id;
      }
    } catch (e) {
      console.warn("IPN registration notice:", e.response?.data || e.message);
    }

    const cleanPhone = normalizePhone(phone || "0115475254");
    const reference = "QAG-TWC-" + Date.now();
    // Test mode active: charge 10 KES for testing payment gateway as requested
    const amount = 10;

    const firstName = (delegateName || "Delegate").split(" ")[0] || "Delegate";
    const lastName = (delegateName || "").split(" ").slice(1).join(" ") || "";

    const orderRes = await axios.post(
      BASE + "/Transactions/SubmitOrderRequest",
      {
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
      },
      { headers: authHeaders }
    );

    const order = orderRes.data;
    const orderTrackingId = order.order_tracking_id || order.orderTrackingId || order.OrderTrackingId;
    const redirectUrl = order.redirect_url || order.redirectUrl || order.RedirectUrl;

    if (!orderTrackingId || !redirectUrl) {
      if (order.error?.code === "amount_exceeds_default_limit") {
        throw new Error(
          `PesaPal Account Limit: Amount (KSh ${amount.toLocaleString()}) exceeds your account's temporary uncontracted limit (max KSh 1,000). Contact PesaPal merchant support or complete business onboarding to process full tier amounts.`
        );
      }
      const errMsg = order.error?.message || order.error?.code || order.message || "Pesapal rejected the order request";
      throw new Error(errMsg);
    }

    return res.status(200).json({
      success: true,
      reference,
      phone: cleanPhone,
      orderTrackingId,
      redirectUrl,
      delegateName,
      tierName,
      amount: amount,
      tierCode,
    });
  } catch (error) {
    console.error("Order initiate error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message || "Payment initiation failed",
    });
  }
};

