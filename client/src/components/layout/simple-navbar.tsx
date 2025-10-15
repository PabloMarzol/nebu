import { Link, useLocation } from "wouter";
import { WalletConnect } from "@/components/WalletConnect";
// import nebulaXLogo from "@assets/Screenshot 2025-07-10 at 22.08.38_1752181724305.png";

export function Navbar() {
  const [location] = useLocation();
  
  const getPageTitle = () => {
    switch (location) {
      case '/': return '🌟 NEBULA XCHANGE';
      case '/trading': return '📈 TRADING TERMINAL';
      case '/markets': return '📊 MARKETS';
      case '/ai-assistant': return '🤖 AI ASSISTANT';
      case '/launchpad': return '🚀 LAUNCHPAD';
      case '/about': return 'ℹ️ ABOUT NEBULA XCHANGE';
      case '/marketing': return '📢 MARKETING DASHBOARD';
      case '/learning-pass': return '🎓 LEARNING PASS';
      case '/ai-recommendations': return '🧠 AI RECOMMENDATIONS';
      case '/success-stories': return '⭐ SUCCESS STORIES';
      case '/animations': return '✨ PLATFORM ANIMATIONS';
      case '/sound-design': return '🎧 ADAPTIVE SOUND DESIGN';
      case '/video-recorder': return '📹 VIDEO RECORDER';
      case '/advanced-features': return '✨ ADVANCED UX FEATURES';
      case '/social-share': return '🚀 SOCIAL SHARE';
      case '/pricing': return '💰 PRICING PLANS';
      case '/kyc': return '🔐 KYC VERIFICATION';
      case '/client-portal': return '👤 CLIENT PORTAL';
      case '/payments': return '💳 PAYMENT GATEWAY';
      case '/support': return '🎧 SUPPORT CENTER';
      case '/payment-simulation': return '💳 PAYMENT SIMULATION';
      case '/terms': return '📋 TERMS OF SERVICE';
      case '/privacy': return '🔒 PRIVACY POLICY';
      case '/aml-policy': return '🛡️ AML POLICY';
      case '/risk-disclosure': return '⚠️ RISK DISCLOSURE';
      default: return '🌌 NEBULA XCHANGE PLATFORM';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-black">
      {/* Page Title Bar - Responsive */}
      <div className="h-10 bg-purple-500 flex items-center justify-center px-2">
        <div className="text-white font-bold text-xs sm:text-sm md:text-lg lg:text-xl tracking-wide uppercase text-center line-clamp-1 max-w-full overflow-hidden">
          {getPageTitle()}
        </div>
      </div>
      
      {/* Navigation Bar */}
      <div className="h-11 flex items-center justify-between px-2 sm:px-5">
        {/* Logo */}
        <Link href="/" onClick={() => {
          console.log("NebulaX logo clicked - navigating to home");
          window.location.href = "/";
        }}>
          <div className="flex items-center gap-1 sm:gap-2 cursor-pointer">
            <img 
              //src={nebulaXLogo} 
              alt="NebulaX Logo" 
              className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
              style={{ 
                filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.3))',
                mixBlendMode: 'multiply',
                backgroundColor: 'transparent'
              }}
              onError={(e) => {
                console.error("Logo image failed to load:", e);
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-sm sm:text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              NebulaX
            </span>
          </div>
        </Link>

        {/* Navigation Links with Dropdowns - Hidden on very small screens */}
        <div className="hidden md:flex gap-3 lg:gap-6">
          {/* Trading Dropdown */}
          <div className="relative group">
            <span className="cursor-pointer text-sm text-white hover:text-purple-400">
              Trading ▾
            </span>
            <div className="absolute top-full left-0 mt-1 w-48 bg-gray-900 border border-purple-500/20 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link href="/trading" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>Spot Trading</Link>
              <Link href="/p2p-trading" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>P2P Trading</Link>
              <Link href="/otc-desk" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>OTC Desk</Link>
              <Link href="/copy-trading" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>Copy Trading</Link>
            </div>
          </div>

          {/* Platform Dropdown */}
          <div className="relative group">
            <span className="cursor-pointer text-sm text-white hover:text-purple-400">
              Platform ▾
            </span>
            <div className="absolute top-full left-0 mt-1 w-48 bg-gray-900/95 backdrop-blur-sm border border-purple-500/30 rounded-md shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[9999]">
              <Link href="/markets" className="block px-4 py-3 text-sm text-white hover:bg-purple-500/30 hover:text-purple-200 transition-colors duration-200 border-b border-gray-800/50" onClick={(e) => {
                console.log("Markets navigation clicked - forcing navigation");
                e.preventDefault();
                window.location.href = "/markets";
              }}>📊 Markets</Link>
              <Link href="/portfolio" className="block px-4 py-3 text-sm text-white hover:bg-purple-500/30 hover:text-purple-200 transition-colors duration-200 border-b border-gray-800/50" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>💼 Portfolio</Link>
              <Link href="/portfolio-analytics" className="block px-4 py-3 text-sm text-white hover:bg-purple-500/30 hover:text-purple-200 transition-colors duration-200 border-b border-gray-800/50" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>📈 Portfolio Analytics</Link>
              <Link href="/staking" className="block px-4 py-3 text-sm text-white hover:bg-purple-500/30 hover:text-purple-200 transition-colors duration-200 border-b border-gray-800/50" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>🔒 Staking</Link>
              <Link href="/launchpad" className="block px-4 py-3 text-sm text-white hover:bg-purple-500/30 hover:text-purple-200 transition-colors duration-200 border-b border-gray-800/50" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>🚀 Launchpad</Link>
              <Link href="/security" className="block px-4 py-3 text-sm text-white hover:bg-purple-500/30 hover:text-purple-200 transition-colors duration-200" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>🛡️ Security Dashboard</Link>
            </div>
          </div>

          {/* AI & Tools Dropdown */}
          <div className="relative group">
            <span className="cursor-pointer text-sm text-white hover:text-purple-400">
              AI & Tools ▾
            </span>
            <div className="absolute top-full left-0 mt-1 w-48 bg-gray-900 border border-purple-500/20 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link href="/ai-assistant" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>AI Assistant</Link>
              <Link href="/ai-recommendations" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>AI Recommendations</Link>
              <Link href="/video-recorder" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>Video Recorder</Link>
              <Link href="/learning-pass" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>Learning Pass</Link>
              <Link href="/advanced-features" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>Advanced Features</Link>
              <Link href="/animations" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>Platform Animations</Link>
              <Link href="/api-keys" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>API Keys</Link>
              <Link href="/docs/api" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>API Documentation</Link>
              <Link href="/coincap-integration" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>CoinCap Integration</Link>
            </div>
          </div>

          {/* Account & Support Dropdown */}
          <div className="relative group">
            <span className="cursor-pointer text-sm text-white hover:text-purple-400">
              Account ▾
            </span>
            <div className="absolute top-full left-0 mt-1 w-48 bg-gray-900 border border-purple-500/20 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link href="/client-portal" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>Client Portal</Link>
              <Link href="/payments" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>Payment Gateway</Link>
              <Link href="/payment-simulation" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>💳 Payment Simulation</Link>
              <Link href="/support" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>Support Center</Link>
              <Link href="/security-settings" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>Security Settings</Link>
              <Link href="/kyc-verification" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setTimeout(() => window.scrollTo(0, 0), 50)}>KYC Verification</Link>
            </div>
          </div>

          {/* Legal Dropdown */}
          <div className="relative group">
            <span className="cursor-pointer text-sm text-white hover:text-purple-400">
              Legal ▾
            </span>
            <div className="absolute top-full left-0 mt-1 w-48 bg-gray-900 border border-purple-500/20 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link href="/terms" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300">Terms of Service</Link>
              <Link href="/privacy" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300">Privacy Policy</Link>
              <Link href="/aml-policy" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300">AML Policy</Link>
              <Link href="/risk-disclosure" className="block px-4 py-2 text-sm text-white hover:bg-purple-500/20 hover:text-purple-300">Risk Disclosure</Link>
            </div>
          </div>

          <Link href="/about" className={`text-sm ${location === '/about' ? 'text-purple-500' : 'text-white'} hover:text-purple-400`}>
            About
          </Link>
        </div>

        {/* Wallet Connect Section - Replaces old auth */}
        <div className="flex gap-1 sm:gap-2 items-center">
          <WalletConnect />
          
          {/* Mobile Menu Button */}
          <button className="md:hidden ml-2 p-1 text-white hover:text-purple-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}