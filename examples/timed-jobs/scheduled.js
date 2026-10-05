// Example: jobs that run on a timer while the app is running.
// Use every(minutes, name, task) for things like "check for new items hourly"
// or "send a daily summary". To switch it on, see examples/README.md.

export function every(minutes, name, task) {
  const run = async () => {
    try {
      await task();
    } catch (err) {
      console.error(`Scheduled job "${name}" failed:`, err.message);
    }
  };
  const timer = setInterval(run, minutes * 60_000);
  timer.unref();
  return timer;
}

export function startScheduledJobs() {
  every(60, 'hourly check-in', () => {
    console.log(`Still running at ${new Date().toISOString()}.`);
  });
}
