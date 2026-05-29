# API Hub

A simple Vercel Node.js project.

## Structure

- `api/hello.js` — a serverless function available at `/api/hello`
- `public/index.html` — a static landing page

## Develop locally

```bash
npm install -g vercel   # if you don't have the CLI
npm run dev             # runs `vercel dev` at http://localhost:3000
```

Then open:

- http://localhost:3000 — landing page
- http://localhost:3000/api/hello?name=Wasim — API endpoint

## Deploy

```bash
npm run deploy
```
