import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Flame, LayoutDashboard, Compass, User as UserIcon, LogOut, Menu, X, Rocket, Sparkles, BookOpen, Layers, Target, HelpCircle } from 'lucide-react';

interface NavbarProps {
  currentTab: 'landing' | 'dashboard' | 'journey' | 'profile' | 'challenge';
  setCurrentTab: (tab: 'landing' | 'dashboard' | 'journey' | 'profile' | 'challenge') => void;
  openAuthModal: () => void;
  selectedDayForView?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openAuthModal
}) => {
  const { user, progress, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (currentTab !== 'landing') {
      setCurrentTab('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const authenticatedNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'journey', label: '60-Day Journey', icon: <Compass className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-4 h-4" /> }
  ] as const;

  const publicNavItems = [
    { id: 'how-it-works', label: 'How It Works', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'challenge', label: '60-Day Challenge', icon: <Target className="w-4 h-4" /> },
    { id: 'tracks', label: 'Tracks', icon: <Layers className="w-4 h-4" /> },
    { id: 'why-abtalks', label: 'Why ABTalks', icon: <HelpCircle className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentTab(user ? (user.onboardingCompleted ? 'dashboard' : 'dashboard') : 'landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs group-hover:bg-slate-800 transition-colors">
                <Rocket className="w-4.5 h-4.5 text-amber-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-slate-900">ABTalks</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider hidden sm:inline-block">
                  60-Day
                </span>
              </div>
            </button>

            {/* Navigation Links based on Auth state */}
            {user ? (
              <nav className="hidden md:flex items-center gap-1">
                {authenticatedNavItems.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentTab(item.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-slate-100 text-slate-900'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            ) : (
              <nav className="hidden md:flex items-center gap-1">
                {publicNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            )}
          </div>

          {/* Right Side: User Status / Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Streak Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-extrabold">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>{progress.currentStreak}d Streak</span>
                </div>

                {/* Profile Trigger */}
                <button
                  onClick={() => setCurrentTab('profile')}
                  className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                  <div className="text-left leading-tight hidden lg:block pr-1">
                    <p className="text-xs font-extrabold text-slate-900">{user.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user.track}</p>
                  </div>
                </button>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={openAuthModal}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={openAuthModal}
                  className="flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-2xs transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Start Your 60-Day Journey</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Right Area */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>{progress.currentStreak}d</span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {user ? (
            <div className="grid grid-cols-1 gap-1">
              {authenticatedNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setCurrentTab(item.id); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold min-h-[44px] transition-colors ${
                    currentTab === item.id ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-1">
              {publicNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 min-h-[44px] transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={user.name}
                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 capitalize truncate">{user.track} • Day {progress.currentDay}</p>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 shrink-0"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => { openAuthModal(); setMobileMenuOpen(false); }}
                  className="w-full py-3 text-center font-extrabold text-xs text-white bg-slate-900 rounded-xl shadow-2xs min-h-[44px] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Start Your 60-Day Journey</span>
                </button>
                <button
                  onClick={() => { openAuthModal(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center font-bold text-xs text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
