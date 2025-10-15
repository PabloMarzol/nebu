import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Download, 
  Check, 
  AlertCircle, 
  Globe, 
  Calendar, 
  Clock,
  Shield,
  Scale,
  BookOpen,
  Copy,
  Eye,
  Printer
} from 'lucide-react';

interface ConsentTemplate {
  id: string;
  name: string;
  category: 'risk_disclosure' | 'investment_education' | 'trading_terms' | 'data_privacy' | 'aml_kyc';
  description: string;
  requiredFields: string[];
  jurisdictions: string[];
  template: string;
  lastUpdated: Date;
  version: string;
}

interface GeneratedConsent {
  id: string;
  type: string;
  content: string;
  jurisdiction: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  documentVersion: string;
  isActive: boolean;
}

const EducationConsentGenerator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('US');
  const [customizations, setCustomizations] = useState<Record<string, string>>({});
  const [generatedConsent, setGeneratedConsent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Mock consent templates
  const [templates] = useState<ConsentTemplate[]>([
    {
      id: 'crypto_risk_disclosure',
      name: 'Cryptocurrency Risk Disclosure',
      category: 'risk_disclosure',
      description: 'Comprehensive risk disclosure for cryptocurrency trading and investments',
      requiredFields: ['platform_name', 'user_name', 'risk_tolerance'],
      jurisdictions: ['US', 'EU', 'UK', 'CA', 'AU'],
      template: `CRYPTOCURRENCY RISK DISCLOSURE STATEMENT

This Risk Disclosure Statement ("Statement") is provided by {{platform_name}} ("Platform") to inform you of the risks associated with trading cryptocurrencies and digital assets.

IMPORTANT: Cryptocurrency trading involves substantial risk of loss and is not suitable for all investors. You should carefully consider whether such trading is suitable for you in light of your financial condition and ability to bear financial risks.

KEY RISKS:

1. PRICE VOLATILITY
Cryptocurrencies are subject to extreme price volatility. The value of cryptocurrencies may fluctuate significantly within short periods, potentially resulting in substantial losses.

2. MARKET RISK
The cryptocurrency market operates 24/7 without circuit breakers or trading halts, exposing you to continuous market risk.

3. LIQUIDITY RISK
Certain cryptocurrencies may have limited liquidity, making it difficult to execute trades at desired prices.

4. REGULATORY RISK
Cryptocurrency regulations are evolving and may impact the value and trading of digital assets.

5. TECHNOLOGY RISK
Blockchain technology and smart contracts may contain bugs or vulnerabilities that could result in loss of funds.

6. CUSTODY RISK
Loss of private keys or wallet access may result in permanent loss of cryptocurrencies.

By proceeding with cryptocurrency trading on {{platform_name}}, you acknowledge that you:
- Understand the risks outlined above
- Have the financial capacity to bear potential losses
- Are not relying solely on this platform for investment advice
- Will seek independent financial advice if needed

User Acknowledgment:
I, {{user_name}}, acknowledge that I have read, understood, and agree to this Risk Disclosure Statement.

Risk Tolerance Level: {{risk_tolerance}}

Date: {{date}}
Platform: {{platform_name}}
Version: {{version}}`,
      lastUpdated: new Date('2025-01-01'),
      version: '2.1'
    },
    {
      id: 'trading_education',
      name: 'Trading Education Consent',
      category: 'investment_education',
      description: 'Educational content consent for trading tools and market analysis',
      requiredFields: ['platform_name', 'user_name', 'education_level'],
      jurisdictions: ['US', 'EU', 'UK', 'CA', 'AU', 'SG'],
      template: `TRADING EDUCATION AND ANALYSIS CONSENT

{{platform_name}} provides educational content, market analysis, and trading tools to help users make informed decisions.

EDUCATIONAL CONTENT DISCLAIMER:

1. EDUCATIONAL PURPOSE ONLY
All content provided is for educational purposes and should not be considered as personalized investment advice.

2. NO GUARANTEE OF RESULTS
Past performance and educational examples do not guarantee future results.

3. INDEPENDENT RESEARCH
Users should conduct their own research and due diligence before making trading decisions.

4. RISK AWARENESS
All trading involves risk, and users may lose their entire investment.

CONSENT FOR EDUCATIONAL SERVICES:

By accepting this consent, you, {{user_name}}, agree that:
- Educational content is provided for informational purposes only
- You will not rely solely on platform content for trading decisions
- You understand the difference between educational content and financial advice
- You accept responsibility for your own trading decisions

Education Level: {{education_level}}
Platform: {{platform_name}}
Date: {{date}}
Version: {{version}}`,
      lastUpdated: new Date('2025-01-01'),
      version: '1.5'
    },
    {
      id: 'data_privacy',
      name: 'Data Privacy and Processing Consent',
      category: 'data_privacy',
      description: 'GDPR-compliant data processing and privacy consent',
      requiredFields: ['platform_name', 'user_name', 'data_purposes'],
      jurisdictions: ['EU', 'UK', 'CA'],
      template: `DATA PRIVACY AND PROCESSING CONSENT

{{platform_name}} respects your privacy and is committed to protecting your personal data in accordance with applicable data protection laws.

DATA PROCESSING PURPOSES:
We process your personal data for the following purposes:
{{data_purposes}}

YOUR RIGHTS:
Under applicable data protection laws, you have the right to:
- Access your personal data
- Rectify inaccurate data
- Erase your data (right to be forgotten)
- Restrict processing
- Data portability
- Object to processing

CONSENT:
I, {{user_name}}, hereby consent to the processing of my personal data by {{platform_name}} for the purposes outlined above.

You may withdraw this consent at any time by contacting our privacy team.

Date: {{date}}
Platform: {{platform_name}}
Version: {{version}}`,
      lastUpdated: new Date('2025-01-01'),
      version: '3.0'
    },
    {
      id: 'aml_kyc',
      name: 'AML/KYC Compliance Consent',
      category: 'aml_kyc',
      description: 'Anti-Money Laundering and Know Your Customer compliance consent',
      requiredFields: ['platform_name', 'user_name', 'kyc_level'],
      jurisdictions: ['US', 'EU', 'UK', 'CA', 'AU', 'SG'],
      template: `ANTI-MONEY LAUNDERING (AML) AND KNOW YOUR CUSTOMER (KYC) CONSENT

{{platform_name}} is required to comply with anti-money laundering and know your customer regulations.

COMPLIANCE REQUIREMENTS:

1. IDENTITY VERIFICATION
We are required to verify your identity using government-issued identification documents.

2. SOURCE OF FUNDS
We may request information about the source of your funds to ensure compliance with AML regulations.

3. ONGOING MONITORING
We will monitor your account activity for suspicious transactions as required by law.

4. REPORTING OBLIGATIONS
We may be required to report certain transactions to regulatory authorities.

CONSENT:
I, {{user_name}}, understand and consent to:
- Identity verification procedures
- Collection of KYC information
- Ongoing account monitoring
- Regulatory reporting when required

KYC Level: {{kyc_level}}
Platform: {{platform_name}}
Date: {{date}}
Version: {{version}}`,
      lastUpdated: new Date('2025-01-01'),
      version: '2.0'
    }
  ]);

  const [userConsents] = useState<GeneratedConsent[]>([
    {
      id: '1',
      type: 'Cryptocurrency Risk Disclosure',
      content: 'Risk disclosure content...',
      jurisdiction: 'US',
      timestamp: new Date('2024-12-15'),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      documentVersion: '2.1',
      isActive: true
    }
  ]);

  const jurisdictions = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'EU', name: 'European Union', flag: '🇪🇺' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' }
  ];

  const generateConsent = () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    
    // Simulate generation process
    setTimeout(() => {
      const template = templates.find(t => t.id === selectedTemplate);
      if (!template) return;

      let content = template.template;
      
      // Replace template variables
      content = content.replace(/\{\{platform_name\}\}/g, 'NebulaX Exchange');
      content = content.replace(/\{\{user_name\}\}/g, customizations.user_name || '[User Name]');
      content = content.replace(/\{\{date\}\}/g, new Date().toLocaleDateString());
      content = content.replace(/\{\{version\}\}/g, template.version);
      
      // Replace custom fields
      template.requiredFields.forEach(field => {
        const value = customizations[field] || `[${field.replace('_', ' ').toUpperCase()}]`;
        content = content.replace(new RegExp(`\\{\\{${field}\\}\\}`, 'g'), value);
      });

      setGeneratedConsent(content);
      setIsGenerating(false);
      setShowPreview(true);
    }, 2000);
  };

  const downloadConsent = () => {
    const blob = new Blob([generatedConsent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consent_${selectedTemplate}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedConsent);
  };

  const printConsent = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Consent Document</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              h1 { color: #333; border-bottom: 2px solid #333; }
              .header { text-align: center; margin-bottom: 30px; }
              .content { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>NebulaX Exchange - Consent Document</h1>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="content">${generatedConsent.replace(/\n/g, '<br>')}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Education Consent Generator
            </h2>
            <p className="text-gray-400">Generate compliant consent documents with one click</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
            <Shield className="w-3 h-3 mr-1" />
            Legally Compliant
          </Badge>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
            <Globe className="w-3 h-3 mr-1" />
            Multi-Jurisdiction
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <Card className="bg-black/20 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span>Template Selection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="template">Consent Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a consent template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center space-x-2">
                          <span>{template.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            v{template.version}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplateData && (
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-blue-200 text-sm">{selectedTemplateData.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-blue-300">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Updated: {selectedTemplateData.lastUpdated.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="w-3 h-3" />
                      <span>{selectedTemplateData.jurisdictions.length} jurisdictions</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jurisdictions.map((jurisdiction) => (
                      <SelectItem key={jurisdiction.code} value={jurisdiction.code}>
                        <div className="flex items-center space-x-2">
                          <span>{jurisdiction.flag}</span>
                          <span>{jurisdiction.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {selectedTemplateData && (
            <Card className="bg-black/20 border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Scale className="w-5 h-5 text-green-400" />
                  <span>Customization</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTemplateData.requiredFields.map((field) => (
                  <div key={field}>
                    <Label htmlFor={field} className="capitalize">
                      {field.replace('_', ' ')}
                    </Label>
                    {field === 'risk_tolerance' ? (
                      <Select 
                        value={customizations[field] || ''} 
                        onValueChange={(value) => setCustomizations({...customizations, [field]: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk tolerance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Conservative">Conservative</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Aggressive">Aggressive</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : field === 'education_level' ? (
                      <Select 
                        value={customizations[field] || ''} 
                        onValueChange={(value) => setCustomizations({...customizations, [field]: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : field === 'kyc_level' ? (
                      <Select 
                        value={customizations[field] || ''} 
                        onValueChange={(value) => setCustomizations({...customizations, [field]: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select KYC level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Level 1">Level 1 - Basic</SelectItem>
                          <SelectItem value="Level 2">Level 2 - Enhanced</SelectItem>
                          <SelectItem value="Level 3">Level 3 - Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : field === 'data_purposes' ? (
                      <Textarea 
                        placeholder="Enter data processing purposes"
                        value={customizations[field] || ''} 
                        onChange={(e) => setCustomizations({...customizations, [field]: e.target.value})}
                      />
                    ) : (
                      <input 
                        type="text"
                        className="w-full p-2 bg-gray-800/30 border border-gray-600 rounded-lg text-white"
                        placeholder={`Enter ${field.replace('_', ' ')}`}
                        value={customizations[field] || ''} 
                        onChange={(e) => setCustomizations({...customizations, [field]: e.target.value})}
                      />
                    )}
                  </div>
                ))}

                <Button 
                  onClick={generateConsent} 
                  disabled={!selectedTemplate || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white rounded-full border-t-transparent" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Generate Consent</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview and Actions Panel */}
        <div className="space-y-6">
          {showPreview && generatedConsent && (
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-purple-400" />
                    <span>Generated Consent</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={printConsent}>
                      <Printer className="w-3 h-3 mr-1" />
                      Print
                    </Button>
                    <Button size="sm" onClick={downloadConsent}>
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900/50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                    {generatedConsent}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {showPreview && (
            <Card className="bg-black/20 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-yellow-400" />
                  <span>Final Consent</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-yellow-500/30 bg-yellow-500/10">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-200">
                    Please review the generated consent document carefully before proceeding. 
                    Your agreement will be recorded with timestamp and IP address for compliance purposes.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="agree-terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  />
                  <Label htmlFor="agree-terms" className="text-sm text-gray-300">
                    I have read, understood, and agree to the terms outlined in this consent document
                  </Label>
                </div>

                <Button 
                  disabled={!agreedToTerms} 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirm and Record Consent
                </Button>

                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>Timestamp: {new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-3 h-3" />
                    <span>Jurisdiction: {jurisdictions.find(j => j.code === selectedJurisdiction)?.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Previous Consents */}
          <Card className="bg-black/20 border-gray-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gray-400" />
                <span>Previous Consents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userConsents.map((consent) => (
                  <div key={consent.id} className="p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">{consent.type}</span>
                      <Badge className={consent.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                        {consent.isActive ? 'Active' : 'Expired'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>Date: {consent.timestamp.toLocaleDateString()}</div>
                      <div>Jurisdiction: {consent.jurisdiction}</div>
                      <div>Version: {consent.documentVersion}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EducationConsentGenerator;