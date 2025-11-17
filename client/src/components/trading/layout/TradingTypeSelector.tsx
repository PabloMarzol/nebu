import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface TradingTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

/**
 * Trading Type Selector Component
 * Dropdown selector for choosing between Spot, Futures, and Options trading modes
 *
 * Features:
 * - Clean dropdown UI with status indicators
 * - Hyperliquid badge for Spot and Futures
 * - Live market indicator
 * - Click-outside-to-close functionality
 */
export default function TradingTypeSelector({
  selectedType,
  onTypeChange,
}: TradingTypeSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Card className="glass">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Label className="font-semibold">Trading Type:</Label>
          <div className="relative dropdown-container" ref={dropdownRef}>
            {/* Custom Trading Type Dropdown */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <div className="flex items-center space-x-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    selectedType === "spot"
                      ? "bg-green-500"
                      : selectedType === "futures"
                      ? "bg-blue-500"
                      : selectedType === "options"
                      ? "bg-purple-500"
                      : "bg-orange-500"
                  }`}
                ></span>
                <span>
                  {selectedType === "spot"
                    ? "Spot Trading"
                    : selectedType === "futures"
                    ? "Futures Trading"
                    : selectedType === "options"
                    ? "Options Trading"
                    : "P2P Trading"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>

            {/* Custom Dropdown Menu */}
            {isDropdownOpen && (
              <div className="dropdown-menu absolute top-full left-0 mt-1 w-[180px] z-[9999] bg-slate-900 border border-slate-700 rounded-md shadow-xl overflow-hidden">
                <div
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-800 flex items-center space-x-2"
                  onClick={() => {
                    onTypeChange("spot");
                    setIsDropdownOpen(false);
                  }}
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Spot Trading</span>
                </div>
                <div
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-800 flex items-center space-x-2"
                  onClick={() => {
                    onTypeChange("futures");
                    setIsDropdownOpen(false);
                  }}
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Futures Trading</span>
                </div>
                <div
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-800 flex items-center space-x-2"
                  onClick={() => {
                    onTypeChange("options");
                    setIsDropdownOpen(false);
                  }}
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Options Trading</span>
                </div>
              </div>
            )}
          </div>
          {/* Hyperliquid badge for Spot and Futures */}
          {(selectedType === "spot" || selectedType === "futures") && (
            <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Powered by Hyperliquid
            </Badge>
          )}
          <Badge variant="outline" className="ml-auto">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Live Market
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
