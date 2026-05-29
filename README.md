# API Hub 🎯

A complete, **beginner-friendly backend project** you can use to learn frontend development and understand how APIs really work — with **zero setup pain**: no database, no API keys, no cloud accounts.

> **In one sentence:** API Hub is a small Express server that serves realistic fake data (movies, users, products, posts, dashboard stats) from local JSON files, so you can practise building real frontends against a real API.

---

## 1. Project Overview

### What is API Hub?

It's a small REST API with six topics:

- 🎬 **Movies** (100 records)
- 👤 **Users** (50 records)
- 🛍️ **Products** (100 records)
- 📝 **Posts** (100 records)
- 📊 **Dashboard** (stats + chart data)
- ❤️ **Health** (is the server alive?)

It also ships with a built-in **API Explorer** at `/` — a tiny web page where you can click and test every endpoint in your browser (like a mini Postman / Swagger UI). It includes:

- 🔎 An **endpoint search box** to filter endpoints in real time
- 🌙 **Dark / light mode** (your choice is remembered via `localStorage`)
- 📋 One-click **Copy URL / Copy cURL / Copy Axios / Copy Response** buttons
- ⚡ **Quick examples** that fill in all the fields for you
- 📊 **Response info** after each request (status code, time, size)
- 📝 Collapsible **Developer Notes** explaining each endpoint
- 🧭 An **overview card** (status, total endpoints, record counts, version, environment)

It is plain inline HTML/CSS/JS — no Bootstrap, Tailwind, CDN, or extra packages.

### Why does it exist?

Most tutorials make you either (a) hit a public API with rate limits and API keys, or (b) set up a database before you can write a single line of frontend code. Both get in the way of *learning the frontend*.

API Hub removes all of that. The data lives in plain JSON files, so the API starts instantly and always behaves the same way.

### What concepts does it help you learn?

- How an HTTP API is structured (routes, controllers, responses)
- **Pagination** (`page`, `limit`, `total`, `totalPages`)
- **Search** with query parameters (`?q=...`)
- Fetching data with `fetch` / **Axios**
- Caching & infinite scroll with **React Query**
- Global state with **Redux Toolkit**
- Building **dashboards** and charts
- Reading API docs via **OpenAPI**

---

## 2. Beginner Learning Roadmap

Use these endpoints as the backend for small practice projects. Suggested order:

| Step | Skill | Try building... | Endpoint to use |
| ---- | ----- | --------------- | --------------- |
| 1 | **fetch / Axios** | A movie list page | `GET /movies` |
| 2 | **Pagination** | "Next / Previous page" buttons | `GET /movies?page=2&limit=10` |
| 3 | **Search** | A search box that filters results | `GET /movies/search?q=echo` |
| 4 | **Details page** | Click a card → see one movie | `GET /movies/:id` |
| 5 | **React Query** | Auto-caching + loading states | any list endpoint |
| 6 | **Infinite Scroll** | Load more as you scroll | `GET /posts?page=N&limit=10` |
| 7 | **Redux Toolkit** | A shopping cart | `GET /products` |
| 8 | **Dashboard** | Charts & summary cards | `GET /dashboard/stats` + `/charts` |
| 9 | **React Native** | A mobile movie/products app | any endpoint |

**Tip:** every list endpoint returns the *same* response shape, so once you build pagination for movies, the exact same component works for users, products, and posts.

---

## 3. Architecture Explanation

API Hub uses a simple, classic layout. A request flows in one direction:

```
   Browser / App (your frontend)
        │   e.g. GET /movies?page=2
        ▼
   app.js                      ← the switchboard (middleware + route mounting)
        │
        ▼
   routes/movies.routes.js     ← matches the URL, picks a controller function
        │
        ▼
   controllers/movies.controller.js   ← the logic (paginate, search, find)
        │
        ▼
   data/movies.json            ← the data (a plain file, no database)
        │
        ▼
   JSON response  ──────────────▶ back to the Browser / App
```

**Why this is nice for learning:** each layer has ONE job. If something breaks, you know exactly where to look.

---

## 4. Folder Structure Explanation

```
api-hub/
├── api/
│   └── index.js        # Entry point Vercel uses to run the app online
├── data/               # The "database" — just JSON files
│   ├── movies.json
│   ├── users.json
│   ├── products.json
│   └── posts.json
├── routes/             # URL definitions → point each URL to a controller
│   ├── movies.routes.js
│   ├── users.routes.js
│   ├── products.routes.js
│   ├── posts.routes.js
│   ├── dashboard.routes.js
│   └── health.routes.js
├── controllers/        # The logic — reads data and builds the response
│   ├── movies.controller.js
│   ├── users.controller.js
│   ├── products.controller.js
│   ├── posts.controller.js
│   ├── dashboard.controller.js
│   └── health.controller.js
├── docs/
│   ├── openapi.js      # Describes every endpoint (the API "menu")
│   └── explorer.js     # The built-in test page served at "/"
├── scripts/
│   └── generate-data.js  # Re-creates the JSON files (npm run seed)
├── app.js              # Builds the Express app and connects all routes
├── server.js           # Runs the app locally (npm run dev)
├── vercel.json         # Tells Vercel how to deploy
└── package.json        # Project info + dependencies + scripts
```

In plain words:

- **`data/`** is your fake database.
- **`routes/`** says *"this URL runs this function."*
- **`controllers/`** is *what that function actually does.*
- **`docs/`** powers the test page and the API documentation.
- **`app.js`** ties everything together.

---

## 5. How Pagination Works

Instead of sending all 100 movies at once, the API sends one "page" at a time.

You control it with two query parameters:

- `page` — which page you want (default `1`)
- `limit` — how many items per page (default `10`)

```
GET /movies?page=1&limit=10   → items  1–10
GET /movies?page=2&limit=10   → items 11–20
GET /movies?page=3&limit=10   → items 21–30
```

Every list endpoint returns the same shape:

```json
{
  "page": 2,
  "limit": 10,
  "total": 100,
  "totalPages": 10,
  "results": [ /* the 10 items for this page */ ]
}
```

Behind the scenes (see `controllers/movies.controller.js`):

```
startIndex = (page - 1) * limit          // page 2, limit 10 → start at 10
results    = movieList.slice(start, start + limit)   // take 10 items
totalPages = Math.ceil(total / limit)     // 100 / 10 → 10 pages
```

---

## 6. How Search Works

Search uses one query parameter, `q` (the keyword):

```
GET /movies/search?q=echo
GET /users/search?q=john
GET /products/search?q=apple
GET /posts/search?q=react
```

The logic is simple and **case-insensitive**:

1. Lowercase the keyword.
2. Keep every record whose relevant fields *contain* that keyword.

```js
const matches = movieList.filter((movie) =>
  movie.title.toLowerCase().includes(keyword) ||
  movie.genre.toLowerCase().includes(keyword) ||
  movie.language.toLowerCase().includes(keyword)
);
```

Response shape:

```json
{ "query": "echo", "total": 5, "results": [ /* matching items */ ] }
```

---

## 7. How To Add A New API

Want to add, say, a **Reviews** API? Follow the same pattern the project already uses. Five steps:

**Step 1 — Add data** (optional)
Create `data/reviews.json` (you can add a generator block in `scripts/generate-data.js`).

**Step 2 — Create the controller**
`controllers/reviews.controller.js` — copy `posts.controller.js` and rename things. It holds the functions (list, search, get-by-id).

**Step 3 — Create the route**
`routes/reviews.routes.js` — copy `posts.routes.js`. Remember: declare `/search` **before** `/:id`.

**Step 4 — Register the route in `app.js`**
```js
const reviewsRoutes = require('./routes/reviews.routes');
app.use('/reviews', reviewsRoutes);
```

**Step 5 — Document it in `docs/openapi.js`**
Add an entry under `paths` (copy an existing one). The API Explorer will now show it automatically.

**Then test it** in the Explorer at `http://localhost:3000`. Done!

---

## 8. Common Beginner Questions

**❓ Why is there no database?**
Because the goal is to learn the *frontend* and *how APIs work* — not database setup. JSON files behave like a read-only database and need zero configuration.

**❓ Why JSON files?**
They're human-readable, require no installation, and load instantly. You can open `data/movies.json` and literally see the data the API returns.

**❓ Why Express?**
Express is the most popular, beginner-friendly Node.js framework for building APIs. It has a tiny learning curve and is used widely in real jobs.

**❓ Why Vercel?**
Vercel can host this API for free and deploy it in seconds with one command — no servers to manage. That lets you share a live API URL with your frontend.

**❓ Can I change the data?**
Yes! Edit the files in `data/`, or edit `scripts/generate-data.js` and run `npm run seed` to regenerate everything.

**❓ Is the data real?**
No, it's realistic but fake (generated). That's perfect for practice and means nothing breaks.

---

## Setup

```bash
npm install      # install dependencies (just express + cors)
npm run dev      # start the server at http://localhost:3000
```

Open **http://localhost:3000** for the API Explorer.

> Regenerate the sample data any time with `npm run seed`.

---

## All Endpoints

| Method | Path                        | Description                 |
| ------ | --------------------------- | --------------------------- |
| GET    | `/`                         | API Explorer (test UI)      |
| GET    | `/openapi.json`             | OpenAPI spec (the API menu) |
| GET    | `/movies?page=1&limit=10`   | List movies (paginated)     |
| GET    | `/movies/:id`               | Movie details               |
| GET    | `/movies/search?q=echo`     | Search movies               |
| GET    | `/users?page=1&limit=10`    | List users (paginated)      |
| GET    | `/users/:id`                | User details                |
| GET    | `/users/search?q=john`      | Search users                |
| GET    | `/products?page=1&limit=10` | List products (paginated)   |
| GET    | `/products/:id`             | Product details             |
| GET    | `/products/search?q=apple`  | Search products             |
| GET    | `/products/categories`      | Distinct product categories |
| GET    | `/posts?page=1&limit=10`    | List posts (paginated)      |
| GET    | `/posts/:id`                | Post details                |
| GET    | `/posts/search?q=react`     | Search posts                |
| GET    | `/dashboard/stats`          | Aggregate record counts     |
| GET    | `/dashboard/charts`         | Chart-ready aggregated data |
| GET    | `/health`                   | Health check                |

---

## cURL examples

```bash
# Movies
curl "http://localhost:3000/movies?page=1&limit=10"
curl "http://localhost:3000/movies/1"
curl "http://localhost:3000/movies/search?q=echo"

# Users
curl "http://localhost:3000/users?page=1&limit=10"
curl "http://localhost:3000/users/1"
curl "http://localhost:3000/users/search?q=john"

# Products
curl "http://localhost:3000/products?page=1&limit=10"
curl "http://localhost:3000/products/1"
curl "http://localhost:3000/products/search?q=apple"
curl "http://localhost:3000/products/categories"

# Posts
curl "http://localhost:3000/posts?page=1&limit=10"
curl "http://localhost:3000/posts/1"
curl "http://localhost:3000/posts/search?q=react"

# Dashboard
curl "http://localhost:3000/dashboard/stats"
curl "http://localhost:3000/dashboard/charts"

# Health
curl "http://localhost:3000/health"
```

---

## Sample responses

### `GET /movies?page=1&limit=2`

```json
{
  "page": 1,
  "limit": 2,
  "total": 100,
  "totalPages": 50,
  "results": [
    {
      "id": 1,
      "title": "Silent Echo",
      "year": 1990,
      "genre": "Action",
      "rating": 5,
      "duration": 90,
      "language": "English",
      "poster_url": "https://picsum.photos/seed/movie-1-poster/300/450",
      "backdrop_url": "https://picsum.photos/seed/movie-1-backdrop/1280/720",
      "description": "Silent Echo is a action film released in 1990, running 90 minutes in English."
    }
  ]
}
```

### `GET /users/11`

```json
{
  "id": 11,
  "name": "Robert Anderson",
  "username": "robertanderson11",
  "email": "robert.anderson11@example.com",
  "phone": "+1-555-1011",
  "gender": "male",
  "age": 30,
  "dateOfBirth": "1994-11-11",
  "avatar": "https://i.pravatar.cc/150?u=robert.anderson11@example.com",
  "address": {
    "street": "111 Main St",
    "city": "New York",
    "country": "USA",
    "zipcode": "10077"
  },
  "city": "New York",
  "company": "Acme Corp",
  "jobTitle": "Software Engineer",
  "website": "https://robertanderson11.example.com",
  "isActive": true,
  "registeredAt": "2020-11-11T08:00:00.000Z"
}
```

### `GET /products/1`

```json
{
  "id": 1,
  "name": "Apple Laptop",
  "description": "Apple Laptop — a quality electronics product.",
  "price": 49,
  "category": "Electronics",
  "brand": "Apple",
  "stock": 0,
  "rating": 3.5,
  "image": "https://picsum.photos/seed/product-1/400/400",
  "createdAt": "2022-01-01T10:00:00.000Z"
}
```

### `GET /posts/1`

```json
{
  "id": 1,
  "title": "React Tips #1",
  "content": "In this post about React Tips, we explore practical techniques and examples to help you write better code. Item 1 in the series.",
  "author": "John Johnson",
  "likes": 0,
  "commentsCount": 0,
  "image": "https://picsum.photos/seed/post-1/800/400",
  "createdAt": "2023-01-01T09:00:00.000Z"
}
```

### `GET /dashboard/stats`

```json
{
  "users": 50,
  "movies": 100,
  "products": 100,
  "posts": 100
}
```

### `GET /dashboard/charts`

```json
{
  "monthlyUsers": [{ "month": "Jan", "value": 120 }, "..."],
  "monthlySales": [{ "month": "Jan", "value": 8000 }, "..."],
  "movieGenres": [{ "label": "Action", "value": 10 }, "..."],
  "productCategories": [{ "label": "Electronics", "value": 17 }, "..."]
}
```

### `GET /health`

```json
{
  "status": "ok",
  "service": "API Hub",
  "uptime": 12.34,
  "timestamp": "2026-05-29T10:00:00.000Z"
}
```

---

## Deploy to Vercel

```bash
npm i -g vercel        # if not installed
vercel                 # link & preview deploy
vercel deploy --prod   # production deploy (or: npm run deploy)
```

The API Explorer is plain inline HTML/CSS/JS (no CDN, no packages), so it renders correctly on Vercel with no extra configuration.

---

## License

MIT
