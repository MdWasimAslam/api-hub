'use strict';

/**
 * -------------------------------------------------------------------
 * File: products.controller.js
 *
 * Purpose:
 *   Handles all product-related requests.
 *
 * Responsibilities:
 *   - List products (with pagination)
 *   - Search products
 *   - List the distinct product categories
 *   - Get a single product by id
 *
 * Data Source:
 *   data/products.json
 *
 * Used By:
 *   routes/products.routes.js
 *
 * NOTE: Pagination and search work the same way as movies.controller.js.
 * -------------------------------------------------------------------
 */

// Load the product data once when the server starts.
const productList = require('../data/products.json');

// GET /products?page=1&limit=10  → returns one page of products.
function getProducts(request, response) {
  const currentPage = Math.max(parseInt(request.query.page, 10) || 1, 1);
  const pageSize = Math.max(parseInt(request.query.limit, 10) || 10, 1);

  const totalProducts = productList.length;
  const totalPages = Math.ceil(totalProducts / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const productsOnThisPage = productList.slice(startIndex, startIndex + pageSize);

  response.json({
    page: currentPage,
    limit: pageSize,
    total: totalProducts,
    totalPages: totalPages,
    results: productsOnThisPage,
  });
}

// GET /products/search?q=apple  → search by name, brand, or category.
function searchProducts(request, response) {
  const searchKeyword = (request.query.q || '').trim().toLowerCase();

  if (!searchKeyword) {
    return response
      .status(400)
      .json({ error: 'Query parameter "q" is required.' });
  }

  const matchingProducts = productList.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchKeyword) ||
      product.brand.toLowerCase().includes(searchKeyword) ||
      product.category.toLowerCase().includes(searchKeyword)
    );
  });

  response.json({
    query: searchKeyword,
    total: matchingProducts.length,
    results: matchingProducts,
  });
}

/**
 * GET /products/categories
 *
 * Returns the list of unique category names (handy for filter dropdowns
 * on the frontend). `new Set(...)` removes duplicates automatically, and
 * the spread `[...]` turns the Set back into a normal array we can sort.
 */
function getCategories(request, response) {
  const allCategoryNames = productList.map((product) => product.category);
  const uniqueCategories = [...new Set(allCategoryNames)].sort();

  response.json({
    total: uniqueCategories.length,
    results: uniqueCategories,
  });
}

// GET /products/:id  → find one product by id.
function getProductById(request, response) {
  const productId = parseInt(request.params.id, 10);
  const selectedProduct = productList.find((product) => product.id === productId);

  if (!selectedProduct) {
    return response
      .status(404)
      .json({ error: `Product with id ${request.params.id} not found.` });
  }

  response.json(selectedProduct);
}

module.exports = { getProducts, searchProducts, getCategories, getProductById };
