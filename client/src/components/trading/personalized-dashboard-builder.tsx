import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { 
  Grid3X3, 
  Plus, 
  Settings, 
  Eye, 
  EyeOff, 
  Move, 
  Trash2, 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  Activity,
  Clock,
  Target
} from "lucide-react";

interface DashboardWidget {
  id: string;
  type: "portfolio" | "chart" | "news" | "price" | "orders" | "performance";
  title: string;
  position: { x: number; y: number; w: number; h: number };
  visible: boolean;
  settings: Record<string, any>;
}

interface WidgetTemplate {
  type: string;
  title: string;
  description: string;
  icon: any;
  defaultSize: { w: number; h: number };
  settings: Record<string, any>;
}

export default function PersonalizedDashboardBuilder() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    {
      id: "1",
      type: "portfolio",
      title: "Portfolio Overview",
      position: { x: 0, y: 0, w: 2, h: 2 },
      visible: true,
      settings: { showProfitLoss: true, showAllocation: true }
    },
    {
      id: "2",
      type: "chart",
      title: "BTC/USDT Chart",
      position: { x: 2, y: 0, w: 4, h: 3 },
      visible: true,
      settings: { symbol: "BTC/USDT", timeframe: "1h" }
    },
    {
      id: "3",
      type: "price",
      title: "Price Tracker",
      position: { x: 0, y: 2, w: 2, h: 1 },
      visible: true,
      settings: { symbols: ["BTC", "ETH", "SOL"] }
    },
    {
      id: "4",
      type: "news",
      title: "Crypto News",
      position: { x: 6, y: 0, w: 2, h: 3 },
      visible: true,
      settings: { categories: ["bitcoin", "ethereum", "defi"] }
    }
  ]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

  const widgetTemplates: WidgetTemplate[] = [
    {
      type: "portfolio",
      title: "Portfolio Balance",
      description: "Track your total portfolio value and allocation",
      icon: DollarSign,
      defaultSize: { w: 2, h: 2 },
      settings: { showProfitLoss: true, showAllocation: true }
    },
    {
      type: "chart",
      title: "Trading Chart",
      description: "Real-time price charts with technical indicators",
      icon: BarChart3,
      defaultSize: { w: 4, h: 3 },
      settings: { symbol: "BTC/USDT", timeframe: "1h" }
    },
    {
      type: "price",
      title: "Price Ticker",
      description: "Live cryptocurrency prices",
      icon: TrendingUp,
      defaultSize: { w: 2, h: 1 },
      settings: { symbols: ["BTC", "ETH"] }
    },
    {
      type: "orders",
      title: "Open Orders",
      description: "View and manage your active orders",
      icon: Target,
      defaultSize: { w: 3, h: 2 },
      settings: { showAll: true }
    },
    {
      type: "performance",
      title: "Performance Metrics",
      description: "Track your trading performance over time",
      icon: Activity,
      defaultSize: { w: 3, h: 2 },
      settings: { period: "7d" }
    },
    {
      type: "news",
      title: "Crypto News Feed",
      description: "Latest cryptocurrency news and market updates",
      icon: Clock,
      defaultSize: { w: 2, h: 3 },
      settings: { categories: ["general"] }
    }
  ];

  const addWidget = (template: WidgetTemplate) => {
    const newWidget: DashboardWidget = {
      id: Date.now().toString(),
      type: template.type as any,
      title: template.title,
      position: {
        x: 0,
        y: Math.max(...widgets.map(w => w.position.y + w.position.h), 0),
        w: template.defaultSize.w,
        h: template.defaultSize.h
      },
      visible: true,
      settings: template.settings
    };

    setWidgets(prev => [...prev, newWidget]);
  };

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    ));
  };

  const renderWidget = (widget: DashboardWidget) => {
    const gridSpan = `col-span-${widget.position.w} row-span-${widget.position.h}`;
    
    return (
      <Card
        key={widget.id}
        className={`glass relative ${gridSpan} ${!widget.visible ? 'opacity-50' : ''} ${
          selectedWidget === widget.id ? 'border-purple-400' : 'border-purple-500/30'
        }`}
        onClick={() => setSelectedWidget(widget.id)}
      >
        {isEditMode && (
          <div className="absolute top-2 right-2 z-10 flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                toggleWidgetVisibility(widget.id);
              }}
              className="h-6 w-6 p-0"
            >
              {widget.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                removeWidget(widget.id);
              }}
              className="h-6 w-6 p-0 text-red-400"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}
        
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            {isEditMode && <Move className="w-3 h-3 mr-2 text-muted-foreground" />}
            {widget.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          {renderWidgetContent(widget)}
        </CardContent>
      </Card>
    );
  };

  const renderWidgetContent = (widget: DashboardWidget) => {
    switch (widget.type) {
      case "portfolio":
        return (
          <div className="space-y-3">
            <div className="text-2xl font-bold text-green-400">$50,247.83</div>
            <div className="text-sm text-green-400">+2.4% (+$1,204)</div>
            <Progress value={65} className="h-2" />
            <div className="text-xs text-muted-foreground">Portfolio allocation: 65% crypto</div>
          </div>
        );

      case "chart":
        return (
          <div className="h-32 bg-gradient-to-br from-purple-900/20 to-slate-900/20 rounded flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-sm text-muted-foreground">{widget.settings.symbol} Chart</div>
            </div>
          </div>
        );

      case "price":
        return (
          <div className="space-y-2">
            {widget.settings.symbols.map((symbol: string, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm font-medium">{symbol}</span>
                <div className="text-right">
                  <div className="text-sm font-bold">$43,250</div>
                  <div className="text-xs text-green-400">+2.4%</div>
                </div>
              </div>
            ))}
          </div>
        );

      case "orders":
        return (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Active Orders: 3</div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>BUY 0.5 BTC</span>
                <span className="text-green-400">$42,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>SELL 2 ETH</span>
                <span className="text-red-400">$2,400</span>
              </div>
            </div>
          </div>
        );

      case "performance":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-green-400">+12.4%</div>
                <div className="text-xs text-muted-foreground">7d Return</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-400">87.5%</div>
                <div className="text-xs text-muted-foreground">Win Rate</div>
              </div>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        );

      case "news":
        return (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Latest News</div>
            <div className="space-y-1">
              <div className="text-xs">Bitcoin reaches new ATH...</div>
              <div className="text-xs">DeFi sector shows strong...</div>
              <div className="text-xs">Ethereum 2.0 update...</div>
            </div>
          </div>
        );

      default:
        return <div className="text-center text-muted-foreground">Widget content</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Controls */}
      <Card className="glass">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Grid3X3 className="w-5 h-5 text-purple-400" />
              <span>Dashboard Builder</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsEditMode(!isEditMode)}
                variant={isEditMode ? "default" : "outline"}
                className="glass"
              >
                <Settings className="w-4 h-4 mr-2" />
                {isEditMode ? "Done Editing" : "Edit Dashboard"}
              </Button>
              <Button
                onClick={() => {
                  const layouts = widgets.map(w => ({
                    id: w.id,
                    position: w.position,
                    visible: w.visible
                  }));
                  localStorage.setItem('dashboard-layout', JSON.stringify(layouts));
                }}
                variant="outline"
                className="glass"
              >
                Save Layout
              </Button>
            </div>
          </div>
        </CardHeader>

        {isEditMode && (
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Add Widget</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {widgetTemplates.map((template) => (
                    <Card
                      key={template.type}
                      className="glass-strong cursor-pointer hover:border-purple-400/50 transition-all"
                      onClick={() => addWidget(template)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <template.icon className="w-4 h-4 text-purple-400" />
                          <span className="font-medium text-sm">{template.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{template.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Widget List</h3>
                <div className="space-y-2">
                  {widgets.map((widget) => (
                    <div
                      key={widget.id}
                      className="flex items-center justify-between p-2 rounded bg-slate-800/30"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{widget.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {widget.type}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleWidgetVisibility(widget.id)}
                          className="h-6 w-6 p-0"
                        >
                          {widget.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeWidget(widget.id)}
                          className="h-6 w-6 p-0 text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-8 gap-4 auto-rows-[200px]">
        {widgets.filter(w => w.visible).map(renderWidget)}
      </div>

      {/* Dashboard Stats */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400">{widgets.length}</div>
              <div className="text-sm text-muted-foreground">Total Widgets</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{widgets.filter(w => w.visible).length}</div>
              <div className="text-sm text-muted-foreground">Active Widgets</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{widgetTemplates.length}</div>
              <div className="text-sm text-muted-foreground">Available Templates</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">Custom</div>
              <div className="text-sm text-muted-foreground">Your Layout</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}