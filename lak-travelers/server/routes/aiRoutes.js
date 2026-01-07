import express from 'express';
import { chatWithAI } from '../controllers/aiController.js';
import Plan from '../models/Plan.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// AI Chat Route
router.post('/chat', chatWithAI);

// Optional: Add a test route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Lak Travelers AI Assistant is running!',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

router.post('/save-plan', protect, async (req, res) => {
  const { location, duration, preferences, itinerary } = req.body;
  const plan = new Plan({
    user: req.user._id,
    location, duration, preferences, itinerary
  });
  const savedPlan = await plan.save();
  res.status(201).json(savedPlan);
});

router.get('/my-plans', protect, async (req, res) => {
  const plans = await Plan.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(plans);
});


router.delete('/plan/:id', protect, async (req, res) => {
  const plan = await Plan.findById(req.params.id);

  if (plan && plan.user.toString() === req.user._id.toString()) {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan removed successfully' });
  } else {
    res.status(404);
    throw new Error('Plan not found or unauthorized');
  }
});

export default router;