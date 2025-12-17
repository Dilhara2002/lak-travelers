import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// 1. Cloudinary Config කරන්න (.env ෆයිල් එකෙන් විස්තර ගනී)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Storage Engine එක හදන්න
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lak-travelers', // Cloudinary එකේ මේ නමින් ෆෝල්ඩර් එකක් හැදෙයි
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // අවසර ඇති ෆයිල් වර්ග
  },
});

// 3. Multer Upload Middleware එක
const upload = multer({ storage });

// 4. Upload Route එක
router.post('/', upload.single('image'), (req, res) => {
  try {
    // Cloudinary එකට Upload වුනාම කෙලින්ම URL එක ලැබෙනවා
    // අපි ඒ URL එක Frontend එකට යවනවා
    res.send(req.file.path);
  } catch (error) {
    console.error(error);
    res.status(500).send('Image upload failed');
  }
});

export default router;