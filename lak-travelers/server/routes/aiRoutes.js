import express from 'express';
import { chatWithAI } from '../controllers/aiController.js';

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

export default router;