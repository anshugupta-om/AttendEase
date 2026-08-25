import React from 'react';
import { Home, BarChart3, Calendar, History, Settings } from 'lucide-react';

export type NavTab = 'home' | 'dashboard' | 'calendar' | 'history' | 'settings';

interface NavigationProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onChangeTab }) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Today', icon: Home },
    { id: 'dashboard', label: 'Analytics', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Navigation Tabs */}
      <div className="hidden md:block bg-canvas border-b border-hairline">
        <div className="max-w-7xl mx-auto px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onChangeTab(tab.id)}
                  className={`relative py-4 px-1 text-xs font-semibold tracking-[0.5px] transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'text-ink font-bold'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary rounded-t-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (engineered rounded style) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-canvas/90 backdrop-blur-md border-t border-hairline py-2 shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3 transition-all duration-150 cursor-pointer rounded-md ${
                  isActive
                    ? 'text-ink font-semibold'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px] mt-1 font-bold tracking-[0.5px]">{tab.label}</span>
                {isActive && (
                  <div className="absolute top-0 left-3 right-3 h-[2px] bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
