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
 * 🚀 1. Body Parser Settings
 * Base64 පින්තූර සහ විශාල JSON දත්ත හුවමාරුවට අවසර ලබා දීම.
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

/**
 * 🛡️ 2. Security & Logging
 */
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * 🌐 3. CORS Configuration (දැන් 100% නිවැරදියි)
 * ඔබගේ Vercel Frontend එකට Backend එක සමඟ සම්බන්ධ වීමට මෙහිදී අවසර ලබා දෙයි.
 */
const allowedOrigins = [
  'http://localhost:5173',                  // Local Development සඳහා
  'https://lak-travelers.vercel.app',       // ඔබගේ ප්‍රධාන වෙබ් අඩවි ලිපිනය
  'https://lak-travelers-z1uk.vercel.app'    // අමතර Vercel ලිපිනය
];

app.use(cors({
  origin: function (origin, callback) {
    // origin එකක් නැති අවස්ථා (Mobile/Postman) සහ ලැයිස්තුවේ ඇති ලිපිනයන්ට අවසර දීම
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`🚨 CORS Blocked for: ${origin}`);
      callback(new Error('CORS Policy: Access Denied'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

/**
 * 🛠️ 4. API Routes
 * වැදගත්: Frontend එකෙන් Call කරන විට අනිවාර්යයෙන්ම '/api' කොටස ඇතුළත් කරන්න.
 * උදා: https://lak-travelers-api.onrender.com/api/users/send-otp
 */
app.use('/api/users', userRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);

// Static folders (පින්තූර ගබඩා කිරීමට)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// සේවාදායකය වැඩ කරනවාදැයි පරීක්ෂා කිරීමට (Health Check)
app.get('/', (req, res) => {
  res.status(200).send('Lak Travelers API is Live! 🚀');
});

/**
 * 🚨 5. Error Handling
 */
app.use(notFound);
app.use(errorHandler);

export default app;