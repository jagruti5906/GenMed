import React, { useState } from 'react';
import { ServiceItem, PaymentMethod, StripeCardDetails } from '../../types';
import { usePlatform } from '../../context/PlatformContext';
import {
  createPaymentIntent,
  confirmPayment,
  validateCard,
  formatCardNumber
} from '../../services/paymentService';
import { sendOrderNotification } from '../../services/notificationService';
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
  ShieldCheck,
  Lock,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface BookingModalProps {
  service: ServiceItem;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

type BookingStep = 'schedule' | 'payment' | 'processing' | 'confirmed';

export const BookingModal: React.FC<BookingModalProps> = ({ service, onClose, onSuccess }) => {
  const { currentUser, placeOrder } = usePlatform();

  // Step 1 — Schedule
  const [date, setDate]           = useState<string>('Today');
  const [timeSlot, setTimeSlot]   = useState<string>('11:00 AM - 01:00 PM');
  const [address, setAddress]     = useState<string>(currentUser.address);
  const [notes, setNotes]         = useState<string>('');

  // Step 2 — Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('apple_pay');

  // Phase 4 — Stripe card form state
  const [cardDetails, setCardDetails] = useState<StripeCardDetails>({
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardholderName: ''
  });
  const [cardErrors, setCardErrors] = useState<string[]>([]);
  const [paymentError, setPaymentError] = useState<string>('');

  // Step tracker
  const [step, setStep]                 = useState<BookingStep>('schedule');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const discount   = 10;
  const finalPrice = Math.max(10, service.price - discount);

  // ─── Card input formatting ────────────────────────────────────────────────

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw    = e.target.value.replace(/\D/g, '').slice(0, 16);
    const groups = raw.match(/.{1,4}/g) || [];
    setCardDetails(prev => ({ ...prev, cardNumber: groups.join(' ') }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    const fmt = raw.length > 2 ? raw.slice(0, 2) + '/' + raw.slice(2) : raw;
    setCardDetails(prev => ({ ...prev, expiry: fmt }));
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardDetails(prev => ({ ...prev, cvc: raw }));
  };

  // ─── Confirm & process ───────────────────────────────────────────────────

  const handleConfirm = async () => {
    setPaymentError('');
    setCardErrors([]);

    // Validate card form if credit_card is selected
    if (paymentMethod === 'credit_card') {
      const validation = validateCard(cardDetails);
      if (!validation.valid) {
        setCardErrors(validation.errors);
        return;
      }
    }

    setIsSubmitting(true);
    setStep('processing');

    try {
      // Phase 4: Create PaymentIntent then confirm with card
      if (paymentMethod === 'credit_card') {
        const intent = await createPaymentIntent(finalPrice, 'pending-' + Date.now());
        const result = await confirmPayment(intent, cardDetails);
        if (!result.success) {
          setPaymentError(result.errorMessage || 'Payment failed. Please try again.');
          setStep('payment');
          setIsSubmitting(false);
          return;
        }
      } else {
        // Non-card methods: simulate brief processing delay
        await new Promise<void>(r => setTimeout(r, 800));
      }

      // Place order in platform context
      const newOrder = placeOrder({
        service,
        date,
        timeSlot,
        notes,
        paymentMethod,
        customAddress: address
      });

      // Phase 4: Fire transactional notification
      await sendOrderNotification('order_booked', {
        orderId:       newOrder.id,
        orderNumber:   newOrder.orderNumber,
        customerName:  currentUser.name,
        customerPhone: currentUser.phone,
        customerEmail: currentUser.email,
        serviceName:   service.name,
        totalAmount:   finalPrice
      });

      setStep('confirmed');

      setTimeout(() => {
        onSuccess(newOrder.id);
      }, 1600);
    } catch {
      setPaymentError('An unexpected error occurred. Please try again.');
      setStep('payment');
      setIsSubmitting(false);
    }
  };

  // ─── Render helpers ───────────────────────────────────────────────────────

  const renderScheduleStep = () => (
    <div className="p-5 space-y-5">
      {/* Date */}
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-indigo-500" />
          Select Date
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['Today', 'Tomorrow', 'Friday (Sep 11)'].map(d => (
            <button
              key={d} type="button" onClick={() => setDate(d)}
              className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                date === d
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >{d}</button>
          ))}
        </div>
      </div>

      {/* Time slot */}
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-indigo-500" />
          Time Slot
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM', '05:00 PM - 07:00 PM'].map(slot => (
            <button
              key={slot} type="button" onClick={() => setTimeSlot(slot)}
              className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                timeSlot === slot
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >{slot}</button>
          ))}
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-indigo-500" />
          Service Location
        </label>
        <input
          type="text" value={address} onChange={e => setAddress(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          placeholder="Enter street, apartment, zip code"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 block">
          Instructions for Field Specialist
        </label>
        <textarea
          value={notes} onChange={e => setNotes(e.target.value)} rows={2}
          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          placeholder="E.g., Gate code #4012, beware of golden retriever, park in visitor slot..."
        />
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="p-5 space-y-5">
      {/* Payment method selector */}
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-indigo-500" />
          Payment Method
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { method: 'apple_pay'        as PaymentMethod, icon: <Smartphone className="w-4 h-4 text-slate-900" />,    label: 'Apple / Google Pay' },
            { method: 'credit_card'      as PaymentMethod, icon: <CreditCard  className="w-4 h-4 text-blue-600" />,    label: 'Credit / Debit Card' },
            { method: 'wallet'           as PaymentMethod, icon: <Wallet      className="w-4 h-4 text-emerald-600" />, label: `Wallet ($${currentUser.walletBalance.toFixed(2)})` },
            { method: 'cash_on_delivery' as PaymentMethod, icon: <CheckCircle2 className="w-4 h-4 text-amber-600" />, label: 'Pay on Arrival' },
          ].map(({ method, icon, label }) => (
            <button
              key={method} type="button" onClick={() => { setPaymentMethod(method); setPaymentError(''); setCardErrors([]); }}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-all ${
                paymentMethod === method
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Phase 4: Stripe-style card form */}
      {paymentMethod === 'credit_card' && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-700">Card Details</span>
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>256-bit SSL</span>
            </div>
          </div>

          {/* Card number */}
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Card Number</label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={cardDetails.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="4242 4242 4242 4242"
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                aria-label="Card number"
              />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            </div>
          </div>

          {/* Expiry + CVC row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Expiry</label>
              <input
                type="text"
                inputMode="numeric"
                value={cardDetails.expiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Expiry date"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">CVC</label>
              <input
                type="password"
                inputMode="numeric"
                value={cardDetails.cvc}
                onChange={handleCvcChange}
                placeholder="•••"
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="CVC"
              />
            </div>
          </div>

          {/* Cardholder name */}
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Cardholder Name</label>
            <input
              type="text"
              value={cardDetails.cardholderName}
              onChange={e => setCardDetails(prev => ({ ...prev, cardholderName: e.target.value }))}
              placeholder="Jane Smith"
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Cardholder name"
            />
          </div>

          {/* Validation errors */}
          {cardErrors.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 space-y-0.5">
              {cardErrors.map((err, i) => (
                <p key={i} className="text-[11px] text-rose-700 flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {err}
                </p>
              ))}
            </div>
          )}

          <p className="text-[10px] text-slate-400">
            Use test card <span className="font-mono text-indigo-600">4242 4242 4242 4242</span>, any future expiry, any CVC.
          </p>
        </div>
      )}

      {/* Wallet insufficient funds warning */}
      {paymentMethod === 'wallet' && currentUser.walletBalance < finalPrice && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            Insufficient wallet balance (${currentUser.walletBalance.toFixed(2)}). Please top up or choose another payment method.
          </p>
        </div>
      )}

      {/* Global payment error */}
      {paymentError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <p className="text-xs text-rose-700">{paymentError}</p>
        </div>
      )}

      {/* Pricing summary */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Base Service Fee</span>
          <span>${service.price}.00</span>
        </div>
        <div className="flex justify-between text-emerald-600 font-medium">
          <span className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            Loyalty Discount
          </span>
          <span>-${discount}.00</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Platform & Insurance</span>
          <span className="text-emerald-600">FREE</span>
        </div>
        <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
          <span>Total Payable</span>
          <span>${finalPrice}.00</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
        Backed by OmniFlow 100% Satisfaction Guarantee & $1M Insurance.
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="p-12 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
      <div className="text-center">
        <h4 className="text-sm font-bold text-slate-900">Processing Payment</h4>
        <p className="text-xs text-slate-500 mt-1">Securely authorizing your payment via Stripe…</p>
      </div>
    </div>
  );

  const renderConfirmedStep = () => (
    <div className="p-12 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
      </div>
      <div className="text-center">
        <h4 className="text-sm font-bold text-slate-900">Booking Confirmed!</h4>
        <p className="text-xs text-slate-500 mt-1">SMS confirmation sent to {currentUser.phone}. Redirecting to tracking…</p>
      </div>
    </div>
  );

  const canProceedFromSchedule = date && timeSlot && address.trim().length > 3;
  const canProceedFromPayment  =
    paymentMethod !== 'wallet' || currentUser.walletBalance >= finalPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">

        {/* ── Modal Header ── */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600">Quick Booking</span>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">{service.name}</h3>
          </div>

          {/* Step indicator */}
          {(step === 'schedule' || step === 'payment') && (
            <div className="flex items-center gap-1.5 mr-3">
              {['schedule', 'payment'].map((s, i) => (
                <div key={s} className={`w-2 h-2 rounded-full transition-all ${step === s ? 'bg-indigo-600 w-4' : i < ['schedule','payment'].indexOf(step) ? 'bg-indigo-300' : 'bg-slate-200'}`} />
              ))}
            </div>
          )}

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1">
          {step === 'schedule'   && renderScheduleStep()}
          {step === 'payment'    && renderPaymentStep()}
          {step === 'processing' && renderProcessingStep()}
          {step === 'confirmed'  && renderConfirmedStep()}
        </div>

        {/* ── Footer Actions ── */}
        {(step === 'schedule' || step === 'payment') && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3 sticky bottom-0">
            {step === 'schedule' ? (
              <>
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors">
                  Cancel
                </button>
                <button type="button" onClick={() => setStep('payment')} disabled={!canProceedFromSchedule}
                  className="flex-2 py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-40 flex items-center gap-2 justify-center">
                  Continue to Payment →
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => { setStep('schedule'); setPaymentError(''); setCardErrors([]); }}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors">
                  ← Back
                </button>
                <button
                  id="btn-confirm-order"
                  type="button"
                  disabled={isSubmitting || !canProceedFromPayment}
                  onClick={handleConfirm}
                  className="flex-2 py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-40 flex items-center gap-2 justify-center"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Pay ${finalPrice}.00 Securely
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
