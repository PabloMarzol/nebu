import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RewardsSystem from "@/components/launchpad/rewards-system";
import ParticipationRewards from "@/components/launchpad/participation-rewards";

export default function Rewards() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock active launches for participation rewards
  const activeLaunches = [
    { id: "solar-1", name: "SolarCoin", symbol: "SLR" },
    { id: "gamefi-1", name: "GameFi Protocol", symbol: "GFP" },
    { id: "health-1", name: "HealthChain", symbol: "HLTH" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-28">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
          <TabsTrigger value="overview">Rewards System</TabsTrigger>
          <TabsTrigger value="active">Active Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <RewardsSystem />
        </TabsContent>

        <TabsContent value="active" className="mt-6 space-y-8">
          {activeLaunches.map((launch) => (
            <div key={launch.id}>
              <h3 className="text-xl font-semibold mb-4 text-center">
                {launch.name} ({launch.symbol})
              </h3>
              <ParticipationRewards 
                launchId={launch.id}
                projectName={launch.name}
                userLevel={5}
              />
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}