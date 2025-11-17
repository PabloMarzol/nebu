import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

/**
 * Risk Disclosure Banner Component
 * Warning banner about cryptocurrency trading risks
 *
 * Features:
 * - Dismissible banner
 * - Links to risk disclosure and terms of service
 * - Prominent warning styling
 */
export default function RiskBanner() {
  const [showBanner, setShowBanner] = useState(true);

  if (!showBanner) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 relative">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-red-300 text-sm">
            <strong>Risk Warning:</strong> Cryptocurrency trading involves substantial risk of
            loss. Only invest what you can afford to lose completely.
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Link href="/risk-disclosure">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 h-6 px-2"
              >
                Read Full Risk Disclosure
              </Button>
            </Link>
            <Link href="/terms-of-service">
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-400 hover:text-purple-300 h-6 px-2"
              >
                Terms of Service
              </Button>
            </Link>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowBanner(false)}
          className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
