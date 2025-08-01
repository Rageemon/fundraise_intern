import { supabase } from "@/integrations/supabase/client";

// Types that match our database schema
export interface Intern {
  id: string;
  name: string;
  email: string;
  referral_code: string;
  total_raised: number;
  donation_count: number;
  join_date: string;
  avatar: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  target_amount: number;
  reward_text: string;
  category: 'milestone' | 'achievement' | 'bonus';
  created_at?: string;
}

export interface LeaderboardEntry {
  rank: number;
  intern: Intern;
  monthlyRaised: number;
  percentChange: number;
}

// Service functions
export const supabaseDataService = {
  // Get all interns for leaderboard
  getAllInterns: async (): Promise<Intern[]> => {
    try {
      const { data, error } = await supabase
        .from('interns')
        .select('*')
        .order('total_raised', { ascending: false });
      
      if (error) {
        console.error('Error fetching interns:', error);
        return [];
      }
      
      return data?.map((intern) => ({
        id: intern.id,
        name: intern.name,
        email: intern.email,
        referral_code: intern.referral_code,
        total_raised: Number(intern.total_raised),
        donation_count: intern.donation_count,
        join_date: intern.join_date,
        avatar: intern.avatar || '/placeholder.svg'
      })) || [];
    } catch (error) {
      console.error('Error in getAllInterns:', error);
      return [];
    }
  },

  // Get all rewards
  getRewards: async (): Promise<Reward[]> => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .order('target_amount', { ascending: true });
      
      if (error) {
        console.error('Error fetching rewards:', error);
        return [];
      }
      
      return data?.map((reward) => ({
        id: reward.id,
        title: reward.title,
        description: reward.description,
        target_amount: Number(reward.target_amount),
        reward_text: reward.reward_text,
        category: reward.category as 'milestone' | 'achievement' | 'bonus'
      })) || [];
    } catch (error) {
      console.error('Error in getRewards:', error);
      return [];
    }
  },

  // Update intern's total raised amount
  updateInternRaised: async (internId: string, newAmount: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('interns')
        .update({ total_raised: newAmount })
        .eq('id', internId);
      
      if (error) {
        console.error('Error updating intern:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateInternRaised:', error);
      return false;
    }
  },

  // Add donation amount to intern
  addDonation: async (internId: string, amount: number): Promise<boolean> => {
    try {
      // Get current intern data
      const { data: intern, error: fetchError } = await supabase
        .from('interns')
        .select('total_raised, donation_count')
        .eq('id', internId)
        .single();
      
      if (fetchError || !intern) {
        console.error('Error fetching intern for update:', fetchError);
        return false;
      }
      
      // Update with new amounts
      const { error: updateError } = await supabase
        .from('interns')
        .update({ 
          total_raised: Number(intern.total_raised) + amount,
          donation_count: intern.donation_count + 1
        })
        .eq('id', internId);
      
      if (updateError) {
        console.error('Error updating intern donation:', updateError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in addDonation:', error);
      return false;
    }
  }
};

// Helper functions (similar to mock data)
export const getUnlockedRewards = (rewards: Reward[], totalRaised: number): Reward[] => {
  return rewards.filter(reward => totalRaised >= reward.target_amount);
};

export const getNextReward = (rewards: Reward[], totalRaised: number): Reward | null => {
  const nextReward = rewards.find(reward => totalRaised < reward.target_amount);
  return nextReward || null;
};

export const getProgressToNextReward = (rewards: Reward[], totalRaised: number): { progress: number; target: number; remaining: number } => {
  const nextReward = getNextReward(rewards, totalRaised);
  if (!nextReward) {
    return { progress: 100, target: rewards[rewards.length - 1]?.target_amount || 0, remaining: 0 };
  }
  
  const previousTarget = rewards.find(r => r.target_amount <= totalRaised)?.target_amount || 0;
  const progress = ((totalRaised - previousTarget) / (nextReward.target_amount - previousTarget)) * 100;
  
  return {
    progress: Math.min(progress, 100),
    target: nextReward.target_amount,
    remaining: nextReward.target_amount - totalRaised
  };
};

// Generate leaderboard data with mock monthly data
export const generateLeaderboardData = (interns: Intern[]): LeaderboardEntry[] => {
  return interns.map((intern, index) => ({
    rank: index + 1,
    intern,
    monthlyRaised: Math.floor(intern.total_raised * (0.3 + Math.random() * 0.4)), // 30-70% of total
    percentChange: Math.floor((Math.random() - 0.5) * 40) // -20% to +20%
  }));
};