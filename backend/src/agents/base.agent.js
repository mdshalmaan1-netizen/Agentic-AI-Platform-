import genAI from '../config/gemini.js';
import { getCache, setCache } from '../shared/utils/cache.js';

export class BaseAgent {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.modelName = 'gemini-1.5-flash';
  }

  async _callGemini(prompt, systemInstruction = '', temperature = 0.4) {
    if (!genAI) {
      console.warn(`[${this.name}] Gemini client unavailable. Executing intelligent agent fallback.`);
      return null;
    }

    const modelsToTry = [this.modelName, 'gemini-1.5-flash-latest', 'gemini-2.0-flash', 'gemini-pro'];

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction,
          generationConfig: {
            temperature,
          },
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonParsed = this._safeJsonParse(text);
        if (jsonParsed) return jsonParsed;

        return {
          response: text,
          recommendedActions: ['Explore active tech internships', 'Update ATS profile resume', 'Practice technical interview questions'],
          suggestedQuestions: ['What skills should I highlight on my resume?', 'Show me top React & Python internships', 'How do I crack technical interviews?'],
        };
      } catch (error) {
        console.warn(`[${this.name}] Model ${modelName} call failed:`, error.message);
      }
    }

    return null;
  }

  _safeJsonParse(text) {
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (e) {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      try {
        return JSON.parse(cleaned);
      } catch (err) {
        return null;
      }
    }
  }

  async _getCachedResult(key) {
    return getCache(`agent:${this.name}:${key}`);
  }

  async _setCachedResult(key, data, ttlSeconds = 7200) {
    return setCache(`agent:${this.name}:${key}`, data, ttlSeconds);
  }
}

export default BaseAgent;
