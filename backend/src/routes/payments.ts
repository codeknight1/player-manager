import { Router } from 'express';

export const paymentsRouter = Router();

paymentsRouter.post('/checkout', async (_req, res) => {
  // Placeholder for Stripe integration
  res.json({ ok: true });
});



