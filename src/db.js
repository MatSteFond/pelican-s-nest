// The app's SQLite database: one file, data/app.sqlite (on the server it lives
// in a folder that survives every publish). Uses Node's built-in SQLite module.
import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { config, rootDir } from './config.js';

mkdirSync(config.dataDir, { recursive: true });

export const db = new DatabaseSync(path.join(config.dataDir, 'app.sqlite'));
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  PRAGMA busy_timeout = 5000;
`);

// Runs every .sql file in migrations/ that hasn't run yet, in name order.
export function migrate(dir = path.join(rootDir, 'migrations')) {
  db.exec(`CREATE TABLE IF NOT EXISTS _migrations (
    name       TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  const applied = new Set(db.prepare('SELECT name FROM _migrations').all().map((r) => r.name));
  // A new app has no database changes yet, so the folder may be empty or missing.
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.sql')).sort() : [];
  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = readFileSync(path.join(dir, file), 'utf8');
    db.exec('BEGIN');
    try {
      db.exec(sql);
      db.prepare('INSERT INTO _migrations (name) VALUES (?)').run(file);
      db.exec('COMMIT');
      console.log(`Database: applied ${file}`);
    } catch (err) {
      db.exec('ROLLBACK');
      throw new Error(`Database change ${file} failed: ${err.message}`);
    }
  }
}
