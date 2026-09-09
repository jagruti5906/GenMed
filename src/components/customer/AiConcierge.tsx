import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { ServiceItem } from '../../types';
import { BookingModal } from './BookingModal';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  recommendedServiceId?: string;
  timestamp: string;
}

interface AiConciergeProps {
  onNavigateToTracking: (orderId: string) => void;
}

export const AiConcierge: React.FC<AiConciergeProps> = ({ onNavigateToTracking }) => {
  const { services } = usePlatform();

  const [input, setInput] = useState<string>('');
  const [bookingService, setBookingService] = useState<ServiceItem | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: "Hello Alex! I am your OmniFlow Smart Concierge. Tell me what needs fixing, cleaning, or transporting, and I will recommend the right licensed pro or help manage your active bookings!",
      timestamp: 'Just now'
    }
  ]);

  const quickPrompts = [
    'Emergency: Kitchen pipe is leaking water!',
    'How much for hospital-grade deep cleaning?',
    'I need Wi-Fi router setup and dead zones fixed',
    'Do you deliver urgent documents same-day?'
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate smart context-aware response
    setTimeout(() => {
      let botReply = "I can definitely help coordinate that service for you!";
      let recServiceId: string | undefined;

      const lower = query.toLowerCase();
      if (lower.includes('leak') || lower.includes('pipe') || lower.includes('plumb') || lower.includes('water')) {
        botReply = "For plumbing emergencies or leaking pipes, our rapid response team arrives in under 45 minutes with hydrostatic diagnostic tools and replacement fittings.";
        recServiceId = 'srv-2';
      } else if (lower.includes('clean') || lower.includes('sanitiz') || lower.includes('house') || lower.includes('maid')) {
        botReply = "Our Deep Home Sanctuary Cleaning includes hospital-grade eco disinfectants, inside-oven/fridge care, and HEPA filtration.";
        recServiceId = 'srv-1';
      } else if (lower.includes('wifi') || lower.includes('network') || lower.includes('internet') || lower.includes('tech') || lower.includes('router')) {
        botReply = "Our master tech network specialists optimize mesh backhauls, tune WPA3 enterprise encryption, and eliminate all dead zones.";
        recServiceId = 'srv-5';
      } else if (lower.includes('courier') || lower.includes('deliver') || lower.includes('package') || lower.includes('urgent') || lower.includes('document')) {
        botReply = "Our Priority White-Glove Courier offers direct door-to-door transit, digital signature chain of custody, and real-time GPS telemetry.";
        recServiceId = 'srv-6';
      } else if (lower.includes('appliance') || lower.includes('refrigerator') || lower.includes('dishwasher') || lower.includes('oven')) {
        botReply = "Our OEM-certified technicians carry genuine manufacturer parts for all major brands with same-day diagnosis.";
        recServiceId = 'srv-4';
      } else {
        botReply = "I understand! We have top-rated licensed professionals across home cleaning, electrical, plumbing, appliance repair, and courier dispatch. Which category best fits your requirement?";
      }

      const botMsg: Message = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: botReply,
        recommendedServiceId: recServiceId,
        timestamp: 'Just now'
      };

      setMessages(prev => [...prev, botMsg]);
    }, 500);
  };

  return (
    <div className="flex flex-col h-[520px] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
      
      {/* Concierge Header */}
      <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>OmniFlow AI Concierge</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[10px] text-slate-500">Gemini Grounded Customer Assistant</p>
          </div>
        </div>
        <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-100">
          24/7 Live
        </span>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
        {messages.map((msg) => {
          const recService = msg.recommendedServiceId
            ? services.find(s => s.id === msg.recommendedServiceId)
            : null;

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 text-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[82%] ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Service Recommendation Card inside Bot message */}
                {recService && (
                  <div className="mt-2 p-3 bg-white rounded-xl border border-indigo-200 shadow-xs text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-indigo-600">Recommended Match</span>
                        <h4 className="text-xs font-bold text-slate-900">{recService.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">${recService.price}.00 • {recService.durationMinutes} mins</p>
                      </div>
                      <button
                        onClick={() => setBookingService(recService)}
                        className="py-1 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 shadow-xs"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                <span className="text-[9px] text-slate-400 mt-1 block px-1">{msg.timestamp}</span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-[11px] rounded-full shrink-0 border border-slate-200 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-2.5 bg-white border-t border-slate-200">
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
            placeholder="Ask OmniFlow Concierge anything..."
            className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-40 transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Booking Modal from Chat Recommendation */}
      {bookingService && (
        <BookingModal
          service={bookingService}
          onClose={() => setBookingService(null)}
          onSuccess={(orderId) => {
            setBookingService(null);
            onNavigateToTracking(orderId);
          }}
        />
      )}

    </div>
  );
};
