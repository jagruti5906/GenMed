import React from 'react';
import { CustomerApp } from '../customer/CustomerApp';
import { AdminPortal } from '../admin/AdminPortal';
import {
  Smartphone,
  LayoutDashboard,
  Zap,
  ArrowRight,
  Sparkles,
  Radio
} from 'lucide-react';

export const DualSplitView: React.FC = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-950">
      
      {/* Synchronization Explanation Bar */}
      <div className="bg-gradient-to-r from-indigo-900/90 via-slate-900 to-indigo-950 border-b border-indigo-800/40 py-2.5 px-4 text-white text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-bold text-indigo-200">Synchronized Dual-Surface Live Demo:</span>
            <span className="text-slate-300">
              Book any service in the Customer App (left), then watch it populate the Admin Command Center (right) instantly!
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px] text-indigo-300">
            <span className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              <span>Normal Customer Mobile App</span>
            </span>
            <span>⇄</span>
            <span className="flex items-center gap-1">
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
              <span>Authoritative Admin Portal</span>
            </span>
          </div>
        </div>
      </div>

      {/* Split Grid: Left = Mobile Customer App, Right = Desktop Admin Portal */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* Left Column: Customer Mobile App (5 cols on large screens) */}
        <div className="lg:col-span-5 bg-slate-900/95 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col items-center justify-center p-3 sm:p-5 overflow-y-auto max-h-[calc(100vh-6.5rem)]">
          <div className="w-full max-w-[390px] flex items-center justify-between mb-2 text-slate-400 text-xs px-2">
            <span className="font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Customer Mobile App</span>
            </span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
              End-User Client
            </span>
          </div>

          <div className="w-full max-w-[390px] h-[720px] bg-slate-950 rounded-[44px] p-2.5 shadow-2xl ring-1 ring-slate-800 border-[4px] border-slate-700/80 flex flex-col overflow-hidden">
            <CustomerApp />
          </div>
        </div>

        {/* Right Column: Admin & Authoritative Web Portal (7 cols on large screens) */}
        <div className="lg:col-span-7 bg-slate-100 flex flex-col overflow-y-auto max-h-[calc(100vh-6.5rem)]">
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-2 flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin & Operations Web Command Portal</span>
            </span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
              Authoritative Role
            </span>
          </div>

          <div className="flex-1">
            <AdminPortal />
          </div>
        </div>

      </div>

    </div>
  );
};
