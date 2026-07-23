import BaseAgent from './base.agent.js';

export class JobMatchingAgent extends BaseAgent {
  constructor() {
    super('JobMatching', 'Evaluates job-resume fit, match percentages, skill gaps, and opportunity scores');
  }

  async match(candidateProfile, jobDescription) {
    const systemInstruction = `
      You are an AI Tech Recruiter.
      Compare candidate profile and job description. Return JSON:
      - matchPercentage: integer (0-100)
      - matchingSkills: array of skills candidate has that match job
      - missingSkills: array of required skills candidate lacks
      - opportunityScore: integer (0-100)
      - aiSuggestion: string (actionable advice to land this role)
      - summaryReasoning: string (brief explanation of score)
    `;

    const prompt = `
      Candidate Profile: ${JSON.stringify(candidateProfile)}
      Job Description: ${jobDescription}
    `;

    const result = await this._callGemini(prompt, systemInstruction);
    if (result) return result;

    return this._getMockMatch(candidateProfile, jobDescription);
  }

  _getMockMatch(candidateProfile, jobDescription) {
    const profileSkills = (candidateProfile?.skills || []).map((s) => s.toLowerCase());
    const requiredSkills = ['react', 'node.js', 'typescript', 'postgresql', 'docker'];

    const matching = requiredSkills.filter((s) => profileSkills.some((ps) => ps.includes(s)));
    const missing = requiredSkills.filter((s) => !profileSkills.some((ps) => ps.includes(s)));

    const matchPercentage = Math.min(95, Math.max(50, Math.round((matching.length / requiredSkills.length) * 100)));

    return {
      matchPercentage,
      matchingSkills: matching.map((s) => s.toUpperCase()),
      missingSkills: missing.map((s) => s.toUpperCase()),
      opportunityScore: matchPercentage > 75 ? 90 : 70,
      aiSuggestion: missing.length > 0 ? `Learn ${missing[0].toUpperCase()} to increase match score above 85%.` : 'High match! Submit your tailored cover letter.',
      summaryReasoning: `Candidate aligns with ${matching.length} core technical requirements out of ${requiredSkills.length}.`,
    };
  }
}

export default new JobMatchingAgent();
