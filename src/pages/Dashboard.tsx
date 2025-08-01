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
  Calendar
} from "lucide-react";
import { currentUser, rewards, getProgressToNextReward, getUnlockedRewards } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const progressData = getProgressToNextReward(currentUser.totalRaised);
  const unlockedRewards = getUnlockedRewards(currentUser.totalRaised);
  
  const copyReferralCode = () => {
    navigator.clipboard.writeText(currentUser.referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const shareProgress = () => {
    const shareText = `I've raised $${currentUser.totalRaised.toLocaleString()} for our fundraising campaign! Join me with code: ${currentUser.referralCode}`;
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
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Raised"
            value={`$${currentUser.totalRaised.toLocaleString()}`}
            icon={<DollarSign className="w-5 h-5" />}
            trend="+12% this month"
            gradient="bg-gradient-success"
          />
          <MetricCard
            title="Donations"
            value={currentUser.donationCount}
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
            value={Math.floor((new Date().getTime() - new Date(currentUser.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
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
                  {currentUser.referralCode}
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
                  ${currentUser.totalRaised.toLocaleString()} / ${progressData.target.toLocaleString()}
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
                target={reward.target}
                current={currentUser.totalRaised}
                reward={reward.reward}
                isUnlocked={currentUser.totalRaised >= reward.target}
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
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;