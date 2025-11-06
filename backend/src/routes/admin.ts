import { Router } from 'express';
import { prisma } from '../services/prisma';

export const adminRouter = Router();

adminRouter.get('/stats', async (_req, res) => {
  try {
    const [totalUsers, totalPlayers, totalAgents, totalAcademies, totalTrials, totalApplications, pendingVerifications] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'PLAYER' } }),
      prisma.user.count({ where: { role: 'AGENT' } }),
      prisma.user.count({ where: { role: 'ACADEMY' } }),
      prisma.trial.count(),
      prisma.application.count(),
      prisma.verification.count({ where: { status: 'PENDING' } }),
    ]);
    res.json({
      totalUsers,
      totalPlayers,
      totalAgents,
      totalAcademies,
      totalTrials,
      totalApplications,
      pendingVerifications,
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

adminRouter.get('/users', async (req, res) => {
  try {
    const role = req.query.role as string | undefined;
    const search = req.query.search as string | undefined;
    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { name: { contains: search } },
      ];
    }
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load users' });
  }
});

adminRouter.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        applications: { include: { trial: true } },
        verifications: true,
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load user' });
  }
});

adminRouter.patch('/users/:id', async (req, res) => {
  try {
    const { role, isActive, name } = req.body;
    const data: any = {};
    if (role !== undefined) data.role = role;
    if (isActive !== undefined) data.isActive = isActive;
    if (name !== undefined) data.name = name;
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data,
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});


adminRouter.get('/verifications', async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const where: any = {};
    if (status) where.status = status;
    const verifications = await prisma.verification.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(verifications);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load verifications' });
  }
});

adminRouter.patch('/verifications/:id', async (req, res) => {
  try {
    const { status, reviewedBy } = req.body;
    const data: any = {
      reviewedAt: new Date(),
    };
    if (status) data.status = status;
    if (reviewedBy) data.reviewedBy = reviewedBy;
    const updated = await prisma.verification.update({
      where: { id: req.params.id },
      data,
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update verification' });
  }
});

adminRouter.get('/analytics', async (_req, res) => {
  try {
    const [usersByRole, recentSignups, activeUsers] = await Promise.all([
      prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.user.count({ where: { isActive: true } }),
    ]);
    res.json({ usersByRole, recentSignups, activeUsers });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

