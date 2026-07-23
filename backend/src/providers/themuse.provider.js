import axios from 'axios';
import BaseProvider from './base.provider.js';

export class TheMuseProvider extends BaseProvider {
  constructor() {
    super('themuse');
  }

  async searchJobs(query = 'developer', location = '') {
    try {
      const response = await axios.get('https://www.themuse.com/api/v1/jobs', {
        params: { page: 1, category: 'Software Engineering' },
        timeout: 5000,
      });

      const results = response.data?.results || [];
      return results.map((item) => ({
        externalId: String(item.id),
        provider: 'themuse',
        title: item.name,
        company: item.company?.name || 'Top Employer',
        location: item.locations?.[0]?.name || 'Remote / Various',
        description: item.contents || '',
        applyLink: item.refs?.landing_page || 'https://www.themuse.com',
        type: 'FULL_TIME',
        remote: item.locations?.some((loc) => /flexible|remote/i.test(loc.name)) || false,
        postedDate: item.publication_date ? new Date(item.publication_date) : new Date(),
        skills: ['Software Development'],
      }));
    } catch (error) {
      console.warn('TheMuse API request error:', error.message);
      return [];
    }
  }
}

export default new TheMuseProvider();
