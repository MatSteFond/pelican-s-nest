// Example: people leave a rating and comment; staff read them at /staff.
// Needs the database table in 001_feedback.sql and an ADMIN_PASSWORD secret.
// To switch it on, see examples/README.md.
import { Router } from 'express';
import { db } from '../../src/db.js';
import { requireStaff } from '../../src/lib/staff-auth.js';
import { escapeHtml } from '../../src/lib/html.js';
import { rateLimit } from '../../src/lib/rate-limit.js';

export const feedbackRouter = Router();

feedbackRouter.post('/', rateLimit({ max: 10, windowMinutes: 10 }), (req, res) => {
  const rating = Number(req.body?.rating);
  const comment = String(req.body?.comment ?? '').trim();
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Choose a rating from 1 to 5.' });
  }
  if (comment.length > 1000) {
    return res.status(400).json({ error: 'Keep your comment under 1,000 characters.' });
  }
  db.prepare('INSERT INTO feedback (rating, comment) VALUES (?, ?)').run(rating, comment);
  res.status(201).json({ ok: true });
});

export const staffRouter = Router();

staffRouter.get('/', requireStaff, (req, res) => {
  const rows = db
    .prepare('SELECT rating, comment, created_at FROM feedback ORDER BY id DESC LIMIT 20')
    .all();
  const summary = db.prepare('SELECT count(*) AS total, round(avg(rating), 1) AS average FROM feedback').get();
  const items = rows
    .map(
      (r) => `<li><strong>${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</strong>
        <time datetime="${escapeHtml(r.created_at)}Z">${escapeHtml(r.created_at)} UTC</time>
        <p>${escapeHtml(r.comment) || '<em>No comment</em>'}</p></li>`
    )
    .join('');
  res.type('html').send(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Feedback · Staff</title><link rel="stylesheet" href="/styles.css">
<style>
  .feedback-list { list-style: none; padding: 0; }
  .feedback-list li { padding: 1rem 0; border-bottom: 1px solid var(--line); }
  .feedback-list time { color: var(--muted); font-size: 0.9rem; margin-left: 0.5rem; }
  .feedback-list p { margin: 0.25rem 0 0; }
</style></head>
<body><main class="page">
<h1>Feedback</h1>
<p>There are ${summary.total} responses${summary.total ? `, averaging ${summary.average} out of 5` : ''}. Showing the latest 20.</p>
${rows.length ? `<ol class="feedback-list">${items}</ol>` : '<p>No feedback yet. Share the app link to start collecting it.</p>'}
<p><a href="/">Back to the app</a></p>
</main></body></html>`);
});
