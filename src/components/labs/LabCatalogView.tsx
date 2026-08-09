import React, { useState } from 'react';
import { Lab, DifficultyLevel } from '../../types/lab';
import { TrackType } from '../../types';
import { LabService } from '../../services/labService';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Filter,
  Play,
  CheckCircle2,
  Clock,
  Award,
  Server,
  Terminal,
  Zap,
  Building,
  Code,
  Cpu,
  ShieldCheck,
  Plus,
  Sparkles,
  Layers,
  CheckSquare,
  ArrowRight,
  ArrowLeft,
  Layout,
  Database,
  Lock,
  ChevronRight,
  BookOpen,
  Star,
  Target
} from 'lucide-react';

interface CategoryCardMeta {
  id: TrackType;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  badgeColor: string;
  borderColor: string;
  hoverBorder: string;
  gradientBg: string;
  difficultyRange: string;
  estimatedHours: string;
}

const CATEGORIES: CategoryCardMeta[] = [
  {
    id: 'frontend',
    slug: 'frontend',
    name: 'Frontend Development',
    subtitle: 'CSS, DOM, Responsive & React State',
    description: 'Master responsive UI layouts, CSS Flexbox & Grid, mobile touch targets, DOM event listeners, and React component hook debugging.',
    icon: <Layout className="w-6 h-6 text-indigo-600" />,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    borderColor: 'border-slate-200',
    hoverBorder: 'hover:border-indigo-400',
    gradientBg: 'from-indigo-50/60 to-blue-50/30',
    difficultyRange: 'Beginner → Advanced',
    estimatedHours: '4–6 Hours'
  },
  {
    id: 'backend',
    slug: 'backend',
    name: 'Backend Development',
    subtitle: 'REST APIs, Middleware & Auth',
    description: 'Construct Node.js Express REST endpoints, middleware pipelines, IP rate limiters, JWT authorization tokens, and parameterized SQL queries.',
    icon: <Server className="w-6 h-6 text-emerald-600" />,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    borderColor: 'border-slate-200',
    hoverBorder: 'hover:border-emerald-400',
    gradientBg: 'from-emerald-50/60 to-teal-50/30',
    difficultyRange: 'Beginner → Advanced',
    estimatedHours: '5–8 Hours'
  },
  {
    id: 'fullstack',
    slug: 'fullstack',
    name: 'Full Stack Development',
    subtitle: 'API Integration & Optimistic UI',
    description: 'Connect React frontend components to Express REST services, implement optimistic state sync with error rollback, and real-time WebSockets.',
    icon: <Layers className="w-6 h-6 text-purple-600" />,
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    borderColor: 'border-slate-200',
    hoverBorder: 'hover:border-purple-400',
    gradientBg: 'from-purple-50/60 to-indigo-50/30',
    difficultyRange: 'Intermediate → Advanced',
    estimatedHours: '6–10 Hours'
  },
  {
    id: 'data-ai',
    slug: 'data-ai',
    name: 'AI / Machine Learning',
    subtitle: 'Prompt Grounding & Model Metrics',
    description: 'Tune LLM system instructions, ground models with context documents to prevent hallucinations, and evaluate classification confusion matrices.',
    icon: <Sparkles className="w-6 h-6 text-sky-600" />,
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    borderColor: 'border-slate-200',
    hoverBorder: 'hover:border-sky-400',
    gradientBg: 'from-sky-50/60 to-blue-50/30',
    difficultyRange: 'Beginner → Intermediate',
    estimatedHours: '4–6 Hours'
  },
  {
    id: 'cybersecurity',
    slug: 'cybersecurity',
    name: 'Cybersecurity',
    subtitle: 'Web Security, IDOR, SQLi & Cloud SSRF',
    description: 'Investigate realistic corporate portals, exploit IDOR wire transfers, patch SQL injection vulnerabilities, and extract cloud IAM keys via SSRF.',
    icon: <ShieldCheck className="w-6 h-6 text-rose-600" />,
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    borderColor: 'border-slate-200',
    hoverBorder: 'hover:border-rose-400',
    gradientBg: 'from-rose-50/60 to-amber-50/30',
    difficultyRange: 'Beginner → Advanced',
    estimatedHours: '8–12 Hours'
  },
  {
    id: 'python',
    slug: 'python',
    name: 'Data / Programming',
    subtitle: 'Python Data Structures & Java OOP',
    description: 'Process nested JSON datasets in Python, write list comprehensions, and handle object-oriented class hierarchies and exceptions in Java.',
    icon: <Code className="w-6 h-6 text-amber-600" />,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    borderColor: 'border-slate-200',
    hoverBorder: 'hover:border-amber-400',
    gradientBg: 'from-amber-50/60 to-yellow-50/30',
    difficultyRange: 'Beginner → Intermediate',
    estimatedHours: '4–6 Hours'
  }
];

interface LabCatalogViewProps {
  categorySlug?: string | null;
  onNavigateCategory: (categorySlug: string) => void;
  onSelectLab: (labId: string) => void;
  onOpenAuthorStudio: () => void;
  onRunQASuite: () => void;
}

export const LabCatalogView: React.FC<LabCatalogViewProps> = ({
  categorySlug,
  onNavigateCategory,
  onSelectLab,
  onOpenAuthorStudio,
  onRunQASuite
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  // Active Category Meta if inside category route
  const activeCategory = CATEGORIES.find((c) => c.slug === categorySlug || c.id === categorySlug);

  // Get Labs
  const allLabs = LabService.getLabs();

  // Helper to calculate category progress
  const getCategoryStats = (trackId: TrackType) => {
    const categoryLabs = allLabs.filter((l) => l.trackCategory === trackId || (trackId === 'python' && l.trackCategory === 'java'));
    let completedCount = 0;
    let inProgressCount = 0;
    let totalXP = 0;

    categoryLabs.forEach((lab) => {
      totalXP += lab.xp;
      const inst = LabService.getActiveInstance(lab.id);
      const isSolved = lab.flags.length > 0 && lab.flags.every((f) => inst.solvedFlagIds.includes(f.id));
      if (isSolved) {
        completedCount++;
      } else if (inst.solvedFlagIds.length > 0) {
        inProgressCount++;
      }
    });

    return {
      totalLabs: categoryLabs.length,
      completedCount,
      inProgressCount,
      totalXP
    };
  };

  // Filtered labs for category view
  const categoryLabs = activeCategory
    ? allLabs.filter((lab) => {
        if (lab.trackCategory !== activeCategory.id && !(activeCategory.id === 'python' && lab.trackCategory === 'java')) {
          return false;
        }

        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = lab.title.toLowerCase().includes(q);
          const matchDesc = lab.scenario.toLowerCase().includes(q);
          const matchSkills = lab.requiredSkills.some((s) => s.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchSkills) return false;
        }

        // Difficulty Filter
        if (difficultyFilter !== 'all' && lab.difficulty !== difficultyFilter) {
          return false;
        }

        // Status Filter
        const inst = LabService.getActiveInstance(lab.id);
        const isSolved = lab.flags.length > 0 && lab.flags.every((f) => inst.solvedFlagIds.includes(f.id));
        const isInProgress = inst.solvedFlagIds.length > 0 && !isSolved;

        if (statusFilter === 'completed' && !isSolved) return false;
        if (statusFilter === 'in_progress' && !isInProgress) return false;
        if (statusFilter === 'not_started' && (isSolved || isInProgress)) return false;

        return true;
      })
    : [];

  // ==========================================
  // VIEW 1: CATEGORY SELECTION PAGE (/labs)
  // ==========================================
  if (!activeCategory) {
    return (
      <div className="space-y-8 pb-16 font-sans">
        {/* Header Hero Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              ABTalks Student Practice Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interactive Practical Labs
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Labs are the practice engine of ABTalks. Choose your learning track below to explore hands-on playgrounds, step-by-step builders, code editors, and real-world company simulations.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onRunQASuite}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center gap-2"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Run Automated QA Suite</span>
              </button>

              <button
                onClick={onOpenAuthorStudio}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Author Studio & Lab Cloning</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Select Learning Category</h2>
            <p className="text-xs text-slate-500">Choose a track to view available practical labs matched to your 60-day curriculum.</p>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const stats = getCategoryStats(cat.id);
            const isUserTrack = user?.track === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => onNavigateCategory(cat.slug)}
                className={`group bg-white rounded-2xl border ${cat.borderColor} ${cat.hoverBorder} p-6 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-5 relative overflow-hidden bg-gradient-to-b ${cat.gradientBg}`}
              >
                {/* Active Student Track Highlight Badge */}
                {isUserTrack && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider shadow-2xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    <span>Your Selected Track</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                      {cat.icon}
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wider ${cat.badgeColor}`}>
                      {stats.totalLabs} Labs Available
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-500 mt-0.5">{cat.subtitle}</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-200/60">
                  {/* Stats Bar */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block font-bold">Difficulty</span>
                      <strong className="text-slate-800 font-extrabold">{cat.difficultyRange}</strong>
                    </div>

                    <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block font-bold">Progress</span>
                      <strong className="text-emerald-700 font-black">
                        {stats.completedCount} / {stats.totalLabs} Completed
                      </strong>
                    </div>
                  </div>

                  {/* Explore Button */}
                  <button className="w-full bg-slate-900 group-hover:bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-2xs flex items-center justify-center gap-2">
                    <span>Explore {cat.name} Labs</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: CATEGORY SPECIFIC LAB LIST (/labs/:category)
  // ==========================================
  const activeStats = getCategoryStats(activeCategory.id);

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Back Button */}
      <button
        onClick={() => onNavigateCategory('')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-2xs hover:bg-slate-50 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Categories</span>
      </button>

      {/* Category Hero Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 border border-slate-200 bg-gradient-to-r ${activeCategory.gradientBg} bg-white shadow-2xs space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              {activeCategory.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${activeCategory.badgeColor}`}>
                  {activeCategory.name} Track
                </span>
                {user?.track === activeCategory.id && (
                  <span className="text-[10px] font-black bg-indigo-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Your Enrolled Track
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {activeCategory.name} Practical Labs
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs text-xs">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold block">Track Completion</span>
              <strong className="text-emerald-700 font-black">
                {activeStats.completedCount} / {activeStats.totalLabs} Solved
              </strong>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black text-xs">
              {activeStats.totalLabs > 0 ? Math.round((activeStats.completedCount / activeStats.totalLabs) * 100) : 0}%
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          {activeCategory.description}
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search labs by title, topic, or required skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Labs
            </button>
            <button
              onClick={() => setStatusFilter('not_started')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                statusFilter === 'not_started' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Not Started
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                statusFilter === 'in_progress' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                statusFilter === 'completed' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            className="p-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-700 text-xs focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Lab Cards Grid */}
      {categoryLabs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryLabs.map((lab, index) => {
            const inst = LabService.getActiveInstance(lab.id);
            const isSolved = (lab.flags.length > 0 && lab.flags.every((f) => inst.solvedFlagIds.includes(f.id))) || inst.solvedFlagIds.length >= lab.flags.length;
            const isInProgress = inst.solvedFlagIds.length > 0 && !isSolved;

            return (
              <div
                key={lab.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative"
              >
                <div className="space-y-3">
                  {/* Top Bar Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 uppercase tracking-wider">
                      Lab #{index + 1}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        +{lab.xp} XP
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 capitalize">
                        {lab.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                      {lab.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {lab.scenario}
                    </p>
                  </div>

                  {/* Related Challenge Link Badge */}
                  {lab.relatedChallengeDays && lab.relatedChallengeDays.length > 0 && (
                    <div className="bg-indigo-50/80 p-2 rounded-xl border border-indigo-100 text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Related Challenge: Day {lab.relatedChallengeDays.join(', ')}</span>
                    </div>
                  )}

                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1">
                    {lab.requiredSkills.slice(0, 3).map((s, i) => (
                      <span key={i} className="text-[10px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>~{lab.estimatedMinutes} Mins</span>
                  </div>

                  <button
                    onClick={() => onSelectLab(lab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 ${
                      isSolved
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : isInProgress
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isSolved ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Review Lab</span>
                      </>
                    ) : isInProgress ? (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Continue Lab</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Start Lab</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3 max-w-md mx-auto">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No Matching Labs Found</h3>
          <p className="text-xs text-slate-500">
            No labs match your active filter parameters. Try clearing your search query or switching filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setDifficultyFilter('all');
            }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
