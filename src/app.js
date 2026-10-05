// Builds the web app: routes first, then the files in public/.
import express from 'express';
import path from 'node:path';
import { rootDir } from './config.js';
import { db } from './db.js';

const publicDir = path.join(rootDir, 'public');

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 'loopback'); // The server's web proxy sits in front of the app.

  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));

  // Used by the server to check a new version works before switching to it.
  app.get('/healthz', (req, res) => {
    db.prepare('SELECT 1').get();
    res.json({ ok: true });
  });

  // Your app's own routes go here, above the /api catch-all. For example:
  //   app.use('/api/things', thingsRouter);

  app.use('/api', (req, res) => res.status(404).json({ error: 'There is no API route at this address.' }));

  app.use(
    express.static(publicDir, {
      extensions: ['html'],
      setHeaders(res, file) {
        // Always check for the newest version of pages (and of the offline helper, if you add one).
        if (/(\.html|sw\.js|\.webmanifest)$/.test(file)) res.set('Cache-Control', 'no-cache');
      },
    })
  );

  app.use((req, res) => res.status(404).sendFile(path.join(publicDir, '404.html')));

  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    const status = err.status >= 400 && err.status < 500 ? err.status : 500;
    if (status === 500) console.error(err);
    res.status(status).json({ error: status === 500 ? 'Something went wrong on the server. Check the logs.' : err.message });
  });

  return app;
}
