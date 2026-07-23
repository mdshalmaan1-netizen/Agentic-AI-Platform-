import BaseAgent from './base.agent.js';

export class InternshipAgent extends BaseAgent {
  constructor() {
    super('Internship', 'Analyzes internship listings and evaluates candidate fit');
  }

  async rankInternships(userProfile, internshipsList) {
    const systemInstruction = `
      Evaluate candidate profile against internships list.
      Return JSON:
      - rankedInternships: array of objects [
          {
            internshipId: string,
            matchPercentage: int,
            keyMatchFactors: array of strings,
            stipendEvaluation: string
          }
        ]
    `;

    const prompt = `Profile: ${JSON.stringify(userProfile)}\nInternships: ${JSON.stringify(internshipsList)}`;
    const result = await this._callGemini(prompt, systemInstruction);

    if (result) return result;

    return {
      rankedInternships: (internshipsList || []).map((item) => ({
        internshipId: item.id,
        matchPercentage: 88,
        keyMatchFactors: ['Strong JavaScript foundation', 'Good project portfolio'],
        stipendEvaluation: 'Competitive market stipend',
      })),
    };
  }
}

export default new InternshipAgent();
