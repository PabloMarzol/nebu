import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TokenListingProposals from "@/components/voting/token-listing-proposals";
import ProposalSubmission from "@/components/voting/proposal-submission";
import VotingPowerCalculator from "@/components/voting/voting-power-calculator";

export default function Voting() {
  const [selectedTab, setSelectedTab] = useState("proposals");

  return (
    <div className="container mx-auto px-4 py-8 pt-28">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="proposals">Active Proposals</TabsTrigger>
          <TabsTrigger value="submit">Submit Proposal</TabsTrigger>
          <TabsTrigger value="calculator">Voting Power</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="mt-6">
          <TokenListingProposals />
        </TabsContent>

        <TabsContent value="submit" className="mt-6">
          <ProposalSubmission />
        </TabsContent>

        <TabsContent value="calculator" className="mt-6">
          <VotingPowerCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}