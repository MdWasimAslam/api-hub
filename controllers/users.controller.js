'use strict';

// Load the dataset once at startup (cached in memory).
const users = require('../data/users.json');

// GET /users?page=1&limit=10
function getUsers(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

  const total = users.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const results = users.slice(start, start + limit);

  res.json({ page, limit, total, totalPages, results });
}

// GET /users/search?q=john
function searchUsers(req, res) {
  const q = (req.query.q || '').trim().toLowerCase();
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required.' });
  }

  const results = users.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q) ||
      u.company.toLowerCase().includes(q)
  );

  res.json({ query: q, total: results.length, results });
}

// GET /users/:id
function getUserById(req, res) {
  const id = parseInt(req.params.id, 10);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: `User with id ${req.params.id} not found.` });
  }

  res.json(user);
}

module.exports = { getUsers, searchUsers, getUserById };
