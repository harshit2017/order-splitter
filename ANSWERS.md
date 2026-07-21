# ANSWERS

## What was your approach (thought process) to tackling this project?

I started by separating the problem into three concerns: allocation math, market timing, and order persistence. The API surface is intentionally small (two endpoints) so the design stays focused on the core POC requirements.

I used a controller → service → repository layering:

- Controllers own HTTP concerns and input validation.
- Services own business rules (splitting, execution timing).
- The repository owns in-memory storage using a `db.json`-shaped document.

This keeps each layer testable in isolation and mirrors how a production robo-advisor service would be structured before adding broker integrations.

## What assumptions did you make?

1. Portfolio weights are percentages (0–100) and must sum to 100 (±0.01 tolerance).
2. Currency is USD; `totalAmount` is a positive number.
3. `BUY` and `SELL` both accept a dollar amount; share quantity = `amount / price`.
4. Default stock price is $100; optional partner-provided prices override defaults per symbol.
5. Rounding uses largest-remainder for both dollar amounts (2 decimals) and share quantities (configurable decimals).
6. Share decimal places are configurable via `SHARE_DECIMAL_PLACES` (default 3).
7. Market hours are US equities, Monday–Friday, 9:30 AM–4:00 PM America/New_York, with no holiday calendar.
8. If submitted during market hours, `executeAt` is now; otherwise it is the next weekday open at 9:30 AM ET.
9. Historic orders are stored in memory and returned newest-first via `GET /api/orders`.
10. No authentication or broker integration is required for this POC.
11. Validation errors return HTTP 400; unexpected errors return HTTP 500.

## What challenges did you face when creating your solution?

1. **Rounding consistency** — Independent rounding per stock can leave totals off by a cent or fractional share. Largest-remainder fixes this while staying deterministic.
2. **Market-hours edge cases** — Weekends, pre-market, and after-hours submissions all need a predictable next-open time without a holiday calendar.
3. **Ambiguous sell semantics** — The spec does not define sell-by-shares vs sell-by-dollar; I treated SELL the same as BUY using dollar amounts.
4. **In-memory vs file persistence** — The challenge requires data not to survive restart. I used an in-memory data structure.

## If you were to migrate your code from its current standalone format to a fully functional production environment, what are some changes and controls you would put in place?

| Area | Production change |
|---|---|
| **Persistence** | PostgreSQL or similar for orders and audit history |
| **Auth** | API keys / OAuth2, rate limiting, IP allowlists |
| **Market calendar** | NYSE/NASDAQ holiday calendar and early-close days |
| **Broker integration** | Alpaca/IBKR adapter, order status lifecycle, partial fills |
| **Idempotency** | Idempotency keys on POST to prevent duplicate trades |
| **Observability** | Structured logging, metrics, tracing, alerting, Tools like datadog, grafana etc. |
| **Security** | Input sanitization, TLS, secrets management, WAF |
| **Config** | Centralized config service for decimal precision and defaults |
| **Deployment** | Docker, health checks, graceful shutdown, CI/CD |
| **Compliance** | Audit trails, PII handling, retention policies |

## If you've used LLMs to solve the challenge, describe how and where you've used it

LLMs were used during planning and implementation to:

- Break down ambiguous requirements from the PDF into explicit assumptions.
- Compare real robo-advisor behavior (market hours, fractional shares, rounding) against the POC scope.

