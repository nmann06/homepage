// Local preview only. Production is a Render static site configured in render.yaml.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, 'public');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
// Mirrors the routes in render.yaml.
const rewrites = { '/': '/index.html', '/about': '/index.html', '/portfolio': '/index.html' };
const redirects = { '/app': 'https://app.nathanielmann.ca/app', '/research.html': 'https://app.nathanielmann.ca/app', '/login': 'https://app.nathanielmann.ca/login' };

http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  if (redirects[url.pathname]) return response.writeHead(301, { Location: redirects[url.pathname] + url.search }).end();
  const file = path.join(root, path.normalize(rewrites[url.pathname] || url.pathname));
  if (!file.startsWith(root) || !types[path.extname(file)] || !fs.existsSync(file)) return response.writeHead(404).end('Not found');
  response.writeHead(200, { 'Content-Type': types[path.extname(file)] });
  fs.createReadStream(file).pipe(response);
}).listen(Number(process.env.PORT) || 8080, '127.0.0.1', () => console.log(`Homepage at http://127.0.0.1:${Number(process.env.PORT) || 8080}`));
