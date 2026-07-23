import resumeAnalyzerAgent from './resume-analyzer.agent.js';
import jobMatchingAgent from './job-matching.agent.js';
import roadmapAgent from './roadmap.agent.js';
import certificationAgent from './certification.agent.js';

export class AgentOrchestrator {
  static async processResumeUpload(rawText, userId) {
    console.log(`🤖 Orchestrator: Processing resume upload for user ${userId}`);

    // Step 1: Run Resume Analysis
    const analysis = await resumeAnalyzerAgent.analyze(rawText);

    // Step 2: Extract missing skills & generate learning roadmap
    const roadmap = await roadmapAgent.generateRoadmap(
      analysis.summary || 'Software Developer',
      analysis.skills || []
    );

    // Step 3: Recommend certifications for skill gaps
    const certifications = await certificationAgent.recommend(
      analysis.missingSkills || [],
      analysis.summary || 'Software Engineer'
    );

    return {
      analysis,
      roadmap,
      certifications,
    };
  }

  static async processJobMatchPipeline(userProfile, jobDetails) {
    console.log(`🤖 Orchestrator: Running Job Match Pipeline`);
    return jobMatchingAgent.match(userProfile, jobDetails);
  }
}

export default AgentOrchestrator;
