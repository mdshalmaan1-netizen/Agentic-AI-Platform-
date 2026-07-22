/**
 * utils/whatsappFormatters.js
 * ------------------------------
 * WhatsApp messages are plain text, not JSON. These functions turn each
 * agent's structured output into a short, readable summary to send as
 * a notification. Kept separate from promptTemplates.js because this is
 * output formatting, not prompt engineering.
 */

const list = (arr, max = 6) =>
  (arr || []).slice(0, max).map((i) => `• ${i}`).join("\n") || "None";

function formatResumeAnalysis(data) {
  return (
    `📄 *Resume Analysis Complete*\n\n` +
    `⭐ Score: ${data.resumeScore}/100\n\n` +
    `*Top Skills:*\n${list(data.skills)}\n\n` +
    `*Missing Skills:*\n${list(data.missingSkills)}\n\n` +
    `*Suggestions:*\n${list(data.improvementSuggestions, 3)}`
  );
}

function formatJobMatch(data) {
  return (
    `🎯 *Job Match Result*\n\n` +
    `Match: ${data.matchPercentage}%\n` +
    `Fit: ${data.seniorityFit}\n\n` +
    `*Matching Skills:*\n${list(data.matchingSkills)}\n\n` +
    `*Missing Skills:*\n${list(data.missingSkills)}\n\n` +
    `*Why:* ${data.reasonForScore}`
  );
}

function formatCoverLetter(data) {
  return `✉️ *Your Cover Letter is Ready*\n\n${data.coverLetter}`;
}

function formatInterviewPrep(data) {
  return (
    `🧠 *Interview Prep: ${data.jobTitle}*\n\n` +
    `*Technical Questions:*\n${list(data.technicalQuestions, 5)}\n\n` +
    `*HR Questions:*\n${list(data.hrQuestions, 5)}\n\n` +
    `*Coding Questions:*\n${list(
      (data.codingQuestions || []).map((q) => `${q.question} (${q.difficulty})`),
      5
    )}`
  );
}

function formatChatbotReply(data) {
  return `🤖 *CareerBot*\n\n${data.reply}`;
}

module.exports = {
  formatResumeAnalysis,
  formatJobMatch,
  formatCoverLetter,
  formatInterviewPrep,
  formatChatbotReply,
};
