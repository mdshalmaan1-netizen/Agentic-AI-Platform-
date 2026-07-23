import BaseAgent from './base.agent.js';

export class RoadmapAgent extends BaseAgent {
  constructor() {
    super('Roadmap', 'Generates step-by-step career path timelines and skill roadmaps');
  }

  async generateRoadmap(targetRole, currentSkills = []) {
    const systemInstruction = `
      You are a Tech Career Architect.
      Create a 6-week career transformation roadmap for target role: ${targetRole}.
      Current Skills: ${currentSkills.join(', ')}.
      Return JSON:
      - title: string
      - durationWeeks: integer
      - targetRole: string
      - weeks: array of objects [
          {
            weekNumber: int,
            theme: string,
            objectives: array of strings,
            recommendedProjects: array of strings,
            learningResources: array of strings
          }
        ]
    `;

    const prompt = `Generate a 6-week roadmap to become a successful ${targetRole}.`;
    const result = await this._callGemini(prompt, systemInstruction);

    if (result) return result;

    return {
      title: `6-Week Roadmap to ${targetRole}`,
      durationWeeks: 6,
      targetRole,
      weeks: [
        {
          weekNumber: 1,
          theme: 'Frontend Architecture & Modern React',
          objectives: ['Master State Management', 'Hooks & Custom Hooks', 'Tailwind Layout Systems'],
          recommendedProjects: ['Interactive Analytics Dashboard'],
          learningResources: ['React Documentation', 'Modern Web Patterns Guide'],
        },
        {
          weekNumber: 2,
          theme: 'Backend API & Database Mastery',
          objectives: ['Build REST APIs with Express', 'Prisma ORM & PostgreSQL Schema Design'],
          recommendedProjects: ['E-Commerce REST API with Auth'],
          learningResources: ['Node.js & Express Best Practices'],
        },
        {
          weekNumber: 3,
          theme: 'AI Integration & Multi-Agent Pipelines',
          objectives: ['Integrate Gemini API', 'Build Prompt Orchestration Engine'],
          recommendedProjects: ['AI Smart Assistant'],
          learningResources: ['Google Generative AI Documentation'],
        },
      ],
    };
  }
}

export default new RoadmapAgent();
