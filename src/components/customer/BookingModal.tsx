import React, { useState } from 'react';
import { ServiceItem, PaymentMethod } from '../../types';
import { usePlatform } from '../../context/PlatformContext';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Wallet,
  Smartphone,
  CheckCircle2,
  Tag,
  ShieldCheck
} from 'lucide-react';

interface BookingModalProps {
  service: ServiceItem;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ service, onClose, onSuccess }) => {
  const { currentUser, placeOrder } = usePlatform();

  const [date, setDate] = useState<string>('Today');
  const [timeSlot, setTimeSlot] = useState<string>('11:00 AM - 01:00 PM');
  const [address, setAddress] = useState<string>(currentUser.address);
  const [notes, setNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('apple_pay');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const discount = 10;
  const finalPrice = Math.max(10, service.price - discount);

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newOrder = placeOrder({
        service,
        date,
        timeSlot,
        notes,
        paymentMethod,
        customAddress: address
      });
      setIsSubmitting(false);
      onSuccess(newOrder.id);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600">Quick Booking</span>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">{service.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          
          {/* Schedule Date Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>Select Date</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Today', 'Tomorrow', 'Friday (Sep 11)'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDate(d)}
                  className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                    date === d
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Time Slot</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                '09:00 AM - 11:00 AM',
                '11:00 AM - 01:00 PM',
                '02:00 PM - 04:00 PM',
                '05:00 PM - 07:00 PM'
              ].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                    timeSlot === slot
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Service Address */}
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span>Service Location</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                placeholder="Enter street, apartment, zip code"
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 block">
              Instructions for Field Specialist
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              placeholder="E.g., Gate code #4012, beware of golden retriever, park in visitor slot..."
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-indigo-500" />
              <span>Payment Method</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Smartphone className="w-4 h-4 text-slate-900" />
                <span>Apple / Google Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Credit Card (••4092)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-all ${
                  paymentMethod === 'wallet'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Wallet className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="font-semibold">Wallet (${currentUser.walletBalance.toFixed(2)})</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-all ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>Pay on Arrival</span>
              </button>
            </div>
          </div>

          {/* Pricing Breakdown & Promo */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Base Service Fee</span>
              <span>${service.price}.00</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-medium">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Loyalty First-Booking Discount</span>
              </span>
              <span>-${discount}.00</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform & Insurance Fee</span>
              <span className="text-emerald-600">FREE</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
              <span>Total Payable</span>
              <span>${finalPrice}.00</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Backed by OmniFlow 100% Satisfaction Guarantee & $1M Insurance.</span>
          </div>

        </div>

        {/* Action Button */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-order"
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="flex-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <span>Confirm & Book for ${finalPrice}.00</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
