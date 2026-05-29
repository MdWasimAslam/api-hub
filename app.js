'use strict';

const express = require('express');
const cors = require('cors');

const openapi = require('./docs/openapi');
const explorerHtml = require('./docs/explorer');
const moviesRoutes = require('./routes/movies.routes');
const usersRoutes = require('./routes/users.routes');
const productsRoutes = require('./routes/products.routes');
const postsRoutes = require('./routes/posts.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const healthRoutes = require('./routes/health.routes');

const app = express();

// ─── Core middleware ──────────────────────────────────────────────
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

// ─── API Explorer (lightweight, dependency-free "Swagger-lite") ───
// The spec is exposed as JSON and rendered by our own tiny UI at "/".
app.get('/openapi.json', (req, res) => res.json(openapi));

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html').send(explorerHtml);
});

// ─── API routes ───────────────────────────────────────────────────
app.use('/movies', moviesRoutes);
app.use('/users', usersRoutes);
app.use('/products', productsRoutes);
app.use('/posts', postsRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/health', healthRoutes);

// ─── 404 handler ──────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ─── Centralized error handler ────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
