import { createOrder } from './order.js';

export function parseFeedMessage(raw) {
  if (raw && typeof raw === 'object' && 'New' in raw) {
    const { id, timestamp, account, symbol, side, price, quantity } = raw.New;
    return {
      type: 'New',
      order: createOrder({ id, timestamp, account, symbol, side, price, quantity }),
    };
  }

  if (raw && typeof raw === 'object' && 'Cancel' in raw) {
    const { id, timestamp, account, target_id: targetId } = raw.Cancel;
    return { type: 'Cancel', id, timestamp, account, targetId };
  }

  throw new Error(`Unknown feed message shape: ${JSON.stringify(raw)}`);
}
