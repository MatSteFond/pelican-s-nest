// Protects staff-only pages with the ADMIN_PASSWORD secret.
// The browser shows a sign-in box; any username works, the password must match.
import { createHash, timingSafeEqual } from 'node:crypto';

const digest = (text) => createHash('sha256').update(String(text)).digest();

export function requireStaff(req, res, next) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return res
      .status(503)
      .type('text')
      .send('Staff pages are switched off. Add an ADMIN_PASSWORD secret to switch them on.');
  }
  const [scheme, encoded] = (req.get('authorization') || '').split(' ');
  if (scheme === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const given = decoded.slice(decoded.indexOf(':') + 1);
    if (timingSafeEqual(digest(given), digest(password))) return next();
  }
  res
    .set('WWW-Authenticate', 'Basic realm="Staff", charset="UTF-8"')
    .status(401)
    .type('text')
    .send('Staff password required.');
}
