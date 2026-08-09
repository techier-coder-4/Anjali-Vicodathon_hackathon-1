import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentPersona, TrackType, ExperienceLevel } from '../types';
import { DEMO_USERS } from '../data/demoUsers';
import { X, Sparkles, LogIn, UserPlus, Zap } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, signUp, switchPersona } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  // Login state
  const [email, setEmail] = useState('');

  // Signup state
  const [name, setName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [track, setTrack] = useState<TrackType>('fullstack');
  const [level, setLevel] = useState<ExperienceLevel>('beginner');
  const [goal, setGoal] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(email.trim());
    onSuccess();
    onClose();
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !signUpEmail.trim()) return;
    signUp(name.trim(), signUpEmail.trim(), track, level, goal || 'Build consistent technical skills for 60 days');
    onSuccess();
    onClose();
  };

  const handleQuickDemoSelect = (personaKey: StudentPersona) => {
    switchPersona(personaKey);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md my-auto max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-white">ABTalks Account Sign In</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              tab === 'login' ? 'border-slate-900 text-slate-900 bg-white font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              tab === 'signup' ? 'border-slate-900 text-slate-900 bg-white font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create New Account
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@abtalks.dev"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-2xs flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Sign In to Dashboard</span>
              </button>

              {/* DEMO ACCOUNTS QUICK ACCESS */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                  Judge Demo Instant Login
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoSelect('new')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-left space-y-0.5 transition-colors"
                  >
                    <p className="font-bold text-xs text-slate-900">New Student</p>
                    <p className="text-[10px] text-slate-500">Day 1 • Onboarding</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoSelect('active')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-left space-y-0.5 transition-colors"
                  >
                    <p className="font-bold text-xs text-slate-900">Active Student</p>
                    <p className="text-[10px] text-slate-500">Day 17 • 16d Streak</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoSelect('inconsistent')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-left space-y-0.5 transition-colors"
                  >
                    <p className="font-bold text-xs text-slate-900">Inconsistent</p>
                    <p className="text-[10px] text-slate-500">Day 23 • Recovery</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoSelect('completed')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-left space-y-0.5 transition-colors"
                  >
                    <p className="font-bold text-xs text-slate-900">Completed</p>
                    <p className="text-[10px] text-slate-500">Day 60 • Graduate</p>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="alex@student.dev"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Track</label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value as TrackType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white"
                  >
                    <option value="fullstack">Full-Stack Web</option>
                    <option value="frontend">Frontend Eng</option>
                    <option value="backend">Backend Systems</option>
                    <option value="ai">AI Applied</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Experience</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as ExperienceLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Goal</label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Build daily habits for 60 days"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account & Start Day 1</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
