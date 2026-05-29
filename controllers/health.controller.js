'use strict';

// GET /health
function getHealth(req, res) {
  res.json({
    status: 'ok',
    service: 'API Hub',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}

module.exports = { getHealth };
