import express from 'express';
import { 
  getVehicles, 
  createVehicle, 
  getVehicleById, 
  deleteVehicle, 
  updateVehicle, // 👈 මම මෙය අලුතින් එක් කළා
  createVehicleReview 
} from '../controllers/vehicleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. සියලුම වාහන බැලීම සහ අලුත් වාහනයක් ඇතුළත් කිරීම
router.route('/')
  .get(getVehicles)             // Public: ඕනෑම අයෙකුට බැලිය හැක
  .post(protect, createVehicle); // Private: ලොග් වූ Vendor/Admin පමණි

// 2. තනි වාහනයක විස්තර බැලීම, මැකීම සහ යාවත්කාලීන කිරීම
router.route('/:id')
  .get(getVehicleById)          // Public: විස්තර බැලීමට
  .put(protect, updateVehicle)  // Private: විස්තර වෙනස් කිරීමට (අයිතිකරු/Admin)
  .delete(protect, deleteVehicle); // Private: මැකීමට (අයිතිකරු/Admin)

// 3. වාහනයක් සඳහා සමාලෝචන (Reviews) එක් කිරීම
router.route('/:id/reviews')
  .post(protect, createVehicleReview); // Private: ලොග් වූ අයට පමණි

export default router;