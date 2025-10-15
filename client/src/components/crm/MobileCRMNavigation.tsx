import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Target, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  Plus,
  Menu,
  X
} from "lucide-react";

interface MobileCRMNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notifications?: number;
}

export function MobileCRMNavigation({ activeTab, onTabChange, notifications = 0 }: MobileCRMNavigationProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'bg-blue-500' },
    { id: 'customers', label: 'Customers', icon: Users, color: 'bg-green-500' },
    { id: 'sales', label: 'Sales', icon: Target, color: 'bg-purple-500' },
    { id: 'support', label: 'Support', icon: MessageSquare, color: 'bg-orange-500', badge: notifications },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'bg-cyan-500' }
  ];

  const quickActions = [
    { id: 'add-customer', label: 'Add Customer', icon: Plus, action: () => {} },
    { id: 'search', label: 'Search', icon: Search, action: () => {} },
    { id: 'notifications', label: 'Notifications', icon: Bell, action: () => {} }
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsSidebarOpen(true)}
              className="text-white hover:bg-gray-800"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-white">CRM Dashboard</h1>
              <p className="text-xs text-gray-400">Business Operations</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  onClick={action.action}
                  className="text-white hover:bg-gray-800"
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}>
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-gray-900 border-r border-gray-700">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">CRM Menu</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-white hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start text-left ${
                        isActive 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                      onClick={() => {
                        onTabChange(item.id);
                        setIsSidebarOpen(false);
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full mr-3 ${item.color}`} />
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                      {item.badge && (
                        <Badge variant="destructive" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900 border-t border-gray-700">
        <div className="flex items-center justify-around py-2">
          {navigationItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center p-2 ${
                  isActive 
                    ? 'text-blue-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 text-xs px-1 py-0 min-w-[16px] h-4"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-gray-700 z-40">
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">CRM Dashboard</h2>
            <p className="text-gray-400">Business Operations</p>
          </div>
          
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start text-left ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={() => onTabChange(item.id)}
                >
                  <div className={`w-2 h-2 rounded-full mr-3 ${item.color}`} />
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                  {item.badge && (
                    <Badge variant="destructive" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}