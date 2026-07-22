/**
 * server.js
 * ----------
 * Entry point for the Agentic AI Platform.
 *
 * Wires together 5 independent AI agents, each on its own route file,
 * all powered by the Google Gemini API.
 *
 *   Agent 1  /api/agents/resume-analyzer   - Resume Analyzer
 *   Agent 2  /api/agents/job-matching      - Job Matching Agent
 *   Agent 3  /api/agents/cover-letter      - Cover Letter Generator
 *   Agent 4  /api/agents/interview-prep    - Interview Preparation Agent
 *   Agent 5  /api/agents/career-chatbot    - Career Chatbot
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const resumeAnalyzerRoutes = require("./routes/resumeAnalyzer");
const jobMatchingRoutes = require("./routes/jobMatching");
const coverLetterRoutes = require("./routes/coverLetter");
const interviewPrepRoutes = require("./routes/interviewPrep");
const careerChatbotRoutes = require("./routes/careerChatbot");
const whatsappNotifyRoutes = require("./routes/whatsappNotify");

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------------------------------------------
// Core middleware
// ------------------------------------------------------------------
app.use(cors());
app.use(express.json({ limit: "2mb" })); // resumes can be long
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Basic rate limiting to protect your Gemini API quota
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please try again later.",
  },
});
app.use("/api/", apiLimiter);

// Serve a simple static test page (optional front end)
app.use(express.static(path.join(__dirname, "public")));

// ------------------------------------------------------------------
// Routes — one router per agent, mounted under /api/agents
// ------------------------------------------------------------------
app.use("/api/agents/resume-analyzer", resumeAnalyzerRoutes);
app.use("/api/agents/job-matching", jobMatchingRoutes);
app.use("/api/agents/cover-letter", coverLetterRoutes);
app.use("/api/agents/interview-prep", interviewPrepRoutes);
app.use("/api/agents/career-chatbot", careerChatbotRoutes);
app.use("/api/notify/whatsapp", whatsappNotifyRoutes);

// ------------------------------------------------------------------
// Health check + API index
// ------------------------------------------------------------------
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Agentic AI Platform API",
    agents: [
      {
        name: "Resume Analyzer",
        method: "POST",
        endpoint: "/api/agents/resume-analyzer",
        body: {
          resumeText: "string",
          notifyWhatsApp: "boolean (optional)",
          phoneNumber: "string (optional, required if notifyWhatsApp=true)",
        },
      },
      {
        name: "Job Matching Agent",
        method: "POST",
        endpoint: "/api/agents/job-matching",
        body: {
          resumeText: "string",
          jobDescription: "string",
          notifyWhatsApp: "boolean (optional)",
          phoneNumber: "string (optional)",
        },
      },
      {
        name: "Cover Letter Generator",
        method: "POST",
        endpoint: "/api/agents/cover-letter",
        body: {
          companyName: "string",
          jobTitle: "string",
          resumeText: "string",
          notifyWhatsApp: "boolean (optional)",
          phoneNumber: "string (optional)",
        },
      },
      {
        name: "Interview Preparation Agent",
        method: "POST",
        endpoint: "/api/agents/interview-prep",
        body: {
          jobTitle: "string",
          notifyWhatsApp: "boolean (optional)",
          phoneNumber: "string (optional)",
        },
      },
      {
        name: "Career Chatbot",
        method: "POST",
        endpoint: "/api/agents/career-chatbot",
        body: {
          message: "string",
          sessionId: "string (optional)",
          notifyWhatsApp: "boolean (optional)",
          phoneNumber: "string (optional)",
        },
      },
      {
        name: "WhatsApp Notifier (standalone)",
        method: "POST",
        endpoint: "/api/notify/whatsapp",
        body: { phoneNumber: "string", message: "string" },
      },
    ],
  });
});

// ------------------------------------------------------------------
// 404 handler
// ------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ------------------------------------------------------------------
// Global error handler (catches anything thrown synchronously in routes)
// ------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error.",
  });
});

// ------------------------------------------------------------------
// Start server
// ------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Agentic AI Platform running at http://localhost:${PORT}`);
  console.log(`📖 API index:     http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
