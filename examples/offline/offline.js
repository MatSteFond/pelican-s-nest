// Switches on offline support. Load it from every page with:
//   <script src="/offline.js" defer></script>
// It stays off in the Codespaces preview so you always see your latest changes there.
const isPreview = location.hostname.endsWith('.app.github.dev') || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
if ('serviceWorker' in navigator && !isPreview) {
  navigator.serviceWorker.register('/sw.js').catch((err) => console.warn('Offline support unavailable:', err));
}
