/**
 * routes/coverLetter.js
 * -----------------------
 * Agent 3 – Cover Letter Generator
 *
 * POST /api/agents/cover-letter
 * Body: { "companyName": "string", "jobTitle": "string", "resumeText": "string" }
 *
 * Returns: a professional, personalized cover letter.
 */

const express = require("express");
const router = express.Router();
const { generateJSON } = require("../config/gemini");
const { coverLetterPrompt } = require("../utils/promptTemplates");
const { sendWhatsAppMessage } = require("../config/whatsapp");
const { formatCoverLetter } = require("../utils/whatsappFormatters");

router.post("/", async (req, res) => {
  try {
    const { companyName, jobTitle, resumeText, notifyWhatsApp, phoneNumber } = req.body;

    if (!companyName || !jobTitle || !resumeText) {
      return res.status(400).json({
        success: false,
        error: "companyName, jobTitle, and resumeText are all required.",
      });
    }

    const prompt = coverLetterPrompt(companyName, jobTitle, resumeText);
    const result = await generateJSON(prompt);

    let whatsapp;
    if (notifyWhatsApp) {
      if (!phoneNumber) {
        whatsapp = { success: false, error: "phoneNumber is required when notifyWhatsApp is true." };
      } else {
        whatsapp = await sendWhatsAppMessage(phoneNumber, formatCoverLetter(result));
      }
    }

    return res.status(200).json({
      success: true,
      agent: "Cover Letter Generator",
      data: result,
      ...(whatsapp ? { whatsapp } : {}),
    });
  } catch (error) {
    console.error("[Cover Letter Error]", error.message);
    return res.status(500).json({
      success: false,
      agent: "Cover Letter Generator",
      error: error.message || "Failed to generate cover letter.",
    });
  }
});

module.exports = router;
