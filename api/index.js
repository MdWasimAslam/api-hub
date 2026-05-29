'use strict';

/**
 * -------------------------------------------------------------------
 * File: api/index.js
 *
 * Purpose:
 *   The entry point Vercel uses when the project is deployed.
 *
 * Why it lives in an "api/" folder:
 *   Vercel automatically treats files inside "api/" as serverless
 *   functions. Instead of running a server that stays on 24/7, Vercel
 *   runs our Express app on-demand whenever a request comes in.
 *
 * We simply re-use the same app defined in app.js and export it.
 * -------------------------------------------------------------------
 */

const app = require('../app');

module.exports = app;
