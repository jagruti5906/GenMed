import React, { useState, useRef } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { ServiceItem } from '../../types';
import { BookingModal } from './BookingModal';
import { queryAiConcierge, diagnosePhotoWithAI, PhotoDiagnosisResult } from '../../services/geminiService';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  Camera,
  X,
  ImagePlus,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Shield
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  recommendedServiceId?: string;
  timestamp: string;
  imageUrl?: string;          // data URL for display
  diagnosis?: PhotoDiagnosisResult;
}

interface AiConciergeProps {
  onNavigateToTracking: (orderId: string) => void;
}

export const AiConcierge: React.FC<AiConciergeProps> = ({ onNavigateToTracking }) => {
  const { services } = usePlatform();

  const [input, setInput]               = useState<string>('');
  const [bookingService, setBookingService] = useState<ServiceItem | null>(null);
  const [isTyping, setIsTyping]         = useState<boolean>(false);
  const [pendingImage, setPendingImage] = useState<{ dataUrl: string; base64: string; mimeType: 'image/jpeg' | 'image/png' | 'image/webp' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef   = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: "Hello! I'm your OmniFlow Smart Concierge. Tell me what needs fixing, or upload a photo of the issue and I'll diagnose it with AI. I'll recommend the right licensed pro instantly!",
      timestamp: 'Just now'
    }
  ]);

  const quickPrompts = [
    'Emergency: Kitchen pipe is leaking!',
    'How much for deep cleaning?',
    'Wi-Fi dead zones need fixing',
    'Urgent same-day courier needed'
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ─── Photo Upload Handler ─────────────────────────────────────────────────

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      // Strip the data URL prefix to get pure base64
      const base64 = dataUrl.split(',')[1];
      setPendingImage({
        dataUrl,
        base64,
        mimeType: file.type as 'image/jpeg' | 'image/png' | 'image/webp'
      });
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  // ─── Send / Diagnose Handler ──────────────────────────────────────────────

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    const hasImage = !!pendingImage;

    if (!query && !hasImage) return;

    const displayText = query || (hasImage ? 'Photo uploaded for AI diagnosis' : '');

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: displayText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: pendingImage?.dataUrl
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    const capturedImage = pendingImage;
    setPendingImage(null);
    setIsTyping(true);
    setTimeout(scrollToBottom, 100);

    try {
      if (capturedImage) {
        // Phase 5: Multimodal photo diagnosis via Gemini Vision
        const diagnosis = await diagnosePhotoWithAI(capturedImage.base64, capturedImage.mimeType, services);
        const recService = services.find(s => s.id === diagnosis.recommendedServiceId);

        const botMsg: Message = {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: diagnosis.diagnosis,
          recommendedServiceId: diagnosis.recommendedServiceId,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          diagnosis
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        // Text-only query → RAG concierge
        const result = await queryAiConcierge(query, services);
        const botMsg: Message = {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: result.text,
          recommendedServiceId: result.recommendedServiceId,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } finally {
      setIsTyping(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  // ─── Severity badge helper ────────────────────────────────────────────────

  const renderSeverityBadge = (severity: PhotoDiagnosisResult['severity']) => {
    const map = {
      low:      { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Low Severity' },
      medium:   { cls: 'bg-amber-50 text-amber-700 border-amber-200',       icon: <AlertTriangle className="w-3 h-3" />, label: 'Medium Severity' },
      high:     { cls: 'bg-orange-50 text-orange-700 border-orange-200',    icon: <AlertTriangle className="w-3 h-3" />, label: 'High Severity' },
      critical: { cls: 'bg-rose-50 text-rose-700 border-rose-200',          icon: <Shield className="w-3 h-3" />,       label: 'Critical — Act Now' }
    };
    const s = map[severity];
    return (
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${s.cls}`}>
        {s.icon}{s.label}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-[580px] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">

      {/* ── Header ── */}
      <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              OmniFlow AI Concierge
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[10px] text-slate-500">Gemini Vision · Photo Diagnosis · RAG</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
            <Camera className="w-3 h-3" />
            Photo AI
          </span>
        </div>
      </div>

      {/* ── Message Stream ── */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
        {messages.map((msg) => {
          const recService = msg.recommendedServiceId
            ? services.find(s => s.id === msg.recommendedServiceId)
            : null;

          return (
            <div key={msg.id} className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[84%] ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {/* Uploaded image preview */}
                {msg.imageUrl && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-slate-200 inline-block">
                    <img src={msg.imageUrl} alt="Uploaded for diagnosis" className="max-w-[160px] max-h-[120px] object-cover" />
                  </div>
                )}

                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-bl-xs'
                }`}>
                  <p>{msg.text}</p>
                </div>

                {/* Photo diagnosis card */}
                {msg.diagnosis && (
                  <div className="mt-2 p-3 bg-white rounded-xl border border-indigo-200 shadow-xs text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-indigo-600 flex items-center gap-1">
                        <Camera className="w-3 h-3" />AI Photo Diagnosis
                      </span>
                      {renderSeverityBadge(msg.diagnosis.severity)}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-700">{msg.diagnosis.urgencyLabel}</span>
                      {msg.diagnosis.estimatedCost && (
                        <span className="font-bold text-indigo-700">{msg.diagnosis.estimatedCost}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Service recommendation */}
                {recService && (
                  <div className="mt-2 p-3 bg-white rounded-xl border border-indigo-200 shadow-xs text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-indigo-600">Recommended Match</span>
                        <h4 className="text-xs font-bold text-slate-900">{recService.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">${recService.price}.00 · {recService.durationMinutes} min</p>
                      </div>
                      <button
                        onClick={() => setBookingService(recService)}
                        className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                      >
                        Book <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                <span className="text-[9px] text-slate-400 mt-1 block px-1">{msg.timestamp}</span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 shadow-xs rounded-2xl rounded-bl-xs px-3.5 py-2.5 flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
              <span className="text-[11px] text-slate-500">Analyzing…</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Pending image preview strip ── */}
      {pendingImage && (
        <div className="px-3 py-2 bg-indigo-50 border-t border-indigo-100 flex items-center gap-2">
          <div className="relative">
            <img src={pendingImage.dataUrl} alt="Pending upload" className="w-12 h-12 rounded-lg object-cover border border-indigo-200" />
            <button
              onClick={() => setPendingImage(null)}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center"
              aria-label="Remove image"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
          <span className="text-xs text-indigo-700 font-semibold">Photo ready for AI diagnosis</span>
        </div>
      )}

      {/* ── Quick Prompts ── */}
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

      {/* ── Input Bar ── */}
      <div className="p-2.5 bg-white border-t border-slate-200">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
          {/* Photo upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 border border-slate-200 transition-colors shrink-0"
            title="Upload photo for AI diagnosis"
            aria-label="Upload photo"
          >
            <ImagePlus className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelect}
            aria-label="Image file input"
          />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={pendingImage ? 'Add a note or send photo…' : 'Describe the issue or upload a photo…'}
            className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() && !pendingImage}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-40 transition-colors shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* ── Booking modal ── */}
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
