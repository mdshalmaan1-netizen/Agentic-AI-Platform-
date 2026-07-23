import axios from 'axios';
import BaseProvider from './base.provider.js';
import config from '../config/index.js';

export class AdzunaProvider extends BaseProvider {
  constructor() {
    super('adzuna');
  }

  isConfigured() {
    return !!(config.providers.adzuna.appId && config.providers.adzuna.appKey);
  }

  async searchJobs(query = 'developer', location = 'us') {
    if (!this.isConfigured()) return [];

    try {
      const { appId, appKey } = config.providers.adzuna;
      const response = await axios.get(`https://api.adzuna.com/v1/api/jobs/us/search/1`, {
        params: {
          app_id: appId,
          app_key: appKey,
          what: query,
          where: location,
          results_per_page: 15,
        },
        timeout: 5000,
      });

      const results = response.data?.results || [];
      return results.map((item) => ({
        externalId: String(item.id),
        provider: 'adzuna',
        title: item.title,
        company: item.company?.display_name || 'Employer',
        salaryMin: item.salary_min || null,
        salaryMax: item.salary_max || null,
        currency: 'USD',
        location: item.location?.display_name || 'USA',
        description: item.description || '',
        applyLink: item.redirect_url || 'https://www.adzuna.com',
        type: 'FULL_TIME',
        remote: /remote/i.test(item.title) || /remote/i.test(item.description),
        postedDate: item.created ? new Date(item.created) : new Date(),
        skills: ['Software Engineering'],
      }));
    } catch (error) {
      console.warn('Adzuna API request error:', error.message);
      return [];
    }
  }
}

export default new AdzunaProvider();
