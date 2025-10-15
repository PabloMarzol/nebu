import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Smartphone, 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  Shield,
  Clock
} from 'lucide-react';

export default function StreamlinedSignup() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const signupSteps = [
    {
      id: 1,
      title: 'Enter Email',
      description: 'Start trading in 30 seconds',
      icon: <Mail className="w-6 h-6" />,
      requirement: 'Email only'
    },
    {
      id: 2,
      title: 'Verify & Trade',
      description: 'Immediate access to $25K daily limits',
      icon: <CheckCircle className="w-6 h-6" />,
      requirement: 'No documents needed'
    }
  ];

  const tradingLimits = [
    { tier: 'Email Verified', limit: '$25,000/day', time: '30 seconds', color: 'bg-green-500' },
    { tier: 'Phone Verified', limit: '$250,000/day', time: '2 minutes', color: 'bg-blue-500' },
    { tier: 'ID Verified', limit: '$1,000,000/day', time: '5 minutes', color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Start Trading in 30 Seconds</h1>
          <p className="text-xl text-gray-300 mb-8">
            No complex verification. No document uploads. Just instant crypto trading.
          </p>
          
          <div className="flex justify-center space-x-4 mb-8">
            <Badge className="bg-green-500 text-white px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              30 Second Setup
            </Badge>
            <Badge className="bg-blue-500 text-white px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Regulation Compliant
            </Badge>
            <Badge className="bg-purple-500 text-white px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Instant Trading
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Signup Form */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Quick Signup</CardTitle>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  
                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => setStep(2)}
                    disabled={!email}
                  >
                    Start Trading Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <div className="text-center text-sm text-gray-400">
                    By continuing, you agree to our minimal compliance terms
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Email Sent!</h3>
                    <p className="text-gray-300">
                      Check your email and click the verification link to start trading
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-5 h-5 text-green-400" />
                      <span className="font-semibold text-green-300">Instant Access</span>
                    </div>
                    <p className="text-sm text-green-200">
                      Trade up to $25,000 daily immediately after email verification
                    </p>
                  </div>
                  
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Open Trading App
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trading Limits */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl">Progressive Verification</CardTitle>
              <p className="text-gray-300">Increase limits when you're ready</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tradingLimits.map((limit, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${limit.color}`} />
                        <span className="font-semibold">{limit.tier}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {limit.time}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {limit.limit}
                    </div>
                    <div className="text-sm text-gray-400">
                      Daily trading limit
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <h4 className="font-semibold text-blue-300 mb-2">Why So Simple?</h4>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>• Crypto-to-crypto trading requires minimal verification</li>
                  <li>• Regulation-compliant progressive KYC</li>
                  <li>• Start small, verify more when needed</li>
                  <li>• Full security without barriers</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-center">
            <CardContent className="p-6">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Instant Trading</h3>
              <p className="text-sm text-gray-400">
                Start trading immediately with email verification only
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-center">
            <CardContent className="p-6">
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Regulation Compliant</h3>
              <p className="text-sm text-gray-400">
                Full compliance with progressive verification levels
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-center">
            <CardContent className="p-6">
              <Smartphone className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Mobile Ready</h3>
              <p className="text-sm text-gray-400">
                Trade anywhere with our streamlined mobile app
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}