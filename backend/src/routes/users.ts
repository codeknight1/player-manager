import { Router } from 'express';
import { prisma } from '../services/prisma';

export const usersRouter = Router();

usersRouter.get('/', async (req, res) => {
  try {
    const role = req.query.role as string | undefined;
    const users = await prisma.user.findMany({
      where: role ? { role: role as any } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load users' });
  }
});








