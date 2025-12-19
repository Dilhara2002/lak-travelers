import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'path';

// Routes imports
import userRoutes from './routes/userRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Middlewares
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
const app = express();
const __dirname = path.resolve();

// -----------------------
// 1️⃣ Middleware
// -----------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// -----------------------
// 2️⃣ CORS
// -----------------------
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'https://lak-travelers-z1uk.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS Policy Error'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
  })
);

// Safe preflight handling for Express 5+
app.options(/.*/, (req, res) => res.sendStatus(200));

// -----------------------
// 3️⃣ Database
// -----------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then((conn) => console.log(`MongoDB Connected: ${conn.connection.host} ✅`))
  .catch((err) => console.error(`Database Error: ${err.message} ❌`));

// -----------------------
// 4️⃣ Routes
// -----------------------
app.get('/api/health', (req, res) => res.json({ status: 'API is healthy ✅' }));

app.use('/api/users', userRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req, res) => {
  res.send('Lak Travelers API is running... 🚀');
});

// -----------------------
// 5️⃣ Error Handling
// -----------------------
app.use(notFound);
app.use(errorHandler);

// -----------------------
// 6️⃣ Server
// -----------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} 🚀`);
});

export default app;
