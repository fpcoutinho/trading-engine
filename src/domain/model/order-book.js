import { Side } from './side.js';

export function createOrderBook() {
  return { buys: [], sells: [] };
}

function levelsFor(book, side) {
  return side === Side.BUY ? book.buys : book.sells;
}

function better(side) {
  return side === Side.BUY
    ? (a, b) => a.price > b.price
    : (a, b) => a.price < b.price;
}

// Price priority, FIFO within a price (new order at an existing price is
// appended after all existing orders at that price).
export function restOrder(book, order) {
  const list = levelsFor(book, order.side);
  const isBetter = better(order.side);
  const insertAt = list.findIndex((existing) => isBetter(order, existing));
  if (insertAt === -1) {
    list.push(order);
  } else {
    list.splice(insertAt, 0, order);
  }
}

// Removes a resting order (fully matched, or explicitly cancelled) from its
// side's list.
export function removeOrder(book, order) {
  const list = levelsFor(book, order.side);
  const index = list.indexOf(order);
  if (index !== -1) {
    list.splice(index, 1);
  }
}

export function bestOpposite(book, side) {
  const oppositeSide = side === Side.BUY ? Side.SELL : Side.BUY;
  return levelsFor(book, oppositeSide);
}
