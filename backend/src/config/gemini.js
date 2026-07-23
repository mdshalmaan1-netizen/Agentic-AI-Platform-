import { GoogleGenerativeAI } from '@google/generative-ai';
import config from './index.js';

let genAI = null;

if (config.gemini.apiKey) {
  try {
    genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    console.log('✅ Google Generative AI (Gemini) client initialized');
  } catch (error) {
    console.warn('⚠️ Gemini initialization error:', error.message);
  }
} else {
  console.warn('⚠️ GEMINI_API_KEY is missing. AI agents will run in fallback mock mode.');
}

export { genAI };
export default genAI;
