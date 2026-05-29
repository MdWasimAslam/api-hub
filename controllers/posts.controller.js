'use strict';

/**
 * -------------------------------------------------------------------
 * File: posts.controller.js
 *
 * Purpose:
 *   Handles all blog-post-related requests.
 *
 * Responsibilities:
 *   - List posts (with pagination)
 *   - Search posts
 *   - Get a single post by id
 *
 * Data Source:
 *   data/posts.json
 *
 * Used By:
 *   routes/posts.routes.js
 *
 * NOTE: Same pagination/search pattern as movies.controller.js.
 * -------------------------------------------------------------------
 */

// Load the post data once when the server starts.
const postList = require('../data/posts.json');

// GET /posts?page=1&limit=10  → returns one page of posts.
function getPosts(request, response) {
  const currentPage = Math.max(parseInt(request.query.page, 10) || 1, 1);
  const pageSize = Math.max(parseInt(request.query.limit, 10) || 10, 1);

  const totalPosts = postList.length;
  const totalPages = Math.ceil(totalPosts / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const postsOnThisPage = postList.slice(startIndex, startIndex + pageSize);

  response.json({
    page: currentPage,
    limit: pageSize,
    total: totalPosts,
    totalPages: totalPages,
    results: postsOnThisPage,
  });
}

// GET /posts/search?q=react  → search by title or content text.
function searchPosts(request, response) {
  const searchKeyword = (request.query.q || '').trim().toLowerCase();

  if (!searchKeyword) {
    return response
      .status(400)
      .json({ error: 'Query parameter "q" is required.' });
  }

  const matchingPosts = postList.filter((post) => {
    return (
      post.title.toLowerCase().includes(searchKeyword) ||
      post.content.toLowerCase().includes(searchKeyword)
    );
  });

  response.json({
    query: searchKeyword,
    total: matchingPosts.length,
    results: matchingPosts,
  });
}

// GET /posts/:id  → find one post by id.
function getPostById(request, response) {
  const postId = parseInt(request.params.id, 10);
  const selectedPost = postList.find((post) => post.id === postId);

  if (!selectedPost) {
    return response
      .status(404)
      .json({ error: `Post with id ${request.params.id} not found.` });
  }

  response.json(selectedPost);
}

module.exports = { getPosts, searchPosts, getPostById };
