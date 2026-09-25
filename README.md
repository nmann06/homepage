# Homepage

Nathaniel Mann's personal site, live at [nathanielmann.ca](https://nathanielmann.ca). It is plain HTML, CSS and JavaScript with no dependencies and no build step.

The investment tool it links to, Lettuce, lives in its own repository, [nmann06/Investment-Tool](https://github.com/nmann06/Investment-Tool), and runs at [app.nathanielmann.ca](https://app.nathanielmann.ca/app).

## Layout

| Path | Purpose |
| --- | --- |
| `public/index.html` | The page: hero, about and projects |
| `public/site.css` | Styles |
| `public/site.js` | Shows the `/about` or `/portfolio` view and sets the footer year |
| `render.yaml` | Render static-site configuration, redirects and rewrites |
| `serve.js` | Local preview server that mirrors the routes in `render.yaml` |

## Run locally

With Node.js 20 or newer:

```bash
npm start
```

Then open `http://127.0.0.1:8080`. You can also open `public/index.html` directly in a browser, though the `/about` and `/portfolio` paths only work through the server.

## Build

There is no build step. Render publishes the `public/` folder as is.

## Deploy

The site is a Render **static site** defined in `render.yaml`. Every push to `main` redeploys it. Pushes to the investment-tool repository do not affect it.

- `nathanielmann.ca` is the custom domain.
- `/app`, `/research.html` and `/login` redirect to `app.nathanielmann.ca`, so links from before the tool moved keep working.
- `/about` and `/portfolio` are rewritten to `index.html`.

To set it up from scratch, create a new Blueprint in Render from this repository. No environment variables or secrets are needed. Render shows the DNS record to add for the custom domain.
