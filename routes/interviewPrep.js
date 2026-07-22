/**
 * routes/interviewPrep.js
 * --------------------------
 * Agent 4 – Interview Preparation Agent
 *
 * POST /api/agents/interview-prep
 * Body: { "jobTitle": "string" }
 *
 * Returns: 10 technical questions, 10 HR questions, 5 coding questions.
 */

const express = require("express");
const router = express.Router();
const { generateJSON } = require("../config/gemini");
const { interviewPrepPrompt } = require("../utils/promptTemplates");
const { sendWhatsAppMessage } = require("../config/whatsapp");
const { formatInterviewPrep } = require("../utils/whatsappFormatters");

router.post("/", async (req, res) => {
  try {
    const { jobTitle, notifyWhatsApp, phoneNumber } = req.body;

    if (!jobTitle || typeof jobTitle !== "string") {
      return res.status(400).json({
        success: false,
        error: "jobTitle is required (e.g. 'Backend Developer').",
      });
    }

    const prompt = interviewPrepPrompt(jobTitle);
    const result = await generateJSON(prompt);

    let whatsapp;
    if (notifyWhatsApp) {
      if (!phoneNumber) {
        whatsapp = { success: false, error: "phoneNumber is required when notifyWhatsApp is true." };
      } else {
        whatsapp = await sendWhatsAppMessage(phoneNumber, formatInterviewPrep(result));
      }
    }

    return res.status(200).json({
      success: true,
      agent: "Interview Preparation Agent",
      data: result,
      ...(whatsapp ? { whatsapp } : {}),
    });
  } catch (error) {
    console.error("[Interview Prep Error]", error.message);
    return res.status(500).json({
      success: false,
      agent: "Interview Preparation Agent",
      error: error.message || "Failed to generate interview questions.",
    });
  }
});

module.exports = router;
