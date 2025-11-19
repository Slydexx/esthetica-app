import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AnalysisResult, EnhancedImage, UserData } from '../types';
import { t } from '../i18n';

// --- SECURITY CONFIGURATION ---
// SET THIS TO 'true' WHEN DEPLOYING TO VERCEL TO PROTECT YOUR CODE
// SET THIS TO 'false' FOR LOCAL PREVIEWS WITHOUT A SERVER
const USE_SECURE_BACKEND = true; 

const API_KEY = process.env.API_KEY;

// Initialize client-side SDK only if we are in client-mode
let ai: GoogleGenAI | null = null;
if (!USE_SECURE_BACKEND && API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
}

interface ImageEditingPrompt {
  prompt: string;
  changes: string[];
}

interface VisagismAnalysisResponse {
  summary: string;
  recommendations: string[];
  imageEditingPrompts: ImageEditingPrompt[];
}

const fileToGenerativePart = (base64Data: string) => {
  const match = base64Data.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
  if (!match) {
    console.error("Invalid base64 data URL format provided:", base64Data.substring(0, 100) + "...");
    throw new Error(t('service.errorInvalidBase64'));
  }
  const mimeType = match[1];
  const data = match[2];
  
  return {
    inlineData: {
      data,
      mimeType,
    },
  };
};

// Utility to retry operations
async function retryOperation<T>(operation: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    // Stop retrying if it's a permission error (403)
    if (error.message && (error.message.includes('403') || error.message.includes('PERMISSION_DENIED'))) {
        throw error;
    }
    if (retries <= 0) throw error;
    console.warn(`Operation failed, retrying... (${retries} attempts left). Error:`, error);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryOperation(operation, retries - 1, delay * 2);
  }
}

// --- MAIN ORCHESTRATOR ---

export const analyzeAndEnhanceFaces = async (
  base64Images: string[],
  userData: UserData,
  onProgress: (message: string) => void,
  language: 'it' | 'en'
): Promise<AnalysisResult> => {
  
  onProgress(t('loader.step1')); // Analysis text
  
  // 1. Get Text Analysis & Prompts
  let analysisResponse: VisagismAnalysisResponse;

  if (USE_SECURE_BACKEND) {
      // Call Serverless Function
      const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Images, userData, language })
      });
      if (!res.ok) throw new Error('Server analysis failed');
      analysisResponse = await res.json();
  } else {
      // Call Client Side (Insecure but good for demo)
      analysisResponse = await retryOperation(() => 
        getVisagismAnalysisClientSide(base64Images, userData, language)
      );
  }

  // 2. Generate Diagnostic Image
  onProgress(t('loader.stepDiagnostic'));
  let diagnosticImage: string;
  
  if (USE_SECURE_BACKEND) {
       const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64Images[0], type: 'diagnostic' })
      });
      const data = await res.json();
      diagnosticImage = data.image;
  } else {
      diagnosticImage = await retryOperation(() => 
        generateDiagnosticImageClientSide(base64Images[0])
      );
  }

  const enhancedImages: EnhancedImage[] = [];
  const imageMapping = [0, 0, 1, 2];

  // 3. Generate Enhanced Images
  for (let i = 0; i < analysisResponse.imageEditingPrompts.length; i++) {
    if (i >= imageMapping.length) break;
    const inputIndex = imageMapping[i];
    if (inputIndex >= base64Images.length) continue;

    onProgress(t('loader.step2', { current: i + 1, total: 4 }));
    
    const originalImage = base64Images[inputIndex]; 
    const promptObj = analysisResponse.imageEditingPrompts[i];
    
    let generatedImageBase64: string;

    if (USE_SECURE_BACKEND) {
        const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                imageBase64: originalImage, 
                prompt: promptObj.prompt,
                type: 'enhancement',
                index: i
            })
        });
        const data = await res.json();
        generatedImageBase64 = data.image;
    } else {
        generatedImageBase64 = await retryOperation(() => 
            generateEnhancedImageClientSide(originalImage, promptObj.prompt, i)
        );
    }
    
    enhancedImages.push({
      original: originalImage,
      generated: generatedImageBase64,
      prompt: promptObj.prompt,
      changes: promptObj.changes,
    });
  }
  
  onProgress(t('loader.step3'));

  return {
    summary: analysisResponse.summary,
    diagnosticImage,
    recommendations: analysisResponse.recommendations,
    enhancedImages,
  };
};

export const regenerateSingleImage = async (
    originalImage: string,
    basePrompt: string,
    index: number
): Promise<string> => {
    const variationPrompt = `${basePrompt}. Create a slightly different variation of this style. Variant ${Math.floor(Math.random() * 1000)}.`;
    
    if (USE_SECURE_BACKEND) {
        const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                imageBase64: originalImage, 
                prompt: variationPrompt,
                type: 'enhancement',
                index: index
            })
        });
        const data = await res.json();
        return data.image;
    } else {
        return retryOperation(() => generateEnhancedImageClientSide(originalImage, variationPrompt, index));
    }
};


// --- CLIENT SIDE IMPLEMENTATIONS (LEGACY/DEMO) ---

const getVisagismAnalysisClientSide = async (
    base64Images: string[], 
    userData: UserData, 
    language: 'it' | 'en'
): Promise<VisagismAnalysisResponse> => {
  if (!ai) throw new Error("AI not initialized");
  const imageParts = base64Images.map(img => fileToGenerativePart(img));
  
  const isMale = userData.gender === 'Uomo' || userData.gender === 'Man';
  
  // KEEPING PROMPTS HERE FOR DEMO MODE, BUT IN PROD THESE ARE IGNORED
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
       - **changes**: DEVE ESSERE IN ${targetLanguage} (per l'utente). Lista puntata delle modifiche fatte (es. "Nuovo taglio volumizzante", "Barba definita").
    
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

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash', // Downgraded from 3-pro-preview to fix 403
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
                                items: { type: Type.STRING },
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

  try {
    const text = response.text!.trim();
    const parsed = JSON.parse(text) as VisagismAnalysisResponse;
    while (parsed.imageEditingPrompts.length > 0 && parsed.imageEditingPrompts.length < 4) {
      parsed.imageEditingPrompts.push(parsed.imageEditingPrompts[parsed.imageEditingPrompts.length - 1]);
    }
    return parsed;
  } catch (e) {
    console.error("Failed to parse JSON", response.text);
    throw new Error(t('service.errorParsingResponse'));
  }
};

const generateDiagnosticImageClientSide = async (originalImageBase64: string): Promise<string> => {
    if (!ai) throw new Error("AI not initialized");
    const imagePart = fileToGenerativePart(originalImageBase64);
    
    const diagnosticPrompt = `
    Act as a visagism instructor. Create a 'Diagnostic Blueprint' of this face.
    DO NOT BEAUTIFY THE FACE. Keep the original face exactly as is.
    OVERLAY technical white and red lines on the face to show the analysis:
    1. Draw horizontal lines dividing the face into thirds.
    2. Draw a line outlining the face shape.
    3. Use red dotted lines to mark areas of asymmetry.
    Style: Medical aesthetic diagram.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, { text: diagnosticPrompt }] },
        config: { responseModalities: [Modality.IMAGE] },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && 'inlineData' in firstPart && firstPart.inlineData && firstPart.inlineData.data) {
        const { data, mimeType } = firstPart.inlineData;
        return `data:${mimeType};base64,${data}`;
    }
    return originalImageBase64;
};

const generateEnhancedImageClientSide = async (
    originalImageBase64: string, 
    prompt: string, 
    index: number
): Promise<string> => {
  if (!ai) throw new Error("AI not initialized");
  const imagePart = fileToGenerativePart(originalImageBase64);
  
  let impactModifier = "";
  if (index === 0) {
      impactModifier = "Harmonious Visagism Makeover. Elegant, natural, balanced features. Soft professional lighting. High-end salon result.";
  } else if (index === 1) {
      impactModifier = "Celebrity Makeover Portrait. Confident, stylish. Studio lighting. Perfect hair texture. No extreme distortions.";
  } else {
      impactModifier = "Sharp defined profile. Professional grooming. Clear jawline definition. Realistic hair texture side view.";
  }

  const fullPrompt = `
    Makeover Instruction: ${prompt}. 
    Style: ${impactModifier} 
    8k resolution, photorealistic, cinematic lighting, highly detailed skin texture.
    Negative prompt: cartoon, caricature, blurry, distorted, ugly, messy, asymmetrical, weird hair, deformed eyes.
    Maintain facial identity but apply the styling changes precisely.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [imagePart, { text: fullPrompt }] },
    config: { responseModalities: [Modality.IMAGE] },
  });

  const firstPart = response.candidates?.[0]?.content?.parts?.[0];
  if (firstPart && 'inlineData' in firstPart && firstPart.inlineData && firstPart.inlineData.data) {
    const { data, mimeType } = firstPart.inlineData;
    return `data:${mimeType};base64,${data}`;
  }
  return originalImageBase64;
};