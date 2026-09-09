import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { OrderStatus } from '../../types';
import {
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  Car,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Navigation,
  Sparkles
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { orders, activeTrackingOrderId, setActiveTrackingOrderId, currentUser } = usePlatform();

  const [activeFilter, setActiveFilter] = useState<'active' | 'completed'>('active');

  const customerOrders = orders.filter(o => o.customerId === currentUser.id);
  const filteredOrders = customerOrders.filter(o => {
    if (activeFilter === 'active') {
      return o.status !== 'completed' && o.status !== 'cancelled';
    }
    return o.status === 'completed' || o.status === 'cancelled';
  });

  const selectedOrder = customerOrders.find(o => o.id === activeTrackingOrderId) || filteredOrders[0] || customerOrders[0];

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">Awaiting Dispatch</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">Confirmed</span>;
      case 'assigned':
        return <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">Specialist En Route</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">In Progress</span>;
      case 'completed':
        return <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">Cancelled</span>;
    }
  };

  const statusSteps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'pending', label: 'Received', desc: 'Order logged in dispatch queue' },
    { key: 'confirmed', label: 'Confirmed', desc: 'Payment verified & SLA locked' },
    { key: 'assigned', label: 'En Route', desc: 'Field pro traveling to address' },
    { key: 'in_progress', label: 'In Service', desc: 'Job underway on site' },
    { key: 'completed', label: 'Completed', desc: 'Quality verified by customer' }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'assigned': return 2;
      case 'in_progress': return 3;
      case 'completed': return 4;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStep = selectedOrder ? getStepIndex(selectedOrder.status) : 0;

  return (
    <div className="space-y-4 pb-12">
      
      {/* Header & Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Your Orders & Live Tracking</h2>
          <p className="text-xs text-slate-500">Real-time telemetry synced with admin dispatch</p>
        </div>

        <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeFilter === 'active'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active ({customerOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeFilter === 'completed'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            History ({customerOrders.filter(o => o.status === 'completed' || o.status === 'cancelled').length})
          </button>
        </div>
      </div>

      {/* Selector pills for multiple customer orders */}
      {filteredOrders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {filteredOrders.map(order => (
            <button
              key={order.id}
              onClick={() => setActiveTrackingOrderId(order.id)}
              className={`px-3 py-1.5 rounded-xl border shrink-0 transition-all text-left flex items-center gap-2 ${
                selectedOrder?.id === order.id
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="font-mono text-[11px] font-bold">#{order.orderNumber}</span>
              <span className="truncate max-w-[120px]">{order.serviceName}</span>
            </button>
          ))}
        </div>
      )}

      {!selectedOrder ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No {activeFilter} orders found</p>
          <p className="text-xs text-slate-400 mt-1">Book a service from the Explore catalog to watch live tracking.</p>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Main Tracking Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            
            {/* Top order summary banner */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900">#{selectedOrder.orderNumber}</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedOrder.serviceName}</h3>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-[240px]">{selectedOrder.customerAddress}</span>
                </p>
              </div>

              {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                <div className="text-right bg-indigo-50/90 border border-indigo-100 px-3 py-1.5 rounded-xl">
                  <span className="text-[10px] text-indigo-600 font-bold uppercase block">Est. Arrival</span>
                  <span className="text-base font-extrabold text-indigo-900">{selectedOrder.etaMinutes} mins</span>
                </div>
              )}
            </div>

            {/* Live Interactive Map Radar Visualization */}
            <div className="relative h-44 bg-slate-900 overflow-hidden flex items-center justify-center">
              {/* Simulated Map Background Grid */}
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Roads & Pathways SVG */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <line x1="20" y1="140" x2="380" y2="40" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                <line x1="60" y1="20" x2="340" y2="160" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
                <path
                  d="M 60 120 Q 180 30 320 70"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  className="animate-pulse"
                />
              </svg>

              {/* Customer Destination Pin */}
              <div className="absolute right-12 top-10 flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg ring-4 ring-rose-500/20">
                  <MapPin className="w-4 h-4 fill-white" />
                </div>
                <span className="mt-1 px-2 py-0.5 bg-slate-900/90 text-white text-[9px] font-bold rounded-md border border-slate-700 shadow-xs">
                  Your Location
                </span>
              </div>

              {/* Specialist Moving Pin */}
              <div className="absolute left-16 bottom-8 flex flex-col items-center z-10">
                <div className="relative">
                  <span className="absolute -inset-2 rounded-full bg-indigo-500/30 animate-ping" />
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl ring-4 ring-indigo-400/40 relative">
                    <Car className="w-4 h-4" />
                  </div>
                </div>
                <span className="mt-1 px-2 py-0.5 bg-indigo-900/90 text-indigo-200 text-[9px] font-bold rounded-md border border-indigo-500/30 shadow-xs flex items-center gap-1">
                  <Navigation className="w-2.5 h-2.5 text-indigo-400 animate-spin" />
                  <span>{selectedOrder.specialistName || 'Specialist'}</span>
                </span>
              </div>

              {/* Map Floating Badge */}
              <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/60 text-[10px] text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>GPS Telemetry: Active (±3m)</span>
              </div>
            </div>

            {/* 5-Step Graphical Status Flow */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Service Lifecycle Status</h4>
                <span className="text-[11px] text-indigo-600 font-semibold">Step {Math.max(1, currentStep + 1)} of 5</span>
              </div>

              <div className="relative">
                {/* Horizontal Progress Bar */}
                <div className="absolute top-3.5 left-4 right-4 h-1 bg-slate-100 -z-0">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(0, currentStep * 25))}%` }}
                  />
                </div>

                <div className="grid grid-cols-5 relative z-10">
                  {statusSteps.map((step, idx) => {
                    const isDone = currentStep >= idx;
                    const isCurrent = currentStep === idx;
                    return (
                      <div key={step.key} className="flex flex-col items-center text-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isDone
                              ? 'bg-indigo-600 text-white ring-4 ring-indigo-50'
                              : 'bg-white border-2 border-slate-200 text-slate-400'
                          } ${isCurrent ? 'ring-indigo-200 scale-110' : ''}`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-[11px] font-semibold mt-1.5 ${isCurrent ? 'text-indigo-600' : isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Assigned Specialist Profile Card */}
            {selectedOrder.specialistName ? (
              <div className="p-4 border-b border-slate-100 bg-slate-50/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedOrder.specialistAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={selectedOrder.specialistName}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900">{selectedOrder.specialistName}</h4>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded-full">
                          ★ {selectedOrder.specialistRating || 4.9}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">Certified Lead Specialist</p>
                      <p className="text-[10px] text-indigo-600 font-medium">Uniform ID: #TECH-{selectedOrder.specialistId?.slice(-3) || '042'}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${selectedOrder.specialistPhone || '+15552348901'}`}
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1 text-xs font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Call</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-4 border-b border-slate-100 bg-amber-50/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Car className="w-4 h-4 animate-bounce" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-amber-900">Matching with optimal field pro...</h5>
                    <p className="text-[11px] text-amber-700">Operations dispatching nearest licensed specialist.</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-amber-800">In Queue</span>
              </div>
            )}

            {/* Real-Time Event Audit Timeline */}
            <div className="p-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Live Dispatch Ledger</h4>
              <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {selectedOrder.timeline.map((event, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className="absolute left-0.5 top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">{event.title}</p>
                      <span className="text-[10px] text-slate-400">{event.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{event.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Receipt Summary */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="text-slate-600">
                <span>Paid via </span>
                <span className="font-semibold capitalize text-slate-800">{selectedOrder.paymentMethod.replace('_', ' ')}</span>
                <span className="ml-2 text-emerald-600 font-bold">● Confirmed</span>
              </div>
              <div className="text-right font-bold text-slate-900 text-sm">
                ${selectedOrder.totalAmount}.00
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
