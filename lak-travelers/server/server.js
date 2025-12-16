import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url'; // 👈 Static folder path හදන්න ඕන නිසා
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Routes Imports
import userRoutes from './routes/userRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js'; // 👈 Upload Route එක ආපහු දැම්මා

dotenv.config();
connectDB();

const app = express();

// CORS Configuration
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// __dirname setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes); // 👈 Upload Route එක Mount කළා

// 👇 Image Display වෙන්න මේක අනිවාර්යයෙන්ම ඕනේ (Static Folder)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001; // Render එක දෙන Port එක හෝ 5001 ගන්න
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


export default app;