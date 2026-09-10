import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Star,
  DollarSign,
  ShieldCheck
} from 'lucide-react';

export const CustomerDirectory: React.FC = () => {
  const { currentUser, orders } = usePlatform();

  const [searchQuery, setSearchQuery] = useState<string>('');

  const customerList = [
    currentUser,
    {
      id: 'cust-102',
      name: 'Marcus Bennett',
      email: 'm.bennett@enterprise.org',
      phone: '+1 (555) 912-4411',
      address: '120 Market St, 15th Floor, Financial Hub',
      walletBalance: 85.00,
      loyaltyTier: 'Gold' as const,
      totalSpent: 920.00,
      joinedDate: 'Mar 2025',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'cust-103',
      name: 'Dr. Clara Oswald',
      email: 'clara.oswald@stjudes.edu',
      phone: '+1 (555) 441-2099',
      address: '55 University Parkway, Apt 3C',
      walletBalance: 310.00,
      loyaltyTier: 'Silver' as const,
      totalSpent: 450.00,
      joinedDate: 'Jul 2025',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const filtered = customerList.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Customer Accounts & CRM Directory</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {customerList.length} Accounts
            </span>
          </h2>
          <p className="text-xs text-slate-500">View customer lifetime value, active orders, loyalty tiers, and support profiles.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Customers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((cust) => {
          const custOrders = orders.filter(o => o.customerId === cust.id);

          return (
            <div
              key={cust.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <img
                  src={cust.avatar}
                  alt={cust.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100"
                />
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{cust.name}</h3>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.2 rounded-full border border-amber-200 inline-block mt-0.5">
                    ★ {cust.loyaltyTier}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{cust.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cust.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{cust.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-center">
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-semibold">Total Orders</span>
                  <span className="text-xs font-bold text-slate-900">{custOrders.length}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-semibold">Lifetime Spend</span>
                  <span className="text-xs font-bold text-slate-900">${cust.totalSpent.toFixed(2)}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
