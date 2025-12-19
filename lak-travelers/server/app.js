import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

// 🔹 Routes
import userRoutes from './routes/userRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// 🔹 Middlewares
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();
const __dirname = path.resolve();

/* =====================================================
   1️⃣ CORS Configuration (ස්ථාවර සැකසුම)
===================================================== */
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL, // Vercel frontend URL
  'https://lak-travelers-z1uk.vercel.app' // ඔබේ සැබෑ Vercel URL එක
];

app.use(
  cors({
    origin: function (origin, callback) {
      // origin නැති requests (උදා: Postman) allow කිරීමට !origin භාවිතා කරයි
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS Policy Error: Origin not allowed'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

/* =====================================================
   2️⃣ Global Middlewares
===================================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Helmet config for Cloudinary images
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, 
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/* =====================================================
   3️⃣ API Routes
===================================================== */
app.use('/api/users', userRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

/* =====================================================
   4️⃣ Static Files
===================================================== */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* =====================================================
   5️⃣ Root Route & Health Check
===================================================== */
app.get('/', (req, res) => {
  res.send('🚀 Lak Travelers API is running...');
});

app.get('/api/health', (req, res) => {
  res.json({ status: "API is healthy ✅" });
});

/* =====================================================
   6️⃣ Error Handling
===================================================== */
app.use(notFound);
app.use(errorHandler);

export default app;