import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';

config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
import agentRoutes from './routes/agent.routes';
import authRoutes from './routes/auth.routes';

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Svasthya Backend is running' });
});

app.use('/api/agent', agentRoutes);
app.use('/api/auth', authRoutes);

export default app;
