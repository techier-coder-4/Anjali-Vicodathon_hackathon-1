import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Challenge, AIMessage } from '../types';
import { Bot, Send, Sparkles, HelpCircle, Code, Lightbulb, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AIMentorProps {
  challenge: Challenge;
}

export const AIMentor: React.FC<AIMentorProps> = ({ challenge }) => {
  const { user } = useAuth();
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[580px]">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between">
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
                className={`max-w-[90%] sm:max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 break-words overflow-hidden ${
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
            <span>Mentor is thinking... (UNDERSTAND → THINK → GUIDANCE)</span>
          </div>
        )}
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(qp.prompt)}
            disabled={loading}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={`Ask mentor about Day ${challenge.dayId} concept or hint...`}
          disabled={loading}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={loading || !inputPrompt.trim()}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all disabled:opacity-50 shrink-0 shadow-2xs"
        >
          <Send className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
