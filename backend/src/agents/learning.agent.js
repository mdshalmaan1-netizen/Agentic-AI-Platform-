import BaseAgent from './base.agent.js';

export class LearningAgent extends BaseAgent {
  constructor() {
    super('Learning', 'Curates targeted learning modules, open source repos, and tutorials');
  }

  async curate(missingSkills = []) {
    const systemInstruction = `
      Curate high quality free learning resources and open source projects for skills: ${missingSkills.join(', ')}.
      Return JSON:
      - resources: array of objects [
          {
            skill: string,
            title: string,
            url: string,
            type: 'Course' | 'GitHub Repository' | 'Article' | 'Documentation',
            estimatedHours: int
          }
        ]
    `;

    const prompt = `Curate learning resources for: ${missingSkills.join(', ')}`;
    const result = await this._callGemini(prompt, systemInstruction);

    if (result) return result;

    return {
      resources: missingSkills.map((skill) => ({
        skill,
        title: `Mastering ${skill} Step-by-Step`,
        url: `https://github.com/topics/${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        type: 'GitHub Repository',
        estimatedHours: 8,
      })),
    };
  }
}

export default new LearningAgent();
