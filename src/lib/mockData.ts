// Mock data for the fundraising portal
export interface Intern {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  totalRaised: number;
  donationCount: number;
  joinDate: string;
  avatar: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  target: number;
  reward: string;
  category: 'milestone' | 'achievement' | 'bonus';
}

export interface LeaderboardEntry {
  rank: number;
  intern: Intern;
  monthlyRaised: number;
  percentChange: number;
}

// Current user data
export const currentUser: Intern = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@company.com',
  referralCode: 'alexjohnson2025',
  totalRaised: 15750,
  donationCount: 23,
  joinDate: '2024-01-15',
  avatar: '/placeholder.svg'
};

// Rewards data
export const rewards: Reward[] = [
  {
    id: '1',
    title: 'First Step',
    description: 'Raise your first $1,000 to unlock this achievement',
    target: 1000,
    reward: '$50 Gift Card',
    category: 'milestone'
  },
  {
    id: '2',
    title: 'Rising Star',
    description: 'Reach $5,000 in total donations',
    target: 5000,
    reward: 'Premium Lunch + Recognition',
    category: 'milestone'
  },
  {
    id: '3',
    title: 'Fundraising Pro',
    description: 'Cross the $10,000 milestone',
    target: 10000,
    reward: '$200 Bonus + Certificate',
    category: 'milestone'
  },
  {
    id: '4',
    title: 'Champion',
    description: 'Achieve $25,000 in fundraising',
    target: 25000,
    reward: '$500 Bonus + Team Dinner',
    category: 'achievement'
  },
  {
    id: '5',
    title: 'Legend',
    description: 'Reach the ultimate goal of $50,000',
    target: 50000,
    reward: '$1000 Bonus + Trophy',
    category: 'achievement'
  }
];

// Mock interns for leaderboard
export const mockInterns: Intern[] = [
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    referralCode: 'sarahchen2025',
    totalRaised: 23400,
    donationCount: 31,
    joinDate: '2024-01-10',
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Marcus Rodriguez',
    email: 'marcus.rodriguez@company.com',
    referralCode: 'marcusrodriguez2025',
    totalRaised: 19800,
    donationCount: 28,
    joinDate: '2024-01-12',
    avatar: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Emma Thompson',
    email: 'emma.thompson@company.com',
    referralCode: 'emmathompson2025',
    totalRaised: 17200,
    donationCount: 25,
    joinDate: '2024-01-18',
    avatar: '/placeholder.svg'
  },
  currentUser,
  {
    id: '5',
    name: 'David Kim',
    email: 'david.kim@company.com',
    referralCode: 'davidkim2025',
    totalRaised: 12900,
    donationCount: 19,
    joinDate: '2024-01-20',
    avatar: '/placeholder.svg'
  },
  {
    id: '6',
    name: 'Jessica Williams',
    email: 'jessica.williams@company.com',
    referralCode: 'jessicawilliams2025',
    totalRaised: 11500,
    donationCount: 16,
    joinDate: '2024-01-25',
    avatar: '/placeholder.svg'
  }
];

// Generate leaderboard data
export const leaderboardData: LeaderboardEntry[] = mockInterns
  .sort((a, b) => b.totalRaised - a.totalRaised)
  .map((intern, index) => ({
    rank: index + 1,
    intern,
    monthlyRaised: Math.floor(intern.totalRaised * (0.3 + Math.random() * 0.4)), // 30-70% of total
    percentChange: Math.floor((Math.random() - 0.5) * 40) // -20% to +20%
  }));

// Helper functions
export const getUnlockedRewards = (totalRaised: number): Reward[] => {
  return rewards.filter(reward => totalRaised >= reward.target);
};

export const getNextReward = (totalRaised: number): Reward | null => {
  const nextReward = rewards.find(reward => totalRaised < reward.target);
  return nextReward || null;
};

export const getProgressToNextReward = (totalRaised: number): { progress: number; target: number; remaining: number } => {
  const nextReward = getNextReward(totalRaised);
  if (!nextReward) {
    return { progress: 100, target: rewards[rewards.length - 1].target, remaining: 0 };
  }
  
  const previousTarget = rewards.find(r => r.target <= totalRaised)?.target || 0;
  const progress = ((totalRaised - previousTarget) / (nextReward.target - previousTarget)) * 100;
  
  return {
    progress: Math.min(progress, 100),
    target: nextReward.target,
    remaining: nextReward.target - totalRaised
  };
};