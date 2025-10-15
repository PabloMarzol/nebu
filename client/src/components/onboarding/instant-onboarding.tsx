import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { 
  Zap, 
  Shield, 
  CheckCircle, 
  Clock, 
  Mail, 
  Phone, 
  User, 
  Camera,
  Upload,
  ArrowRight,
  Star
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  required: boolean;
  completed: boolean;
}

export default function InstantOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedTier, setSelectedTier] = useState("instant");

  const onboardingTiers = [
    {
      id: "instant",
      name: "Instant Start",
      time: "30 seconds",
      limit: "$1,000",
      features: ["Email verification", "Start trading immediately", "Basic portfolio"],
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "standard",
      name: "Standard",
      time: "2 minutes",
      limit: "$10,000",
      features: ["Phone verification", "ID upload", "Advanced features", "Higher limits"],
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "premium",
      name: "Premium",
      time: "24 hours",
      limit: "Unlimited",
      features: ["Full KYC verification", "Institutional features", "Priority support", "All features"],
      color: "from-cyan-500 to-blue-500"
    }
  ];

  const instantSteps: OnboardingStep[] = [
    {
      id: "email",
      title: "Email Verification",
      description: "Quick email verification to secure your account",
      timeEstimate: "15 seconds",
      required: true,
      completed: false
    },
    {
      id: "profile",
      title: "Basic Profile",
      description: "Just your name to personalize your experience",
      timeEstimate: "15 seconds",
      required: false,
      completed: false
    }
  ];

  const standardSteps: OnboardingStep[] = [
    ...instantSteps,
    {
      id: "phone",
      title: "Phone Verification",
      description: "SMS verification for additional security",
      timeEstimate: "1 minute",
      required: true,
      completed: false
    },
    {
      id: "id",
      title: "ID Upload",
      description: "Quick photo of your ID for compliance",
      timeEstimate: "1 minute",
      required: true,
      completed: false
    }
  ];

  const getStepsForTier = (tier: string) => {
    switch (tier) {
      case "instant": return instantSteps;
      case "standard": return standardSteps;
      case "premium": return [...standardSteps, {
        id: "advanced",
        title: "Advanced Verification",
        description: "Full compliance check for unlimited access",
        timeEstimate: "24 hours",
        required: true,
        completed: false
      }];
      default: return instantSteps;
    }
  };

  const currentSteps = getStepsForTier(selectedTier);
  const progress = ((currentStep + 1) / currentSteps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
            <Zap className="text-white w-6 h-6" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Instant Onboarding
        </h1>
        <p className="text-xl text-muted-foreground">Start trading in seconds, upgrade when ready</p>
      </div>

      {/* Tier Selection */}
      <Card className="glass-enhanced mb-8">
        <CardHeader>
          <CardTitle className="text-center">Choose Your Start</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {onboardingTiers.map((tier) => (
              <Card 
                key={tier.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedTier === tier.id 
                    ? 'ring-2 ring-purple-400 glass-enhanced' 
                    : 'glass hover:glass-enhanced'
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${tier.color} rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse`}>
                    {tier.id === "instant" && <Zap className="text-white w-8 h-8" />}
                    {tier.id === "standard" && <Shield className="text-white w-8 h-8" />}
                    {tier.id === "premium" && <Star className="text-white w-8 h-8" />}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <Badge variant="secondary" className="mb-3">
                    <Clock className="w-3 h-3 mr-1" />
                    {tier.time}
                  </Badge>
                  <div className="text-2xl font-bold text-green-400 mb-2">{tier.limit}</div>
                  <p className="text-sm text-muted-foreground mb-4">Daily trading limit</p>
                  <ul className="text-xs text-left space-y-1 mb-4">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${selectedTier === tier.id ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTier(tier.id);
                      setCurrentStep(0);
                    }}
                  >
                    {selectedTier === tier.id ? 'Selected' : 'Choose This Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Form */}
      <Card className="glass-enhanced">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Step {currentStep + 1} of {currentSteps.length}: {currentSteps[currentStep]?.title}
            </CardTitle>
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              {currentSteps[currentStep]?.timeEstimate}
            </Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedTier === "instant" && (
            <div className="space-y-6">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">Start Trading in 30 Seconds</h3>
                    <p className="text-muted-foreground">Just enter your email and you're ready to go</p>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 text-lg"
                    />
                  </div>
                  <Link href="/trading">
                    <Button 
                      size="lg" 
                      className="w-full btn-futuristic h-12 text-lg"
                      disabled={!email}
                    >
                      <Zap className="mr-2 h-5 w-5" />
                      Start Trading Instantly
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <div className="text-center text-sm text-muted-foreground space-y-2">
                    <p>By continuing, you agree to our legal documents:</p>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                      <Link href="/terms-of-service" className="text-purple-400 hover:text-purple-300 underline">Terms of Service</Link>
                      <Link href="/privacy-policy" className="text-purple-400 hover:text-purple-300 underline">Privacy Policy</Link>
                      <Link href="/aml-policy" className="text-purple-400 hover:text-purple-300 underline">AML Policy</Link>
                      <Link href="/risk-disclosure" className="text-red-400 hover:text-red-300 underline">Risk Disclosure</Link>
                    </div>
                    <p className="mt-2 text-green-400">✓ No credit card required • ✓ Start with $1000 demo balance</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTier === "standard" && (
            <div className="space-y-6">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">Standard Verification</h3>
                    <p className="text-muted-foreground">Get verified in 2 minutes for higher limits</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Link href="/kyc-verification">
                    <Button 
                      size="lg" 
                      className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-700"
                      disabled={!email || !firstName || !lastName || !phone}
                    >
                      <Shield className="mr-2 h-5 w-5" />
                      Continue to Verification
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {selectedTier === "premium" && (
            <div className="space-y-6">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">Premium Account Setup</h3>
                    <p className="text-muted-foreground">Full verification for unlimited access</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Corporate/Business Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="Business Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Star className="h-5 w-5 text-cyan-400 mr-2" />
                      <span className="font-semibold text-cyan-400">Premium Benefits</span>
                    </div>
                    <ul className="text-sm space-y-1">
                      <li>• Unlimited trading limits</li>
                      <li>• Priority customer support</li>
                      <li>• Advanced institutional features</li>
                      <li>• Dedicated account manager</li>
                    </ul>
                  </div>
                  <Link href="/compliance">
                    <Button 
                      size="lg" 
                      className="w-full h-12 text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                      disabled={!email || !firstName || !lastName || !phone}
                    >
                      <Star className="mr-2 h-5 w-5" />
                      Start Premium Verification
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}