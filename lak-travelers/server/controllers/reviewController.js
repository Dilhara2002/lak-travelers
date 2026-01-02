import Review from "../models/Review.js";
import Hotel from "../models/Hotel.js";
import Vehicle from "../models/Vehicle.js";

/**
 * 📝 SUBMIT REVIEW & RECALIBRATE TRUST SCORE
 * CCTNS Process: Collect -> Analyze -> Recalibrate
 */
export const submitReview = async (req, res) => {
  try {
    const { targetId, targetType, comment, safetyScore, hygieneScore, serviceQuality, mediaUrl } = req.body;
    const userId = req.user._id;

    // 1. Collect: නව Review එක ගබඩා කිරීම
    const review = await Review.create({
      user: userId,
      [targetType]: targetId,
      comment,
      safetyScore,
      hygieneScore,
      serviceQuality,
      mediaUrl
    });

    // 2. Analyze & Recalibrate: සේවා මට්ටම යාවත්කාලීන කිරීම
    // අදාළ හෝටලයේ හෝ වාහනයේ සියලුම Reviews ලබාගෙන සාමාන්‍ය අගය ගණනය කරයි.
    const allReviews = await Review.find({ [targetType]: targetId });
    
    const avgSafety = allReviews.reduce((acc, curr) => acc + curr.safetyScore, 0) / allReviews.length;
    const avgHygiene = allReviews.reduce((acc, curr) => acc + curr.hygieneScore, 0) / allReviews.length;
    
    // AI Reputation Modeling: Trust Score එක ගණනය කිරීම (අගය 1-100 අතරට හරවයි)
    const newTrustScore = Math.round(((avgSafety + avgHygiene + (serviceQuality || 5)) / 3) * 10);

    // 3. Update Service Node: Graph එකේ ඇති දත්ත යාවත්කාලීන කිරීම
    if (targetType === "hotel") {
      await Hotel.findByIdAndUpdate(targetId, { reputationScore: newTrustScore });
    } else if (targetType === "vehicle") {
      await Vehicle.findByIdAndUpdate(targetId, { reputationScore: newTrustScore });
    }

    res.status(201).json({
      success: true,
      message: "Review submitted. AI Trust Score recalibrated! 🛡️",
      newTrustScore
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 📈 GET REPUTATION DATA
 * AI Nudging සඳහා අවශ්‍ය දත්ත ලබා ගනී.
 */
export const getServiceReputation = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await Review.find({ hotel: id }).populate("user", "name");
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};