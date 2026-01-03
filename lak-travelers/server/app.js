import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

// Routes Imports
import userRoutes from './routes/userRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();
const __dirname = path.resolve();

/**
 * 🚀 1. Body Parser Limits
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * 🌐 2. CORS Configuration (නිවැරදි කරන ලදී)
 */
const allowedOrigins = [
  'http://localhost:5173',
  'https://lak-travelers.vercel.app',    // ඔබේ ප්‍රධාන Vercel ලින්ක් එක
  'https://lak-travelers-z1uk.vercel.app' // අමතර ලින්ක් එක
];

app.use(cors({
  origin: function (origin, callback) {
    // origin නැති අවස්ථා (Mobile apps හෝ Postman) සහ ලැයිස්තුවේ ඇති ලින්ක් වලට අවසර දීම
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin); // කුමන ලින්ක් එකද Block වුණේ කියා බලා ගැනීමට
      callback(new Error('CORS Policy Error'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

/**
 * 🛠️ 3. API Routes
 */
app.use('/api/users', userRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/', (req, res) => {
  res.send('Lak Travelers API is Live! 🚀');
});

/**
 * 🚨 4. Error Handling Middleware
 */
app.use(notFound);
app.use(errorHandler);

export default app;