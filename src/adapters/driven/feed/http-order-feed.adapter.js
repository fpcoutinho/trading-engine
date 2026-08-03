export function createHttpOrderFeedAdapter({ baseUrl }) {
  return {
    async getRecent(n) {
      const url = new URL('/orders', baseUrl);
      url.searchParams.set('n', String(n));

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Order feed responded ${response.status}`);
      }
      return response.json();
    },
  };
}
