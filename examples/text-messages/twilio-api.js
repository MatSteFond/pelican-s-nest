// Twilio helpers using Twilio's web API directly (no extra packages).
import { createHmac, timingSafeEqual } from 'node:crypto';

export const twilioConfigured = () =>
  Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER);

// Twilio signs each incoming request so we can check it really came from Twilio.
export function twilioSignature(authToken, url, params) {
  const data = Object.keys(params)
    .sort()
    .reduce((text, key) => text + key + params[key], url);
  return createHmac('sha1', authToken).update(Buffer.from(data, 'utf8')).digest('base64');
}

export function isValidTwilioRequest(authToken, url, params, signature) {
  if (!signature) return false;
  const expected = Buffer.from(twilioSignature(authToken, url, params));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function sendSms(to, body) {
  const { TWILIO_ACCOUNT_SID: sid, TWILIO_AUTH_TOKEN: token, TWILIO_FROM_NUMBER: from } = process.env;
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: { authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64') },
    body: new URLSearchParams({ To: to, From: from, Body: body }),
    signal: AbortSignal.timeout(10_000),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(`Twilio: ${result.message || response.status}`);
  return result.sid;
}

const xmlEscapes = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
export const twimlMessage = (text) =>
  `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${String(text).replace(/[&<>"']/g, (c) => xmlEscapes[c])}</Message></Response>`;
