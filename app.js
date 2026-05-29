'use strict';

/**
 * -------------------------------------------------------------------
 * File: app.js
 *
 * Purpose:
 *   The heart of the project. It creates the Express application,
 *   turns on shared settings (called "middleware"), and connects every
 *   group of routes (movies, users, products, posts, dashboard, health).
 *
 * Think of this file as the "switchboard": a request comes in, and this
 * file decides which group of routes should handle it.
 *
 * Used By:
 *   - server.js     (to run the app locally)
 *   - api/index.js  (to run the app on Vercel)
 *
 * Request flow (big picture):
 *   Browser → app.js → routes/*.js → controllers/*.js → data/*.json → response
 * -------------------------------------------------------------------
 */

const express = require('express');
const cors = require('cors'); // lets browsers on other domains call this API

// The OpenAPI "spec" describes every endpoint; the Explorer is the web page
// that reads that spec and lets you try the endpoints in the browser.
const openApiSpec = require('./docs/openapi');
const explorerHtml = require('./docs/explorer');

// Each routes file knows the URLs for one topic and which controller runs them.
const moviesRoutes = require('./routes/movies.routes');
const usersRoutes = require('./routes/users.routes');
const productsRoutes = require('./routes/products.routes');
const postsRoutes = require('./routes/posts.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const healthRoutes = require('./routes/health.routes');

// Create the Express application.
const app = express();

// ─── Middleware: code that runs on EVERY request before the routes ──
app.disable('x-powered-by');  // hide the "Express" header (small security tidy-up)
app.use(cors());              // allow requests from any frontend (e.g. localhost:5173)
app.use(express.json());      // automatically parse JSON request bodies

// ─── The API Explorer (our lightweight, built-in "Swagger") ─────────
// 1) Serve the machine-readable spec at /openapi.json.
// 2) Serve the human-friendly test page at / (it fetches the spec above).
app.get('/openapi.json', (request, response) => response.json(openApiSpec));

app.get('/', (request, response) => {
  response.set('Content-Type', 'text/html').send(explorerHtml);
});

// ─── Connect each group of routes to a URL prefix ───────────────────
// e.g. everything inside moviesRoutes now lives under "/movies".
app.use('/movies', moviesRoutes);
app.use('/users', usersRoutes);
app.use('/products', productsRoutes);
app.use('/posts', postsRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/health', healthRoutes);

// ─── "Not Found" handler ────────────────────────────────────────────
// If no route above matched the request, we end up here (404 = Not Found).
app.use((request, response) => {
  response.status(404).json({
    error: `Route not found: ${request.method} ${request.originalUrl}`,
  });
});

// ─── Error handler ──────────────────────────────────────────────────
// If any route throws an unexpected error, Express sends it here.
// (Express knows this is the error handler because it has FOUR arguments.)
// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  console.error(error); // log it so the developer can see what went wrong
  response.status(500).json({ error: 'Internal server error' });
});

// Export the configured app so other files can start it.
module.exports = app;
