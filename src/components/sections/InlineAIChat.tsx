"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import GppGoodIcon from "@mui/icons-material/GppGood";
import LaunchIcon from "@mui/icons-material/Launch";
import PhoneIcon from "@mui/icons-material/Phone";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import TranslateIcon from "@mui/icons-material/Translate";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useInView } from "react-intersection-observer";
import { useLanguage, SUPPORTED_LOCALES, type LocaleCode } from "@/context/LanguageContext";
import { useChangeLocale } from "@/hooks/useChangeLocale";

type Citation = { id: string; title: string; source: string; url: string };
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  confidence?: number;
  fallback?: boolean;
};

const QUICK_QUESTIONS = [
  { label: "What is SIR?", icon: "🗳️" },
  { label: "How do I check my voter name?", icon: "🔍" },
  { label: "What documents do I need?", icon: "📋" },
  { label: "What is Form 6?", icon: "📝" },
  { label: "What is a BLO?", icon: "🏠" },
  { label: "How to correct my voter details?", icon: "✏️" },
];

const LANG_CODES: Record<string, string> = {
  en: "en-IN", hi: "hi-IN", te: "te-IN", ta: "ta-IN", kn: "kn-IN",
  ml: "ml-IN", mr: "mr-IN", gu: "gu-IN", pa: "pa-IN", bn: "bn-IN",
  or: "or-IN", as: "as-IN", ur: "ur-PK",
};

const WELCOME_MSG: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hello! I'm your SIR Voter Verification Assistant.\n\nAsk me anything about:\n• Voter registration & SIR process\n• Required documents & forms\n• Finding your BLO or ERO\n• Correcting voter roll entries\n\nI only answer from official Election Commission of India sources.",
  confidence: 1,
};

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-blue-400"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

export default function InlineAIChat() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { locale, localeName } = useLanguage();
  const changeLocale = useChangeLocale();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [listening, setListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recRef = useRef<any>(null);
  const historyRef = useRef<{ role: string; content: string }[]>([]);

  const prevMessageCount = useRef(messages.length);

  useEffect(() => {
    if (messages.length > prevMessageCount.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageCount.current = messages.length;
  }, [messages]);

  useEffect(() => {
    historyRef.current = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
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
    setMessages((p) => [...p, { id: Date.now().toString(), role: "user", content: text.trim() }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), locale, history: historyRef.current }),
      });
      const data = await res.json();
      const msg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        citations: data.citations,
        confidence: data.confidence,
        fallback: data.fallback,
      };
      setMessages((p) => [...p, msg]);
      speak(data.answer);
    } catch {
      setMessages((p) => [...p, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Unable to connect. Please call Voter Helpline 1950 or visit voters.eci.gov.in",
        fallback: true,
      }]);
    } finally {
      setLoading(false);
    }
  }

  function startVoice() {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = LANG_CODES[locale] || "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => { setInput(e.results[0][0].transcript); setListening(false); };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  }

  return (
    <section id="ai-chat" className="py-16 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950" ref={ref}>
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 text-sm font-semibold text-white mb-4">
            <AutoAwesomeIcon sx={{ fontSize: 16, color: "#fbbf24" }} />
            AI-Powered Voter Assistant
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Ask Me Anything About SIR
          </h2>
          <p className="text-blue-300 text-lg max-w-xl mx-auto">
            Powered by Grok AI + official ECI knowledge base. Every answer is cited from official sources.
          </p>
        </motion.div>

        {/* Chat container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/10"
        >
          {/* Chat header bar */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <SmartToyIcon sx={{ fontSize: 22, color: "white" }} />
              </div>
              <div>
                <p className="font-bold text-white text-sm">SIR AI Assistant</p>
                <p className="text-blue-200 text-xs flex items-center gap-1">
                  <GppGoodIcon sx={{ fontSize: 11, color: "#4ade80" }} />
                  Official ECI sources only · {localeName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* TTS */}
              <button
                onClick={() => setTtsEnabled((p) => !p)}
                className={`p-2 rounded-xl transition-colors ${ttsEnabled ? "bg-white/20 text-white" : "text-white/40 hover:text-white"}`}
                title="Toggle voice"
              >
                {ttsEnabled ? <VolumeUpIcon sx={{ fontSize: 18 }} /> : <VolumeOffIcon sx={{ fontSize: 18 }} />}
              </button>
              {/* Language */}
              <div className="relative">
                <button
                  onClick={() => setShowLangPicker((p) => !p)}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors border border-white/10"
                >
                  <TranslateIcon sx={{ fontSize: 14 }} />
                  {locale.toUpperCase()}
                  <KeyboardArrowDownIcon sx={{ fontSize: 14 }} />
                </button>
                <AnimatePresence>
                  {showLangPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 py-2 w-40 max-h-64 overflow-y-auto"
                    >
                      {Object.entries(SUPPORTED_LOCALES).map(([code, name]) => (
                        <button
                          key={code}
                          onClick={() => { changeLocale(code as LocaleCode); setShowLangPicker(false); }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-blue-50 ${locale === code ? "font-bold text-blue-700 bg-blue-50" : "text-gray-700"}`}
                        >
                          {name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[380px] overflow-y-auto p-5 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm ${
                  msg.role === "user"
                    ? "bg-blue-600"
                    : "bg-gradient-to-br from-indigo-600 to-blue-700"
                }`}>
                  {msg.role === "user"
                    ? <PersonIcon sx={{ fontSize: 16, color: "white" }} />
                    : <SmartToyIcon sx={{ fontSize: 16, color: "white" }} />
                  }
                </div>

                <div className={`max-w-[78%] flex flex-col gap-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  {/* Bubble */}
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm"
                  }`}>
                    {msg.content}
                  </div>

                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.slice(0, 2).map((c) => (
                        <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full hover:bg-green-100 transition-colors">
                          <GppGoodIcon sx={{ fontSize: 11 }} />
                          {c.source.split(" — ")[0]}
                          <LaunchIcon sx={{ fontSize: 10 }} />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Confidence */}
                  {msg.confidence !== undefined && msg.role === "assistant" && !msg.fallback && msg.confidence < 1 && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${msg.confidence >= 0.8 ? "bg-green-500" : msg.confidence >= 0.5 ? "bg-yellow-500" : "bg-red-400"}`}
                          style={{ width: `${msg.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{Math.round(msg.confidence * 100)}% source match</span>
                    </div>
                  )}

                  {/* Fallback warning */}
                  {msg.fallback && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                      <WarningAmberIcon sx={{ fontSize: 13 }} />
                      Verify with official sources
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center shadow-sm">
                  <SmartToyIcon sx={{ fontSize: 16, color: "white" }} />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          <div className="px-5 py-3 bg-white border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium mb-2">Quick questions:</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q.label}
                  onClick={() => sendMessage(q.label)}
                  disabled={loading}
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-400 disabled:opacity-40 px-3 py-2 rounded-full transition-all font-medium whitespace-nowrap"
                >
                  <span>{q.icon}</span>
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input bar */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                placeholder={
                  locale === "hi" ? "अपना सवाल यहाँ टाइप करें..." :
                  locale === "te" ? "మీ ప్రశ్న ఇక్కడ టైప్ చేయండి..." :
                  "Type your question about voter registration..."
                }
                disabled={loading}
                className="flex-1 bg-gray-100 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition-all placeholder:text-gray-400"
              />
              {/* Voice */}
              <button
                onClick={listening ? () => { recRef.current?.stop(); setListening(false); } : startVoice}
                disabled={loading}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                  listening ? "bg-red-500 text-white shadow-lg animate-pulse" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
                title="Voice input"
              >
                {listening ? <MicOffIcon sx={{ fontSize: 20 }} /> : <MicIcon sx={{ fontSize: 20 }} />}
              </button>
              {/* Send */}
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-12 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white flex items-center justify-center flex-shrink-0 transition-all shadow-md hover:shadow-lg"
              >
                <SendIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Footer bar */}
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <GppGoodIcon sx={{ fontSize: 12, color: "#22c55e" }} />
                Answers from official ECI sources only
              </p>
              <a href="tel:1950" className="flex items-center gap-1.5 text-xs text-amber-600 font-bold hover:text-amber-800 transition-colors">
                <PhoneIcon sx={{ fontSize: 13 }} />
                Voter Helpline: 1950
              </a>
            </div>
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center text-blue-400/60 text-xs mt-5"
        >
          AI responses are based on official ECI knowledge base. Always verify with your local BLO/ERO or call 1950.
        </motion.p>
      </div>
    </section>
  );
}
