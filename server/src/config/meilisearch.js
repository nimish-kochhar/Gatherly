import { MeiliSearch } from 'meilisearch';
import config from './index.js';

let meili = null;

if (config.meilisearch.host) {
  meili = new MeiliSearch({
    host: config.meilisearch.host,
    apiKey: config.meilisearch.apiKey,
  });
} else {
  console.info('[Meilisearch] No MEILI_HOST set — using MySQL fulltext fallback.');
}

export default meili;
