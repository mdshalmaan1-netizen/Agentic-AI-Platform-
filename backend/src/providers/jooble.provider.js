import axios from 'axios';
import BaseProvider from './base.provider.js';
import config from '../config/index.js';

export class JoobleProvider extends BaseProvider {
  constructor() {
    super('jooble');
  }

  isConfigured() {
    return !!config.providers.jooble.apiKey;
  }

  async searchJobs(query = 'developer', location = '') {
    if (!this.isConfigured()) return [];

    try {
      const apiKey = config.providers.jooble.apiKey;
      const response = await axios.post(
        `https://jooble.org/api/${apiKey}`,
        { keywords: query, location },
        { timeout: 5000 }
      );

      const jobs = response.data?.jobs || [];
      return jobs.map((item) => ({
        externalId: String(item.id),
        provider: 'jooble',
        title: item.title,
        company: item.company || 'Tech Employer',
        location: item.location || 'Remote',
        description: item.snippet || '',
        applyLink: item.link || 'https://jooble.org',
        type: 'FULL_TIME',
        remote: /remote/i.test(item.location) || /remote/i.test(item.snippet),
        postedDate: item.updated ? new Date(item.updated) : new Date(),
        skills: ['Web Development'],
      }));
    } catch (error) {
      console.warn('Jooble API request error:', error.message);
      return [];
    }
  }
}

export default new JoobleProvider();
