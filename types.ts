
// Fix: Expanded Gender type to include English translations to resolve type mismatches across components.
export type Gender = 'Uomo' | 'Donna' | 'Non specificato' | 'Man' | 'Woman' | 'Unspecified';

export interface UserData {
  name: string;
  age: number;
  gender: Gender;
  makeupPreference?: boolean; // True for 'yes', false for 'no'. Relevant only if gender is 'Non specificato' or 'Unspecified'.
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  planType?: 'single' | 'pro';
  regenCredits: number[]; // Array of counts, e.g. [2, 2, 2, 2]
}

export interface EnhancedImage {
  original: string;
  generated: string;
  prompt: string; // Added to allow regeneration logic
  changes: string[];
}

export interface AnalysisResult {
  summary: string;
  diagnosticImage: string; // New field for the technical analysis image with lines
  recommendations: string[];
  enhancedImages: EnhancedImage[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}
