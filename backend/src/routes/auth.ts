import { Router } from 'express';
import { prisma } from '../services/prisma';
import { compare, hash } from 'bcryptjs';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    return res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    return res.status(500).json({ error: 'Auth failed' });
  }
});

authRouter.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body as { email?: string; password?: string; name?: string; role?: string };
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already in use' });
    const hashed = await hash(password, 10);
    const user = await prisma.user.create({ data: { email, name, role: (role as any) || 'PLAYER', password: hashed } });
    return res.status(201).json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed' });
  }
});


