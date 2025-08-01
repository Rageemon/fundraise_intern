import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Award, TrendingUp, TrendingDown } from "lucide-react";
import { supabaseDataService, generateLeaderboardData, type Intern, type LeaderboardEntry } from "@/lib/supabaseData";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<Intern | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        const [allInterns, userData] = await Promise.all([
          supabaseDataService.getAllInterns(),
          supabaseDataService.getCurrentUser()
        ]);
        
        const leaderboard = generateLeaderboardData(allInterns);
        setLeaderboardData(leaderboard);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error loading leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  const topPerformer = leaderboardData[0];
  const currentUserEntry = leaderboardData.find(entry => entry.intern.id === currentUser?.id);
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-warning" />;
      case 2:
        return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-warning text-warning-foreground";
      case 2:
        return "bg-muted text-muted-foreground";
      case 3:
        return "bg-amber-600/20 text-amber-600";
      default:
        return "secondary";
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            🏆 Fundraising Leaderboard
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how you rank against other interns in this month's fundraising challenge
          </p>
        </div>

        {/* Top Performer Spotlight */}
        {topPerformer && (
          <Card className="bg-gradient-warning border-warning/20 shadow-warning backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Trophy className="w-12 h-12 text-warning-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-warning-foreground">
                🎉 Top Performer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex justify-center">
                <Avatar className="w-20 h-20 border-4 border-warning-foreground/20">
                  <AvatarImage src={topPerformer.intern.avatar} alt={topPerformer.intern.name} />
                  <AvatarFallback className="text-lg font-bold bg-warning-foreground/10 text-warning-foreground">
                    {topPerformer.intern.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h3 className="text-xl font-bold text-warning-foreground">
                  {topPerformer.intern.name}
                </h3>
                <p className="text-warning-foreground/80">
                  ${topPerformer.intern.total_raised.toLocaleString()} raised total
                </p>
              </div>
                <Badge className="bg-warning-foreground/20 text-warning-foreground border-warning-foreground/20">
                  Leading by ${(topPerformer.intern.total_raised - (leaderboardData[1]?.intern.total_raised || 0)).toLocaleString()}
                </Badge>
            </CardContent>
          </Card>
        )}

        {/* Your Ranking */}
        {currentUserEntry && (
          <Card className="bg-gradient-primary border-primary/20 shadow-glow backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary-foreground">
                <TrendingUp className="w-5 h-5" />
                Your Current Ranking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {getRankIcon(currentUserEntry.rank)}
                  <div>
                    <p className="font-bold text-primary-foreground">
                      Rank #{currentUserEntry.rank}
                    </p>
                    <p className="text-sm text-primary-foreground/80">
                      ${currentUserEntry.intern.total_raised.toLocaleString()} raised
                    </p>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="flex items-center gap-2">
                    {currentUserEntry.percentChange >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span className={cn(
                      "text-sm font-medium",
                      currentUserEntry.percentChange >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {currentUserEntry.percentChange >= 0 ? '+' : ''}{currentUserEntry.percentChange}%
                    </span>
                  </div>
                  <p className="text-xs text-primary-foreground/60">vs last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Full Leaderboard */}
        <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning" />
              All Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboardData.map((entry) => {
                const isCurrentUser = entry.intern.id === currentUser?.id;
                const progressPercentage = (entry.intern.total_raised / topPerformer.intern.total_raised) * 100;
                
                return (
                  <div
                    key={entry.intern.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border transition-smooth hover:scale-[1.02]",
                      isCurrentUser 
                        ? "bg-primary/10 border-primary/30 shadow-glow" 
                        : "bg-muted/20 border-border/50 hover:bg-muted/40"
                    )}
                  >
                    {/* Rank */}
                    <div className="flex items-center gap-3 min-w-[60px]">
                      {getRankIcon(entry.rank)}
                      <Badge 
                        className={cn(
                          entry.rank <= 3 ? getRankBadgeVariant(entry.rank) : "",
                          entry.rank > 3 ? "secondary" : ""
                        )}
                      >
                        #{entry.rank}
                      </Badge>
                    </div>

                    {/* Avatar & Name */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className={cn(
                        "w-12 h-12",
                        isCurrentUser && "ring-2 ring-primary"
                      )}>
                        <AvatarImage src={entry.intern.avatar} alt={entry.intern.name} />
                        <AvatarFallback className="font-bold">
                          {entry.intern.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-semibold truncate",
                          isCurrentUser && "text-primary"
                        )}>
                          {entry.intern.name}
                          {isCurrentUser && " (You)"}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {entry.intern.referral_code}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex-1 max-w-xs space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Raised</span>
                        <span className="font-medium">
                          ${entry.intern.total_raised.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    {/* Monthly Change */}
                    <div className="text-right min-w-[80px]">
                      <div className="flex items-center gap-1 justify-end">
                        {entry.percentChange >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-success" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-destructive" />
                        )}
                        <span className={cn(
                          "text-sm font-medium",
                          entry.percentChange >= 0 ? "text-success" : "text-destructive"
                        )}>
                          {entry.percentChange >= 0 ? '+' : ''}{entry.percentChange}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ${entry.monthlyRaised.toLocaleString()} this month
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Motivational Footer */}
        <Card className="bg-gradient-success border-success/20 shadow-success backdrop-blur-sm text-center">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold text-success-foreground mb-2">
              Keep Going! 💪
            </h3>
            <p className="text-success-foreground/80">
              Every donation counts. Stay motivated and climb the leaderboard!
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Leaderboard;