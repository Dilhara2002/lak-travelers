import Groq from "groq-sdk";
import Hotel from "../models/Hotel.js";
import Tour from "../models/Tour.js";
import Vehicle from "../models/Vehicle.js";
import dotenv from "dotenv";

dotenv.config();

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("❌ GROQ_API_KEY is missing in .env file!");
    return null;
  }
  return new Groq({ apiKey });
};

/**
 * 🚀 VISUAL GRAPHRAG ITINERARY GENERATOR
 */
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

    // 1. KNOWLEDGE RETRIEVAL (දත්ත ලබා ගැනීම - පින්තූර ඇතුළුව)
    const [hotels, tours, vehicles] = await Promise.all([
      Hotel.find({}).select("name price location wellness luxuryGrade veganOptions amenities image"),
      Tour.find({}).select("name price destinations activities categories difficulty image"),
      Vehicle.find({}).select("vehicleModel pricePerDay driverLanguages type amenities isPrivate images")
    ]);

    const formattedHistory = (history || []).map(item => ({
      role: item.role === "model" ? "assistant" : item.role,
      content: Array.isArray(item.parts) ? item.parts[0].text : item.content || ""
    }));

    /**
     * 2. VISUAL ARCHITECT PROMPT
     * මෙහිදී AI එකට ඉතා පැහැදිලි Layout එකක් ලබා දීමට උපදෙස් දෙනු ලැබේ.
     */
    const visualGraphPrompt = `
      You are the **Lak Travelers Visual Itinerary Architect**. 
      Your goal is to build a structured, easy-to-read, and beautiful travel plan using Markdown.

      KNOWLEDGE BASE:
      - Hotels: ${JSON.stringify(hotels)}
      - Tours: ${JSON.stringify(tours)}
      - Vehicles: ${JSON.stringify(vehicles)}

      OUTPUT FORMATTING RULES (STRICT):
      1. **Headers**: Use '###' for Day headers and '##' for Section headers.
      2. **Images**: You MUST include the image of the selected Hotel and Tour using Markdown: ![image](URL).
      3. **Lists**: Use Numbered lists (1, 2, 3) for the daily schedule.
      4. **Emojis**: Use relevant emojis (🏨, 🚗, 🍽️, 🏔️, 🌅, 🌙) to make it visually appealing.
      5. **Spacing**: Use double line breaks between sections to avoid walls of text.
      6. **Comparison**: If a preference isn't perfectly met (e.g., Luxury vs Budget), clearly explain the choice in a separate "💡 Architect's Note" section.
      7. **IDs**: DO NOT show database ObjectIDs. Use only the names.

      ITINERARY STRUCTURE:
      # 🌴 Your Custom Sri Lankan Escape to [Location]
      
      ## 🏨 Accommodation Partner
      **[Hotel Name]**
      ![hotel image]([Hotel Image URL])
      *Reason: [Briefly why this matches preferences]*

      ## 🗓️ Day-by-Day Journey
      ### 🗓️ Day 1: [Theme]
      1. 🌅 **Morning**: [Activity]
      2. 🍽️ **Afternoon**: [Lunch/Sightseeing]
      3. 🌙 **Evening**: [Relaxation at Hotel]

      ## 🚗 Private Transport Details
      - **Vehicle**: [Model Name]
      - **Driver**: Speaks [Languages]
      ![vehicle image]([Vehicle Image URL])

      Ready to book this professionally integrated Lak Travelers package?
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: visualGraphPrompt },
        ...formattedHistory,
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, // තර්කානුකූල බව සහ ව්‍යුහය ආරක්ෂා කිරීමට අඩු අගයක් භාවිතා කරයි.
    });

    res.status(200).json({ 
      success: true, 
      reply: chatCompletion.choices[0]?.message?.content || "No response from AI." 
    });

  } catch (error) {
    console.error("GraphRAG Error:", error.message);
    res.status(500).json({ 
      success: false, 
      reply: "Our AI brain is currently restructuring the knowledge graph. Please try again." 
    });
  }
};