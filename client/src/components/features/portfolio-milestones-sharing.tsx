import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, Download, Twitter, Facebook, Copy, Sparkles, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

interface MilestoneProps {
  milestone: {
    id: string;
    type: 'profit' | 'loss' | 'volume' | 'streak';
    title: string;
    description: string;
    value: string;
    date: string;
    achievement: string;
  };
}

const SAMPLE_MILESTONES = [
  {
    id: '1',
    type: 'profit' as const,
    title: 'First $1,000 Profit',
    description: 'Reached your first major profit milestone',
    value: '$1,247.83',
    date: '2025-08-08',
    achievement: '🚀 Profit Pioneer'
  },
  {
    id: '2',
    type: 'volume' as const,
    title: '100 Trades Completed',
    description: 'Completed 100 successful trades',
    value: '100 trades',
    date: '2025-08-07',
    achievement: '⚡ Trading Veteran'
  },
  {
    id: '3',
    type: 'streak' as const,
    title: '7-Day Winning Streak',
    description: 'Maintained profits for 7 consecutive days',
    value: '7 days',
    date: '2025-08-06',
    achievement: '🔥 Streak Master'
  }
];

function MilestoneCard({ milestone }: MilestoneProps) {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const getMilestoneColor = (type: string) => {
    switch (type) {
      case 'profit': return 'from-green-500 to-emerald-600';
      case 'volume': return 'from-blue-500 to-cyan-600';
      case 'streak': return 'from-purple-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const generateShareableImage = async () => {
    const element = document.getElementById(`milestone-${milestone.id}`);
    if (!element) return null;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: 'transparent',
        scale: 2,
        width: 400,
        height: 300,
      });
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };

  const handleShare = async (platform: 'twitter' | 'facebook' | 'copy' | 'download') => {
    setIsSharing(true);
    
    const shareText = `🎉 Achieved: ${milestone.title}\n${milestone.value} on NebulaX Exchange!\n${milestone.achievement}`;
    
    try {
      switch (platform) {
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&hashtags=crypto,trading,NebulaX`,
            '_blank'
          );
          break;
          
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareText)}`,
            '_blank'
          );
          break;
          
        case 'copy':
          await navigator.clipboard.writeText(shareText);
          toast({
            title: "Copied to clipboard!",
            description: "Share text copied successfully",
          });
          break;
          
        case 'download':
          const imageData = await generateShareableImage();
          if (imageData) {
            const link = document.createElement('a');
            link.download = `nebulax-milestone-${milestone.id}.png`;
            link.href = imageData;
            link.click();
            toast({
              title: "Image downloaded!",
              description: "Milestone card saved to your device",
            });
          }
          break;
      }
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Something went wrong while sharing",
        variant: "destructive",
      });
    }
    
    setIsSharing(false);
  };

  return (
    <Card 
      id={`milestone-${milestone.id}`}
      className={`bg-gradient-to-br ${getMilestoneColor(milestone.type)} text-white border-0 relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 text-6xl opacity-50">
          {milestone.type === 'profit' ? '📈' : milestone.type === 'volume' ? '⚡' : '🔥'}
        </div>
      </div>
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-white text-lg">{milestone.title}</CardTitle>
            <div className="text-white/80 text-sm">{milestone.description}</div>
          </div>
          <Badge className="bg-white/20 text-white border-0">
            <Trophy className="w-3 h-3 mr-1" />
            Milestone
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        <div>
          <div className="text-3xl font-bold text-white">{milestone.value}</div>
          <div className="text-white/70 text-sm">Achieved on {milestone.date}</div>
        </div>
        
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span className="text-white/90 font-medium">{milestone.achievement}</span>
        </div>
        
        {/* Share Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => handleShare('twitter')}
            size="sm"
            variant="secondary"
            className="bg-white/20 text-white border-0 hover:bg-white/30"
            disabled={isSharing}
          >
            <Twitter className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={() => handleShare('facebook')}
            size="sm"
            variant="secondary"
            className="bg-white/20 text-white border-0 hover:bg-white/30"
            disabled={isSharing}
          >
            <Facebook className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={() => handleShare('copy')}
            size="sm"
            variant="secondary"
            className="bg-white/20 text-white border-0 hover:bg-white/30"
            disabled={isSharing}
          >
            <Copy className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={() => handleShare('download')}
            size="sm"
            variant="secondary"
            className="bg-white/20 text-white border-0 hover:bg-white/30"
            disabled={isSharing}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PortfolioMilestonesSharing() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Portfolio Milestones</h2>
        <p className="text-muted-foreground">
          Celebrate and share your trading achievements
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SAMPLE_MILESTONES.map((milestone) => (
          <MilestoneCard key={milestone.id} milestone={milestone} />
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Social Sharing Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Twitter className="w-4 h-4 text-blue-400" />
            Share achievements on Twitter with crypto hashtags
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Facebook className="w-4 h-4 text-blue-600" />
            Post milestones to Facebook with custom messages
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Download className="w-4 h-4 text-green-500" />
            Download high-quality milestone cards as images
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Copy className="w-4 h-4 text-purple-500" />
            Copy formatted text for any platform
          </div>
        </CardContent>
      </Card>
    </div>
  );
}