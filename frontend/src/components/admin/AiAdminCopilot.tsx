import React, { useState, useMemo, useRef, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  queryAiAdminCopilot,
  predictSlaBreaches,
  generateShiftHandoffSummary,
  SlaBreachPrediction,
  ShiftHandoffSummary
} from '../../services/geminiService';
import {
  Sparkles,
  Bot,
  Send,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Shield,
  Clock,
  Users,
  FileText,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';

interface CopilotMessage {
  id: string;
  sender: 'ai' | 'admin';
  text: string;
  timestamp: string;
}

type ActivePanel = 'chat' | 'sla' | 'handoff';

export const AiAdminCopilot: React.FC = () => {
  const { orders, specialists } = usePlatform();

  const [input, setInput]           = useState<string>('');
  const [isTyping, setIsTyping]     = useState<boolean>(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>('chat');
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'cp-1',
      sender: 'ai',
      text: 'Hello Commander. I\'m your OmniFlow Operations Co-Pilot powered by Gemini. I\'m continuously monitoring SLA compliance, fleet utilization, and dispatch bottlenecks. Ask me anything about operations, or check the SLA Monitor and Shift Handoff tabs.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Phase 5: Live SLA predictions and shift handoff summary
  const slaRisks: SlaBreachPrediction[] = useMemo(
    () => predictSlaBreaches(orders, specialists),
    [orders, specialists]
  );

  const handoff: ShiftHandoffSummary = useMemo(
    () => generateShiftHandoffSummary(orders, specialists),
    [orders, specialists]
  );

  const criticalCount = slaRisks.filter(r => r.riskLevel === 'critical').length;
  const highCount     = slaRisks.filter(r => r.riskLevel === 'high').length;

  const suggestedQueries = [
    'Analyze current SLA breach risks',
    'Generate shift handoff briefing',
    'Summarize today\'s revenue & GMV',
    'Check specialist workload & fatigue'
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const query = (text || input).trim();
    if (!query) return;

    const userMsg: CopilotMessage = {
      id: 'adm-' + Date.now(),
      sender: 'admin',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    if (!text) setInput('');
    setIsTyping(true);

    const reply = await queryAiAdminCopilot(query, orders, specialists);

    setIsTyping(false);
    setMessages(prev => [...prev, {
      id: 'ai-' + Date.now(),
      sender: 'ai',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const riskLevelStyle = (level: SlaBreachPrediction['riskLevel']) => ({
    critical: { badge: 'bg-rose-100 text-rose-700', bar: '#dc2626', bg: 'bg-rose-50 border-rose-200' },
    high:     { badge: 'bg-orange-100 text-orange-700', bar: '#ea580c', bg: 'bg-orange-50 border-orange-200' },
    medium:   { badge: 'bg-yellow-100 text-yellow-700', bar: '#ca8a04', bg: 'bg-yellow-50 border-yellow-200' },
    low:      { badge: 'bg-emerald-100 text-emerald-700', bar: '#16a34a', bg: 'bg-emerald-50 border-emerald-200' }
  })[level];

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-indigo-800/40 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Gemini · Phase 5 Intelligence
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">AI Operations Co-Pilot</h2>
          <p className="text-xs text-slate-300 mt-1">Predictive SLA monitoring · Shift intelligence · Fleet analytics</p>
        </div>

        <div className="flex items-center gap-2">
          {criticalCount > 0 ? (
            <div className="flex items-center gap-2 bg-rose-500/20 border border-rose-500/30 px-3 py-2 rounded-xl text-xs text-rose-300 font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              {criticalCount} Critical SLA Risk{criticalCount !== 1 ? 's' : ''}
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-3 py-2 rounded-xl text-xs text-emerald-300 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              SLA Watchdog: All Clear
            </div>
          )}
        </div>
      </div>

      {/* ── Live KPI Strips ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pending Orders', value: orders.filter(o => o.status === 'pending').length, icon: <Clock className="w-4 h-4" />, color: 'border-amber-200 bg-amber-50', text: 'text-amber-900' },
          { label: 'Active in Field', value: orders.filter(o => o.status === 'assigned' || o.status === 'in_progress').length, icon: <TrendingUp className="w-4 h-4" />, color: 'border-indigo-200 bg-indigo-50', text: 'text-indigo-900' },
          { label: 'Fleet Utilization', value: `${handoff.specialistUtilizationPct}%`, icon: <Users className="w-4 h-4" />, color: 'border-sky-200 bg-sky-50', text: 'text-sky-900' },
          { label: 'SLA Risk Orders', value: slaRisks.filter(r => r.riskLevel !== 'low').length, icon: <Shield className="w-4 h-4" />, color: criticalCount + highCount > 0 ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50', text: criticalCount + highCount > 0 ? 'text-rose-900' : 'text-emerald-900' }
        ].map((kpi, i) => (
          <div key={i} className={`p-3.5 rounded-2xl border ${kpi.color}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">{kpi.label}</span>
              <span className="text-slate-400">{kpi.icon}</span>
            </div>
            <p className={`text-2xl font-extrabold ${kpi.text}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* ── Panel Tabs ── */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        {([
          { id: 'chat' as ActivePanel,    label: 'AI Chat',        icon: <Bot className="w-3.5 h-3.5" /> },
          { id: 'sla' as ActivePanel,     label: `SLA Monitor${slaRisks.filter(r=>r.riskLevel!=='low').length > 0 ? ` (${slaRisks.filter(r=>r.riskLevel!=='low').length})` : ''}`, icon: <Shield className="w-3.5 h-3.5" /> },
          { id: 'handoff' as ActivePanel, label: 'Shift Briefing',  icon: <FileText className="w-3.5 h-3.5" /> }
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActivePanel(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activePanel === tab.id ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}>
            {tab.icon}<span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Chat Panel ── */}
      {activePanel === 'chat' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[480px]">
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className={`max-w-xl ${m.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'admin'
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-xs'
                  }`}>{m.text}</div>
                  <span className="text-[10px] text-slate-400 mt-1 block px-1">{m.timestamp}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 shadow-xs rounded-2xl rounded-bl-xs px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-purple-500 animate-spin" />
                  <span className="text-xs text-slate-500">Analyzing operations data…</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Suggestions:</span>
            {suggestedQueries.map((q, i) => (
              <button key={i} onClick={() => handleSend(q)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 text-xs rounded-full shrink-0 border border-slate-200 transition-colors">
                {q}
              </button>
            ))}
          </div>

          <div className="p-3 bg-white border-t border-slate-200">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
              <input
                type="text" value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about dispatch, SLA risks, revenue, or fleet status…"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" disabled={!input.trim() || isTyping}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                Analyze
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── SLA Risk Monitor Panel ── */}
      {activePanel === 'sla' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Predictive SLA Breach Monitor</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time risk scoring for all active & pending orders</p>
            </div>
            <div className="flex items-center gap-2">
              {criticalCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">{criticalCount} Critical</span>
              )}
              {highCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-700">{highCount} High</span>
              )}
            </div>
          </div>

          {slaRisks.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No active SLA risks detected</p>
              <p className="text-xs text-slate-400 mt-1">All orders are within the 45-minute SLA parameters.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {slaRisks.map(risk => {
                const style = riskLevelStyle(risk.riskLevel);
                const isExpanded = expandedRisk === risk.orderId;
                return (
                  <div key={risk.orderId} className={`p-4 transition-colors ${style.bg} border-l-4`}
                    style={{ borderLeftColor: style.bar }}>
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedRisk(isExpanded ? null : risk.orderId)}>
                      {/* Risk score badge */}
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg shrink-0 bg-white shadow-xs border"
                        style={{ color: style.bar }}>
                        {risk.riskScore}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-bold text-slate-900">#{risk.orderNumber}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase ${style.badge}`}>
                            {risk.riskLevel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 truncate">{risk.reason}</p>
                      </div>
                      {/* Risk score progress bar */}
                      <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${risk.riskScore}%`, backgroundColor: style.bar }} />
                        </div>
                        <span className="text-[9px] text-slate-400">Risk score</span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-200/60 pl-15">
                        <div className="flex items-start gap-2 bg-white/70 rounded-xl p-3 text-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-slate-800 mb-0.5">Recommended Action</p>
                            <p className="text-slate-600">{risk.recommendedAction}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Shift Handoff Panel ── */}
      {activePanel === 'handoff' && (
        <div className="space-y-4">
          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Total Orders', value: handoff.totalOrders, color: 'text-slate-900' },
              { label: 'Completed', value: handoff.completedOrders, color: 'text-emerald-700' },
              { label: 'Avg Order Value', value: `$${handoff.averageOrderValue}`, color: 'text-indigo-700' },
              { label: 'Top Service', value: handoff.topService.length > 20 ? handoff.topService.slice(0, 18) + '…' : handoff.topService, color: 'text-purple-700' },
              { label: 'Pending Queue', value: handoff.pendingCount, color: handoff.pendingCount > 3 ? 'text-rose-700' : 'text-slate-700' },
              { label: 'Fleet Utilization', value: `${handoff.specialistUtilizationPct}%`, color: handoff.specialistUtilizationPct > 80 ? 'text-orange-700' : 'text-sky-700' }
            ].map((stat, i) => (
              <div key={i} className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">{stat.label}</p>
                <p className={`text-lg font-extrabold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Outgoing briefing */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl border border-indigo-800/30 p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold">Shift Intelligence Briefing — {handoff.periodLabel}</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{handoff.outgoingBriefing}</p>
          </div>

          {/* Flagged issues */}
          {handoff.flaggedIssues.length > 0 && (
            <div className="bg-white rounded-2xl border border-amber-200 shadow-xs p-4">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Action Items for Incoming Shift
              </h4>
              <div className="space-y-2">
                {handoff.flaggedIssues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 bg-amber-50 rounded-xl text-xs text-amber-900">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {handoff.flaggedIssues.length === 0 && (
            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-900">Clean Shift Handoff</p>
                <p className="text-xs text-emerald-700 mt-0.5">No critical action items. The incoming team can proceed without escalations.</p>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
