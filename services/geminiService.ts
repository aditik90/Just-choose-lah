
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Recommendation } from "../types";

export const fetchRecommendations = async (
  users: UserProfile[],
  runtimeLimit: number,
  platforms: string[]
): Promise<Recommendation[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    TASK: Act as a world-class entertainment curator for a group in Singapore. 
    Find 7 high-quality recommendations (mix of MOVIES and TV SERIES/SHOWS) based on:
    ${JSON.stringify(users)}

    CULTURAL CONTEXT:
    - This group is in Singapore and enjoys diverse content. 
    - STRONGLY consider high-quality Hindi language movies and series (Bollywood or OTT originals) alongside English/International content.
    
    CONSTRAINTS:
    - Include both Movies and TV Series/Shows.
    - Max Runtime for movies should be around ${runtimeLimit} mins.
    - Verify current availability in SINGAPORE for requested platforms: ${platforms.join(', ')}. 
    - Note: Hotstar, Zee5, and Sony Liv are highly relevant for Hindi content in SG.
    - Use Google Search to find current IMDB ratings, Directors, Top Cast, and a valid YouTube trailer URL.
    
    SCORING: 
    - 0-100 scale.
    - HEAVILY penalize (subtract 60 points) if it matches any user's 'dislikedGenres'.
    - Boost score if it features specific actors or directors mentioned in 'favoriteActors'.

    OUTPUT FORMAT:
    Ensure you find a specific trailerUrl (YouTube link preferred).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              year: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['Movie', 'Series', 'TV Show'] },
              posterUrl: { type: Type.STRING },
              score: { type: Type.NUMBER },
              imdbRating: { type: Type.STRING },
              director: { type: Type.STRING },
              topCast: { type: Type.ARRAY, items: { type: Type.STRING } },
              matchExplanation: { type: Type.STRING },
              streamingOn: { type: Type.ARRAY, items: { type: Type.STRING } },
              genres: { type: Type.ARRAY, items: { type: Type.STRING } },
              runtime: { type: Type.STRING },
              trailerUrl: { type: Type.STRING, description: "Official YouTube trailer link" }
            },
            required: ["title", "year", "type", "score", "imdbRating", "director", "topCast", "matchExplanation", "streamingOn", "genres", "runtime", "trailerUrl"]
          }
        },
        tools: [{ googleSearch: {} }]
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    return data.map((rec: any) => ({
      ...rec,
      posterUrl: rec.posterUrl && rec.posterUrl.startsWith('http') 
        ? rec.posterUrl 
        : `https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80`
    }));
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("The Vibe Engine is currently recalibrating. Please try again in 10 seconds.");
  }
};
