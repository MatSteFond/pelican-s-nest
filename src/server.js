// Starts the app. Run "npm run dev" for the preview.
import { createServer } from 'node:http';
import { config } from './config.js';
import { db, migrate } from './db.js';
import { createApp } from './app.js';

migrate();

const server = createServer(createApp());

server.listen(config.port, config.host, () => {
  console.log(`The app is running on port ${config.port}.`);
  if (process.env.CODESPACES) console.log('Open the Ports tab and click the globe icon next to port 3000 to see it.');
});

const shutdown = () => {
  server.close(() => {
    db.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 5_000).unref();
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
