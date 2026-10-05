// Turns this repo's GitHub Actions secrets into a .env file for the server.
// Deployment secrets (DEPLOY_*) stay behind; everything else goes to the app.
const all = JSON.parse(process.env.ALL_SECRETS || '{}');
const keep = /^[A-Z][A-Z0-9_]*$/;
const skip = /^(DEPLOY_|GITHUB_TOKEN$|ACTIONS_|ANTHROPIC_API_KEY$)/i; // GitHub lists its own token in lowercase

const lines = [];
for (const [name, value] of Object.entries(all)) {
  if (skip.test(name)) continue;
  if (!keep.test(name)) {
    console.error(`::warning::Skipped secret ${name}: use capital letters, digits and underscores only.`);
    continue;
  }
  if (/[\r\n"\\]/.test(value)) {
    console.error(`::warning::Skipped secret ${name}: values can't contain line breaks, double quotes or backslashes.`);
    continue;
  }
  lines.push(`${name}="${value}"`);
}
process.stdout.write(lines.length ? lines.join('\n') + '\n' : '');
console.error(`Sending ${lines.length} secret(s) to the server.`);
