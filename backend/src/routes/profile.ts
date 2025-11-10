import { Router } from 'express';
import { supabase } from '../services/supabase';
import { prisma } from '../services/prisma';

export const profileRouter = Router();

profileRouter.get('/', async (req, res) => {
  try {
    const userId = req.query.userId as string | undefined;
    if (userId) {
      if (supabase) {
        const { data: user, error } = await supabase
          .from('User')
          .select('id,email,name,role,isActive,profileData,createdAt,updatedAt')
          .eq('id', userId)
          .maybeSingle();
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        if (!user) return res.status(404).json({ error: 'Not found' });
        const { data: uploads, error: uploadsError } = await supabase
          .from('Upload')
          .select('*')
          .eq('userId', userId)
          .order('createdAt', { ascending: false });
        if (uploadsError) {
          throw uploadsError;
        }
        return res.json({
          ...user,
          profile: user.profileData ?? null,
          uploads: uploads ?? [],
        });
      } else {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { uploads: { orderBy: { createdAt: 'desc' } } },
        });
        if (!user) return res.status(404).json({ error: 'Not found' });
        return res.json({
          ...user,
          profile: user.profileData ? JSON.parse(user.profileData) : null,
          uploads: user.uploads,
        });
      }
    }
    if (supabase) {
      const { data: users, error } = await supabase.from('User').select('*');
      if (error) {
        throw error;
      }
      return res.json(users ?? []);
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
    const updates: Record<string, any> = {};
    if (name !== undefined) {
      updates.name = name;
    }
    if (profileData !== undefined) {
      updates.profileData = profileData;
    }
    if (supabase) {
      const { data, error } = await supabase
        .from('User')
        .update(updates)
        .eq('id', userId)
        .select('*')
        .maybeSingle();
      if (error) {
        throw error;
      }
      return res.json(data);
    }
    const data = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(updates.name !== undefined ? { name: updates.name } : {}),
        ...(updates.profileData !== undefined
          ? { profileData: typeof updates.profileData === 'string' ? updates.profileData : JSON.stringify(updates.profileData) }
          : {}),
      },
    });
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});






