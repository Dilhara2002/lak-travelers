import express from 'express';
import { 
  getTours, 
  createTour, 
  getTourById, 
  deleteTour, 
  updateTour, 
  createTourReview 
} from '../controllers/tourController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. සියලුම Tours බැලීම සහ අලුත් Tour එකක් ඇතුළත් කිරීම
router.route('/')
  .get(getTours)             // Public: ඕනෑම අයෙකුට බැලිය හැක
  .post(protect, createTour); // Private: ලොග් වූ Vendor/Admin පමණි

// 2. තනි Tour එකක් බැලීම, මැකීම සහ යාවත්කාලීන කිරීම
router.route('/:id')
  .get(getTourById)          // Public: විස්තර බැලීමට
  .delete(protect, deleteTour) // Private: අයිතිකරුට හෝ Admin ට පමණි
  .put(protect, updateTour);   // Private: අයිතිකරුට හෝ Admin ට පමණි

// 3. Tour එකක් සඳහා සමාලෝචන (Reviews) එක් කිරීම
router.route('/:id/reviews')
  .post(protect, createTourReview); // Private: ලොග් වූ අයට පමණි

export default router;