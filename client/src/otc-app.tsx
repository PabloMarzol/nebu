import { Switch, Route, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  BarChart3, 
  ArrowRightLeft, 
  CreditCard, 
  Shield, 
  Menu, 
  X,
  Home,
  Calculator,
  Settings,
  Users
} from "lucide-react";
import OTCDashboard from "./otc-components/otc-dashboard";
import OTCTradingInterface from "./otc-components/otc-trading-interface";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function ScrollToTop() {
  return null;
}

function OTCNavigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/trading", label: "Trading", icon: ArrowRightLeft },
    { path: "/deals", label: "Deals", icon: BarChart3 },
    { path: "/settlement", label: "Settlement", icon: CreditCard },
    { path: "/credit", label: "Credit", icon: Building2 },
    { path: "/compliance", label: "Compliance", icon: Shield },
  ];

  return (
    <nav className="glass border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Building2 className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                OTC Desk Pro
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    className={`flex items-center space-x-2 hover:text-purple-400 transition-colors ${
                      isActive(item.path) ? "text-purple-400" : ""
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
              <Users className="w-4 h-4 mr-2" />
              Client Portal
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Calculator className="w-4 h-4 mr-2" />
              Request Quote
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              className="p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.path} href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start flex items-center space-x-3 ${
                      isActive(item.path) ? "text-purple-400 bg-purple-500/10" : ""
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full border-purple-500/30 text-purple-400">
                <Users className="w-4 h-4 mr-2" />
                Client Portal
              </Button>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                <Calculator className="w-4 h-4 mr-2" />
                Request Quote
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function OTCRouter() {
  return (
    <Switch>
      <Route path="/" component={OTCDashboard} />
      <Route path="/trading" component={OTCTradingInterface} />
      <Route path="/deals">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-16">
              <BarChart3 className="w-24 h-24 text-blue-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">Deal Management</h1>
              <p className="text-muted-foreground text-lg mb-8">
                Advanced deal structuring and execution platform for institutional clients
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="glass p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">Deal Creation</h3>
                  <p className="text-muted-foreground">Custom deal structures with flexible terms and conditions</p>
                </div>
                <div className="glass p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">Risk Assessment</h3>
                  <p className="text-muted-foreground">AI-powered risk analysis and counterparty evaluation</p>
                </div>
                <div className="glass p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-400 mb-3">Execution</h3>
                  <p className="text-muted-foreground">Seamless trade execution with real-time settlement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Route>
      <Route path="/settlement">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-16">
              <CreditCard className="w-24 h-24 text-green-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">Settlement Services</h1>
              <p className="text-muted-foreground text-lg mb-8">
                Multi-currency settlement infrastructure with institutional-grade security
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                <div className="glass p-6 rounded-lg text-center">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Bank Wire</h3>
                  <p className="text-muted-foreground text-sm">SWIFT and domestic wire transfers</p>
                </div>
                <div className="glass p-6 rounded-lg text-center">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Crypto Wallet</h3>
                  <p className="text-muted-foreground text-sm">Multi-signature cold storage</p>
                </div>
                <div className="glass p-6 rounded-lg text-center">
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">Escrow</h3>
                  <p className="text-muted-foreground text-sm">Third-party escrow services</p>
                </div>
                <div className="glass p-6 rounded-lg text-center">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Real-time</h3>
                  <p className="text-muted-foreground text-sm">Instant settlement options</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Route>
      <Route path="/credit">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-16">
              <Building2 className="w-24 h-24 text-purple-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">Credit Services</h1>
              <p className="text-muted-foreground text-lg mb-8">
                Institutional credit lines and financing solutions for large-scale trading
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="glass p-8 rounded-lg">
                  <h3 className="text-2xl font-semibold text-purple-400 mb-4">Credit Lines</h3>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Up to $50M credit facilities</li>
                    <li>• Competitive interest rates from 2.5%</li>
                    <li>• Flexible collateral requirements</li>
                    <li>• Real-time credit monitoring</li>
                  </ul>
                </div>
                <div className="glass p-8 rounded-lg">
                  <h3 className="text-2xl font-semibold text-blue-400 mb-4">Trade Financing</h3>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Pre-trade financing approval</li>
                    <li>• Post-trade settlement funding</li>
                    <li>• Cross-currency financing</li>
                    <li>• Risk-based pricing models</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Route>
      <Route path="/compliance">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-16">
              <Shield className="w-24 h-24 text-green-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">Compliance & Security</h1>
              <p className="text-muted-foreground text-lg mb-8">
                Regulatory compliance and security infrastructure for institutional trading
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="glass p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-400 mb-3">KYC/AML</h3>
                  <p className="text-muted-foreground">Automated compliance screening and monitoring</p>
                </div>
                <div className="glass p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">Sanctions</h3>
                  <p className="text-muted-foreground">Real-time sanctions and PEP list screening</p>
                </div>
                <div className="glass p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">Reporting</h3>
                  <p className="text-muted-foreground">Automated regulatory reporting and audit trails</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Route>
      <Route>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4">404</h1>
            <p className="text-xl text-muted-foreground mb-8">Page not found</p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function OTCApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <ScrollToTop />
        <OTCNavigation />
        <OTCRouter />
      </div>
    </QueryClientProvider>
  );
}

export default OTCApp;