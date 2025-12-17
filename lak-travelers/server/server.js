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

// 2. App Initialize
const app = express();

// 3. Middleware Setup (UPDATED CORS) 🔒
// මෙතන ඔබේ Frontend URL එක සහ localhost දෙකම ඇතුලත් කර ඇත.
const allowedOrigins = [
  "http://localhost:5173",                 // Local Development
  "https://lak-travelers-z1uk.vercel.app", // Your Vercel Frontend (From Screenshot)
  "https://lak-travelers.vercel.app"       // Main Vercel Domain (Just in case)
];

app.use(cors({ 
  origin: (origin, callback) => {
    // Mobile Apps හෝ Postman වැනි tools වලින් එන ඉල්ලීම් (origin නැති) භාරගන්න
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Cookies හුවමාරු කරගැනීමට මෙය අනිවාර්යයි
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Static Path Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 5. Image Uploads Folder (Static)
// සටහන: Vercel හිදී මෙය වැඩ කරන්නේ තාවකාලිකව පමණි. 
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// 6. API Routes
app.use('/api/users', userRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes); // 👈 මෙය තිබීම අනිවාර්යයි (404 එන්නේ මෙය නැති වුවහොත්ය)

// 7. Root Route
app.get('/', (req, res) => {
  res.send('API is running successfully! 🚀');
});

// 8. Error Handling
app.use(notFound);
app.use(errorHandler);

// 9. Server Start
const PORT = process.env.PORT || 5001;

// Vercel සඳහා server start කිරීමේ logic එක
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;