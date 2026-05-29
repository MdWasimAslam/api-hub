'use strict';

/**
 * -------------------------------------------------------------------
 * File: dashboard.routes.js
 *
 * Purpose:
 *   Defines the dashboard URLs and connects them to the dashboard
 *   controller. These power summary screens and charts on the frontend.
 *
 * Connects To:
 *   controllers/dashboard.controller.js
 *
 * Mounted In:
 *   app.js   →   app.use('/dashboard', dashboardRoutes)
 * -------------------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

router.get('/stats', dashboardController.getStats);
router.get('/charts', dashboardController.getCharts);

module.exports = router;
