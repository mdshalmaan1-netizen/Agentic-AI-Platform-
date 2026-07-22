/**
 * config/gemini.js
 * -----------------
 * Central place that sets up the Google Gemini client and exposes
 * two helper functions used by every agent route:
 *
 *   generateContent(prompt)      -> returns raw text from Gemini
 *   generateJSON(prompt)         -> returns a parsed JS object,
 *                                    even if Gemini wraps the JSON
 *                                    in ```json ``` fences.
 *
 * Keeping this logic in one file means every agent talks to Gemini
 * the same way, with the same error handling and the same JSON
 * safety net.
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "⚠️  GEMINI_API_KEY is not set. Add it to your .env file before making requests."
  );
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash";

/**
 * Returns a configured GenerativeModel instance.
 * generationConfig keeps responses deterministic-ish and capped in size.
 */
function getModel(systemInstruction) {
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction,
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: 4096,
    },
  });
}

/**
 * Calls Gemini with a plain prompt and returns the raw text response.
 * @param {string} prompt - The user/task prompt.
 * @param {string} [systemInstruction] - Optional system-level instruction.
 */
async function generateContent(prompt, systemInstruction) {
  try {
    const model = getModel(systemInstruction);
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error.message);
    throw new Error(`Gemini API request failed: ${error.message}`);
  }
}

/**
 * Strips markdown code fences (```json ... ```) that Gemini sometimes
 * wraps around JSON output, then parses the result.
 */
function safeJSONParse(rawText) {
  let cleaned = rawText.trim();

  // Remove ```json / ``` fences if present
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "");
  cleaned = cleaned.replace(/```\s*$/i, "");

  // Some models add stray text before/after the JSON object/array.
  // Try to isolate the first {...} or [...] block as a fallback.
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const objMatch = cleaned.match(/\{[\s\S]*\}/);
    const arrMatch = cleaned.match(/\[[\s\S]*\]/);
    const candidate = objMatch ? objMatch[0] : arrMatch ? arrMatch[0] : null;

    if (candidate) {
      try {
        return JSON.parse(candidate);
      } catch (innerErr) {
        throw new Error(
          `Failed to parse Gemini JSON response: ${innerErr.message}`
        );
      }
    }
    throw new Error(`Failed to parse Gemini JSON response: ${err.message}`);
  }
}

/**
 * Calls Gemini and guarantees the return value is a parsed JS object.
 * Always instruct the prompt to "return ONLY valid JSON" for best results.
 */
async function generateJSON(prompt, systemInstruction) {
  const rawText = await generateContent(prompt, systemInstruction);
  return safeJSONParse(rawText);
}

module.exports = {
  genAI,
  getModel,
  generateContent,
  generateJSON,
  MODEL_NAME,
};
