import React, { useState } from 'react';
import { Lab, LabCategory, RealisticAppType, DifficultyLevel } from '../../types/lab';
import { LabService } from '../../services/labService';
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
  CreditCard,
  Activity,
  GraduationCap,
  ShoppingBag,
  Cloud,
  Code,
  Cpu,
  ShieldCheck,
  Plus,
  Sparkles,
  Layers,
  CheckSquare
} from 'lucide-react';

interface LabCatalogViewProps {
  onSelectLab: (labId: string) => void;
  onOpenAuthorStudio: () => void;
  onRunQASuite: () => void;
}

export const LabCatalogView: React.FC<LabCatalogViewProps> = ({
  onSelectLab,
  onOpenAuthorStudio,
  onRunQASuite
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const labs = LabService.getLabs({
    category: selectedCategory !== 'all' ? (selectedCategory as LabCategory) : undefined,
    difficulty: selectedDifficulty !== 'all' ? (selectedDifficulty as DifficultyLevel) : undefined,
    search: searchQuery
  });

  const getAppIcon = (appType: RealisticAppType) => {
    switch (appType) {
      case 'corporate_portal': return <Building className="w-4 h-4 text-indigo-600" />;
      case 'bank_dashboard': return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'hospital_system': return <Activity className="w-4 h-4 text-sky-600" />;
      case 'learning_management': return <GraduationCap className="w-4 h-4 text-indigo-600" />;
      case 'ecommerce_platform': return <ShoppingBag className="w-4 h-4 text-rose-600" />;
      case 'cloud_dashboard': return <Cloud className="w-4 h-4 text-purple-600" />;
      case 'git_repository': return <Code className="w-4 h-4 text-amber-600" />;
      case 'iot_dashboard': return <Cpu className="w-4 h-4 text-teal-600" />;
      default: return <Server className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Title Hero */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            Production Practical Lab Ecosystem
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Realistic Production Environment Labs
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Experience realistic company environments—corporate portals, banking systems, cloud consoles, hospital networks, and e-commerce platforms. Solvable, resettable, and dockerized.
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
              <span>Author Studio & Cloning</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search labs by keyword, skill, or application..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3 text-xs">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-700 focus:outline-none"
            >
              <option value="all">All Lab Categories</option>
              <option value="investigation">Investigation Labs</option>
              <option value="api">API Labs</option>
              <option value="scenario">Scenario Labs</option>
              <option value="guided">Guided Labs</option>
              <option value="practice">Practice Labs</option>
              <option value="boss">Boss Labs</option>
              <option value="multi_container">Multi-Container Labs</option>
              <option value="discovery">Discovery Labs</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-700 focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lab Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => {
          const inst = LabService.getActiveInstance(lab.id);
          const isSolved = lab.flags.length > 0 && lab.flags.every((f) => inst.solvedFlagIds.includes(f.id));

          return (
            <div
              key={lab.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-800">
                    {getAppIcon(lab.appType)}
                    <span>{lab.appType.replace('_', ' ')}</span>
                  </span>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    +{lab.xp} XP
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                    {lab.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {lab.scenario}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {lab.requiredSkills.slice(0, 3).map((s, i) => (
                    <span key={i} className="text-[10px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>~{lab.estimatedMinutes} Mins</span>
                </div>

                <button
                  onClick={() => onSelectLab(lab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 ${
                    isSolved
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isSolved ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Review Lab</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Launch Lab</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
