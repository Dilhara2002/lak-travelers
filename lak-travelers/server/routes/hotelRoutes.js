import express from 'express';
import { getHotels, createHotel } from '../controllers/hotelController.js';
import { protect } from '../middleware/authMiddleware.js'; // Login වෙලාද බලන්න

const router = express.Router();

// GET ඉල්ලුවොත් හෝටල් පෙන්නන්න, POST කළොත් අලුත් හෝටලයක් හදන්න
router.route('/')
  .get(getHotels)
  .post(protect, createHotel); // 'protect' දැම්මාම login වෙලා ඉන්න ඕනේ

export default router;