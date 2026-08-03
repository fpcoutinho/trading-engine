# trading-engine

App Node que consome o feed de ordens simulado (Rust) do exercício Nexus e expõe as ordens em
formato normalizado via HTTP. Arquitetura hexagonal: domínio puro no centro, ports como contratos,
adapters nas bordas (`driving` = endpoints que a gente expõe, `driven` = chamadas para endpoints do feed).

## Estrutura

```
src/
├── main.js                   # composition root
├── config/index.js           # env vars + defaults
├── domain/                   # zero imports externos
│   ├── model/                # side, order, feed-message (parser)
│   └── ports/                # order-feed-port (contrato)
├── application/use-cases/    # get-recent-orders
└── adapters/
    ├── driving/http/         # express server + rotas
    └── driven/feed/          # adapter HTTP contra o feed Rust
```

## Rodando

1. Suba o feed Rust (repo separado do exercício, `nexus-coding-exercise-exchange/services`):
   ```bash
   cd ../nexus-coding-exercise-exchange/services
   cargo run -- --start-feed --num-accounts 20
   ```

2. Confira que o Rust está vivo, sem passar pelo Node:
   ```bash
   curl "http://127.0.0.1:3000/orders?n=3"
   ```

3. Em outro terminal, suba este app:
   ```bash
   npm install
   npm start
   ```

4. Prove a integração ponta a ponta:
   ```bash
   curl http://127.0.0.1:8080/health
   curl "http://127.0.0.1:8080/feed/recent?n=5"
   ```
   Sucesso = a segunda chamada devolve ordens reais, com `side` `Buy`/`Sell` e symbols válidos, já
   no shape normalizado (não mais o `{"New": {...}}` do serde).

5. Teste unitário do parser, sem precisar do Rust rodando:
   ```bash
   npm test
   ```

## Config

Variáveis de ambiente (ver `.env.example`):

- `PORT` — porta HTTP deste app (default `8080`)
- `FEED_BASE_URL` — base URL do feed Rust (default `http://127.0.0.1:3000`)
- `POLL_INTERVAL_MS` — reservado para o polling loop futuro (default `300`)
