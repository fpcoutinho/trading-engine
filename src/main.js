import { config } from './config/index.js';
import { createHttpOrderFeedAdapter } from './adapters/driven/feed/http-order-feed.adapter.js';
import { makeGetRecentOrders } from './application/use-cases/get-recent-orders.js';
import { makeOrderFeedPoller } from './application/use-cases/run-order-feed-poller.js';
import { createServer } from './adapters/driving/http/server.js';

const orderFeed = createHttpOrderFeedAdapter({ baseUrl: config.feedBaseUrl });
const getRecentOrders = makeGetRecentOrders({ orderFeed });
const app = createServer({ getRecentOrders });

function printMatch(match) {
  console.log(
    `MATCH  ${match.symbol}  qty=${match.quantity}  price=${match.price}  ` +
    `buy#${match.buyOrderId}(acct ${match.buyAccount})  x  ` +
    `sell#${match.sellOrderId}(acct ${match.sellAccount})  ` +
    `@ ${new Date(match.matchedAt).toISOString()}`
  );
}

const { poll } = makeOrderFeedPoller({ orderFeed, onMatch: printMatch });

app.listen(config.port, () => {
  console.log(`trading-engine listening on http://127.0.0.1:${config.port}`);
});

setInterval(() => { poll(); }, config.pollIntervalMs);
poll();
