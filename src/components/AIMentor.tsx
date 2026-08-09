import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Challenge, AIMessage } from '../types';
import { Bot, Send, Sparkles, AlertTriangle, X, MessageSquare, ChevronDown } from 'lucide-react';

interface AIMentorProps {
  challenge: Challenge;
}

export const AIMentor: React.FC<AIMentorProps> = ({ challenge }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init_msg',
      sender: 'mentor',
      text: `👋 Hi ${user?.name || 'Student'}! I'm your ABTalks Mentor for Day ${challenge.dayId}: **"${challenge.title}"**.\n\n` +
            `How can I guide your thinking today? Ask me to explain the core concept, request a progressive hint, or walk through step 1 together!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isOpen]);

  // Reset messages if challenge changes
  useEffect(() => {
    setMessages([
      {
        id: `init_msg_${challenge.dayId}`,
        sender: 'mentor',
        text: `👋 Hi ${user?.name || 'Student'}! I'm your ABTalks Mentor for Day ${challenge.dayId}: **"${challenge.title}"**.\n\n` +
              `How can I guide your thinking today? Ask me to explain the core concept, request a progressive hint, or walk through step 1 together!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [challenge.dayId, user?.name, challenge.title]);

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = (textToSend || inputPrompt).trim();
    if (!promptText || loading) return;

    const userMsg: AIMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayId: challenge.dayId,
          prompt: promptText,
          userLevel: user?.experienceLevel || 'beginner',
          challengeTitle: challenge.title,
          challengeType: challenge.challengeType,
          learningObjective: challenge.learningObjective,
          whyItMatters: challenge.whyItMatters,
          requirements: challenge.requirements,
          curiosityPrompt: challenge.curiosityPrompt,
          stageName: challenge.stageName
        })
      });

      const data = await res.json();

      const mentorMsg: AIMessage = {
        id: `mentor_${Date.now()}`,
        sender: 'mentor',
        text: data.text || "I'm here to help you reason through today's challenge!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: data.isFallback
      };

      setMessages((prev) => [...prev, mentorMsg]);
    } catch (err) {
      console.error('Error contacting AI mentor service:', err);
      // Fallback message
      const fallbackMsg: AIMessage = {
        id: `mentor_fallback_${Date.now()}`,
        sender: 'mentor',
        text: `💡 **ABTalks Guided Mode**\n\nAI Mentor is temporarily operating in Guided Mode for Day ${challenge.dayId}:\n\n` +
              `**Why it matters:** ${challenge.whyItMatters}\n\n` +
              `**What you'll learn:** ${challenge.learningObjective}\n\n` +
              `**Start Here:** Break down requirement #1: "${challenge.requirements[0] || 'Set up basic code structure'}"\n\n` +
              `**Think About This:** *"${challenge.curiosityPrompt}"*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: true
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Explain simply', prompt: 'Explain today\'s concept simply with a real-world mental model.' },
    { label: 'Give a progressive hint', prompt: 'Give me a subtle progressive hint for step 1 without writing the complete code solution.' },
    { label: 'Why does this matter?', prompt: 'Why is this challenge crucial for real-world software engineering?' },
    { label: 'Curiosity challenge', prompt: `Let's discuss today's curiosity prompt: "${challenge.curiosityPrompt}"` }
  ];

  // Render Inner Chat Body (Shared between Desktop Card & Mobile Bottom Sheet)
  const renderChatBody = (isMobileSheet = false) => (
    <>
      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 break-words overflow-hidden ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-xs shadow-2xs'
                    : msg.isFallback
                    ? 'bg-amber-50 text-slate-900 border border-amber-300/80 rounded-tl-xs shadow-2xs'
                    : 'bg-white text-slate-800 border border-gray-200/80 rounded-tl-xs shadow-2xs'
                }`}
              >
                {!isUser && msg.isFallback && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded w-fit">
                    <AlertTriangle className="w-3 h-3 text-amber-700" />
                    <span>ABTalks Guided Mode Active</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap font-normal">{msg.text}</div>
              </div>

              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-800 font-medium bg-white p-3 rounded-2xl border border-gray-200 w-fit shadow-2xs">
            <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
            <span>Mentor is thinking... (UNDERSTAND → GUIDANCE)</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(qp.prompt)}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold whitespace-nowrap transition-colors shrink-0 disabled:opacity-50 min-h-[36px]"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className={`p-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0 ${isMobileSheet ? 'sticky bottom-0' : ''}`}>
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={`Ask mentor about Day ${challenge.dayId}...`}
          disabled={loading}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all min-h-[44px]"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={loading || !inputPrompt.trim()}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all disabled:opacity-50 shrink-0 shadow-2xs min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Send message to mentor"
        >
          <Send className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* 1. DESKTOP PANEL (Visible on lg screens) */}
      <div className="hidden lg:flex bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex-col h-[580px]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>ABTalks AI Mentor</span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 uppercase">
                  Grounded
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Day {challenge.dayId}: {challenge.title}</p>
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-400">
            <span className="capitalize font-semibold text-indigo-300">{user?.experienceLevel || 'Beginner'} Mode</span>
          </div>
        </div>

        {renderChatBody(false)}
      </div>

      {/* 2. MOBILE FLOATING ACTION BUTTON (Visible on < lg screens) */}
      <div className="lg:hidden fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end gap-2">
        {/* Tooltip Popup on First Load */}
        {showTooltip && !isOpen && (
          <div className="bg-slate-900 text-white text-xs px-3.5 py-2 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 max-w-[240px] animate-bounce-subtle">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold leading-tight">Need help with Day {challenge.dayId}?</span>
            <button
              onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
              className="p-1 text-slate-400 hover:text-white rounded-full min-h-[32px] min-w-[32px] flex items-center justify-center shrink-0"
              aria-label="Dismiss tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          onClick={() => { setIsOpen(true); setShowTooltip(false); }}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl border border-slate-700 transition-all active:scale-95 min-h-[48px]"
          aria-label="Open AI Mentor"
        >
          <div className="relative shrink-0">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-tight leading-none flex items-center gap-1">
              <span>AI Mentor</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-500/40 text-indigo-200 uppercase">
                Day {challenge.dayId}
              </span>
            </span>
            <span className="text-[10px] text-slate-300 font-medium leading-none mt-1">Ask questions & hints</span>
          </div>
        </button>
      </div>

      {/* 3. MOBILE BOTTOM SHEET DRAWER (Visible when isOpen on < lg screens) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Container */}
          <div className="relative z-10 w-full h-[80vh] max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col border-t border-slate-200 overflow-hidden pb-safe">
            {/* Top Handle Indicator */}
            <div className="bg-slate-900 pt-2 pb-1 text-center shrink-0 cursor-pointer" onClick={() => setIsOpen(false)}>
              <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto" />
            </div>

            {/* Drawer Header */}
            <div className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 truncate">
                    <span>ABTalks AI Mentor</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 uppercase shrink-0">
                      Grounded
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">Day {challenge.dayId}: {challenge.title}</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
                aria-label="Close AI Mentor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {renderChatBody(true)}
          </div>
        </div>
      )}
    </>
  );
};

