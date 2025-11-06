import { Router } from 'express';
import { prisma } from '../services/prisma';

export const trialsRouter = Router();

trialsRouter.get('/', async (_req, res) => {
  try {
    const trials = await prisma.trial.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(trials);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load trials' });
  }
});

trialsRouter.post('/', async (req, res) => {
  try {
    const { title, city, date } = req.body as any;
    const t = await prisma.trial.create({ data: { title, city, date: new Date(date) } });
    res.json(t);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create trial' });
  }
});


