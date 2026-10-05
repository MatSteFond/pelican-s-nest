// Telegram bot helpers using Telegram's web API directly (no extra packages).
import { createHmac, timingSafeEqual } from 'node:crypto';

// A secret derived from the bot token. Telegram sends it back with every
// webhook call so the app can tell real messages from fake ones.
export const webhookSecret = (botToken) => createHmac('sha256', botToken).update('telegram-webhook').digest('hex');

export function isValidTelegramRequest(botToken, headerValue) {
  const expected = Buffer.from(webhookSecret(botToken));
  const given = Buffer.from(headerValue || '');
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function callTelegram(botToken, method, payload) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
  });
  const result = await response.json();
  if (!result.ok) throw new Error(`Telegram ${method}: ${result.description}`);
  return result.result;
}
