import express from 'express';
import { getTours, createTour, getTourById, deleteTour, updateTour, createTourReview } from '../controllers/tourController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getTours).post(protect, createTour);
router.route('/:id').get(getTourById).put(protect, updateTour).delete(protect, deleteTour);
router.route('/:id/reviews').post(protect, createTourReview);

export default router;