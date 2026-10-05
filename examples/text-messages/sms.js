// Example: Twilio text messages.
// POST /api/sms/incoming  Twilio calls this when someone texts your number.
//                         Point your Twilio number's "A message comes in" webhook at
//                         https://YOUR-APP-LINK/api/sms/incoming
// POST /api/sms/send      Staff-only: {"to": "+46701234567", "message": "Hello"}
// Needs TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER and ADMIN_PASSWORD secrets.
// To switch it on, see examples/README.md.
import { Router } from 'express';
import { config } from '../../src/config.js';
import { requireStaff } from '../../src/lib/staff-auth.js';
import { isValidTwilioRequest, sendSms, twilioConfigured, twimlMessage } from './twilio-api.js';

export const smsRouter = Router();

smsRouter.post('/incoming', (req, res) => {
  if (!twilioConfigured()) return res.sendStatus(404);
  if (!config.publicUrl) return res.status(403).send('Texts only work on the published app.');
  const url = config.publicUrl + req.originalUrl;
  if (!isValidTwilioRequest(process.env.TWILIO_AUTH_TOKEN, url, req.body || {}, req.get('x-twilio-signature'))) {
    return res.sendStatus(403);
  }
  const text = String(req.body.Body || '').trim().toUpperCase();
  const reply = text === 'HELP' ? 'Text us anything and the app will answer.' : 'Thanks for your message! Reply HELP for more.';
  res.type('text/xml').send(twimlMessage(reply));
});

smsRouter.post('/send', requireStaff, async (req, res) => {
  if (!twilioConfigured()) {
    return res.status(503).json({ error: 'Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_FROM_NUMBER secrets first.' });
  }
  const to = String(req.body?.to || '').replace(/\s+/g, '');
  const message = String(req.body?.message || '').trim();
  if (!/^\+[1-9]\d{6,14}$/.test(to)) return res.status(400).json({ error: 'Write the number in international format, like +46701234567.' });
  if (!message || message.length > 640) return res.status(400).json({ error: 'The message must be 1 to 640 characters.' });
  try {
    res.json({ ok: true, id: await sendSms(to, message) });
  } catch (err) {
    console.error('Sending a text failed:', err.message);
    res.status(502).json({ error: err.message });
  }
});
