'use strict';

// Load the dataset once at startup (cached in memory).
const posts = require('../data/posts.json');

// GET /posts?page=1&limit=10
function getPosts(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

  const total = posts.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const results = posts.slice(start, start + limit);

  res.json({ page, limit, total, totalPages, results });
}

// GET /posts/search?q=react
function searchPosts(req, res) {
  const q = (req.query.q || '').trim().toLowerCase();
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required.' });
  }

  const results = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q)
  );

  res.json({ query: q, total: results.length, results });
}

// GET /posts/:id
function getPostById(req, res) {
  const id = parseInt(req.params.id, 10);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ error: `Post with id ${req.params.id} not found.` });
  }

  res.json(post);
}

module.exports = { getPosts, searchPosts, getPostById };
