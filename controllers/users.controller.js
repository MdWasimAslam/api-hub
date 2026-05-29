'use strict';

/**
 * -------------------------------------------------------------------
 * File: users.controller.js
 *
 * Purpose:
 *   Handles all user-related requests.
 *
 * Responsibilities:
 *   - List users (with pagination)
 *   - Search users
 *   - Get a single user by id
 *
 * Data Source:
 *   data/users.json
 *
 * Used By:
 *   routes/users.routes.js
 *
 * NOTE: This file follows the EXACT same pattern as movies.controller.js.
 *       If the pagination/search comments here feel short, read that file
 *       first — it explains the ideas in full detail.
 * -------------------------------------------------------------------
 */

// Load the user data once when the server starts (same idea as movies).
const userList = require('../data/users.json');

// GET /users?page=1&limit=10  → returns one page of users.
function getUsers(request, response) {
  const currentPage = Math.max(parseInt(request.query.page, 10) || 1, 1);
  const pageSize = Math.max(parseInt(request.query.limit, 10) || 10, 1);

  const totalUsers = userList.length;
  const totalPages = Math.ceil(totalUsers / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const usersOnThisPage = userList.slice(startIndex, startIndex + pageSize);

  response.json({
    page: currentPage,
    limit: pageSize,
    total: totalUsers,
    totalPages: totalPages,
    results: usersOnThisPage,
  });
}

// GET /users/search?q=john  → case-insensitive search across several fields.
function searchUsers(request, response) {
  const searchKeyword = (request.query.q || '').trim().toLowerCase();

  if (!searchKeyword) {
    return response
      .status(400)
      .json({ error: 'Query parameter "q" is required.' });
  }

  const matchingUsers = userList.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchKeyword) ||
      user.username.toLowerCase().includes(searchKeyword) ||
      user.email.toLowerCase().includes(searchKeyword) ||
      user.city.toLowerCase().includes(searchKeyword) ||
      user.company.toLowerCase().includes(searchKeyword)
    );
  });

  response.json({
    query: searchKeyword,
    total: matchingUsers.length,
    results: matchingUsers,
  });
}

// GET /users/:id  → find one user by id.
function getUserById(request, response) {
  const userId = parseInt(request.params.id, 10);
  const selectedUser = userList.find((user) => user.id === userId);

  if (!selectedUser) {
    return response
      .status(404)
      .json({ error: `User with id ${request.params.id} not found.` });
  }

  response.json(selectedUser);
}

module.exports = { getUsers, searchUsers, getUserById };
