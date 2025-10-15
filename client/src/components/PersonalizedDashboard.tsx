import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Wallet, 
  BarChart3, 
  Activity, 
  Bell, 
  Settings,
  Plus,
  Grip,
  Eye,
  EyeOff,
  Palette,
  Layout
} from 'lucide-react';

interface Widget {
  id: string;
  type: 'portfolio' | 'market' | 'news' | 'trading' | 'performance' | 'alerts';
  title: string;
  description: string;
  icon: React.ReactNode;
  visible: boolean;
  size: 'small' | 'medium' | 'large';
  color: string;
  data: any;
}

const defaultWidgets: Widget[] = [
  {
    id: 'portfolio-overview',
    type: 'portfolio',
    title: 'Portfolio Overview',
    description: 'Total balance and allocation',
    icon: <Wallet className="w-5 h-5" />,
    visible: true,
    size: 'large',
    color: 'from-blue-600 to-purple-600',
    data: { balance: 125840.50, change: 5.2, allocation: [
      { name: 'BTC', value: 45, color: '#f7931a' },
      { name: 'ETH', value: 30, color: '#627eea' },
      { name: 'SOL', value: 15, color: '#00d4aa' },
      { name: 'Others', value: 10, color: '#8b5cf6' }
    ]}
  },
  {
    id: 'market-trends',
    type: 'market',
    title: 'Market Trends',
    description: 'Live cryptocurrency prices',
    icon: <TrendingUp className="w-5 h-5" />,
    visible: true,
    size: 'medium',
    color: 'from-green-600 to-blue-600',
    data: { trends: [
      { symbol: 'BTC', price: 67450, change: 2.4 },
      { symbol: 'ETH', price: 3720, change: -1.8 },
      { symbol: 'SOL', price: 185, change: 5.7 }
    ]}
  },
  {
    id: 'trading-performance',
    type: 'performance',
    title: 'Trading Performance',
    description: 'P&L and win rate',
    icon: <BarChart3 className="w-5 h-5" />,
    visible: true,
    size: 'medium',
    color: 'from-purple-600 to-pink-600',
    data: { pnl: 12450.75, winRate: 68.5, trades: 24 }
  },
  {
    id: 'activity-feed',
    type: 'trading',
    title: 'Recent Activity',
    description: 'Latest trades and transactions',
    icon: <Activity className="w-5 h-5" />,
    visible: true,
    size: 'small',
    color: 'from-orange-600 to-red-600',
    data: { activities: [
      { type: 'buy', asset: 'BTC', amount: 0.5, time: '2 min ago' },
      { type: 'sell', asset: 'ETH', amount: 2.3, time: '5 min ago' },
      { type: 'deposit', asset: 'USDT', amount: 5000, time: '1 hour ago' }
    ]}
  },
  {
    id: 'price-alerts',
    type: 'alerts',
    title: 'Price Alerts',
    description: 'Active price notifications',
    icon: <Bell className="w-5 h-5" />,
    visible: true,
    size: 'small',
    color: 'from-yellow-600 to-orange-600',
    data: { alerts: [
      { symbol: 'BTC', target: 70000, type: 'above' },
      { symbol: 'ETH', target: 3500, type: 'below' }
    ]}
  }
];

const themes = [
  { name: 'Dark', bg: 'from-slate-900 to-slate-800', text: 'text-white' },
  { name: 'Blue', bg: 'from-blue-900 to-blue-800', text: 'text-blue-100' },
  { name: 'Purple', bg: 'from-purple-900 to-purple-800', text: 'text-purple-100' },
  { name: 'Green', bg: 'from-green-900 to-green-800', text: 'text-green-100' },
];

export function PersonalizedDashboard() {
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
  };

  const toggleWidgetVisibility = (id: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, visible: !widget.visible } : widget
    ));
  };

  const changeWidgetSize = (id: string, size: 'small' | 'medium' | 'large') => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, size } : widget
    ));
  };

  const renderWidget = (widget: Widget) => {
    if (!widget.visible) return null;

    const sizeClasses = {
      small: 'col-span-1 row-span-1',
      medium: 'col-span-2 row-span-1',
      large: 'col-span-3 row-span-2'
    };

    return (
      <Card className={`${sizeClasses[widget.size]} bg-gradient-to-br ${widget.color} border-none text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            {widget.icon}
            <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
          </div>
          {isCustomizing && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleWidgetVisibility(widget.id)}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                {widget.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </Button>
              <Grip className="w-3 h-3 text-white/70" />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <CardDescription className="text-white/80 text-xs mb-2">
            {widget.description}
          </CardDescription>
          
          {widget.type === 'portfolio' && (
            <div className="space-y-3">
              <div className="text-2xl font-bold">${widget.data.balance.toLocaleString()}</div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  +{widget.data.change}%
                </Badge>
                <span className="text-xs text-white/80">24h</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {widget.data.allocation.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs">{item.name} {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {widget.type === 'market' && (
            <div className="space-y-2">
              {widget.data.trends.map((trend: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{trend.symbol}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold">${trend.price.toLocaleString()}</div>
                    <div className={`text-xs ${trend.change >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                      {trend.change >= 0 ? '+' : ''}{trend.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {widget.type === 'performance' && (
            <div className="space-y-3">
              <div className="text-xl font-bold">
                ${widget.data.pnl.toLocaleString()}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/80">Win Rate</span>
                  <span className="text-sm font-medium">{widget.data.winRate}%</span>
                </div>
                <Progress value={widget.data.winRate} className="h-2 bg-white/20" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/80">Trades</span>
                  <span className="text-sm font-medium">{widget.data.trades}</span>
                </div>
              </div>
            </div>
          )}

          {widget.type === 'trading' && (
            <div className="space-y-2">
              {widget.data.activities.slice(0, 3).map((activity: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs border-white/30 ${
                        activity.type === 'buy' ? 'bg-green-500/20 text-green-300' :
                        activity.type === 'sell' ? 'bg-red-500/20 text-red-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {activity.type}
                    </Badge>
                    <span>{activity.asset}</span>
                  </div>
                  <div className="text-right">
                    <div>{activity.amount}</div>
                    <div className="text-white/60">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {widget.type === 'alerts' && (
            <div className="space-y-2">
              {widget.data.alerts.map((alert: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="font-medium">{alert.symbol}</span>
                  <div className="text-right">
                    <div>${alert.target.toLocaleString()}</div>
                    <div className="text-white/60">{alert.type}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${selectedTheme.bg} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${selectedTheme.text}`}>
              Personalized Dashboard
            </h1>
            <p className={`${selectedTheme.text} opacity-80`}>
              Customize your trading experience
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-white" />
              <select 
                value={selectedTheme.name}
                onChange={(e) => setSelectedTheme(themes.find(t => t.name === e.target.value) || themes[0])}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
              >
                {themes.map(theme => (
                  <option key={theme.name} value={theme.name} className="bg-slate-800">
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Layout className="w-4 h-4 mr-2" />
              {isCustomizing ? 'Done' : 'Customize'}
            </Button>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="dashboard" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr"
              >
                {widgets.map((widget, index) => (
                  <Draggable
                    key={widget.id}
                    draggableId={widget.id}
                    index={index}
                    isDragDisabled={!isCustomizing}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={isCustomizing ? 'cursor-move' : ''}
                      >
                        {renderWidget(widget)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {isCustomizing && (
          <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h3 className={`text-lg font-semibold ${selectedTheme.text} mb-3`}>
              Widget Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {widgets.map(widget => (
                <div key={widget.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    {widget.icon}
                    <span className={`text-sm ${selectedTheme.text}`}>{widget.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleWidgetVisibility(widget.id)}
                      className="h-6 w-6 p-0 text-white hover:bg-white/20"
                    >
                      {widget.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                    <select
                      value={widget.size}
                      onChange={(e) => changeWidgetSize(widget.id, e.target.value as any)}
                      className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white"
                    >
                      <option value="small" className="bg-slate-800">Small</option>
                      <option value="medium" className="bg-slate-800">Medium</option>
                      <option value="large" className="bg-slate-800">Large</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}