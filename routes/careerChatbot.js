/**
 * routes/careerChatbot.js
 * --------------------------
 * Agent 5 – Career Chatbot
 *
 * POST /api/agents/career-chatbot
 * Body: { "message": "string", "sessionId": "string" (optional) }
 *
 * Handles free-form career questions:
 *   "Find React internships."
 *   "Improve my resume."
 *   "Explain Docker."
 *   "Suggest cloud certifications."
 *   "Recommend hackathons."
 *
 * A lightweight in-memory store keeps short conversation history per
 * sessionId so the chatbot has context across turns. This resets when
 * the server restarts — swap in Redis/a DB for production use.
 */

const express = require("express");
const router = express.Router();
const { generateContent } = require("../config/gemini");
const { careerChatbotPrompt } = require("../utils/promptTemplates");
const { sendWhatsAppMessage } = require("../config/whatsapp");
const { formatChatbotReply } = require("../utils/whatsappFormatters");

// sessionId -> [{ role: "user"|"assistant", content: "string" }]
const sessionStore = new Map();
const MAX_HISTORY_TURNS = 6; // keep last 6 messages per session

router.post("/", async (req, res) => {
  try {
    const { message, sessionId = "default", notifyWhatsApp, phoneNumber } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "message is required (e.g. 'Explain Docker.').",
      });
    }

    const history = sessionStore.get(sessionId) || [];

    const prompt = careerChatbotPrompt(message, history);
    const replyText = await generateContent(prompt);

    // Update session history
    const updatedHistory = [
      ...history,
      { role: "user", content: message },
      { role: "assistant", content: replyText },
    ].slice(-MAX_HISTORY_TURNS);

    sessionStore.set(sessionId, updatedHistory);

    let whatsapp;
    if (notifyWhatsApp) {
      if (!phoneNumber) {
        whatsapp = { success: false, error: "phoneNumber is required when notifyWhatsApp is true." };
      } else {
        whatsapp = await sendWhatsAppMessage(phoneNumber, formatChatbotReply({ reply: replyText.trim() }));
      }
    }

    return res.status(200).json({
      success: true,
      agent: "Career Chatbot",
      data: {
        reply: replyText.trim(),
        sessionId,
      },
      ...(whatsapp ? { whatsapp } : {}),
    });
  } catch (error) {
    console.error("[Career Chatbot Error]", error.message);
    return res.status(500).json({
      success: false,
      agent: "Career Chatbot",
      error: error.message || "Failed to generate a reply.",
    });
  }
});

// Optional: clear a session's history
router.delete("/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  sessionStore.delete(sessionId);
  return res.status(200).json({ success: true, message: `Session ${sessionId} cleared.` });
});

module.exports = router;
