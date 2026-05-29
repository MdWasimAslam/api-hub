'use strict';

// Load the dataset once at startup (cached in memory).
const movies = require('../data/movies.json');

// GET /movies?page=1&limit=10
function getMovies(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

  const total = movies.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const results = movies.slice(start, start + limit);

  res.json({ page, limit, total, totalPages, results });
}

// GET /movies/search?q=batman
function searchMovies(req, res) {
  const q = (req.query.q || '').trim().toLowerCase();
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required.' });
  }

  const results = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.genre.toLowerCase().includes(q) ||
      m.language.toLowerCase().includes(q)
  );

  res.json({ query: q, total: results.length, results });
}

// GET /movies/:id
function getMovieById(req, res) {
  const id = parseInt(req.params.id, 10);
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return res.status(404).json({ error: `Movie with id ${req.params.id} not found.` });
  }

  res.json(movie);
}

module.exports = { getMovies, searchMovies, getMovieById };
