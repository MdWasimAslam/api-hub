'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');

// NOTE: "/search" must be declared BEFORE "/:id".
router.get('/search', controller.searchUsers);
router.get('/', controller.getUsers);
router.get('/:id', controller.getUserById);

module.exports = router;
