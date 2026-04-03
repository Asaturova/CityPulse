"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X, Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { answerCityQuestion, evaluateProactiveState, type ChatMessage } from "@/services/chatService";
import type { AirQualityData, DistrictData, Locale, WeatherData } from "@/types/city";
import { t } from "@/utils/i18n";

export function CityChat({
  locale,
  weather,
  air,
  districts,
}: {
  locale: Locale;
  weather: WeatherData;
  air: AirQualityData;
  districts: DistrictData[];
}) {
  const i18n = t(locale);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: i18n.chatWelcome,
    },
  ]);

  // Proactive evaluation
  useEffect(() => {
    const proactiveAlert = evaluateProactiveState({ locale, weather, air, districts });
    if (proactiveAlert) {
      setMessages((prev) => {
        // Prevent spamming the same alert
        const lastMsg = prev[prev.length - 1];
        if (lastMsg?.text === proactiveAlert) return prev;
        
        return [...prev, {
          id: `proactive-${Date.now()}`,
          role: "system",
          text: proactiveAlert
        }];
      });
      // Optionally open chat automatically if a critical alert arrives
      setOpen(true);
    }
  }, [locale, weather, air, districts]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    
    setInput("");
    const rid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    
    const userMsg: ChatMessage = { id: rid(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate network delay for AI realism
    setTimeout(() => {
      const reply = answerCityQuestion(text, messages, { locale, weather, air, districts });
      const botMsg: ChatMessage = { id: rid(), role: "assistant", text: reply };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 1000);
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[55] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="pointer-events-auto flex h-[min(70vh,420px)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-cyan-500/20 bg-zinc-950/80 shadow-[0_0_40px_rgba(34,211,238,0.15)] backdrop-blur-2xl ring-1 ring-white/10"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Bot className="size-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">{i18n.chatTitle}</p>
                  <p className="text-[11px] text-zinc-400">{i18n.chatSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 scroll-smooth">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={
                    m.role === "user"
                      ? "ml-8 rounded-2xl rounded-br-sm bg-cyan-500/20 px-3.5 py-2.5 text-sm text-cyan-50 shadow-sm border border-cyan-500/20"
                      : m.role === "system"
                      ? "mx-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-[13px] font-medium text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                      : "mr-8 rounded-2xl rounded-bl-sm border border-white/5 bg-white/5 px-3.5 py-2.5 text-sm text-zinc-200 shadow-sm"
                  }
                >
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="mr-12 rounded-2xl rounded-bl-sm border border-white/5 bg-white/5 px-4 py-3 text-zinc-400 w-fit">
                   <div className="flex gap-1.5">
                     <span className="size-1.5 rounded-full bg-cyan-400/60 animate-bounce [animation-delay:-0.3s]"></span>
                     <span className="size-1.5 rounded-full bg-cyan-400/60 animate-bounce [animation-delay:-0.15s]"></span>
                     <span className="size-1.5 rounded-full bg-cyan-400/60 animate-bounce"></span>
                   </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 border-t border-white/10 bg-white/5 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={i18n.chatPlaceholder}
                className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-cyan-500/50 focus:bg-black/60 focus:ring-1 focus:ring-cyan-500/20"
              />
              <button
                type="button"
                onClick={send}
                disabled={!input.trim() || isTyping}
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.35)] transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                aria-label="Send"
              >
                <Send className="size-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto relative grid size-[60px] place-items-center rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 text-cyan-50 shadow-[0_0_40px_rgba(34,211,238,0.4)] backdrop-blur-xl"
        aria-label={i18n.chatTitle}
      >
        <MessageCircle className="size-7" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border border-black cursor-pointer"></span>
        </span>
      </motion.button>
    </div>
  );
}
