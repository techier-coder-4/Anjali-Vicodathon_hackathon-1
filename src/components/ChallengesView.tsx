import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { COMMUNITY_CHALLENGES } from '../data/communityChallenges';
import { CommunityChallenge, DifficultyLevel } from '../types';
import { AuthService } from '../services/auth';
import {
  Trophy,
  Search,
  Filter,
  Users,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  X,
  ShieldCheck,
  Zap,
  Code2,
  Target,
  Award,
  BookOpen,
  Send,
  RotateCcw
} from 'lucide-react';

type StatusFilterTab = 'upcoming' | 'ongoing' | 'completed';

export const ChallengesView: React.FC = () => {
  const { user, progress, updateUserProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<StatusFilterTab>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedChallenge, setSelectedChallenge] = useState<CommunityChallenge | null>(null);

  // User's joined and completed challenge IDs from progress
  const joinedIds = useMemo(() => progress?.joinedCommunityChallengeIds || [], [progress]);
  const completedIds = useMemo(() => progress?.completedCommunityChallengeIds || [], [progress]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    COMMUNITY_CHALLENGES.forEach(c => set.add(c.category));
    return ['All', ...Array.from(set)];
  }, []);

  // Compute status for each challenge relative to current user state & base statusType
  const getChallengeUserStatus = (c: CommunityChallenge): 'upcoming' | 'ongoing' | 'completed' => {
    if (completedIds.includes(c.id)) {
      return 'completed';
    }
    if (joinedIds.includes(c.id)) {
      return 'ongoing';
    }
    return c.statusType;
  };

  // Filter challenges according to tab, category, difficulty, search query
  const filteredChallenges = useMemo(() => {
    return COMMUNITY_CHALLENGES.filter(c => {
      const computedStatus = getChallengeUserStatus(c);

      // Status Tab filter
      if (activeTab === 'upcoming' && computedStatus !== 'upcoming') return false;
      if (activeTab === 'ongoing' && computedStatus !== 'ongoing') return false;
      if (activeTab === 'completed' && computedStatus !== 'completed') return false;

      // Category filter
      if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;

      // Difficulty filter
      if (selectedDifficulty !== 'All' && c.difficulty !== selectedDifficulty.toLowerCase()) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesDesc = c.description.toLowerCase().includes(q);
        const matchesCategory = c.category.toLowerCase().includes(q);
        const matchesSkills = c.skills.some(s => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesSkills) {
          return false;
        }
      }

      return true;
    });
  }, [activeTab, selectedCategory, selectedDifficulty, searchQuery, joinedIds, completedIds]);

  // Counts for each tab
  const tabCounts = useMemo(() => {
    let upcoming = 0;
    let ongoing = 0;
    let completed = 0;

    COMMUNITY_CHALLENGES.forEach(c => {
      const st = getChallengeUserStatus(c);
      if (st === 'upcoming') upcoming++;
      else if (st === 'ongoing') ongoing++;
      else if (st === 'completed') completed++;
    });

    return { upcoming, ongoing, completed };
  }, [joinedIds, completedIds]);

  // Toggle Join/Leave challenge in student state
  const handleToggleJoin = (challengeId: string) => {
    if (!user) return;
    const exists = joinedIds.includes(challengeId);
    const updatedJoined = exists
      ? joinedIds.filter(id => id !== challengeId)
      : [...joinedIds, challengeId];

    // If leaving, also remove from completed if present
    const updatedCompleted = exists
      ? completedIds.filter(id => id !== challengeId)
      : completedIds;

    const updatedProgress = {
      ...progress,
      joinedCommunityChallengeIds: updatedJoined,
      completedCommunityChallengeIds: updatedCompleted
    };

    AuthService.saveProgress(updatedProgress);
    // Force context sync
    updateUserProfile({});
  };

  // Complete challenge in student state
  const handleMarkCompleted = (challengeId: string) => {
    if (!user) return;
    const isCompleted = completedIds.includes(challengeId);
    const updatedCompleted = isCompleted
      ? completedIds.filter(id => id !== challengeId)
      : [...completedIds, challengeId];

    // Ensure it's joined
    const updatedJoined = joinedIds.includes(challengeId)
      ? joinedIds
      : [...joinedIds, challengeId];

    const updatedProgress = {
      ...progress,
      joinedCommunityChallengeIds: updatedJoined,
      completedCommunityChallengeIds: updatedCompleted
    };

    AuthService.saveProgress(updatedProgress);
    updateUserProfile({});
  };

  const getDifficultyBadge = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'beginner':
        return <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Beginner</span>;
      case 'intermediate':
        return <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">Intermediate</span>;
      case 'advanced':
        return <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">Advanced</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HEADER SECTION */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-bold border border-amber-400/20">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Community Build Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Challenges
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              Explore builds, sprints, and community challenges beyond your 60-day journey. Build real projects, collaborate with fellow students, and earn verified badges.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-6 shrink-0">
            <div className="text-center">
              <p className="text-2xl font-black text-white">{completedIds.length}</p>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Completed</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-black text-amber-300">{joinedIds.length - completedIds.length < 0 ? 0 : joinedIds.length - completedIds.length}</p>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Active Joins</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THREE STATUS FILTERS TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap min-h-[42px] ${
              activeTab === 'upcoming'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Upcoming</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === 'upcoming' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
            }`}>
              {tabCounts.upcoming}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ongoing')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap min-h-[42px] ${
              activeTab === 'ongoing'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>Ongoing</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === 'ongoing' ? 'bg-emerald-400 text-slate-950' : 'bg-slate-200 text-slate-700'
            }`}>
              {tabCounts.ongoing}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap min-h-[42px] ${
              activeTab === 'completed'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Completed</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === 'completed' ? 'bg-indigo-400 text-slate-950' : 'bg-slate-200 text-slate-700'
            }`}>
              {tabCounts.completed}
            </span>
          </button>
        </div>

        <p className="text-xs text-slate-500 font-medium hidden md:block">
          Showing {filteredChallenges.length} {activeTab} {filteredChallenges.length === 1 ? 'challenge' : 'challenges'}
        </p>
      </div>

      {/* 3. DISCOVERY CONTROLS (SEARCH & CATEGORY / DIFFICULTY FILTERS) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges, skills, or topics..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 bg-slate-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || searchQuery !== '') && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-semibold text-[11px]">Active Filters:</span>
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('All')} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedDifficulty !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                Difficulty: {selectedDifficulty}
                <button onClick={() => setSelectedDifficulty('All')} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                Query: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setSearchQuery('');
              }}
              className="text-slate-500 hover:text-slate-900 text-[11px] font-bold underline ml-auto"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* 4. CHALLENGE CARDS GRID */}
      {filteredChallenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChallenges.map((challenge) => {
            const isJoined = joinedIds.includes(challenge.id);
            const isCompleted = completedIds.includes(challenge.id);

            return (
              <div
                key={challenge.id}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between p-5 shadow-2xs hover:shadow-md relative group ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isJoined
                    ? 'border-indigo-300 ring-1 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Top Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {challenge.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {getDifficultyBadge(challenge.difficulty)}
                      {isCompleted && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-600 text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Done
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                      {challenge.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 mt-1.5 leading-relaxed font-normal">
                      {challenge.description}
                    </p>
                  </div>

                  {/* Skills Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {challenge.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                    {challenge.skills.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-semibold py-0.5">
                        +{challenge.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom Actions & Dates */}
                <div className="space-y-3 pt-4 border-t border-slate-100 mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{challenge.startDate}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{challenge.participantsCount + (isJoined ? 1 : 0)} builders</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Primary Personalized Action */}
                    {activeTab === 'upcoming' ? (
                      <button
                        type="button"
                        onClick={() => setSelectedChallenge(challenge)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-extrabold bg-slate-900 text-white hover:bg-slate-800 shadow-2xs transition-all flex items-center justify-center gap-1.5 min-h-[40px]"
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>Remind Me</span>
                      </button>
                    ) : activeTab === 'ongoing' ? (
                      <button
                        type="button"
                        onClick={() => handleToggleJoin(challenge.id)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 min-h-[40px] ${
                          isJoined
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs'
                        }`}
                      >
                        {isJoined ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Continue</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>Join Challenge</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedChallenge(challenge)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all flex items-center justify-center gap-1.5 min-h-[40px]"
                      >
                        <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                        <span>View Results</span>
                      </button>
                    )}

                    {/* Secondary Detail Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedChallenge(challenge)}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs min-h-[40px] shrink-0"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 5. POLISHED EMPTY STATE */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto shadow-2xs my-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
            <Trophy className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-black text-slate-900">
              {activeTab === 'completed'
                ? 'No completed challenges yet'
                : activeTab === 'ongoing'
                ? 'No active ongoing challenges found'
                : 'No upcoming challenges found'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              {activeTab === 'completed'
                ? 'Complete your first community challenge and your verified proof badges will appear here.'
                : 'Try adjusting your search keywords or switching category filters to discover more challenges.'}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {activeTab === 'completed' ? (
              <button
                onClick={() => setActiveTab('ongoing')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center gap-2"
              >
                <span>Browse Ongoing Challenges</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedDifficulty('All');
                  setSearchQuery('');
                  setActiveTab('upcoming');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters & Show All</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6. CHALLENGE DETAIL MODAL / DRAWER */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-200 my-8 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedChallenge(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-8">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {selectedChallenge.category}
                </span>
                {getDifficultyBadge(selectedChallenge.difficulty)}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {selectedChallenge.durationLabel}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {selectedChallenge.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{selectedChallenge.startDate} – {selectedChallenge.endDate}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Est. Time: {selectedChallenge.estimatedTime}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedChallenge.participantsCount} builders participating</span>
                </span>
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-2 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>What Is This Challenge?</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {selectedChallenge.description}
              </p>
            </div>

            {/* What you'll build / Who it's for */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>What You'll Build</span>
                </h4>
                <p className="text-xs text-indigo-950 leading-relaxed font-medium">
                  {selectedChallenge.whatYoullBuild || selectedChallenge.projectPrompt}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-600" />
                  <span>Who It's For</span>
                </h4>
                <p className="text-xs text-amber-950 leading-relaxed font-medium">
                  {selectedChallenge.whoItIsFor || 'Students looking to apply modern frontend and backend techniques.'}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Technologies & Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedChallenge.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Submission Expectations */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-slate-700" />
                <span>Submission Expectations</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedChallenge.submissionExpectations || 'Submit a public GitHub repository link along with a brief walkthrough video or live site.'}
              </p>
            </div>

            {/* Rules */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Challenge Rules & Guidelines</h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedChallenge.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-extrabold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reward */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-extrabold">Verified Completion Reward</p>
                  <p className="text-[11px] text-emerald-800 font-medium">{selectedChallenge.rewardBadge}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedChallenge(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                Close
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {joinedIds.includes(selectedChallenge.id) && (
                  <button
                    type="button"
                    onClick={() => {
                      handleMarkCompleted(selectedChallenge.id);
                    }}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 min-h-[40px] ${
                      completedIds.includes(selectedChallenge.id)
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{completedIds.includes(selectedChallenge.id) ? 'Mark as Ongoing' : 'Mark as Completed'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    handleToggleJoin(selectedChallenge.id);
                  }}
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 min-h-[40px] ${
                    joinedIds.includes(selectedChallenge.id)
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {joinedIds.includes(selectedChallenge.id) ? 'Leave Challenge' : 'Join Challenge Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
