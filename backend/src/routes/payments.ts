import { Router } from 'express';
import { prisma } from '../services/prisma';

export const paymentsRouter = Router();

paymentsRouter.get('/', async (req, res) => {
  try {
    const { userId, trialId, status } = req.query as { userId?: string; trialId?: string; status?: string };
    const where: any = {};
    if (userId) where.userId = userId;
    if (trialId) where.trialId = trialId;
    if (status) where.status = status.toUpperCase();
    const payments = await prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { trial: { include: { createdBy: true } } },
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load payments' });
  }
});

paymentsRouter.post('/', async (req, res) => {
  try {
    const { userId, trialId, amount, currency } = req.body as { userId?: string; trialId?: string; amount?: number; currency?: string };
    if (!userId || !trialId) {
      res.status(400).json({ error: 'userId and trialId are required' });
      return;
    }
    const payment = await prisma.payment.upsert({
      where: {
        userId_trialId: {
          userId,
          trialId,
        },
      },
      update: {
        amount: typeof amount === 'number' ? amount : undefined,
        currency: currency ? currency.toUpperCase() : undefined,
      },
      create: {
        userId,
        trialId,
        amount: typeof amount === 'number' ? amount : 0,
        currency: currency ? currency.toUpperCase() : 'USD',
      },
      include: { trial: { include: { createdBy: true } } },
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

paymentsRouter.patch('/', async (req, res) => {
  try {
    const { id, status } = req.body as { id?: string; status?: string };
    if (!id || !status) {
      res.status(400).json({ error: 'id and status are required' });
      return;
    }
    const payment = await prisma.payment.update({
      where: { id },
      data: { status: status.toUpperCase() },
      include: { trial: { include: { createdBy: true } } },
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment' });
  }
});