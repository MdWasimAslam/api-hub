'use strict';

// Aggregate counts/charts from the existing local datasets.
const users = require('../data/users.json');
const movies = require('../data/movies.json');
const products = require('../data/products.json');
const posts = require('../data/posts.json');

// Group an array into [{ label, value }] counts by a key selector.
function countBy(items, selector) {
  const map = new Map();
  for (const item of items) {
    const key = selector(item);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

// GET /dashboard/stats
function getStats(req, res) {
  res.json({
    users: users.length,
    movies: movies.length,
    products: products.length,
    posts: posts.length,
  });
}

// GET /dashboard/charts
function getCharts(req, res) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  // Deterministic, realistic-looking monthly series (no randomness).
  const monthlyUsers = months.map((month, i) => ({
    month,
    value: 120 + i * 18 + (i % 3) * 25,
  }));

  const monthlySales = months.map((month, i) => ({
    month,
    value: 8000 + i * 650 + (i % 4) * 400,
  }));

  res.json({
    monthlyUsers,
    monthlySales,
    movieGenres: countBy(movies, (m) => m.genre),
    productCategories: countBy(products, (p) => p.category),
  });
}

module.exports = { getStats, getCharts };
