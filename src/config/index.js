export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 8080,
  feedBaseUrl: process.env.FEED_BASE_URL ?? 'http://127.0.0.1:3000',
  pollIntervalMs: process.env.POLL_INTERVAL_MS ? Number(process.env.POLL_INTERVAL_MS) : 300,
};
