import prisma from '../../config/database.js';

export class ResumeRepository {
  static async createResume({ userId, fileName, fileUrl, rawText }) {
    return prisma.resume.create({
      data: {
        userId,
        fileName,
        fileUrl,
        rawText,
      },
    });
  }

  static async createAnalysis(resumeId, analysisData) {
    return prisma.resumeAnalysis.create({
      data: {
        resumeId,
        skills: analysisData.skills || [],
        languages: analysisData.languages || [],
        frameworks: analysisData.frameworks || [],
        projects: analysisData.projects || [],
        experience: analysisData.experience || [],
        education: analysisData.education || [],
        certifications: analysisData.certifications || [],
        softSkills: analysisData.softSkills || [],
        resumeScore: analysisData.resumeScore || 75,
        atsScore: analysisData.atsScore || 70,
        scoreBreakdown: analysisData.scoreBreakdown || {},
        missingSkills: analysisData.missingSkills || [],
        suggestions: analysisData.suggestions || [],
        summary: analysisData.summary || '',
      },
    });
  }

  static async findLatestByUserId(userId) {
    return prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { analysis: true },
    });
  }
}

export default ResumeRepository;
