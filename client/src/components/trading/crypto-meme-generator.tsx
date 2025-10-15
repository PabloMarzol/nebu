import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";
import { Camera, Download, Shuffle, Smile, TrendingUp, TrendingDown } from "lucide-react";

interface MemeTemplate {
  id: string;
  name: string;
  image: string;
  textAreas: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    color: string;
  }>;
}

interface GeneratedMeme {
  id: string;
  template: string;
  texts: string[];
  mood: "bullish" | "bearish" | "neutral";
  timestamp: Date;
}

export default function CryptoMemeGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("stonks");
  const [memeTexts, setMemeTexts] = useState<string[]>(["", ""]);
  const [tradingMood, setTradingMood] = useState<"bullish" | "bearish" | "neutral">("bullish");
  const [generatedMemes, setGeneratedMemes] = useState<GeneratedMeme[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const memeTemplates: MemeTemplate[] = [
    {
      id: "stonks",
      name: "Stonks",
      image: "📈",
      textAreas: [
        { x: 10, y: 10, width: 280, height: 40, fontSize: 24, color: "#ffffff" },
        { x: 10, y: 250, width: 280, height: 40, fontSize: 18, color: "#00ff88" }
      ]
    },
    {
      id: "doge",
      name: "Doge Wow",
      image: "🐕",
      textAreas: [
        { x: 10, y: 10, width: 140, height: 30, fontSize: 16, color: "#ffa726" },
        { x: 160, y: 10, width: 140, height: 30, fontSize: 16, color: "#42a5f5" },
        { x: 10, y: 250, width: 290, height: 40, fontSize: 20, color: "#ffffff" }
      ]
    },
    {
      id: "diamond_hands",
      name: "Diamond Hands",
      image: "💎",
      textAreas: [
        { x: 10, y: 10, width: 280, height: 40, fontSize: 22, color: "#00bcd4" },
        { x: 10, y: 250, width: 280, height: 40, fontSize: 18, color: "#ffffff" }
      ]
    },
    {
      id: "moon",
      name: "To The Moon",
      image: "🚀",
      textAreas: [
        { x: 10, y: 10, width: 280, height: 40, fontSize: 20, color: "#ffeb3b" },
        { x: 10, y: 250, width: 280, height: 40, fontSize: 16, color: "#ffffff" }
      ]
    },
    {
      id: "bear_market",
      name: "Bear Market",
      image: "🐻",
      textAreas: [
        { x: 10, y: 10, width: 280, height: 40, fontSize: 24, color: "#ff4757" },
        { x: 10, y: 250, width: 280, height: 40, fontSize: 18, color: "#ffffff" }
      ]
    }
  ];

  const moodBasedTexts = {
    bullish: [
      ["HODL!", "Diamond hands forever!"],
      ["To the moon!", "Rockets only go up!"],
      ["Buy the dip!", "It's not a loss until you sell"],
      ["Number go up!", "Stonks only go up"],
      ["WAGMI!", "We're all gonna make it"]
    ],
    bearish: [
      ["Rekt", "Should have sold at ATH"],
      ["Bear market", "Winter is here"],
      ["Buy high sell low", "This is the way"],
      ["Crypto winter", "See you in 4 years"],
      ["Paper hands", "Weak hands get rekt"]
    ],
    neutral: [
      ["DCA", "Dollar cost averaging"],
      ["DYOR", "Do your own research"],
      ["Not financial advice", "Just my opinion"],
      ["Zoom out", "Think long term"],
      ["Stay humble", "Stack sats"]
    ]
  };

  const generateRandomMeme = () => {
    const templates = memeTemplates;
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const moodTexts = moodBasedTexts[tradingMood];
    const randomTexts = moodTexts[Math.floor(Math.random() * moodTexts.length)];
    
    setSelectedTemplate(randomTemplate.id);
    setMemeTexts(randomTexts);
  };

  const generateMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const template = memeTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 300;

    // Create background
    const gradient = ctx.createLinearGradient(0, 0, 300, 300);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 300, 300);

    // Add template emoji as background
    ctx.font = '120px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillText(template.image, 150, 180);

    // Add text areas
    template.textAreas.forEach((area, index) => {
      if (memeTexts[index]) {
        ctx.font = `bold ${area.fontSize}px Arial`;
        ctx.fillStyle = area.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        
        const x = area.x + area.width / 2;
        const y = area.y + area.height / 2;
        
        // Add text stroke for better visibility
        ctx.strokeText(memeTexts[index], x, y);
        ctx.fillText(memeTexts[index], x, y);
      }
    });

    // Add mood indicator
    const moodEmoji = tradingMood === "bullish" ? "📈" : tradingMood === "bearish" ? "📉" : "➡️";
    ctx.font = '24px Arial';
    ctx.fillText(moodEmoji, 270, 30);

    // Save to generated memes
    const newMeme: GeneratedMeme = {
      id: Date.now().toString(),
      template: selectedTemplate,
      texts: [...memeTexts],
      mood: tradingMood,
      timestamp: new Date()
    };

    setGeneratedMemes(prev => [newMeme, ...prev.slice(0, 9)]);
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `crypto_meme_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareMeme = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !navigator.share) return;

    canvas.toBlob(async (blob: Blob | null) => {
      if (blob) {
        const file = new File([blob], 'crypto_meme.png', { type: 'image/png' });
        await navigator.share({
          title: 'Crypto Meme from NebulaX',
          text: 'Check out this crypto meme!',
          files: [file]
        });
      }
    });
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Smile className="w-5 h-5 text-yellow-400" />
          <span>Dynamic Crypto Meme Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Trading Mood</label>
          <div className="flex space-x-2">
            <Button
              variant={tradingMood === "bullish" ? "default" : "outline"}
              onClick={() => setTradingMood("bullish")}
              className="glass"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Bullish
            </Button>
            <Button
              variant={tradingMood === "bearish" ? "default" : "outline"}
              onClick={() => setTradingMood("bearish")}
              className="glass"
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Bearish
            </Button>
            <Button
              variant={tradingMood === "neutral" ? "default" : "outline"}
              onClick={() => setTradingMood("neutral")}
              className="glass"
            >
              Neutral
            </Button>
          </div>
        </div>

        {/* Template Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Meme Template</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {memeTemplates.map((template) => (
              <Button
                key={template.id}
                variant={selectedTemplate === template.id ? "default" : "outline"}
                onClick={() => setSelectedTemplate(template.id)}
                className="glass h-16 flex flex-col"
              >
                <div className="text-2xl">{template.image}</div>
                <div className="text-xs">{template.name}</div>
              </Button>
            ))}
          </div>
        </div>

        {/* Text Inputs */}
        <div>
          <label className="text-sm font-medium mb-2 block">Meme Text</label>
          <div className="space-y-2">
            {memeTexts.map((text, index) => (
              <Input
                key={index}
                placeholder={`Text ${index + 1}`}
                value={text}
                onChange={(e) => {
                  const newTexts = [...memeTexts];
                  newTexts[index] = e.target.value;
                  setMemeTexts(newTexts);
                }}
                className="glass border-purple-500/30"
              />
            ))}
          </div>
        </div>

        {/* Generation Controls */}
        <div className="flex space-x-2">
          <Button onClick={generateRandomMeme} variant="outline" className="glass">
            <Shuffle className="w-4 h-4 mr-2" />
            Random Meme
          </Button>
          <Button onClick={generateMeme} className="bg-gradient-to-r from-purple-500 to-pink-500">
            Generate Meme
          </Button>
        </div>

        {/* Meme Preview */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Preview</label>
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="border border-purple-500/30 rounded-lg w-full max-w-[300px] h-auto"
                width="300"
                height="300"
              />
              <div className="mt-2 flex space-x-2">
                <Button onClick={downloadMeme} size="sm" variant="outline" className="glass">
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
                <Button onClick={shareMeme} size="sm" variant="outline" className="glass">
                  <Camera className="w-3 h-3 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Generated Memes History */}
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Recent Memes</label>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {generatedMemes.map((meme) => (
                <Card key={meme.id} className="glass-strong p-2 cursor-pointer hover:border-purple-400/50">
                  <div className="text-center">
                    <div className="text-2xl mb-1">
                      {memeTemplates.find(t => t.id === meme.template)?.image}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {meme.texts[0]}
                    </div>
                    <Badge className={`text-xs mt-1 ${
                      meme.mood === "bullish" ? "bg-green-500" : 
                      meme.mood === "bearish" ? "bg-red-500" : "bg-gray-500"
                    }`}>
                      {meme.mood}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Meme Stats */}
        <Card className="glass-strong">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-purple-400">{generatedMemes.length}</div>
                <div className="text-xs text-muted-foreground">Memes Created</div>
              </div>
              <div>
                <div className="text-lg font-bold text-cyan-400">{memeTemplates.length}</div>
                <div className="text-xs text-muted-foreground">Templates</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">
                  {generatedMemes.filter(m => m.mood === "bullish").length}
                </div>
                <div className="text-xs text-muted-foreground">Bullish Memes</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-400">
                  {generatedMemes.filter(m => m.mood === "bearish").length}
                </div>
                <div className="text-xs text-muted-foreground">Bearish Memes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}