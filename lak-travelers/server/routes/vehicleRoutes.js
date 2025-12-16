import express from 'express';
import { getVehicles, createVehicle, getVehicleById, deleteVehicle, createVehicleReview } from '../controllers/vehicleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getVehicles)
  .post(protect, createVehicle); // වාහනයක් දාන්න Login වෙන්න ඕනේ

router.route('/:id')
  .get(getVehicleById)
  .delete(protect, deleteVehicle);

router.route('/:id/reviews').post(protect, createVehicleReview);

export default router;