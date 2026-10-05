# Instructions for the AI helper

## Who you're working with

The person you're helping is prototyping an idea at a workshop. Assume they
have never written code. They will judge your work by using the app, not by
reading the code.

- Explain what you changed in two or three plain sentences. No jargon; if you
  must use a technical word, explain it once.
- Make small changes, one feature at a time. After each change, tell them how
  to see it in the preview and what they should notice.
- Before a big or risky change, say what you plan to do and ask first.
- If you're unsure what they want, ask one short question.
- When something fails, explain it in everyday words and fix it.
- The person's step-by-step guide is at https://participants.jay.swissnexlab.com/
  and `README.md` says what they are asked to build. When they ask how to do
  something the guide covers, point them to it.

## How this app is built

The app starts blank on purpose: one page, no features. Build what the person
describes; don't add features they didn't ask for.

- Node.js with Express. Entry point `src/server.js`; routes are set up in
  `src/app.js`. Browser files live in `public/` (plain HTML, CSS and
  JavaScript; there is no build step, keep it that way).
- Put each new feature's server code in its own file in `src/features/`.
- Database: SQLite through Node's built-in `node:sqlite` module (`src/db.js`).
  The file is `data/app.sqlite`. There are no tables until you add one.
- Shared helpers in `src/lib/`: `escapeHtml`, `rateLimit` and `requireStaff`.
- Colours are set once in `public/styles.css`. Use `--edge` for the edge of
  a field or option; `--line` is for decoration only.
- Tests: `test/`, run with `npm test`. Add a simple test for each new API route.
  Publishing is blocked if tests fail.

## Accessibility: WCAG 2.1 level AA

Everything you build must meet WCAG 2.1 at level AA. Build it in with every
change. Don't wait to be asked and don't leave it for the end. The person
can overrule a point for their own app; see "When the person wants something
that breaks a rule" below.

Standard: https://www.w3.org/TR/WCAG21/
How to meet each point: https://www.w3.org/WAI/WCAG21/quickref/

### Every page

- Set the language on `<html lang="...">` to the language of the text, and
  mark a passage in another language with its own `lang`.
- Give each page its own `<title>`, one `<h1>`, headings in order, and the
  content inside `<main>`.
- Use the real element first: `<button>`, `<a>`, `<input>` with a `<label>`.
  Add ARIA only when no element does the job.
- Everything works by keyboard alone, in a sensible order, with no trap.
  Keep the `:focus-visible` rule in `styles.css`; never remove an outline.
- Contrast: 4.5 to 1 for text, 3 to 1 for large text (24px, or 19px bold),
  and 3 to 1 for the edges of fields and buttons, icons and the focus
  outline. The colours in `styles.css` pass in light and dark. When the
  person asks for new colours, work out the ratio for both, and if one fails
  offer the nearest colour that passes.
- Never show something by colour alone. Add words, a shape or an icon.
- The page works 320px wide with no sideways scrolling, and zoomed to 200%.
  Size text in `rem`. Never switch off zoom in the viewport tag.
- Don't lock the page to upright or sideways, in CSS or in the manifest.
- Aim for tap targets at least 44 by 44 pixels.
- Honour `prefers-reduced-motion`. Nothing flashes more than three times a
  second. Anything that moves or updates by itself for more than five
  seconds can be paused.
- No sound starts by itself.

### Words, pictures and media

- Every picture that carries meaning has `alt` text; decoration has
  `alt=""`. For an artwork from a museum source, use at least its title,
  artist and date, and ask the person to describe what the key pictures show.
- Video needs captions and audio needs a written version. Ask the person
  for them; don't publish media without.
- Link and button text says what happens, and makes sense out of context.

### Forms and messages

- Each field has a visible label tied to it. Put instructions before the
  field. Add `autocomplete` to fields for a name, email or phone number.
- An error says in words which field and how to fix it, next to the field.
- Put messages such as "Sent", "Reconnecting" or a new result in an element
  with `role="status"`, so a screen reader speaks them without moving the
  person. Don't announce every tick of something that changes fast.
- Don't rebuild part of the page under the person's focus. When you must,
  put the focus back, as `examples/live-poll/page-snippet.html` does.
- No time limits, unless the person can extend them.

### In the five parts

- Data source: show "loading" and "unavailable" as text.
- Interaction: a swipe, drag or gesture with two fingers also needs a
  button. Act when the finger or mouse is released, not when it goes down.
- Browser sensor: anything done by tilting, shaking or moving the device
  also works with a button, and the person can switch the movement off.
  Anything shown through the camera or AR is also described in text.
- Integration: next to a map, list the same places as text, and give each
  marker a name. Messages sent to a chat make sense as plain text.
- PWA: the offline page follows these rules too.

### Checking

- After each change, check your work against this section: read the HTML
  you wrote, and work out the contrast of any colour you added.
- Tell the person what only they can check: keyboard, zoom and a screen
  reader on their phone. `README.md` lists five checks for them.
- Never tell the person the app "meets WCAG" or "is accessible" because
  your own check passed. Say what you checked and what is still unchecked.

### When the person wants something that breaks a rule

The app is theirs. Call the problem out, then let them decide.

- Before you build it, say in one or two plain sentences what breaks and who
  it shuts out, for example "This grey is too pale to read for people with
  low vision." Offer the nearest version that passes, and ask which they
  want.
- If they choose their version, build it as asked. Don't refuse, don't
  quietly build the passing version instead, and don't argue the point
  again.
- Only what they said yes to is overruled. Keep every other rule in this
  section, and ask again when a new request breaks a rule.
- Leave a short comment in the code where the rule is broken, saying the
  person chose it, so a later change doesn't undo their choice.
- When they ask for an accessibility check, list the points they overruled
  as known gaps.
- They must have been told first. Never break a rule because it is quicker
  or because you guess they wouldn't mind.

## The workshop demo: five parts

The person is asked to build a demo with five parts: a data source, an
interaction, a browser sensor, an integration and a PWA (an installable app).
`README.md` describes them in their words.

- Build one part at a time, in the order they choose, and let them try each
  one before starting the next.
- If a part is missing from their idea, offer one or two options that fit it.
  Don't add a part they haven't agreed to.
- Keep each part small. A working demo of all five beats a polished one of
  two.

### 1. Data source

- Fetch from the server, in a file in `src/features/`, and give the browser
  this app's own `/api/...` route. Follow `examples/weather/weather.js`: a
  timeout, a short cache, and a plain-language error when the service is down.
- Free sources that need no key:
  - The Met: `https://collectionapi.metmuseum.org/public/collection/v1/`
    (`search?hasImages=true&q=...` gives ids, `objects/ID` gives one artwork;
    the picture is `primaryImageSmall`). Docs: https://metmuseum.github.io/
  - Cleveland Museum of Art:
    `https://openaccess-api.clevelandart.org/api/artworks/?q=...&has_image=1&limit=...`
    (the picture is `images.web.url`). Docs: https://openaccess-api.clevelandart.org/
  - Art Institute of Chicago: `https://api.artic.edu/api/v1/artworks/search?q=...`
    (build the picture address from `image_id`). Docs: https://api.artic.edu/docs/
  - Open-Meteo weather: see the example. Docs: https://open-meteo.com/en/docs
  - Swiss public transport: `https://transport.opendata.ch/v1/`.
    Docs: https://transport.opendata.ch/docs.html
  - Wikipedia summaries: `https://en.wikipedia.org/api/rest_v1/page/summary/TITLE`
  - USGS earthquakes:
    https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
  - iNaturalist, plants and animals seen near a place:
    `https://api.inaturalist.org/v1/observations?lat=...&lng=...&radius=KM&photos=true&quality_grade=research&order_by=observed_on&per_page=...`
    (the name is `taxon.preferred_common_name`, or `taxon.name` for the
    scientific one; add `locale=de` and so on for names in another
    language; the picture is `photos[0].url`, where `square` in the address
    can be changed to `medium`). Docs: https://api.inaturalist.org/v1/docs/
  - Swiss rivers and lakes:
    `https://api.existenz.ch/apiv1/hydro/latest?locations=ID&parameters=temperature,flow,height`
    (`/apiv1/hydro/locations` lists the stations with their positions; each
    reading is one item with `par` and `val`, and not every station measures
    everything). Docs: https://api.existenz.ch/
  - NOAA tides, United States only:
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=ID&product=predictions&interval=hilo&date=today&datum=MLLW&time_zone=lst_ldt&units=metric&format=json&application=NAME`
    (`product=water_level&date=latest` gives the level now; San Francisco is
    station `9414290`). Stations:
    `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions`.
    Docs: https://api.tidesandcurrents.noaa.gov/api/prod/
- iNaturalist pictures belong to the people who took them. Ask only for ones
  that may be reused by adding `photo_license=cc0,cc-by,cc-by-sa,cc-by-nc`,
  and show each picture's `attribution` text next to it. Keep to one request
  a second at most.
- The Swiss rivers and lakes service is run by a volunteer. Cache its
  answers for ten minutes, and name the source on the page: the Swiss
  Federal Office for the Environment (FOEN).
- Show only pictures the source marks as free to reuse (`isPublicDomain` at
  The Met, `is_public_domain` in Chicago, `share_license_status` of `CC0` in
  Cleveland), and name the museum on the page.
- Tests must not depend on the outside service. Test your own route's checks
  (for example a bad input gives 400), as the examples do.

### 2. Interaction

The README offers three building blocks: browser events, local storage and
WebSockets.

- Start from `examples/feedback/` (saved answers) or `examples/live-poll/`
  (shared, instant) when they fit.
- Browser events: use `click` for buttons and pointer events (`pointerdown`,
  `pointermove`, `pointerup`) for drags and swipes, so touch and mouse both
  work. Use real `<button>` and `<input>` elements so the keyboard works too.
- Local storage (`localStorage`) is for what one device should remember:
  favourites, progress, a chosen language. It holds text only, so save with
  `JSON.stringify` and read with `JSON.parse`. Wrap every read and write in
  `try`/`catch` and keep the page working when it is empty or blocked.
- Local storage stays on that device. Nobody else sees it and the app's
  server can't read it. Anything shared between people, or that staff need
  to read, goes in the database. Never keep secrets or personal details in
  it.
- WebSockets: see Specific patterns. Reconnect when the connection drops, as
  the live poll page does. What the server keeps in memory is lost on every
  publish; save to the database what must last.
- It must work by touch on a phone and by keyboard on a laptop.

### 3. Browser sensor

- Sensor code runs in the browser, in `public/`. It needs a secure address;
  the preview and the published app both have one.
- Prefer what works on both iPhone and Android: location
  (`navigator.geolocation`), tilt and movement (`deviceorientation` and
  `devicemotion` events), camera and microphone (`getUserMedia`).
- The classes on the MDN Sensor APIs page (`Accelerometer`, `Gyroscope`,
  `AmbientLightSensor` and so on) work in Chrome, Edge and Android browsers
  only, not on iPhones. Use them only behind a check that they exist, with
  one of the options above as the fallback.
  Reference: https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs
- On iPhone, tilt and movement need
  `DeviceOrientationEvent.requestPermission()`, called from a tap on a
  button. Ask for any permission only after a tap, and say in plain words why
  the app wants it.
- Always add a fallback (a slider, a drag, a text box) so the demo still
  works on a laptop or when permission is refused.
- Tell the person to try it on a real phone with the published link. The
  preview link only opens for them while signed in to GitHub.
- Use sensor readings in the browser. Don't save where someone is; that is a
  personal detail (see Database changes).
- `examples/ar/` uses the camera.

### 4. Integration

- Start from `examples/telegram/` or `examples/text-messages/` when they fit.
- Other simple options send one `fetch` from the server: ntfy
  (https://docs.ntfy.sh/), a Discord or Slack incoming webhook, or email
  through Resend.
- The server sends, never the browser. A webhook address counts as a secret,
  and so does an ntfy topic name: keep both in secrets, not in files.
- OpenStreetMap is the exception: the map is free, needs no key and loads in
  the browser.
  - Show the map with Leaflet, loaded from
    `https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/` (`leaflet.js` and
    `leaflet.css`), with the tiles from
    `https://tile.openstreetmap.org/{z}/{x}/{y}.png`. Give the map a height in
    CSS or it stays invisible. Guide: https://leafletjs.com/examples/quick-start/
  - Keep "© OpenStreetMap contributors" visible on the map, linked to
    https://www.openstreetmap.org/copyright. It is required.
  - To find a place by its name, use Nominatim
    (`https://nominatim.openstreetmap.org/search?q=...&format=jsonv2&limit=1`)
    from the server, through this app's own `/api/...` route. Its rules: a
    `User-Agent` header that names this app, one request a second at most,
    cache every answer, and no search-as-you-type.
    Rules: https://operations.osmfoundation.org/policies/nominatim/
  - When the places are known in advance, look up their positions once and
    write them in the code instead of searching on every visit.
  - A map pairs well with the sensor part: show where the person is with
    `navigator.geolocation`.
  - With the PWA part on, the map still needs a connection. Don't try to save
    map tiles for offline use; OpenStreetMap forbids downloading them in bulk.
- BirdNET (birdsong recognition from the Cornell Lab of Ornithology and
  Chemnitz University of Technology) has no service to send a recording to.
  There are two ways to use it:
  - Birds heard near a place: BirdWeather shares what its BirdNET listening
    stations hear. It is free and needs no key. Send a GraphQL `POST` to
    `https://app.birdweather.com/graphql` from the server, through this
    app's own `/api/...` route, and cache the answer for a few minutes.
    `topSpecies` gives the most heard birds in an area and `detections` the
    latest ones; both take the area as `ne: {lat, lon}` and
    `sw: {lat, lon}`. Docs: https://app.birdweather.com/api/index.html
  - Naming a bird from the phone's microphone: BirdNET runs inside the
    browser with TensorFlow.js, as in
    https://github.com/birdnet-team/real-time-pwa. It is a big job and the
    phone downloads about 65 MB the first time. Tell the person this and
    ask before starting. It also counts as the sensor part.
  - Name BirdNET and BirdWeather on the page. BirdNET's models are shared
    under CC BY-SA 4.0. Say that a result is a likely match, not a
    certainty.
- Limit how often a visitor can trigger a message with `rateLimit` from
  `src/lib/`, so nobody can flood the chat.
- Services that call the app back (Telegram, Twilio) only reach the published
  app, not the preview.

### 5. PWA

- Start from `examples/offline/`. It has the three things a PWA needs: a
  manifest (name, icon, colours), a service worker (`sw.js`, the saved copy
  for use without a connection) and icons.
- In `manifest.webmanifest`, set `name`, `short_name` and `description` to fit
  their idea. Replace the icons in `icons/` with theirs, keeping the file
  names and sizes.
- Add every page and file the app needs without a connection to
  `SAVE_FOR_OFFLINE` in `sw.js`. Data from `/api/...` is never saved, so show
  a plain message where live data is missing.
- Build this part last. Once it is on, follow the offline rule under Specific
  patterns on every change.
- It stays off in the preview. Tell the person to test with the published
  link, and how to install: Share then Add to Home Screen on iPhone, the
  browser menu then Install app on Android.

## Examples

`examples/` holds working, tested features that are switched off. By part:
weather (data source); a feedback form with a staff page and a live poll with
WebSockets (interaction); 3D and AR pages (sensor); a Telegram bot and Twilio
text messages (integration); offline support (PWA). Timed jobs fit any demo.
The app never loads that folder and the public can't see it.

- When the person asks for something an example covers, start from the
  example instead of writing it from nothing. `examples/README.md` has the
  steps for each one.
- Copy, don't move: leave `examples/` as it is.
- Change the wording, questions and settings in your copy to fit their idea.

## Previewing

`npm run dev` starts the preview on port 3000 and restarts on every change.
Tell the person to open the Ports tab and click the globe icon next to 3000.

## Publishing

"Publish" means: run `npm test`, then commit with a short clear message and push
to `main`. GitHub Actions then checks the app and sends it to the workshop
server; this takes one to three minutes. Their public link is
`https://REPO-NAME.WEB-NAME.swissnexlab.com` in lowercase, where the web name is
the short name they gave the organizer, not their GitHub username (the exact
link is printed at the end of the run in the Actions tab). If a first publish
says their account has no web name yet, only the organizer can fix that.
If a new version fails its health check, the server keeps the previous version
online and the error appears in the Actions log. Read it with
`gh run view --log-failed` (or ask the person to copy the red error text from
the Actions tab) and fix the cause.

Always commit `package-lock.json` when it changes.

## Secrets: follow these rules every time

- Never write an API key, token or password into any file, and never ask the
  person to paste one into the chat. Refer to secrets by name only.
- Code reads secrets from `process.env.NAME`.
- New secret? Add its name (no value) to `secrets.example.env`, then tell the
  person to add the value in GitHub: repo Settings > Secrets and variables, in
  BOTH the Actions tab (for the public app) and the Codespaces tab (for the
  preview), using the same name. After adding a Codespaces secret they must
  reload the Codespace (a prompt appears) before the preview can see it.
- Never read `.env` files and never print environment variables.
- Never put secrets or calls to paid APIs in `public/` files. Anything in
  `public/` is visible to everyone. Browser code calls this app's own
  `/api/...` routes, and the server calls the outside service.

## Database changes

- Change the database only by adding a new numbered file in `migrations/`
  (for example `001_create_notes.sql`). Never edit a file that has already run.
- Migrations run automatically when the app starts, in the preview and on the
  server. The preview and the public app have separate databases; that's
  intended.
- Don't store people's personal details (names, emails, phone numbers) unless
  the person confirms their organization has approved it.
- Keep photos, audio and video out of the database. Small files can go in
  `public/`; mention that large media should be kept under about 10 MB each.

## Specific patterns

- WebSockets: start from `examples/live-poll/live.js`. Keep the `/live` path
  pattern and the heartbeat.
- Timed jobs: use `every(minutes, name, task)` from
  `examples/timed-jobs/scheduled.js`.
- Staff-only pages or actions: use `requireStaff` from `src/lib/staff-auth.js`.
- Show text that people typed in with `escapeHtml` (server) or `textContent`
  (browser), never raw `innerHTML`.
- If offline support is switched on, bump the `CACHE` name in `public/sw.js`
  whenever you change a file it lists.
- Keep dependencies few. Prefer `fetch` to an SDK. Ask before adding a package.
- The app must keep answering `GET /healthz` with status 200.
