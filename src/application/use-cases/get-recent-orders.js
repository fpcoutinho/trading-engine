import { parseFeedMessage } from '../../domain/model/feed-message.js';

export function makeGetRecentOrders({ orderFeed }) {
  return async function getRecentOrders(n) {
    const rawMessages = await orderFeed.getRecent(n);
    return rawMessages.map(parseFeedMessage);
  };
}
