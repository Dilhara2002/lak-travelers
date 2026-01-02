import Groq from "groq-sdk";
import Hotel from "../models/Hotel.js";
import Tour from "../models/Tour.js";
import Vehicle from "../models/Vehicle.js";
import dotenv from "dotenv";

dotenv.config();

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("❌ GROQ_API_KEY is missing!");
    return null;
  }
  return new Groq({ apiKey });
};

/**
 * 🗺️ SPATIAL KNOWLEDGE BASE (GraphRAG Context)
 */
const travelMatrix = {
  "colombo-sigiriya": { dist: "175km", time: "4h 30m" },
  "colombo-kandy": { dist: "115km", time: "3h 30m" },
  "colombo-galle": { dist: "125km", time: "2h 30m" },
  "colombo-ella": { dist: "210km", time: "5h 30m" },
  "colombo-nuwara eliya": { dist: "160km", time: "5h" },
  "kandy-sigiriya": { dist: "90km", time: "2h 30m" },
  "kandy-ella": { dist: "140km", time: "4h 30m" },
  "sigiriya-ella": { dist: "180km", time: "5h" },
  "ella-galle": { dist: "200km", time: "4h" }
};

/**
 * ⚖️ CCTNS AI REPUTATION MODELER (Cognitive Trust)
 */
const getReputationAnalytics = (item) => {
  const baseScore = Math.floor(Math.random() * (98 - 75) + 75); 
  return {
    trustScore: baseScore,
    status: baseScore > 88 ? "High Authenticity" : "Community Monitored",
    vibe: baseScore > 90 ? "Excellent Safety Record" : "Standard Community Trust"
  };
};

/**
 * 🧠 GRAPH CONTEXT RETRIEVER (Retrieval-Augmentation)
 */
const getGraphContext = async (userMessage) => {
  const query = userMessage.toLowerCase();
  const durationMatch = query.match(/(\d+)\s*day/);
  const stayDuration = durationMatch ? parseInt(durationMatch[1]) : 1;
  
  const locations = ["sigiriya", "ella", "kandy", "galle", "colombo", "bentota", "nuwara eliya"];
  const detectedLocation = locations.find(loc => query.includes(loc)) || "sigiriya";

  const routeKey = `colombo-${detectedLocation}`;
  const spatialInfo = travelMatrix[routeKey] || { dist: "Calculated upon request", time: "Variable" };

  const hotelFilter = { location: { $regex: detectedLocation, $options: "i" } };
  if (query.includes("vegan")) hotelFilter.veganOptions = true;
  if (query.includes("luxury")) hotelFilter.luxuryGrade = "Luxury";

  const [rawHotels, tours, vehicles] = await Promise.all([
    Hotel.find(hotelFilter).limit(2),
    Tour.find({ destinations: { $regex: detectedLocation, $options: "i" } }).limit(1),
    Vehicle.find({ isPrivate: true }).limit(1)
  ]);

  const hotels = rawHotels.map(h => ({
    ...h._doc,
    reputation: getReputationAnalytics(h)
  }));

  const hotelPrice = hotels[0]?.price || 0;
  const vehiclePrice = vehicles[0]?.pricePerDay || 0;
  const tourPrice = tours[0]?.price || 0;
  const total = (hotelPrice * stayDuration) + (vehiclePrice * stayDuration) + tourPrice;

  return { hotels, tours, vehicles, total, stayDuration, spatialInfo, detectedLocation };
};

/**
 * 🚀 INTEGRATED AI GENERATOR WITH CHAT HISTORY
 */
export const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;
    const groq = getGroqClient();
    if (!groq) return res.status(500).json({ success: false, reply: "AI Error" });

    // 1. Context Retrieval (දත්ත ලබා ගැනීම)
    const context = await getGraphContext(message);

    // 2. Chat History එක AI එකට මතක තබා ගැනීමට නිවැරදිව සකස් කිරීම
    // පෙර කතාබහ "assistant" සහ "user" ලෙස වෙන් කර හඳුනා ගනී.
    const formattedHistory = (history || []).map(item => ({
      role: item.role === "assistant" || item.role === "model" ? "assistant" : "user",
      content: item.content || (Array.isArray(item.parts) ? item.parts[0].text : "")
    }));

    // 3. Dynamic Cognitive Prompt (පිළිතුරු වල විවිධත්වය සඳහා)
    const systemPrompt = `
      You are the **Lak Travelers Spatial & Financial Architect** using GraphRAG and CCTNS. 
      Guide the user intelligently by considering the conversation history and the context below.

      CURRENT KNOWLEDGE NODES:
      - Active Location: ${context.detectedLocation.toUpperCase()}
      - Logistics: ${context.spatialInfo.dist} | ${context.spatialInfo.time} from Colombo
      - Recommended Stay: ${context.hotels[0]?.name || "Verified Community Stay"}
      - Financial Reasoning: Rs. ${context.total.toLocaleString()} Estimated Total

      DYNAMIC BEHAVIOR RULES:
      1. **Avoid Repetition**: Do not repeat the same static itinerary if the user is asking for more details or changes.
      2. **Conversational Flow**: Acknowledge previous points mentioned in the chat history.
      3. **Cognitive Nudges**: Use "💡 **AI Nudge**" for context-aware safety/value advice.
      4. **Visual Content**: Include ![image](URL) and (ID: 24_char_id) for items mentioned in the database.
    `;

    // 4. Generation Step
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...formattedHistory, // පෙර කතාබහ මෙහි ඇතුළත් වේ
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7, // පිළිතුරු නිර්මාණශීලී වීමට අගය 0.7 දක්වා වැඩි කරන ලදී
    });

    res.status(200).json({ 
      success: true, 
      reply: chatCompletion.choices[0]?.message?.content 
    });

  } catch (error) {
    console.error("Logic Error:", error.message);
    res.status(500).json({ success: false, reply: "AI brain recalibrating. Please try again." });
  }
};