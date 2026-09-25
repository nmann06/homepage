const fs = require('node:fs');
const path = require('node:path');

const origin = process.env.GAME_API_ORIGIN || '';
if (!origin) throw new Error('Set GAME_API_ORIGIN to the game service onrender.com origin before deploying the homepage.');
const url = new URL(origin);
const local = url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname);
if ((!local && url.protocol !== 'https:') || url.pathname !== '/' || url.search || url.hash || url.hostname === 'nathanielmann.ca') {
  throw new Error('GAME_API_ORIGIN must be the HTTPS origin of the game Render service.');
}
fs.writeFileSync(path.join(__dirname, 'public', 'square-game-assets', 'config.js'),
  `window.SQUARE_GAME_API_ORIGIN = ${JSON.stringify(origin)};\n`);
console.log(`Square Game API configured: ${origin}`);
