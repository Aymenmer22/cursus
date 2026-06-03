import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import connectDB from './config/database.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

connectDB();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);
  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.set('io', io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

export default app;
