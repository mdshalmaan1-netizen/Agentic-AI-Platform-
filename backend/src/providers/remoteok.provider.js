import axios from 'axios';
import BaseProvider from './base.provider.js';

export class RemoteOKProvider extends BaseProvider {
  constructor() {
    super('remoteok');
  }

  async searchJobs(query = '', location = '') {
    try {
      const response = await axios.get('https://remoteok.com/api', {
        headers: { 'User-Agent': 'AgenticCareerPlatform/1.0' },
        timeout: 5000,
      });

      const items = Array.isArray(response.data) ? response.data.slice(1, 20) : [];

      return items.map((item) => ({
        externalId: String(item.id || item.epoch),
        provider: 'remoteok',
        title: item.position || 'Remote Developer',
        company: item.company || 'Tech Startup',
        companyLogo: item.company_logo || null,
        location: 'Remote',
        description: item.description || '',
        applyLink: item.url || 'https://remoteok.com',
        type: 'FULL_TIME',
        remote: true,
        postedDate: item.date ? new Date(item.date) : new Date(),
        skills: item.tags || ['Remote', 'Software'],
      }));
    } catch (error) {
      console.warn('RemoteOK API request error:', error.message);
      return [];
    }
  }
}

export default new RemoteOKProvider();
