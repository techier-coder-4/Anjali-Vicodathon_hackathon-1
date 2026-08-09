import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PersonaSwitcher } from './components/PersonaSwitcher';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { JourneyView } from './components/JourneyView';
import { DailyChallengeView } from './components/DailyChallengeView';
import { ProfileView } from './components/ProfileView';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { AuthView } from './components/AuthView';
import { getChallengeByDay, CHALLENGES } from './data/curriculum';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, progress } = useAuth();

  // Current path state
  const [path, setPath] = useState<string>(() => window.location.pathname || '/');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  // Sync state with browser location
  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (newPath: string) => {
    setPath(newPath);
    window.history.pushState({}, '', newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Convert tab IDs to paths for Navbar compatibility
  const getTabFromPath = (): 'landing' | 'dashboard' | 'journey' | 'profile' | 'challenge' => {
    if (path.startsWith('/day/')) return 'challenge';
    if (path === '/dashboard') return 'dashboard';
    if (path === '/journey') return 'journey';
    if (path === '/profile') return 'profile';
    return 'landing';
  };

  const handleTabSelect = (tab: 'landing' | 'dashboard' | 'journey' | 'profile' | 'challenge') => {
    if (tab === 'landing') navigateTo('/');
    else if (tab === 'dashboard') {
      if (!user) navigateTo('/login');
      else if (!user.onboardingCompleted) navigateTo('/onboarding');
      else navigateTo('/dashboard');
    }
    else if (tab === 'journey') navigateTo('/journey');
    else if (tab === 'profile') {
      if (!user) navigateTo('/login');
      else navigateTo('/profile');
    }
    else if (tab === 'challenge') {
      if (!user) navigateTo('/login');
      else if (!user.onboardingCompleted) navigateTo('/onboarding');
      else navigateTo(`/day/${progress?.currentDay || 1}`);
    }
  };

  const handleStartJourney = () => {
    if (!user) {
      navigateTo('/login');
    } else if (!user.onboardingCompleted) {
      navigateTo('/onboarding');
    } else {
      navigateTo('/dashboard');
    }
  };

  const handleSelectDay = (dayId: number) => {
    if (!user) {
      navigateTo('/login');
    } else if (!user.onboardingCompleted) {
      navigateTo('/onboarding');
    } else {
      navigateTo(`/day/${dayId}`);
    }
  };

  // Route rendering logic & protection checks
  const renderContent = () => {
    // 1. PUBLIC ROUTES
    if (path === '/' || path === '') {
      return (
        <LandingPage
          onStart={handleStartJourney}
          onExplore={() => navigateTo('/journey')}
        />
      );
    }

    if (path === '/login') {
      return (
        <AuthView
          initialTab="login"
          onSuccess={() => {
            if (user && !user.onboardingCompleted) {
              navigateTo('/onboarding');
            } else {
              navigateTo('/dashboard');
            }
          }}
          onNavigateHome={() => navigateTo('/')}
        />
      );
    }

    if (path === '/signup') {
      return (
        <AuthView
          initialTab="signup"
          onSuccess={() => navigateTo('/onboarding')}
          onNavigateHome={() => navigateTo('/')}
        />
      );
    }

    if (path === '/journey') {
      return <JourneyView onSelectDay={handleSelectDay} />;
    }

    // 2. PROTECTED ROUTES - Redirect to /login if unauthenticated
    if (!user) {
      return (
        <AuthView
          initialTab="login"
          onSuccess={() => {
            if (user && !user.onboardingCompleted) {
              navigateTo('/onboarding');
            } else {
              navigateTo('/dashboard');
            }
          }}
          onNavigateHome={() => navigateTo('/')}
        />
      );
    }

    // 3. ONBOARDING ROUTE
    if (path === '/onboarding' || (!user.onboardingCompleted && (path === '/dashboard' || path.startsWith('/day/')))) {
      return (
        <div className="py-8">
          <OnboardingModal
            isOpen={true}
            onClose={() => navigateTo('/dashboard')}
            onComplete={() => navigateTo('/dashboard')}
          />
        </div>
      );
    }

    // 4. DASHBOARD ROUTE
    if (path === '/dashboard') {
      return (
        <Dashboard
          onSelectDay={handleSelectDay}
          onOpenJourney={() => navigateTo('/journey')}
          onOpenProfile={() => navigateTo('/profile')}
        />
      );
    }

    // 5. PROFILE ROUTE
    if (path === '/profile') {
      return <ProfileView />;
    }

    // 6. DAILY CHALLENGE ROUTE: /day/[dayId]
    if (path.startsWith('/day/')) {
      const rawDayId = path.replace('/day/', '').trim();
      const dayId = parseInt(rawDayId, 10);

      // Invalid day handling: dayId < 1 or dayId > 60 or NaN
      if (isNaN(dayId) || dayId < 1 || dayId > 60) {
        return (
          <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-lg mx-auto my-12 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Challenge Day Not Found</h2>
            <p className="text-xs text-slate-600">
              The requested day "{rawDayId}" is outside the valid range (Day 1 to 60). Please choose a valid challenge from your dashboard or journey map.
            </p>
            <button
              onClick={() => navigateTo('/dashboard')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-2xs inline-flex items-center gap-2 hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </button>
          </div>
        );
      }

      const challenge = getChallengeByDay(dayId) || CHALLENGES[0];
      return (
        <DailyChallengeView
          challenge={challenge}
          onBackToDashboard={() => navigateTo('/dashboard')}
          onNavigateDay={(newDayId) => navigateTo(`/day/${newDayId}`)}
        />
      );
    }

    // Default Fallback
    return (
      <LandingPage
        onStart={handleStartJourney}
        onExplore={() => navigateTo('/journey')}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans antialiased flex flex-col selection:bg-slate-900 selection:text-white">
      {/* Top Judge Persona Switcher Bar */}
      <PersonaSwitcher />

      {/* Primary Sticky Navigation Header */}
      <Navbar
        currentTab={getTabFromPath()}
        setCurrentTab={handleTabSelect}
        openAuthModal={() => {
          if (!user) navigateTo('/login');
          else navigateTo('/dashboard');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="font-extrabold text-slate-900 tracking-tight">ABTalks</span>
            <span className="text-slate-400">— 60-Day Student Technical Consistency Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-medium text-[10px] sm:text-[11px]">
            <div className="hidden md:flex flex-wrap items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/60">
              <span>LEARN → UNDERSTAND → EXPERIMENT → BUILD → PROVE → REFLECT</span>
            </div>
            <button
              onClick={() => {
                const current = localStorage.getItem('abtalks_dev_mode') === 'true';
                localStorage.setItem('abtalks_dev_mode', current ? 'false' : 'true');
                window.location.reload();
              }}
              className="text-slate-400 hover:text-slate-700 text-[10px] font-mono hover:underline shrink-0"
              title="Toggle Dev Persona Controls"
            >
              [Dev Tools]
            </button>
          </div>
        </div>
      </footer>

      {/* Modal Fallbacks if triggered directly */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          if (user && !user.onboardingCompleted) navigateTo('/onboarding');
          else navigateTo('/dashboard');
        }}
      />

      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onComplete={() => navigateTo('/dashboard')}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
