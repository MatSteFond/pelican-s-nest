# Your app

This is your project for the workshop. It starts as a blank page, ready for
your idea.

**New here? Follow the [participant guide](https://participants.jay.swissnexlab.com/).** It takes you from your
invitation to your first published change, one step at a time, and has help
for when something goes wrong.

This page covers what to build.

| To | Do this | In the guide |
| --- | --- | --- |
| Open your workspace | Click the green **Code** button above, then **Codespaces** | [Step 1](https://participants.jay.swissnexlab.com/#workspace) |
| Sign in to your AI helper | Open it from the side bar and click **Sign in** | [Step 2](https://participants.jay.swissnexlab.com/#sign-in) |
| See your app privately | Ask your AI helper to "start the preview" | [Step 3](https://participants.jay.swissnexlab.com/#step-3) |
| Put your changes online | Ask your AI helper to "publish my changes" | [Step 5](https://participants.jay.swissnexlab.com/#step-5) |
| Add a key or password | Never in a file or the chat | [Keys are secrets](https://participants.jay.swissnexlab.com/#secrets) |

Your app is live at `https://YOUR-REPO-NAME.YOUR-WEB-NAME.swissnexlab.com`.

## What to build: a demo in five parts

Your app has no features yet. For the workshop, build a small demo that
brings together the five parts below. Describe one part at a time to your AI
helper in plain English, and look at the preview after each step.

Anything marked **ready-made** is in the `examples/` folder, switched off
until you ask for it, for example "Add the weather example to my app."

Whatever you build has to work for everyone. See
[Accessibility](#accessibility-an-app-everyone-can-use) below.

### 1. A data source

Information your app collects from somewhere else. These are free and need no
key:

| Source | What you get |
| --- | --- |
| [The Met](https://metmuseum.github.io/) | Artworks, pictures and details from The Metropolitan Museum of Art |
| [Cleveland Museum of Art](https://openaccess-api.clevelandart.org/) | Artworks, pictures and details, free to reuse |
| [Art Institute of Chicago](https://api.artic.edu/docs/) | Artworks, pictures and details |
| [Open-Meteo](https://open-meteo.com/en/docs) | Weather now and the forecast, anywhere in the world |
| [Swiss public transport](https://transport.opendata.ch/docs.html) | Live departures and connections in Switzerland |
| [Wikipedia](https://www.mediawiki.org/wiki/Wikimedia_REST_API) | A short summary and picture for almost any subject |
| [USGS earthquakes](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) | Earthquakes around the world, updated every few minutes |
| [iNaturalist](https://api.inaturalist.org/v1/docs/) | Plants and animals that people have photographed near a place |
| [Swiss rivers and lakes](https://api.existenz.ch/) | Water temperature, level and flow at about 250 measuring stations in Switzerland |
| [NOAA tides](https://api.tidesandcurrents.noaa.gov/api/prod/) | High and low tide times, and the water level now, along the coast of the United States |

**Ready-made:** Weather (shows the current weather at a place).

Try: "Show a different painting from the Cleveland Museum of Art each time
the page opens", or "Show what animals and plants people have seen near us
this week."

### 2. An interaction

Something a person does, and the app answers: a vote, a quiz, a search, a
swipe through pictures, a drawing, a choice that changes the story.

Three building blocks to choose from. You can combine them:

| Building block | What it does | Read more |
| --- | --- | --- |
| Browser events | The app notices what a person does: a tap, a key press, a swipe, a scroll | [Easy](https://javascript.info/introduction-browser-events), [MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events) |
| Local storage | The browser remembers things on that one device, such as favourites or where you stopped. No account needed | [Easy](https://javascript.info/localstorage), [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) |
| WebSockets | A live connection, so everyone sees a change the moment it happens | [Easy](https://javascript.info/websocket), [MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) |

**Ready-made:** Feedback (a rating and comment form, with a staff-only page
to read the answers) and Live poll (everyone sees votes arrive instantly,
using WebSockets).

Try: "Let people vote for their favourite of three paintings and show
everyone the result straight away", or "Remember my favourite paintings on
this phone."

### 3. A browser sensor

Something the phone or laptop can sense: where it is, how it is tilted or
moved, what the camera sees, what the microphone hears.

- [What Web Can Do Today](https://progressier.com/what-web-can-do-today) is
  the easy one to read. Open it on your phone and it shows what that phone
  can do.
- [Sensor APIs on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs)
  is the technical reference. Your AI helper can read it for you.

**Ready-made:** 3D and AR (shows a 3D object in the room, or brings a picture
to life through the camera).

Try: "Tilt the phone to move around the painting." The browser asks for
permission first, so test on a real phone with your published link.

### 4. An integration

A connection to a service people already use, so your app reaches them
outside the web page.

**Ready-made:** Telegram bot (a chat bot that answers messages) and Text
messages (receives and sends SMS through Twilio, a paid service).

Other ideas:

| Service | What it does |
| --- | --- |
| [OpenStreetMap](https://www.openstreetmap.org/) | Shows a map in your app, with pins for your places, and finds a place by its name. Free, no key |
| [BirdNET](https://birdnet.cornell.edu/) | Names the birds singing near a place, recognised from their song. BirdNET comes from the Cornell Lab of Ornithology; the results come through [BirdWeather](https://app.birdweather.com/api/index.html). Free, no key |
| [ntfy](https://docs.ntfy.sh/) | Sends a notification to a phone. Free, no account |
| [Discord](https://docs.discord.com/developers/resources/webhook) or [Slack](https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks/) | Posts a message into a channel |
| [Resend](https://resend.com/docs/api-reference/emails/send-email) | Sends an email |

Most of these need a key or a private link. Add it as a secret, never in a
file or the chat. The guide shows how:
[Adding a key](https://participants.jay.swissnexlab.com/#add-key).

Try: "Send the winning painting to our Telegram chat every evening", "Show
a map with a pin for each museum the paintings come from", or "Show which
birds are singing near us today."

### 5. A PWA (an app people can install)

PWA stands for progressive web app: a website that behaves like an app.
People add it to their phone's home screen, it opens full screen with its own
name and icon, and it still opens without a connection.

- [What PWA Can Do Today](https://whatpwacando.today/) is the easy one. Open
  it on your phone, install it, and try what an installed app can do.
- [Learn PWA](https://web.dev/learn/pwa) is a step-by-step course.
- [Progressive web apps on MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
  is the technical reference.

**Ready-made:** Offline and installable.

Try: "Make my app installable, with its own name and icon." Test it with
your published link; it stays off in the preview. To install, use **Share**
then **Add to Home Screen** on an iPhone, or the browser menu then **Install
app** on Android.

### Extras

One more ready-made example that fits any demo:

| Example | What it does |
| --- | --- |
| Timed jobs | Runs a task every so many minutes |

The five parts are a starting point. If your idea needs something else,
describe it and your AI helper will build it.

## Accessibility: an app everyone can use

Your demo has to work for people who can't see the screen, can't hear, can't
use a mouse or a touch screen, or can't tilt a phone. The standard for this
is WCAG 2.1, level AA (the Web Content Accessibility Guidelines). Follow it
in everything you build.

- [WCAG at a glance](https://www.w3.org/WAI/standards-guidelines/wcag/glance/)
  is the easy one to read.
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/) is the full standard.

Your AI helper is told to follow WCAG 2.1 in every change. If you ask for
something that breaks the standard, it tells you what the problem is and
offers a version that passes. The decision is yours: say so if you want your
version anyway, and it will build it.

Some things only you can do:

| Your job | How |
| --- | --- |
| Describe every picture in words | Say what the picture shows, not only its title. Your AI helper can write a first version for you to correct |
| Give video captions, and audio a written version | Write them, or ask your AI helper to help you make them |
| Say what each link and button does | "Read about this painting", not "Click here" |
| Pick colours people can read | Test them with the [contrast checker](https://webaim.org/resources/contrastchecker/) |
| Give every movement another way | Anything done by tilting, shaking, swiping or the camera also needs a button |

### Five checks before you publish

1. **Keyboard:** put the mouse away and press **Tab** to move through the
   page. You can reach and use everything, and always see where you are.
2. **Zoom:** zoom the browser to 200%. Nothing is cut off or overlapping.
3. **Screen reader:** switch on VoiceOver (iPhone) or TalkBack (Android)
   and listen to your app. It makes sense without looking.
4. **Colour:** nothing is shown by colour alone, such as red for "wrong".
5. **Movement:** the app works with the phone flat on a table.

[Easy Checks](https://www.w3.org/WAI/test-evaluate/easy-checks/) explains
more of these. [WAVE](https://wave.webaim.org/) tests a published page for
you.

Ask your AI helper: "Check my app against WCAG 2.1 level AA and tell me what
you found." A check by an AI helper or a tool finds many problems but not
all of them, so do the five checks yourself too.
