import { Router } from 'express';
import { prisma } from '../services/prisma';

export const trialsRouter = Router();

trialsRouter.get('/', async (req, res) => {
  try {
    const { creatorId } = req.query as { creatorId?: string };
    const where: any = {};
    if (creatorId) {
      where.createdById = creatorId;
    }
    const trials = await prisma.trial.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { createdBy: true },
    });
    res.json(trials);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load trials' });
  }
});

trialsRouter.post('/', async (req, res) => {
  try {
    const { title, city, date, fee, createdById } = req.body as {
      title?: string;
      city?: string;
      date?: string;
      fee?: number | string;
      createdById?: string;
    };
    if (!title || !city || !date || !createdById) {
      res.status(400).json({ error: 'title, city, date, and createdById are required' });
      return;
    }
    const parsedFee =
      typeof fee === 'number'
        ? fee
        : fee
        ? Number(fee)
        : 0;
    const t = await prisma.trial.create({
      data: {
        title,
        city,
        date: new Date(date),
        createdById,
        fee: Number.isFinite(parsedFee) ? parsedFee : 0,
      },
      include: { createdBy: true },
    });
    res.json(t);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create trial' });
  }
});


