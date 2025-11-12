import { Router } from 'express';
import { prisma } from '../services/prisma';

export const notificationsRouter = Router();

notificationsRouter.get('/', async (req, res) => {
  try {
    const { userId } = req.query as { userId?: string };
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const notifs = await prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    res.json(notifs);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load notifications' });
  }
});

notificationsRouter.post('/', async (req, res) => {
  try {
    const { userId, title, body } = req.body as any;
    const n = await prisma.notification.create({ data: { userId, title, body, read: false } });
    res.json(n);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

notificationsRouter.patch('/', async (req, res) => {
  try {
    const { id, read } = req.body as any;
    const n = await prisma.notification.update({ where: { id }, data: { read } });
    res.json(n);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});














