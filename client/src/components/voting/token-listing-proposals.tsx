import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Vote, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  Flame,
  Shield,
  Star,
  ExternalLink,
  MessageCircle
} from "lucide-react";

interface TokenProposal {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  description: string;
  website: string;
  whitepaper: string;
  contractAddress: string;
  blockchain: string;
  category: string;
  submittedBy: string;
  submissionDate: string;
  votingEndDate: string;
  status: "active" | "passed" | "rejected" | "pending";
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  requiredVotes: number;
  marketCap: string;
  volume24h: string;
  holders: number;
  auditStatus: "verified" | "pending" | "failed";
  socialLinks: {
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
  comments: Array<{
    id: string;
    user: string;
    message: string;
    timestamp: string;
    votes: number;
  }>;
}

export default function TokenListingProposals() {
  const [selectedTab, setSelectedTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("votes");
  const [userVotes, setUserVotes] = useState<Record<string, "for" | "against">>({});
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);

  const proposals: TokenProposal[] = [
    {
      id: "1",
      name: "SolarCoin",
      symbol: "SLR",
      logo: "☀️",
      description: "A revolutionary green energy cryptocurrency that rewards solar energy generation and promotes sustainable energy adoption worldwide.",
      website: "https://solarcoin.org",
      whitepaper: "https://solarcoin.org/whitepaper.pdf",
      contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
      blockchain: "Ethereum",
      category: "Green Energy",
      submittedBy: "EcoTrader2024",
      submissionDate: "2024-12-01T10:00:00Z",
      votingEndDate: "2024-12-22T23:59:59Z",
      status: "active",
      votesFor: 8420,
      votesAgainst: 1230,
      totalVotes: 9650,
      requiredVotes: 10000,
      marketCap: "$45.2M",
      volume24h: "$2.1M",
      holders: 15420,
      auditStatus: "verified",
      socialLinks: {
        twitter: "https://twitter.com/solarcoin",
        telegram: "https://t.me/solarcoin",
      },
      comments: [
        {
          id: "1",
          user: "CryptoCaptain",
          message: "Great project with real-world utility. The solar energy verification system is innovative.",
          timestamp: "2024-12-10T14:30:00Z",
          votes: 45
        },
        {
          id: "2",
          user: "GreenInvestor",
          message: "Perfect timing with the global push for renewable energy. Strong fundamentals.",
          timestamp: "2024-12-09T09:15:00Z",
          votes: 32
        }
      ]
    },
    {
      id: "2",
      name: "GameFi Protocol",
      symbol: "GFP",
      logo: "🎮",
      description: "Next-generation gaming protocol connecting traditional games with blockchain technology through seamless NFT integration and play-to-earn mechanics.",
      website: "https://gamefiprotocol.io",
      whitepaper: "https://gamefiprotocol.io/docs",
      contractAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      blockchain: "Polygon",
      category: "Gaming",
      submittedBy: "GameDev_Pro",
      submissionDate: "2024-11-28T15:30:00Z",
      votingEndDate: "2024-12-20T23:59:59Z",
      status: "active",
      votesFor: 6789,
      votesAgainst: 2341,
      totalVotes: 9130,
      requiredVotes: 10000,
      marketCap: "$28.7M",
      volume24h: "$1.8M",
      holders: 12890,
      auditStatus: "pending",
      socialLinks: {
        twitter: "https://twitter.com/gamefiprotocol",
        discord: "https://discord.gg/gamefi",
      },
      comments: [
        {
          id: "3",
          user: "GamersUnite",
          message: "Love the concept but waiting for the audit results before voting.",
          timestamp: "2024-12-08T16:20:00Z",
          votes: 28
        }
      ]
    },
    {
      id: "3",
      name: "HealthChain",
      symbol: "HLTH",
      logo: "🏥",
      description: "Decentralized healthcare data management system enabling secure patient data sharing while maintaining privacy through advanced cryptographic protocols.",
      website: "https://healthchain.medical",
      whitepaper: "https://healthchain.medical/research.pdf",
      contractAddress: "0x9876543210fedcba9876543210fedcba98765432",
      blockchain: "Ethereum",
      category: "Healthcare",
      submittedBy: "MedTech_Innovator",
      submissionDate: "2024-11-20T12:00:00Z",
      votingEndDate: "2024-12-15T23:59:59Z",
      status: "passed",
      votesFor: 12450,
      votesAgainst: 890,
      totalVotes: 13340,
      requiredVotes: 10000,
      marketCap: "$67.3M",
      volume24h: "$3.2M",
      holders: 23456,
      auditStatus: "verified",
      socialLinks: {
        twitter: "https://twitter.com/healthchain",
        telegram: "https://t.me/healthchain",
      },
      comments: []
    }
  ];

  const handleVote = (proposalId: string, voteType: "for" | "against") => {
    setUserVotes(prev => ({
      ...prev,
      [proposalId]: voteType
    }));
  };

  const getVotePercentage = (proposal: TokenProposal) => {
    if (proposal.totalVotes === 0) return 50;
    return (proposal.votesFor / proposal.totalVotes) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-600";
      case "passed": return "bg-green-600";
      case "rejected": return "bg-red-600";
      case "pending": return "bg-yellow-600";
      default: return "bg-gray-600";
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;
    
    if (diff <= 0) return "Voting ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesTab = selectedTab === "all" || proposal.status === selectedTab;
    const matchesSearch = proposal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const sortedProposals = [...filteredProposals].sort((a, b) => {
    switch (sortBy) {
      case "votes":
        return b.totalVotes - a.totalVotes;
      case "percentage":
        return getVotePercentage(b) - getVotePercentage(a);
      case "date":
        return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Community Voting
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Help decide which tokens get listed on NebulaX. Vote on community proposals and shape the future of our exchange.
        </p>
      </div>

      {/* Voting Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {proposals.filter(p => p.status === "active").length}
            </div>
            <div className="text-sm text-muted-foreground">Active Votes</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {proposals.filter(p => p.status === "passed").length}
            </div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {proposals.reduce((acc, p) => acc + p.totalVotes, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Votes Cast</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {proposals.reduce((acc, p) => acc + p.holders, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Community Members</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-md border border-border bg-background text-foreground"
        >
          <option value="votes">Sort by Votes</option>
          <option value="percentage">Sort by Approval %</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="active" className="text-blue-400">Active</TabsTrigger>
          <TabsTrigger value="passed" className="text-green-400">Passed</TabsTrigger>
          <TabsTrigger value="rejected" className="text-red-400">Rejected</TabsTrigger>
          <TabsTrigger value="pending" className="text-yellow-400">Pending</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="space-y-6">
            {sortedProposals.map((proposal) => (
              <Card key={proposal.id} className="glass hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{proposal.logo}</div>
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{proposal.name}</span>
                          <Badge variant="outline" className="text-xs">{proposal.symbol}</Badge>
                          {proposal.auditStatus === "verified" && (
                            <Badge className="bg-green-600 text-white text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              VERIFIED
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">{proposal.category}</Badge>
                          <Badge className={`text-xs ${getStatusColor(proposal.status)} text-white`}>
                            {proposal.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">{proposal.blockchain}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    {proposal.status === "active" && (
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {getTimeRemaining(proposal.votingEndDate)}
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <Button
                            size="sm"
                            onClick={() => handleVote(proposal.id, "for")}
                            variant={userVotes[proposal.id] === "for" ? "default" : "outline"}
                            className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
                          >
                            <TrendingUp className="w-4 h-4 mr-1" />
                            For
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleVote(proposal.id, "against")}
                            variant={userVotes[proposal.id] === "against" ? "destructive" : "outline"}
                            className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                          >
                            <TrendingDown className="w-4 h-4 mr-1" />
                            Against
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {proposal.description}
                  </p>

                  {/* Voting Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Voting Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {proposal.totalVotes.toLocaleString()} / {proposal.requiredVotes.toLocaleString()} votes
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-400 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          For: {proposal.votesFor.toLocaleString()}
                        </span>
                        <span className="text-red-400 flex items-center">
                          <TrendingDown className="w-4 h-4 mr-1" />
                          Against: {proposal.votesAgainst.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="relative">
                        <Progress value={getVotePercentage(proposal)} className="h-3" />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                          {getVotePercentage(proposal).toFixed(1)}% approval
                        </div>
                      </div>
                      
                      <Progress 
                        value={(proposal.totalVotes / proposal.requiredVotes) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>

                  {/* Project Metrics */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-2 bg-muted/20 rounded">
                      <div className="font-semibold">{proposal.marketCap}</div>
                      <div className="text-muted-foreground">Market Cap</div>
                    </div>
                    <div className="text-center p-2 bg-muted/20 rounded">
                      <div className="font-semibold">{proposal.volume24h}</div>
                      <div className="text-muted-foreground">24h Volume</div>
                    </div>
                    <div className="text-center p-2 bg-muted/20 rounded">
                      <div className="font-semibold">{proposal.holders.toLocaleString()}</div>
                      <div className="text-muted-foreground">Holders</div>
                    </div>
                  </div>

                  {/* Links and Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(proposal.website, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Website
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(proposal.whitepaper, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Whitepaper
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedProposal(proposal.id)}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Comments ({proposal.comments.length})
                    </Button>
                    {proposal.socialLinks.twitter && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(proposal.socialLinks.twitter, '_blank')}
                      >
                        Twitter
                      </Button>
                    )}
                  </div>

                  {/* Top Comments */}
                  {proposal.comments.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Recent Comments</h4>
                      {proposal.comments.slice(0, 2).map((comment) => (
                        <div key={comment.id} className="p-3 bg-muted/20 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-sm">{comment.user}</span>
                            <div className="flex items-center space-x-1">
                              <Button size="sm" variant="ghost" className="h-6 px-2">
                                <Vote className="w-3 h-3 mr-1" />
                                {comment.votes}
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{comment.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}