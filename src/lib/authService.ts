import { supabase } from "@/integrations/supabase/client";
import { Intern } from "./supabaseData";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  referral_code: string;
  total_raised: number;
  donation_count: number;
  join_date: string;
  avatar: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const authService = {
  // Login user and get/create their data
  login: async (credentials: LoginCredentials): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    try {
      // First, try to sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        // If user doesn't exist, try to create account
        if (authError.message.includes('Invalid login credentials')) {
          return { success: false, error: "User not found. Please check your credentials or sign up." };
        }
        console.log(authError.message);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: "Authentication failed" };
      }

      // Check if user exists in our interns table
      const { data: internData, error: internError } = await supabase
        .from('interns')
        .select('*')
        .eq('email', credentials.email)
        .single();

      if (internError && internError.code === 'PGRST116') {
        // User not found in interns table, create new intern
        const newIntern = {
          id: authData.user.id,
          email: credentials.email,
          name: credentials.email.split('@')[0], // Use email prefix as name
          referral_code: generateReferralCode(credentials.email.split('@')[0]),
          total_raised: 0,
          donation_count: 0,
          join_date: new Date().toISOString(),
          avatar: null,
        };

        const { data: createdIntern, error: createError } = await supabase
          .from('interns')
          .insert([newIntern])
          .select()
          .single();

        if (createError) {
          console.error('Error creating intern:', createError);
          return { success: false, error: "Failed to create user profile" };
        }

        return { success: true, user: createdIntern };
      }

      if (internError) {
        console.error('Error fetching intern:', internError);
        return { success: false, error: "Failed to fetch user data" };
      }

      return { success: true, user: internData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: "An unexpected error occurred" };
    }
  },

  // Register new user
  register: async (userData: RegisterData): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: "Failed to create user account" };
      }

      // Create intern profile
      const newIntern = {
        id: authData.user.id,
        email: userData.email,
        name: userData.name,
        referral_code: generateReferralCode(userData.name),
        total_raised: 0,
        donation_count: 0,
        join_date: new Date().toISOString(),
        avatar: null,
      };

      const { data: createdIntern, error: createError } = await supabase
        .from('interns')
        .insert([newIntern])
        .select()
        .single();

      if (createError) {
        console.error('Error creating intern:', createError);
        return { success: false, error: "Failed to create user profile" };
      }

      return { success: true, user: createdIntern };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: "An unexpected error occurred" };
    }
  },

  // Get current authenticated user
  getCurrentUser: async (): Promise<AuthUser | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data: internData, error } = await supabase
        .from('interns')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !internData) {
        return null;
      }

      return internData;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Sign out user
  signOut: async (): Promise<void> => {
    await supabase.auth.signOut();
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  }
};

// Helper function to generate referral code
function generateReferralCode(userName: string): string {
  // Convert name to lowercase and remove spaces
  const cleanName = userName.toLowerCase().replace(/\s+/g, '');

  // Generate 4 random digits
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // between 1000-9999

  return `${cleanName}${randomDigits}`;
}
