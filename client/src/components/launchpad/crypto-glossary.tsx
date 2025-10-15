import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  BookOpen, 
  Hash, 
  TrendingUp, 
  Shield, 
  Zap,
  Globe,
  Coins,
  Users,
  Lock,
  Target,
  Star
} from "lucide-react";

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: "Basic" | "Trading" | "DeFi" | "Security" | "Technical" | "Advanced";
  examples?: string[];
  relatedTerms?: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export default function CryptoGlossary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

  const glossaryTerms: GlossaryTerm[] = [
    {
      id: "blockchain",
      term: "Blockchain",
      definition: "A distributed ledger technology that maintains a continuously growing list of records (blocks) linked and secured using cryptography. Each block contains a cryptographic hash of the previous block, timestamp, and transaction data.",
      category: "Basic",
      difficulty: "Beginner",
      examples: ["Bitcoin blockchain", "Ethereum network", "Polygon chain"],
      relatedTerms: ["Block", "Hash", "Node", "Consensus"]
    },
    {
      id: "cryptocurrency",
      term: "Cryptocurrency",
      definition: "A digital or virtual currency secured by cryptography, making it nearly impossible to counterfeit. Cryptocurrencies are typically decentralized and based on blockchain technology.",
      category: "Basic",
      difficulty: "Beginner",
      examples: ["Bitcoin (BTC)", "Ethereum (ETH)", "NebulaX (NEBX)"],
      relatedTerms: ["Token", "Coin", "Digital Currency", "Altcoin"]
    },
    {
      id: "defi",
      term: "DeFi (Decentralized Finance)",
      definition: "A blockchain-based form of finance that does not rely on central financial intermediaries. DeFi platforms allow people to lend, borrow, and trade using smart contracts.",
      category: "DeFi",
      difficulty: "Intermediate",
      examples: ["Uniswap", "Compound", "Aave", "PancakeSwap"],
      relatedTerms: ["Smart Contract", "Liquidity Pool", "Yield Farming", "DEX"]
    },
    {
      id: "smart-contract",
      term: "Smart Contract",
      definition: "Self-executing contracts with terms directly written into code. They automatically execute when predetermined conditions are met, without need for intermediaries.",
      category: "Technical",
      difficulty: "Intermediate",
      examples: ["ERC-20 tokens", "Automated trading", "Insurance payouts"],
      relatedTerms: ["DeFi", "dApp", "Ethereum", "Solidity"]
    },
    {
      id: "private-key",
      term: "Private Key",
      definition: "A secret alphanumeric code that allows you to access and control your cryptocurrency. It's essentially your digital signature and must be kept secure.",
      category: "Security",
      difficulty: "Beginner",
      examples: ["Wallet access", "Transaction signing", "Fund recovery"],
      relatedTerms: ["Public Key", "Seed Phrase", "Wallet", "Security"]
    },
    {
      id: "liquidity-pool",
      term: "Liquidity Pool",
      definition: "A crowdsourced pool of cryptocurrencies locked in smart contracts that provide liquidity for trading, lending, and other DeFi functions.",
      category: "DeFi",
      difficulty: "Intermediate",
      examples: ["ETH/USDC pool", "Trading pairs", "AMM protocols"],
      relatedTerms: ["AMM", "Yield Farming", "Impermanent Loss", "LP Tokens"]
    },
    {
      id: "yield-farming",
      term: "Yield Farming",
      definition: "The practice of staking or lending crypto assets to generate high returns or rewards in the form of additional cryptocurrency.",
      category: "DeFi",
      difficulty: "Advanced",
      examples: ["Liquidity mining", "Staking rewards", "Protocol incentives"],
      relatedTerms: ["Staking", "Liquidity Pool", "APY", "Governance Token"]
    },
    {
      id: "market-cap",
      term: "Market Capitalization",
      definition: "The total value of a cryptocurrency, calculated by multiplying the current price by the total circulating supply.",
      category: "Trading",
      difficulty: "Beginner",
      examples: ["Bitcoin market cap", "Total crypto market", "Project valuation"],
      relatedTerms: ["Circulating Supply", "Volume", "Price", "Valuation"]
    },
    {
      id: "gas-fee",
      term: "Gas Fee",
      definition: "The fee required to conduct a transaction or execute a smart contract on blockchain networks like Ethereum. Gas compensates miners/validators for computational energy.",
      category: "Technical",
      difficulty: "Intermediate",
      examples: ["Ethereum transactions", "Contract deployment", "Network congestion"],
      relatedTerms: ["Transaction Fee", "Miner", "Network", "Gwei"]
    },
    {
      id: "nft",
      term: "NFT (Non-Fungible Token)",
      definition: "A unique digital asset stored on a blockchain that represents ownership of a specific item, artwork, or content piece. Each NFT is distinct and cannot be exchanged on equal terms.",
      category: "Basic",
      difficulty: "Beginner",
      examples: ["Digital art", "Collectibles", "Gaming items", "Domain names"],
      relatedTerms: ["Token Standard", "Marketplace", "Minting", "Metadata"]
    },
    {
      id: "hodl",
      term: "HODL",
      definition: "A cryptocurrency investment strategy that involves buying and holding assets for long periods, regardless of market volatility. Originally a misspelling of 'hold'.",
      category: "Trading",
      difficulty: "Beginner",
      examples: ["Long-term investment", "Bitcoin maximalists", "Buy and hold"],
      relatedTerms: ["Investment Strategy", "Long-term", "Diamond Hands", "Bull Market"]
    },
    {
      id: "dao",
      term: "DAO (Decentralized Autonomous Organization)",
      definition: "An organization governed by smart contracts and run by its community members through voting mechanisms, without traditional management structures.",
      category: "Advanced",
      difficulty: "Advanced",
      examples: ["Protocol governance", "Treasury management", "Community decisions"],
      relatedTerms: ["Governance Token", "Voting", "Decentralization", "Community"]
    }
  ];

  const categories = ["All", "Basic", "Trading", "DeFi", "Security", "Technical", "Advanced"];

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Basic": return Coins;
      case "Trading": return TrendingUp;
      case "DeFi": return Zap;
      case "Security": return Shield;
      case "Technical": return Hash;
      case "Advanced": return Target;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Basic": return "text-blue-400 border-blue-400 bg-blue-400/10";
      case "Trading": return "text-green-400 border-green-400 bg-green-400/10";
      case "DeFi": return "text-yellow-400 border-yellow-400 bg-yellow-400/10";
      case "Security": return "text-red-400 border-red-400 bg-red-400/10";
      case "Technical": return "text-purple-400 border-purple-400 bg-purple-400/10";
      case "Advanced": return "text-orange-400 border-orange-400 bg-orange-400/10";
      default: return "text-gray-400 border-gray-400 bg-gray-400/10";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-600 text-white";
      case "Intermediate": return "bg-yellow-600 text-white";
      case "Advanced": return "bg-red-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  if (selectedTerm) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setSelectedTerm(null)}>
            ← Back to Glossary
          </Button>
        </div>

        <Card className="glass border-blue-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <BookOpen className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-3xl">{selectedTerm.term}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getCategoryColor(selectedTerm.category)}>
                      {selectedTerm.category}
                    </Badge>
                    <Badge className={getDifficultyColor(selectedTerm.difficulty)}>
                      {selectedTerm.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-blue-400 mb-3">Definition</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {selectedTerm.definition}
              </p>
            </div>

            {selectedTerm.examples && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>Examples</span>
                </h4>
                <ul className="space-y-2">
                  {selectedTerm.examples.map((example, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedTerm.relatedTerms && (
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <h4 className="font-semibold mb-3">Related Terms</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTerm.relatedTerms.map((relatedTerm, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const term = glossaryTerms.find(t => t.term === relatedTerm);
                        if (term) setSelectedTerm(term);
                      }}
                      className="text-xs"
                    >
                      {relatedTerm}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Crypto Glossary
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Your comprehensive guide to cryptocurrency and blockchain terminology
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="glass border-blue-500/20 mb-8">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search terms, definitions, or concepts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = getCategoryIcon(category);
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="flex items-center space-x-1"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category}</span>
                  </Button>
                );
              })}
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {filteredTerms.length} terms found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Glossary Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTerms.map((term) => {
          const Icon = getCategoryIcon(term.category);
          return (
            <Card
              key={term.id}
              className="glass hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedTerm(term)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(term.category)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{term.term}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getDifficultyColor(term.difficulty)} variant="outline">
                          {term.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {term.definition.substring(0, 120)}...
                </p>
                
                <div className="mt-4 pt-4 border-t">
                  <Badge className={getCategoryColor(term.category)} variant="outline">
                    {term.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Reference */}
      <Card className="glass border-green-500/20 mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-6 h-6 text-green-400" />
            <span>Quick Reference Guide</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Essential Basics</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Blockchain</li>
                <li>• Cryptocurrency</li>
                <li>• Wallet</li>
                <li>• Private Key</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-400 mb-2">Trading Terms</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Market Cap</li>
                <li>• HODL</li>
                <li>• Bull/Bear Market</li>
                <li>• Volume</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-400 mb-2">DeFi Concepts</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Smart Contract</li>
                <li>• Liquidity Pool</li>
                <li>• Yield Farming</li>
                <li>• DAO</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}