import { Router } from 'express';
import { prisma } from '../services/prisma';

export const applicationsRouter = Router();

applicationsRouter.get('/', async (req, res) => {
  try {
    const { userId, trialId } = req.query as { userId?: string; trialId?: string };
    const where: any = {};
    if (userId) where.userId = userId;
    if (trialId) where.trialId = trialId;
    const apps = await prisma.application.findMany({ where, include: { user: true, trial: true } });
    res.json(apps);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load applications' });
  }
});

applicationsRouter.post('/', async (req, res) => {
  try {
    const { userId, trialId, status } = req.body as any;
    const app = await prisma.application.create({ data: { userId, trialId, status } });
    res.json(app);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create application' });
  }
});

applicationsRouter.patch('/', async (req, res) => {
  try {
    const { id, status } = req.body as any;
    const app = await prisma.application.update({ where: { id }, data: { status } });
    res.json(app);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update application' });
  }
});



