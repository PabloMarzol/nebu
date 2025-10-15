import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Palette, Trophy, Share2, Gamepad2 } from 'lucide-react';

import CryptoMoodRing from '@/components/features/crypto-mood-ring';
import MascotMiniGame from '@/components/features/mascot-mini-game';
import ThemeSwitcher from '@/components/features/theme-switcher';
import LearningAchievements from '@/components/features/learning-achievements';
import PortfolioMilestonesSharing from '@/components/features/portfolio-milestones-sharing';

export default function EnhancedFeatures() {
  const [showMascotGame, setShowMascotGame] = useState(false);

  return (
    <div className="min-h-screen page-content bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Enhanced Features
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover our latest interactive features designed to enhance your trading experience
          </p>
        </div>

        {/* Theme Switcher - Global Component */}
        <ThemeSwitcher />

        {/* Features Tabs */}
        <Tabs defaultValue="mood-ring" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="mood-ring" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Mood Ring
            </TabsTrigger>
            <TabsTrigger value="mascot-game" className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Mascot Game
            </TabsTrigger>
            <TabsTrigger value="theme-switcher" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="sharing" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Sharing
            </TabsTrigger>
          </TabsList>

          {/* Crypto Mood Ring */}
          <TabsContent value="mood-ring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Crypto Mood Ring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Watch as your platform background dynamically shifts colors based on real-time market volatility and trends.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <CryptoMoodRing />
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">How It Works</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div>🟢 Green: Bullish market trends</div>
                        <div>🔴 Red/Orange: High volatility periods</div>
                        <div>🔵 Blue: Bearish market conditions</div>
                        <div>🟣 Purple: Calm, stable markets</div>
                        <div>🌊 Default: Neutral market state</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mascot Mini Game */}
          <TabsContent value="mascot-game" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  Playful Crypto Mascot Mini-Game
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Meet Nebby, your crypto guide! Play fun mini-games during loading screens and learn crypto concepts.
                </p>
                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <button
                    onClick={() => setShowMascotGame(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
                  >
                    Play with Nebby
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Switcher */}
          <TabsContent value="theme-switcher" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Instant Theme Switcher
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Switch between personalized crypto-inspired color palettes instantly. Each theme is based on major cryptocurrencies.
                </p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white border-0">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">₿</div>
                      <div className="font-semibold">Bitcoin Gold</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">Ξ</div>
                      <div className="font-semibold">Ethereum Blue</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">◎</div>
                      <div className="font-semibold">Solana Purple</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Achievements */}
          <TabsContent value="achievements" className="space-y-6">
            <LearningAchievements />
          </TabsContent>

          {/* Portfolio Milestones Sharing */}
          <TabsContent value="sharing" className="space-y-6">
            <PortfolioMilestonesSharing />
          </TabsContent>
        </Tabs>

        {/* Mascot Mini Game Modal */}
        <MascotMiniGame 
          isVisible={showMascotGame} 
          onComplete={(score) => {
            console.log(`Game completed with score: ${score}`);
            setShowMascotGame(false);
          }} 
        />
      </div>
    </div>
  );
}