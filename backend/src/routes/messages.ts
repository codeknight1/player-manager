import { Router } from 'express';
import { prisma } from '../services/prisma';

export const messagesRouter = Router();

messagesRouter.get('/', async (req, res) => {
  try {
    const { userId } = req.query as { userId?: string };
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const messages = await prisma.message.findMany({
      where: { OR: [{ fromId: userId }, { toId: userId }] },
      orderBy: { createdAt: 'asc' },
      include: { from: true, to: true },
    });
    res.json(messages);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

messagesRouter.post('/', async (req, res) => {
  try {
    const { fromId, toId, content } = req.body as any;
    const msg = await prisma.message.create({ data: { fromId, toId, content } });
    res.json(msg);
  } catch (e) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});






