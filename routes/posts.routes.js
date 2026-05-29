'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/posts.controller');

// NOTE: "/search" must be declared BEFORE "/:id".
router.get('/search', controller.searchPosts);
router.get('/', controller.getPosts);
router.get('/:id', controller.getPostById);

module.exports = router;
