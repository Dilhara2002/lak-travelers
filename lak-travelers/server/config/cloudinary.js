import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary සැකසුම්
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage සැකසුම් (පින්තූර සුරකින ආකාරය)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lak_travelers_uploads', // Cloudinary හි සාදනු ලබන folder එක
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

export { cloudinary, upload };