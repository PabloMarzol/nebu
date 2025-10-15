import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

interface AuthNavbarProps {
  title: string;
  showBackToHome?: boolean;
}

export default function AuthNavbar({ title, showBackToHome = true }: AuthNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-white font-bold text-xl">NebulaX</span>
            </div>
          </Link>

          {/* Page Title */}
          <div className="text-white font-medium text-lg">
            {title}
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-4">
            {showBackToHome && (
              <Link href="/">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/10 hover:text-cyan-300"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}