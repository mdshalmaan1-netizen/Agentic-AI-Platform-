import ResumeRepository from './resume.repository.js';
import extractTextFromPDF from '../../shared/utils/pdfParser.js';
import AgentOrchestrator from '../../agents/agent.orchestrator.js';
import { BadRequestError } from '../../shared/utils/AppError.js';

export class ResumeService {
  static async uploadAndAnalyze(userId, file) {
    if (!file || !file.buffer) {
      throw new BadRequestError('Resume file (PDF or DOCX) is required');
    }

    const rawText = await extractTextFromPDF(file.buffer);
    if (!rawText || rawText.trim().length < 20) {
      throw new BadRequestError('Could not extract sufficient text content from PDF');
    }

    const resume = await ResumeRepository.createResume({
      userId,
      fileName: file.originalname || 'resume.pdf',
      fileUrl: `/uploads/${file.originalname}`,
      rawText,
    });

    const pipelineResult = await AgentOrchestrator.processResumeUpload(rawText, userId);
    const analysis = await ResumeRepository.createAnalysis(resume.id, pipelineResult.analysis);

    return {
      resume,
      analysis,
      roadmap: pipelineResult.roadmap,
      certifications: pipelineResult.certifications,
    };
  }

  static async getLatestResume(userId) {
    return ResumeRepository.findLatestByUserId(userId);
  }
}

export default ResumeService;
