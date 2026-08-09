import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRoadmapForTrack, STAGE_NAMES } from '../data/curriculum';
import { CurriculumStage, Challenge } from '../types';
import { CheckCircle2, Clock, ShieldCheck, Flame, Filter, ChevronRight, AlertCircle, ArrowUpRight } from 'lucide-react';

interface JourneyViewProps {
  onSelectDay: (dayId: number) => void;
}

export const JourneyView: React.FC<JourneyViewProps> = ({ onSelectDay }) => {
  const { user, activeJourney, progress } = useAuth();
  const [stageFilter, setStageFilter] = useState<CurriculumStage | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'missed' | 'upcoming'>('all');

  const currentDay = progress.currentDay || 1;

  const stages: CurriculumStage[] = ['discover', 'build', 'experiment', 'real-world', 'build-your-own', 'showcase'];
  const roadmapChallenges = activeJourney?.roadmap && activeJourney.roadmap.length > 0
    ? activeJourney.roadmap
    : getRoadmapForTrack(user?.track || 'fullstack');

  const journeyTitle = activeJourney?.title || '60-Day Technical Journey';

  const filteredChallenges = roadmapChallenges.filter((c) => {
    if (stageFilter !== 'all' && c.stage !== stageFilter) return false;

    const isCompleted = progress.completedDays.includes(c.dayId);
    const isMissed = progress.missedDays.includes(c.dayId);
    const isUpcoming = c.dayId > currentDay && !isCompleted;

    if (statusFilter === 'completed' && !isCompleted) return false;
    if (statusFilter === 'missed' && !isMissed) return false;
    if (statusFilter === 'upcoming' && !isUpcoming) return false;

    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {journeyTitle} — 60-Day Roadmap
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Explore all 60 progressive challenges structured across 6 skill stages for this active journey.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 max-w-full">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto scrollbar-none max-w-full">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap min-h-[36px] ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All (60)
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap min-h-[36px] ${
                statusFilter === 'completed' ? 'bg-emerald-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({progress.completedDays.length})
            </button>
            <button
              onClick={() => setStatusFilter('missed')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap min-h-[36px] ${
                statusFilter === 'missed' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Missed ({progress.missedDays.length})
            </button>
          </div>
        </div>
      </div>

      {/* Stage Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setStageFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
            stageFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
              : 'bg-white text-slate-700 border-gray-200/80 hover:bg-gray-50'
          }`}
        >
          All Stages
        </button>
        {stages.map((st) => {
          const isActive = stageFilter === st;
          return (
            <button
              key={st}
              onClick={() => setStageFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white text-slate-700 border-gray-200/80 hover:bg-gray-50'
              }`}
            >
              {STAGE_NAMES[st]}
            </button>
          );
        })}
      </div>

      {/* Stages Grid or List */}
      <div className="space-y-10">
        {stages.map((stageKey) => {
          const stageChallenges = filteredChallenges.filter((c) => c.stage === stageKey);
          if (stageChallenges.length === 0) return null;

          return (
            <div key={stageKey} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>{STAGE_NAMES[stageKey]}</span>
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  {stageChallenges.length} Challenges
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stageChallenges.map((challenge) => {
                  const isCompleted = progress.completedDays.includes(challenge.dayId);
                  const isCurrent = challenge.dayId === currentDay;
                  const isMissed = progress.missedDays.includes(challenge.dayId);

                  let cardBorder = 'border-gray-200/80 hover:border-slate-400';
                  let statusBadge = (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-slate-600">
                      Upcoming
                    </span>
                  );

                  if (isCompleted) {
                    cardBorder = 'border-emerald-200 bg-emerald-50/20';
                    statusBadge = (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Completed</span>
                      </span>
                    );
                  } else if (isCurrent) {
                    cardBorder = 'border-slate-900 bg-gray-50 ring-2 ring-slate-900/10 shadow-xs';
                    statusBadge = (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                        Today's Focus
                      </span>
                    );
                  } else if (isMissed) {
                    cardBorder = 'border-amber-300 bg-amber-50/30';
                    statusBadge = (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span>Recovery Ready</span>
                      </span>
                    );
                  }

                  return (
                    <div
                      key={challenge.dayId}
                      onClick={() => onSelectDay(challenge.dayId)}
                      className={`p-5 rounded-2xl bg-white border cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between gap-4 ${cardBorder}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                            Day {challenge.dayId}
                          </span>
                          {statusBadge}
                        </div>

                        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                          {challenge.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {challenge.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <span className="capitalize font-semibold text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {challenge.challengeType}
                          </span>
                          <span className="text-[10px] text-slate-400">~{challenge.estimatedMinutes}m</span>
                        </div>

                        <div className="text-indigo-600 font-bold flex items-center gap-1 hover:underline text-[11px]">
                          <span>View Challenge</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
