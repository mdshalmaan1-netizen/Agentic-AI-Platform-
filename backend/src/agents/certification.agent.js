import BaseAgent from './base.agent.js';

export class CertificationAgent extends BaseAgent {
  constructor() {
    super('Certification', 'Recommends industry certifications based on target roles and skill gaps');
  }

  async recommend(skillGaps = [], targetRole = 'Software Engineer') {
    const systemInstruction = `
      Recommend top 4 industry certifications to bridge skill gaps for target role: ${targetRole}.
      Skill Gaps: ${skillGaps.join(', ')}.
      Return JSON:
      - certifications: array of objects [
          {
            name: string,
            provider: string,
            url: string,
            level: 'Beginner' | 'Intermediate' | 'Advanced',
            estimatedDuration: string,
            skillsAddressed: array of strings
          }
        ]
    `;

    const prompt = `Recommend certifications for ${targetRole} with skill gaps: ${skillGaps.join(', ')}`;
    const result = await this._callGemini(prompt, systemInstruction);

    if (result) return result;

    return {
      certifications: [
        {
          name: 'AWS Certified Cloud Practitioner',
          provider: 'Amazon Web Services',
          url: 'https://aws.amazon.com/certification/',
          level: 'Beginner',
          estimatedDuration: '4 Weeks',
          skillsAddressed: ['Cloud Architecture', 'AWS S3', 'EC2'],
        },
        {
          name: 'Meta Front-End Developer Certificate',
          provider: 'Coursera / Meta',
          url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
          level: 'Intermediate',
          estimatedDuration: '6 Weeks',
          skillsAddressed: ['React', 'JavaScript', 'UX/UI Engineering'],
        },
      ],
    };
  }
}

export default new CertificationAgent();
