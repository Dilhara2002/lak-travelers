import express from 'express';
import { 
  getVehicles, 
  createVehicle, 
  getVehicleById, 
  deleteVehicle, 
  updateVehicle, 
  createVehicleReview 
} from '../controllers/vehicleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.route('/')
  .get(getVehicles)             
  .post(protect, createVehicle); 


router.route('/:id')
  .get(getVehicleById)          
  .put(protect, updateVehicle)  
  .delete(protect, deleteVehicle); 

// 
router.route('/:id/reviews')
  .post(protect, createVehicleReview); 

export default router;