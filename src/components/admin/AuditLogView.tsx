import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  ShieldCheck,
  Search,
  Filter,
  FileText,
  User,
  Cpu,
  Clock
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = usePlatform();

  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = auditLogs.filter(log => {
    const matchesRole = roleFilter === 'all' || log.actorRole === roleFilter;
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.orderNumber && log.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const getActorBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">Super Admin</span>;
      case 'ops_manager':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">Ops Manager</span>;
      case 'support_lead':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Support Lead</span>;
      case 'customer':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Customer</span>;
      case 'system':
      default:
        return <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">System Daemon</span>;
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>System Audit & Operational Ledger</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Immutable
            </span>
          </h2>
          <p className="text-xs text-slate-500">Security event stream logging every state transition, specialist dispatch, and financial authorization.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:bg-white"
          >
            <option value="all">All Actors</option>
            <option value="super_admin">Super Admin</option>
            <option value="ops_manager">Ops Manager</option>
            <option value="customer">Customer</option>
            <option value="system">System / SLA</option>
          </select>

          {/* Search Input */}
          <div className="relative w-44 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit logs..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Actor</th>
                <th className="p-3.5">Action Event</th>
                <th className="p-3.5">Order Ref</th>
                <th className="p-3.5">Audit Trail Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 text-slate-500 flex items-center gap-1.5 font-sans">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{log.timestamp}</span>
                  </td>
                  <td className="p-3.5 font-sans">
                    <div className="flex items-center gap-2">
                      {getActorBadge(log.actorRole)}
                      <span className="font-semibold text-slate-800 text-[11px]">{log.actorName}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-sans font-bold text-slate-900">{log.action}</td>
                  <td className="p-3.5">
                    {log.orderNumber ? (
                      <span className="text-indigo-600 font-bold">#{log.orderNumber}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="p-3.5 font-sans text-slate-600 text-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
