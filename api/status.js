// Vercel Serverless API Route: POST /api/status or GET /api/status?orderTrackingId=...
const rawBase = process.env.PESAPAL_BASE_URL || "https://pay.pesapal.com/v3";
const BASE = rawBase.endsWith("/api") ? rawBase : rawBase.replace(/\/$/, "") + "/api";

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

    const key = process.env.PESAPAL_CONSUMER_KEY;
    const secret = process.env.PESAPAL_CONSUMER_SECRET;

    if (!key || !secret) {
      return res.status(500).json({ success: false, error: "Pesapal credentials are not configured" });
    }

    const token = await getToken(key, secret);
    const statusRes = await fetch(
      BASE + "/Transactions/GetTransactionStatus?orderTrackingId=" + encodeURIComponent(orderTrackingId),
      {
        headers: { Accept: "application/json", Authorization: "Bearer " + token },
      }
    );

    const raw = await statusRes.json();
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
    console.error("Status error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to check status",
    });
  }
};
