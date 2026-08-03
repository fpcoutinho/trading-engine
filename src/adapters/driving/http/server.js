import express from 'express';
import { healthRoutes } from './routes/health.routes.js';
import { feedRoutes } from './routes/feed.routes.js';

export function createServer({ getRecentOrders }) {
  const app = express();

  app.use(healthRoutes());
  app.use(feedRoutes({ getRecentOrders }));

  return app;
}
