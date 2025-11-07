import { Router } from 'express';
import { prisma } from '../services/prisma';

export const profileRouter = Router();

profileRouter.get('/', async (req, res) => {
  try {
    const userId = req.query.userId as string | undefined;
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ error: 'Not found' });
      return res.json(user);
    }
    const users = await prisma.user.findMany();
    return res.json(users);
  } catch (e) {
    return res.status(500).json({ error: 'Failed to fetch profile(s)' });
  }
});

profileRouter.post('/', async (req, res) => {
  try {
    const { userId, name, profileData } = req.body as any;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        profileData: profileData ? JSON.stringify(profileData) : undefined,
      },
    });
    return res.json(updated);
  } catch (e) {
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});





