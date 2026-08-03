import { config } from './config/index.js';
import { createHttpOrderFeedAdapter } from './adapters/driven/feed/http-order-feed.adapter.js';
import { makeGetRecentOrders } from './application/use-cases/get-recent-orders.js';
import { createServer } from './adapters/driving/http/server.js';

const orderFeed = createHttpOrderFeedAdapter({ baseUrl: config.feedBaseUrl });
const getRecentOrders = makeGetRecentOrders({ orderFeed });
const app = createServer({ getRecentOrders });

app.listen(config.port, () => {
  console.log(`trading-engine listening on http://127.0.0.1:${config.port}`);
});
