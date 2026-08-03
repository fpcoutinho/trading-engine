/**
 * @typedef {Object} OrderFeedPort
 * @property {(n: number) => Promise<object[]>} getRecent - returns the last n raw feed messages
 */

export function assertOrderFeedPort(candidate) {
  if (!candidate || typeof candidate.getRecent !== 'function') {
    throw new Error('OrderFeedPort implementation must provide getRecent(n)');
  }
  return candidate;
}
