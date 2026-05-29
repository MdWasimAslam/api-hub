'use strict';

/**
 * -------------------------------------------------------------------
 * File: products.routes.js
 *
 * Purpose:
 *   Defines the product URLs and connects them to the product controller.
 *
 * Connects To:
 *   controllers/products.controller.js
 *
 * Mounted In:
 *   app.js   →   app.use('/products', productsRoutes)
 * -------------------------------------------------------------------
 */

const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');

// Specific paths ("/search", "/categories") MUST come before "/:id",
// otherwise "/:id" would catch the words "search" and "categories".
router.get('/search', productsController.searchProducts);
router.get('/categories', productsController.getCategories);
router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);

module.exports = router;
