// backend/src/app.js
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import meRouter from './routes/me.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// mount routers - make sure these imports resolve to Router instances
app.use('/api/auth', authRouter);
app.use('/api/me', meRouter);

export default app;
