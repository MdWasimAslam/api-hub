'use strict';

// Local development server. (On Vercel, api/index.js is used instead.)
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Hub running at http://localhost:${PORT}`);
});
