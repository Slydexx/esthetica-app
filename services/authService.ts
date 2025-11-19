
import { UserProfile } from '../types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
// To go LIVE: Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables (e.g., on Vercel/Netlify).
// If these are missing, the app falls back to "Mock Mode" (localStorage).

// Safely retrieve environment variables preventing crashes if import.meta.env is undefined
const getEnvVar = (key: string): string | undefined => {
    try {
        // Check for Vite/Modern standard
        if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
            return (import.meta as any).env[key];
        }
        // Check for Process/Node standard (fallback)
        if (typeof process !== 'undefined' && process.env && process.env[key]) {
            return process.env[key];
        }
    } catch (e) {
        console.warn('Environment variable access error', e);
    }
    return undefined;
};

const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL') || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY') || process.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

// Only initialize Supabase if keys are valid strings
if (SUPABASE_URL && typeof SUPABASE_URL === 'string' && SUPABASE_URL.startsWith('http') && SUPABASE_KEY) {
    try {
        supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (e) {
        console.error("Failed to initialize Supabase client:", e);
        supabase = null;
    }
}

// --- MOCK HELPERS (Fallback) ---
const STORAGE_KEY_USERS = 'visagismo_users';
const STORAGE_KEY_SESSION = 'visagismo_session';

interface DBUser extends UserProfile {
  passwordHash: string;
}

const getMockDB = (): DBUser[] => {
  try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      return stored ? JSON.parse(stored) : [];
  } catch {
      return [];
  }
};

const saveMockDB = (users: DBUser[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (e) {
      console.error("Local storage full or unavailable");
  }
};

// --- SERVICE IMPLEMENTATION ---

export const authService = {
  signUp: async (email: string, password: string, name: string): Promise<UserProfile> => {
    // REAL MODE
    if (supabase) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name } // This triggers the handle_new_user SQL function
            }
        });

        if (error) throw error;
        if (!data.user) throw new Error("Registration failed");

        // Return profile structure immediately for UI responsiveness
        return {
            id: data.user.id,
            email: data.user.email!,
            name: name,
            isPremium: false,
            regenCredits: [2, 2, 2, 2] // Default
        };
    }

    // MOCK MODE
    await new Promise(resolve => setTimeout(resolve, 800));
    const db = getMockDB();
    if (db.find(u => u.email === email)) throw new Error('Email already exists');

    const newUser: DBUser = {
      id: crypto.randomUUID(),
      email,
      name,
      passwordHash: password,
      isPremium: false,
      regenCredits: [2, 2, 2, 2]
    };

    db.push(newUser);
    saveMockDB(db);
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(newUser));
    const { passwordHash, ...profile } = newUser;
    return profile;
  },

  signIn: async (email: string, password: string): Promise<UserProfile> => {
    // --- ADMIN OVERRIDE FOR TESTING ---
    if (email.toLowerCase() === 'slide91@hotmail.it' && password === 'Demo123') {
        const adminProfile: UserProfile = {
            id: 'admin-super-user',
            email: email,
            name: 'Admin',
            isPremium: true, // FORCE PREMIUM
            planType: 'pro',
            regenCredits: [999, 999, 999, 999]
        };
        
        // Also save to local session so it persists on refresh in mock mode
        if (!supabase) {
            localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({ ...adminProfile, passwordHash: password }));
        }
        
        return adminProfile;
    }

    // REAL MODE
    if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
        if (profileError) throw profileError;

        return {
            id: profileData.id,
            email: profileData.email,
            name: profileData.full_name,
            isPremium: profileData.is_premium,
            planType: profileData.plan_type,
            regenCredits: profileData.regen_credits || [2, 2, 2, 2]
        };
    }

    // MOCK MODE
    await new Promise(resolve => setTimeout(resolve, 800));
    const db = getMockDB();
    const user = db.find(u => u.email === email && u.passwordHash === password);
    if (!user) throw new Error('Invalid credentials');

    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
    const { passwordHash, ...profile } = user;
    return profile;
  },

  signOut: async () => {
    if (supabase) {
        await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_KEY_SESSION);
  },

  resetPassword: async (email: string): Promise<void> => {
    // REAL MODE
    if (supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password',
        });
        if (error) throw error;
        return;
    }

    // MOCK MODE
    await new Promise(resolve => setTimeout(resolve, 800));
    const db = getMockDB();
    // We don't expose if email exists or not for security, but for mock we just resolve
    return;
  },

  getCurrentUser: async (): Promise<UserProfile | null> => {
    // REAL MODE
    if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;

        // Check if it's the hardcoded admin logged in via Supabase (unlikely but handled)
        if (session.user.email === 'slide91@hotmail.it') {
             return {
                id: session.user.id,
                email: session.user.email,
                name: 'Admin',
                isPremium: true,
                planType: 'pro',
                regenCredits: [999, 999, 999, 999]
             };
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (profile) {
             return {
                id: profile.id,
                email: profile.email,
                name: profile.full_name,
                isPremium: profile.is_premium,
                planType: profile.plan_type,
                regenCredits: profile.regen_credits || [2, 2, 2, 2]
            };
        }
        return null;
    }

    // MOCK MODE
    const session = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!session) return null;
    
    try {
        const sessionUser = JSON.parse(session) as DBUser;
        
        // Admin check in session
        if (sessionUser.email === 'slide91@hotmail.it') {
             const { passwordHash, ...profile } = sessionUser;
             return { ...profile, isPremium: true };
        }

        const db = getMockDB();
        const freshUser = db.find(u => u.id === sessionUser.id);
        
        if (freshUser) {
            const { passwordHash, ...profile } = freshUser;
            return profile;
        }
    } catch (e) {
        console.error("Error parsing session", e);
    }
    return null;
  },

  updateToPremium: async (userId: string, plan: 'single' | 'pro'): Promise<UserProfile> => {
     // REAL MODE
     if (supabase) {
         const { data, error } = await supabase
            .from('profiles')
            .update({ 
                is_premium: true,
                plan_type: plan,
                regen_credits: [10, 10, 10, 10] // Increased for single plan promo
            })
            .eq('id', userId)
            .select()
            .single();

         if (error) throw error;
         
         return {
            id: data.id,
            email: data.email,
            name: data.full_name,
            isPremium: data.is_premium,
            planType: data.plan_type,
            regenCredits: data.regen_credits
         };
     }

     // MOCK MODE
     await new Promise(resolve => setTimeout(resolve, 500));
     const db = getMockDB();
     const userIndex = db.findIndex(u => u.id === userId);
     if (userIndex === -1) throw new Error("User not found");

     db[userIndex].isPremium = true;
     db[userIndex].planType = plan;
     db[userIndex].regenCredits = [10, 10, 10, 10]; 

     saveMockDB(db);
     localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(db[userIndex]));
     const { passwordHash, ...profile } = db[userIndex];
     return profile;
  },
  
  consumeCredit: async (userId: string, slotIndex: number): Promise<number[]> => {
      // REAL MODE
      if (supabase) {
          // 1. Get current credits
          const { data: user, error: fetchError } = await supabase
            .from('profiles')
            .select('regen_credits')
            .eq('id', userId)
            .single();
          
          if (fetchError || !user) throw new Error("User fetch failed");

          const credits = user.regen_credits as number[];
          
          if (credits[slotIndex] > 0) {
              credits[slotIndex]--;
              
              // 2. Update credits
              const { data: updatedUser, error: updateError } = await supabase
                .from('profiles')
                .update({ regen_credits: credits })
                .eq('id', userId)
                .select()
                .single();
                
              if (updateError) throw updateError;
              return updatedUser.regen_credits;
          }
          throw new Error("No credits left");
      }

      // MOCK MODE
      const db = getMockDB();
      const userIndex = db.findIndex(u => u.id === userId);
      if (userIndex === -1) throw new Error("User not found");
      
      if (db[userIndex].regenCredits[slotIndex] > 0) {
          db[userIndex].regenCredits[slotIndex]--;
          saveMockDB(db);
          localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(db[userIndex]));
          return db[userIndex].regenCredits;
      }
      throw new Error("No credits left");
  }
};
