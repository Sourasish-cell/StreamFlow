import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import songsRoutes from './routes/songs';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/songs', songsRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
}); 