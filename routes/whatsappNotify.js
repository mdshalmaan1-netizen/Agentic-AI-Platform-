/**
 * routes/whatsappNotify.js
 * ---------------------------
 * Standalone WhatsApp notification endpoint — not tied to any single
 * agent. Use this to send custom messages (e.g. job alerts, interview
 * reminders, "your report is ready" pings) independently of the
 * per-agent notifyWhatsApp flag.
 *
 * POST /api/notify/whatsapp
 * Body: { "phoneNumber": "+919876543210", "message": "string" }
 */

const express = require("express");
const router = express.Router();
const { sendWhatsAppMessage, isWhatsAppConfigured } = require("../config/whatsapp");

router.post("/", async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        error: "phoneNumber and message are both required.",
      });
    }

    const result = await sendWhatsAppMessage(phoneNumber, message);

    return res.status(result.success ? 200 : 502).json({
      success: result.success,
      agent: "WhatsApp Notifier",
      data: result.success ? { sid: result.sid } : undefined,
      error: result.success ? undefined : result.error,
    });
  } catch (error) {
    console.error("[WhatsApp Notify Error]", error.message);
    return res.status(500).json({
      success: false,
      agent: "WhatsApp Notifier",
      error: error.message || "Failed to send WhatsApp message.",
    });
  }
});

// Lets the frontend check whether WhatsApp is configured before showing the option
router.get("/status", (req, res) => {
  res.status(200).json({ success: true, configured: isWhatsAppConfigured });
});

module.exports = router;
