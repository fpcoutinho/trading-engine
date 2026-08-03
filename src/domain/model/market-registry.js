import { createOrderBook, restOrder, removeOrder } from './order-book.js';

const KNOWN_SYMBOLS = ['BTC-USDC', 'ETH-USDC', 'NEX-USDC'];

export function createMarketRegistry(symbols = KNOWN_SYMBOLS) {
  const books = new Map(symbols.map((symbol) => [symbol, createOrderBook()]));
  return { books, byId: new Map() };
}

// Returns the book for a symbol, creating one on the fly if an order arrives
// for a market outside the known list (defensive, not expected in practice).
export function getBook(registry, symbol) {
  let book = registry.books.get(symbol);
  if (!book) {
    book = createOrderBook();
    registry.books.set(symbol, book);
  }
  return book;
}

// Rests an order in its market's book and indexes it by id for instant cancel.
export function registerResting(registry, order) {
  restOrder(getBook(registry, order.symbol), order);
  registry.byId.set(order.id, order);
}

// Removes an order from its market's book and the id index (used both when
// an order is fully matched, and on explicit cancel).
export function removeResting(registry, order) {
  removeOrder(getBook(registry, order.symbol), order);
  registry.byId.delete(order.id);
}

// O(1) id -> order lookup across all markets. No-op (returns null) if the id
// isn't resting -- already matched, already cancelled, or unknown.
export function cancelOrder(registry, targetId) {
  const order = registry.byId.get(targetId);
  if (!order) return null;
  removeResting(registry, order);
  return order;
}
