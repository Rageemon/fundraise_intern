import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { RewardCard } from "@/components/RewardCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Copy, 
  Share2,
  Target,
  Gift,
  Calendar,
  LogOut
} from "lucide-react";
import { supabaseDataService, getProgressToNextReward, getUnlockedRewards, generateLeaderboardData, type Intern, type Reward } from "@/lib/supabaseData";
import { authService, type AuthUser } from "@/lib/authService";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get authenticated user
        const user = await authService.getCurrentUser();
        if (!user) {
          toast({
            title: "Authentication Required",
            description: "Please log in to access your dashboard.",
            variant: "destructive"
          });
          navigate("/login");
          return;
        }

        const rewardsData = await supabaseDataService.getRewards();
        
        setCurrentUser(user);
        setRewards(rewardsData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [toast, navigate]);
  
  const handleSignOut = async () => {
    try {
      await authService.signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate("/login");
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (loading || !currentUser) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  const progressData = getProgressToNextReward(rewards, currentUser.total_raised);
  const unlockedRewards = getUnlockedRewards(rewards, currentUser.total_raised);
  
  const copyReferralCode = () => {
    navigator.clipboard.writeText(currentUser.referral_code);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const shareProgress = () => {
    const shareText = `I've raised $${currentUser.total_raised.toLocaleString()} for our fundraising campaign! Join me with code: ${currentUser.referral_code}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Fundraising Progress',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied!",
        description: "Share text copied to clipboard",
      });
    }
  };

  // Demo function to simulate receiving a donation
  const simulateDonation = async () => {
    const donationAmount = Math.floor(Math.random() * 500) + 100; // $100-$600
    const success = await supabaseDataService.addDonation(currentUser.id, donationAmount);
    
    if (success) {
      // Update local state
      setCurrentUser(prev => prev ? {
        ...prev,
        total_raised: prev.total_raised + donationAmount,
        donation_count: prev.donation_count + 1
      } : null);
      
      toast({
        title: "🎉 New Donation!",
        description: `Received $${donationAmount.toLocaleString()} donation! Your total is now $${(currentUser.total_raised + donationAmount).toLocaleString()}`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add donation. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Welcome back, {currentUser.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your fundraising progress and unlock amazing rewards
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={shareProgress} className="gap-2">
              <Share2 className="w-4 h-4" />
              Share Progress
            </Button>
            <Button variant="premium" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              View Analytics
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Raised"
            value={`$${currentUser.total_raised.toLocaleString()}`}
            icon={<DollarSign className="w-5 h-5" />}
            trend="+12% this month"
            gradient="bg-gradient-success"
          />
          <MetricCard
            title="Donations"
            value={currentUser.donation_count}
            icon={<Users className="w-5 h-5" />}
            trend="+3 this week"
          />
          <MetricCard
            title="Rewards Unlocked"
            value={unlockedRewards.length}
            icon={<Gift className="w-5 h-5" />}
            gradient="bg-gradient-warning"
          />
          <MetricCard
            title="Days Active"
            value={Math.floor((new Date().getTime() - new Date(currentUser.join_date).getTime()) / (1000 * 60 * 60 * 24))}
            icon={<Calendar className="w-5 h-5" />}
          />
        </div>

        {/* Referral Code Section */}
        <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Your Referral Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg border border-border/50">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Share this code to earn bonuses:</p>
                <code className="text-lg font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded">
                  {currentUser.referral_code}
                </code>
              </div>
              <Button variant="outline" size="sm" onClick={copyReferralCode} className="gap-2">
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Earn 5% bonus on all donations made using your referral code!
            </p>
          </CardContent>
        </Card>

        {/* Progress to Next Reward */}
        <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                Progress to Next Reward
              </span>
              <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
                {progressData.progress.toFixed(0)}% Complete
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Progress</span>
                <span className="font-medium">
                  ${currentUser.total_raised.toLocaleString()} / ${progressData.target.toLocaleString()}
                </span>
              </div>
              <Progress value={progressData.progress} className="h-3" />
            </div>
            
            {progressData.remaining > 0 && (
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <p className="text-sm font-medium text-success">
                  Only ${progressData.remaining.toLocaleString()} away from your next reward! 🎯
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rewards Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Rewards & Achievements</h2>
            <Badge variant="outline" className="text-sm">
              {unlockedRewards.length} of {rewards.length} unlocked
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <RewardCard
                key={reward.id}
                title={reward.title}
                description={reward.description}
                target={reward.target_amount}
                current={currentUser.total_raised}
                reward={reward.reward_text}
                isUnlocked={currentUser.total_raised >= reward.target_amount}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm">
                📊 View Analytics
              </Button>
              <Button variant="outline" size="sm">
                📧 Email Campaign
              </Button>
              <Button variant="outline" size="sm">
                🎯 Set Goals
              </Button>
              <Button variant="outline" size="sm">
                💡 Get Tips
              </Button>
              <Button 
                variant="premium" 
                size="sm" 
                onClick={simulateDonation}
                className="gap-2"
              >
                💰 Simulate Donation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;