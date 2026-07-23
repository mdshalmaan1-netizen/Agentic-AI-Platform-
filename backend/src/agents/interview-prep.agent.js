import BaseAgent from './base.agent.js';

export class InterviewPrepAgent extends BaseAgent {
  constructor() {
    super('InterviewPrep', 'Generates technical, behavioral, and system design interview questions');
  }

  async generateQuestions(role, company = 'Tech Company', difficulty = 'Intermediate') {
    const systemInstruction = `
      You are a Principal Tech Interviewer at a FAANG company.
      Generate role-specific interview preparation questions for role: ${role}, company: ${company}.
      Return JSON:
      - questions: array of objects [
          {
            id: string,
            category: 'Technical' | 'Behavioral' | 'System Design' | 'Coding',
            question: string,
            idealAnswer: string,
            keyPoints: array of strings,
            difficulty: string
          }
        ]
    `;

    const prompt = `Generate 5 high-yield interview questions for a ${role} at ${company} (Difficulty: ${difficulty}).`;
    const result = await this._callGemini(prompt, systemInstruction);

    if (result) return result;

    return {
      questions: [
        {
          id: 'q1',
          category: 'Technical',
          question: `Explain how React's Virtual DOM reconciliation process works in modern applications.`,
          idealAnswer: `React creates an in-memory virtual DOM representation. During updates, it uses the Diffing algorithm to compare the new virtual DOM with the previous snapshot, updating only changed real DOM nodes.`,
          keyPoints: ['Virtual DOM trees comparison', 'O(n) Diffing algorithm heuristic', 'Batch DOM updates'],
          difficulty: 'Intermediate',
        },
        {
          id: 'q2',
          category: 'Behavioral',
          question: `Describe a time when you faced a difficult technical bug under a tight deadline. How did you resolve it?`,
          idealAnswer: `Use the STAR method (Situation, Task, Action, Result). Highlight systematic debugging, reading server logs, isolating components, and communicating status to stakeholders.`,
          keyPoints: ['STAR technique', 'Root cause isolation', 'Stakeholder communication'],
          difficulty: 'Behavioral',
        },
      ],
    };
  }
}

export default new InterviewPrepAgent();
