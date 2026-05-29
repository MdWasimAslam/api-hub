'use strict';

/**
 * -------------------------------------------------------------------
 * File: scripts/generate-data.js
 *
 * Purpose:
 *   Creates the sample data files the API serves:
 *     - data/movies.json   (100 movies)
 *     - data/users.json    (50 users)
 *     - data/products.json (100 products)
 *     - data/posts.json    (100 posts)
 *
 * Why a generator instead of typing JSON by hand?
 *   Writing hundreds of records by hand is slow and error-prone.
 *   This script builds them from small word lists using simple loops.
 *
 * Is it random?
 *   No. It uses the item's position (index) in simple formulas, so the
 *   output is the SAME every time you run it — easy to learn from.
 *
 * Run with:
 *   npm run seed
 *   (The generated .json files are also committed, so you rarely need to.)
 * -------------------------------------------------------------------
 */

const fs = require('fs');     // Node's File System module (to write files)
const path = require('path'); // builds safe file paths across operating systems

// Folder where the .json files will be written (the project's /data folder).
const dataDir = path.join(__dirname, '..', 'data');

// ─── Helper ───────────────────────────────────────────────────────
// Pick an item from a list using an index, looping back to the start when
// the index goes past the end (the "% length" keeps it in range).
// Example: pick(['a','b'], 0)='a', pick(['a','b'], 1)='b', pick(['a','b'], 2)='a'
const pick = (list, index) => list[index % list.length];

// ─── Movies ───────────────────────────────────────────────────────
const adjectives = [
  'Lost', 'Silent', 'Broken', 'Golden', 'Dark', 'Eternal', 'Hidden', 'Last',
  'Crimson', 'Frozen', 'Burning', 'Secret', 'Wild', 'Rising', 'Falling',
  'Shadow', 'Iron', 'Velvet', 'Distant', 'Endless',
];
const nouns = [
  'Kingdom', 'Horizon', 'Echo', 'Promise', 'Empire', 'Voyage', 'Legacy',
  'Storm', 'Garden', 'Mirror', 'River', 'Dream', 'City', 'Phoenix', 'Tide',
  'Whisper', 'Crown', 'Journey', 'Signal', 'Dawn',
];
const genres = [
  'Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Romance',
  'Horror', 'Adventure', 'Fantasy', 'Mystery',
];
const languages = ['English', 'Spanish', 'French', 'Japanese', 'Korean', 'Hindi'];

const movies = Array.from({ length: 100 }, (_, idx) => {
  const id = idx + 1;
  const title = `${pick(adjectives, idx * 3 + 1)} ${pick(nouns, idx * 7 + 2)}`;
  const year = 1990 + (idx % 35); // 1990–2024
  const genre = pick(genres, idx);
  const rating = Number((5 + ((idx * 13) % 50) / 10).toFixed(1)); // 5.0–9.9
  const duration = 90 + (idx % 60); // 90–149 mins
  const language = pick(languages, idx);

  return {
    id,
    title,
    year,
    genre,
    rating,
    duration,
    language,
    poster_url: `https://picsum.photos/seed/movie-${id}-poster/300/450`,
    backdrop_url: `https://picsum.photos/seed/movie-${id}-backdrop/1280/720`,
    description: `${title} is a ${genre.toLowerCase()} film released in ${year}, running ${duration} minutes in ${language}.`,
  };
});

// ─── Users ────────────────────────────────────────────────────────
const firstNames = [
  'John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Daniel', 'Laura',
  'James', 'Olivia', 'Robert', 'Sophia', 'William', 'Emma', 'Joseph', 'Ava',
  'Thomas', 'Mia', 'Charles', 'Isabella', 'Henry', 'Amelia', 'George', 'Ella',
  'Edward',
];
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas',
  'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
];
const cities = [
  'New York', 'London', 'Paris', 'Tokyo', 'Berlin', 'Sydney', 'Toronto',
  'Mumbai', 'Dubai', 'Singapore',
];
// Country paired by index with `cities` above.
const countries = [
  'USA', 'UK', 'France', 'Japan', 'Germany', 'Australia', 'Canada',
  'India', 'UAE', 'Singapore',
];
const streets = [
  'Main St', 'Oak Ave', 'Maple Rd', 'Cedar Ln', 'Pine St', 'Elm St',
  'Sunset Blvd', 'Hill Rd', 'Lake View', 'Park Ave',
];
const companies = [
  'Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Soylent', 'Hooli',
  'Stark Industries', 'Wayne Enterprises', 'Wonka Inc', 'Pied Piper',
];
const jobTitles = [
  'Software Engineer', 'Product Manager', 'Designer', 'Data Analyst',
  'Marketing Lead', 'Sales Executive', 'QA Engineer', 'DevOps Engineer',
  'Support Specialist', 'Project Manager',
];
const genders = ['male', 'female'];

const users = Array.from({ length: 50 }, (_, idx) => {
  const id = idx + 1;
  const first = pick(firstNames, idx);
  const last = pick(lastNames, idx * 3 + 1);
  const name = `${first} ${last}`;
  const email = `${first}.${last}${id}`.toLowerCase() + '@example.com';
  const username = `${first}${last}${id}`.toLowerCase();
  const cityIdx = idx % cities.length;
  const age = 20 + (idx % 45); // 20–64
  const birthYear = 2024 - age;
  // Zero-padded month/day derived from id (kept deterministic).
  const month = String((idx % 12) + 1).padStart(2, '0');
  const day = String((idx % 27) + 1).padStart(2, '0');

  return {
    id,
    name,
    username,
    email,
    phone: `+1-555-${String(1000 + id).padStart(4, '0')}`,
    gender: pick(genders, idx),
    age,
    dateOfBirth: `${birthYear}-${month}-${day}`,
    avatar: `https://i.pravatar.cc/150?u=${email}`,
    address: {
      street: `${100 + id} ${pick(streets, idx)}`,
      city: cities[cityIdx],
      country: countries[cityIdx],
      zipcode: String(10000 + id * 7).padStart(5, '0'),
    },
    // Keep top-level `city` too for backward compatibility with existing search.
    city: cities[cityIdx],
    company: pick(companies, idx),
    jobTitle: pick(jobTitles, idx),
    website: `https://${username}.example.com`,
    isActive: idx % 4 !== 0, // ~75% active
    registeredAt: `${2020 + (idx % 5)}-${month}-${day}T08:00:00.000Z`,
  };
});

// ─── Products ─────────────────────────────────────────────────────
const productNames = [
  'Smartphone', 'Laptop', 'Headphones', 'Smartwatch', 'Tablet', 'Camera',
  'Speaker', 'Keyboard', 'Mouse', 'Monitor', 'Sneakers', 'Backpack',
  'Sunglasses', 'Jacket', 'Wallet', 'Coffee Maker', 'Blender', 'Lamp',
  'Chair', 'Desk',
];
const brands = [
  'Apple', 'Samsung', 'Sony', 'Dell', 'Nike', 'Adidas', 'Logitech',
  'Bose', 'HP', 'Canon',
];
const categories = [
  'Electronics', 'Audio', 'Computers', 'Fashion', 'Home', 'Accessories',
];

const products = Array.from({ length: 100 }, (_, idx) => {
  const id = idx + 1;
  const name = `${pick(brands, idx)} ${pick(productNames, idx * 3 + 1)}`;
  const category = pick(categories, idx);
  const month = String((idx % 12) + 1).padStart(2, '0');
  const day = String((idx % 27) + 1).padStart(2, '0');

  return {
    id,
    name,
    description: `${name} — a quality ${category.toLowerCase()} product.`,
    price: 49 + ((idx * 37) % 1951), // 49–1999
    category,
    brand: pick(brands, idx),
    stock: (idx * 7) % 200, // 0–199
    rating: Number((3.5 + ((idx * 11) % 15) / 10).toFixed(1)), // 3.5–4.9
    image: `https://picsum.photos/seed/product-${id}/400/400`,
    createdAt: `${2022 + (idx % 3)}-${month}-${day}T10:00:00.000Z`,
  };
});

// ─── Posts ────────────────────────────────────────────────────────
const postTopics = [
  'React Tips', 'Node.js Best Practices', 'CSS Tricks', 'JavaScript Basics',
  'TypeScript Guide', 'API Design', 'Web Performance', 'Clean Code',
  'Docker 101', 'Git Workflows', 'Testing Strategies', 'Accessibility',
  'Responsive Design', 'State Management', 'GraphQL Intro',
];

const posts = Array.from({ length: 100 }, (_, idx) => {
  const id = idx + 1;
  const topic = pick(postTopics, idx);
  const title = `${topic} #${id}`;
  const author = pick(firstNames, idx) + ' ' + pick(lastNames, idx * 3 + 1);
  const month = String((idx % 12) + 1).padStart(2, '0');
  const day = String((idx % 27) + 1).padStart(2, '0');

  return {
    id,
    title,
    content: `In this post about ${topic}, we explore practical techniques and examples to help you write better code. Item ${id} in the series.`,
    author,
    likes: (idx * 23) % 1000, // 0–999
    commentsCount: (idx * 5) % 120, // 0–119
    image: `https://picsum.photos/seed/post-${id}/800/400`,
    createdAt: `${2023 + (idx % 2)}-${month}-${day}T09:00:00.000Z`,
  };
});

// ─── Write files ──────────────────────────────────────────────────
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(
  path.join(dataDir, 'movies.json'),
  JSON.stringify(movies, null, 2)
);
fs.writeFileSync(
  path.join(dataDir, 'users.json'),
  JSON.stringify(users, null, 2)
);
fs.writeFileSync(
  path.join(dataDir, 'products.json'),
  JSON.stringify(products, null, 2)
);
fs.writeFileSync(
  path.join(dataDir, 'posts.json'),
  JSON.stringify(posts, null, 2)
);

console.log(
  `Generated ${movies.length} movies, ${users.length} users, ` +
    `${products.length} products, and ${posts.length} posts.`
);
