export const Side = Object.freeze({
  BUY: 'Buy',
  SELL: 'Sell',
});

export function isValidSide(value) {
  return value === Side.BUY || value === Side.SELL;
}
