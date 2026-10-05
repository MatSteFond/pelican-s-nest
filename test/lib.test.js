// Tests for the building blocks. Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const dir = mkdtempSync(path.join(tmpdir(), 'app-lib-'));
process.env.DATA_DIR = path.join(dir, 'data');

const { db, migrate } = await import('../src/db.js');
const { escapeHtml } = await import('../src/lib/html.js');

test.after(() => {
  db.close();
  rmSync(dir, { recursive: true, force: true });
});

test('migrations run once each, in order', () => {
  const migrations = path.join(dir, 'migrations');
  mkdirSync(migrations);
  writeFileSync(path.join(migrations, '001_a.sql'), 'CREATE TABLE a (id INTEGER PRIMARY KEY);');
  writeFileSync(path.join(migrations, '002_b.sql'), 'ALTER TABLE a ADD COLUMN name TEXT;');
  migrate(migrations);
  migrate(migrations); // second run must not re-apply
  const names = db.prepare('SELECT name FROM _migrations ORDER BY name').all().map((r) => r.name);
  assert.deepEqual(names, ['001_a.sql', '002_b.sql']);
  db.prepare('INSERT INTO a (name) VALUES (?)').run('ok');
});

test('a failing migration is rolled back and reported', () => {
  const migrations = path.join(dir, 'bad');
  mkdirSync(migrations);
  writeFileSync(path.join(migrations, '001_bad.sql'), 'CREATE TABLE c (id INTEGER); THIS IS NOT SQL;');
  assert.throws(() => migrate(migrations), /001_bad\.sql failed/);
  assert.equal(db.prepare(`SELECT count(*) AS n FROM sqlite_master WHERE name = 'c'`).get().n, 0);
});

test('an app with no database changes yet starts fine', () => {
  migrate(); // the real migrations/ folder holds no .sql files
  migrate(path.join(dir, 'does-not-exist'));
});

test('html escaping', () => {
  assert.equal(escapeHtml(`<img src=x onerror="alert('1')">`), '&lt;img src=x onerror=&quot;alert(&#39;1&#39;)&quot;&gt;');
});
