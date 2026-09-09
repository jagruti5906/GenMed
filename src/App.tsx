import React from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { Header } from './components/common/Header';
import { CustomerApp } from './components/customer/CustomerApp';
import { AdminPortal } from './components/admin/AdminPortal';
import { DualSplitView } from './components/dual/DualSplitView';
import { ArchitectureAndPrdView } from './components/architecture/ArchitectureAndPrdView';

const AppContent: React.FC = () => {
  const { viewMode } = usePlatform();

  const renderActiveView = () => {
    switch (viewMode) {
      case 'dual_view':
        return <DualSplitView />;
      case 'customer_app':
        return <CustomerApp />;
      case 'admin_portal':
        return <AdminPortal />;
      case 'architecture_prd':
        return <ArchitectureAndPrdView />;
      default:
        return <DualSplitView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <Header />
      <div className="flex-1">
        {renderActiveView()}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <PlatformProvider>
      <AppContent />
    </PlatformProvider>
  );
}
