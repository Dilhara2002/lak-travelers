import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// 1. Cloudinary Config (Environment Variables පාවිච්චි කරයි)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Cloudinary Storage Engine එක සැකසීම
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lak-travelers-uploads', // Cloudinary හි සාදනු ලබන folder එක
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  },
});

// 3. Multer Middleware
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // උපරිම 5MB
});

// 4. POST Route
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Cloudinary මගින් දෙන ස්ථිර URL එක JSON එකක් විදිහට යවයි
    res.status(200).json({
      message: 'Image uploaded successfully ✅',
      image: req.file.path, // මෙහි තිබෙන්නේ https://res.cloudinary.com/... වැනි URL එකක්
    });
  } catch (error) {
    console.error('Upload Error:', error);
    
    // File size error එක විශේෂයෙන් handle කරන්න
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File too large. Maximum size is 5MB' 
      });
    }
    
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

export default router;