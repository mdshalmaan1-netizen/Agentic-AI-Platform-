/**
 * routes/resumeAnalyzer.js
 * -------------------------
 * Agent 1 – Resume Analyzer
 *
 * POST /api/agents/resume-analyzer
 * Body: { "resumeText": "string" }
 *
 * Returns structured JSON: skills, programming languages, frameworks,
 * projects, certifications, education, experience, resume score /100,
 * and missing skills.
 */

const express = require("express");
const router = express.Router();
const { generateJSON } = require("../config/gemini");
const { resumeAnalyzerPrompt } = require("../utils/promptTemplates");
const { sendWhatsAppMessage } = require("../config/whatsapp");
const { formatResumeAnalysis } = require("../utils/whatsappFormatters");

router.post("/", async (req, res) => {
  try {
    const { resumeText, notifyWhatsApp, phoneNumber } = req.body;

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 30) {
      return res.status(400).json({
        success: false,
        error: "resumeText is required and must be a meaningful resume (min ~30 characters).",
      });
    }

    const prompt = resumeAnalyzerPrompt(resumeText);
    const analysis = await generateJSON(prompt);

    // Optional: notify the user on WhatsApp with a summary of the result
    let whatsapp;
    if (notifyWhatsApp) {
      if (!phoneNumber) {
        whatsapp = { success: false, error: "phoneNumber is required when notifyWhatsApp is true." };
      } else {
        whatsapp = await sendWhatsAppMessage(phoneNumber, formatResumeAnalysis(analysis));
      }
    }

    return res.status(200).json({
      success: true,
      agent: "Resume Analyzer",
      data: analysis,
      ...(whatsapp ? { whatsapp } : {}),
    });
  } catch (error) {
    console.error("[Resume Analyzer Error]", error.message);
    return res.status(500).json({
      success: false,
      agent: "Resume Analyzer",
      error: error.message || "Failed to analyze resume.",
    });
  }
});

module.exports = router;
