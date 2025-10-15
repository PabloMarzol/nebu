import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Shield,
  Upload,
  Camera,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  FileText,
  Globe,
  CreditCard,
  Building,
  Eye,
  Download,
  Zap
} from "lucide-react";

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  required: boolean;
}

interface DocumentUpload {
  type: string;
  file?: File;
  status: "pending" | "uploaded" | "verified" | "rejected";
  rejectionReason?: string;
}

export default function KYCVerification() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationLevel, setVerificationLevel] = useState<1 | 2 | 3>(1);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    occupation: "",
    sourceOfFunds: "",
    politicallyExposed: false
  });

  const [documents, setDocuments] = useState<DocumentUpload[]>([
    { type: "passport", status: "pending" },
    { type: "nationalId", status: "pending" },
    { type: "proofOfAddress", status: "pending" },
    { type: "selfie", status: "pending" }
  ]);

  const verificationSteps: VerificationStep[] = [
    {
      id: "personal",
      title: "Personal Information",
      description: "Provide your basic personal details",
      status: "completed",
      required: true
    },
    {
      id: "documents",
      title: "Document Upload",
      description: "Upload required identification documents",
      status: "in_progress",
      required: true
    },
    {
      id: "verification",
      title: "Identity Verification",
      description: "Complete biometric verification",
      status: "pending",
      required: true
    },
    {
      id: "aml",
      title: "AML Screening",
      description: "Anti-money laundering compliance check",
      status: "pending",
      required: true
    },
    {
      id: "approval",
      title: "Final Approval",
      description: "Manual review and account activation",
      status: "pending",
      required: true
    }
  ];

  const handleFileUpload = (documentType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDocuments(prev => prev.map(doc => 
        doc.type === documentType 
          ? { ...doc, file, status: "uploaded" as const }
          : doc
      ));
    }
  };

  const submitVerification = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsSubmitting(false);
    setCurrentStep(prev => Math.min(prev + 1, verificationSteps.length - 1));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "in_progress": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "failed": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in_progress": return <Clock className="w-4 h-4 animate-pulse" />;
      case "failed": return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const calculateProgress = () => {
    const completedSteps = verificationSteps.filter(step => step.status === "completed").length;
    return (completedSteps / verificationSteps.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="glass border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Verification Progress</h3>
              <p className="text-sm text-muted-foreground">
                Complete all steps to unlock Level {verificationLevel} trading limits
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(calculateProgress())}%
              </div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          <Progress value={calculateProgress()} className="h-3" />
        </CardContent>
      </Card>

      {/* Verification Levels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`glass cursor-pointer transition-all ${verificationLevel === 1 ? 'border-green-500/50' : 'border-gray-600'}`}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-semibold mb-2">Level 1 - Basic</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Email verification only
            </p>
            <div className="space-y-1 text-xs">
              <div>• Trading limit: €1,000/day</div>
              <div>• Withdrawal limit: €500/day</div>
            </div>
            {verificationLevel >= 1 && (
              <Badge className="mt-3 bg-green-500/20 text-green-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card className={`glass cursor-pointer transition-all ${verificationLevel === 2 ? 'border-blue-500/50' : 'border-gray-600'}`}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold mb-2">Level 2 - Standard</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Identity verification required
            </p>
            <div className="space-y-1 text-xs">
              <div>• Trading limit: €50,000/day</div>
              <div>• Withdrawal limit: €10,000/day</div>
            </div>
            {verificationLevel >= 2 && (
              <Badge className="mt-3 bg-blue-500/20 text-blue-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card className={`glass cursor-pointer transition-all ${verificationLevel === 3 ? 'border-purple-500/50' : 'border-gray-600'}`}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold mb-2">Level 3 - Premium</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Enhanced due diligence
            </p>
            <div className="space-y-1 text-xs">
              <div>• Trading limit: Unlimited</div>
              <div>• Withdrawal limit: €100,000/day</div>
            </div>
            {verificationLevel >= 3 && (
              <Badge className="mt-3 bg-purple-500/20 text-purple-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="biometric">Biometric</TabsTrigger>
          <TabsTrigger value="aml">AML Check</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-6 h-6 text-blue-400" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={personalInfo.firstName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={personalInfo.lastName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter your last name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Select value={personalInfo.nationality} onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, nationality: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CZ">Czech Republic</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="IT">Italy</SelectItem>
                      <SelectItem value="ES">Spain</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={personalInfo.address}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your full address"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="pep"
                  checked={personalInfo.politicallyExposed}
                  onCheckedChange={(checked) => setPersonalInfo(prev => ({ ...prev, politicallyExposed: checked as boolean }))}
                />
                <Label htmlFor="pep" className="text-sm">
                  I am a Politically Exposed Person (PEP) or related to one
                </Label>
              </div>

              <Button className="w-full">Save Personal Information</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-green-400" />
                <span>Document Upload</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {documents.map((doc, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold capitalize">
                        {doc.type.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {doc.type === "passport" && "Valid passport or national ID"}
                        {doc.type === "nationalId" && "Government-issued ID card"}
                        {doc.type === "proofOfAddress" && "Utility bill or bank statement (max 3 months old)"}
                        {doc.type === "selfie" && "Clear selfie holding your ID document"}
                      </p>
                    </div>
                    <Badge className={getStatusColor(doc.status)} variant="outline">
                      {getStatusIcon(doc.status)}
                      <span className="ml-1 capitalize">{doc.status}</span>
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*,.pdf';
                        input.onchange = (e) => handleFileUpload(doc.type, e as any);
                        input.click();
                      }}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {doc.file ? 'Replace File' : 'Upload File'}
                    </Button>
                    
                    {doc.type === "selfie" && (
                      <Button variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        Take Photo
                      </Button>
                    )}
                  </div>

                  {doc.file && (
                    <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-sm text-blue-400">
                        <strong>Uploaded:</strong> {doc.file.name}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              <Button 
                className="w-full"
                onClick={submitVerification}
                disabled={isSubmitting || documents.some(doc => doc.status === "pending")}
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Submitting for Review...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Documents
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="biometric" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-6 h-6 text-purple-400" />
                <span>Biometric Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-12 h-12 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Face Verification</h3>
                <p className="text-muted-foreground mb-6">
                  Complete a quick live video verification to confirm your identity
                </p>
                <Button className="bg-purple-500 hover:bg-purple-600">
                  <Camera className="w-4 h-4 mr-2" />
                  Start Live Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aml" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-orange-400" />
                <span>AML Compliance Check</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-12 h-12 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Anti-Money Laundering Screening</h3>
                <p className="text-muted-foreground mb-6">
                  We're checking your information against global sanctions and watchlists
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-400 animate-pulse" />
                  <span className="text-orange-400">Screening in progress...</span>
                </div>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-semibold text-green-400">Preliminary Check Passed</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  No adverse findings in initial screening. Detailed review pending.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                <span>Verification Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {verificationSteps.map((step) => (
                  <div key={step.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                    <div className="flex-shrink-0">
                      {getStatusIcon(step.status)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    <Badge className={getStatusColor(step.status)} variant="outline">
                      {step.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="font-semibold mb-2">Current Status: Level 1 Verified</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  You can start trading with basic limits. Complete Level 2 verification to increase your limits.
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Verification Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}