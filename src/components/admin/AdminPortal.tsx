import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { AdminDashboard } from './AdminDashboard';
import { OrderDispatchCenter } from './OrderDispatchCenter';
import { CatalogManager } from './CatalogManager';
import { CustomerDirectory } from './CustomerDirectory';
import { AuditLogView } from './AuditLogView';
import { AiAdminCopilot } from './AiAdminCopilot';
import {
  LayoutDashboard,
  Kanban,
  Tags,
  Users,
  ShieldAlert,
  Sparkles,
  ShieldCheck,
  Zap,
  Radio,
  RefreshCw,
  Bell
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { authoritativeRole, setAuthoritativeRole, orders, simulateNewIncomingOrder } = usePlatform();

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  const navItems = [
    { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Dispatch Center', icon: Kanban, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'catalog', label: 'Service Catalog', icon: Tags },
    { id: 'customers', label: 'Customer CRM', icon: Users },
    { id: 'audit', label: 'Security & Audit Log', icon: ShieldAlert },
    { id: 'copilot', label: 'AI Operations Co-Pilot', icon: Sparkles }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard onNavigateToTab={(tab) => setActiveTab(tab)} />;
      case 'orders':
        return <OrderDispatchCenter />;
      case 'catalog':
        return <CatalogManager />;
      case 'customers':
        return <CustomerDirectory />;
      case 'audit':
        return <AuditLogView />;
      case 'copilot':
        return <AiAdminCopilot />;
      default:
        return <AdminDashboard onNavigateToTab={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-100 text-slate-900">
      
      {/* Desktop Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          
          {/* Active Role Selector Badge in Sidebar */}
          <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Authority</span>
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
            </div>

            <select
              value={authoritativeRole}
              onChange={(e) => setAuthoritativeRole(e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="super_admin">Super Admin (Executive)</option>
              <option value="ops_manager">Operations Manager</option>
              <option value="support_lead">Support & Quality Lead</option>
            </select>

            <p className="text-[10px] text-slate-400 mt-2">
              {authoritativeRole === 'super_admin' && 'Full platform governance, catalog pricing & audit.'}
              {authoritativeRole === 'ops_manager' && 'Live field dispatch, order status overrides & routing.'}
              {authoritativeRole === 'support_lead' && 'Customer dispute mitigation & review auditing.'}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 px-3 tracking-wider block mb-2">
              Operations Navigation
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-indigo-700' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Live System Watchdog Status */}
        <div className="pt-4 border-t border-slate-800 mt-6 text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span>Microservices Health</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              100% UP
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span>Active WebSocket Hub</span>
            <span className="text-slate-300 font-mono">Port 3000</span>
          </div>
        </div>
      </aside>

      {/* Main Authoritative Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {renderContent()}
      </main>

    </div>
  );
};
