import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Routes Imports
import userRoutes from './routes/userRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// 1. Configs & Database
dotenv.config();
connectDB();

// 2. App Initialize (මුලින්ම කරන්න ඕනේ මේකයි)
const app = express();

// 3. Middleware Setup
// Vercel එකේ deploy කරනකොට Frontend URL එක හරියටම දෙන්න ඕනේ.
// දැනට '*' දැම්මොත් ඕනෑම තැනක ඉඳන් Access කරන්න පුළුවන් (ලේසියි).
app.use(cors({ 
  origin: ["http://localhost:5173", "https://your-frontend-url.vercel.app"], 
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Static Path Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 5. Image Uploads Folder (Static)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// 6. API Routes
app.use('/api/users', userRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// 7. Root Route (Home Page Error එක නැති කරන්න)
app.get('/', (req, res) => {
  res.send('API is running successfully! 🚀');
});

// 8. Error Handling
app.use(notFound);
app.use(errorHandler);

// 9. Server Start (Vercel සඳහා export කිරීම අනිවාර්යයි)
const PORT = process.env.PORT || 5001;

// Vercel එකේදි server එක start කරන්න එපා, local දුවද්දී විතරක් start කරන්න
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;