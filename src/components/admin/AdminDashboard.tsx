import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  TrendingUp,
  Clock,
  ShieldCheck,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Zap,
  Users
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateToTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToTab }) => {
  const { orders, services, specialists, authoritativeRole, simulateNewIncomingOrder } = usePlatform();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const activeJobs = orders.filter(o => o.status === 'assigned' || o.status === 'in_progress');
  const completedJobs = orders.filter(o => o.status === 'completed');

  const onDutySpecialists = specialists.filter(s => s.status !== 'off_duty').length;

  return (
    <div className="space-y-6">
      
      {/* Role Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-slate-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              Authoritative Portal
            </span>
            <span className="text-xs text-slate-400">● Role: <strong className="text-white capitalize">{authoritativeRole.replace('_', ' ')}</strong></span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Executive Operational Command Center</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Live telemetry, real-time dispatch queue, and bidirectional state synchronization with customer client applications.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={simulateNewIncomingOrder}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Customer Order</span>
          </button>
          <button
            onClick={() => onNavigateToTab('orders')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <span>View Dispatch Queue</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total GMV Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Volume (GMV)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">${totalRevenue.toFixed(2)}</h3>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs last week</span>
            </p>
          </div>
        </div>

        {/* Pending Queue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Dispatch</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${pendingOrders.length > 0 ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{pendingOrders.length}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {pendingOrders.length > 0 ? (
                <span className="text-amber-600 font-semibold">Requires specialist assignment</span>
              ) : (
                'All inbound orders routed'
              )}
            </p>
          </div>
        </div>

        {/* Active Jobs in Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Field Jobs</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{activeJobs.length}</h3>
            <p className="text-xs text-indigo-600 font-semibold mt-1">
              {completedJobs.length} completed today
            </p>
          </div>
        </div>

        {/* Specialists On Duty */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Field Specialists</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{onDutySpecialists} / {specialists.length}</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              98.4% SLA Compliance
            </p>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Urgent Queue & Field Specialists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Live Dispatch Queue Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Priority Orders & Dispatch Feed</h3>
              <p className="text-xs text-slate-500">Live stream of customer requests requiring operational oversight</p>
            </div>
            <button
              onClick={() => onNavigateToTab('orders')}
              className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Full Command Board</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-200 bg-slate-50/60 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    #{order.orderNumber.slice(-3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{order.serviceName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        order.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : order.status === 'in_progress'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Customer: <strong>{order.customerName}</strong> • {order.customerAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs font-extrabold text-slate-900">${order.totalAmount}.00</span>
                  <button
                    onClick={() => onNavigateToTab('orders')}
                    className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-300 hover:border-indigo-300 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Specialist Fleet Status */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Field Specialists</h3>
              <p className="text-xs text-slate-500">Live roster & deployment</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-3">
            {specialists.map((spec) => (
              <div key={spec.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={spec.avatar}
                    alt={spec.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-100"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{spec.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{spec.specialty}</p>
                    <p className="text-[9px] text-indigo-600 font-medium">{spec.currentLocationName}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    spec.status === 'available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : spec.status === 'on_route'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {spec.status.replace('_', ' ')}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1 font-semibold">★ {spec.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
