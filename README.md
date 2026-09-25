# Homepage

Nathaniel Mann's personal site, live at [nathanielmann.ca](https://nathanielmann.ca). It is plain HTML, CSS and JavaScript with no dependencies and no build step.

The investment tool it links to, Lettuce, lives in its own repository, [nmann06/Investment-Tool](https://github.com/nmann06/Investment-Tool), and runs at [app.nathanielmann.ca](https://app.nathanielmann.ca/app).

## Layout

| Path | Purpose |
| --- | --- |
| `public/index.html` | Home, About and Projects views |
| `public/site.css` | Styles |
| `public/site.js` | Shows the home, `/about` or `/projects` view and sets the footer year |
| `render.yaml` | Render static-site configuration, redirects and rewrites |
| `serve.js` | Local preview server that mirrors the routes in `render.yaml` |

## Run locally

With Node.js 20 or newer:

```bash
npm start
```

Then open `http://127.0.0.1:8080`. You can also open `public/index.html` directly in a browser, though the `/about` and `/projects` paths only work through the server.

## Build

Render runs `build.js` to set the game API origin, then publishes the `public/` folder.

## Square Game

The game's browser files are copied into `public/square-game.html` and `public/square-game-assets/`, so the homepage stays a Render static site. Render rewrites `/square-game` and `/square-game/room/*` to the game page, and redirects common spellings to `/square-game`. The page calls the separate Square Game Render web service for its API.

`GAME_API_ORIGIN` is set in `render.yaml` to the Square Game web service's public origin. `build.js` writes this into `public/square-game-assets/config.js` during deployment. If the existing Render static site is configured manually rather than through its Blueprint, set the same variable in its dashboard Environment page before redeploying.

When changing the game UI, copy the updated `public/index.html`, `public/styles.css`, `public/app.js`, and `public/config.js` from the Square Game repo into the corresponding homepage page and asset files, updating the page's three asset URLs. The game server and this static page can then deploy separately. GoDaddy DNS and the homepage's Render static service do not need to change.

## Deploy

The site is a Render **static site** defined in `render.yaml`. Every push to `main` redeploys it. Pushes to the investment-tool repository do not affect it.

- `nathanielmann.ca` is the custom domain.
- `/app`, `/research.html` and `/login` redirect to `app.nathanielmann.ca`, so links from before the tool moved keep working.
- `/about` and `/projects` are rewritten to `index.html`; `/portfolio` redirects to `/projects`.

To set it up from scratch, create a new Blueprint in Render from this repository. No environment variables or secrets are needed. Render shows the DNS record to add for the custom domain.
