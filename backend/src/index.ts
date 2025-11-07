import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { authRouter } from './routes/auth';
import { usersRouter } from './routes/users';
import { profileRouter } from './routes/profile';
import { trialsRouter } from './routes/trials';
import { applicationsRouter } from './routes/applications';
import { messagesRouter } from './routes/messages';
import { notificationsRouter } from './routes/notifications';
import { uploadsRouter } from './routes/uploads';
import { paymentsRouter } from './routes/payments';
import { adminRouter } from './routes/admin';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/profile', profileRouter);
app.use('/api/trials', trialsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/admin', adminRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${PORT}`);
});


