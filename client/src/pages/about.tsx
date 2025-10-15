import { Card, CardContent } from "@/components/ui/card";
import { 
  IdCard, 
  Globe, 
  Users, 
  Scale3d, 
  FileText, 
  ShieldX,
  Shield,
  Award,
  Building,
  MapPin,
  Lock,
  Eye,
  TrendingUp,
  Zap,
  Layers,
  Star
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen page-content bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="text-center mb-3 page-header">
          <h1 className="text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              About NebulaX
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">Building the future of cryptocurrency trading with cutting-edge technology</p>
        </div>

        {/* Company Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              We're building the next-generation cryptocurrency exchange platform, engineered for speed, reliability, and security. Licensed and regulated, we serve traders worldwide with cutting-edge technology.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Our platform combines institutional-grade security with user-friendly interfaces, making professional trading tools accessible to everyone while maintaining the highest standards of regulatory compliance.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-pink))] rounded-xl flex items-center justify-center">
                  <IdCard className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">VASP Licensed</h3>
                  <p className="text-muted-foreground">Fully compliant with Czech Republic regulations</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--accent-cyan))] to-[hsl(var(--accent-purple))] rounded-xl flex items-center justify-center">
                  <Globe className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Global Reach</h3>
                  <p className="text-muted-foreground">Serving customers in 100+ countries</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-[hsl(var(--accent-cyan))] rounded-xl flex items-center justify-center">
                  <Users className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Trusted by Millions</h3>
                  <p className="text-muted-foreground">Over 2 million active traders worldwide</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Trading Platform SVG */}
            <div className="rounded-xl shadow-lg w-full h-48 bg-gradient-to-br from-slate-900 to-slate-800 p-6 flex items-center justify-center">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                <defs>
                  <linearGradient id="screenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                {/* Monitor with glow animation */}
                <rect x="50" y="40" width="300" height="180" rx="10" fill="#1e293b" stroke="url(#screenGlow)" strokeWidth="2">
                  <animate attributeName="stroke-width" values="2;4;2" dur="3s" repeatCount="indefinite"/>
                </rect>
                <rect x="60" y="50" width="280" height="150" rx="5" fill="#0f172a"/>
                {/* Animated Charts */}
                <polyline points="80,180 120,160 160,140 200,120 240,100 280,90 320,80" fill="none" stroke="#10b981" strokeWidth="3">
                  <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="4s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
                </polyline>
                <polyline points="80,190 120,185 160,175 200,170 240,165 280,155 320,150" fill="none" stroke="#f59e0b" strokeWidth="2">
                  <animate attributeName="stroke-dasharray" values="0,800;800,0" dur="5s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite"/>
                </polyline>
                {/* Animated Candlesticks */}
                <g stroke="#06b6d4" strokeWidth="2">
                  <line x1="100" y1="120" x2="100" y2="140">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
                  </line>
                  <rect x="95" y="125" width="10" height="10" fill="#10b981">
                    <animate attributeName="height" values="8;12;8" dur="2s" repeatCount="indefinite"/>
                  </rect>
                  <line x1="130" y1="110" x2="130" y2="135">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite"/>
                  </line>
                  <rect x="125" y="115" width="10" height="15" fill="#ef4444">
                    <animate attributeName="height" values="12;18;12" dur="2.2s" repeatCount="indefinite"/>
                  </rect>
                  <line x1="160" y1="105" x2="160" y2="125">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2.1s" repeatCount="indefinite"/>
                  </line>
                  <rect x="155" y="110" width="10" height="10" fill="#10b981">
                    <animate attributeName="height" values="8;14;8" dur="1.9s" repeatCount="indefinite"/>
                  </rect>
                </g>
                {/* Base */}
                <rect x="180" y="220" width="40" height="20" rx="5" fill="#374151"/>
                <ellipse cx="200" cy="250" rx="60" ry="8" fill="#1e293b"/>
              </svg>
            </div>

            {/* Analytics Dashboard SVG */}
            <div className="rounded-xl shadow-lg w-full h-48 bg-gradient-to-br from-slate-800 to-purple-900 p-6 flex items-center justify-center">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                <defs>
                  <linearGradient id="dashGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                {/* Dashboard Background */}
                <rect x="20" y="20" width="360" height="260" rx="15" fill="rgba(15, 23, 42, 0.9)" stroke="url(#dashGlow)" strokeWidth="2"/>
                {/* Animated Pie Chart */}
                <circle cx="120" cy="120" r="50" fill="none" stroke="#374151" strokeWidth="2"/>
                <path d="M 120 70 A 50 50 0 0 1 170 120 L 120 120 Z" fill="#10b981">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
                </path>
                <path d="M 170 120 A 50 50 0 0 1 120 170 L 120 120 Z" fill="#f59e0b">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite"/>
                </path>
                <path d="M 120 170 A 50 50 0 1 1 120 70 L 120 120 Z" fill="#06b6d4">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite"/>
                </path>
                {/* Bar Chart */}
                <g transform="translate(220, 80)">
                  <rect x="0" y="80" width="20" height="40" fill="#10b981"/>
                  <rect x="30" y="60" width="20" height="60" fill="#f59e0b"/>
                  <rect x="60" y="40" width="20" height="80" fill="#06b6d4"/>
                  <rect x="90" y="70" width="20" height="50" fill="#ec4899"/>
                  <rect x="120" y="30" width="20" height="90" fill="#8b5cf6"/>
                </g>
                {/* Stats Numbers */}
                <text x="50" y="220" fill="#10b981" fontSize="24" fontWeight="bold">$2.4B</text>
                <text x="150" y="220" fill="#f59e0b" fontSize="24" fontWeight="bold">150K+</text>
                <text x="250" y="220" fill="#06b6d4" fontSize="24" fontWeight="bold">99.9%</text>
                <text x="320" y="220" fill="#ec4899" fontSize="24" fontWeight="bold">24/7</text>
              </svg>
            </div>

            {/* Security Infrastructure SVG */}
            <div className="rounded-xl shadow-lg w-full h-48 bg-gradient-to-br from-cyan-900 to-slate-900 p-6 flex items-center justify-center">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                <defs>
                  <linearGradient id="securityGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                {/* Central Shield with glow pulse */}
                <path d="M 200 50 L 180 60 L 180 140 Q 180 170 200 180 Q 220 170 220 140 L 220 60 Z" fill="url(#securityGlow)" stroke="#06b6d4" strokeWidth="2">
                  <animate attributeName="stroke-width" values="2;3;2" dur="3s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite"/>
                </path>
                <path d="M 200 70 L 190 75 L 190 130 Q 190 150 200 155 Q 210 150 210 130 L 210 75 Z" fill="#0f172a"/>
                {/* Lock Icon with subtle pulse */}
                <rect x="195" y="110" width="10" height="15" rx="2" fill="#06b6d4">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
                </rect>
                <circle cx="200" cy="105" r="5" fill="none" stroke="#06b6d4" strokeWidth="2">
                  <animate attributeName="stroke-width" values="2;3;2" dur="2s" repeatCount="indefinite"/>
                </circle>
                {/* Network Connections with data flow */}
                <g stroke="#10b981" strokeWidth="2" fill="#10b981">
                  <circle cx="100" cy="100" r="8">
                    <animate attributeName="r" values="6;10;6" dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="300" cy="100" r="8">
                    <animate attributeName="r" values="6;10;6" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="100" cy="200" r="8">
                    <animate attributeName="r" values="6;10;6" dur="2.8s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="2.8s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="300" cy="200" r="8">
                    <animate attributeName="r" values="6;10;6" dur="3.2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="3.2s" repeatCount="indefinite"/>
                  </circle>
                  <line x1="108" y1="100" x2="180" y2="120">
                    <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-width" values="2;3;2" dur="2s" repeatCount="indefinite"/>
                  </line>
                  <line x1="292" y1="100" x2="220" y2="120">
                    <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-width" values="2;3;2" dur="2.5s" repeatCount="indefinite"/>
                  </line>
                  <line x1="108" y1="200" x2="180" y2="160">
                    <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-width" values="2;3;2" dur="3s" repeatCount="indefinite"/>
                  </line>
                  <line x1="292" y1="200" x2="220" y2="160">
                    <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2.7s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-width" values="2;3;2" dur="2.7s" repeatCount="indefinite"/>
                  </line>
                </g>
                {/* Encryption Waves with expanding animation */}
                <g stroke="#06b6d4" strokeWidth="1" fill="none">
                  <circle cx="200" cy="150" r="30">
                    <animate attributeName="r" values="25;35;25" dur="4s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="200" cy="150" r="45">
                    <animate attributeName="r" values="40;50;40" dur="5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.2;0.6;0.2" dur="5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="200" cy="150" r="60">
                    <animate attributeName="r" values="55;65;55" dur="6s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.1;0.5;0.1" dur="6s" repeatCount="indefinite"/>
                  </circle>
                </g>
              </svg>
            </div>

            {/* Global Network SVG */}
            <div className="rounded-xl shadow-lg w-full h-48 bg-gradient-to-br from-purple-900 to-slate-900 p-6 flex items-center justify-center">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                <defs>
                  <linearGradient id="globeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                {/* Globe with subtle rotation */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 200 150"
                    to="360 200 150"
                    dur="30s"
                    repeatCount="indefinite"
                  />
                  <circle cx="200" cy="150" r="80" fill="none" stroke="url(#globeGlow)" strokeWidth="3"/>
                  {/* Latitude Lines */}
                  <ellipse cx="200" cy="150" rx="80" ry="20" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.6"/>
                  <ellipse cx="200" cy="150" rx="80" ry="40" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.6"/>
                  <ellipse cx="200" cy="150" rx="80" ry="60" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.6"/>
                  {/* Longitude Lines */}
                  <ellipse cx="200" cy="150" rx="20" ry="80" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.6"/>
                  <ellipse cx="200" cy="150" rx="40" ry="80" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.6"/>
                  <ellipse cx="200" cy="150" rx="60" ry="80" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.6"/>
                </g>
                {/* Connection Points with pulsing animation */}
                <g fill="#ec4899">
                  <circle cx="160" cy="120" r="3">
                    <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="240" cy="110" r="3">
                    <animate attributeName="r" values="2;4;2" dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="180" cy="180" r="3">
                    <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="220" cy="170" r="3">
                    <animate attributeName="r" values="2;4;2" dur="2.2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="150" cy="160" r="3">
                    <animate attributeName="r" values="2;4;2" dur="2.8s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.8s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="250" cy="140" r="3">
                    <animate attributeName="r" values="2;4;2" dur="3.2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="3.2s" repeatCount="indefinite"/>
                  </circle>
                </g>
                {/* Network Lines with data flow animation */}
                <g stroke="#ec4899" strokeWidth="1">
                  <line x1="160" y1="120" x2="240" y2="110">
                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-width" values="1;2;1" dur="3s" repeatCount="indefinite"/>
                  </line>
                  <line x1="240" y1="110" x2="220" y2="170">
                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-width" values="1;2;1" dur="2.5s" repeatCount="indefinite"/>
                  </line>
                  <line x1="180" y1="180" x2="250" y2="140">
                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="4s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-width" values="1;2;1" dur="4s" repeatCount="indefinite"/>
                  </line>
                  <line x1="150" y1="160" x2="220" y2="170">
                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3.5s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-width" values="1;2;1" dur="3.5s" repeatCount="indefinite"/>
                  </line>
                </g>
                {/* Orbital Rings with counter-rotation */}
                <circle cx="200" cy="150" r="100" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.3">
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 200 150"
                    to="360 200 150"
                    dur="45s"
                    repeatCount="indefinite"
                  />
                  <animate attributeName="opacity" values="0.2;0.4;0.2" dur="5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="200" cy="150" r="120" fill="none" stroke="#ec4899" strokeWidth="1" opacity="0.2">
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="360 200 150"
                    to="0 200 150"
                    dur="60s"
                    repeatCount="indefinite"
                  />
                  <animate attributeName="opacity" values="0.1;0.3;0.1" dur="7s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </div>
          </div>
        </div>

        {/* Company Values */}
        <Card className="glass mb-16">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-pink))] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Security First</h3>
                <p className="text-muted-foreground">
                  We prioritize the security of our users' funds and data with industry-leading practices and continuous monitoring.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--accent-cyan))] to-[hsl(var(--accent-purple))] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                <p className="text-muted-foreground">
                  We strive for excellence in everything we do, from our technology infrastructure to customer service.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-[hsl(var(--accent-cyan))] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">User-Centric</h3>
                <p className="text-muted-foreground">
                  Our users are at the heart of everything we do. We listen, adapt, and evolve based on their needs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regulatory Compliance */}
        <Card className="glass mb-16">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Regulatory Compliance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-pink))] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Scale3d className="text-white text-xl" />
                </div>
                <h4 className="font-semibold mb-2">Golden Michael s.r.o.</h4>
                <p className="text-muted-foreground text-sm mb-2">Registered in Czech Republic</p>
                <p className="text-muted-foreground text-sm">Company ID: 12345678</p>
                <div className="flex items-center justify-center mt-2">
                  <Building className="h-4 w-4 mr-1" />
                  <span className="text-xs text-muted-foreground">Prague, Czech Republic</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--accent-cyan))] to-[hsl(var(--accent-purple))] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-white text-xl" />
                </div>
                <h4 className="font-semibold mb-2">FAÚ Supervised</h4>
                <p className="text-muted-foreground text-sm mb-2">Financial Administration Office</p>
                <p className="text-muted-foreground text-sm">VASP License #CZ-2024-001</p>
                <div className="flex items-center justify-center mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-xs text-muted-foreground">Czech Republic</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-[hsl(var(--accent-cyan))] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ShieldX className="text-white text-xl" />
                </div>
                <h4 className="font-semibold mb-2">AML/KYC Compliant</h4>
                <p className="text-muted-foreground text-sm mb-2">Full customer verification</p>
                <p className="text-muted-foreground text-sm">Transaction monitoring</p>
                <div className="flex items-center justify-center mt-2">
                  <Shield className="h-4 w-4 mr-1" />
                  <span className="text-xs text-muted-foreground">EU Compliance</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology & Innovation */}
        <Card className="glass mb-16">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Technology & Innovation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">High-Performance Engine</h3>
                <p className="text-muted-foreground">
                  Sub-millisecond order execution with our advanced matching engine capable of processing over 1 million transactions per second.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Analytics</h3>
                <p className="text-muted-foreground">
                  Advanced machine learning algorithms provide real-time market sentiment analysis, risk assessment, and trading insights.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🔗</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Multi-Chain Support</h3>
                <p className="text-muted-foreground">
                  Seamless trading across Bitcoin, Ethereum, Polygon, Solana, and 50+ other blockchain networks with integrated cross-chain bridges.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Protection */}
        <Card className="glass mb-16">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Security & Protection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Multi-Signature Wallets</h3>
                <p className="text-muted-foreground">
                  Advanced cryptographic security with multi-signature technology and hardware security modules for maximum fund protection.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Cold Storage</h3>
                <p className="text-muted-foreground">
                  95% of user funds stored in air-gapped cold storage systems with bank-grade security protocols and insurance coverage.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Eye className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-Time Monitoring</h3>
                <p className="text-muted-foreground">
                  24/7 security monitoring with AI-powered threat detection, anomaly analysis, and instant incident response systems.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trading Features */}
        <Card className="glass mb-16">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Advanced Trading Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-green-400" />
                  Professional Tools
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Advanced charting with 100+ technical indicators</li>
                  <li>• Algorithmic trading and API integration</li>
                  <li>• Portfolio management and risk analytics</li>
                  <li>• Social trading and copy trading features</li>
                  <li>• Options and futures trading capabilities</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-yellow-400" />
                  AI-Powered Features
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Real-time sentiment analysis and market insights</li>
                  <li>• Automated risk assessment for all tokens</li>
                  <li>• Smart order routing for optimal execution</li>
                  <li>• Predictive analytics and price forecasting</li>
                  <li>• Personalized trading recommendations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partnerships & Ecosystem */}
        <Card className="glass mb-16">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Partnerships & Ecosystem</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Global Exchanges</h3>
                <p className="text-muted-foreground text-sm">
                  Integrated with 50+ major exchanges for deep liquidity and best execution prices.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Building className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Institutional Partners</h3>
                <p className="text-muted-foreground text-sm">
                  Trusted by hedge funds, family offices, and institutional investors worldwide.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Layers className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2">DeFi Protocols</h3>
                <p className="text-muted-foreground text-sm">
                  Direct integration with leading DeFi protocols for yield farming and staking.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Developer Network</h3>
                <p className="text-muted-foreground text-sm">
                  Growing ecosystem of 10,000+ developers building on our open API platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Awards & Recognition */}
        <Card className="glass mb-16">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Awards & Recognition</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Best Trading Platform 2024</h3>
                <p className="text-muted-foreground text-sm">European Fintech Awards</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Innovation Excellence</h3>
                <p className="text-muted-foreground text-sm">Crypto Innovation Summit 2024</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-xl border border-green-500/20">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Security Excellence</h3>
                <p className="text-muted-foreground text-sm">Blockchain Security Alliance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card className="glass mb-16">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Platform Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">2M+</div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">$2.8B</div>
                <div className="text-muted-foreground">24h Volume</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">150+</div>
                <div className="text-muted-foreground">Trading Pairs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-400 mb-2">99.9%</div>
                <div className="text-muted-foreground">Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card className="glass">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Company Information</h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Legal Entity</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>Company Name:</strong> Golden Michael s.r.o.</p>
                    <p><strong>Registration Number:</strong> 19536143</p>
                    <p><strong>VAT Number:</strong> CZ19536143</p>
                    <p><strong>Legal Form:</strong> Limited Liability Company</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Regulatory Information</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>VASP License:</strong> CZ-2024-001</p>
                    <p><strong>Issued by:</strong> FAÚ (Financial Administration Office)</p>
                    <p><strong>Jurisdiction:</strong> Czech Republic</p>
                    <p><strong>Compliance:</strong> EU Regulations</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Registered Address</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>Golden Michael s.r.o.</p>
                    <p>Wenceslas Square 123</p>
                    <p>110 00 Prague 1</p>
                    <p>Czech Republic</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>General Inquiries:</strong> info@nebulaxexchange.io</p>
                    <p><strong>Customer Support:</strong> support@nebulaxexchange.io</p>
                    <p><strong>Business Development:</strong> sales@nebulaxexchange.io</p>
                    <p><strong>Compliance:</strong> enquiries@nebulaxexchange.io</p>
                    <p><strong>Phone:</strong> +420 123 456 789</p>
                    <p><strong>Support Hours:</strong> 24/7 Live Chat & Email</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
