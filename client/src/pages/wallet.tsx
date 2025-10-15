import WalletDashboard from "@/components/trading/wallet-dashboard";
import AnimatedWalletVisualizer from "@/components/trading/animated-wallet-visualizer";
import SecurityHealthDashboard from "@/components/trading/security-health-dashboard";
import PortfolioBackupRecovery from "@/components/trading/portfolio-backup-recovery";
import LearningAchievementSystem from "@/components/trading/learning-achievement-system";
import SocialTradingNetwork from "@/components/trading/social-trading-network";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Wallet() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Advanced Crypto Platform
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete crypto ecosystem with advanced visualization, security, backup, learning, and social trading
          </p>
        </div>

        {/* Advanced Features Tabs */}
        <Tabs defaultValue="wallet" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="visualizer">Transaction Flow</TabsTrigger>
            <TabsTrigger value="security">Security Health</TabsTrigger>
            <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
            <TabsTrigger value="learning">Learning Hub</TabsTrigger>
            <TabsTrigger value="social">Social Trading</TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="mt-6">
            <WalletDashboard />
          </TabsContent>

          <TabsContent value="visualizer" className="mt-6">
            <AnimatedWalletVisualizer />
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <SecurityHealthDashboard />
          </TabsContent>

          <TabsContent value="backup" className="mt-6">
            <PortfolioBackupRecovery />
          </TabsContent>

          <TabsContent value="learning" className="mt-6">
            <LearningAchievementSystem />
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <SocialTradingNetwork />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}