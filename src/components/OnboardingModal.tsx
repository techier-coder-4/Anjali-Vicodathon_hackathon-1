import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TrackType, ExperienceLevel } from '../types';
import { Sparkles, ArrowRight, Check, Target, Code, Cpu, Layers, Terminal, Brain, Shield, Clock } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const { updateUserOnboarding, user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [track, setTrack] = useState<TrackType>(user?.track || 'frontend');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(user?.experienceLevel || 'beginner');
  const [timeGoal, setTimeGoal] = useState<string>(user?.dailyTimeGoal || '30 mins');
  const [goal, setGoal] = useState<string>(user?.primaryGoal || 'Build daily consistency and prepare for software engineering roles');

  if (!isOpen) return null;

  const handleFinish = () => {
    updateUserOnboarding(track, experienceLevel, goal, user?.college, user?.graduationYear, timeGoal);
    onComplete();
    onClose();
  };

  const tracks: { id: TrackType; title: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'frontend', title: 'Frontend Engineering', desc: 'React 18, TypeScript, Tailwind CSS, Next.js, Web Performance', icon: <Code className="w-5 h-5 text-blue-600" /> },
    { id: 'backend', title: 'Backend Systems', desc: 'Node.js, Express, PostgreSQL, Redis, REST APIs, System Architecture', icon: <Cpu className="w-5 h-5 text-emerald-600" /> },
    { id: 'fullstack', title: 'Full-Stack Web', desc: 'End-to-End React + Node.js, Databases, Authentication & Capstones', icon: <Layers className="w-5 h-5 text-purple-600" /> },
    { id: 'python', title: 'Python Development', desc: 'Core Python 3.12, Data Structures, FastAPI, Automation & Scraping', icon: <Terminal className="w-5 h-5 text-amber-600" /> },
    { id: 'data-ai', title: 'Data & AI Engineering', desc: 'Pandas, PyTorch, Vector DBs, Gemini API, RAG & Model Deployment', icon: <Brain className="w-5 h-5 text-rose-600" /> },
    { id: 'java', title: 'Java Engineering', desc: 'Java 21, OOP, Collections, Concurrency, Spring Boot 3, JPA', icon: <Code className="w-5 h-5 text-indigo-600" /> },
    { id: 'cybersecurity', title: 'Cybersecurity', desc: 'Linux CLI, Networking, OWASP Top 10, Burp Suite, DevSecOps', icon: <Shield className="w-5 h-5 text-red-600" /> }
  ];

  const levels: { id: ExperienceLevel; label: string; desc: string }[] = [
    { id: 'beginner', label: 'Beginner', desc: 'I know basic concepts and want step-by-step hands-on guidance.' },
    { id: 'intermediate', label: 'Intermediate', desc: 'I write code regularly and want architectural depth & habit consistency.' },
    { id: 'advanced', label: 'Advanced', desc: 'I build projects and want to master production edge cases & tradeoffs.' }
  ];

  const timeCommitments = [
    { label: '20 Mins / Day', desc: 'Focused daily sprint for busy students' },
    { label: '30 Mins / Day', desc: 'Recommended balance for steady progress' },
    { label: '45 Mins / Day', desc: 'Deep learning with extra curiosity explorations' },
    { label: '60+ Mins / Day', desc: 'Accelerated mastery with complete capstones' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg my-auto max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Step {step} of 4</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-5 h-1 rounded-full transition-colors ${
                    step >= s ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mt-2">
            {step === 1 && `Welcome, ${user?.name || 'Student'}!`}
            {step === 2 && "What track do you want to master?"}
            {step === 3 && "What is your current coding level?"}
            {step === 4 && "Daily time commitment?"}
          </h2>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100 shadow-2xs">
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">Your 60-Day Consistency Engine</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  ABTalks is designed to transform daily practice into real engineering proof-of-work. In 4 quick steps, personalized setup takes 30 seconds.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 text-left">
                  Primary 60-Day Goal Statement
                </label>
                <textarea
                  rows={2}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                  placeholder="e.g. Build daily habits and a verified GitHub portfolio"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">Select your specialized learning track for the 60 days:</p>
              <div className="grid grid-cols-1 gap-2 max-h-[320px] overflow-y-auto pr-1">
                {tracks.map((t) => {
                  const selected = track === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTrack(t.id)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        selected
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs mt-0.5 shrink-0">
                        {t.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-xs text-slate-900">{t.title}</p>
                          {selected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">{t.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">Your experience level helps the AI Mentor tailor explanations:</p>
              <div className="space-y-2.5">
                {levels.map((l) => {
                  const selected = experienceLevel === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setExperienceLevel(l.id)}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selected
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-xs text-slate-900">{l.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{l.desc}</p>
                      </div>
                      {selected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">Choose a realistic daily target commitment:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {timeCommitments.map((tc) => {
                  const selected = timeGoal === tc.label;
                  return (
                    <button
                      key={tc.label}
                      onClick={() => setTimeGoal(tc.label)}
                      className={`p-3.5 rounded-xl border text-left space-y-1 transition-all ${
                        selected
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          {tc.label}
                        </span>
                        {selected && <Check className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">{tc.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-gray-200/60 rounded-xl transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-2xs flex items-center gap-1.5 min-h-[38px]"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-2xs flex items-center gap-1.5 min-h-[38px]"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Launch My 60-Day Journey</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
