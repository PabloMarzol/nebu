import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  CheckCircle,
  Clock,
  Upload,
  Smartphone,
  CreditCard,
  Shield,
  Zap,
  ArrowRight,
  User,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

interface VerificationTier {
  id: string;
  name: string;
  dailyLimit: string;
  monthlyLimit: string;
  requirements: string[];
  timeToComplete: string;
  features: string[];
  recommended?: boolean;
}

export default function SimplifiedKYC() {
  const [selectedTier, setSelectedTier] = useState("basic");
  const [currentStep, setCurrentStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);

  const verificationTiers: VerificationTier[] = [
    {
      id: "trial",
      name: "Trial Account",
      dailyLimit: "$500",
      monthlyLimit: "$2,000",
      requirements: ["Email verification only"],
      timeToComplete: "30 seconds",
      features: ["Basic trading", "Market exploration", "Limited access"]
    },
    {
      id: "basic",
      name: "VASP Verified",
      dailyLimit: "$3,000",
      monthlyLimit: "$15,000",
      requirements: ["Government ID", "Address verification"],
      timeToComplete: "24-48 hours",
      features: ["Full trading access", "VASP compliant", "Standard support"],
      recommended: true
    },
    {
      id: "enhanced",
      name: "Enhanced Access",
      dailyLimit: "$25,000",
      monthlyLimit: "$100,000",
      requirements: ["Enhanced verification", "Source of funds"],
      timeToComplete: "2-5 business days",
      features: ["High limits", "Priority support", "Advanced features"]
    },
    {
      id: "institutional",
      name: "Institutional",
      dailyLimit: "$500,000+",
      monthlyLimit: "Unlimited",
      requirements: ["Enhanced due diligence", "Business verification"],
      timeToComplete: "5-10 business days",
      features: ["Unlimited access", "Dedicated manager", "Custom solutions"]
    }
  ];

  const quickVerificationSteps = [
    {
      id: 1,
      title: "Basic Information",
      description: "Name, email, and phone number",
      icon: User,
      fields: ["Full Name", "Email Address", "Phone Number"]
    },
    {
      id: 2,
      title: "ID Verification",
      description: "Quick photo of your ID document",
      icon: CreditCard,
      fields: ["ID Type", "ID Photo"]
    },
    {
      id: 3,
      title: "Ready to Trade",
      description: "Verification complete!",
      icon: CheckCircle,
      fields: []
    }
  ];

  const handleQuickVerification = async () => {
    setIsVerifying(true);
    
    // Simulate quick verification process
    for (let step = 1; step <= 3; step++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(step);
    }
    
    setIsVerifying(false);
  };

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return "completed";
    if (stepNumber === currentStep) return "active";
    return "pending";
  };

  return (
    <div className="space-y-6">
      {/* Quick Start Banner */}
      <Card className="glass border-green-500/30 bg-gradient-to-r from-green-500/10 to-blue-500/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-400">Start Trading in 30 Seconds</h3>
                <p className="text-sm text-muted-foreground">
                  No documents required - just email and phone verification
                </p>
              </div>
            </div>
            <Link href="/onboarding">
              <Button 
                className="bg-green-600 hover:bg-green-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Quick Start
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Verification Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {verificationTiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={`glass cursor-pointer transition-all duration-300 hover:shadow-2xl ${
              selectedTier === tier.id 
                ? 'border-blue-500 ring-2 ring-blue-500/20' 
                : 'border-border hover:border-blue-500/50'
            } ${tier.recommended ? 'border-purple-500/30' : ''}`}
            onClick={() => setSelectedTier(tier.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                {tier.recommended && (
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500">
                    Recommended
                  </Badge>
                )}
              </div>
              <div className="text-2xl font-bold text-blue-400">{tier.dailyLimit}/day</div>
              <div className="text-sm text-muted-foreground">{tier.monthlyLimit}/month</div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-semibold mb-2 text-green-400">
                  ⏱ {tier.timeToComplete}
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground">Requirements:</div>
                  {tier.requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-1 h-1 bg-blue-400 rounded-full" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Includes:</div>
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Tier Verification Process */}
      {selectedTier && (
        <Card className="glass border-blue-500/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-400" />
              <span>
                {verificationTiers.find(t => t.id === selectedTier)?.name} Process
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedTier === "instant" ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h4 className="font-semibold text-green-400 mb-2">Instant Access Available</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start trading immediately with basic email and phone verification.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Email Address</label>
                      <Input placeholder="your@email.com" type="email" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Phone Number</label>
                      <Input placeholder="+1 (555) 123-4567" type="tel" />
                    </div>
                  </div>
                  <Link href="/trading">
                    <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                      <Zap className="w-4 h-4 mr-2" />
                      Verify & Start Trading Now
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress Steps */}
                <div className="flex items-center justify-between">
                  {quickVerificationSteps.map((step, index) => {
                    const IconComponent = step.icon;
                    const status = getStepStatus(step.id);
                    
                    return (
                      <div key={step.id} className="flex items-center">
                        <div className={`flex items-center space-x-3 ${
                          index < quickVerificationSteps.length - 1 ? 'mr-4' : ''
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            status === "completed" ? "bg-green-500 border-green-500" :
                            status === "active" ? "bg-blue-500 border-blue-500" :
                            "bg-gray-600 border-gray-600"
                          }`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className="hidden md:block">
                            <div className={`text-sm font-semibold ${
                              status === "active" ? "text-blue-400" : 
                              status === "completed" ? "text-green-400" : "text-gray-400"
                            }`}>
                              {step.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {step.description}
                            </div>
                          </div>
                        </div>
                        
                        {index < quickVerificationSteps.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Current Step Content */}
                {currentStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Full Name</label>
                      <Input placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Email Address</label>
                      <Input placeholder="user@nebulaxexchange.io" type="email" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Phone Number</label>
                      <Input placeholder="+1 (555) 123-4567" type="tel" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Country</label>
                      <select className="w-full p-3 bg-background border border-border rounded-lg">
                        <option value="CZ">Czech Republic</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="DE">Germany</option>
                      </select>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">ID Document Type</label>
                      <select className="w-full p-3 bg-background border border-border rounded-lg mb-4">
                        <option value="passport">Passport</option>
                        <option value="drivers_license">Driver's License</option>
                        <option value="national_id">National ID Card</option>
                      </select>
                    </div>
                    
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Take a clear photo of your ID document
                      </p>
                      <Button variant="outline">
                        <Smartphone className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-400 mb-2">Verification Complete!</h3>
                    <p className="text-muted-foreground mb-6">
                      Your account is now verified and ready for trading.
                    </p>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-green-500/10 rounded-lg">
                        <div className="text-lg font-bold text-green-400">$10,000</div>
                        <div className="text-xs text-muted-foreground">Daily Limit</div>
                      </div>
                      <div className="p-4 bg-blue-500/10 rounded-lg">
                        <div className="text-lg font-bold text-blue-400">$50,000</div>
                        <div className="text-xs text-muted-foreground">Monthly Limit</div>
                      </div>
                      <div className="p-4 bg-purple-500/10 rounded-lg">
                        <div className="text-lg font-bold text-purple-400">All Features</div>
                        <div className="text-xs text-muted-foreground">Unlocked</div>
                      </div>
                    </div>
                    <Link href="/trading">
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Start Trading Now
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Action Button */}
                {currentStep < 3 && (
                  <Button 
                    onClick={handleQuickVerification}
                    disabled={isVerifying}
                    className="w-full"
                  >
                    {isVerifying ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Continue Verification
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Benefits of Verification */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Why Verify Your Account?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Enhanced Security</h4>
              <p className="text-sm text-muted-foreground">
                Protect your account and funds with verified identity
              </p>
            </div>
            
            <div className="text-center">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Higher Limits</h4>
              <p className="text-sm text-muted-foreground">
                Access increased trading and withdrawal limits
              </p>
            </div>
            
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Full Features</h4>
              <p className="text-sm text-muted-foreground">
                Unlock all platform features and priority support
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}