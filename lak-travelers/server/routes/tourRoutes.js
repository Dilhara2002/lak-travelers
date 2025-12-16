import express from 'express';
import { getTours, createTour, getTourById, deleteTour, updateTour } from '../controllers/tourController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTours)
  .post(protect, createTour); // Tour එකක් දාන්න Login වෙන්න ඕනේ

router.route('/:id')
  .get(getTourById)
  .delete(protect, deleteTour)
  .put(protect, updateTour);

export default router;