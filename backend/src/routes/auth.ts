import { Router } from 'express';
import { compare, hash } from 'bcryptjs';
import { supabase } from '../services/supabase';
import { prisma } from '../services/prisma';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const normalizedEmail = email.trim().toLowerCase();
    let user:
      | {
          id: string;
          email: string;
          password: string | null;
          name: string | null;
          role: string;
          isActive: boolean;
        }
      | null = null;
    if (supabase) {
      const { data, error } = await supabase
        .from('User')
        .select('id,email,password,name,role,isActive')
        .eq('email', normalizedEmail)
        .maybeSingle();
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      user = data ?? null;
    } else {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: { id: true, email: true, password: true, name: true, role: true, isActive: true },
      });
    }
    if (!user || !user.password) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.isActive) return res.status(403).json({ error: 'Account is inactive' });
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
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedRole = typeof role === 'string' && role.trim().length > 0 ? role.trim().toUpperCase() : 'PLAYER';
    if (!['PLAYER', 'AGENT', 'ACADEMY', 'ADMIN'].includes(normalizedRole)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    if (supabase) {
      const { data: existing, error: existingError } = await supabase
        .from('User')
        .select('id')
        .eq('email', normalizedEmail)
        .maybeSingle();
      if (existingError && existingError.code !== 'PGRST116') {
        throw existingError;
      }
      if (existing) return res.status(409).json({ error: 'Email already in use' });
    } else {
      const existing = await prisma.user.findUnique({ where: { email: normalizedEmail }, select: { id: true } });
      if (existing) return res.status(409).json({ error: 'Email already in use' });
    }
    const hashed = await hash(password, 10);
    if (supabase) {
      const { data: user, error: insertError } = await supabase
        .from('User')
        .insert({
          email: normalizedEmail,
          name: typeof name === 'string' ? name.trim() : null,
          role: normalizedRole,
          password: hashed,
          isActive: true,
          profileData: null,
        })
        .select('id,email,name,role')
        .single();
      if (insertError) {
        throw insertError;
      }
      return res.status(201).json({ id: user?.id, email: user?.email, name: user?.name, role: user?.role });
    } else {
      const user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: typeof name === 'string' ? name.trim() : null,
          role: normalizedRole as any,
          password: hashed,
        },
        select: { id: true, email: true, name: true, role: true },
      });
      return res.status(201).json(user);
    }
  } catch (err) {
    console.error('auth/register failed', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Registration failed' });
  }
});


