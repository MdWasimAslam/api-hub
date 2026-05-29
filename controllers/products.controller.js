'use strict';

// Load the dataset once at startup (cached in memory).
const products = require('../data/products.json');

// GET /products?page=1&limit=10
function getProducts(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

  const total = products.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const results = products.slice(start, start + limit);

  res.json({ page, limit, total, totalPages, results });
}

// GET /products/search?q=apple
function searchProducts(req, res) {
  const q = (req.query.q || '').trim().toLowerCase();
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required.' });
  }

  const results = products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );

  res.json({ query: q, total: results.length, results });
}

// GET /products/categories
function getCategories(req, res) {
  const categories = [...new Set(products.map((p) => p.category))].sort();
  res.json({ total: categories.length, results: categories });
}

// GET /products/:id
function getProductById(req, res) {
  const id = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ error: `Product with id ${req.params.id} not found.` });
  }

  res.json(product);
}

module.exports = { getProducts, searchProducts, getCategories, getProductById };
