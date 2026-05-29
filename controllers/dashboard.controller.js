'use strict';

/**
 * -------------------------------------------------------------------
 * File: dashboard.controller.js
 *
 * Purpose:
 *   Provides summary numbers and chart-ready data for building an
 *   admin dashboard on the frontend.
 *
 * Responsibilities:
 *   - /dashboard/stats   → simple counts (how many of each thing)
 *   - /dashboard/charts  → data shaped for charts/graphs
 *
 * Data Source:
 *   data/users.json, movies.json, products.json, posts.json
 *   (this controller READS from all of them to build totals)
 *
 * Used By:
 *   routes/dashboard.routes.js
 * -------------------------------------------------------------------
 */

// Load every dataset so we can count and group them.
const userList = require('../data/users.json');
const movieList = require('../data/movies.json');
const productList = require('../data/products.json');
const postList = require('../data/posts.json');

/**
 * Small helper: count how many items fall into each group.
 *
 * Example — counting movies by genre:
 *   input : [{genre:'Action'}, {genre:'Action'}, {genre:'Drama'}]
 *   output: [{label:'Action', value:2}, {label:'Drama', value:1}]
 *
 * This is exactly the shape most chart libraries expect, so the frontend
 * can feed it straight into a bar/pie chart.
 */
function countByGroup(itemList, getGroupName) {
  const countsByName = {};

  // Walk through every item and add 1 to its group's running total.
  for (const item of itemList) {
    const groupName = getGroupName(item);
    countsByName[groupName] = (countsByName[groupName] || 0) + 1;
  }

  // Turn the { Action: 2, Drama: 1 } object into a sorted array of
  // { label, value } objects (biggest group first).
  return Object.keys(countsByName)
    .map((groupName) => ({ label: groupName, value: countsByName[groupName] }))
    .sort((a, b) => b.value - a.value);
}

// GET /dashboard/stats  → a quick count of every collection.
function getStats(request, response) {
  response.json({
    users: userList.length,
    movies: movieList.length,
    products: productList.length,
    posts: postList.length,
  });
}

/**
 * GET /dashboard/charts
 *
 * Returns four datasets ready to drop into charts:
 *   - monthlyUsers      → made-up monthly sign-up numbers
 *   - monthlySales      → made-up monthly sales numbers
 *   - movieGenres       → real counts grouped from movies.json
 *   - productCategories → real counts grouped from products.json
 *
 * The monthly numbers are calculated with a simple formula (not random)
 * so the response is the SAME every time — predictable for learning.
 */
function getCharts(request, response) {
  const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const monthlyUsers = monthLabels.map((monthName, monthIndex) => ({
    month: monthName,
    value: 120 + monthIndex * 18 + (monthIndex % 3) * 25,
  }));

  const monthlySales = monthLabels.map((monthName, monthIndex) => ({
    month: monthName,
    value: 8000 + monthIndex * 650 + (monthIndex % 4) * 400,
  }));

  response.json({
    monthlyUsers: monthlyUsers,
    monthlySales: monthlySales,
    movieGenres: countByGroup(movieList, (movie) => movie.genre),
    productCategories: countByGroup(productList, (product) => product.category),
  });
}

module.exports = { getStats, getCharts };
