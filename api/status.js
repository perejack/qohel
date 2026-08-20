// Vercel Serverless API Route: POST /api/status or GET /api/status?orderTrackingId=...
const axios = require("axios");

const BASE = "https://pay.pesapal.com/v3/api";

const PESAPAL_KEY    = process.env.PESAPAL_CONSUMER_KEY    || "gQSstjnS/AotrkwJMev+Rv1T2RCfxwxC";
const PESAPAL_SECRET = process.env.PESAPAL_CONSUMER_SECRET || "gUQNgRFiFG/gygGoj1T69hJjiO0=";

async function getToken() {
  try {
    const { data } = await axios.post(
      BASE + "/Auth/RequestToken",
      { consumer_key: PESAPAL_KEY, consumer_secret: PESAPAL_SECRET },
      { headers: { "Content-Type": "application/json", Accept: "application/json" } }
    );
    if (!data.token) throw new Error(data.error?.message || data.message || "No token returned");
    return data.token;
  } catch (err) {
    console.error("[PesaPal Auth Error]:", err.response?.data || err.message);
    throw new Error("Could not authenticate with Pesapal: " + (err.response?.data?.message || err.message));
  }
}

module.exports = async function handler(req, res) {
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

  try {
    const orderTrackingId =
      req.query?.orderTrackingId ||
      req.body?.orderTrackingId ||
      req.query?.OrderTrackingId ||
      req.body?.OrderTrackingId;

    if (!orderTrackingId) {
      return res.status(400).json({ success: false, error: "Missing orderTrackingId parameter" });
    }

    const token = await getToken();
    const statusRes = await axios.get(
      BASE + "/Transactions/GetTransactionStatus?orderTrackingId=" + encodeURIComponent(orderTrackingId),
      {
        headers: { Accept: "application/json", Authorization: "Bearer " + token },
      }
    );

    const raw = statusRes.data;
    const statusDesc = raw.payment_status_description || raw.paymentStatusDescription || raw.status || "PENDING";
    const statusCode = raw.status_code ?? raw.statusCode ?? -1;
    const confirmationCode = raw.confirmation_code || raw.confirmationCode || "";
    const paymentMethod = raw.payment_method || raw.paymentMethod || "M-PESA";

    const isCompleted =
      statusCode === 1 || String(statusCode) === "1" || statusDesc.toLowerCase() === "completed";
    const isFailed =
      statusCode === 2 || String(statusCode) === "2" || statusDesc.toLowerCase() === "failed";

    return res.status(200).json({
      success: true,
      status: isCompleted ? "COMPLETED" : isFailed ? "FAILED" : "PENDING",
      rawStatus: statusDesc,
      confirmationCode,
      paymentMethod,
      description: raw.description || "",
    });
  } catch (error) {
    console.error("Status error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message || "Failed to check status",
    });
  }
};

