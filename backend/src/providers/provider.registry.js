import themuseProvider from './themuse.provider.js';
import remoteokProvider from './remoteok.provider.js';
import adzunaProvider from './adzuna.provider.js';
import joobleProvider from './jooble.provider.js';
import mockProvider from './mock.provider.js';
import internshalaProvider from './internshala.provider.js';
import naukriProvider from './naukri.provider.js';
import founditProvider from './foundit.provider.js';

export class ProviderRegistry {
  constructor() {
    this.providers = [
      internshalaProvider,
      naukriProvider,
      founditProvider,
      themuseProvider,
      remoteokProvider,
      adzunaProvider,
      joobleProvider,
      mockProvider,
    ];
  }

  getActiveProviders() {
    return this.providers.filter((p) => p.isConfigured());
  }
}

export default new ProviderRegistry();
