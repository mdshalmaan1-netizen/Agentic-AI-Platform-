/**
 * config/whatsapp.js
 * --------------------
 * WhatsApp notification support via Twilio's WhatsApp API.
 *
 * Twilio is used because it's the most widely supported, official way
 * to send WhatsApp messages programmatically from Node.js without
 * needing to run your own WhatsApp Web automation (which violates
 * WhatsApp's terms of service).
 *
 * SETUP (free sandbox, no business verification needed for testing):
 *   1. Create a free account at https://www.twilio.com/try-twilio
 *   2. Go to Messaging -> Try it out -> Send a WhatsApp message
 *      to activate the Twilio Sandbox for WhatsApp.
 *   3. On your phone, WhatsApp the "join <your-sandbox-code>" message
 *      to the Twilio sandbox number shown on that page.
 *   4. Copy your Account SID, Auth Token, and the sandbox WhatsApp
 *      number (usually whatsapp:+14155238886) into .env.
 *
 * In production, you'd apply for a verified WhatsApp Business sender
 * instead of using the sandbox number.
 */

const twilio = require("twilio");

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM, // e.g. "whatsapp:+14155238886"
} = process.env;

let client = null;
const isConfigured = Boolean(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_WHATSAPP_FROM);

if (isConfigured) {
  client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
} else {
  console.warn(
    "⚠️  Twilio WhatsApp credentials are not fully set. WhatsApp notifications will be skipped until TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM are set in .env."
  );
}

/**
 * Normalizes a phone number into Twilio's required "whatsapp:+<E164>" format.
 * Accepts numbers with or without the "whatsapp:" prefix and with or
 * without a leading "+".
 */
function toWhatsAppAddress(phoneNumber) {
  if (!phoneNumber) return null;
  let num = phoneNumber.trim();
  if (num.startsWith("whatsapp:")) return num;
  if (!num.startsWith("+")) num = `+${num}`;
  return `whatsapp:${num}`;
}

/**
 * Sends a WhatsApp message via Twilio.
 * @param {string} toPhoneNumber - Recipient's phone number, e.g. "+919876543210"
 * @param {string} message - The text to send (Twilio sandbox truncates very long messages)
 * @returns {Promise<{success: boolean, sid?: string, error?: string}>}
 */
async function sendWhatsAppMessage(toPhoneNumber, message) {
  if (!isConfigured) {
    return {
      success: false,
      error:
        "WhatsApp is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM in .env.",
    };
  }

  const to = toWhatsAppAddress(toPhoneNumber);
  if (!to) {
    return { success: false, error: "A valid recipient phone number is required." };
  }

  // WhatsApp messages have a 1600 character practical limit via Twilio.
  const trimmedMessage =
    message.length > 1500 ? `${message.slice(0, 1500)}\n\n...(truncated)` : message;

  try {
    const result = await client.messages.create({
      from: TWILIO_WHATSAPP_FROM,
      to,
      body: trimmedMessage,
    });
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error("WhatsApp send error:", error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendWhatsAppMessage,
  isWhatsAppConfigured: isConfigured,
};
