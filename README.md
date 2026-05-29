# API Hub

A simple, beginner-friendly **Node.js + Express** API with **local JSON data**, a lightweight built-in **API Explorer** at the root, and one-command **Vercel** deployment. No database or external API required.

## Features

- 📖 Built-in API Explorer at `/` — a tiny (~6 KB), dependency-free, Swagger-style page to test every endpoint from the browser
- 🎬 Movies API (100 movies) with pagination, details, and search
- 👤 Users API (50 users) with pagination, details, and search
- 🛍️ Products API (100 products) with pagination, search, and categories
- 📝 Posts API (100 posts) with pagination, details, and search
- 📊 Dashboard API with aggregate stats and chart-ready data
- ❤️ Health check endpoint
- 🌐 CORS enabled
- 🧱 Clean folder structure (routes / controllers / data)
- ▲ Deploys to Vercel without modification

## Folder structure

```
api-hub/
├── api/
│   └── index.js              # Vercel serverless entry point
├── data/
│   ├── movies.json           # 100 sample movies
│   ├── users.json            # 50 sample users
│   ├── products.json         # 100 sample products
│   └── posts.json            # 100 sample posts
├── routes/
│   ├── movies.routes.js
│   ├── users.routes.js
│   ├── products.routes.js
│   ├── posts.routes.js
│   ├── dashboard.routes.js
│   └── health.routes.js
├── controllers/
│   ├── movies.controller.js
│   ├── users.controller.js
│   ├── products.controller.js
│   ├── posts.controller.js
│   ├── dashboard.controller.js
│   └── health.controller.js
├── docs/
│   ├── openapi.js            # OpenAPI spec (data source for the explorer)
│   └── explorer.js           # Lightweight built-in API Explorer UI
├── scripts/
│   └── generate-data.js      # Regenerates the sample datasets
├── app.js                    # Express app
├── server.js                 # Local dev server
├── vercel.json
└── package.json
```

## Setup

```bash
npm install      # install dependencies
npm run dev      # start at http://localhost:3000
```

Open **http://localhost:3000** in your browser for the API Explorer.

> Need to regenerate the sample data? Run `npm run seed`.

## Endpoints

| Method | Path                       | Description                |
| ------ | -------------------------- | -------------------------- |
| GET    | `/`                        | API Explorer (test UI)     |
| GET    | `/openapi.json`            | OpenAPI spec               |
| GET    | `/movies?page=1&limit=10`  | List movies (paginated)    |
| GET    | `/movies/:id`              | Movie details              |
| GET    | `/movies/search?q=echo`    | Search movies              |
| GET    | `/users?page=1&limit=10`   | List users (paginated)     |
| GET    | `/users/:id`               | User details               |
| GET    | `/users/search?q=john`     | Search users               |
| GET    | `/products?page=1&limit=10`| List products (paginated)  |
| GET    | `/products/:id`            | Product details            |
| GET    | `/products/search?q=apple` | Search products            |
| GET    | `/products/categories`     | Distinct product categories|
| GET    | `/posts?page=1&limit=10`   | List posts (paginated)     |
| GET    | `/posts/:id`               | Post details               |
| GET    | `/posts/search?q=react`    | Search posts               |
| GET    | `/dashboard/stats`         | Aggregate record counts    |
| GET    | `/dashboard/charts`        | Chart-ready aggregated data|
| GET    | `/health`                  | Health check               |

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

## Deploy to Vercel

```bash
npm i -g vercel        # if not installed
vercel                 # link & preview deploy
vercel deploy --prod   # production deploy (or: npm run deploy)
```

The API Explorer is plain inline HTML/CSS/JS (no CDN, no packages), so it renders correctly on Vercel with no extra configuration.

## Extending

- **Add a field** to a movie/user: edit `scripts/generate-data.js` and run `npm run seed`, or edit `data/*.json` directly.
- **Add an endpoint**: create a controller function, wire it in the matching `routes/*.js`, and document it in `docs/openapi.js`.

## License

MIT
