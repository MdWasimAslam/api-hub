'use strict';

/**
 * -------------------------------------------------------------------
 * File: server.js
 *
 * Purpose:
 *   Starts the API on your own computer for local development.
 *   This is what runs when you type `npm run dev`.
 *
 * Note:
 *   On Vercel this file is NOT used — Vercel uses api/index.js instead.
 *   Both files share the SAME app from app.js, so behaviour is identical.
 * -------------------------------------------------------------------
 */

const app = require('./app');

// Use the port the environment gives us, or default to 3000 locally.
const PORT = process.env.PORT || 3000;

// Start listening for requests and print a friendly message when ready.
app.listen(PORT, () => {
  console.log(`API Hub running at http://localhost:${PORT}`);
});
