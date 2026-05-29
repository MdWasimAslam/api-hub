'use strict';

/**
 * -------------------------------------------------------------------
 * File: health.controller.js
 *
 * Purpose:
 *   A tiny "is the server alive?" endpoint.
 *
 * Why this exists:
 *   Hosting platforms (and your own monitoring) often "ping" a health
 *   endpoint to check the API is running. It also gives beginners the
 *   simplest possible example of a controller.
 *
 * Used By:
 *   routes/health.routes.js
 * -------------------------------------------------------------------
 */

// GET /health  → returns basic status info about the running server.
function getHealth(request, response) {
  response.json({
    status: 'ok',
    service: 'API Hub',
    // process.uptime() = how many seconds the server has been running.
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}

module.exports = { getHealth };
