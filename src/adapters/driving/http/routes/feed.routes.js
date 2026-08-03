import { Router } from 'express';

export function feedRoutes({ getRecentOrders }) {
  const router = Router();

  router.get('/feed/recent', async (req, res, next) => {
    try {
      const n = req.query.n ? Number(req.query.n) : 10;
      const messages = await getRecentOrders(n);
      res.json(messages);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
