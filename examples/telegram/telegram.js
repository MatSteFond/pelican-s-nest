// Example: a Telegram bot. Add a TELEGRAM_BOT_TOKEN secret and publish;
// the app registers its webhook with Telegram automatically on the server.
// Try /start or /help in a chat with your bot. To switch it on, see examples/README.md.
import { Router } from 'express';
import { config } from '../../src/config.js';
import { callTelegram, isValidTelegramRequest, webhookSecret } from './telegram-api.js';

const botToken = () => process.env.TELEGRAM_BOT_TOKEN;

// What the bot says back. Change this to suit your idea.
async function replyTo(text) {
  if (text.startsWith('/start')) return "Hello! I'm this app's bot. Try /help.";
  if (text.startsWith('/help')) return 'Send me any message and I will repeat it back to you.';
  return `You said: ${text}`;
}

export const telegramRouter = Router();

telegramRouter.post('/webhook', async (req, res) => {
  const token = botToken();
  if (!token) return res.sendStatus(404);
  if (!isValidTelegramRequest(token, req.get('x-telegram-bot-api-secret-token'))) return res.sendStatus(401);
  res.sendStatus(200); // Answer Telegram straight away, then reply to the chat.

  const message = req.body?.message;
  if (!message?.text) return;
  try {
    await callTelegram(token, 'sendMessage', { chat_id: message.chat.id, text: await replyTo(message.text.trim()) });
  } catch (err) {
    console.error('Telegram reply failed:', err.message);
  }
});

export async function registerTelegramWebhook() {
  const token = botToken();
  if (!token) return;
  if (!config.publicUrl.startsWith('https://')) {
    console.log('Telegram: the bot only receives messages on your published app, not in the preview.');
    return;
  }
  await callTelegram(token, 'setWebhook', {
    url: `${config.publicUrl}/api/telegram/webhook`,
    secret_token: webhookSecret(token),
    allowed_updates: ['message'],
  });
  console.log('Telegram: webhook registered.');
}
