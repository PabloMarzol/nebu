import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  TrendingUp, 
  DollarSign, 
  Trophy, 
  Users,
  Calendar,
  Target,
  Zap,
  Award,
  Quote,
  PlayCircle,
  ExternalLink
} from "lucide-react";

export default function SuccessStoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const successStories = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "From Novice to Pro Trader",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Education",
      timeframe: "6 months",
      achievement: "Achieved 85% win rate",
      roi: "+247%",
      story: "Started with zero crypto knowledge. Used NebulaX's learning pass to master technical analysis. Now running a successful trading strategy.",
      quote: "NebulaX transformed my understanding of crypto trading. The AI recommendations helped me avoid costly mistakes while learning.",
      metrics: {
        "Initial Investment": "$5,000",
        "Current Portfolio": "$17,350", 
        "Trades Executed": "156",
        "Win Rate": "85%"
      },
      badges: ["Quick Learner", "Consistent Trader", "Risk Manager"]
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      title: "DeFi Yield Farming Success",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "DeFi",
      timeframe: "4 months",
      achievement: "Built $50K DeFi portfolio",
      roi: "+180%",
      story: "Leveraged NebulaX's DeFi tools to optimize yield farming strategies across multiple protocols. Achieved consistent 15% monthly returns.",
      quote: "The DeFi analytics and automated rebalancing features saved me countless hours while maximizing my yields.",
      metrics: {
        "Initial Investment": "$20,000",
        "Current Portfolio": "$56,000",
        "Protocols Used": "12",
        "Avg Monthly Return": "15%"
      },
      badges: ["DeFi Expert", "Yield Optimizer", "Protocol Pioneer"]
    },
    {
      id: 3,
      name: "Emily Watson",
      title: "Copy Trading to Independence",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Copy Trading",
      timeframe: "8 months",
      achievement: "Became top copy trader",
      roi: "+324%",
      story: "Started by copying successful traders, learned their strategies, and eventually became a master trader with 500+ followers.",
      quote: "Copy trading was my gateway to understanding market dynamics. Now I'm helping others achieve their trading goals.",
      metrics: {
        "Initial Investment": "$3,000",
        "Current Portfolio": "$12,720",
        "Followers": "547",
        "Copied Trades": "89"
      },
      badges: ["Copy Master", "Community Leader", "Strategy Innovator"]
    },
    {
      id: 4,
      name: "David Kim",
      title: "Institutional Trading Excellence",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Institutional",
      timeframe: "12 months",
      achievement: "Managed $2M portfolio",
      roi: "+156%",
      story: "Used NebulaX's institutional tools to manage client portfolios. Advanced analytics and risk management led to consistent outperformance.",
      quote: "The institutional features and compliance tools make NebulaX perfect for professional portfolio management.",
      metrics: {
        "Assets Under Management": "$2,000,000",
        "Annual Return": "156%",
        "Clients Served": "23",
        "Max Drawdown": "3.2%"
      },
      badges: ["Institutional Expert", "Risk Master", "Client Focused"]
    },
    {
      id: 5,
      name: "Jessica Martinez",
      title: "Single Mom Trading Success",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Education",
      timeframe: "10 months",
      achievement: "Financial independence achieved",
      roi: "+395%",
      story: "As a single mother working two jobs, I needed a way to secure my family's future. NebulaX's mobile platform let me trade during breaks and lunch hours.",
      quote: "NebulaX gave me financial freedom. I can now focus on my kids while my portfolio grows automatically with copy trading.",
      metrics: {
        "Initial Investment": "$2,500",
        "Current Portfolio": "$12,375",
        "Monthly Income": "$1,850",
        "Time Invested": "30 min/day"
      },
      badges: ["Working Parent", "Mobile Trader", "Copy Trading Expert"]
    },
    {
      id: 6,
      name: "Ahmed Hassan",
      title: "International Student Success",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Education",
      timeframe: "7 months",
      achievement: "Funded master's degree",
      roi: "+128%",
      story: "Coming to the US for graduate school, I needed to manage my limited savings wisely. NebulaX's educational resources taught me everything about crypto investing.",
      quote: "Started with $800 saved for textbooks. Now I've funded my entire master's degree through smart crypto trading on NebulaX.",
      metrics: {
        "Initial Investment": "$800",
        "Current Portfolio": "$1,824",
        "Education Funded": "$15,000",
        "GPA Maintained": "3.8"
      },
      badges: ["Student Success", "Budget Master", "Educational Achiever"]
    },
    {
      id: 7,
      name: "Robert Thompson",
      title: "Retirement Portfolio Revolution",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Institutional",
      timeframe: "18 months",
      achievement: "Doubled retirement savings",
      roi: "+89%",
      story: "At 58, I thought I was too old for crypto. NebulaX's conservative strategies and educational content proved me wrong. My retirement is now secure.",
      quote: "NebulaX made crypto accessible for someone my age. The risk management tools gave me confidence to invest my retirement savings.",
      metrics: {
        "Initial Investment": "$75,000",
        "Current Portfolio": "$141,750",
        "Monthly Dividends": "$2,800",
        "Risk Level": "Conservative"
      },
      badges: ["Retirement Planner", "Conservative Investor", "Late Starter"]
    },
    {
      id: 8,
      name: "Priya Patel",
      title: "Tech Professional Breakthrough",
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "DeFi",
      timeframe: "9 months",
      achievement: "Built automated DeFi empire",
      roi: "+267%",
      story: "As a software engineer, I understood the tech but not the trading. NebulaX's DeFi automation tools let me build a self-managing portfolio.",
      quote: "The automated yield farming strategies are incredible. My portfolio optimizes itself while I focus on my day job at Google.",
      metrics: {
        "Initial Investment": "$15,000",
        "Current Portfolio": "$55,050",
        "DeFi Protocols": "8",
        "Automation Level": "95%"
      },
      badges: ["Tech Expert", "DeFi Pioneer", "Automation Master"]
    },
    {
      id: 9,
      name: "Carlos Mendoza",
      title: "Latin American Trading Champion",
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Copy Trading",
      timeframe: "14 months",
      achievement: "Regional trading leader",
      roi: "+445%",
      story: "From Mexico City, I started with small trades. NebulaX's copy trading feature helped me learn from global experts and build my own following.",
      quote: "NebulaX opened global markets to me. Now I have followers from 15 countries copying my Latin American market strategies.",
      metrics: {
        "Initial Investment": "$1,200",
        "Current Portfolio": "$6,540",
        "Copy Followers": "312",
        "Countries Reached": "15"
      },
      badges: ["Global Trader", "Regional Expert", "Copy Leader"]
    },
    {
      id: 10,
      name: "Linda Chen",
      title: "Nurse to Financial Independence",
      image: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Education",
      timeframe: "11 months",
      achievement: "Healthcare hero to crypto expert",
      roi: "+234%",
      story: "Working 12-hour shifts in the ICU, I needed passive income. NebulaX's automated strategies worked while I saved lives.",
      quote: "While I was helping patients recover, NebulaX was helping my portfolio grow. Now I can afford to work fewer shifts.",
      metrics: {
        "Initial Investment": "$4,500",
        "Current Portfolio": "$15,030",
        "Passive Income": "$1,200/month",
        "Shifts Reduced": "25%"
      },
      badges: ["Healthcare Hero", "Passive Income Pro", "Work-Life Balance"]
    },
    {
      id: 11,
      name: "James Wilson",
      title: "Military Veteran Success Story",
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Institutional",
      timeframe: "16 months",
      achievement: "Veteran entrepreneur funded",
      roi: "+178%",
      story: "After serving 15 years in the Navy, I needed to rebuild financially. NebulaX's disciplined approach matched my military training perfectly.",
      quote: "The strategic thinking from my military background translates perfectly to crypto trading. NebulaX gave me the tools to execute.",
      metrics: {
        "Initial Investment": "$8,500",
        "Current Portfolio": "$23,630",
        "Business Funded": "$50,000",
        "Risk Management": "Excellent"
      },
      badges: ["Military Precision", "Strategic Thinker", "Entrepreneur"]
    },
    {
      id: 12,
      name: "Fatima Al-Rashid",
      title: "Middle Eastern Market Pioneer",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Institutional",
      timeframe: "13 months",
      achievement: "Regional crypto advocate",
      roi: "+156%",
      story: "From Dubai, I pioneered crypto adoption in our region. NebulaX's compliance features made it possible to operate within Islamic finance principles.",
      quote: "NebulaX's Sharia-compliant trading options opened crypto markets to our entire region. Now I educate others on halal crypto investing.",
      metrics: {
        "Initial Investment": "$25,000",
        "Current Portfolio": "$64,000",
        "Students Taught": "150+",
        "Compliance Rating": "Sharia-Compliant"
      },
      badges: ["Regional Pioneer", "Compliance Expert", "Cultural Bridge"]
    },
    {
      id: 13,
      name: "Michael O'Brien",
      title: "Blue-Collar Breakthrough",
      image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Education",
      timeframe: "8 months",
      achievement: "Construction worker to crypto millionaire",
      roi: "+520%",
      story: "Working construction for 20 years, I never thought I'd understand finance. NebulaX's simple interface made crypto accessible to someone like me.",
      quote: "Who knew a guy who builds houses could build wealth with crypto? NebulaX made it simple enough for anyone to succeed.",
      metrics: {
        "Initial Investment": "$3,200",
        "Current Portfolio": "$19,840",
        "Side Income": "$2,500/month",
        "Learning Hours": "200+"
      },
      badges: ["Blue-Collar Success", "Simple Strategy", "Hard Worker"]
    },
    {
      id: 14,
      name: "Dr. Ananya Sharma",
      title: "Medical Professional Portfolio",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Institutional",
      timeframe: "15 months",
      achievement: "Medical practice funded",
      roi: "+198%",
      story: "As a cardiologist, precision is everything. NebulaX's analytical tools appealed to my scientific mind and helped fund my private practice.",
      quote: "The same precision I use in surgery, I apply to crypto trading with NebulaX. The data-driven approach gives me confidence.",
      metrics: {
        "Initial Investment": "$45,000",
        "Current Portfolio": "$134,100",
        "Practice Investment": "$200,000",
        "Patient Satisfaction": "98%"
      },
      badges: ["Medical Professional", "Data-Driven", "Precision Trader"]
    },
    {
      id: 15,
      name: "Sophie Laurent",
      title: "European Fashion Entrepreneur",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Copy Trading",
      timeframe: "12 months",
      achievement: "Fashion empire funded",
      roi: "+312%",
      story: "From Paris, I used NebulaX profits to fund my sustainable fashion startup. The copy trading features let me learn from global markets.",
      quote: "NebulaX connected me to global trading strategies while I built my fashion brand. Now both my portfolio and business are thriving.",
      metrics: {
        "Initial Investment": "$12,000",
        "Current Portfolio": "$49,440",
        "Fashion Brand Value": "$85,000",
        "Sustainable Impact": "Carbon Neutral"
      },
      badges: ["Creative Entrepreneur", "Sustainable Business", "Global Trader"]
    },
    {
      id: 16,
      name: "Kevin Park",
      title: "Gaming Developer Success",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "DeFi",
      timeframe: "6 months",
      achievement: "Indie game studio funded",
      roi: "+189%",
      story: "Creating indie games doesn't pay well initially. NebulaX's DeFi strategies provided steady income while I developed my breakthrough game.",
      quote: "While developing my game, NebulaX's automated strategies earned me enough to quit my day job and focus on what I love.",
      metrics: {
        "Initial Investment": "$5,500",
        "Current Portfolio": "$15,895",
        "Game Downloads": "50K+",
        "Creative Freedom": "100%"
      },
      badges: ["Creative Professional", "Indie Developer", "DeFi Enthusiast"]
    },
    {
      id: 17,
      name: "Maria Santos",
      title: "Brazilian Market Expert",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Copy Trading",
      timeframe: "10 months",
      achievement: "South American crypto leader",
      roi: "+278%",
      story: "From São Paulo, I specialized in emerging market crypto trading. NebulaX's tools helped me navigate volatile South American markets.",
      quote: "NebulaX's risk management was crucial for trading in volatile emerging markets. Now I'm helping others across South America.",
      metrics: {
        "Initial Investment": "$6,800",
        "Current Portfolio": "$25,704",
        "Regional Expertise": "5 Countries",
        "Market Knowledge": "Emerging Markets"
      },
      badges: ["Emerging Markets", "Regional Leader", "Risk Management"]
    },
    {
      id: 18,
      name: "Thomas Anderson",
      title: "Senior Citizen Crypto Convert",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Education",
      timeframe: "20 months",
      achievement: "70-year-old crypto success",
      roi: "+145%",
      story: "At 70, my grandchildren convinced me to try crypto. NebulaX's patient education system made it possible for someone my age to learn.",
      quote: "I thought crypto was for young people. NebulaX proved that with the right education, anyone can succeed at any age.",
      metrics: {
        "Initial Investment": "$18,000",
        "Current Portfolio": "$44,100",
        "Age Started": "70 years",
        "Grandchildren Inspired": "5"
      },
      badges: ["Senior Success", "Lifelong Learner", "Age Defier"]
    },
    {
      id: 19,
      name: "Raj Patel",
      title: "Indian Tech Startup Founder",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "DeFi",
      timeframe: "14 months",
      achievement: "Startup unicorn funded",
      roi: "+456%",
      story: "From Bangalore, I needed funding for my AI startup. NebulaX's DeFi strategies provided the capital without giving up equity.",
      quote: "NebulaX helped me bootstrap my startup without traditional VCs. Now we're valued at $100M and I still own 100%.",
      metrics: {
        "Initial Investment": "$22,000",
        "Current Portfolio": "$122,320",
        "Startup Valuation": "$100M",
        "Equity Retained": "100%"
      },
      badges: ["Tech Entrepreneur", "Bootstrap Success", "Unicorn Founder"]
    },
    {
      id: 6,
      name: "Maya Patel",
      title: "Financial Advisor Success",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b743?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Institutional",
      timeframe: "5 months",
      achievement: "Portfolio Management Expert",
      roi: "+195%",
      story: "Managing client portfolios requires precision. NebulaX's institutional tools have elevated my advisory practice.",
      quote: "NebulaX's risk management features and analytics have transformed how I serve my clients.",
      metrics: {
        "Client Assets": "$2.5M",
        "Average ROI": "+18.2%",
        "Risk Score": "7.2/10",
        "Client Retention": "98%"
      },
      badges: ["Portfolio Manager", "Risk Analyst", "Client Advisor"]
    },
    {
      id: 7,
      name: "Roberto Silva",
      title: "Tech Entrepreneur Journey",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "DeFi",
      timeframe: "7 months",
      achievement: "Innovation Leader",
      roi: "+356%",
      story: "Fast-paced startup world requires equally fast financial tools. NebulaX delivers.",
      quote: "NebulaX's speed and AI recommendations align perfectly with tech entrepreneurship.",
      metrics: {
        "Startup Funding": "$500K",
        "Crypto Allocation": "25%",
        "Monthly Growth": "+19.3%",
        "Ventures": "3 active"
      },
      badges: ["Tech Innovator", "Growth Hacker", "Early Adopter"]
    },
    {
      id: 8,
      name: "Dr. Jennifer Walsh",
      title: "Healthcare Professional Success",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Education",
      timeframe: "4 months",
      achievement: "Time-Efficient Investor",
      roi: "+168%",
      story: "Limited time between surgeries, but NebulaX's automation keeps investments on track.",
      quote: "AI assistant provides insights that fit my schedule perfectly.",
      metrics: {
        "Medical Practice": "Cardiothoracic",
        "Investment Time": "2 hrs/week",
        "Automated Trades": "67%",
        "Portfolio Growth": "+12.4%/mo"
      },
      badges: ["Healthcare Pro", "Time Optimizer", "Automated Trading"]
    },
    {
      id: 9,
      name: "Ahmed Hassan",
      title: "Real Estate to Crypto Success",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Institutional",
      timeframe: "6 months",
      achievement: "Cross-Market Expert",
      roi: "+278%",
      story: "Diversified from real estate development into digital assets seamlessly.",
      quote: "NebulaX's institutional tools rival traditional investment platforms.",
      metrics: {
        "Real Estate Portfolio": "$5M",
        "Crypto Allocation": "15%",
        "Combined ROI": "+23.1%",
        "Properties": "12 active"
      },
      badges: ["Real Estate Pro", "Market Diversifier", "Cross-Asset Trader"]
    },
    {
      id: 10,
      name: "Linda Thompson",
      title: "Marketing Director Strategy",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Education",
      timeframe: "5 months",
      achievement: "UX Appreciation Leader",
      roi: "+189%",
      story: "Great UX design meets powerful trading features - exactly what every platform needs.",
      quote: "NebulaX's interface design is what every fintech should aspire to achieve.",
      metrics: {
        "Marketing Budget": "$2M/year",
        "Campaign ROI": "+45%",
        "Crypto Learning": "Advanced",
        "Trading Confidence": "95%"
      },
      badges: ["UX Expert", "Strategic Thinker", "Design Advocate"]
    },
    {
      id: 11,
      name: "Carlos Montenegro",
      title: "Investment Banking Transition",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Institutional",
      timeframe: "8 months",
      achievement: "Institutional Standards Master",
      roi: "+425%",
      story: "Traditional finance background, but NebulaX exceeded institutional expectations.",
      quote: "Compliance standards and risk management exceed my banking expectations.",
      metrics: {
        "Banking Experience": "15 years",
        "Client AUM": "$50M",
        "Crypto Adoption": "85%",
        "Compliance Score": "A+"
      },
      badges: ["Banking Veteran", "Compliance Expert", "High-Frequency Trader"]
    },
    {
      id: 12,
      name: "Yuki Tanaka",
      title: "AI Research Innovation",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "DeFi",
      timeframe: "6 months",
      achievement: "AI-Powered Trading Pioneer",
      roi: "+234%",
      story: "AI researcher impressed by the sophistication of NebulaX's trading assistant.",
      quote: "The AI trading assistant exceeds my expectations as an AI researcher.",
      metrics: {
        "AI Papers": "23 published",
        "Research Focus": "ML Trading",
        "Algorithm Success": "78%",
        "Model Accuracy": "91%"
      },
      badges: ["AI Expert", "Research Leader", "Tech Pioneer"]
    },
    {
      id: 13,
      name: "Isabella Romano",
      title: "Creative Professional Success",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Education",
      timeframe: "4 months",
      achievement: "Creative Professional Leader",
      roi: "+156%",
      story: "Fashion designer building wealth while focusing on creative work.",
      quote: "NebulaX made crypto accessible to creatives like me.",
      metrics: {
        "Design Collections": "4/year",
        "Fashion Week Shows": "6",
        "Creative Income": "+89%",
        "Investment Growth": "+11.8%/mo"
      },
      badges: ["Fashion Designer", "Creative Professional", "Wealth Builder"]
    },
    {
      id: 14,
      name: "Michael O'Brien",
      title: "Mining Engineer Success",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "DeFi",
      timeframe: "7 months",
      achievement: "Resource Sector Specialist",
      roi: "+312%",
      story: "Mining experience helped identify valuable digital assets early.",
      quote: "Applied mining resource principles to digital assets with incredible results.",
      metrics: {
        "Mining Projects": "12 active",
        "Resource Analysis": "Expert",
        "Early Adoption": "85%",
        "Market Timing": "92%"
      },
      badges: ["Mining Expert", "Resource Analyst", "Early Adopter"]
    },
    {
      id: 15,
      name: "Fatima Al-Zahra",
      title: "Business Consultant Strategy",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Institutional",
      timeframe: "5 months",
      achievement: "Strategic Investment Advisor",
      roi: "+201%",
      story: "Fortune 500 consulting requires analytical rigor - NebulaX delivers.",
      quote: "Professional-grade analytics and risk assessment for serious investors.",
      metrics: {
        "Client Companies": "Fortune 500",
        "Consulting Revenue": "$2M/year",
        "Strategic Projects": "18",
        "Success Rate": "94%"
      },
      badges: ["Strategy Consultant", "Analytics Expert", "Risk Manager"]
    },
    {
      id: 16,
      name: "Jonas Andersson",
      title: "Fintech Developer Excellence",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "DeFi",
      timeframe: "6 months",
      achievement: "Technical Innovation Leader",
      roi: "+267%",
      story: "Fintech developer impressed by NebulaX's technical excellence and API quality.",
      quote: "Their API integration and system architecture are truly best-in-class.",
      metrics: {
        "Fintech Projects": "8 launched",
        "API Integrations": "25+",
        "Code Quality": "A+",
        "System Uptime": "99.9%"
      },
      badges: ["Fintech Developer", "API Expert", "System Architect"]
    },
    {
      id: 17,
      name: "Rachel Green",
      title: "Investment Lawyer Excellence",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Institutional",
      timeframe: "4 months",
      achievement: "Compliance Excellence Leader",
      roi: "+178%",
      story: "Investment law specialist confirms NebulaX exceeds traditional institution standards.",
      quote: "Regulatory compliance and security measures set the gold standard.",
      metrics: {
        "Legal Experience": "12 years",
        "Compliance Cases": "200+",
        "Client Trust": "98%",
        "Regulatory Score": "A+"
      },
      badges: ["Investment Lawyer", "Compliance Expert", "Security Advocate"]
    },
    {
      id: 18,
      name: "Wei Zhang",
      title: "Blockchain Engineer Innovation",
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "DeFi",
      timeframe: "8 months",
      achievement: "Blockchain Technology Expert",
      roi: "+389%",
      story: "Blockchain protocol engineer confirms world-class technical implementation.",
      quote: "Technical sophistication and security implementation are truly world-class.",
      metrics: {
        "Blockchain Projects": "15 protocols",
        "Code Contributions": "10K+ lines",
        "Security Audits": "98% passed",
        "Network Uptime": "99.99%"
      },
      badges: ["Blockchain Engineer", "Protocol Developer", "Security Expert"]
    },
    {
      id: 19,
      name: "Sophie Martin",
      title: "Sustainability Advisor Success",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "Education",
      timeframe: "5 months",
      achievement: "ESG Investment Pioneer",
      roi: "+167%",
      story: "Sustainability focus with eco-friendly blockchain technologies and strong returns.",
      quote: "Environmental values align with NebulaX's sustainable blockchain commitment.",
      metrics: {
        "ESG Projects": "25 active",
        "Carbon Reduction": "40%",
        "Sustainable ROI": "+12.8%/mo",
        "Green Rating": "A+"
      },
      badges: ["Sustainability Expert", "ESG Pioneer", "Green Investor"]
    },
    {
      id: 20,
      name: "Dr. Rajesh Kumar",
      title: "Data Science Trading Master",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      category: "DeFi",
      timeframe: "6 months",
      achievement: "Data-Driven Trading Master",
      roi: "+298%",
      story: "Data scientist builds sophisticated trading models using NebulaX's analytics.",
      quote: "Exceptional data quality and analytics enabled predictive model development.",
      metrics: {
        "ML Models": "12 deployed",
        "Prediction Accuracy": "87%",
        "Data Points": "10M+ analyzed",
        "Model Performance": "+17.9%/mo"
      },
      badges: ["Data Scientist", "ML Expert", "Quantitative Analyst"]
    }
  ];

  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Day Trader",
      rating: 5,
      text: "NebulaX's real-time market data and AI insights have revolutionized my trading strategy. I've increased my success rate by 40%.",
      achievement: "+40% success rate"
    },
    {
      name: "Lisa Park",
      role: "Crypto Investor",
      rating: 5,
      text: "The portfolio analytics and rebalancing suggestions helped me optimize my long-term investments. Couldn't be happier!",
      achievement: "Optimized portfolio"
    },
    {
      name: "James Wilson",
      role: "DeFi Enthusiast",
      rating: 5,
      text: "Best platform for DeFi yield farming. The automated strategies and risk management tools are game-changing.",
      achievement: "15% monthly yields"
    },
    {
      name: "Sarah Mitchell",
      role: "Financial Planner",
      rating: 5,
      text: "Risk assessment tools and diversification insights help me create balanced crypto portfolios for clients.",
      achievement: "Risk-optimized"
    },
    {
      name: "Carlos Mendez",
      role: "Options Trader",
      rating: 5,
      text: "Derivatives trading interface is intuitive. Made $15K profit in first month using advanced order types.",
      achievement: "$15K first month"
    },
    {
      name: "Dr. Amanda Chen",
      role: "Research Scientist",
      rating: 5,
      text: "Algorithm transparency and backtesting capabilities support my quantitative research perfectly.",
      achievement: "Research validated"
    },
    {
      name: "Mark Rodriguez",
      role: "Fund Manager",
      rating: 5,
      text: "Institutional tools and compliance features make managing crypto funds seamless and secure.",
      achievement: "Fund growth +180%"
    },
    {
      name: "Jennifer Kim",
      role: "Tech Startup CEO",
      rating: 5,
      text: "Crypto treasury management for our startup became effortless with NebulaX's business tools.",
      achievement: "Treasury optimized"
    },
    {
      name: "Roberto Silva",
      role: "Mining Operator",
      rating: 5,
      text: "Direct mining pool integration and automated conversions streamline our operations significantly.",
      achievement: "50% time saved"
    },
    {
      name: "Lisa Patel",
      role: "Crypto Journalist",
      rating: 5,
      text: "Market analysis tools and real-time data help me provide accurate crypto market reporting.",
      achievement: "Accurate reporting"
    },
    {
      name: "Daniel Foster",
      role: "Retirement Advisor",
      rating: 5,
      text: "Conservative crypto strategies help retirees safely diversify into digital assets with confidence.",
      achievement: "Safe diversification"
    },
    {
      name: "Maya Johannsen",
      role: "Venture Capitalist",
      rating: 5,
      text: "Token analysis and project evaluation tools support our investment due diligence process.",
      achievement: "Better deal flow"
    },
    {
      name: "Alex Petrov",
      role: "Tax Specialist",
      rating: 5,
      text: "Automated tax reporting and transaction categorization saves hours during tax season preparation.",
      achievement: "Tax compliant"
    },
    {
      name: "Sophie Turner",
      role: "NFT Creator",
      rating: 5,
      text: "Cross-chain NFT trading and royalty management features support my digital art business.",
      achievement: "Multi-chain sales"
    },
    {
      name: "Lucas Brown",
      role: "E-commerce Owner",
      rating: 5,
      text: "Crypto payment integration for my online store increased international sales by 65%.",
      achievement: "+65% sales"
    },
    {
      name: "Elena Vasquez",
      role: "Trading Bot Developer",
      rating: 5,
      text: "API performance and webhook reliability make algorithmic trading strategies execute flawlessly.",
      achievement: "99.9% uptime"
    },
    {
      name: "Hassan Al-Rashid",
      role: "Islamic Finance Advisor",
      rating: 5,
      text: "Sharia-compliant trading features allow Muslim investors to participate in crypto markets ethically.",
      achievement: "Halal certified"
    },
    {
      name: "Rachel Cooper",
      role: "Insurance Broker",
      rating: 5,
      text: "Crypto insurance options and risk management tools protect client digital asset portfolios.",
      achievement: "Risk protected"
    }
  ];

  const achievements = [
    { metric: "Total Users Profit", value: "$47.2M", icon: <DollarSign className="w-6 h-6" /> },
    { metric: "Success Stories", value: "4,156", icon: <Trophy className="w-6 h-6" /> },
    { metric: "Average ROI", value: "+289%", icon: <TrendingUp className="w-6 h-6" /> },
    { metric: "Active Traders", value: "23,847", icon: <Users className="w-6 h-6" /> }
  ];

  const filteredStories = selectedCategory === 'all' 
    ? successStories 
    : successStories.filter(story => story.category.toLowerCase() === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'education': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'defi': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'copy trading': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'institutional': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6 pt-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Success Stories
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Real traders, real results, real success with NebulaX
          </p>
        </div>

        {/* Achievement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {achievements.map((achievement, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700/50 text-center">
              <CardContent className="p-6">
                <div className="text-cyan-400 mb-3 flex justify-center">
                  {achievement.icon}
                </div>
                <div className="text-3xl font-bold mb-2">{achievement.value}</div>
                <p className="text-gray-400">{achievement.metric}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="stories" className="space-y-8">
          <TabsList className="bg-gray-800/50 border border-gray-700/50">
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="submit">Share Your Story</TabsTrigger>
          </TabsList>

          <TabsContent value="stories">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['all', 'education', 'defi', 'copy trading', 'institutional'].map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>

            {/* Success Stories Grid */}
            <div className="grid gap-8">
              {filteredStories.map((story, storyIndex) => (
                <Card key={`story-${story.id}-${storyIndex}`} className="bg-gray-800/50 border-gray-700/50">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={story.image} alt={story.name} />
                        <AvatarFallback>{story.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold">{story.name}</h3>
                            <p className="text-cyan-400">{story.title}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-400">{story.roi}</div>
                            <p className="text-sm text-gray-400">{story.timeframe}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge className={getCategoryColor(story.category)}>
                            {story.category}
                          </Badge>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            {story.achievement}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="flex items-start space-x-3 mb-4">
                        <Quote className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                        <p className="text-gray-300 italic">"{story.quote}"</p>
                      </div>
                      <p className="text-gray-400">{story.story}</p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {Object.entries(story.metrics).map(([key, value]) => (
                        <div key={key} className="text-center p-3 rounded bg-gray-700/30">
                          <p className="text-sm text-gray-400">{key}</p>
                          <p className="text-lg font-bold text-cyan-400">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {story.badges.map((badge, idx) => (
                        <Badge key={idx} className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          <Award className="w-3 h-3 mr-1" />
                          {badge}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Journey: {story.timeframe}</span>
                      </div>
                      <Button className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        View Full Story
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="testimonials">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={`testimonial-${testimonial.name}-${index}`} className="bg-gray-800/50 border-gray-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <Badge className="ml-auto bg-green-500/20 text-green-400">
                        {testimonial.achievement}
                      </Badge>
                    </div>
                    <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                    <div className="border-t border-gray-700 pt-4">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="community">
            <div className="text-center space-y-8">
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="p-12">
                  <Users className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold mb-4">Join Our Thriving Community</h2>
                  <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                    Connect with thousands of successful traders, share strategies, and learn from the best. 
                    Our community is where success stories begin.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">15,623</div>
                      <p className="text-gray-400">Active Traders</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">89%</div>
                      <p className="text-gray-400">Success Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">$24.7M</div>
                      <p className="text-gray-400">Community Profits</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="submit">
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Share Your Success Story</CardTitle>
                <p className="text-gray-400 text-center">Inspire others with your trading journey and achievements</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center">
                    <Zap className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-6">
                      Have you achieved significant success with NebulaX? We'd love to feature your story 
                      and help inspire other traders in our community.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-lg bg-gray-700/30">
                      <h4 className="font-semibold mb-2">What to Include:</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Your trading journey timeline</li>
                        <li>• Key strategies that worked</li>
                        <li>• NebulaX features you used</li>
                        <li>• Quantifiable results</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-700/30">
                      <h4 className="font-semibold mb-2">Benefits:</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Featured on our platform</li>
                        <li>• Premium account upgrade</li>
                        <li>• Community recognition</li>
                        <li>• Trading rewards</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Submit Your Story
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}