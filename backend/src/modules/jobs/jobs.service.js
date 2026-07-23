import AggregatorService from '../../aggregator/aggregator.service.js';
import jobMatchingAgent from '../../agents/job-matching.agent.js';
import ResumeRepository from '../resume/resume.repository.js';
import ProfileRepository from '../profile/profile.repository.js';

export class JobsService {
  static async searchJobs({ query = 'Software Engineer', location = '', userId = null }) {
    const jobs = await AggregatorService.searchAllJobs(query, location);

    if (!userId) return jobs;

    // Attach AI Opportunity Score if user resume or profile exists
    let candidateProfile = null;
    const resume = await ResumeRepository.findLatestByUserId(userId);
    if (resume?.analysis) {
      candidateProfile = { skills: resume.analysis.skills || [] };
    } else {
      const profile = await ProfileRepository.findByUserId(userId);
      if (profile) candidateProfile = { skills: profile.skills || [] };
    }

    if (!candidateProfile) return jobs;

    // Enrich top 3 jobs with Gemini fit match
    const enrichedJobs = await Promise.all(
      jobs.map(async (job, index) => {
        if (index < 5) {
          const matchResult = await jobMatchingAgent.match(candidateProfile, `${job.title} - ${job.description}`);
          return {
            ...job,
            matchPercentage: matchResult.matchPercentage,
            matchingSkills: matchResult.matchingSkills,
            missingSkills: matchResult.missingSkills,
            aiSuggestion: matchResult.aiSuggestion,
            opportunityScore: matchResult.opportunityScore,
          };
        }
        return job;
      })
    );

    return enrichedJobs;
  }
}

export default JobsService;
