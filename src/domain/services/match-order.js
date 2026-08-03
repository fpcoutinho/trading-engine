import { Side } from '../model/side.js';
import { bestOpposite } from '../model/order-book.js';
import { getBook, registerResting, removeResting } from '../model/market-registry.js';

function crosses(incoming, maker) {
  return incoming.side === Side.BUY
    ? incoming.price >= maker.price
    : incoming.price <= maker.price;
}

/**
 * @returns {Match[]} where Match = { symbol, price, quantity, buyOrderId,
 *   buyAccount, sellOrderId, sellAccount, matchedAt }
 *   price is always the maker's (resting order's) price.
 */
export function matchOrder(registry, incomingOrder, now = Date.now) {
  const incoming = { ...incomingOrder, remainingQty: incomingOrder.quantity };
  const book = getBook(registry, incoming.symbol);
  const restingList = bestOpposite(book, incoming.side);

  const matches = [];
  let i = 0;
  while (i < restingList.length && incoming.remainingQty > 0) {
    const maker = restingList[i];
    if (!crosses(incoming, maker)) break;

    if (maker.account === incoming.account) {
      i += 1;
      continue;
    }

    const quantity = Math.min(incoming.remainingQty, maker.remainingQty);
    const buy = incoming.side === Side.BUY ? incoming : maker;
    const sell = incoming.side === Side.BUY ? maker : incoming;

    matches.push({
      symbol: incoming.symbol,
      price: maker.price,
      quantity,
      buyOrderId: buy.id,
      buyAccount: buy.account,
      sellOrderId: sell.id,
      sellAccount: sell.account,
      matchedAt: now(),
    });

    incoming.remainingQty -= quantity;
    maker.remainingQty -= quantity;

    if (maker.remainingQty === 0) {
      removeResting(registry, maker);
    } else {
      i += 1;
    }
  }

  if (incoming.remainingQty > 0) {
    registerResting(registry, incoming);
  }

  return matches;
}
