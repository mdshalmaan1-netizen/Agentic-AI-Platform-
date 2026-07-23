export class BaseProvider {
  constructor(name) {
    this.name = name;
  }

  isConfigured() {
    return true;
  }

  async searchJobs(query, location) {
    throw new Error('searchJobs must be implemented by subclass');
  }
}

export default BaseProvider;
