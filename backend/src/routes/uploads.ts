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
    const payloads = uploads.map((raw: any) => {
      const id = typeof raw.id === 'string' && raw.id.trim().length > 0 ? raw.id.trim() : undefined;
      const name = typeof raw.name === 'string' ? raw.name : '';
      const type = normalizeType(typeof raw.type === 'string' ? raw.type : '');
      const url = typeof raw.url === 'string' && raw.url.trim().length > 0 ? raw.url : null;
      const thumbnail = typeof raw.thumbnail === 'string' && raw.thumbnail.trim().length > 0 ? raw.thumbnail : null;
      const createdAt = raw.createdAt ? new Date(raw.createdAt) : now;
      return { id, name, type, url, thumbnail, createdAt };
    });

    await prisma.$transaction(async (tx) => {
      const existing = await tx.upload.findMany({
        where: { userId },
        select: { id: true },
      });

      const existingIds = new Set(existing.map((item) => item.id));
      const seenIds = new Set<string>();

      for (const entry of payloads) {
        if (entry.id && seenIds.has(entry.id)) {
          continue;
        }

        if (entry.id && existingIds.has(entry.id)) {
          await tx.upload.update({
            where: { id: entry.id },
            data: {
              name: entry.name,
              type: entry.type,
              url: entry.url,
              thumbnail: entry.thumbnail,
              createdAt: entry.createdAt,
            },
          });
          existingIds.delete(entry.id);
        } else {
          const data: any = {
            userId,
            name: entry.name,
            type: entry.type,
            url: entry.url,
            thumbnail: entry.thumbnail,
            createdAt: entry.createdAt,
          };

          if (entry.id) {
            data.id = entry.id;
          }

          await tx.upload.create({ data });
        }

        if (entry.id) {
          seenIds.add(entry.id);
        }
      }
    });

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


