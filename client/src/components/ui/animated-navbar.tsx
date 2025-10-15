import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Atom, Menu, X, Zap, Sparkles, ChevronDown } from "lucide-react";

export default function AnimatedNavbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20,
        staggerChildren: 0.1
      }
    },
    scrolled: {
      // backdropFilter: "blur(20px)",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderBottomColor: "rgba(139, 92, 246, 0.3)",
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="initial"
      animate={isScrolled ? "scrolled" : "animate"}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '64px',
        margin: 0,
        padding: 0,
        zIndex: 999999,
        transform: 'translateY(0px)'
      }}
      className="border-b border-border/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Animated Logo */}
          <motion.div variants={itemVariants}>
            <Link href="/" className="flex items-center space-x-3">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Atom className="text-white w-5 h-5" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                NebulaX
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            className="hidden md:flex items-center space-x-2"
            variants={itemVariants}
          >
            {[
              { href: "/trading", label: "Trading", icon: Zap },
              { href: "/markets", label: "Markets", icon: Sparkles },
              { href: "/platform", label: "Platform", icon: Atom }
            ].map((item, index) => (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={item.href}>
                  <Button
                    variant={location === item.href ? "default" : "ghost"}
                    size="sm"
            className="relative overflow-hidden group text-xs px-2"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <item.icon className="w-3 h-3 mr-1 relative z-10 hidden lg:block" />
                    <span className="relative z-10">{item.label}</span>
                  </Button>
                </Link>
              </motion.div>
            ))}
            
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs px-2">
                  Services
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-background/95 border border-border/20">
                <DropdownMenuItem asChild>
                  <Link href="/p2p" className="w-full">
                    <Menu className="w-4 h-4 mr-2" />
                    P2P Trading
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/otc" className="w-full">
                    <X className="w-4 h-4 mr-2" />
                    OTC Desk
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/staking" className="w-full">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Staking
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/launchpad" className="w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    Launchpad
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/copy-trading" className="w-full">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Copy Trading
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/portfolio" className="w-full">
                    <Atom className="w-4 h-4 mr-2" />
                    Portfolio
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>

          {/* Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">U</span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-background/95 border border-border/20" align="end">
              <div className="px-3 py-2 border-b border-border/20">
                <p className="text-sm font-medium">Account</p>
                <p className="text-xs text-muted-foreground">Manage your profile</p>
              </div>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="w-full">
                  <Menu className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                <X className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <motion.div className="md:hidden" variants={itemVariants}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 border-t border-border/20"
          >
            <div className="px-4 py-2 space-y-2">
              {[
                { href: "/trading", label: "Trading" },
                { href: "/markets", label: "Markets" },
                { href: "/platform", label: "Platform" },
                { href: "/p2p", label: "P2P" },
                { href: "/otc", label: "OTC" },
                { href: "/staking", label: "Staking" },
                { href: "/launchpad", label: "Launchpad" },
                { href: "/copy-trading", label: "Copy Trading" },
                { href: "/portfolio", label: "Portfolio" }
              ].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}