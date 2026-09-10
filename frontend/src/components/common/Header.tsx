import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { ViewMode, AuthoritativeRole } from '../../types';
import {
  Smartphone,
  LayoutDashboard,
  Columns2,
  FileCode2,
  ShieldCheck,
  Zap,
  RotateCcw,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    authoritativeRole,
    setAuthoritativeRole,
    isPhoneFramed,
    setIsPhoneFramed,
    simulateNewIncomingOrder,
    resetAllData,
    toast
  } = usePlatform();

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  OmniFlow
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Dual Surface
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Customer Mobile App & Admin Operations Cockpit</p>
            </div>
          </div>

          {/* View Mode Switcher Buttons */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
            <button
              id="btn-nav-dual"
              onClick={() => setViewMode('dual_view')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                viewMode === 'dual_view'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              title="View Customer App and Admin Portal Side-by-Side with Real-Time Sync"
            >
              <Columns2 className="w-4 h-4" />
              <span className="hidden md:inline">Dual Live View</span>
            </button>

            <button
              id="btn-nav-customer"
              onClick={() => setViewMode('customer_app')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                viewMode === 'customer_app'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Customer Mobile View"
            >
              <Smartphone className="w-4 h-4" />
              <span>Customer App</span>
            </button>

            <button
              id="btn-nav-admin"
              onClick={() => setViewMode('admin_portal')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                viewMode === 'admin_portal'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Admin & Operations Web Portal"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Portal</span>
            </button>

            <button
              id="btn-nav-arch"
              onClick={() => setViewMode('architecture_prd')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                viewMode === 'architecture_prd'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              title="System Architecture Diagram & PRD Specifications"
            >
              <FileCode2 className="w-4 h-4" />
              <span className="hidden sm:inline">Architecture & PRD</span>
            </button>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Phone Frame Toggle (when in customer view) */}
            {(viewMode === 'customer_app' || viewMode === 'dual_view') && (
              <button
                onClick={() => setIsPhoneFramed(!isPhoneFramed)}
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
                  isPhoneFramed
                    ? 'bg-slate-800 text-indigo-300 border-indigo-500/40'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title="Toggle Phone Mockup Frame"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isPhoneFramed ? 'Phone Frame: ON' : 'Phone Frame: OFF'}</span>
              </button>
            )}

            {/* Authoritative Role Selector */}
            <div className="hidden xl:flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Role:</span>
              <select
                value={authoritativeRole}
                onChange={(e) => setAuthoritativeRole(e.target.value as AuthoritativeRole)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="super_admin" className="bg-slate-900 text-white">Super Admin</option>
                <option value="ops_manager" className="bg-slate-900 text-white">Ops Manager</option>
                <option value="support_lead" className="bg-slate-900 text-white">Support Lead</option>
              </select>
            </div>

            {/* Simulate Inbound Customer Order */}
            <button
              id="btn-simulate-order"
              onClick={simulateNewIncomingOrder}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              title="Simulate a new incoming customer order to test real-time dispatch"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simulate Order</span>
            </button>

            {/* Reset Demo State */}
            <button
              id="btn-reset-demo"
              onClick={resetAllData}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset all demo data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Live Indicator */}
            <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-slate-800 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Sync Active</span>
            </div>

          </div>

        </div>
      </div>

      {/* Global Real-Time Toast Bar */}
      {toast && (
        <div
          className={`px-4 py-2 text-xs font-medium flex items-center justify-between transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border-t border-emerald-500/30'
              : toast.type === 'warning'
              ? 'bg-amber-500/20 text-amber-300 border-t border-amber-500/30'
              : 'bg-blue-500/20 text-blue-300 border-t border-blue-500/30'
          }`}
        >
          <div className="max-w-7xl mx-auto w-full flex items-center gap-2">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </header>
  );
};
