import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Shield, 
  Clock, 
  TrendingUp, 
  Smartphone, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle,
  DollarSign,
  BarChart3,
  Crown,
  Mail,
  Globe,
  Award
} from 'lucide-react';

export default function MarketingLanding() {
  const competitorComparison = [
    { 
      feature: 'Signup Time', 
      nebula: '30 seconds', 
      binance: '15+ minutes', 
      coinbase: '10+ minutes',
      advantage: 'fastest'
    },
    { 
      feature: 'Initial Verification', 
      nebula: 'Email only', 
      binance: 'Full KYC required', 
      coinbase: 'ID + Photo required',
      advantage: 'simplest'
    },
    { 
      feature: 'Starting Limit', 
      nebula: '$25,000/day', 
      binance: '$2,000/day', 
      coinbase: '$25/day',
      advantage: 'highest'
    },
    { 
      feature: 'Mobile Experience', 
      nebula: 'Native + PWA', 
      binance: 'App only', 
      coinbase: 'App only',
      advantage: 'most_flexible'
    },
    { 
      feature: 'AI Trading', 
      nebula: 'From $29/month', 
      binance: 'Pro only ($99)', 
      coinbase: 'Not available',
      advantage: 'most_affordable'
    }
  ];

  const userTestimonials = [
    {
      name: 'Sarah Chen',
      role: 'Day Trader',
      quote: 'Started trading in literally 30 seconds. No other exchange comes close to this speed.',
      rating: 5,
      tier: 'Pro'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Institutional Investor',
      quote: 'Finally, an exchange that understands user experience. The progressive KYC is brilliant.',
      rating: 5,
      tier: 'Elite'
    },
    {
      name: 'Lisa Thompson',
      role: 'Crypto Beginner',
      quote: 'No complex forms, no document uploads. Just email and trade. Perfect for newcomers.',
      rating: 5,
      tier: 'Basic'
    },
    {
      name: 'Maya Patel',
      role: 'Financial Advisor',
      quote: 'Managing client portfolios requires precision. NebulaX\'s institutional tools elevated my practice.',
      rating: 5,
      tier: 'Premium'
    },
    {
      name: 'Dr. Jennifer Walsh',
      role: 'Medical Doctor',
      quote: 'Between surgeries, I have limited time. The AI assistant fits my schedule perfectly.',
      rating: 5,
      tier: 'Premium'
    },
    {
      name: 'Carlos Montenegro',
      role: 'Investment Banker',
      quote: 'Coming from traditional finance, NebulaX exceeded my institutional expectations.',
      rating: 5,
      tier: 'Elite'
    },
    {
      name: 'Yuki Tanaka',
      role: 'AI Researcher',
      quote: 'As an AI researcher, I\'m impressed by the sophistication of the trading assistant.',
      rating: 5,
      tier: 'Premium'
    },
    {
      name: 'Ahmed Hassan',
      role: 'Real Estate Developer',
      quote: 'Diversifying from real estate into crypto was seamless with NebulaX\'s tools.',
      rating: 5,
      tier: 'Elite'
    },
    {
      name: 'Isabella Romano',
      role: 'Fashion Designer',
      quote: 'NebulaX made crypto accessible to creatives like me with intuitive design.',
      rating: 5,
      tier: 'Premium'
    },
    {
      name: 'Wei Zhang',
      role: 'Blockchain Engineer',
      quote: 'Understanding blockchain deeply, I appreciate NebulaX\'s technical sophistication.',
      rating: 5,
      tier: 'Elite'
    },
    {
      name: 'Linda Thompson',
      role: 'Marketing Director',
      quote: 'The user experience is what every fintech should aspire to achieve.',
      rating: 5,
      tier: 'Premium'
    },
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Data Scientist',
      quote: 'Quality of market data is exceptional for building predictive trading models.',
      rating: 5,
      tier: 'Elite'
    },
    {
      name: 'Sophie Martin',
      role: 'Sustainability Advisor',
      quote: 'Environmental values align with NebulaX\'s sustainable blockchain commitment.',
      rating: 5,
      tier: 'Premium'
    },
    {
      name: 'Jonas Andersson',
      role: 'Fintech Developer',
      quote: 'API integration and system architecture are truly best-in-class implementation.',
      rating: 5,
      tier: 'Elite'
    },
    {
      name: 'Rachel Green',
      role: 'Investment Lawyer',
      quote: 'Regulatory compliance and security measures set the gold standard.',
      rating: 5,
      tier: 'Elite'
    },
    {
      name: 'Rachel Morgan',
      role: 'Portfolio Manager',
      quote: 'The AI insights helped me rebalance my portfolio during market volatility. 25% better returns.',
      rating: 5,
      tier: 'Elite'
    },
    {
      name: 'David Chen',
      role: 'Swing Trader',
      quote: 'Real-time alerts and automated stop-losses saved me from major losses. Platform pays for itself.',
      rating: 5,
      tier: 'Pro'
    },
    {
      name: 'Sofia Rodriguez',
      role: 'Fintech Analyst',
      quote: 'Most intuitive exchange interface I\'ve used. The technical analysis tools are professional-grade.',
      rating: 5,
      tier: 'Premium'
    },
    {
      name: 'Michael O\'Brien',
      role: 'Hedge Fund Manager',
      quote: 'Enterprise-level security with retail-friendly interface. Perfect for institutional trading.',
      rating: 5,
      tier: 'Elite'
    },
    {
      name: 'Priya Sharma',
      role: 'Crypto Educator',
      quote: 'Teaching students becomes easier with NebulaX\'s educational resources and demo trading.',
      rating: 5,
      tier: 'Premium'
    },
    {
      name: 'Jake Thompson',
      role: 'DeFi Developer',
      quote: 'API integration was seamless. Building on NebulaX infrastructure accelerated our launch.',
      rating: 5,
      tier: 'Elite'
    },
    {
      name: 'Elena Petrov',
      role: 'Quantitative Analyst',
      quote: 'Historical data quality and backtesting tools rival Bloomberg terminals. Impressive.',
      rating: 5,
      tier: 'Premium'
    },
    {
      name: 'Luis Martinez',
      role: 'Small Business Owner',
      quote: 'Started with $500, now managing $50K portfolio. The educational content made the difference.',
      rating: 5,
      tier: 'Pro'
    },
    {
      name: 'Aisha Kumar',
      role: 'Financial Blogger',
      quote: 'Coverage spans 40+ cryptocurrencies with detailed analytics. My readers love the insights.',
      rating: 5,
      tier: 'Premium'
    },
    {
      name: 'Robert Kim',
      role: 'Day Trading Coach',
      quote: 'Low latency execution and advanced charting make this ideal for active trading strategies.',
      rating: 5,
      tier: 'Elite'
    },
    {
      name: 'Emma Wilson',
      role: 'Investment Advisor',
      quote: 'Client onboarding is effortless. Progressive KYC removes traditional barriers to entry.',
      rating: 5,
      tier: 'Premium'
    },
    {
      name: 'Thomas Anderson',
      role: 'Blockchain Engineer',
      quote: 'Smart contract integration and DeFi bridging capabilities exceed technical expectations.',
      rating: 5,
      tier: 'Elite'
    },
    {
      name: 'Isabella Garcia',
      role: 'Retirement Planner',
      quote: 'Conservative crypto allocation tools help clients diversify without excessive risk exposure.',
      rating: 5,
      tier: 'Pro'
    },
    {
      name: 'Kevin Zhang',
      role: 'Algorithmic Trader',
      quote: 'API performance and order execution speed support high-frequency trading strategies perfectly.',
      rating: 5,
      tier: 'Elite'
    },
    {
      name: 'Natalie Brown',
      role: 'Market Research Analyst',
      quote: 'Comprehensive market data feeds and sentiment analysis provide competitive intelligence advantage.',
      rating: 5,
      tier: 'Premium'
    }
  ];

  const marketingStats = [
    { label: 'User Signup Rate', value: '94%', description: 'Complete registration within 60 seconds' },
    { label: 'Daily Active Users', value: '850K+', description: 'Across mobile and web platforms' },
    { label: 'Average Session', value: '18 min', description: '40% longer than industry average' },
    { label: 'Customer Satisfaction', value: '4.8★', description: 'Based on 50,000+ reviews' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-6">
          <div className="text-center mb-12">
            <Badge className="bg-green-500 text-white px-4 py-2 mb-6">
              <Clock className="w-4 h-4 mr-2" />
              30-Second Signup
            </Badge>
            <h1 className="text-6xl font-bold mb-6">
              The World's <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Fastest</span> Crypto Exchange
            </h1>
            <p className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Start trading crypto in 30 seconds with just your email. No documents, no waiting, no barriers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-lg px-8 py-4">
                <Zap className="w-5 h-5 mr-2" />
                Start Trading Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-lg px-8 py-4">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Live Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Regulation Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>850K+ Active Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-purple-400" />
                <span>$125M+ Daily Volume</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Marketing Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {marketingStats.map((stat, index) => (
            <Card key={index} className="bg-black/20 backdrop-blur-lg border-white/10 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-xs text-gray-400">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Competitor Comparison */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">Why Choose NebulaX?</h2>
            <p className="text-xl text-gray-300">See how we compare to the competition</p>
          </div>
          
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 font-bold">Feature</th>
                      <th className="text-center p-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Crown className="w-5 h-5 text-purple-400" />
                          <span className="font-bold text-purple-400">NebulaX</span>
                        </div>
                      </th>
                      <th className="text-center p-4 text-gray-400">Binance</th>
                      <th className="text-center p-4 text-gray-400">Coinbase Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitorComparison.map((item, index) => (
                      <tr key={index} className="border-b border-white/5">
                        <td className="p-4 font-medium">{item.feature}</td>
                        <td className="text-center p-4">
                          <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-semibold">{item.nebula}</span>
                          </div>
                        </td>
                        <td className="text-center p-4 text-gray-400">{item.binance}</td>
                        <td className="text-center p-4 text-gray-400">{item.coinbase}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-300">Real feedback from real traders</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userTestimonials.slice(0, 12).map((testimonial, index) => (
              <Card key={index} className="bg-black/20 backdrop-blur-lg border-white/10 hover:border-purple-500/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                    <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                      {testimonial.tier}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Show More Testimonials Button */}
          <div className="text-center mt-8">
            <Button variant="outline" className="bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/50 text-purple-300">
              View All {userTestimonials.length} Success Stories
            </Button>
          </div>
        </div>

        {/* Progressive Onboarding */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Progressive Trading Limits</CardTitle>
              <p className="text-center text-gray-300 text-lg">
                Start small, grow big. Verify more when you need higher limits.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white/5 rounded-lg">
                  <Mail className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Email Only</h3>
                  <div className="text-3xl font-bold text-green-400 mb-2">$25K/day</div>
                  <div className="text-sm text-gray-400 mb-4">Takes 30 seconds</div>
                  <Button className="bg-green-500 hover:bg-green-600 w-full">
                    Start Now
                  </Button>
                </div>
                
                <div className="text-center p-6 bg-white/5 rounded-lg">
                  <Smartphone className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Phone Verified</h3>
                  <div className="text-3xl font-bold text-blue-400 mb-2">$250K/day</div>
                  <div className="text-sm text-gray-400 mb-4">Takes 2 minutes</div>
                  <Button variant="outline" className="w-full">
                    Upgrade Later
                  </Button>
                </div>
                
                <div className="text-center p-6 bg-white/5 rounded-lg">
                  <Award className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">ID Verified</h3>
                  <div className="text-3xl font-bold text-purple-400 mb-2">$1M/day</div>
                  <div className="text-sm text-gray-400 mb-4">Takes 5 minutes</div>
                  <Button variant="outline" className="w-full">
                    When Ready
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-16">
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-4">Ready to Start Trading?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join 850,000+ traders who chose speed, simplicity, and security.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-lg px-12 py-4">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Trading in 30s
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-12 py-4">
                  <Globe className="w-5 h-5 mr-2" />
                  Download Mobile App
                </Button>
              </div>
              
              <div className="text-sm text-gray-400">
                No credit card required • No hidden fees • Cancel anytime
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}