'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/movies.controller');

// NOTE: "/search" must be declared BEFORE "/:id",
// otherwise "search" would be treated as an id.
router.get('/search', controller.searchMovies);
router.get('/', controller.getMovies);
router.get('/:id', controller.getMovieById);

module.exports = router;
