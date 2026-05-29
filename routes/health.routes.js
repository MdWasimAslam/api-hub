'use strict';

/**
 * -------------------------------------------------------------------
 * File: health.routes.js
 *
 * Purpose:
 *   The single health-check route.
 *
 * Connects To:
 *   controllers/health.controller.js
 *
 * Mounted In:
 *   app.js   →   app.use('/health', healthRoutes)
 *   So '/' here becomes '/health' in the browser.
 * -------------------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');

router.get('/', healthController.getHealth);

module.exports = router;
