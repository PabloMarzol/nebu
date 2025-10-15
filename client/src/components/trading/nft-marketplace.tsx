import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Search, Filter, Heart, Eye, Zap, TrendingUp } from "lucide-react";

interface NFT {
  id: string;
  name: string;
  collection: string;
  price: number;
  currency: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  likes: number;
  views: number;
  trending: boolean;
}

export default function NFTMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [likedNFTs, setLikedNFTs] = useState<Set<string>>(new Set());

  const nfts: NFT[] = [
    {
      id: "1",
      name: "Cosmic Whale #1247",
      collection: "Cosmic Creatures",
      price: 2.5,
      currency: "ETH",
      image: "🐋",
      rarity: "legendary",
      likes: 342,
      views: 1250,
      trending: true
    },
    {
      id: "2",
      name: "Neon City #892",
      collection: "Cyber Landscapes",
      price: 1.8,
      currency: "ETH",
      image: "🌆",
      rarity: "epic",
      likes: 198,
      views: 890,
      trending: false
    },
    {
      id: "3",
      name: "Galaxy Explorer #445",
      collection: "Space Adventures",
      price: 0.75,
      currency: "ETH",
      image: "🚀",
      rarity: "rare",
      likes: 124,
      views: 567,
      trending: true
    },
    {
      id: "4",
      name: "Crystal Dragon #333",
      collection: "Mythical Beasts",
      price: 3.2,
      currency: "ETH",
      image: "🐲",
      rarity: "legendary",
      likes: 456,
      views: 1890,
      trending: true
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "text-yellow-400 border-yellow-400";
      case "epic": return "text-purple-400 border-purple-400";
      case "rare": return "text-blue-400 border-blue-400";
      default: return "text-gray-400 border-gray-400";
    }
  };

  const toggleLike = (nftId: string) => {
    const newLiked = new Set(likedNFTs);
    if (newLiked.has(nftId)) {
      newLiked.delete(nftId);
    } else {
      newLiked.add(nftId);
    }
    setLikedNFTs(newLiked);
  };

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.collection.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           (selectedCategory === "trending" && nft.trending) ||
                           nft.rarity === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <span>Interactive NFT Marketplace</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search NFTs or collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass border-purple-500/30"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              size="sm"
              className="glass"
            >
              All
            </Button>
            <Button
              variant={selectedCategory === "trending" ? "default" : "outline"}
              onClick={() => setSelectedCategory("trending")}
              size="sm"
              className="glass"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Button>
            <Button
              variant={selectedCategory === "legendary" ? "default" : "outline"}
              onClick={() => setSelectedCategory("legendary")}
              size="sm"
              className="glass"
            >
              Legendary
            </Button>
            <Button
              variant={selectedCategory === "epic" ? "default" : "outline"}
              onClick={() => setSelectedCategory("epic")}
              size="sm"
              className="glass"
            >
              Epic
            </Button>
          </div>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNFTs.map((nft) => (
            <Card key={nft.id} className="glass-strong hover:border-purple-400/50 transition-all group cursor-pointer">
              <CardContent className="p-4">
                {/* NFT Image */}
                <div className="relative mb-4">
                  <div className="aspect-square bg-gradient-to-br from-purple-900 to-slate-900 rounded-lg flex items-center justify-center text-6xl">
                    {nft.image}
                  </div>
                  {nft.trending && (
                    <Badge className="absolute top-2 left-2 bg-orange-500">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 p-1"
                    onClick={() => toggleLike(nft.id)}
                  >
                    <Heart className={`w-4 h-4 ${likedNFTs.has(nft.id) ? 'text-red-400 fill-current' : 'text-white'}`} />
                  </Button>
                </div>

                {/* NFT Info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-sm">{nft.name}</div>
                      <div className="text-xs text-muted-foreground">{nft.collection}</div>
                    </div>
                    <Badge variant="outline" className={getRarityColor(nft.rarity)}>
                      {nft.rarity}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold text-purple-400">
                        {nft.price} {nft.currency}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{nft.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{nft.views}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    size="sm"
                  >
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Discovery Section */}
        <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <h3 className="text-lg font-semibold mb-4">NFT Discovery</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400">{nfts.length}</div>
              <div className="text-sm text-muted-foreground">Total NFTs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{nfts.filter(n => n.trending).length}</div>
              <div className="text-sm text-muted-foreground">Trending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{nfts.filter(n => n.rarity === "legendary").length}</div>
              <div className="text-sm text-muted-foreground">Legendary</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}