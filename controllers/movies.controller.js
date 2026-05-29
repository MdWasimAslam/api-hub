'use strict';

/**
 * -------------------------------------------------------------------
 * File: movies.controller.js
 *
 * Purpose:
 *   Handles all movie-related requests (the "logic" layer for movies).
 *
 * Responsibilities:
 *   - List movies (with pagination)
 *   - Search movies
 *   - Get a single movie by its id
 *
 * Data Source:
 *   data/movies.json
 *
 * Used By:
 *   routes/movies.routes.js
 *
 * How data flows:
 *   Browser → routes/movies.routes.js → THIS FILE → movies.json → response
 * -------------------------------------------------------------------
 */

// Load the movie data ONCE when the server starts.
// `require` on a .json file reads the file and parses it into a normal
// JavaScript array. Because it runs only once, every request reuses the
// same in-memory array instead of re-reading the file (this is fast).
const movieList = require('../data/movies.json');

/**
 * GET /movies?page=1&limit=10
 *
 * Returns one "page" of movies instead of all 100 at once.
 *
 * HOW PAGINATION WORKS (the same idea is reused everywhere in this project):
 *   - `page`  = which page the user wants (1, 2, 3, ...)
 *   - `limit` = how many items to show per page
 *   - We use array.slice(start, end) to cut out just that page.
 *
 * Example: page = 2, limit = 10
 *   start = (2 - 1) * 10 = 10
 *   end   = 10 + 10      = 20
 *   so we return movies at index 10..19 (the second group of 10).
 */
function getMovies(request, response) {
  // Read `page` and `limit` from the URL query string (e.g. ?page=2&limit=5).
  // Query values are always text ("2"), so we convert them to numbers.
  // If they are missing or invalid, we fall back to sensible defaults.
  const currentPage = Math.max(parseInt(request.query.page, 10) || 1, 1);
  const pageSize = Math.max(parseInt(request.query.limit, 10) || 10, 1);

  const totalMovies = movieList.length;
  // Total number of pages, rounded UP (e.g. 100 items / 10 per page = 10 pages).
  const totalPages = Math.ceil(totalMovies / pageSize);

  // Work out which slice of the array belongs to the requested page.
  const startIndex = (currentPage - 1) * pageSize;
  const moviesOnThisPage = movieList.slice(startIndex, startIndex + pageSize);

  // Always reply with the SAME shape so the frontend can rely on it.
  response.json({
    page: currentPage,
    limit: pageSize,
    total: totalMovies,
    totalPages: totalPages,
    results: moviesOnThisPage,
  });
}

/**
 * GET /movies/search?q=batman
 *
 * HOW SEARCH WORKS:
 *   - Read the keyword `q` from the query string.
 *   - Lowercase everything so the search is case-insensitive
 *     ("Batman" and "batman" both match).
 *   - Keep every movie whose title, genre, or language CONTAINS the keyword.
 */
function searchMovies(request, response) {
  const searchKeyword = (request.query.q || '').trim().toLowerCase();

  // The keyword is required — without it there is nothing to search for.
  if (!searchKeyword) {
    return response
      .status(400)
      .json({ error: 'Query parameter "q" is required.' });
  }

  const matchingMovies = movieList.filter((movie) => {
    return (
      movie.title.toLowerCase().includes(searchKeyword) ||
      movie.genre.toLowerCase().includes(searchKeyword) ||
      movie.language.toLowerCase().includes(searchKeyword)
    );
  });

  response.json({
    query: searchKeyword,
    total: matchingMovies.length,
    results: matchingMovies,
  });
}

/**
 * GET /movies/:id
 *
 * Finds ONE movie by its id. The ":id" part of the URL is available as
 * request.params.id (always text, so we convert it to a number first).
 */
function getMovieById(request, response) {
  const movieId = parseInt(request.params.id, 10);
  const selectedMovie = movieList.find((movie) => movie.id === movieId);

  // If no movie has that id, tell the client clearly (404 = "Not Found").
  if (!selectedMovie) {
    return response
      .status(404)
      .json({ error: `Movie with id ${request.params.id} not found.` });
  }

  response.json(selectedMovie);
}

// Export the functions so the routes file can connect URLs to them.
module.exports = { getMovies, searchMovies, getMovieById };
