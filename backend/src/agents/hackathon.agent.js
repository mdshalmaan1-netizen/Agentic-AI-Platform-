import BaseAgent from './base.agent.js';

export class HackathonAgent extends BaseAgent {
  constructor() {
    super('Hackathon', 'Matches candidate skill sets with upcoming hackathons and suggests project concepts');
  }

  async recommend(userProfile) {
    const systemInstruction = `
      Match user profile with active tech hackathons and suggest winning project concepts.
      Return JSON:
      - recommendations: array of objects [
          {
            hackathonName: string,
            organizer: string,
            prizePool: string,
            suggestedProject: string,
            techStack: array of strings,
            difficulty: string
          }
        ]
    `;

    const prompt = `User Profile: ${JSON.stringify(userProfile)}`;
    const result = await this._callGemini(prompt, systemInstruction);

    if (result) return result;

    return {
      recommendations: [
        {
          hackathonName: 'Global AI Agent Innovation Challenge',
          organizer: 'Google Cloud & Devpost',
          prizePool: '$50,000',
          suggestedProject: 'Agentic Resume & Job Matcher Platform',
          techStack: ['Gemini 1.5 Flash', 'React', 'Node.js', 'PostgreSQL'],
          difficulty: 'Intermediate',
        },
      ],
    };
  }
}

export default new HackathonAgent();
