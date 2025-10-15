import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Shield, 
  TrendingUp, 
  Smartphone, 
  Clock, 
  Star,
  CheckCircle,
  ArrowRight,
  Crown,
  Gift,
  Target,
  Sparkles
} from 'lucide-react';

// Floating Animation Component
const FloatingElement = ({ children, delay = 0, duration = 3 }) => (
  <div 
    className="animate-float"
    style={{
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`
    }}
  >
    {children}
  </div>
);

// Pulse Animation Component
const PulseElement = ({ children, color = 'purple' }) => (
  <div className={`animate-pulse-${color} relative`}>
    {children}
    <div className={`absolute inset-0 rounded-full bg-${color}-400 opacity-20 animate-ping`} />
  </div>
);

// Typewriter Effect Component
const TypewriterText = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className="relative">
      {displayText}
      <span className="animate-blink ml-1">|</span>
    </span>
  );
};

// Slide-in Animation Component
const SlideInElement = ({ children, direction = 'left', delay = 0 }) => (
  <div 
    className={`animate-slide-in-${direction} opacity-0`}
    style={{
      animationDelay: `${delay}s`,
      animationFillMode: 'forwards'
    }}
  >
    {children}
  </div>
);

// Counter Animation Component
const AnimatedCounter = ({ target, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Progress Bar Animation Component
const AnimatedProgressBar = ({ progress, color = 'blue', duration = 1000 }) => {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
      <div 
        className={`h-full bg-gradient-to-r from-${color}-400 to-${color}-600 transition-all ease-out`}
        style={{ 
          width: `${currentProgress}%`,
          transitionDuration: `${duration}ms`
        }}
      />
    </div>
  );
};

// Feature Highlight Component with Animations
const FeatureHighlight = ({ feature, index }) => (
  <SlideInElement direction="up" delay={index * 0.2}>
    <Card className="bg-black/20 backdrop-blur-lg border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 group">
      <CardContent className="p-6 text-center">
        <FloatingElement delay={index * 0.5}>
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
            {feature.icon}
          </div>
        </FloatingElement>
        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
        <p className="text-gray-400 mb-4">{feature.description}</p>
        <div className="flex items-center justify-center space-x-2">
          <Badge className="bg-green-500 text-white">
            {feature.benefit}
          </Badge>
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  </SlideInElement>
);

export default function MicroAnimations() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Clock className="w-8 h-8 text-white" />,
      title: '30-Second Signup',
      description: 'Fastest crypto exchange signup in the world',
      benefit: 'Instant Access'
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: 'No KYC Required',
      description: 'Start trading with just email verification',
      benefit: 'Zero Barriers'
    },
    {
      icon: <Smartphone className="w-8 h-8 text-white" />,
      title: 'Mobile-First',
      description: 'Native apps for iOS, Android, and PWA',
      benefit: 'Trade Anywhere'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      title: 'AI Trading',
      description: 'Smart algorithms that maximize your profits',
      benefit: 'Higher Returns'
    }
  ];

  const stats = [
    { label: 'Active Users', value: 850000, prefix: '', suffix: '+' },
    { label: 'Daily Volume', value: 125, prefix: '$', suffix: 'M+' },
    { label: 'Countries', value: 180, prefix: '', suffix: '+' },
    { label: 'Uptime', value: 99.9, prefix: '', suffix: '%' }
  ];

  const demoElements = [
    {
      title: 'Floating Elements',
      component: (
        <div className="flex space-x-4">
          <FloatingElement delay={0}>
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </FloatingElement>
          <FloatingElement delay={1}>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </FloatingElement>
          <FloatingElement delay={2}>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
          </FloatingElement>
        </div>
      )
    },
    {
      title: 'Pulse Effects',
      component: (
        <div className="flex space-x-4">
          <PulseElement color="purple">
            <Button className="bg-purple-500 hover:bg-purple-600">
              <Gift className="w-4 h-4 mr-2" />
              Claim Reward
            </Button>
          </PulseElement>
        </div>
      )
    },
    {
      title: 'Typewriter Text',
      component: (
        <div className="text-2xl font-bold text-green-400">
          <TypewriterText text="Trade crypto in 30 seconds!" speed={80} />
        </div>
      )
    },
    {
      title: 'Animated Counters',
      component: (
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">
                <AnimatedCounter 
                  target={stat.value} 
                  prefix={stat.prefix} 
                  suffix={stat.suffix}
                  duration={2000 + index * 500}
                />
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section with Animations */}
        <div className="text-center mb-16">
          <SlideInElement direction="down" delay={0}>
            <h1 className="text-6xl font-bold mb-6">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                NebulaX
              </span>
            </h1>
          </SlideInElement>
          
          <SlideInElement direction="up" delay={0.5}>
            <div className="text-2xl text-gray-300 mb-8">
              <TypewriterText text="The world's fastest crypto exchange" speed={50} />
            </div>
          </SlideInElement>

          <SlideInElement direction="up" delay={1}>
            <div className="flex justify-center space-x-4 mb-12">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 transform hover:scale-105 transition-all duration-200">
                <Zap className="w-5 h-5 mr-2" />
                Start Trading Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-200">
                Watch Demo
              </Button>
            </div>
          </SlideInElement>
        </div>

        {/* Animated Stats */}
        <SlideInElement direction="up" delay={1.5}>
          <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-16">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold text-purple-400 mb-2">
                      <AnimatedCounter 
                        target={stat.value} 
                        prefix={stat.prefix} 
                        suffix={stat.suffix}
                        duration={3000 + index * 200}
                      />
                    </div>
                    <div className="text-gray-400">{stat.label}</div>
                    <AnimatedProgressBar progress={85 + index * 5} color="purple" duration={2000 + index * 300} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </SlideInElement>

        {/* Feature Highlights */}
        <div className="mb-16">
          <SlideInElement direction="down" delay={2}>
            <h2 className="text-4xl font-bold text-center mb-12">
              Why Choose <span className="text-purple-400">NebulaX</span>?
            </h2>
          </SlideInElement>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureHighlight key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>

        {/* Animation Demos */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Interactive Animation Showcase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center space-x-4 mb-8">
              {demoElements.map((demo, index) => (
                <Button
                  key={index}
                  variant={activeDemo === index ? "default" : "outline"}
                  onClick={() => setActiveDemo(index)}
                  className="transition-all duration-200 hover:scale-105"
                >
                  {demo.title}
                </Button>
              ))}
            </div>
            
            <div className="min-h-48 flex items-center justify-center p-8 bg-white/5 rounded-lg">
              {demoElements[activeDemo]?.component}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action with Animations */}
        <SlideInElement direction="up" delay={3}>
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-12 text-center">
              <FloatingElement>
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </FloatingElement>
              
              <h2 className="text-4xl font-bold mb-4">Ready to Start Trading?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join <AnimatedCounter target={850000} suffix="+" /> traders worldwide
              </p>
              
              <PulseElement color="green">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-lg px-12 py-4 transform hover:scale-110 transition-all duration-300">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Get Started in 30 Seconds
                </Button>
              </PulseElement>
            </CardContent>
          </Card>
        </SlideInElement>
      </div>

      {/* CSS for custom animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes slide-in-left {
          from { 
            opacity: 0; 
            transform: translateX(-50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes slide-in-right {
          from { 
            opacity: 0; 
            transform: translateX(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes slide-in-up {
          from { 
            opacity: 0; 
            transform: translateY(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-in-down {
          from { 
            opacity: 0; 
            transform: translateY(-50px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out;
        }
        
        .animate-slide-in-down {
          animation: slide-in-down 0.6s ease-out;
        }
        
        .animate-blink {
          animation: blink 1s infinite;
        }
        
        .animate-pulse-purple {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}