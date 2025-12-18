import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';

// Config load
dotenv.config();

const app = express();

// 🛠️ Middleware Setup
app.use(helmet()); 
app.use(morgan('dev')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🌐 CORS - ඔබගේ .env හි ඇති CLIENT_URL එක භාවිතා කරයි
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// 🗄️ MongoDB Connection logic
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Atlas Connected: ${conn.connection.host} ✅`);
  } catch (error) {
    console.error(`Database Error: ${error.message} ❌`);
    process.exit(1);
  }
};

// 🛤️ Basic API Test Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "API is healthy and running 🚀" });
});

// 🚨 Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5001;

// 🚀 Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started in ${process.env.NODE_ENV} mode on port ${PORT} 🚀`);
  });
});

export default app;