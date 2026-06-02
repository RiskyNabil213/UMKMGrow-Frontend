"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ArrowLeft, Sparkles, Plus, Zap, Crown, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/UserContext";
import { generateAIResponse } from "@/lib/ai-engine";

const FREE_TOKEN_LIMIT = 10;

interface Message { role: "ai" | "user"; text: string; }

const SUGGESTED = [
  "Bagaimana cara meningkatkan penjualan?",
  "Tips kelola keuangan UMKM",
  "Strategi promosi di Instagram & TikTok",
  "Cara negosiasi dengan supplier",
  "Cara hitung harga jual yang tepat",
];

export default function AIChatPage() {
    const { isPremium, user } = useAuth();

  // Key token unik per user — setiap akun punya token sendiri
  const tokenKey = user ? `ai_token_${user.id}` : null;

  const [messages, setMessages] = useState<Message[]>([{
    role: "ai",
    text: "Halo! Saya UMKM AI Assistant 👋 Saya siap membantu kamu mengembangkan bisnis — mulai dari strategi pemasaran, keuangan, hingga ide produk baru. Ada yang bisa saya bantu hari ini?",
  }]);
  const [input,    setInput]    = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Baca token dari localStorage berdasarkan user ID
  const [token, setToken] = useState<number>(() => {
    if (typeof window === "undefined" || !user) return FREE_TOKEN_LIMIT;
    const key   = `ai_token_${user.id}`;
    const saved = localStorage.getItem(key);
    // Jika belum pernah ada record untuk user ini → 10 penuh
    return saved !== null ? Number(saved) : FREE_TOKEN_LIMIT;
  });

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Saat user berganti (login akun lain) — muat ulang token milik user itu
  useEffect(() => {
    if (!user) return;
    const key   = `ai_token_${user.id}`;
    const saved = localStorage.getItem(key);
    setToken(saved !== null ? Number(saved) : FREE_TOKEN_LIMIT);
  }, [user?.id]);

  // Simpan token ke localStorage setiap berubah, dikaitkan ke user ID
  useEffect(() => {
    if (!isPremium && tokenKey) {
      localStorage.setItem(tokenKey, String(token));
    }
  }, [token, isPremium, tokenKey]);

  const canSend = isPremium || token > 0;

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !canSend) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    if (!isPremium) setToken((t) => t - 1);
    setIsTyping(true);

    const delay = 1000 + Math.random() * 800;
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "ai", text: generateAIResponse(trimmed) }]);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const handleNewChat = () => {
    setMessages([{ role: "ai", text: "Halo! Saya UMKM AI Assistant 👋 Saya siap membantu kamu mengembangkan bisnis. Ada yang bisa saya bantu hari ini?" }]);
    setInput(""); setIsTyping(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-8 h-8 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
            <ArrowLeft size={16} className="text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Bot size={22} className="text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <h2 className="font-black text-gray-800 text-sm leading-tight">UMKM AI Assistant</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Online</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Token indicator */}
          {!isPremium && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
              token > 3 ? "bg-indigo-50 text-indigo-600" : token > 0 ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-500"
            }`}>
              <Zap size={12} />
              {token} token tersisa
            </div>
          )}
          {isPremium && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-yellow-50 text-yellow-600">
              <Crown size={12} /> Unlimited
            </div>
          )}
          <button onClick={handleNewChat} className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all">
            <Plus size={14} /> Chat Baru
          </button>
        </div>
      </div>

      {/* Suggested */}
      <div className="px-6 py-3 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2 overflow-x-auto shrink-0">
        <Zap size={13} className="text-indigo-400 shrink-0" />
        {SUGGESTED.map((q, i) => (
          <button key={i} onClick={() => sendMessage(q)} disabled={!canSend}
            className="whitespace-nowrap text-xs font-semibold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed">
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-slate-50/40">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 self-end ${
                msg.role === "user" ? "bg-gray-200" : "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-100"
              }`}>
                {msg.role === "user" ? <User size={15} className="text-gray-600" /> : <Sparkles size={15} className="text-white" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-100">
                <Sparkles size={15} className="text-white" />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input / Token habis */}
      <div className="px-6 py-4 bg-white border-t border-gray-100 shrink-0">
        {!canSend ? (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <Lock size={16} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-800">10 token gratis habis</p>
                <p className="text-xs text-amber-500">Upgrade Premium untuk chat tanpa batas unlimited</p>
              </div>
            </div>
            <Link href="/upgrade">
              <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors whitespace-nowrap">
                <Crown size={13} /> Upgrade
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Tanyakan apa saja tentang usahamu..."
                className="flex-1 bg-gray-50 text-gray-900 border border-gray-200 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all" />
              <button onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}
                className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
                <Send size={18} />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-3">
              {isPremium
                ? "Premium — chat tanpa batas ✨"
                : token > 0
                  ? `${token} dari ${FREE_TOKEN_LIMIT} token gratis tersisa · Upgrade untuk unlimited`
                  : "Token habis"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
