import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TrackType, ExperienceLevel } from '../types';
import { Sparkles, ArrowRight, Check, Target, Code, Cpu, Layers } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const { updateUserOnboarding, user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [track, setTrack] = useState<TrackType>(user?.track || 'fullstack');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(user?.experienceLevel || 'beginner');
  const [goal, setGoal] = useState<string>(user?.primaryGoal || 'Build daily consistency and prepare for a full-stack engineering role');

  if (!isOpen) return null;

  const handleFinish = () => {
    updateUserOnboarding(track, experienceLevel, goal);
    onComplete();
    onClose();
  };

  const tracks: { id: TrackType; title: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'fullstack', title: 'Full-Stack Web', desc: 'React, Node.js, Express, state, APIs & capstones', icon: <Layers className="w-5 h-5 text-indigo-600" /> },
    { id: 'frontend', title: 'Frontend Engineering', desc: 'DOM, React, UI performance, accessibility & CSS', icon: <Code className="w-5 h-5 text-blue-600" /> },
    { id: 'backend', title: 'Backend Systems', desc: 'Node, Express, APIs, validation, auth & caching', icon: <Cpu className="w-5 h-5 text-emerald-600" /> },
    { id: 'ai', title: 'AI & Applied Software', desc: 'Full-stack integrations, LLM prompts & AI tools', icon: <Sparkles className="w-5 h-5 text-purple-600" /> }
  ];

  const levels: { id: ExperienceLevel; label: string; desc: string }[] = [
    { id: 'beginner', label: 'Beginner', desc: 'I know basic HTML/JS and want clear guidance.' },
    { id: 'intermediate', label: 'Intermediate', desc: 'I write code but want architectural consistency.' },
    { id: 'advanced', label: 'Advanced', desc: 'I build apps and want to master tradeoffs & edge cases.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg my-auto max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Step {step} of 3</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-6 h-1 rounded-full transition-colors ${
                    step >= s ? 'bg-indigo-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mt-2">
            {step === 1 && "What track do you want to master?"}
            {step === 2 && "How comfortable are you with coding?"}
            {step === 3 && "What is your primary 60-day goal?"}
          </h2>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">Select your focus track for the 60-day challenge:</p>
              <div className="grid grid-cols-1 gap-2.5">
                {tracks.map((t) => {
                  const selected = track === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTrack(t.id)}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        selected
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs mt-0.5">
                        {t.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sm text-slate-900">{t.title}</p>
                          {selected && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">Your level helps the AI Mentor tailor hints and explanations:</p>
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
                        <p className="font-bold text-sm text-slate-900">{l.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{l.desc}</p>
                      </div>
                      {selected && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-medium">Define your core objective for this 60-day sprint:</p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Goal Statement
                </label>
                <textarea
                  rows={3}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                  placeholder="e.g., Build a complete full-stack portfolio to prepare for internship interviews"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
                <Target className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <span>
                  By completing 1 challenge per day, you will build 60 distinct projects and verified proof of work.
                </span>
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

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-2xs flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-2xs flex items-center gap-1.5"
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
