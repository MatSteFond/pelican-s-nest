// Example: a live poll over WebSockets at /live.
// Everyone connected sees votes arrive instantly and how many people are online.
// Votes are kept in memory, so they reset when the app restarts or is published.
// To keep them, ask your AI helper to save votes in the database.
// Needs the "ws" package, which is already installed. To switch it on, see examples/README.md.
import { WebSocketServer } from 'ws';

const poll = {
  question: 'Which idea should we try first?',
  options: ['Idea A', 'Idea B', 'Idea C'],
  votes: [0, 0, 0],
};

export function attachLive(server) {
  const wss = new WebSocketServer({ noServer: true, maxPayload: 1024 });

  server.on('upgrade', (req, socket, head) => {
    if (new URL(req.url, 'http://localhost').pathname !== '/live') return socket.destroy();
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req));
  });

  const broadcast = () => {
    const message = JSON.stringify({ type: 'poll', ...poll, online: wss.clients.size });
    for (const client of wss.clients) if (client.readyState === 1) client.send(message);
  };

  wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.hasVoted = false;
    ws.on('pong', () => (ws.isAlive = true));
    ws.on('message', (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw);
      } catch {
        return;
      }
      const option = msg?.option;
      if (msg?.type === 'vote' && !ws.hasVoted && Number.isInteger(option) && option >= 0 && option < poll.votes.length) {
        ws.hasVoted = true;
        poll.votes[option] += 1;
        broadcast();
      }
    });
    ws.on('close', broadcast);
    broadcast();
  });

  // Drop connections from phones that went out of range without saying goodbye.
  const heartbeat = setInterval(() => {
    for (const ws of wss.clients) {
      if (!ws.isAlive) {
        ws.terminate();
        continue;
      }
      ws.isAlive = false;
      ws.ping();
    }
  }, 30_000);
  heartbeat.unref();

  return wss;
}
