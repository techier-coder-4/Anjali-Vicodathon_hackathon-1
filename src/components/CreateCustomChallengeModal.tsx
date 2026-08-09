import React, { useState } from 'react';
import { X, Sparkles, Target, Clock, Award, CheckCircle2, ArrowRight, ArrowLeft, Bot, AlertCircle } from 'lucide-react';
import { ExperienceLevel } from '../types';
import { CustomChallengeService } from '../services/customChallengeService';
import { useAuth } from '../context/AuthContext';

interface CreateCustomChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PRESET_GOALS = [
  { id: 'frontend', category: 'Frontend', title: 'Become a Frontend Developer', icon: '🎨', desc: 'HTML, CSS, JS, DOM, React, Tailwind & Web Performance' },
  { id: 'backend', category: 'Backend', title: 'Learn Backend Development', icon: '⚙️', desc: 'Node.js, Express, REST APIs, Databases, Auth & Architecture' },
  { id: 'python', category: 'Python', title: 'Become Job-Ready in Python', icon: '🐍', desc: 'Core Python, OOP, Automation, FastAPI, Web Scraping & Projects' },
  { id: 'fullstack', category: 'Full Stack', title: 'Build Full Stack Applications', icon: '⚡', desc: 'Frontend + Backend + DB integration + Deployment' },
  { id: 'data-ai', category: 'Data & AI', title: 'Build AI & ML Projects', icon: '🤖', desc: 'Python, Pandas, Visualizations, AI APIs & GenAI Apps' },
  { id: 'java', category: 'Java', title: 'Learn Java & Spring Boot', icon: '☕', desc: 'Core Java, OOP, Collections, Multithreading & REST APIs' },
  { id: 'cybersecurity', category: 'Cybersecurity', title: 'Learn Cybersecurity Basics', icon: '🛡️', desc: 'Linux, Networking, OWASP Top 10, Web Security & Defense' },
  { id: 'interviews', category: 'Custom', title: 'Prepare for Technical Interviews', icon: '🎯', desc: 'DS & Algo concepts, System Design, Problem Solving & Projects' },
  { id: 'custom', category: 'Custom', title: 'Something Else (Custom Goal)', icon: '✨', desc: 'Define your own unique learning target and milestone' }
];

export const CreateCustomChallengeModal: React.FC<CreateCustomChallengeModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Form states
  const [selectedPreset, setSelectedPreset] = useState<string>('frontend');
  const [customGoalTitle, setCustomGoalTitle] = useState('');
  const [level, setLevel] = useState<ExperienceLevel>('beginner');
  const [timeGoal, setTimeGoal] = useState('30 minutes');
  const [finalOutcome, setFinalOutcome] = useState('');

  if (!isOpen) return null;

  const currentPreset = PRESET_GOALS.find(p => p.id === selectedPreset);
  const finalTitle = selectedPreset === 'custom'
    ? (customGoalTitle.trim() || 'Custom 60-Day Technical Mastery')
    : (currentPreset?.title || 'My 60-Day Challenge');

  const handleGenerateRoadmap = async () => {
    if (!user) return;
    setLoading(true);
    setErrorNotice(null);

    try {
      const category = currentPreset?.category || 'Custom';
      const result = await CustomChallengeService.createCustomChallenge(user.id, {
        goalTitle: finalTitle,
        category,
        experienceLevel: level,
        dailyTimeGoal: timeGoal,
        finalOutcome: finalOutcome.trim() || `Master ${finalTitle} through daily 60-day consistent practice.`
      });

      if (result.isFallback) {
        setErrorNotice("AI API is temporarily in starter mode. We've prepared a high-quality starter roadmap for you so you can begin immediately!");
      }

      setTimeout(() => {
        setLoading(false);
        onSuccess();
        onClose();
      }, result.isFallback ? 1200 : 800);
    } catch (e: any) {
      setLoading(false);
      setErrorNotice('Failed to create roadmap. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Build Your Own 60-Day Challenge</span>
              </h2>
              <p className="text-xs text-slate-400">Step {step} of 5 — Customized AI Learning Journey</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 shrink-0">
          <div
            className="bg-indigo-600 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {errorNotice && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* STEP 1: Goal Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">What do you want to achieve in 60 days?</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select a primary focus area or define your own custom target goal.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_GOALS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                      selectedPreset === preset.id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{preset.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 truncate">{preset.title}</div>
                      <div className="text-[11px] text-slate-500 leading-snug line-clamp-2 mt-0.5">{preset.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedPreset === 'custom' && (
                <div className="mt-3 space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Your Custom Goal Title</label>
                  <input
                    type="text"
                    value={customGoalTitle}
                    onChange={(e) => setCustomGoalTitle(e.target.value)}
                    placeholder="e.g. Master Rust for Systems Programming or Build 5 Flutter Apps"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Current Skill Level */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">What is your current experience level with this topic?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This helps the AI tailor explanations and exercise complexity.</p>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'beginner', label: 'Beginner', desc: 'Starting from scratch or zero prior knowledge. Need step-by-step guidance.' },
                  { id: 'intermediate', label: 'Intermediate', desc: 'Know fundamental syntax & concepts. Looking to build real functional projects.' },
                  { id: 'advanced', label: 'Advanced', desc: 'Comfortable coder. Looking for architecture, edge cases, and optimization challenges.' }
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setLevel(lvl.id as ExperienceLevel)}
                    className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                      level === lvl.id
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">{lvl.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{lvl.desc}</div>
                    </div>
                    {level === lvl.id && <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 ml-3" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Time Available Per Day */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">How much time can you commit daily?</h3>
                <p className="text-xs text-slate-500 mt-0.5">Consistency beats intensity. Choose a manageable daily commitment.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { time: '20 minutes', desc: 'Quick bite-sized daily exercises' },
                  { time: '30 minutes', desc: 'Balanced focus & building time' },
                  { time: '45 minutes', desc: 'Deep-dive practice & component design' },
                  { time: '60+ minutes', desc: 'Intensive building & full feature dev' }
                ].map((t) => (
                  <button
                    key={t.time}
                    onClick={() => setTimeGoal(t.time)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      timeGoal === t.time
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span>{t.time}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Final Outcome / Target */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">What is your target final outcome after 60 days?</h3>
                <p className="text-xs text-slate-500 mt-0.5">Describe what success looks like when you complete this challenge.</p>
              </div>

              <div className="space-y-3">
                <textarea
                  rows={4}
                  value={finalOutcome}
                  onChange={(e) => setFinalOutcome(e.target.value)}
                  placeholder="e.g. I want to build 3 real-world frontend applications, publish them on GitHub, and feel confident applying for junior developer roles."
                  className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                />

                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-indigo-950 text-xs space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Selected Target Summary</span>
                  </span>
                  <p className="text-[11px] text-slate-600">
                    <strong>Goal:</strong> {finalTitle} • <strong>Level:</strong> {level} • <strong>Commitment:</strong> {timeGoal}/day
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Confirm & Generate Roadmap */}
          {step === 5 && (
            <div className="space-y-5 text-center py-2">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
                <Bot className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">Ready to Generate Your 60-Day Roadmap!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  Our AI Mentor will generate a structured, progressive 60-day curriculum tailored specifically to your goal and daily time limit.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Goal:</span>
                  <span className="font-bold text-slate-900">{finalTitle}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Target Outcome:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[200px]">{finalOutcome || 'Real-World Mastery'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Daily Commitment:</span>
                  <span className="font-bold text-slate-900">{timeGoal} / day</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold inline-flex items-center gap-1.5 transition-all min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-all min-h-[44px]"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerateRoadmap}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-md transition-all disabled:opacity-50 min-h-[44px]"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Generating 60-Day Roadmap...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate My Roadmap</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
