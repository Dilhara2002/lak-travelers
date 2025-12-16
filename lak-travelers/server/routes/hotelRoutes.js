import express from 'express';
import { getHotels, createHotel, deleteHotel, getHotelById, updateHotel, createHotelReview } from '../controllers/hotelController.js';
import { protect } from '../middleware/authMiddleware.js'; // Login වෙලාද බලන්න



const router = express.Router();

// GET ඉල්ලුවොත් හෝටල් පෙන්නන්න, POST කළොත් අලුත් හෝටලයක් හදන්න
router.route('/')
  .get(getHotels)
  .post(protect, createHotel); // 'protect' දැම්මාම login වෙලා ඉන්න ඕනේ

router.route('/:id')
  .get(getHotelById)          // හෝටල් විස්තර ගන්න
  .delete(protect, deleteHotel);

router.route('/:id')
  .get(getHotelById)
  .delete(protect, deleteHotel)
  .put(protect, updateHotel); // 👈 අලුත් Edit Route එක

router.route('/:id/reviews')
  .post(protect, createHotelReview);

export default router;