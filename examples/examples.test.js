// Tests that keep the switched-off examples working. Run with: npm test
// If you delete the examples folder, these tests go with it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import express from 'express';

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = mkdtempSync(path.join(tmpdir(), 'app-examples-'));
process.env.DATA_DIR = dir;
process.env.ADMIN_PASSWORD = 'test-password';

const { db, migrate } = await import('../src/db.js');
migrate(path.join(here, 'feedback'));
const { feedbackRouter, staffRouter } = await import('./feedback/feedback.js');
const { twilioSignature, isValidTwilioRequest, twimlMessage } = await import('./text-messages/twilio-api.js');
const { webhookSecret, isValidTelegramRequest } = await import('./telegram/telegram-api.js');

const app = express();
app.use(express.json());
app.use('/api/feedback', feedbackRouter);
app.use('/staff', staffRouter);
const server = app.listen(0, '127.0.0.1');
await once(server, 'listening');
const base = `http://127.0.0.1:${server.address().port}`;
const staff = { authorization: 'Basic ' + Buffer.from('staff:test-password').toString('base64') };

test.after(() => {
  server.close();
  db.close();
  rmSync(dir, { recursive: true, force: true });
});

test('every example loads without errors', async () => {
  for (const folder of readdirSync(here, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    for (const file of readdirSync(path.join(here, folder.name))) {
      // sw.js and offline.js run in the browser, not in the app.
      if (!file.endsWith('.js') || folder.name === 'offline') continue;
      await import(pathToFileURL(path.join(here, folder.name, file)));
    }
  }
});

test('feedback is saved and appears on the staff page', async () => {
  const saved = await fetch(`${base}/api/feedback`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ rating: 4, comment: 'Great <b>audio</b> guide' }),
  });
  assert.equal(saved.status, 201);
  const page = await (await fetch(`${base}/staff`, { headers: staff })).text();
  assert.match(page, /Great &lt;b&gt;audio&lt;\/b&gt; guide/);
});

test('invalid feedback is rejected', async () => {
  const res = await fetch(`${base}/api/feedback`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ rating: 7 }),
  });
  assert.equal(res.status, 400);
  assert.throws(() => db.prepare('INSERT INTO feedback (rating) VALUES (?)').run(9));
});

test('staff page needs the password', async () => {
  assert.equal((await fetch(`${base}/staff`)).status, 401);
  const wrong = { authorization: 'Basic ' + Buffer.from('staff:nope').toString('base64') };
  assert.equal((await fetch(`${base}/staff`, { headers: wrong })).status, 401);
});

test('twilio signatures verify and reject tampering', () => {
  const url = 'https://my-app.example.org/api/sms/incoming';
  const params = { Body: 'HELP', From: '+46700000000', To: '+46700000001' };
  const signature = twilioSignature('secret-token', url, params);
  assert.ok(isValidTwilioRequest('secret-token', url, params, signature));
  assert.ok(!isValidTwilioRequest('secret-token', url, { ...params, Body: 'X' }, signature));
  assert.ok(!isValidTwilioRequest('secret-token', url, params, undefined));
  assert.match(twimlMessage('<b>&'), /<Message>&lt;b&gt;&amp;<\/Message>/);
});

test('twilio signature matches the worked example in Twilio\'s docs', () => {
  const params = { CallSid: 'CA1234567890ABCDE', Caller: '+14158675310', Digits: '1234', From: '+14158675310', To: '+18005551212' };
  assert.equal(twilioSignature('12345', 'https://mycompany.com/myapp.php?foo=1&bar=2', params), 'GvWf1cFY/Q7PnoempGyD5oXAezc=');
});

test('telegram webhook secret is stable and checked', () => {
  const secret = webhookSecret('123:abc');
  assert.equal(secret, webhookSecret('123:abc'));
  assert.ok(/^[A-Za-z0-9_-]{1,256}$/.test(secret));
  assert.ok(isValidTelegramRequest('123:abc', secret));
  assert.ok(!isValidTelegramRequest('123:abc', 'wrong'));
  assert.ok(!isValidTelegramRequest('123:abc', undefined));
});
