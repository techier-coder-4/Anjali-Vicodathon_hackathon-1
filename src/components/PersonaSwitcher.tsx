import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentPersona } from '../types';
import { UserCheck, Zap, AlertCircle, Award, SlidersHorizontal, X } from 'lucide-react';

interface PersonaSwitcherProps {
  onPersonaSwitched?: () => void;
}

export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({ onPersonaSwitched }) => {
  const { persona, switchPersona, user } = useAuth();
  
  // Dev mode is active if URL contains ?dev=true or ?debug=true or localStorage is set
  const [isDevMode, setIsDevMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('dev') || urlParams.has('debug') || localStorage.getItem('abtalks_dev_mode') === 'true';
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle dev mode with Alt + Shift + D
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        setIsDevMode((prev) => {
          const next = !prev;
          localStorage.setItem('abtalks_dev_mode', next ? 'true' : 'false');
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isDevMode) {
    return null; // Hidden in standard student mode
  }

  const personas: { id: StudentPersona; label: string; sub: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'new',
      label: 'Aarav (New)',
      sub: 'Day 1 • Onboarding',
      icon: <UserCheck className="w-3.5 h-3.5" />,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
    },
    {
      id: 'active',
      label: 'Ananya (Active)',
      sub: 'Day 12 • 7d Streak',
      icon: <Zap className="w-3.5 h-3.5" />,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200'
    },
    {
      id: 'inconsistent',
      label: 'Rahul (Inconsistent)',
      sub: 'Day 23 • Recovery',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200'
    },
    {
      id: 'completed',
      label: 'Meera (Graduate)',
      sub: 'Day 60 • Completed',
      icon: <Award className="w-3.5 h-3.5" />,
      color: 'bg-purple-500/10 text-purple-600 border-purple-200'
    }
  ];

  if (!isExpanded) {
    return (
      <div className="bg-slate-900 text-white px-3 py-1.5 border-b border-slate-800 text-[11px]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded text-[10px]">DEV TOOL</span>
            <span className="text-slate-300">Active Persona: <strong className="text-white">{user?.name} ({persona})</strong></span>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px] underline"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Switch Persona</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <span className="bg-indigo-600/30 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-500/30 uppercase tracking-wider">
            Judge Persona Switcher
          </span>
          <span className="hidden md:inline text-slate-400">Active persona:</span>
          <span className="font-semibold text-white">{user?.name} ({persona})</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto pb-1 sm:pb-0 shrink-0">
          {personas.map((p) => {
            const isActive = persona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  switchPersona(p.id);
                  if (onPersonaSwitched) onPersonaSwitched();
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
                title={`Switch to ${p.label}`}
              >
                {p.icon}
                <span>{p.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 text-slate-400 hover:text-white ml-1"
            title="Minimize Persona Switcher"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

