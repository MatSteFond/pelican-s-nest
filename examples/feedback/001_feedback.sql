-- Feedback: a rating from 1 to 5 and an optional comment.
-- Copy this file into migrations/ (keep the number in order with any files already there).
CREATE TABLE feedback (
  id         INTEGER PRIMARY KEY,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT    NOT NULL DEFAULT '' CHECK (length(comment) <= 1000),
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX feedback_created_at ON feedback (created_at);
