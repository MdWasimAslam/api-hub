'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/products.controller');

// NOTE: "/search" and "/categories" must be declared BEFORE "/:id".
router.get('/search', controller.searchProducts);
router.get('/categories', controller.getCategories);
router.get('/', controller.getProducts);
router.get('/:id', controller.getProductById);

module.exports = router;
