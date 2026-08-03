# trading-engine

A Node app that consumes the simulated order feed (Rust) from the Nexus exercise and exposes the orders in a normalized format via HTTP. Hexagonal architecture: pure domain at the center, ports as contracts, adapters at the edges (`driving` = endpoints we expose, `driven` = calls to the feed endpoints).

## Structure

```text
src/
├── main.js                   # composition root
├── config/index.js           # env vars + defaults
├── domain/                   # zero external imports
│   ├── model/                # side, order, feed-message (parser)
│   └── ports/                # order-feed-port (contract)
├── application/use-cases/    # get-recent-orders
└── adapters/
    ├── driving/http/         # express server + routes
    └── driven/feed/          # HTTP adapter against the Rust feed

```

## Running

1. Start the Rust feed (separate repo from the exercise, `nexus-coding-exercise-exchange/services`):
```bash
cd ../nexus-coding-exercise-exchange/services
cargo run -- --start-feed --num-accounts 20

```


2. Check that Rust is alive, without going through Node:
```bash
curl "http://127.0.0.1:3000/orders?n=3"

```


3. In another terminal, start this app:
```bash
npm install
npm start

```


4. Prove the end-to-end integration:
```bash
curl http://127.0.0.1:8080/health
curl "http://127.0.0.1:8080/feed/recent?n=5"

```


Success = the second call returns actual orders, with `side` `Buy`/`Sell` and valid symbols, already in the normalized shape (no longer the `{"New": {...}}` from serde).
5. Unit test the parser, without needing Rust running:
```bash
npm test

```



## Config

Environment variables (see `.env.example`):

* `PORT` — HTTP port for this app (default `8080`)
* `FEED_BASE_URL` — base URL of the Rust feed (default `[http://127.0.0.1:3000](http://127.0.0.1:3000)`)
* `POLL_INTERVAL_MS` — reserved for the future polling loop (default `300`)
