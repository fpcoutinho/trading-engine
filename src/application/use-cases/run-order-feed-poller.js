import { parseFeedMessage } from '../../domain/model/feed-message.js';
import { createMarketRegistry, cancelOrder } from '../../domain/model/market-registry.js';
import { matchOrder } from '../../domain/services/match-order.js';

export function makeOrderFeedPoller({ orderFeed, onMatch, onError = console.error, batchSize = 50 }) {
  const registry = createMarketRegistry();
  let lastSeenId = 0;
  let isPolling = false;

  async function poll() {
    if (isPolling) return;
    isPolling = true;
    try {
      let raw;
      try {
        raw = await orderFeed.getRecent(batchSize);
      } catch (err) {
        onError(err);
        return;
      }

      const withId = raw
        .map(parseFeedMessage)
        .map((m) => ({ m, id: m.type === 'New' ? m.order.id : m.id }))
        .sort((a, b) => a.id - b.id);

      for (const { m, id } of withId) {
        if (id <= lastSeenId) continue;
        lastSeenId = id;

        if (m.type === 'New') {
          matchOrder(registry, m.order).forEach(onMatch);
        } else if (m.type === 'Cancel') {
          cancelOrder(registry, m.targetId);
        }
      }
    } finally {
      isPolling = false;
    }
  }

  return { registry, poll };
}
