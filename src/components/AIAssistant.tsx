"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslationFn } from "@/context/TranslationStoreContext";
import { MessageCircle, X, Send, Bot, User, Mic } from "lucide-react";
import contentData from "@/config/content.json";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const knowledgeBase: Record<string, string> = {
  "documents": "For SIR verification, you need: (1) Proof of Identity — Aadhaar Card, Voter ID (EPIC), Passport, PAN Card, or Driving Licence; (2) Proof of Address — Aadhaar, Utility Bills (within 3 months), Bank Passbook; (3) Proof of Age — Birth Certificate, Passport, or School Certificate. Aadhaar is most convenient as it serves all three purposes.",
  "aadhaar": "Yes! Aadhaar Card is accepted as Proof of Identity, Proof of Address, AND Proof of Age — making it the most convenient single document for SIR verification. Visit voters.eci.gov.in to proceed.",
  "verify online": "You can verify online at voters.eci.gov.in — 1) Enter your EPIC number, 2) View your submitted details, 3) Provide e-consent via OTP, 4) Submit electronically. You can also wait for your BLO (Booth Level Officer) to visit your home during the SIR period.",
  "blo": "A BLO (Booth Level Officer) is a government official assigned to your specific polling booth. During SIR, they visit every household in their area to verify voter details, collect new voter applications, and issue enumeration forms. They are the primary ground-level contact for the SIR process.",
  "missing": "If your name is missing from the voter list: 1) Fill Form 6 at voters.eci.gov.in for new registration; 2) Contact your local BLO; 3) Visit the Electoral Registration Office (ERO); 4) Call helpline 1950 for guidance.",
  "helpline": "The National Voter Helpline number is 1950 (toll-free). You can also call 1800-111-950 (SVEEP helpline) or email complaints@eci.gov.in. Working hours: Monday–Saturday, 10 AM to 5 PM.",
  "status": "To check your voter status, visit electoralsearch.eci.gov.in and search by your EPIC number or by entering your name, father's/husband's name, age, state, and district.",
  "sir": "SIR (Special Intensive Revision) is a comprehensive Electoral Roll verification programme by the Election Commission of India. It involves BLO door-to-door visits, online/offline form submission, document verification, draft roll publication, and final roll release. It ensures accurate voter lists for fair elections.",
  "form 6": "Form 6 is for new voter registration. Fill it at voters.eci.gov.in if you are registering for the first time or moving to a new constituency.",
  "form 8": "Form 8 is for correction of entries in the Electoral Roll. Use it to correct your name, address, photo, or other details at voters.eci.gov.in.",
  "polling booth": "To find your polling booth, search your name at electoralsearch.eci.gov.in — your polling booth/station details are displayed with your voter information.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, answer] of Object.entries(knowledgeBase)) {
    if (lower.includes(key)) return answer;
  }
  return `I can help you with SIR voter verification. You can ask me about: required documents, how to verify online, Aadhaar usage, what a BLO is, missing names, helpline numbers, voter status check, Form 6/8, or finding your polling booth. Call 1950 for direct support.`;
}

export default function AIAssistant() {
  const t = useTranslationFn("ai");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "0", role: "assistant", content: t("greeting") },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestions = t.raw("suggestions") as string[];

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const response = getResponse(text);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: response },
      ]);
      setLoading(false);
    }, 800);
  };

  const handleVoiceInput = () => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = "en-IN";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-700 hover:bg-primary-800 text-white rounded-full shadow-xl flex items-center justify-center transition-all",
          open && "hidden"
        )}
        aria-label="Open AI Voter Assistant"
      >
        <MessageCircle className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden"
            style={{ height: "520px" }}
            role="dialog"
            aria-modal="true"
            aria-label="AI Voter Assistant"
          >
            {/* Header */}
            <div className="bg-primary-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{t("title")}</div>
                  <div className="text-white/70 text-xs">{t("subtitle")}</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
                aria-label="Close AI assistant"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" role="log" aria-live="polite" aria-label="Chat messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-primary-700 dark:text-primary-400" aria-hidden="true" />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary-700 text-white rounded-tr-sm"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                  )}>
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" aria-hidden="true" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-primary-700" aria-hidden="true" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1" aria-label={t("thinking")}>
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                          className="w-2 h-2 bg-slate-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {suggestions.slice(0, 3).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-700 px-2.5 py-1 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2 flex-shrink-0">
              <button
                onClick={handleVoiceInput}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex-shrink-0"
                aria-label="Voice input"
              >
                <Mic className="w-4 h-4" aria-hidden="true" />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder={t("placeholder")}
                className="flex-1 text-sm bg-slate-100 dark:bg-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
                aria-label={t("placeholder")}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary-700 text-white hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                aria-label={t("send")}
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
