'use strict';

/**
 * -------------------------------------------------------------------
 * File: docs/openapi.js
 *
 * Purpose:
 *   Describes every endpoint of this API in a standard format called
 *   "OpenAPI". It is just a big JavaScript object — a structured
 *   description of the API (paths, query parameters, examples...).
 *
 * WHAT IS OpenAPI (in plain words)?
 *   A common "menu" format that tools understand. Once an API is
 *   described this way, many tools can read it automatically — including
 *   our own API Explorer (docs/explorer.js).
 *
 * HOW IT IS USED HERE:
 *   - app.js serves this object as JSON at GET /openapi.json
 *   - docs/explorer.js fetches that JSON and draws a "try it" form
 *     for every endpoint listed below.
 *
 * TO DOCUMENT A NEW ENDPOINT:
 *   Add an entry under `paths` (copy an existing one and edit it).
 *   That's it — the Explorer will show it automatically.
 *
 * Used By:
 *   app.js (served as /openapi.json) and docs/explorer.js (rendered)
 * -------------------------------------------------------------------
 */
const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'API Hub',
    version: '1.0.0',
    description:
      'A simple Express API with local JSON data. Try every endpoint right here.',
  },
  tags: [
    { name: 'Movies', description: 'Movie catalogue' },
    { name: 'Users', description: 'User directory' },
    { name: 'Products', description: 'Product catalogue' },
    { name: 'Posts', description: 'Blog posts' },
    { name: 'Dashboard', description: 'Aggregated stats & charts' },
    { name: 'Health', description: 'Service health' },
  ],
  paths: {
    '/movies': {
      get: {
        tags: ['Movies'],
        summary: 'List movies (paginated)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: { 200: { description: 'Paginated list of movies' } },
      },
    },
    '/movies/search': {
      get: {
        tags: ['Movies'],
        summary: 'Search movies',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            example: 'echo',
          },
        ],
        responses: { 200: { description: 'Matching movies' } },
      },
    },
    '/movies/{id}': {
      get: {
        tags: ['Movies'],
        summary: 'Get a movie by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            example: 1,
          },
        ],
        responses: {
          200: { description: 'A single movie' },
          404: { description: 'Movie not found' },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List users (paginated)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: { 200: { description: 'Paginated list of users' } },
      },
    },
    '/users/search': {
      get: {
        tags: ['Users'],
        summary: 'Search users',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            example: 'john',
          },
        ],
        responses: { 200: { description: 'Matching users' } },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get a user by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            example: 1,
          },
        ],
        responses: {
          200: { description: 'A single user' },
          404: { description: 'User not found' },
        },
      },
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List products (paginated)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: { 200: { description: 'Paginated list of products' } },
      },
    },
    '/products/search': {
      get: {
        tags: ['Products'],
        summary: 'Search products (name, brand, category)',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            example: 'apple',
          },
        ],
        responses: { 200: { description: 'Matching products' } },
      },
    },
    '/products/categories': {
      get: {
        tags: ['Products'],
        summary: 'List distinct product categories',
        responses: { 200: { description: 'List of categories' } },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get a product by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            example: 1,
          },
        ],
        responses: {
          200: { description: 'A single product' },
          404: { description: 'Product not found' },
        },
      },
    },
    '/posts': {
      get: {
        tags: ['Posts'],
        summary: 'List posts (paginated)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: { 200: { description: 'Paginated list of posts' } },
      },
    },
    '/posts/search': {
      get: {
        tags: ['Posts'],
        summary: 'Search posts (title, content)',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            example: 'react',
          },
        ],
        responses: { 200: { description: 'Matching posts' } },
      },
    },
    '/posts/{id}': {
      get: {
        tags: ['Posts'],
        summary: 'Get a post by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            example: 1,
          },
        ],
        responses: {
          200: { description: 'A single post' },
          404: { description: 'Post not found' },
        },
      },
    },
    '/dashboard/stats': {
      get: {
        tags: ['Dashboard'],
        summary: 'Aggregate record counts',
        responses: { 200: { description: 'Counts per module' } },
      },
    },
    '/dashboard/charts': {
      get: {
        tags: ['Dashboard'],
        summary: 'Chart-ready aggregated data',
        responses: { 200: { description: 'Monthly series and group breakdowns' } },
      },
    },
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: { 200: { description: 'Service is healthy' } },
      },
    },
  },
};

module.exports = openApiSpec;
