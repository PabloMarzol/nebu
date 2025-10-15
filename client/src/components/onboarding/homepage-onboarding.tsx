import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { 
  Zap, 
  Shield, 
  CheckCircle, 
  Clock, 
  Mail, 
  User, 
  ArrowRight,
  Star,
  TrendingUp,
  Wallet,
  Globe,
  Phone
} from "lucide-react";

interface OnboardingStage {
  id: number;
  title: string;
  description: string;
  timeEstimate: string;
  benefits: string[];
}

export default function HomepageOnboarding() {
  const [currentStage, setCurrentStage] = useState(1);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const stages: OnboardingStage[] = [
    {
      id: 1,
      title: "Quick Start",
      description: "Get trading access in 30 seconds",
      timeEstimate: "30s",
      benefits: ["Instant demo account", "$1,000 virtual balance", "Basic trading features"]
    },
    {
      id: 2,
      title: "Enhanced Access",
      description: "Unlock advanced features",
      timeEstimate: "2min",
      benefits: ["Real trading up to $10K", "Advanced charting", "Portfolio analytics"]
    },
    {
      id: 3,
      title: "Full Platform",
      description: "Complete verification for unlimited access",
      timeEstimate: "24hrs",
      benefits: ["Unlimited trading", "Institutional features", "Priority support"]
    }
  ];

  const progress = (currentStage / 3) * 100;

  const handleStageComplete = () => {
    if (currentStage < 3) {
      setCurrentStage(currentStage + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleQuickStart = () => {
    console.log("Creating quick start account with:", { email, firstName, lastName });
    handleStageComplete();
  };

  if (isCompleted) {
    return (
      <Card className="glass-enhanced max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="text-white w-10 h-10" />
          </div>
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Welcome to Nebula X!
          </h3>
          <p className="text-xl text-muted-foreground mb-6">
            Your account is ready. Start exploring the future of crypto trading.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/trading">
              <Button 
                size="lg" 
                className="btn-futuristic"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Start Trading
              </Button>
            </Link>
            <Link href="/markets">
              <Button 
                size="lg" 
                variant="outline"
              >
                <Globe className="mr-2 h-5 w-5" />
                Explore Markets
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Join Nebula X in 3 Simple Steps
        </h2>
        <div className="flex justify-center items-center space-x-4 mb-6">
          {stages.map((stage) => (
            <div key={stage.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentStage >= stage.id 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {currentStage > stage.id ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="font-bold">{stage.id}</span>
                )}
              </div>
              {stage.id < 3 && (
                <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                  currentStage > stage.id ? 'bg-purple-500' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        <Progress value={progress} className="max-w-md mx-auto" />
      </div>

      {/* Stage Cards Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stages.map((stage) => (
          <Card 
            key={stage.id}
            className={`transition-all duration-300 ${
              currentStage === stage.id 
                ? 'glass-enhanced ring-2 ring-purple-400 scale-105' 
                : currentStage > stage.id
                ? 'glass border-green-400/40'
                : 'glass opacity-60'
            }`}
          >
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                currentStage >= stage.id 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                  : 'bg-muted'
              }`}>
                {stage.id === 1 && <Zap className="text-white w-6 h-6" />}
                {stage.id === 2 && <Shield className="text-white w-6 h-6" />}
                {stage.id === 3 && <Star className="text-white w-6 h-6" />}
              </div>
              <h3 className="font-bold mb-2">{stage.title}</h3>
              <Badge variant="secondary" className="mb-3">
                <Clock className="w-3 h-3 mr-1" />
                {stage.timeEstimate}
              </Badge>
              <p className="text-sm text-muted-foreground mb-3">{stage.description}</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {stage.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-left">
                    <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Stage Form */}
      <Card className="glass-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Stage {currentStage}: {stages[currentStage - 1].title}</span>
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              {stages[currentStage - 1].timeEstimate}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStage === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Start Trading in 30 Seconds</h3>
                <p className="text-muted-foreground">Get instant access with just your email</p>
              </div>
              
              <div className="space-y-4 max-w-md mx-auto">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>

                <Link href="/trading">
                  <Button 
                    size="lg" 
                    className="w-full btn-futuristic h-12"
                    disabled={!email || !firstName || !agreeTerms}
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Start Trading Instantly
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <div className="text-center text-sm text-muted-foreground">
                  <p className="text-green-400">✓ $1,000 demo balance • ✓ No credit card required</p>
                </div>
              </div>
            </div>
          )}

          {currentStage === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Unlock Enhanced Features</h3>
                <p className="text-muted-foreground">Add phone verification for real trading up to $10K</p>
              </div>
              
              <div className="space-y-4 max-w-md mx-auto">
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>

                <Button 
                  size="lg" 
                  className="w-full btn-futuristic h-12"
                  onClick={handleStageComplete}
                  disabled={!phone}
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Verify Phone & Upgrade
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleStageComplete}
                >
                  Skip for Now
                </Button>
              </div>
            </div>
          )}

          {currentStage === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Complete Full Verification</h3>
                <p className="text-muted-foreground">Upload ID for unlimited trading and all premium features</p>
              </div>
              
              <div className="space-y-4 max-w-md mx-auto">
                <div className="border-2 border-dashed border-muted-foreground rounded-lg p-8 text-center">
                  <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Upload ID Document</p>
                  <p className="text-muted-foreground mb-4">Passport, driver's license, or national ID</p>
                  <Button variant="outline">
                    Choose File
                  </Button>
                </div>

                <Button 
                  size="lg" 
                  className="w-full btn-futuristic h-12"
                  onClick={handleStageComplete}
                >
                  <Star className="mr-2 h-5 w-5" />
                  Complete Verification
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleStageComplete}
                >
                  Complete Later
                </Button>
              </div>
            </div>
          )}

          {/* Benefits Preview */}
          <Card className="glass border-purple-400/20">
            <CardContent className="p-4">
              <h4 className="font-semibold text-purple-400 mb-2">What you'll get:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {stages[currentStage - 1].benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}