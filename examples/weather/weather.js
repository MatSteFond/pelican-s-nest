// Example: current weather from Open-Meteo (free, no key needed).
// GET /api/weather            -> weather at your place
// GET /api/weather?lat=..&lon=.. -> weather somewhere else
// To switch it on, see examples/README.md.
import { Router } from 'express';

// Your place. Change these numbers, or set LATITUDE and LONGITUDE in GitHub.
const here = {
  latitude: Number(process.env.LATITUDE || 59.3293),
  longitude: Number(process.env.LONGITUDE || 18.0686),
};

const cache = new Map();
const TEN_MINUTES = 10 * 60_000;

const descriptions = [
  [[0], 'Clear sky'],
  [[1], 'Mainly clear'],
  [[2], 'Partly cloudy'],
  [[3], 'Overcast'],
  [[45, 48], 'Fog'],
  [[51, 53, 55, 56, 57], 'Drizzle'],
  [[61, 63, 65, 66, 67], 'Rain'],
  [[71, 73, 75, 77], 'Snow'],
  [[80, 81, 82], 'Rain showers'],
  [[85, 86], 'Snow showers'],
  [[95, 96, 99], 'Thunderstorm'],
];
const describe = (code) => descriptions.find(([codes]) => codes.includes(code))?.[1] ?? 'Unknown';

export async function getWeather(latitude = here.latitude, longitude = here.longitude) {
  const key = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TEN_MINUTES) return hit.data;

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.search = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,weather_code,wind_speed_10m',
    timezone: 'auto',
  });
  const response = await fetch(url, { signal: AbortSignal.timeout(8_000) });
  if (!response.ok) throw new Error(`Open-Meteo responded ${response.status}`);
  const body = await response.json();

  const data = {
    description: describe(body.current.weather_code),
    temperature: body.current.temperature_2m,
    temperatureUnit: body.current_units.temperature_2m,
    windSpeed: body.current.wind_speed_10m,
    windUnit: body.current_units.wind_speed_10m,
    observedAt: body.current.time,
  };
  if (cache.size > 100) cache.clear();
  cache.set(key, { at: Date.now(), data });
  return data;
}

export const weatherRouter = Router();

weatherRouter.get('/', async (req, res) => {
  const lat = req.query.lat === undefined ? here.latitude : Number(req.query.lat);
  const lon = req.query.lon === undefined ? here.longitude : Number(req.query.lon);
  if (!(Math.abs(lat) <= 90 && Math.abs(lon) <= 180)) {
    return res.status(400).json({ error: 'lat must be between -90 and 90, lon between -180 and 180.' });
  }
  try {
    res.json(await getWeather(lat, lon));
  } catch (err) {
    console.error('Weather lookup failed:', err.message);
    res.status(502).json({ error: 'The weather service did not respond. Try again in a minute.' });
  }
});
