import ApplicationsRepository from './applications.repository.js';

export class ApplicationsService {
  static async getUserApplications(userId) {
    return ApplicationsRepository.findByUserId(userId);
  }

  static async createApplication(payload) {
    return ApplicationsRepository.createApplication(payload);
  }

  static async updateApplicationStatus(id, status) {
    return ApplicationsRepository.updateStatus(id, status);
  }
}

export default ApplicationsService;
