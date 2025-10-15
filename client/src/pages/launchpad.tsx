import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TokenLaunches from "@/components/launchpad/token-launches";
import ICOParticipation from "@/components/launchpad/ico-participation";
import AnimatedLaunchProgress from "@/components/launchpad/animated-launch-progress";
import LaunchVisualizationDashboard from "@/components/launchpad/launch-visualization-dashboard";

export default function Launchpad() {
  const [selectedTab, setSelectedTab] = useState("launches");
  const [selectedLaunch, setSelectedLaunch] = useState<string | null>(null);

  if (selectedLaunch) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ICOParticipation 
          launchId={selectedLaunch}
          projectName="DeFiChain Protocol"
          tokenSymbol="DCP"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-2 pt-16 page-content">
      <div className="text-center mb-3">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Nebula X Launchpad
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover and participate in the next generation of token launches
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="launches">Token Launches</TabsTrigger>
          <TabsTrigger value="live-progress">Live Progress</TabsTrigger>
          <TabsTrigger value="analytics">Launch Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="launches" className="space-y-6">
          <TokenLaunches onSelectLaunch={setSelectedLaunch} />
        </TabsContent>

        <TabsContent value="live-progress" className="space-y-6">
          <div className="space-y-8">
            <AnimatedLaunchProgress
              projectName="DeFiChain Protocol"
              symbol="DCP"
              targetRaise={2500000}
              currentRaise={1687500}
              participants={1247}
              maxParticipants={2000}
              timeRemaining="2d 14h 23m"
              status="live"
            />
            
            <AnimatedLaunchProgress
              projectName="HealthChain Network"
              symbol="HLTH"
              targetRaise={1800000}
              currentRaise={945000}
              participants={832}
              maxParticipants={1500}
              timeRemaining="5d 8h 45m"
              status="live"
            />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <LaunchVisualizationDashboard
            projectName="DeFiChain Protocol"
            symbol="DCP"
            targetRaise={2500000}
            currentRaise={1687500}
            participants={1247}
            maxParticipants={2000}
            status="live"
            startTime="2024-12-08T00:00:00Z"
            endTime="2024-12-13T00:00:00Z"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}