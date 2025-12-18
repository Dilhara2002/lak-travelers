import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// 1. Cloudinary වින්‍යාසගත කිරීම (Configuration)
// ඔබේ Vercel Dashboard එකේ මේ Environment Variables ඇති බව තහවුරු කරගන්න
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Storage Engine එක සැකසීම
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lak-travelers-uploads', // Cloudinary ගිණුමේ සාදනු ලබන ෆෝල්ඩරය
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }], // පින්තූරය විශාල වැඩි නම් ස්වයංක්‍රීයව ප්‍රමාණය සකසයි
  },
});

// 3. Middleware එක සකස් කිරීම
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // උපරිම ගොනු ප්‍රමාණය 5MB ලෙස සීමා කළා
});

// 4. POST Route - පින්තූරය Upload කර URL එක ලබා ගැනීම
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Cloudinary මගින් ලබා දෙන ස්ථිර URL එක Frontend එකට යවයි
    res.status(200).send(req.file.path);
    
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

export default router;