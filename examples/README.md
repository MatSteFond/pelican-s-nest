# Examples

Your app starts blank. This folder holds working features that are switched
off: the app never loads anything in here, and nothing in here is visible to
the public. Each one is tested code you can copy instead of starting from
nothing.

The workshop demo has five parts: a data source, an interaction, a browser
sensor, an integration and a PWA (see the main `README.md`). The examples
are grouped the same way. To use one, ask your AI helper, for example: "Add the
feedback example to my app." It will follow the steps below.

| Part | Example | Folder | What it does | Secrets it needs |
| --- | --- | --- | --- | --- |
| 1. Data source | Weather | `weather/` | Shows the current weather at a place | None |
| 2. Interaction | Feedback | `feedback/` | A rating and comment form, with a staff-only page to read the answers | `ADMIN_PASSWORD` |
| 2. Interaction | Live poll | `live-poll/` | A poll where everyone sees votes arrive instantly | None |
| 3. Browser sensor | 3D and AR | `ar/` | Shows a 3D object in the room, or brings a picture to life through the camera | None |
| 4. Integration | Telegram bot | `telegram/` | A chat bot that answers messages | `TELEGRAM_BOT_TOKEN` |
| 4. Integration | Text messages | `text-messages/` | Receives and sends SMS through Twilio | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `ADMIN_PASSWORD` |
| 5. PWA | Offline and installable | `offline/` | Lets the app open without a connection and be added to a phone's home screen | None |
| Extra | Timed jobs | `timed-jobs/` | Runs a task every so many minutes | None |

There is no example yet for museum collections, for local storage, for maps,
or for location, tilt and movement. Your AI helper builds those from the notes in `AGENTS.md`, using
the weather example as the pattern for a data source.

## Switching an example on

These steps are the same for every example. The sections below list what is
particular to each one.

1. Copy the example's `.js` files into `src/features/` (create the folder if
   it isn't there). In each copied file, change imports that start with
   `../../src/` to `../`, because the file now lives inside `src/`.
2. Copy browser files (`.html`, and anything listed under "Browser files")
   into `public/`. Paste `page-snippet.html` into the page where the feature
   should appear; each snippet says which part goes where.
3. Copy any `.sql` file into `migrations/`, numbered after the files already
   there.
4. Connect it in `src/app.js` or `src/server.js` as described below.
5. Add the names of any secrets to `secrets.example.env`, and tell the person
   to add the values in GitHub.
6. Add a test in `test/` for each new route, then run `npm test`.

Leave this folder as it is, so the other examples stay available.

## Weather

- Connect in `src/app.js`: `app.use('/api/weather', weatherRouter);`
- The place is set at the top of `weather.js`.

## Feedback

- Database: `001_feedback.sql`.
- Connect in `src/app.js`: `app.use('/api/feedback', feedbackRouter);` and
  `app.use('/staff', staffRouter);`
- Staff pages stay switched off until an `ADMIN_PASSWORD` secret exists. Any
  username works; the password must match.

## Live poll

- Connect in `src/server.js`, after the server is created:
  `attachLive(server);`
- The question and options are at the top of `live.js`. Votes reset when the
  app restarts.

## Telegram bot

- Copy both `telegram.js` and `telegram-api.js`.
- Connect in `src/app.js`: `app.use('/api/telegram', telegramRouter);`
- Connect in `src/server.js`, after the server starts listening:
  `registerTelegramWebhook().catch((err) => console.error('Telegram setup failed:', err.message));`
- The bot only receives messages on the published app, not in the preview.

## Text messages

- Copy both `sms.js` and `twilio-api.js`.
- Connect in `src/app.js`: `app.use('/api/sms', smsRouter);`
- In Twilio, point the number's "A message comes in" webhook at
  `https://YOUR-APP-LINK/api/sms/incoming`.

## Timed jobs

- Connect in `src/server.js`, after the server starts listening:
  `startScheduledJobs();`
- Jobs only run while the app is running.

## 3D and AR

- Browser files: `ar-model.html` and `ar-image.html`. Copy them into
  `public/` and link to `/ar-model` or `/ar-image` from a page.
- Try them on a phone. Keep 3D model files under about 10 MB.

## Offline and installable

- Browser files: `sw.js`, `offline.js`, `offline.html`,
  `manifest.webmanifest` and the `icons/` folder. Copy them into `public/`.
- Add to the `<head>` of every page:

  ```html
  <meta name="theme-color" content="#2f5d8a">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
  <script src="/offline.js" defer></script>
  ```
- Once this is on, browsers keep a saved copy of the app. Every time you
  change a file listed in `sw.js`, change the `CACHE` name in `sw.js` too
  (`app-v1` to `app-v2`), or people will keep seeing the old version.
- It stays off in the preview on purpose.
