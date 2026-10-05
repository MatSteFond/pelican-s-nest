// Settings come from environment variables so the same code runs in your
// preview (Codespaces) and on the server. Secrets are added in GitHub, never here.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const env = process.env;

export const config = {
  port: Number(env.PORT || 3000),
  host: env.HOST || '127.0.0.1',
  isProduction: env.NODE_ENV === 'production',
  // Set by the server to this app's https link. Empty in your preview.
  publicUrl: (env.PUBLIC_URL || '').replace(/\/+$/, ''),
  dataDir: env.DATA_DIR || path.join(rootDir, 'data'),
};
