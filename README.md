# Smart Shop

Compare supermarket prices and build shopping lists in one place. Smart Shop combines a React storefront with an Express API and MongoDB for accounts and saved content. The interface includes Hebrew content.

## Features

- Search products and sort matches by price.
- Compare a shopping basket across stores, with missing products shown explicitly.
- Manage user accounts, saved shopping lists, and favorite content.
- Browse recipes and articles, and send contact messages.
- View coupons when the separate coupon service is available.

## How basket comparison works

For each requested term, the API chooses the cheapest matching product in each store. Only stores with **every requested item** compete for the cheapest basket. Incomplete stores still show their available products and subtotal, along with the missing terms. If no store can fill the basket, no cheapest store is selected.

Matching uses product-name substrings, not equivalent package sizes or brands. Repeating a term counts it again in the basket. This is a comparison against the bundled dataset, not a guarantee of current in-store prices.

## Technology

| Layer | Tools |
| --- | --- |
| Interface | React 18, React Router, Material UI, Bootstrap |
| API | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens, bcrypt |
| Optional data collection | Puppeteer |
| Regression checks | Node.js test runner, Supertest |

## Repository layout

```text
client/                       React interface
server/                       Express API and database models
  routes/                     Account, content, and list routes
  utils/                      Email and basket comparison helpers
  test/                       API and basket regression tests
  json_files_directory/       Bundled product datasets
puppeteer/                    Optional data collection scripts
```


## Local setup

1. Install Node.js 20 or newer and npm. Start a local MongoDB instance or use a MongoDB connection URI.
2. Run `npm install` from the repository root to install the client and server dependencies. The optional Puppeteer scrapers are installed separately with `npm install --prefix puppeteer`.
3. Copy `server/.env.example` to `server/.env`. Set `DB` and replace both token secrets. Configure email credentials to use verification and password-reset email.
4. Run `npm start` to start the API on port 3000.
5. In a second terminal run `PORT=3001 npm run start:client` (macOS/Linux). On PowerShell use `$env:PORT=3001; npm run start:client`.
6. Open http://localhost:3001. The existing client uses API URLs at http://localhost:3000, so keep the API on that port for local development.

The API requires a working MongoDB connection before it starts listening. Coupons also require the separate coupon service on port 3002; that service is not started by these commands.

## Checks

- `npm test`: server API regression tests (no MongoDB required).
- `npm run build`: production client build.
- `npm run test:legacy --prefix server`: original database-dependent route tests; these require their own seeded database setup.
- `npm run dev --prefix server`: restart the API automatically when server files change.

## Product search

```sh
curl 'http://localhost:3000/api/search?q=milk'
curl -X POST http://localhost:3000/api/productsList \
  -H 'Content-Type: application/json' \
  -d '{"products":["milk","rice"]}'
```

## Data and project status

Product searches use the bundled JSON files in `server/json_files_directory`. The repository does not establish a verified refresh schedule; treat prices as sample snapshots until their source and update time are confirmed. Collecting new data requires separately reviewing and running the optional scrapers.

The client production build and focused search/basket regression tests have been checked locally. Account, email, and database workflows require configured services and have not been verified end to end in this setup. The original legacy route tests also need a seeded database and test setup.

Known limitations:

- API and image URLs in the client currently point to `http://localhost:3000`; deployment needs configurable URLs.
- Coupons depend on another service on port 3002.
- Product-detail and cart API routes in `server/index.js` are placeholders and are not ready for use.
- Existing frontend lint warnings and older dependencies still need maintenance.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| API exits before listening | Set `DB` in `server/.env` and confirm MongoDB is reachable. |
| Interface cannot fetch data | Start the API on port 3000 and the interface on port 3001. |
| Verification or reset email fails | Configure the mail settings in `server/.env`. |
| No product matches | Try a product name from the dataset, including Hebrew terms. |
| Coupons fail | Check that the separate coupon service is running on port 3002. |

## Contributing

Keep fixes focused, add regression coverage when behavior changes, and run `npm test` and `npm run build` before submitting a pull request. Include the problem, resulting behavior, and validation in the description.

Do not commit `.env` files or credentials. Use `server/.env.example` to document configuration names with placeholder values.
