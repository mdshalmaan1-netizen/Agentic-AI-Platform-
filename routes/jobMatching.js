/**
 * routes/jobMatching.js
 * -----------------------
 * Agent 2 – Job Matching Agent
 *
 * POST /api/agents/job-matching
 * Body: { "resumeText": "string", "jobDescription": "string" }
 *
 * Returns: match percentage, matching skills, missing skills,
 * suggestions to improve resume, and reason for the score.
 */

const express = require("express");
const router = express.Router();
const { generateJSON } = require("../config/gemini");
const { jobMatchingPrompt } = require("../utils/promptTemplates");
const { sendWhatsAppMessage } = require("../config/whatsapp");
const { formatJobMatch } = require("../utils/whatsappFormatters");

router.post("/", async (req, res) => {
  try {
    const { resumeText, jobDescription, notifyWhatsApp, phoneNumber } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: "Both resumeText and jobDescription are required.",
      });
    }

    const prompt = jobMatchingPrompt(resumeText, jobDescription);
    const matchResult = await generateJSON(prompt);

    let whatsapp;
    if (notifyWhatsApp) {
      if (!phoneNumber) {
        whatsapp = { success: false, error: "phoneNumber is required when notifyWhatsApp is true." };
      } else {
        whatsapp = await sendWhatsAppMessage(phoneNumber, formatJobMatch(matchResult));
      }
    }

    return res.status(200).json({
      success: true,
      agent: "Job Matching Agent",
      data: matchResult,
      ...(whatsapp ? { whatsapp } : {}),
    });
  } catch (error) {
    console.error("[Job Matching Error]", error.message);
    return res.status(500).json({
      success: false,
      agent: "Job Matching Agent",
      error: error.message || "Failed to match job.",
    });
  }
});

module.exports = router;
