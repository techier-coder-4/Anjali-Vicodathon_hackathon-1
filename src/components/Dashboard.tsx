import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CHALLENGES, getChallengeByDay, getRoadmapForTrack } from '../data/curriculum';
import { ALL_ACHIEVEMENTS } from '../data/achievements';
import { Flame, Clock, Trophy, ArrowRight, ShieldCheck, Sparkles, RefreshCw, Layers, Award, CheckCircle2, Target, Zap } from 'lucide-react';

interface DashboardProps {
  onSelectDay: (dayId: number) => void;
  onOpenJourney: () => void;
  onOpenProfile: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectDay, onOpenJourney, onOpenProfile }) => {
  const { user, progress } = useAuth();

  const currentDay = progress.currentDay || 1;
  const currentChallenge = getChallengeByDay(currentDay, user?.track) || CHALLENGES[0];
  const completedCount = progress.completedDays.length;
  const progressPercent = Math.round((completedCount / 60) * 100);
  const missedCount = progress.missedDays.length;

  const isCompletedStudent = completedCount >= 60;
  const isInconsistent = missedCount > 0 && !isCompletedStudent;
  const isNewStudent = completedCount === 0 && !isCompletedStudent;

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* 1. SINGLE UNIFIED WORKSPACE HEADER */}
      {isCompletedStudent ? (
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-purple-900/50 shadow-md relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold border border-purple-400/30">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>60-Day Graduate 🎉</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Congratulations, {user?.name}! You completed all 60 days!
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                You built consistently for 60 days, mastered 6 stages of software development, and verified a proof-of-work engineering portfolio.
              </p>
            </div>
            <button
              onClick={onOpenProfile}
              className="px-6 py-3 rounded-xl bg-white text-purple-950 hover:bg-purple-50 font-extrabold text-xs shadow-md transition-all shrink-0 flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-purple-700" />
              <span>View Portfolio & Certificate</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {isNewStudent ? `Welcome, ${user?.name || 'Student'}` : `Welcome back, ${user?.name || 'Student'}`}
              </h1>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                {user?.track || 'Frontend'} Track
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
              {isNewStudent
                ? 'Your 60-day journey starts today. Build one small thing today and build consistency.'
                : `Day ${currentDay} of 60 · Keep your momentum going with today's challenge.`}
            </p>
          </div>

          <button
            onClick={() => onSelectDay(currentDay)}
            className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2.5 transition-transform hover:scale-102 shrink-0 min-h-[44px]"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isNewStudent ? 'Start Day 1 Challenge' : `Continue Challenge (Day ${currentDay})`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. RECOVERY BANNER (Non-shaming, displayed if student missed days) */}
      {isInconsistent && (
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-2xs shrink-0 mt-0.5">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">Momentum Recovery</p>
              <p className="text-sm font-extrabold text-amber-950 mt-0.5">
                Your momentum paused on Day 19. One missed day doesn't erase your progress.
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                You've built {completedCount} days of solid proof. Ready to jump back in on Day {currentDay}?
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectDay(currentDay)}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs shrink-0 flex items-center gap-1.5 transition-transform hover:scale-102"
          >
            <span>Resume Today's Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. TODAY'S FOCUS CARD (Star of the Dashboard) */}
      {!isCompletedStudent && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Card Header */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                  TODAY · DAY {currentChallenge.dayId}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 capitalize border border-slate-700">
                  {currentChallenge.challengeType}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{currentChallenge.title}</h2>
              <p className="text-xs text-slate-400">{currentChallenge.stageName}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-1 text-xs text-slate-300 font-semibold justify-end">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>~{currentChallenge.estimatedMinutes} Mins</span>
                </div>
                <p className="text-[10px] text-slate-400 capitalize mt-0.5">Difficulty: {currentChallenge.difficulty}</p>
              </div>

              <button
                onClick={() => onSelectDay(currentChallenge.dayId)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-102 min-h-[44px]"
              >
                <span>{isNewStudent ? 'Start Day 1 Challenge' : "Continue Today's Challenge"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card Content Body */}
          <div className="p-6 space-y-5">
            <p className="text-slate-700 text-sm leading-relaxed font-normal">
              {currentChallenge.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Learning Objective</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{currentChallenge.learningObjective}</p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Why It Matters</h4>
                <p className="text-xs text-indigo-800 leading-relaxed">{currentChallenge.whyItMatters}</p>
              </div>
            </div>

            {/* Curiosity Challenge Prompt */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-amber-200/80 text-amber-900 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-900">Today's Curiosity Challenge</p>
                <p className="text-xs text-amber-800 italic mt-0.5 font-medium">"{currentChallenge.curiosityPrompt}"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. STATS & PROGRESS METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progress % */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Overall Journey</span>
            <Layers className="w-4 h-4 text-slate-800" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{progressPercent}%</span>
            <span className="text-xs text-slate-500 font-medium">{completedCount}/60 Days</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-slate-900 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{progress.currentStreak}</span>
            <span className="text-xs text-slate-500 font-medium">Days Active</span>
          </div>
          <p className="text-[11px] text-amber-800 font-medium">
            {progress.currentStreak > 0 ? `Building a habit! Longest: ${progress.longestStreak}d` : 'Start Day 1 to begin streak!'}
          </p>
        </div>

        {/* Verified Proofs */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Verified Proofs</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{completedCount}</span>
            <span className="text-xs text-emerald-700 font-medium">GitHub Repos</span>
          </div>
          <p className="text-[11px] text-slate-500">Activity + Understanding Checkpoint</p>
        </div>

        {/* Unlocked Badges */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Milestones</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{progress.unlockedAchievementIds.length}</span>
            <span className="text-xs text-slate-500 font-medium">/ {ALL_ACHIEVEMENTS.length} Badges</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium">Unlocked proof achievements</p>
        </div>
      </div>

      {/* 5. 60-DAY JOURNEY COMPACT PREVIEW */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">60-Day Journey Progress</h3>
            <p className="text-xs text-slate-500">Click any day to inspect challenge objective and submit proof</p>
          </div>
          <button
            onClick={onOpenJourney}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto min-h-[36px]"
          >
            <span>View Full Journey Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact Grid Preview of 60 Days */}
        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2 pt-2">
          {Array.from({ length: 60 }, (_, i) => i + 1).map((dayNum) => {
            const isCompleted = progress.completedDays.includes(dayNum);
            const isCurrent = dayNum === currentDay;
            const isMissed = progress.missedDays.includes(dayNum);

            let bgClass = 'bg-slate-100 text-slate-400 hover:bg-slate-200';
            if (isCompleted) bgClass = 'bg-emerald-600 text-white font-bold shadow-2xs';
            else if (isCurrent) bgClass = 'bg-indigo-600 text-white font-black ring-2 ring-indigo-400 ring-offset-1 shadow-xs';
            else if (isMissed) bgClass = 'bg-amber-500 text-white font-bold';

            return (
              <button
                key={dayNum}
                onClick={() => onSelectDay(dayNum)}
                className={`h-9 rounded-lg text-xs flex items-center justify-center transition-all ${bgClass}`}
                title={`Day ${dayNum}${isCompleted ? ' (Completed)' : isCurrent ? ' (Today)' : isMissed ? ' (Missed)' : ''}`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

