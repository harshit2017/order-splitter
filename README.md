# Order Splitter API

Robo-advisor proof-of-concept API that splits a model portfolio investment into per-stock dollar amounts and share quantities, determines when orders should execute, and returns historic orders.

## Tech stack

- Node.js + TypeScript
- Express
- Zod (validation)
- Luxon (US ET market hours)
- Vitest + Supertest (tests)

## Getting started

```bash
npm install
npm run dev
```

The server starts on `http://localhost:3000` by default.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm test` | Run unit and integration tests |

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `DEFAULT_PRICE` | `100` | Default stock price when not provided |
| `SHARE_DECIMAL_PLACES` | `3` | Decimal precision for share quantities |

## API endpoints

### POST `/api/model`

Split a model portfolio order.

**Request:**

```bash
curl -X POST http://localhost:3000/api/model \
  -H "Content-Type: application/json" \
  -d '{
    "type": "BUY",
    "totalAmount": 100,
    "portfolio": [
      { "symbol": "AAPL", "weight": 60 },
      { "symbol": "TSLA", "weight": 40 }
    ],
    "prices": {
      "AAPL": 150
    }
  }'
```

**Response `201`:**

```json
{
  "id": "uuid",
  "type": "BUY",
  "totalAmount": 100,
  "executeAt": "2026-07-07T13:30:00.000Z",
  "marketOpenAtSubmission": true,
  "allocations": [
    { "symbol": "AAPL", "weight": 60, "amount": 60, "price": 150, "quantity": 0.4 },
    { "symbol": "TSLA", "weight": 40, "amount": 40, "price": 100, "quantity": 0.4 }
  ],
  "createdAt": "2026-07-07T13:30:00.000Z"
}
```

### GET `/api/orders`

Return historic orders (newest first).

```bash
curl http://localhost:3000/api/orders
```

Optional query param:

```bash
curl "http://localhost:3000/api/orders?limit=10"
```

**Response `200`:**

```json
{
  "orders": [],
  "count": 0
}
```

## Architecture

```
Controller → Service → Repository
                ↓
         OrderSplitterService
         MarketHoursService
```

- **Controllers** handle HTTP and validation
- **Services** contain business logic
- **Repository** stores orders in an in-memory `db.json`-shaped document (`{ orders: [] }`)

Data is held in memory only and does not survive application restart.

## Project structure

```
src/
├── controllers/
├── services/
├── repositories/
├── schemas/
├── types/
├── utils/
├── middleware/
├── routes/
├── config/
├── app.ts
└── index.ts
data/
└── db.json          # seed structure reference
tests/
```

## Dependencies

| Package | Purpose |
|---|---|
| express | HTTP server |
| zod | Request validation |
| uuid | Order IDs |
| luxon | US ET market hours |
| vitest | Unit tests |
| supertest | Integration tests |
