// A small in-memory limiter so one person can't flood a form.
export function rateLimit({ max, windowMinutes }) {
  const hits = new Map();
  const windowMs = windowMinutes * 60_000;
  return (req, res, next) => {
    const now = Date.now();
    if (hits.size > 10_000) hits.clear();
    const recent = (hits.get(req.ip) || []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
      return res.status(429).json({ error: 'Too many requests. Please wait a few minutes and try again.' });
    }
    recent.push(now);
    hits.set(req.ip, recent);
    next();
  };
}
