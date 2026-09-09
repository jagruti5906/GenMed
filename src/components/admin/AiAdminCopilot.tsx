import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Sparkles,
  Bot,
  Send,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface CopilotMessage {
  id: string;
  sender: 'ai' | 'admin';
  text: string;
  timestamp: string;
}

export const AiAdminCopilot: React.FC = () => {
  const { orders, specialists, services, authoritativeRole } = usePlatform();

  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'cp-1',
      sender: 'ai',
      text: `Hello Commander. As your OmniFlow Operations Co-Pilot, I am continuously analyzing dispatch latency, field specialist utilization, and SLA compliance. How can I assist your operational decisions today?`,
      timestamp: '09:42 AM'
    }
  ]);

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const activeJobs = orders.filter(o => o.status === 'assigned' || o.status === 'in_progress');

  const suggestedQueries = [
    'Analyze current dispatch bottleneck risks',
    'Summarize today’s revenue & service margins',
    'Check specialist workload and fatigue index'
  ];

  const handleSend = (text?: string) => {
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

    setTimeout(() => {
      let reply = '';
      const lower = query.toLowerCase();

      if (lower.includes('bottleneck') || lower.includes('risk') || lower.includes('queue')) {
        reply = `Operational Analysis: There are currently ${pendingOrders.length} unassigned orders in the queue. Marcus Vance and Elena Rostova have 4.9+ ratings with available capacity in Sector 4. Recommending immediate auto-dispatch to maintain 45-minute SLA.`;
      } else if (lower.includes('revenue') || lower.includes('margin') || lower.includes('summary')) {
        const totalRev = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
        reply = `Financial Synthesis: Gross Volume across active and historic orders stands at $${totalRev.toFixed(2)}. Highest grossing category is Appliance Repair & Plumbing ($95 - $125/job). Customer re-booking retention is currently 76.2%.`;
      } else if (lower.includes('specialist') || lower.includes('workload') || lower.includes('fatigue')) {
        reply = `Fleet Telemetry: 4 out of 4 specialists are active. David Chen and Sarah Jenkins are idle at North Station and Financial District hubs with zero active queues. Routing upcoming requests to them will balance load perfectly.`;
      } else {
        reply = `Insights Generated: All system health indicators are nominal. API Gateway latency is averaging 24ms, and real-time state synchronization with customer mobile clients is operating at 99.98% reliability.`;
      }

      const aiMsg: CopilotMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 500);
  };

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-indigo-800/40 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Gemini Grounded Ops Co-Pilot</span>
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Real-Time Dispatch Intelligence</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Autonomous SLA prediction, routing anomaly alerts, and dynamic capacity planning for authoritative controllers.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-purple-900/40 border border-purple-500/30 px-3 py-2 rounded-xl text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>FSM Watchdog: 0 SLA Breaches</span>
        </div>
      </div>

      {/* Anomaly Detection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-amber-900 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Unassigned Queue Notice</span>
          </div>
          <p className="text-amber-800">
            {pendingOrders.length > 0
              ? `${pendingOrders.length} order(s) pending dispatch. Earliest received at 09:40 AM.`
              : 'Zero unassigned backlog. Dispatch queue is optimal.'}
          </p>
        </div>

        <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Field Fleet Health</span>
          </div>
          <p className="text-emerald-800">
            All 4 field specialists report verified GPS connectivity and high safety ratings (4.9 Avg).
          </p>
        </div>

        <div className="p-4 bg-indigo-50/80 rounded-2xl border border-indigo-200 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-900 font-bold">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Demand Prediction</span>
          </div>
          <p className="text-indigo-800">
            High surge anticipated in Emergency Plumbing between 12:00 PM and 02:00 PM.
          </p>
        </div>
      </div>

      {/* Interactive AI Chat Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[480px]">
        {/* Chat Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-xl ${m.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'admin'
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block px-1">{m.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Queries */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Suggestions:</span>
          {suggestedQueries.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 text-xs rounded-full shrink-0 border border-slate-200 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Operations Co-Pilot about dispatch, revenue, or SLA trends..."
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Analyze</span>
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};
