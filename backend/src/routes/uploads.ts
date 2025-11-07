import { Router } from 'express';

import { prisma } from '../services/prisma';

function normalizeType(value: string | null | undefined) {
  const upper = (value ?? '').toUpperCase();
  if (upper === 'VIDEO' || upper === 'CERTIFICATE' || upper === 'ACHIEVEMENT') {
    return upper as 'VIDEO' | 'CERTIFICATE' | 'ACHIEVEMENT';
  }
  throw new Error('Invalid upload type');
}

export const uploadsRouter = Router();

uploadsRouter.get('/', async (req, res) => {
  const userId = req.query.userId as string | undefined;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const uploads = await prisma.upload.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ uploads });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch uploads' });
  }
});

uploadsRouter.put('/', async (req, res) => {
  const { userId, uploads } = req.body ?? {};

  if (!userId || !Array.isArray(uploads)) {
    return res.status(400).json({ error: 'userId and uploads array are required' });
  }

  try {
    const now = new Date();

    await prisma.$transaction([
      prisma.upload.deleteMany({ where: { userId } }),
      prisma.upload.createMany({
        data: uploads.map((upload: any) => ({
          id: upload.id ?? undefined,
          userId,
          name: upload.name ?? '',
          type: normalizeType(upload.type),
          url: upload.url ?? null,
          thumbnail: upload.thumbnail ?? null,
          createdAt: upload.createdAt ? new Date(upload.createdAt) : now,
        })),
        skipDuplicates: true,
      }),
    ]);

    const saved = await prisma.upload.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ uploads: saved });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to save uploads' });
  }
});

uploadsRouter.delete('/', async (req, res) => {
  const id = req.query.id as string | undefined;
  const userId = req.query.userId as string | undefined;

  if (!id || !userId) {
    return res.status(400).json({ error: 'id and userId are required' });
  }

  try {
    await prisma.upload.deleteMany({ where: { id, userId } });

    const uploads = await prisma.upload.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ uploads });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete upload' });
  }
});


