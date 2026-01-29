
import { GoogleGenAI, Type } from "@google/genai";
import { FundamentalData, TechnicalAnalysis } from "../types";

const API_KEY = process.env.API_KEY || "";

export const fetchStockInsights = async (symbol: string): Promise<{ fundamentals: FundamentalData; analysis: TechnicalAnalysis }> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Use Gemini 3 Flash for quick grounded search
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Fetch the latest PER (Price to Earnings Ratio), PBR (Price to Book Ratio), and EPS (Earnings Per Share) for ${symbol} on NASDAQ. Also provide a brief technical analysis summary (support/resistance levels and trend) based on recent market sentiment.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fundamentals: {
            type: Type.OBJECT,
            properties: {
              per: { type: Type.STRING },
              pbr: { type: Type.STRING },
              eps: { type: Type.STRING },
              marketCap: { type: Type.STRING },
              dividendYield: { type: Type.STRING },
            },
            required: ["per", "pbr", "eps"]
          },
          analysis: {
            type: Type.OBJECT,
            properties: {
              support: { type: Type.ARRAY, items: { type: Type.NUMBER } },
              resistance: { type: Type.ARRAY, items: { type: Type.NUMBER } },
              trend: { type: Type.STRING, enum: ["Bullish", "Bearish", "Neutral"] },
              summary: { type: Type.STRING }
            },
            required: ["support", "resistance", "trend", "summary"]
          }
        },
        required: ["fundamentals", "analysis"]
      }
    }
  });

  const rawText = response.text || "{}";
  const result = JSON.parse(rawText);
  
  // Extract grounding sources
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title || "Source",
      uri: chunk.web.uri
    }));

  return {
    fundamentals: {
      ...result.fundamentals,
      sources
    },
    analysis: result.analysis
  };
};
