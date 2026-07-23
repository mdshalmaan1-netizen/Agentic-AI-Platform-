import providerRegistry from '../providers/provider.registry.js';
import normalizeJob from './normalizer.js';
import deduplicateJobs from './deduplicator.js';

export class AggregatorService {
  static async searchAllJobs(query = 'Developer', location = '') {
    const providers = providerRegistry.getActiveProviders();

    const fetchPromises = providers.map((provider) =>
      provider.searchJobs(query, location).catch((err) => {
        console.warn(`Provider ${provider.name} failed:`, err.message);
        return [];
      })
    );

    const rawResultsArrays = await Promise.all(fetchPromises);
    const combinedJobs = rawResultsArrays.flat().map(normalizeJob);

    return deduplicateJobs(combinedJobs);
  }
}

export default AggregatorService;
