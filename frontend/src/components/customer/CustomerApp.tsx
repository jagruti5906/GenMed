import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { CatalogView } from './CatalogView';
import { OrderTrackingView } from './OrderTrackingView';
import { AiConcierge } from './AiConcierge';
import { CustomerProfile } from './CustomerProfile';
import {
  Compass,
  Navigation,
  Sparkles,
  User,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';

interface CustomerAppProps {
  embedded?: boolean;
}

export const CustomerApp: React.FC<CustomerAppProps> = ({ embedded = false }) => {
  const { isPhoneFramed, orders, currentUser, activeTrackingOrderId, setActiveTrackingOrderId } = usePlatform();

  const [activeTab, setActiveTab] = useState<'explore' | 'tracking' | 'concierge' | 'profile'>('explore');

  const activeOrdersCount = orders.filter(
    o => o.customerId === currentUser.id && o.status !== 'completed' && o.status !== 'cancelled'
  ).length;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'explore':
        return (
          <CatalogView
            onNavigateToTracking={(orderId) => {
              setActiveTrackingOrderId(orderId);
              setActiveTab('tracking');
            }}
          />
        );
      case 'tracking':
        return <OrderTrackingView />;
      case 'concierge':
        return (
          <AiConcierge
            onNavigateToTracking={(orderId) => {
              setActiveTrackingOrderId(orderId);
              setActiveTab('tracking');
            }}
          />
        );
      case 'profile':
        return <CustomerProfile />;
    }
  };

  const appInnerContent = (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 relative">
      
      {/* Mobile Top Status Bar */}
      <div className="pt-2 pb-1 px-5 flex items-center justify-between text-xs font-semibold text-slate-800 shrink-0 select-none bg-white border-b border-slate-100">
        <span>9:41</span>
        
        {/* Dynamic Island / Camera Notch */}
        <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-slate-800 mr-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/60" />
        </div>

        <div className="flex items-center gap-1.5 text-slate-700">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4 fill-slate-800" />
        </div>
      </div>

      {/* Main Scrollable Viewport */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-20">
        {renderTabContent()}
      </div>

      {/* Mobile Bottom Navigation Dock */}
      <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-6 flex items-center justify-around z-20 shadow-lg">
        
        {/* Explore Tab */}
        <button
          id="tab-btn-explore"
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'explore' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Explore</span>
        </button>

        {/* Live Tracking Tab */}
        <button
          id="tab-btn-tracking"
          onClick={() => setActiveTab('tracking')}
          className={`flex flex-col items-center gap-1 relative transition-colors ${
            activeTab === 'tracking' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <Navigation className="w-5 h-5" />
            {activeOrdersCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {activeOrdersCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Tracking</span>
        </button>

        {/* AI Concierge Tab */}
        <button
          id="tab-btn-concierge"
          onClick={() => setActiveTab('concierge')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'concierge' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <span className="text-[10px]">Concierge</span>
        </button>

        {/* Profile Tab */}
        <button
          id="tab-btn-profile"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'profile' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>

      </div>

      {/* Home Indicator Bar */}
      <div className="absolute bottom-1 inset-x-0 flex justify-center pointer-events-none z-30">
        <div className="w-28 h-1 bg-slate-300 rounded-full" />
      </div>

    </div>
  );

  // If phone framed mode is enabled (default), wrap in realistic smartphone frame
  if (isPhoneFramed) {
    if (embedded) {
      return (
        <div className="w-full max-w-[390px] h-[720px] bg-slate-950 rounded-[48px] p-2.5 shadow-2xl ring-1 ring-slate-800 border-[5px] border-slate-700/80 relative flex flex-col shrink-0">
          <div className="w-full h-full rounded-[38px] overflow-hidden shadow-inner flex flex-col relative bg-slate-50">
            {appInnerContent}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-3 sm:p-6 min-h-[calc(100vh-4rem)] bg-slate-900/60">
        <div className="w-full max-w-[400px] h-[780px] bg-slate-950 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 border-[5px] border-slate-700/80 relative flex flex-col">
          {/* Inner Screen Bezel */}
          <div className="w-full h-full rounded-[38px] overflow-hidden shadow-inner flex flex-col relative bg-slate-50">
            {appInnerContent}
          </div>
        </div>
      </div>
    );
  }

  // Full-width responsive container (if user unchecks phone frame)
  return (
    <div className="max-w-2xl mx-auto min-h-[calc(100vh-4rem)] bg-white border-x border-slate-200 relative shadow-md">
      {appInnerContent}
    </div>
  );
};
