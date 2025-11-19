import { GoogleGenAI, Modality } from "@google/genai";

export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const { imageBase64, prompt, type, index } = await req.json(); // type: 'diagnostic' | 'enhancement'

        if (!process.env.API_KEY) {
            return new Response(JSON.stringify({ error: 'API_KEY missing on server' }), { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const match = imageBase64.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
        const imagePart = {
            inlineData: {
                mimeType: match ? match[1] : 'image/jpeg',
                data: match ? match[2] : ''
            }
        };

        let fullPrompt = "";
        
        if (type === 'diagnostic') {
            fullPrompt = `
            Act as a visagism instructor. Create a 'Diagnostic Blueprint' of this face.
            DO NOT BEAUTIFY THE FACE. Keep the original face exactly as is.
            OVERLAY technical white and red lines on the face to show the analysis:
            1. Draw horizontal lines dividing the face into thirds.
            2. Draw a line outlining the face shape.
            3. Use red dotted lines to mark areas of asymmetry.
            Style: Medical aesthetic diagram.
            `;
        } else {
            let impactModifier = "";
            if (index === 0) impactModifier = "Harmonious Visagism Makeover. Elegant, natural, balanced. Soft professional lighting.";
            else if (index === 1) impactModifier = "Celebrity Makeover Portrait. Confident, stylish. Studio lighting. Perfect hair texture.";
            else impactModifier = "Sharp defined profile. Professional grooming. Clear jawline definition.";

            fullPrompt = `
            Makeover Instruction: ${prompt}. 
            Style: ${impactModifier} 
            8k resolution, photorealistic, cinematic lighting, highly detailed skin texture.
            Negative prompt: cartoon, caricature, blurry, distorted, ugly, messy, asymmetrical, weird hair, deformed eyes.
            Maintain facial identity but apply the styling changes precisely.
            `;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, { text: fullPrompt }] },
            config: { responseModalities: [Modality.IMAGE] },
        });

        const firstPart = response.candidates?.[0]?.content?.parts?.[0];
        if (firstPart && 'inlineData' in firstPart && firstPart.inlineData && firstPart.inlineData.data) {
            const { data, mimeType } = firstPart.inlineData;
            return new Response(JSON.stringify({ image: `data:${mimeType};base64,${data}` }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ error: 'Generation failed' }), { status: 500 });

    } catch (error) {
        console.error("API Gen Error:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}