import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Trophy, Gift, TrendingUp, Users, Target } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center space-y-8">
        {/* Logo and Title */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-glow">
              <DollarSign className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FundRaise Pro
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The ultimate intern portal for tracking donations, competing with peers, and unlocking amazing rewards
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/login">
            <Button variant="premium" size="lg" className="gap-2 text-lg px-8 py-6">
              <DollarSign className="w-5 h-5" />
              Sign In to Portal
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline" size="lg" className="gap-2 text-lg px-8 py-6">
              Join as New Intern
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-6xl mx-auto">
          <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm hover:scale-105 transition-smooth">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-success rounded-lg flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6 text-success-foreground" />
              </div>
              <h3 className="text-xl font-bold">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your donations, view detailed analytics, and track your fundraising journey
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm hover:scale-105 transition-smooth">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-warning rounded-lg flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6 text-warning-foreground" />
              </div>
              <h3 className="text-xl font-bold">Compete & Win</h3>
              <p className="text-muted-foreground">
                Climb the leaderboard, compete with fellow interns, and see how you rank
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm hover:scale-105 transition-smooth">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
                <Gift className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Unlock Rewards</h3>
              <p className="text-muted-foreground">
                Earn amazing rewards and bonuses as you hit fundraising milestones
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold bg-gradient-success bg-clip-text text-transparent">
              $250K+
            </div>
            <p className="text-muted-foreground">Total Raised</p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold bg-gradient-warning bg-clip-text text-transparent">
              50+
            </div>
            <p className="text-muted-foreground">Active Interns</p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              100+
            </div>
            <p className="text-muted-foreground">Rewards Unlocked</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border/50 text-sm text-muted-foreground">
          <p>Ready to start your fundraising journey? Join the intern portal today!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
