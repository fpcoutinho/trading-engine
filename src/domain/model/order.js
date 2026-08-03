export function createOrder({ id, timestamp, account, symbol, side, price, quantity }) {
  return { id, timestamp, account, symbol, side, price, quantity };
}
