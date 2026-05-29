'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller');

router.get('/stats', controller.getStats);
router.get('/charts', controller.getCharts);

module.exports = router;
