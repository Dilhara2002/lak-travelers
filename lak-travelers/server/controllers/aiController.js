import Groq from "groq-sdk";
import Hotel from "../models/Hotel.js";
import Tour from "../models/Tour.js";
import Vehicle from "../models/Vehicle.js";
import dotenv from "dotenv";

// .env file එක load කිරීම අනිවාර්ය වේ
dotenv.config();

/**
 * 🛠️ Groq Instance එක හදන්නේ function එක ඇතුළේ හෝ 
 * API Key එක තියෙනවාදැයි පරීක්ෂා කිරීමෙන් පසුවයි.
 */
const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("❌ GROQ_API_KEY is missing in .env file!");
    return null;
  }
  return new Groq({ apiKey });
};

export const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    const groq = getGroqClient();
    if (!groq) {
      return res.status(500).json({ 
        success: false, 
        reply: "AI service configuration error. Please check API keys." 
      });
    }

    // 1. Database දත්ත ලබා ගැනීම (Context එක සඳහා)
    const [hotels, tours, vehicles] = await Promise.all([
      Hotel.find({}).select("name price location").limit(10),
      Tour.find({}).select("name price destinations").limit(10),
      Vehicle.find({}).select("vehicleModel pricePerDay").limit(5)
    ]);

    // History එක Format කිරීම
    const formattedHistory = (history || []).map(item => ({
      role: item.role === "model" ? "assistant" : item.role,
      content: Array.isArray(item.parts) ? item.parts[0].text : item.content || ""
    }));

    // 2. AI Trip Planner Instructions
    const systemPrompt = `
      You are the **Lak Travelers AI Trip Planner**. Your goal is to create amazing Sri Lankan travel itineraries.
      
      INVENTORY DATA:
      Hotels: ${JSON.stringify(hotels)}
      Tours: ${JSON.stringify(tours)}
      Vehicles: ${JSON.stringify(vehicles)}

      PLANNING RULES:
      1. If the user asks for a plan (e.g., "3 day trip to Kandy"), create a Day-by-Day itinerary.
      2. Suggest specific Hotels and Vehicles from our inventory for the plan.
      3. For each day, suggest: Morning (Activity), Afternoon (Sightseeing), and Evening (Relaxation/Hotel).
      4. Always keep the tone friendly and professional.
      5. Start with 'Ayubowan! 🙏' only if it's the first message.
      6. End each plan with a suggestion to book through Lak Travelers.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...formattedHistory,
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.status(200).json({ 
      success: true, 
      reply: chatCompletion.choices[0]?.message?.content || "No response from AI." 
    });

  } catch (error) {
    console.error("AI Controller Error:", error.message);
    res.status(500).json({ 
      success: false, 
      reply: "Sorry, I'm having trouble planning right now. Please try again later." 
    });
  }
};