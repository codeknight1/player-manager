import { Router } from 'express';

export const uploadRouter = Router();

uploadRouter.post('/', async (_req, res) => {
  // Placeholder for S3/R2 integration
  res.json({ ok: true });
});





