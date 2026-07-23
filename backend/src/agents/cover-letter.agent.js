import BaseAgent from './base.agent.js';

export class CoverLetterAgent extends BaseAgent {
  constructor() {
    super('CoverLetter', 'Generates personalized cover letters customized to job descriptions');
  }

  async generate(candidateProfile, jobDetails, tone = 'Professional') {
    const systemInstruction = `
      You are an Executive Resume Writer.
      Write a compelling cover letter customized for candidate profile and job description.
      Tone: ${tone}.
      Return JSON:
      - subjectLine: string
      - coverLetterText: string (formatted markdown paragraphs)
      - keyHighlightsUsed: array of candidate skills emphasized
    `;

    const prompt = `
      Candidate Profile: ${JSON.stringify(candidateProfile)}
      Job Details: ${JSON.stringify(jobDetails)}
    `;

    const result = await this._callGemini(prompt, systemInstruction, 0.4);
    if (result) return result;

    const company = jobDetails?.company || 'Hiring Team';
    const role = jobDetails?.title || 'Software Engineer';
    const name = candidateProfile?.name || 'Candidate';

    return {
      subjectLine: `Application for ${role} - ${name}`,
      coverLetterText: `Dear Hiring Manager at ${company},\n\nI am writing to express my strong enthusiasm for the ${role} position. With my background in software engineering and web application development, I am confident in my ability to deliver immediate value to your team.\n\nThroughout my career, I have specialized in building robust full-stack applications, optimizing API performance, and writing clean, maintainable code. My experience aligns closely with your core requirements.\n\nThank you for considering my application. I welcome the opportunity to discuss how my skills can support ${company}'s goals.\n\nSincerely,\n${name}`,
      keyHighlightsUsed: ['Full Stack Development', 'API Design', 'Clean Code Practices'],
    };
  }
}

export default new CoverLetterAgent();
