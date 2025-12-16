import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import bookingRoutes from './routes/bookingRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';

// Routes සහ Middleware import කරගැනීම
import uploadRoutes from './routes/uploadRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// 👇 1. CORS - Frontend (5173) ට සම්පූර්ණ අවසරය දෙනවා
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,               
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 👇 2. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ⚠️ වැදගත් වෙනස: Helmet මගින් පින්තූර Block කිරීම වැළැක්වීම
// (Cross-Origin-Resource-Policy එක ලිහිල් කරනවා)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(morgan('dev'));

// 👇 3. Routes
app.use('/api/users', userRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/vehicles', vehicleRoutes);

// 👇 4. Static Folder (Uploads ෆෝල්ඩර් එක Public කිරීම)
// path.resolve() මගින් වත්මන් ෆෝල්ඩරය සොයාගනී
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Route
app.get('/', (req, res) => {
  res.send('API is running... 🚀');
});

// 👇 5. Error Handling
app.use(notFound);
app.use(errorHandler);



export default app;