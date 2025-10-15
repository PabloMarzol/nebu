import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  BarChart3
} from "lucide-react";

interface OnboardingMetrics {
  completionRate: number;
  averageTime: string;
  stageDropoffs: {
    stage1: number;
    stage2: number;
    stage3: number;
  };
  dailySignups: number;
  conversionFunnel: {
    visitors: number;
    started: number;
    stage1Complete: number;
    stage2Complete: number;
    stage3Complete: number;
  };
}

export default function OnboardingAnalytics() {
  const [metrics, setMetrics] = useState<OnboardingMetrics>({
    completionRate: 78.5,
    averageTime: "2m 15s",
    stageDropoffs: {
      stage1: 5.2,
      stage2: 12.8,
      stage3: 3.5
    },
    dailySignups: 247,
    conversionFunnel: {
      visitors: 1250,
      started: 890,
      stage1Complete: 845,
      stage2Complete: 736,
      stage3Complete: 699
    }
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        dailySignups: prev.dailySignups + Math.floor(Math.random() * 3),
        completionRate: Math.min(100, prev.completionRate + (Math.random() - 0.5) * 0.1)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const stages = [
    { name: "Quick Start", completion: 95, color: "text-green-400" },
    { name: "Enhanced Access", completion: 83, color: "text-purple-400" },
    { name: "Full Platform", completion: 78, color: "text-cyan-400" }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Onboarding Analytics
        </h2>
        <p className="text-muted-foreground">Real-time insights into user acquisition flow</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-green-400">{metrics.completionRate.toFixed(1)}%</div>
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2.3% this week
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-purple-400">{metrics.averageTime}</div>
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm text-muted-foreground">Avg. Completion Time</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                15s faster
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-cyan-400">{metrics.dailySignups}</div>
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-sm text-muted-foreground">Daily Signups</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                +18% today
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-pink-400">
                {((metrics.conversionFunnel.stage3Complete / metrics.conversionFunnel.visitors) * 100).toFixed(1)}%
              </div>
              <BarChart3 className="w-6 h-6 text-pink-400" />
            </div>
            <p className="text-sm text-muted-foreground">Visitor Conversion</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                Industry leading
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stage Performance */}
      <Card className="glass-enhanced">
        <CardHeader>
          <CardTitle>Stage Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {stages.map((stage, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{stage.name}</span>
                <span className={`font-bold ${stage.color}`}>{stage.completion}%</span>
              </div>
              <Progress value={stage.completion} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Drop-off rate: {Object.values(metrics.stageDropoffs)[index]}%</span>
                <span>Avg. time: {index === 0 ? '30s' : index === 1 ? '2m' : '24h'}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card className="glass-enhanced">
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(metrics.conversionFunnel).map(([stage, count], index) => {
              const percentage = index === 0 ? 100 : (count / metrics.conversionFunnel.visitors) * 100;
              const stageNames = ['Visitors', 'Started Onboarding', 'Stage 1 Complete', 'Stage 2 Complete', 'Stage 3 Complete'];
              
              return (
                <div key={stage} className="flex items-center space-x-4">
                  <div className="w-32 text-sm font-medium">{stageNames[index]}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Progress value={percentage} className="flex-1 h-3" />
                      <span className="text-sm font-bold min-w-[60px]">{count.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground min-w-[50px]">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Insights */}
      <Card className="glass-enhanced border-yellow-400/20">
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-400">
            <AlertCircle className="w-5 h-5 mr-2" />
            Optimization Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-yellow-400/10 rounded-lg">
            <p className="text-sm">
              <strong>Stage 2 Opportunity:</strong> 12.8% drop-off rate suggests phone verification could be simplified
            </p>
          </div>
          <div className="p-3 bg-green-400/10 rounded-lg">
            <p className="text-sm">
              <strong>Strong Performance:</strong> 30-second onboarding time beats industry average by 75%
            </p>
          </div>
          <div className="p-3 bg-purple-400/10 rounded-lg">
            <p className="text-sm">
              <strong>Recommendation:</strong> Consider progressive disclosure for Stage 3 requirements
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}