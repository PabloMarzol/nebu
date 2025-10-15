import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Globe, Twitter, MessageSquare, AlertTriangle, CheckCircle, DollarSign } from "lucide-react";

interface ProposalFormData {
  name: string;
  symbol: string;
  description: string;
  website: string;
  whitepaper: string;
  contractAddress: string;
  blockchain: string;
  category: string;
  marketCap: string;
  volume24h: string;
  holders: string;
  twitter: string;
  telegram: string;
  discord: string;
  auditReport: string;
  teamInfo: string;
  useCase: string;
  roadmap: string;
  tokenomics: string;
  agreedToTerms: boolean;
  submissionFee: boolean;
}

export default function ProposalSubmission() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProposalFormData>({
    name: "",
    symbol: "",
    description: "",
    website: "",
    whitepaper: "",
    contractAddress: "",
    blockchain: "",
    category: "",
    marketCap: "",
    volume24h: "",
    holders: "",
    twitter: "",
    telegram: "",
    discord: "",
    auditReport: "",
    teamInfo: "",
    useCase: "",
    roadmap: "",
    tokenomics: "",
    agreedToTerms: false,
    submissionFee: false
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const submissionFee = 500; // USDT

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const categories = [
    "DeFi", "Gaming", "AI", "Healthcare", "Green Energy", "Real Estate",
    "Social Media", "Education", "Entertainment", "Infrastructure",
    "Privacy", "Supply Chain", "Insurance", "Legal"
  ];

  const blockchains = [
    "Ethereum", "Binance Smart Chain", "Polygon", "Solana", "Avalanche",
    "Cardano", "Polkadot", "Cosmos", "Near", "Fantom"
  ];

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name) errors.name = "Project name is required";
        if (!formData.symbol) errors.symbol = "Token symbol is required";
        if (!formData.description || formData.description.length < 100) {
          errors.description = "Description must be at least 100 characters";
        }
        if (!formData.category) errors.category = "Category is required";
        if (!formData.blockchain) errors.blockchain = "Blockchain is required";
        break;

      case 2:
        if (!formData.website || !isValidUrl(formData.website)) {
          errors.website = "Valid website URL is required";
        }
        if (!formData.contractAddress || !isValidContractAddress(formData.contractAddress)) {
          errors.contractAddress = "Valid contract address is required";
        }
        if (!formData.marketCap) errors.marketCap = "Market cap is required";
        if (!formData.volume24h) errors.volume24h = "24h volume is required";
        if (!formData.holders) errors.holders = "Number of holders is required";
        break;

      case 3:
        if (!formData.teamInfo || formData.teamInfo.length < 50) {
          errors.teamInfo = "Team information must be at least 50 characters";
        }
        if (!formData.useCase || formData.useCase.length < 100) {
          errors.useCase = "Use case description must be at least 100 characters";
        }
        if (!formData.tokenomics || formData.tokenomics.length < 50) {
          errors.tokenomics = "Tokenomics information must be at least 50 characters";
        }
        break;

      case 4:
        if (!formData.agreedToTerms) errors.agreedToTerms = "You must agree to the terms";
        if (!formData.submissionFee) errors.submissionFee = "Submission fee must be paid";
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidContractAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleInputChange = (field: keyof ProposalFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const { [field]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      // Submit proposal logic here
      console.log("Submitting proposal:", formData);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter project name"
                  className={validationErrors.name ? "border-red-500" : ""}
                />
                {validationErrors.name && (
                  <p className="text-red-400 text-sm">{validationErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="symbol">Token Symbol *</Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) => handleInputChange("symbol", e.target.value.toUpperCase())}
                  placeholder="e.g., BTC"
                  maxLength={10}
                  className={validationErrors.symbol ? "border-red-500" : ""}
                />
                {validationErrors.symbol && (
                  <p className="text-red-400 text-sm">{validationErrors.symbol}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Provide a detailed description of your project (minimum 100 characters)"
                rows={4}
                className={validationErrors.description ? "border-red-500" : ""}
              />
              <div className="text-sm text-muted-foreground">
                {formData.description.length}/100 characters minimum
              </div>
              {validationErrors.description && (
                <p className="text-red-400 text-sm">{validationErrors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className={validationErrors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.category && (
                  <p className="text-red-400 text-sm">{validationErrors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Blockchain *</Label>
                <Select value={formData.blockchain} onValueChange={(value) => handleInputChange("blockchain", value)}>
                  <SelectTrigger className={validationErrors.blockchain ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select blockchain" />
                  </SelectTrigger>
                  <SelectContent>
                    {blockchains.map((blockchain) => (
                      <SelectItem key={blockchain} value={blockchain}>
                        {blockchain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.blockchain && (
                  <p className="text-red-400 text-sm">{validationErrors.blockchain}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Technical & Market Data</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website *</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://yourproject.com"
                  className={validationErrors.website ? "border-red-500" : ""}
                />
                {validationErrors.website && (
                  <p className="text-red-400 text-sm">{validationErrors.website}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="whitepaper">Whitepaper URL</Label>
                <Input
                  id="whitepaper"
                  value={formData.whitepaper}
                  onChange={(e) => handleInputChange("whitepaper", e.target.value)}
                  placeholder="https://yourproject.com/whitepaper.pdf"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractAddress">Contract Address *</Label>
              <Input
                id="contractAddress"
                value={formData.contractAddress}
                onChange={(e) => handleInputChange("contractAddress", e.target.value)}
                placeholder="0x..."
                className={`font-mono ${validationErrors.contractAddress ? "border-red-500" : ""}`}
              />
              {validationErrors.contractAddress && (
                <p className="text-red-400 text-sm">{validationErrors.contractAddress}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marketCap">Market Cap (USD) *</Label>
                <Input
                  id="marketCap"
                  value={formData.marketCap}
                  onChange={(e) => handleInputChange("marketCap", e.target.value)}
                  placeholder="1000000"
                  className={validationErrors.marketCap ? "border-red-500" : ""}
                />
                {validationErrors.marketCap && (
                  <p className="text-red-400 text-sm">{validationErrors.marketCap}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="volume24h">24h Volume (USD) *</Label>
                <Input
                  id="volume24h"
                  value={formData.volume24h}
                  onChange={(e) => handleInputChange("volume24h", e.target.value)}
                  placeholder="100000"
                  className={validationErrors.volume24h ? "border-red-500" : ""}
                />
                {validationErrors.volume24h && (
                  <p className="text-red-400 text-sm">{validationErrors.volume24h}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="holders">Token Holders *</Label>
                <Input
                  id="holders"
                  value={formData.holders}
                  onChange={(e) => handleInputChange("holders", e.target.value)}
                  placeholder="1000"
                  className={validationErrors.holders ? "border-red-500" : ""}
                />
                {validationErrors.holders && (
                  <p className="text-red-400 text-sm">{validationErrors.holders}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Social Links</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange("twitter", e.target.value)}
                    placeholder="https://twitter.com/yourproject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram</Label>
                  <Input
                    id="telegram"
                    value={formData.telegram}
                    onChange={(e) => handleInputChange("telegram", e.target.value)}
                    placeholder="https://t.me/yourproject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discord">Discord</Label>
                  <Input
                    id="discord"
                    value={formData.discord}
                    onChange={(e) => handleInputChange("discord", e.target.value)}
                    placeholder="https://discord.gg/yourproject"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Project Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="teamInfo">Team Information *</Label>
              <Textarea
                id="teamInfo"
                value={formData.teamInfo}
                onChange={(e) => handleInputChange("teamInfo", e.target.value)}
                placeholder="Describe your team members, their experience, and backgrounds (minimum 50 characters)"
                rows={3}
                className={validationErrors.teamInfo ? "border-red-500" : ""}
              />
              <div className="text-sm text-muted-foreground">
                {formData.teamInfo.length}/50 characters minimum
              </div>
              {validationErrors.teamInfo && (
                <p className="text-red-400 text-sm">{validationErrors.teamInfo}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="useCase">Use Case & Value Proposition *</Label>
              <Textarea
                id="useCase"
                value={formData.useCase}
                onChange={(e) => handleInputChange("useCase", e.target.value)}
                placeholder="Explain the real-world problem your project solves and its unique value proposition (minimum 100 characters)"
                rows={4}
                className={validationErrors.useCase ? "border-red-500" : ""}
              />
              <div className="text-sm text-muted-foreground">
                {formData.useCase.length}/100 characters minimum
              </div>
              {validationErrors.useCase && (
                <p className="text-red-400 text-sm">{validationErrors.useCase}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tokenomics">Tokenomics *</Label>
              <Textarea
                id="tokenomics"
                value={formData.tokenomics}
                onChange={(e) => handleInputChange("tokenomics", e.target.value)}
                placeholder="Describe token distribution, utility, staking mechanisms, and economic model (minimum 50 characters)"
                rows={3}
                className={validationErrors.tokenomics ? "border-red-500" : ""}
              />
              <div className="text-sm text-muted-foreground">
                {formData.tokenomics.length}/50 characters minimum
              </div>
              {validationErrors.tokenomics && (
                <p className="text-red-400 text-sm">{validationErrors.tokenomics}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roadmap">Development Roadmap</Label>
              <Textarea
                id="roadmap"
                value={formData.roadmap}
                onChange={(e) => handleInputChange("roadmap", e.target.value)}
                placeholder="Share your project's development milestones and future plans"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="auditReport">Security Audit Report</Label>
              <Input
                id="auditReport"
                value={formData.auditReport}
                onChange={(e) => handleInputChange("auditReport", e.target.value)}
                placeholder="URL to security audit report (recommended)"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Review & Submit</h3>
            
            {/* Submission Fee */}
            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <DollarSign className="w-5 h-5 text-orange-400" />
                  <h4 className="font-semibold">Submission Fee</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  A fee of {submissionFee} USDT is required to submit your proposal. This helps prevent spam and ensures serious submissions.
                </p>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.submissionFee}
                    onCheckedChange={(checked) => handleInputChange("submissionFee", checked as boolean)}
                  />
                  <Label className="text-sm">
                    I agree to pay the submission fee of {submissionFee} USDT
                  </Label>
                </div>
                {validationErrors.submissionFee && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.submissionFee}</p>
                )}
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <h4 className="font-semibold">Terms & Conditions</h4>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• The submission fee is non-refundable</p>
                  <p>• Voting period lasts 14 days from submission</p>
                  <p>• Minimum 10,000 votes required for consideration</p>
                  <p>• NebulaX reserves the right to reject proposals that don't meet listing criteria</p>
                  <p>• All information provided must be accurate and verifiable</p>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreedToTerms", checked as boolean)}
                  />
                  <Label className="text-sm">
                    I have read and agree to the Terms & Conditions
                  </Label>
                </div>
                {validationErrors.agreedToTerms && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.agreedToTerms}</p>
                )}
              </CardContent>
            </Card>

            {/* Review Summary */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Proposal Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Project:</span>
                    <span className="ml-2 font-semibold">{formData.name} ({formData.symbol})</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <span className="ml-2">{formData.category}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Blockchain:</span>
                    <span className="ml-2">{formData.blockchain}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Market Cap:</span>
                    <span className="ml-2">${formData.marketCap}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Submit Token Listing Proposal</h1>
        <p className="text-lg text-muted-foreground">
          Propose your token for community voting and potential listing on NebulaX
        </p>
      </div>

      {/* Progress Indicator */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Basic Info</span>
            <span>Technical Data</span>
            <span>Project Details</span>
            <span>Review & Submit</span>
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card className="glass">
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        {currentStep < totalSteps ? (
          <Button onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Submit Proposal
          </Button>
        )}
      </div>
    </div>
  );
}