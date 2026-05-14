import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  "https://grocery-qcmn.vercel.app",
  "https://grocery-admin.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174"
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Static folder
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join_admin', () => {
    socket.join('admin_room');
    console.log('User joined admin room');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Make io accessible to our routes
app.set('io', io);

// Mount routers
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('FreshCart API is running...');
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
