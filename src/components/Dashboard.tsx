import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CHALLENGES, getChallengeByDay } from '../data/curriculum';
import { ALL_ACHIEVEMENTS } from '../data/achievements';
import { LabService } from '../services/labService';
import { AIMentor } from './AIMentor';
import { DayProgress } from '../types';
import {
  Flame,
  Clock,
  Trophy,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Layers,
  Award,
  CheckCircle2,
  AlertCircle,
  Play
} from 'lucide-react';

interface DashboardProps {
  onSelectDay: (dayId: number) => void;
  onOpenJourney: () => void;
  onOpenProfile: () => void;
  onOpenLabs?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectDay, onOpenJourney, onOpenProfile, onOpenLabs }) => {
  const { user, progress } = useAuth();

  const currentDay = progress.currentDay || 1;
  const currentChallenge = getChallengeByDay(currentDay, user?.track) || CHALLENGES[0];
  const completedCount = progress.completedDays.length;
  const progressPercent = Math.round((completedCount / 60) * 100);
  const missedCount = progress.missedDays.length;

  const isCompletedStudent = completedCount >= 60;
  const isInconsistent = missedCount > 0 && !isCompletedStudent;
  const isNewStudent = completedCount === 0 && !isCompletedStudent;

  // Track Label
  const trackLabel = {
    frontend: 'Frontend Engineering',
    backend: 'Backend Engineering',
    fullstack: 'Full Stack Engineering',
    python: 'Python & Software Dev',
    'data-ai': 'Data & AI Engineering',
    java: 'Java Enterprise Dev',
    cybersecurity: 'Cybersecurity & Defense'
  }[user?.track || 'frontend'] || 'Software Engineering';

  // Understanding statistics from progress.dayProgresses
  const dayProgresses = progress.dayProgresses || {};
  const completedDaysSet = new Set(progress.completedDays);
  let understoodCount = 0;
  let needsRevisitingCount = 0;
  let firstRevisitingDay: number | null = null;

  (Object.values(dayProgresses) as DayProgress[]).forEach((dp) => {
    const isCompleted = completedDaysSet.has(dp.dayId) || dp.activityStatus === 'submitted';
    if (isCompleted) {
      if (dp.understandingStatus === 'understood') {
        understoodCount++;
      } else if (dp.understandingStatus === 'needs_revisiting') {
        needsRevisitingCount++;
        if (!firstRevisitingDay) {
          firstRevisitingDay = dp.dayId;
        }
      }
    }
  });

  // Active & Remaining stats
  const todayIsCompleted = progress.completedDays.includes(currentDay);
  const activeCount = todayIsCompleted ? 0 : 1;
  const remainingCount = Math.max(0, 60 - completedCount - activeCount);

  // Unlocked achievements
  const unlockedAchievements = ALL_ACHIEVEMENTS.filter((a) =>
    progress.unlockedAchievementIds.includes(a.id)
  );

  // Recommended Practice Lab
  const recommendedLabs = LabService.getLabs({ trackCategory: user?.track });
  const recommendedLab = recommendedLabs[0] || LabService.getLabs()[0];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* 1. HEADER / CURRENT POSITION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isNewStudent ? `Welcome, ${user?.name || 'Student'} 👋` : `Good morning, ${user?.name || 'Student'} 👋`}
          </h1>
          <p className="text-xs sm:text-sm font-extrabold text-indigo-600 mt-0.5">
            {trackLabel} · Day {currentDay} / 60
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-extrabold">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{progress.currentStreak} day streak</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 text-xs font-extrabold">
            <Layers className="w-4 h-4 text-slate-600" />
            <span>{completedCount}/60 days ({progressPercent}%)</span>
          </div>
        </div>
      </div>

      {/* GRADUATE BANNER */}
      {isCompletedStudent && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-black">60-Day Graduate! 🎉</p>
              <p className="text-xs text-slate-300">You completed all 60 days of software development challenges.</p>
            </div>
          </div>
          <button
            onClick={onOpenProfile}
            className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs shrink-0 flex items-center gap-2"
          >
            <Award className="w-4 h-4 text-indigo-600" />
            <span>View Certificate</span>
          </button>
        </div>
      )}

      {/* MOMENTUM RECOVERY BANNER */}
      {isInconsistent && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-900 font-bold">
              Momentum paused. Jump right back in on <span className="underline">Day {currentDay}</span>!
            </p>
          </div>
          <button
            onClick={() => onSelectDay(currentDay)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shrink-0 flex items-center gap-1.5"
          >
            <span>Resume Day {currentDay}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MAIN TWO-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PRIMARY LAUNCHER COLUMN (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 2. TODAY'S CHALLENGE — PRIMARY FOCUS */}
          {!isCompletedStudent && (
            <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md p-6 space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                    TODAY · DAY {currentChallenge.dayId}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 capitalize border border-slate-700">
                    {currentChallenge.challengeType}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>~{currentChallenge.estimatedMinutes} mins</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">{currentChallenge.title}</h2>
                <p className="text-xs text-slate-300 font-medium mt-1.5 leading-relaxed line-clamp-2">
                  {currentChallenge.learningObjective || currentChallenge.description}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <span className="text-xs text-slate-400 font-medium capitalize">
                  Difficulty: <strong className="text-slate-200">{currentChallenge.difficulty}</strong>
                </span>

                <button
                  onClick={() => onSelectDay(currentChallenge.dayId)}
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md flex items-center gap-2 transition-transform hover:scale-102 min-h-[44px]"
                >
                  <span>{isNewStudent ? 'Start Day 1 Challenge' : 'Continue Challenge'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* RECOMMENDED PRACTICAL LAB */}
          {recommendedLab && (
            <div className="bg-white rounded-2xl border border-indigo-100 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-600 text-white shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                      RECOMMENDED PRACTICE LAB
                    </span>
                    <h3 className="text-sm font-black text-slate-900">{recommendedLab.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    +{recommendedLab.xp} XP
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    ~{recommendedLab.estimatedMinutes}m
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {recommendedLab.scenario}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex gap-1">
                  {recommendedLab.requiredSkills.slice(0, 2).map((s, idx) => (
                    <span key={idx} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (onOpenLabs) onOpenLabs();
                    else window.location.hash = `/labs/${recommendedLab.id}`;
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Lab</span>
                </button>
              </div>
            </div>
          )}

          {/* 60-DAY JOURNEY MAP PREVIEW */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">60-Day Journey</h3>
              <button
                onClick={onOpenJourney}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View Full Journey Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-10 sm:grid-cols-12 gap-1.5 pt-1">
              {Array.from({ length: 60 }, (_, i) => i + 1).map((dayNum) => {
                const isCompleted = progress.completedDays.includes(dayNum);
                const isCurrent = dayNum === currentDay;
                const isMissed = progress.missedDays.includes(dayNum);

                let bgClass = 'bg-slate-100 text-slate-400 hover:bg-slate-200';
                if (isCompleted) bgClass = 'bg-emerald-600 text-white font-bold';
                else if (isCurrent) bgClass = 'bg-slate-900 text-amber-300 font-black ring-2 ring-amber-400';
                else if (isMissed) bgClass = 'bg-amber-500 text-white font-bold';

                return (
                  <button
                    key={dayNum}
                    onClick={() => onSelectDay(dayNum)}
                    className={`h-7 rounded-md text-[11px] flex items-center justify-center transition-all ${bgClass}`}
                    title={`Day ${dayNum}`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT METRICS & STATUS SIDEBAR COLUMN (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 3. JOURNEY / PROGRESS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Journey Progress</h3>

            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-black text-slate-900">{completedCount} / 60</span>
                <span className="text-xs font-bold text-slate-500">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-slate-900 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-center">
              <div className="bg-slate-50 p-2 rounded-xl">
                <p className="text-xs font-black text-slate-900">{completedCount}</p>
                <p className="text-[10px] font-bold text-slate-500">Completed</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <p className="text-xs font-black text-indigo-600">{activeCount}</p>
                <p className="text-[10px] font-bold text-slate-500">Today</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <p className="text-xs font-black text-slate-600">{remainingCount}</p>
                <p className="text-[10px] font-bold text-slate-500">Remaining</p>
              </div>
            </div>
          </div>

          {/* STREAK METRIC */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Current Streak</h3>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{progress.currentStreak}</span>
              <span className="text-xs font-bold text-slate-500">days active</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Longest streak: <strong className="text-slate-800">{progress.longestStreak} days</strong>
            </p>
          </div>

          {/* 4. UNDERSTANDING */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Understanding</h3>

            {understoodCount === 0 && needsRevisitingCount === 0 ? (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                <p className="text-xs font-bold text-slate-600">— Not assessed yet</p>
                <p className="text-[11px] text-slate-400 leading-tight">Complete challenges & 3rd-day reflection checkpoints to evaluate understanding.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-emerald-50 text-emerald-900 font-bold border border-emerald-100">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Understood</span>
                    </span>
                    <span className="font-black text-sm">{understoodCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-amber-50 text-amber-900 font-bold border border-amber-100">
                    <span className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Needs Revisiting</span>
                    </span>
                    <span className="font-black text-sm">{needsRevisitingCount}</span>
                  </div>
                </div>

                {needsRevisitingCount > 0 && firstRevisitingDay && (
                  <button
                    onClick={() => onSelectDay(firstRevisitingDay!)}
                    className="w-full text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center justify-center gap-1 pt-1"
                  >
                    <span>{needsRevisitingCount} {needsRevisitingCount === 1 ? 'concept' : 'concepts'} worth revisiting →</span>
                  </button>
                )}
              </>
            )}
          </div>

          {/* 5. ACHIEVEMENTS PREVIEW */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Achievements</h3>
              <button
                onClick={onOpenProfile}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                View all →
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {unlockedAchievements.length > 0 ? (
                  unlockedAchievements.slice(0, 4).map((ach) => (
                    <div
                      key={ach.id}
                      className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-200"
                      title={ach.title}
                    >
                      <Trophy className="w-4 h-4" />
                    </div>
                  ))
                ) : (
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-400 border border-slate-200">
                    <Trophy className="w-4 h-4" />
                  </div>
                )}
              </div>
              <span className="text-xs font-black text-slate-700">
                {unlockedAchievements.length} / {ALL_ACHIEVEMENTS.length} unlocked
              </span>
            </div>
          </div>

          {/* 6. TODAY'S AI MENTOR */}
          {!isCompletedStudent && (
            <AIMentor challenge={currentChallenge} />
          )}
        </div>
      </div>
    </div>
  );
};



