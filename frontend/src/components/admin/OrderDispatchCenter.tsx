import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { Order, OrderStatus, Specialist } from '../../types';
import {
  Kanban,
  Table as TableIcon,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  Phone,
  AlertCircle,
  XCircle,
  X,
  Star,
  MapPin,
  Calendar
} from 'lucide-react';

export const OrderDispatchCenter: React.FC = () => {
  const { orders, specialists, updateOrderStatus, assignSpecialist, authoritativeRole } = usePlatform();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [assigningOrder, setAssigningOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: { status: OrderStatus; label: string; color: string }[] = [
    { status: 'pending', label: 'Pending Review', color: 'border-amber-400' },
    { status: 'confirmed', label: 'Confirmed & Queued', color: 'border-sky-400' },
    { status: 'assigned', label: 'Assigned & En Route', color: 'border-blue-400' },
    { status: 'in_progress', label: 'In Service On-Site', color: 'border-emerald-400' },
    { status: 'completed', label: 'Completed & Certified', color: 'border-slate-300' }
  ];

  return (
    <div className="space-y-5">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Dispatch & Order Operations Center</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Live FSM State
            </span>
          </h2>
          <p className="text-xs text-slate-500">Coordinate field pros and broadcast live status updates directly to customer apps.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order #, customer..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-indigo-700 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Kanban View"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white text-indigo-700 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Layout */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {columns.map((col) => {
            const colOrders = filteredOrders.filter((o) => o.status === col.status);

            return (
              <div
                key={col.status}
                className="bg-slate-100/80 rounded-2xl p-3 border border-slate-200/80 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between pb-3 border-b-2 ${col.color} mb-3`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{col.label}</span>
                    <span className="w-5 h-5 rounded-full bg-white text-slate-700 text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                      {colOrders.length}
                    </span>
                  </div>
                </div>

                {/* Orders in column */}
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {colOrders.length === 0 ? (
                    <div className="text-center py-10 text-xs text-slate-400">
                      No orders in this state
                    </div>
                  ) : (
                    colOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-2.5"
                      >
                        {/* Order ID & Price */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-indigo-700">#{order.orderNumber}</span>
                          <span className="text-xs font-black text-slate-900">${order.totalAmount}.00</span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">{order.serviceName}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{order.customerAddress}</span>
                          </p>
                        </div>

                        {/* Customer Information */}
                        <div className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-600 flex items-center justify-between">
                          <span>{order.customerName}</span>
                          <span className="text-[10px] font-medium text-slate-400">{order.scheduledTimeSlot}</span>
                        </div>

                        {/* Assigned Specialist Badge or Dispatch Prompt */}
                        {order.specialistName ? (
                          <div className="flex items-center justify-between text-[11px] p-2 bg-indigo-50/60 rounded-lg border border-indigo-100">
                            <div className="flex items-center gap-1.5">
                              <img
                                src={order.specialistAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                                alt={order.specialistName}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="font-semibold text-indigo-950 truncate max-w-[100px]">{order.specialistName}</span>
                            </div>
                            <button
                              onClick={() => setAssigningOrder(order)}
                              className="text-[10px] font-bold text-indigo-600 hover:underline"
                            >
                              Reassign
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAssigningOrder(order)}
                            className="w-full py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg border border-amber-200 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Assign Specialist</span>
                          </button>
                        )}

                        {/* Action Control Buttons to Transition Status */}
                        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                          {order.status === 'pending' && (
                            <div className="w-full flex items-center gap-1.5">
                              <button
                                onClick={() => updateOrderStatus(order.id, 'confirmed', 'Order approved by dispatcher.')}
                                className="flex-1 py-1.5 px-2 bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                              >
                                <span>Confirm</span>
                              </button>
                              <button
                                onClick={() => setAssigningOrder(order)}
                                className="flex-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                              >
                                <span>Dispatch</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          {order.status === 'confirmed' && (
                            <button
                              onClick={() => setAssigningOrder(order)}
                              className="w-full py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                              <span>Assign Specialist</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                          {order.status === 'assigned' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'in_progress', 'Specialist arrived on site.')}
                              className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                              <span>Start On-Site</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                          {order.status === 'in_progress' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'completed', 'Work completed and customer certified.')}
                              className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Complete Job</span>
                            </button>
                          )}

                          {order.status === 'completed' && (
                            <div className="w-full text-center text-[11px] text-emerald-600 font-semibold py-1">
                              ✓ Certified & Closed
                            </div>
                          )}
                        </div>

                      </div>
                    ))
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* High-Density Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Order</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Service</th>
                  <th className="p-3.5">Assigned Specialist</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-indigo-600">#{order.orderNumber}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">{order.customerName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{order.customerAddress}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{order.serviceName}</div>
                      <div className="text-[10px] text-slate-400">{order.scheduledTimeSlot}</div>
                    </td>
                    <td className="p-3.5">
                      {order.specialistName ? (
                        <div className="flex items-center gap-1.5">
                          <img
                            src={order.specialistAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                            alt={order.specialistName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="font-semibold text-slate-900">{order.specialistName}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAssigningOrder(order)}
                          className="text-amber-600 hover:underline font-bold text-[11px]"
                        >
                          + Assign Pro
                        </button>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        order.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : order.status === 'confirmed'
                          ? 'bg-sky-100 text-sky-800'
                          : order.status === 'assigned'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'in_progress'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">${order.totalAmount}.00</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              className="px-2 py-1 bg-sky-600 text-white rounded-md text-[11px] font-semibold hover:bg-sky-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setAssigningOrder(order)}
                              className="px-2 py-1 bg-indigo-600 text-white rounded-md text-[11px] font-semibold hover:bg-indigo-700"
                            >
                              Dispatch
                            </button>
                          </>
                        )}
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => setAssigningOrder(order)}
                            className="px-2 py-1 bg-indigo-600 text-white rounded-md text-[11px] font-semibold hover:bg-indigo-700"
                          >
                            Assign Pro
                          </button>
                        )}
                        {order.status === 'assigned' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'in_progress')}
                            className="px-2 py-1 bg-emerald-600 text-white rounded-md text-[11px] font-semibold hover:bg-emerald-700"
                          >
                            Start
                          </button>
                        )}
                        {order.status === 'in_progress' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="px-2 py-1 bg-slate-900 text-white rounded-md text-[11px] font-semibold hover:bg-slate-800"
                          >
                            Finish
                          </button>
                        )}
                        {order.status === 'completed' && (
                          <span className="text-[11px] text-emerald-600 font-semibold">✓ Completed</span>
                        )}
                        {order.status === 'cancelled' && (
                          <span className="text-[11px] text-rose-600 font-semibold">Cancelled</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Specialist Assignment Modal */}
      {assigningOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-600">Operations Dispatch</span>
                <h3 className="text-sm font-bold text-slate-900">Assign Field Specialist to #{assigningOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setAssigningOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-600">
                Select from verified on-duty specialists near <strong>{assigningOrder.customerAddress}</strong>:
              </p>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {specialists.map((spec) => (
                  <div
                    key={spec.id}
                    onClick={() => {
                      assignSpecialist(assigningOrder.id, spec.id);
                      setAssigningOrder(null);
                    }}
                    className="p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={spec.avatar}
                        alt={spec.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{spec.name}</h4>
                        <p className="text-[10px] text-slate-500">{spec.specialty}</p>
                        <p className="text-[10px] text-indigo-600">{spec.currentLocationName}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                        ★ {spec.rating}
                      </span>
                      <p className="text-[9px] text-slate-400 mt-1">{spec.totalJobs} jobs</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setAssigningOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
