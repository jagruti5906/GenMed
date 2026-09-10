import React, { useMemo, useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { generateShiftHandoffSummary, predictSlaBreaches, calculateSurgePrice } from '../../services/geminiService';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Briefcase,
  Star,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  Download,
  RefreshCw,
  Zap,
  Shield,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// ─── Mini SVG Bar Chart ───────────────────────────────────────────────────────

interface BarChartProps {
  data: { label: string; value: number; color: string }[];
  maxValue?: number;
  height?: number;
}

const MiniBarChart: React.FC<BarChartProps> = ({ data, maxValue, height = 80 }) => {
  const max = maxValue ?? Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t-sm transition-all duration-700"
            style={{
              height: `${Math.max(4, (d.value / max) * (height - 20))}px`,
              backgroundColor: d.color,
              opacity: 0.85
            }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-[8px] text-slate-400 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Mini Sparkline ───────────────────────────────────────────────────────────

interface SparklineProps {
  values: number[];
  color: string;
  width?: number;
  height?: number;
}

const Sparkline: React.FC<SparklineProps> = ({ values, color, width = 80, height = 28 }) => {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── Donut Chart ──────────────────────────────────────────────────────────────

interface DonutSlice { label: string; value: number; color: string }

const DonutChart: React.FC<{ slices: DonutSlice[]; size?: number }> = ({ slices, size = 72 }) => {
  const total = slices.reduce((s, d) => s + d.value, 0) || 1;
  const cx = size / 2, cy = size / 2, r = size * 0.38, stroke = size * 0.18;

  let offset = 0;
  const circumference = 2 * Math.PI * r;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((slice, i) => {
        const pct = slice.value / total;
        const dashLen = pct * circumference;
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={slice.color}
            strokeWidth={stroke}
            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
            strokeDashoffset={-offset * circumference / 1}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        );
        offset += pct;
        return el;
      })}
      <text x={cx} y={cy + 4} textAnchor="middle" className="text-[10px] font-bold fill-slate-900" fontSize={size * 0.15}>
        {total}
      </text>
    </svg>
  );
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  icon: React.ReactNode;
  color: string;
  sparkline?: number[];
  sparkColor?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, delta, deltaPositive, icon, color, sparkline, sparkColor }) => (
  <div className={`p-4 rounded-2xl border ${color} bg-white shadow-xs`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">{icon}</div>
    </div>
    <div className="flex items-end justify-between">
      <div>
        <p className="text-2xl font-extrabold text-slate-900 leading-none">{value}</p>
        {delta && (
          <div className={`flex items-center gap-0.5 mt-1 text-[11px] font-semibold ${deltaPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
            {deltaPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span>{delta}</span>
          </div>
        )}
      </div>
      {sparkline && sparkColor && (
        <Sparkline values={sparkline} color={sparkColor} />
      )}
    </div>
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export const ExecutiveDashboard: React.FC = () => {
  const { orders, specialists, services } = usePlatform();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const metrics = useMemo(() => {
    const completed  = orders.filter(o => o.status === 'completed');
    const pending    = orders.filter(o => o.status === 'pending');
    const active     = orders.filter(o => o.status === 'assigned' || o.status === 'in_progress');
    const cancelled  = orders.filter(o => o.status === 'cancelled');
    const totalGmv   = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.totalAmount, 0);
    const completedRev = completed.reduce((s, o) => s + o.totalAmount, 0);
    const avgOrderVal  = orders.length > 0 ? totalGmv / orders.length : 0;
    const completionRate = orders.length > 0 ? (completed.length / orders.length) * 100 : 0;
    const availSpecs = specialists.filter(s => s.status === 'available').length;
    const utilization = specialists.length > 0 ? ((specialists.length - availSpecs) / specialists.length) * 100 : 0;
    const avgRating   = specialists.length > 0 ? specialists.reduce((s, sp) => s + sp.rating, 0) / specialists.length : 0;

    // Revenue by service category
    const revenueByCategory: Record<string, number> = {};
    orders.filter(o => o.status !== 'cancelled').forEach(o => {
      revenueByCategory[o.serviceCategory] = (revenueByCategory[o.serviceCategory] || 0) + o.totalAmount;
    });

    // Simulated 7-day GMV trend (using order count seeding for visual interest)
    const gmvTrend = [42, 67, 53, 89, 72, 95, Math.round(totalGmv)].map(v => Math.max(0, v));

    // Order status distribution for donut
    const statusDist: DonutSlice[] = [
      { label: 'Completed', value: completed.length, color: '#10b981' },
      { label: 'Active',    value: active.length,    color: '#6366f1' },
      { label: 'Pending',   value: pending.length,   color: '#f59e0b' },
      { label: 'Cancelled', value: cancelled.length, color: '#f43f5e' }
    ].filter(s => s.value > 0);

    // Top 5 services by revenue
    const revenueRanking = Object.entries(revenueByCategory)
      .map(([label, value]) => ({ label: label.replace(' & ', '/'), value, color: '#6366f1' }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      totalGmv, completedRev, avgOrderVal, completionRate,
      completed, pending, active, cancelled,
      utilization, availSpecs, avgRating,
      gmvTrend, statusDist, revenueRanking, revenueByCategory
    };
  }, [orders, specialists]);

  const handoff   = useMemo(() => generateShiftHandoffSummary(orders, specialists), [orders, specialists]);
  const slaRisks  = useMemo(() => predictSlaBreaches(orders, specialists), [orders, specialists]);
  const highRisks = slaRisks.filter(r => r.riskLevel === 'critical' || r.riskLevel === 'high');

  // Surge pricing for top service categories
  const surgePrices = useMemo(() => {
    return services.slice(0, 4).map(svc => {
      const pending = orders.filter(o => o.serviceCategory === svc.category && o.status === 'pending').length;
      const avail   = specialists.filter(s => s.status === 'available').length;
      return calculateSurgePrice(svc, pending, avail);
    });
  }, [services, orders, specialists]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const handleExportCsv = () => {
    const rows = [
      ['Order Number', 'Service', 'Category', 'Status', 'Amount', 'Payment', 'Date'],
      ...orders.map(o => [o.orderNumber, o.serviceName, o.serviceCategory, o.status, `$${o.totalAmount}`, o.paymentMethod, o.createdAt])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `omniflow-orders-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 rounded-2xl border border-indigo-800/30 text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Phase 5 · Executive Intelligence</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Operations & Revenue Dashboard</h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time GMV, fleet utilization, SLA compliance, and surge pricing analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleRefresh}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white border border-white/10 flex items-center gap-1.5 transition-colors">
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={handleExportCsv}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-900/40">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Session GMV"
          value={`$${metrics.totalGmv.toFixed(2)}`}
          delta="+12.4% vs last shift"
          deltaPositive
          icon={<DollarSign className="w-4 h-4" />}
          color="border-emerald-200"
          sparkline={metrics.gmvTrend}
          sparkColor="#10b981"
        />
        <KpiCard
          title="Avg Order Value"
          value={`$${metrics.avgOrderVal.toFixed(2)}`}
          delta="+$4.20 vs yesterday"
          deltaPositive
          icon={<TrendingUp className="w-4 h-4" />}
          color="border-indigo-200"
          sparkline={[62, 74, 69, 81, 77, 88, metrics.avgOrderVal]}
          sparkColor="#6366f1"
        />
        <KpiCard
          title="Completion Rate"
          value={`${metrics.completionRate.toFixed(1)}%`}
          delta={metrics.completionRate >= 80 ? 'Above 80% target' : 'Below target'}
          deltaPositive={metrics.completionRate >= 80}
          icon={<CheckCircle2 className="w-4 h-4" />}
          color="border-sky-200"
          sparkline={[78, 82, 80, 85, 84, 88, metrics.completionRate]}
          sparkColor="#0ea5e9"
        />
        <KpiCard
          title="Fleet Utilization"
          value={`${metrics.utilization.toFixed(0)}%`}
          delta={`${metrics.availSpecs} specialists free`}
          deltaPositive={metrics.utilization < 85}
          icon={<Briefcase className="w-4 h-4" />}
          color="border-amber-200"
          sparkline={[55, 62, 70, 68, 75, 80, metrics.utilization]}
          sparkColor="#f59e0b"
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Order Status Donut */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Order Status Distribution</h3>
          <div className="flex items-center gap-5 justify-center">
            <DonutChart slices={metrics.statusDist} size={88} />
            <div className="space-y-2">
              {metrics.statusDist.map(s => (
                <div key={s.label} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                  <span className="text-slate-600">{s.label}</span>
                  <span className="font-bold text-slate-900 ml-auto">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Revenue by Category</h3>
          {metrics.revenueRanking.length > 0 ? (
            <MiniBarChart data={metrics.revenueRanking} height={100} />
          ) : (
            <div className="h-24 flex items-center justify-center text-xs text-slate-400">No revenue data yet</div>
          )}
        </div>

        {/* Specialist Performance */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Specialist Performance</h3>
          <div className="space-y-2.5">
            {specialists.slice(0, 4).map(spec => (
              <div key={spec.id} className="flex items-center gap-2.5">
                <img src={spec.avatar} alt={spec.name} className="w-7 h-7 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-800 truncate">{spec.name.split(' ')[0]}</span>
                    <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />{spec.rating}
                    </span>
                  </div>
                  <div className="mt-0.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, (spec.totalJobs / 200) * 100)}%`, backgroundColor: spec.status === 'available' ? '#10b981' : spec.status === 'on_route' ? '#6366f1' : '#f59e0b' }}
                    />
                  </div>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full capitalize ${
                  spec.status === 'available' ? 'bg-emerald-50 text-emerald-700'
                  : spec.status === 'on_route' ? 'bg-indigo-50 text-indigo-700'
                  : spec.status === 'in_service' ? 'bg-amber-50 text-amber-700'
                  : 'bg-slate-100 text-slate-500'
                }`}>{spec.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SLA Risk Monitor ── */}
      {slaRisks.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-500" />
              Predictive SLA Breach Monitor
            </h3>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              highRisks.length > 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {highRisks.length > 0 ? `${highRisks.length} High Risk` : 'All Clear'}
            </span>
          </div>
          <div className="space-y-2">
            {slaRisks.slice(0, 5).map(risk => (
              <div key={risk.orderId} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                {/* Risk score bar */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0"
                  style={{
                    backgroundColor: risk.riskLevel === 'critical' ? '#fef2f2' : risk.riskLevel === 'high' ? '#fff7ed' : risk.riskLevel === 'medium' ? '#fefce8' : '#f0fdf4',
                    color: risk.riskLevel === 'critical' ? '#dc2626' : risk.riskLevel === 'high' ? '#ea580c' : risk.riskLevel === 'medium' ? '#ca8a04' : '#16a34a'
                  }}>
                  {risk.riskScore}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">#{risk.orderNumber}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                      risk.riskLevel === 'critical' ? 'bg-rose-100 text-rose-700'
                      : risk.riskLevel === 'high' ? 'bg-orange-100 text-orange-700'
                      : risk.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-emerald-100 text-emerald-700'
                    }`}>{risk.riskLevel}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{risk.reason}</p>
                </div>
                <p className="text-[10px] text-indigo-600 font-semibold text-right max-w-[120px] leading-snug hidden sm:block">
                  {risk.recommendedAction}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Surge Pricing Panel ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          Dynamic Surge Pricing Engine
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {surgePrices.map(sp => (
            <div key={sp.serviceId} className={`p-3.5 rounded-xl border ${
              sp.demandLevel === 'surge' ? 'border-rose-200 bg-rose-50'
              : sp.demandLevel === 'high' ? 'border-orange-200 bg-orange-50'
              : sp.demandLevel === 'elevated' ? 'border-amber-200 bg-amber-50'
              : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                  sp.demandLevel === 'surge' ? 'bg-rose-100 text-rose-700'
                  : sp.demandLevel === 'high' ? 'bg-orange-100 text-orange-700'
                  : sp.demandLevel === 'elevated' ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-600'
                }`}>{sp.demandLevel}</span>
                <span className="text-[10px] font-bold text-slate-600">{sp.surgeMultiplier}×</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-slate-900">${sp.surgePriceDollars.toFixed(0)}</span>
                {sp.surgeMultiplier > 1 && (
                  <span className="text-[10px] text-slate-400 line-through">${sp.basePriceDollars}</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">{sp.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Shift Handoff Briefing ── */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl border border-indigo-800/30 p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            Shift Handoff Intelligence — {handoff.periodLabel}
          </h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">{handoff.outgoingBriefing}</p>
        {handoff.flaggedIssues.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Action Items for Incoming Shift:</p>
            {handoff.flaggedIssues.map((issue, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{issue}</span>
              </div>
            ))}
          </div>
        )}
        {handoff.flaggedIssues.length === 0 && (
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            No critical flags. Clean handoff to incoming shift.
          </div>
        )}
      </div>

    </div>
  );
};
