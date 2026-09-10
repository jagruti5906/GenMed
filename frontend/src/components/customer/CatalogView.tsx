import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { ServiceItem } from '../../types';
import { BookingModal } from './BookingModal';
import {
  Search,
  Sparkles,
  Wrench,
  Zap,
  Cpu,
  Wifi,
  Truck,
  Star,
  Clock,
  Check,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface CatalogViewProps {
  onNavigateToTracking: (orderId: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ onNavigateToTracking }) => {
  const { services, currentUser } = usePlatform();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);

  const categories = [
    'All',
    'Home Cleaning',
    'Plumbing & Electrical',
    'Appliance Repair',
    'Tech Support',
    'Express Courier'
  ];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Home Cleaning': return <Sparkles className="w-4 h-4" />;
      case 'Plumbing & Electrical': return <Wrench className="w-4 h-4" />;
      case 'Appliance Repair': return <Cpu className="w-4 h-4" />;
      case 'Tech Support': return <Wifi className="w-4 h-4" />;
      case 'Express Courier': return <Truck className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-indigo-500" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-blue-500" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-emerald-500" />;
      case 'Wifi': return <Wifi className="w-5 h-5 text-purple-500" />;
      case 'Truck': return <Truck className="w-5 h-5 text-rose-500" />;
      default: return <Sparkles className="w-5 h-5 text-indigo-500" />;
    }
  };

  const filteredServices = services.filter((srv) => {
    const matchesCat = selectedCategory === 'All' || srv.category === selectedCategory;
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-12">
      
      {/* Customer Header Welcome */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-400/40"
            />
            <div>
              <p className="text-xs text-indigo-200">Welcome back,</p>
              <h2 className="text-sm font-bold text-white">{currentUser.name}</h2>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-white/10 backdrop-blur-xs text-amber-300 text-[10px] font-semibold rounded-full border border-amber-400/30">
            ★ {currentUser.loyaltyTier}
          </span>
        </div>

        <h1 className="text-lg sm:text-xl font-extrabold tracking-tight mb-3">
          What service do you need today?
        </h1>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cleaning, emergency plumbing, Wi-Fi..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs text-white placeholder:text-slate-300 focus:outline-none focus:bg-white/20 focus:border-indigo-300 transition-all"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full font-medium shrink-0 flex items-center gap-1.5 transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
            }`}
          >
            {cat !== 'All' && getCategoryIcon(cat)}
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="space-y-3">
        {filteredServices.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-500">No services match "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className={`p-4 rounded-2xl border transition-all ${
                service.available
                  ? 'bg-white border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-200'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    {getServiceIcon(service.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{service.name}</h3>
                      {service.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{service.description}</p>
                  </div>
                </div>
              </div>

              {/* Service Features Badges */}
              <div className="grid grid-cols-2 gap-1.5 my-2.5">
                {service.features.slice(0, 2).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-[11px] text-slate-600">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Footer: Rating, Duration, Price & CTA */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {service.rating} <span className="font-normal text-slate-400">({service.reviewsCount})</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {service.durationMinutes}m
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">${service.price}.00</div>
                    {service.originalPrice && (
                      <div className="text-[10px] text-slate-400 line-through">${service.originalPrice}.00</div>
                    )}
                  </div>
                  <button
                    disabled={!service.available}
                    onClick={() => setSelectedServiceForBooking(service)}
                    className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>{service.available ? 'Book' : 'Unavailable'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/80 flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0" />
        <div className="text-xs">
          <p className="font-bold text-indigo-950">Verified Background Checked Specialists</p>
          <p className="text-indigo-800/80 text-[11px]">All pros carry $1M public liability coverage and undergo rigorous vetting.</p>
        </div>
      </div>

      {/* Modal for Booking */}
      {selectedServiceForBooking && (
        <BookingModal
          service={selectedServiceForBooking}
          onClose={() => setSelectedServiceForBooking(null)}
          onSuccess={(orderId) => {
            setSelectedServiceForBooking(null);
            onNavigateToTracking(orderId);
          }}
        />
      )}

    </div>
  );
};
