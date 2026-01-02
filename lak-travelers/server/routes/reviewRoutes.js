import express from "express";
import { submitReview, getServiceReputation } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import Review from "../models/Review.js";

const router = express.Router();

// 📈 සියලුම Reviews ලබා ගැනීම (Community Feed සඳහා)
router.get("/all", async (req, res) => {
    try {
        const reviews = await Review.find().populate("user", "name").sort({ createdAt: -1 });
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 📝 Review එකක් ඇතුළත් කිරීම (Protect middleware අවශ්‍යයි)
router.post("/submit", protect, submitReview);

export default router;