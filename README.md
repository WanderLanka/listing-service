# WanderLanka Listing Service

Lists accommodations, guides, transport providers, tour packages, etc.

This initial version focuses on Guide Listings.

## Run

```
npm install
npm run dev
```

## Env

Copy `.env.example` to `.env` and adjust.

## Endpoints (initial)

- GET `/guides` — list guides with pagination and optional search
  - query: `page`, `limit`, `q` (search by first/last name), `approved=true|false`
