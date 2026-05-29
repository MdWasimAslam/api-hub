'use strict';

/**
 * -------------------------------------------------------------------
 * File: movies.routes.js
 *
 * Purpose:
 *   Defines the movie URLs and connects each one to a controller function.
 *   A "route" is just a rule: "when this URL is requested, run that function".
 *
 * Connects To:
 *   controllers/movies.controller.js
 *
 * Mounted In:
 *   app.js   →   app.use('/movies', moviesRoutes)
 *   So a path like '/' here actually becomes '/movies' in the browser,
 *   and '/:id' becomes '/movies/123'.
 * -------------------------------------------------------------------
 */

const express = require('express');

// A Router is a mini collection of routes that we plug into the main app.
const router = express.Router();

const moviesController = require('../controllers/movies.controller');

// IMPORTANT ORDERING RULE:
// "/search" must be listed BEFORE "/:id". Express checks routes top to
// bottom, and "/:id" matches ANY value — so it would treat the word
// "search" as an id and run the wrong function if it came first.
router.get('/search', moviesController.searchMovies);
router.get('/', moviesController.getMovies);
router.get('/:id', moviesController.getMovieById);

module.exports = router;
