"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage, SUPPORTED_LOCALES, type LocaleCode } from "@/context/LanguageContext";
import { useChangeLocale } from "@/hooks/useChangeLocale";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX,
  ExternalLink, RefreshCw, Bot, User, ChevronDown, Phone,
  ShieldCheck, AlertTriangle, Loader2
} from "lucide-react";

type Citation = {
  id: string;
  title: string;
  source: string;
  url: string;
  category: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  confidence?: number;
  fallback?: boolean;
  timestamp: Date;
};

const LOCALE_LABELS: Record<string, string> = {
  en: "English", hi: "हिंदी", te: "తెలుగు", ta: "தமிழ்",
  kn: "ಕನ್ನಡ", ml: "മലയാളം", mr: "मराठी", gu: "ગુજરાતી",
  pa: "ਪੰਜਾਬੀ", bn: "বাংলা", or: "ଓଡ଼ିଆ", as: "অসমীয়া", ur: "اردو",
};

const LANG_CODES: Record<string, string> = {
  en: "en-IN", hi: "hi-IN", te: "te-IN", ta: "ta-IN",
  kn: "kn-IN", ml: "ml-IN", mr: "mr-IN", gu: "gu-IN",
  pa: "pa-IN", bn: "bn-IN", or: "or-IN", as: "as-IN", ur: "ur-PK",
};

const QUICK_QUESTIONS = [
  "How do I check if my name is in the voter list?",
  "What is Form 6 and when do I need it?",
  "What documents do I need to register as a voter?",
  "What is a BLO and how do they help?",
  "How do I correct my name in the voter list?",
];

function ConfidenceBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-2 mt-1">
      <span className="text-xs text-gray-400">Source confidence:</span>
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[80px]">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400">{pct}%</span>
    </div>
  );
}

export default function AIAssistantV2() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { locale, localeName } = useLanguage();
  const changeLocale = useChangeLocale();
  const [listening, setListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const historyRef = useRef<{ role: string; content: string }[]>([]);

  const prevMessageCount = useRef(messages.length);

  useEffect(() => {
    if (open && messages.length > prevMessageCount.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageCount.current = messages.length;
  }, [messages, open]);

  useEffect(() => {
    historyRef.current = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));
  }, [messages]);

  const speak = useCallback((text: string) => {
    if (!ttsEnabled || typeof window === "undefined") return;
    window.speechSynthesis?.cancel();
    const utt = new SpeechSynthesisUtterance(text.slice(0, 400));
    utt.lang = LANG_CODES[locale] || "en-IN";
    utt.rate = 0.9;
    window.speechSynthesis?.speak(utt);
  }, [ttsEnabled, locale]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          locale,
          history: historyRef.current,
        }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        citations: data.citations,
        confidence: data.confidence,
        fallback: data.fallback,
        timestamp: new Date(),
      };
      setMessages((p) => [...p, assistantMsg]);
      if (data.answer) speak(data.answer);
    } catch {
      setMessages((p) => [
        ...p,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Unable to connect. Please call Voter Helpline 1950 or visit voters.eci.gov.in",
          timestamp: new Date(),
          fallback: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function startVoice() {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) { alert("Voice input is not supported in this browser."); return; }
    const rec = new SR();
    rec.lang = LANG_CODES[locale] || "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setInput(t);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }

  function stopVoice() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  const greeting = {
    en: "Hello! I'm your SIR Voter Verification Assistant. Ask me anything about voter registration, required documents, forms, or the SIR process. I only provide information from official ECI sources.",
    hi: "नमस्ते! मैं आपका मतदाता सत्यापन सहायक हूँ। मतदाता पंजीकरण, आवश्यक दस्तावेज़ या SIR प्रक्रिया के बारे में कोई भी प्रश्न पूछें।",
  };

  function openChat() {
    setOpen(true);
    if (messages.length === 0) {
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: greeting[locale as keyof typeof greeting] || greeting.en,
        timestamp: new Date(),
        confidence: 1,
      }]);
    }
  }

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => (open ? setOpen(false) : openChat())}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl flex items-center justify-center hover:shadow-blue-500/50 transition-shadow"
        aria-label="Open AI Assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">SIR AI Assistant</p>
                  <p className="text-blue-200 text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Official ECI sources only
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Language selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowLang((p) => !p)}
                    className="text-white/80 hover:text-white text-xs font-medium bg-white/10 px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    {localeName} <ChevronDown className="w-3 h-3" />
                  </button>
                  {showLang && (
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-10 py-1 w-36 max-h-56 overflow-y-auto">
                      {Object.entries(SUPPORTED_LOCALES).map(([code, label]) => (
                        <button
                          key={code}
                          onClick={() => { changeLocale(code as LocaleCode); setShowLang(false); }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${locale === code ? "font-bold text-blue-700" : "text-gray-700"}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* TTS toggle */}
                <button
                  onClick={() => setTtsEnabled((p) => !p)}
                  className={`p-1.5 rounded-lg transition-colors ${ttsEnabled ? "bg-white/20 text-white" : "text-white/50 hover:text-white"}`}
                  title={ttsEnabled ? "Disable voice" : "Enable voice"}
                >
                  {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${msg.role === "user" ? "bg-blue-600" : "bg-gradient-to-br from-indigo-500 to-blue-600"}`}>
                    {msg.role === "user" ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm"
                    }`}>
                      {msg.content}
                    </div>

                    {/* Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {msg.citations.slice(0, 2).map((c) => (
                          <a
                            key={c.id}
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            {c.source.split(" — ")[0]}
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    )}

                    {msg.confidence !== undefined && msg.role === "assistant" && !msg.fallback && (
                      <ConfidenceBar score={msg.confidence} />
                    )}

                    {msg.fallback && (
                      <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg mt-1">
                        <AlertTriangle className="w-3 h-3" />
                        Please verify with official sources
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick questions */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 bg-white border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2 font-medium">Suggested questions:</p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {QUICK_QUESTIONS.slice(0, 3).map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="flex-shrink-0 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors font-medium whitespace-nowrap"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                  placeholder={locale === "hi" ? "अपना प्रश्न यहाँ लिखें..." : "Ask about voter registration..."}
                  className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                  disabled={loading}
                />
                <button
                  onClick={listening ? stopVoice : startVoice}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${listening ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  title="Voice input"
                >
                  {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-green-500" />
                  Official ECI sources only
                </p>
                <a href="tel:1950" className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-800">
                  <Phone className="w-3 h-3" /> 1950
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
