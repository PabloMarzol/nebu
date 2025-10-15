// Mock market data service
export interface MarketData {
  symbol: string;
  name: string;
  price: string;
  change24h: string;
  volume24h: string;
  icon: string;
}

export const mockMarketData: MarketData[] = [
  {
    symbol: "BTC/USDT",
    name: "Bitcoin",
    price: "67834.50",
    change24h: "2.45",
    volume24h: "1234567890",
    icon: "bitcoin"
  },
  {
    symbol: "ETH/USDT",
    name: "Ethereum",
    price: "3456.78",
    change24h: "-1.23",
    volume24h: "890123456",
    icon: "ethereum"
  },
  {
    symbol: "SOL/USDT",
    name: "Solana",
    price: "198.42",
    change24h: "5.67",
    volume24h: "234567890",
    icon: "solana"
  },
  {
    symbol: "ADA/USDT",
    name: "Cardano",
    price: "0.4523",
    change24h: "3.21",
    volume24h: "156789012",
    icon: "cardano"
  },
  {
    symbol: "BNB/USDT",
    name: "BNB",
    price: "312.89",
    change24h: "1.87",
    volume24h: "445782341",
    icon: "bnb"
  },
  {
    symbol: "XRP/USDT",
    name: "XRP",
    price: "0.6234",
    change24h: "-0.89",
    volume24h: "267891234",
    icon: "xrp"
  },
  {
    symbol: "DOGE/USDT",
    name: "Dogecoin",
    price: "0.0823",
    change24h: "4.56",
    volume24h: "189234567",
    icon: "doge"
  },
  {
    symbol: "MATIC/USDT",
    name: "Polygon",
    price: "0.7845",
    change24h: "2.34",
    volume24h: "123456789",
    icon: "matic"
  },
  {
    symbol: "AVAX/USDT",
    name: "Avalanche",
    price: "36.78",
    change24h: "-1.45",
    volume24h: "98765432",
    icon: "avax"
  },
  {
    symbol: "DOT/USDT",
    name: "Polkadot",
    price: "7.23",
    change24h: "3.67",
    volume24h: "87654321",
    icon: "dot"
  },
  {
    symbol: "LINK/USDT",
    name: "Chainlink",
    price: "14.56",
    change24h: "1.23",
    volume24h: "76543210",
    icon: "link"
  },
  {
    symbol: "UNI/USDT",
    name: "Uniswap",
    price: "8.91",
    change24h: "-2.11",
    volume24h: "65432109",
    icon: "uni"
  },
  {
    symbol: "LTC/USDT",
    name: "Litecoin",
    price: "74.32",
    change24h: "0.78",
    volume24h: "54321098",
    icon: "ltc"
  },
  {
    symbol: "ATOM/USDT",
    name: "Cosmos",
    price: "9.87",
    change24h: "4.12",
    volume24h: "43210987",
    icon: "atom"
  },
  {
    symbol: "ICP/USDT",
    name: "Internet Computer",
    price: "12.45",
    change24h: "-3.21",
    volume24h: "32109876",
    icon: "icp"
  },
  {
    symbol: "NEAR/USDT",
    name: "NEAR Protocol",
    price: "3.67",
    change24h: "2.89",
    volume24h: "21098765",
    icon: "near"
  },
  {
    symbol: "FTM/USDT",
    name: "Fantom",
    price: "0.4821",
    change24h: "5.43",
    volume24h: "19876543",
    icon: "ftm"
  },
  {
    symbol: "ALGO/USDT",
    name: "Algorand",
    price: "0.1789",
    change24h: "1.67",
    volume24h: "18765432",
    icon: "algo"
  },
  {
    symbol: "VET/USDT",
    name: "VeChain",
    price: "0.0234",
    change24h: "-1.89",
    volume24h: "17654321",
    icon: "vet"
  },
  {
    symbol: "HBAR/USDT",
    name: "Hedera",
    price: "0.0756",
    change24h: "3.45",
    volume24h: "16543210",
    icon: "hbar"
  },
  {
    symbol: "SAND/USDT",
    name: "The Sandbox",
    price: "0.4567",
    change24h: "6.78",
    volume24h: "15432109",
    icon: "sand"
  },
  {
    symbol: "MANA/USDT",
    name: "Decentraland",
    price: "0.3789",
    change24h: "-2.34",
    volume24h: "14321098",
    icon: "mana"
  },
  {
    symbol: "APE/USDT",
    name: "ApeCoin",
    price: "1.23",
    change24h: "4.56",
    volume24h: "13210987",
    icon: "ape"
  },
  {
    symbol: "AXS/USDT",
    name: "Axie Infinity",
    price: "6.78",
    change24h: "-1.23",
    volume24h: "12109876",
    icon: "axs"
  },
  {
    symbol: "GALA/USDT",
    name: "Gala",
    price: "0.0345",
    change24h: "2.11",
    volume24h: "11098765",
    icon: "gala"
  },
  {
    symbol: "ENJ/USDT",
    name: "Enjin Coin",
    price: "0.2456",
    change24h: "1.89",
    volume24h: "10987654",
    icon: "enj"
  }
];

// Simulate real-time price updates
export function simulatePriceUpdate(data: MarketData[]): MarketData[] {
  return data.map(market => ({
    ...market,
    price: (parseFloat(market.price) * (1 + (Math.random() - 0.5) * 0.02)).toFixed(market.symbol.includes("ADA") ? 4 : 2),
    change24h: (parseFloat(market.change24h) + (Math.random() - 0.5) * 0.5).toFixed(2)
  }));
}
