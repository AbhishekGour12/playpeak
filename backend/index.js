import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/AuthRoutes.js';
import attendanceRoutes from './routes/AttendanceRoutes.js';
import userRoutes from './routes/UserRoutes.js';
import seatRoutes from './routes/SeatRoutes.js';
import serviceRoutes from './routes/ServiceRoutes.js';
import paymentRoutes from './routes/PaymentRoutes.js';
import athleteRoutes from './routes/AthleteRoutes.js';
import coachRoutes from './routes/CoachRoutes.js';
import tournamentRoutes from './routes/TournamentRoutes.js';
import physioRoutes from './routes/PhysioRoutes.js';
import assessmentRoutes from './routes/AssessmentRoutes.js';
import inventoryRoutes from './routes/InventoryRoutes.js';
import membershipRoutes from './routes/MembershipRoutes.js';
import inquiryRoutes from './routes/InquiryRoutes.js';
import statsRoutes from './routes/StatsRoutes.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('⚡ Socket client connected to PlayPeak Arena:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔌 Socket client disconnected:', socket.id);
  });
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Attach io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Register API Routes (Mounted on both /api/... and /... for seamless proxy/Vercel compatibility)
const routes = [
  { path: 'auth', handler: authRoutes },
  { path: 'attendance', handler: attendanceRoutes },
  { path: 'users', handler: userRoutes },
  { path: 'seats', handler: seatRoutes },
  { path: 'services', handler: serviceRoutes },
  { path: 'payments', handler: paymentRoutes },
  { path: 'athletes', handler: athleteRoutes },
  { path: 'coaches', handler: coachRoutes },
  { path: 'tournaments', handler: tournamentRoutes },
  { path: 'physio', handler: physioRoutes },
  { path: 'assessments', handler: assessmentRoutes },
  { path: 'inventory', handler: inventoryRoutes },
  { path: 'memberships', handler: membershipRoutes },
  { path: 'inquiries', handler: inquiryRoutes },
  { path: 'stats', handler: statsRoutes }
];

routes.forEach(({ path, handler }) => {
  app.use(`/api/${path}`, handler);
  app.use(`/${path}`, handler);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'PlayPeak Sports Academy Backend API & MongoDB Atlas is fully operational',
    timestamp: new Date().toISOString(),
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'connecting'
  });
});

app.get('/', (req, res) => {
  res.send('PlayPeak Sports Academy API Server is Running on MongoDB Atlas.');
});

// Database connection
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected successfully to PlayPeak Sports Cluster');
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

server.listen(PORT, () => {
  console.log(`🚀 PlayPeak Sports Academy Server is listening on port ${PORT}`);
});