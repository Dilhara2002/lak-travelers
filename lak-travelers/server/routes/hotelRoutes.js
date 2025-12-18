import express from 'express';
import { 
  getHotels, 
  createHotel, 
  deleteHotel, 
  getHotelById, 
  updateHotel, 
  createHotelReview 
} from '../controllers/hotelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. සියලුම හෝටල් බැලීම සහ අලුත් හෝටලයක් ඇතුළත් කිරීම
router.route('/')
  .get(getHotels)             // Public: ඕනෑම අයෙකුට බැලිය හැක
  .post(protect, createHotel); // Private: Vendor/Admin පමණි

// 2. තනි හෝටලයක් බැලීම, මැකීම සහ යාවත්කාලීන කිරීම
router.route('/:id')
  .get(getHotelById)          // Public: විස්තර බැලීමට
  .put(protect, updateHotel)  // Private: Edit කිරීමට
  .delete(protect, deleteHotel); // Private: Delete කිරීමට

// 3. සමාලෝචන (Reviews) එක් කිරීම
router.route('/:id/reviews')
  .post(protect, createHotelReview); // Private: ලොග් වූ අයට පමණි

export default router;