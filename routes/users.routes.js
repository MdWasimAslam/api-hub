'use strict';

/**
 * -------------------------------------------------------------------
 * File: users.routes.js
 *
 * Purpose:
 *   Defines the user URLs and connects them to the user controller.
 *
 * Connects To:
 *   controllers/users.controller.js
 *
 * Mounted In:
 *   app.js   →   app.use('/users', usersRoutes)
 * -------------------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

// "/search" is declared BEFORE "/:id" so "search" isn't mistaken for an id.
router.get('/search', usersController.searchUsers);
router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUserById);

module.exports = router;
