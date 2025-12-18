import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

// Routes imports
import userRoutes from './routes/userRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; // Admin routes අමතක කරන්න එපා

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// 👇 1. CORS - Vercel සහ Localhost යන දෙකටම ගැලපෙන සේ
// (FRONTEND_URL එක .env එකේ ඇතුළත් කරන්න)
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : "http://localhost:5173", 
  credentials: true, // Cookies හුවමාරුවට අනිවාර්යයි
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 👇 2. Standard Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Cookies කියවීමට අත්‍යවශ්‍යයි

// Helmet security (පින්තූර පෙන්වීමට පහත settings අත්‍යවශ්‍යයි)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 👇 3. API Routes
app.use('/api/users', userRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// 👇 4. Static Files & Production Settings
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Route
app.get('/', (req, res) => {
  res.send('Lak Travelers API is running... 🚀');
});

// 👇 5. Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;