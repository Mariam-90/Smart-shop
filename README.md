# Smart Shop

React storefront and Express/MongoDB API for supermarket product searches, shopping lists, recipes, and articles.

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

Product searches use the JSON datasets in `server/json_files_directory`. Do not commit `.env` files or credentials.
