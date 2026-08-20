// Vercel Serverless API Route: /api/pesapal-ipn
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const orderTrackingId = req.query?.OrderTrackingId || req.body?.OrderTrackingId;
  const orderMerchantReference = req.query?.OrderMerchantReference || req.body?.OrderMerchantReference;
  const orderNotificationType = req.query?.OrderNotificationType || req.body?.OrderNotificationType;

  return res.status(200).json({
    orderNotificationType: orderNotificationType || "IPNCHANGE",
    orderTrackingId: orderTrackingId || "",
    orderMerchantReference: orderMerchantReference || "",
    status: 200,
  });
};
