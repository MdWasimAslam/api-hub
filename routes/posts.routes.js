'use strict';

/**
 * -------------------------------------------------------------------
 * File: posts.routes.js
 *
 * Purpose:
 *   Defines the post URLs and connects them to the post controller.
 *
 * Connects To:
 *   controllers/posts.controller.js
 *
 * Mounted In:
 *   app.js   →   app.use('/posts', postsRoutes)
 * -------------------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');

// "/search" is declared BEFORE "/:id" so "search" isn't mistaken for an id.
router.get('/search', postsController.searchPosts);
router.get('/', postsController.getPosts);
router.get('/:id', postsController.getPostById);

module.exports = router;
