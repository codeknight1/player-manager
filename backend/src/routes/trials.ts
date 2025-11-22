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
  } catch (e: any) {
    console.error('Error loading trials:', e);
    res.status(500).json({ 
      error: 'Failed to load trials',
      message: e?.message || 'Unknown error'
    });
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
    
    console.log('Creating trial with data:', { title, city, date, fee, createdById });
    
    if (!title || !city || !date || !createdById) {
      res.status(400).json({ 
        error: 'Missing required fields',
        details: { 
          title: !!title, 
          city: !!city, 
          date: !!date, 
          createdById: !!createdById 
        }
      });
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
    
    console.log('Trial created successfully:', t.id);
    res.json(t);
  } catch (e: any) {
    console.error('Error creating trial:', e);
    const errorMessage = e?.message || 'Failed to create trial';
    const errorCode = e?.code || 'UNKNOWN_ERROR';
    res.status(500).json({ 
      error: 'Failed to create trial',
      message: errorMessage,
      code: errorCode,
      details: process.env.NODE_ENV === 'development' ? e?.stack : undefined
    });
  }
});


