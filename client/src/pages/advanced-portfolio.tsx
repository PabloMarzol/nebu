import { useWalletAuth } from "@/hooks/useWalletAuth";
import PortfolioAnalytics from "@/components/advanced/portfolio-analytics";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdvancedPortfolio() {
  const { isAuthenticated, isLoading } = useWalletAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        // User will be prompted to connect wallet via the UI
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <PortfolioAnalytics />
    </div>
  );
}