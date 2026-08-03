import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFeedMessage } from '../src/domain/model/feed-message.js';

test('parses a New message', () => {
  const raw = {
    New: {
      id: 42,
      timestamp: 1753000000000,
      account: 3,
      symbol: 'ETH-USDC',
      side: 'Buy',
      price: 100.25,
      quantity: 5.0,
    },
  };

  const result = parseFeedMessage(raw);

  assert.equal(result.type, 'New');
  assert.equal(result.order.id, 42);
  assert.equal(result.order.side, 'Buy');
  assert.equal(result.order.symbol, 'ETH-USDC');
  assert.equal(result.order.price, 100.25);
});

test('parses a Cancel message', () => {
  const raw = {
    Cancel: {
      id: 57,
      timestamp: 1753000004000,
      account: 3,
      target_id: 42,
    },
  };

  const result = parseFeedMessage(raw);

  assert.equal(result.type, 'Cancel');
  assert.equal(result.id, 57);
  assert.equal(result.targetId, 42);
});

test('throws on an unknown message shape', () => {
  assert.throws(() => parseFeedMessage({ Trade: {} }));
});
