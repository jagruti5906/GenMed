import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Wallet,
  MapPin,
  ShieldCheck,
  CreditCard,
  Bell,
  Star,
  Gift,
  Plus,
  ArrowUpRight
} from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { currentUser, topUpWallet } = usePlatform();

  const handleTopUp = () => {
    topUpWallet(50);
  };

  return (
    <div className="space-y-4 pb-12">
      
      {/* Profile Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-50"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{currentUser.name}</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{currentUser.loyaltyTier}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
            <p className="text-xs text-slate-500">{currentUser.phone}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-center">
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Member Since</span>
            <span className="text-xs font-bold text-slate-800">{currentUser.joinedDate}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Lifetime Spend</span>
            <span className="text-xs font-bold text-slate-800">${currentUser.totalSpent.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Digital Wallet Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-5 rounded-2xl shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-300" />
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-200">OmniFlow Wallet</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-semibold border border-emerald-400/30">
            Instant Pay Active
          </span>
        </div>

        <div>
          <span className="text-xs text-indigo-200">Available Balance</span>
          <h3 className="text-2xl font-extrabold tracking-tight">${currentUser.walletBalance.toFixed(2)}</h3>
        </div>

        <div className="mt-4 pt-4 border-t border-indigo-700/50 flex items-center justify-between">
          <p className="text-[11px] text-indigo-200">Earn 5% cash back on all services</p>
          <button
            onClick={handleTopUp}
            className="py-1 px-3 bg-white text-indigo-900 font-bold text-xs rounded-xl shadow-xs hover:bg-indigo-50 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add $50</span>
          </button>
        </div>
      </div>

      {/* Saved Addresses */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-500" />
          <span>Saved Service Locations</span>
        </h3>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900">Primary Residence</h4>
              <span className="px-1.5 py-0.2 rounded-md bg-indigo-100 text-indigo-700 text-[9px] font-semibold">DEFAULT</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">{currentUser.address}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Gate Code: #4012 • Ring bell twice</p>
          </div>
        </div>
      </div>

      {/* Perks & Benefits */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Gift className="w-4 h-4 text-indigo-500" />
          <span>VIP Platinum Privileges</span>
        </h3>

        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Priority Dispatch: Jump straight to front of emergency queue.</span>
          </div>
          <div className="p-2.5 bg-indigo-50 text-indigo-900 rounded-xl border border-indigo-100 flex items-center gap-2">
            <Star className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Free cancellation up to 30 minutes before arrival.</span>
          </div>
        </div>
      </div>

    </div>
  );
};
