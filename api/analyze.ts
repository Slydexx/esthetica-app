
import { GoogleGenAI, Type } from "@google/genai";

export const config = {
    runtime: 'edge', // Optional: Use Edge runtime for faster response
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const { base64Images, userData, language } = await req.json();

        if (!process.env.API_KEY) {
            return new Response(JSON.stringify({ error: 'API_KEY missing on server' }), { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        // --- LOGICA SEGRETA (Spostata qui dal frontend per protezione) ---
        
        const isMale = userData.gender === 'Uomo' || userData.gender === 'Man';

        const maleRulesIT = `
            REGOLE VISAGISMO UOMO (ELEGANZA E CLASSE):
            1.  **Stempiatura/Fronte Alta**: Prompt DEVE includere "sophisticated textured french crop", "soft messy fringe". EVITARE "blunt straight bangs".
            2.  **Viso Tondo**: Prompt DEVE includere "classic voluminous quiff", "structured side fade".
            3.  **Viso Quadrato**: Prompt DEVE includere "gentle layers on top", "groomed rounded beard".
            4.  **Viso Lungo**: Prompt DEVE includere "balanced side volume", "classic scissor cut".
            5.  **Mento Debole**: Prompt DEVE includere "perfectly sculpted full beard", "heavy stubble to define jawline".
            6.  **Mento Prominente**: Prompt DEVE includere "volume on crown and back", "short neat beard".
        `;

        const femaleRulesIT = `
            REGOLE VISAGISMO DONNA (ARMONIA E MODA):
            1.  **Viso Tondo**: Prompt DEVE includere "face-framing long layers", "chic side part".
            2.  **Viso Quadrato**: Prompt DEVE includere "romantic soft waves", "curtain bangs".
            3.  **Viso Lungo**: Prompt DEVE includere "modern textured bob", "horizontal volume".
            4.  **Fronte Alta**: Prompt DEVE includere "wispy curtain bangs", "long bottleneck bangs".
            5.  **Mento Appuntito**: Prompt DEVE includere "volume at jawline", "wavy lob".
            6.  **Occhi Piccoli**: Prompt DEVE includere "illuminating eyeliner", "curled lashes".
        `;

        const activeRules = isMale ? maleRulesIT : femaleRulesIT;
        const targetLanguage = language === 'it' ? 'ITALIAN' : 'ENGLISH';

        const instructions = `
            Sei un Visagista Esperto.
            Analizza il viso e crea 4 strategie di miglioramento.
            
            REGOLE DI OUTPUT:
            1. **summary**: Analisi generale in ${targetLanguage}.
            2. **recommendations**: Lista consigli in ${targetLanguage}.
            3. **imageEditingPrompts**: Array di 4 oggetti.
            - **prompt**: DEVE ESSERE IN INGLESE (per il generatore di immagini). Dettagliato, tecnico, estetico.
            - **changes**: DEVE ESSERE IN ${targetLanguage} (per l'utente). Lista puntata delle modifiche fatte.
            
            STRUTTURA PROMPTS (4 Oggetti):
            1. Front View (Balanced/Elegant)
            2. Front View (Bold/Fashion Variant)
            3. Right Profile (Jawline & Hair focus)
            4. Left Profile (Jawline & Hair focus)

            KNOWLEDGE BASE:
            ${activeRules}
        `;

        const genderContext = userData.gender === 'Non specificato' || userData.gender === 'Unspecified' 
            ? `Gender Neutral/Fluid. Makeup Preference: ${userData.makeupPreference ? 'YES' : 'NO'}` 
            : userData.gender;

        const prompt = `
        ${instructions}
        Cliente: ${userData.name}, ${userData.age}, ${genderContext}.
        `;

        const imageParts = base64Images.map((img: string) => {
            const match = img.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
            return {
                inlineData: {
                    mimeType: match ? match[1] : 'image/jpeg',
                    data: match ? match[2] : ''
                }
            };
        });

        // Changed from 'gemini-3-pro-preview' to 'gemini-2.5-flash' to prevent 403 errors
        // as some keys might not have access to the pro preview model.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: [{ parts: [...imageParts, { text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        recommendations: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        imageEditingPrompts: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    prompt: { type: Type.STRING },
                                    changes: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    }
                                },
                                required: ["prompt", "changes"]
                            }
                        }
                    },
                    required: ["summary", "recommendations", "imageEditingPrompts"]
                }
            }
        });

        return new Response(response.text, {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("API Error:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
