// Tests that start the app and make real requests. Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const dir = mkdtempSync(path.join(tmpdir(), 'app-'));
process.env.DATA_DIR = dir;

const { db, migrate } = await import('../src/db.js');
migrate();
const { createApp } = await import('../src/app.js');

const server = createApp().listen(0, '127.0.0.1');
await once(server, 'listening');
const base = `http://127.0.0.1:${server.address().port}`;

test.after(() => {
  server.close();
  db.close();
  rmSync(dir, { recursive: true, force: true });
});

test('health check responds', async () => {
  const res = await fetch(`${base}/healthz`);
  assert.equal(res.status, 200);
});

test('home page and its files are served', async () => {
  for (const file of ['/', '/styles.css', '/favicon.png']) {
    assert.equal((await fetch(base + file)).status, 200, file);
  }
});

test('unknown pages and API routes return 404', async () => {
  assert.equal((await fetch(`${base}/nope`)).status, 404);
  assert.equal((await fetch(`${base}/api/nope`)).status, 404);
});

test('the examples folder is not visible to the public', async () => {
  assert.equal((await fetch(`${base}/examples/README.md`)).status, 404);
  assert.equal((await fetch(`${base}/examples/feedback/feedback.js`)).status, 404);
});
