import React, { useState, useEffect } from 'react';
import { Lab, ActiveLabInstance, LabFlag, HintType } from '../../types/lab';
import { LabService } from '../../services/labService';
import { AppContainer } from './apps/AppContainer';
import { LabTerminal } from './LabTerminal';
import { DockerInspector } from './DockerInspector';
import {
  ArrowLeft,
  Clock,
  Award,
  ShieldAlert,
  HelpCircle,
  FileText,
  Terminal as TerminalIcon,
  Server,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  RefreshCw,
  Download,
  BookOpen,
  Bookmark,
  Sparkles,
  Send,
  Eye,
  ChevronRight,
  Zap,
  RotateCcw
} from 'lucide-react';

interface LabDashboardProps {
  labId: string;
  onBackToCatalog: () => void;
  onUpdateXP?: (xpDelta: number) => void;
}

export const LabDashboard: React.FC<LabDashboardProps> = ({ labId, onBackToCatalog, onUpdateXP }) => {
  const [lab, setLab] = useState<Lab | undefined>(() => LabService.getLab(labId));
  const [activeInstance, setActiveInstance] = useState<ActiveLabInstance>(() => LabService.getActiveInstance(labId));

  const [activeTab, setActiveTab] = useState<'app' | 'terminal' | 'docker' | 'files' | 'hints' | 'writeup' | 'notes'>('app');
  const [flagInput, setFlagInput] = useState('');
  const [flagFeedback, setFlagFeedback] = useState<{ success?: boolean; message?: string }>({});
  const [userNotes, setUserNotes] = useState(activeInstance.userNotes || '');

  const [isInstructorOverride, setIsInstructorOverride] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const freshLab = LabService.getLab(labId);
    setLab(freshLab);
    if (freshLab) {
      setActiveInstance(LabService.getActiveInstance(freshLab.id));
    }
  }, [labId]);

  if (!lab) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Lab Not Found</h2>
        <button onClick={onBackToCatalog} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
          Back to Lab Catalog
        </button>
      </div>
    );
  }

  const isLabCompleted = lab.flags.every((f) => activeInstance.solvedFlagIds.includes(f.id));

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFlagFeedback({});

    const res = LabService.validateFlag(lab.id, flagInput);
    setFlagFeedback({ success: res.success, message: res.message });

    if (res.success) {
      setFlagInput('');
      const updatedInst = LabService.getActiveInstance(lab.id);
      setActiveInstance(updatedInst);
      if (res.pointsAwarded > 0 && onUpdateXP) {
        onUpdateXP(res.pointsAwarded);
      }
    }
  };

  const handleUnlockHint = (hintId: string) => {
    const res = LabService.unlockHint(lab.id, hintId);
    if (res.success) {
      setActiveInstance({ ...res.instance });
    }
  };

  const handleResetRuntime = () => {
    if (confirm('Are you sure you want to reset this lab runtime to clean default state?')) {
      const resetInst = LabService.resetInstance(lab.id);
      setActiveInstance(resetInst);
      setFlagFeedback({ success: true, message: 'Lab environment restored to pristine initial snapshot.' });
    }
  };

  const handleSaveNotes = (val: string) => {
    setUserNotes(val);
    LabService.saveNotes(lab.id, val);
  };

  const handleAppendTerminalLog = (cmdLine: string, output: string) => {
    LabService.appendTerminalLog(lab.id, cmdLine);
    LabService.appendTerminalLog(lab.id, output);
    setActiveInstance(LabService.getActiveInstance(lab.id));
  };

  const handleClearTerminal = () => {
    const inst = LabService.getActiveInstance(lab.id);
    inst.terminalHistory = [];
    LabService.saveActiveInstance(inst);
    setActiveInstance(inst);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToCatalog}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-2xs hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Lab Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2.5 rounded-xl border transition-all ${
              isBookmarked ? 'bg-amber-50 text-amber-600 border-amber-300' : 'bg-white text-slate-500 border-slate-200'
            }`}
            title="Bookmark Lab"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetRuntime}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Lab</span>
          </button>
        </div>
      </div>

      {/* Main Lab Info Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-900 text-white uppercase tracking-wider">
              {lab.category.replace('_', ' ')} LAB
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200/80 capitalize">
              {lab.appType.replace('_', ' ')}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 capitalize">
              {lab.difficulty}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              +{lab.xp} XP
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>~{lab.estimatedMinutes} Mins</span>
            </div>
            {isLabCompleted ? (
              <span className="flex items-center gap-1 font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Solved
              </span>
            ) : (
              <span className="font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                In Progress
              </span>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">{lab.title}</h1>
        </div>

        {/* Learning Clarity Structure (Scenario -> Mission -> Acceptance Criteria -> Why It Matters -> What You Will Learn) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
          {/* Left Column: Real-World Scenario & Mission */}
          <div className="space-y-3">
            <div className="bg-indigo-50/80 border border-indigo-100 p-4 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                  🏢 Real-World Scenario
                </span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-md">Context</span>
              </div>
              <p className="text-slate-800 leading-relaxed font-medium">
                {lab.scenario}
              </p>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-xl space-y-1.5 shadow-xs">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
                🎯 Your Mission
              </span>
              <p className="text-xs font-bold text-slate-100 leading-relaxed">
                {lab.objectives[0] || 'Fix the issue in the interactive environment below.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider block">
                🧠 What You Will Learn
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lab.requiredSkills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold text-[11px]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Why This Matters & Acceptance Criteria */}
          <div className="space-y-3">
            <div className="bg-emerald-50/80 border border-emerald-100 p-4 rounded-xl space-y-1.5">
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                💡 Why This Matters in Production
              </span>
              <p className="text-slate-800 leading-relaxed font-medium">
                {lab.whyItMatters || 'Fixing layout overflows and API edge cases ensures your application delivers an uncompromising experience to all users across devices and networks.'}
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 p-4 rounded-xl space-y-2 shadow-2xs">
              <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider block">
                📋 Acceptance Criteria
              </span>
              <ul className="space-y-2">
                {lab.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-100 text-slate-800">
                    <input
                      type="checkbox"
                      checked={isLabCompleted}
                      readOnly
                      className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-medium text-xs">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Validation / Solution Checking Console */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {lab.trackCategory === 'cybersecurity' || lab.category === 'mini_ctf' ? (
              <>
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Security Flag Submission Console</h3>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Solution Verification Console</h3>
              </>
            )}
          </div>
          <span className="text-xs text-slate-400">
            {lab.trackCategory === 'cybersecurity' || lab.category === 'mini_ctf' ? (
              <>
                Solved: <strong className="text-emerald-400">{activeInstance.solvedFlagIds.length}</strong> / {lab.flags.length} Flags
              </>
            ) : (
              <>
                Lab Status: <strong className={isLabCompleted ? 'text-emerald-400' : 'text-amber-400'}>
                  {isLabCompleted ? '🎉 Verified & Completed' : 'In Progress'}
                </strong>
              </>
            )}
          </span>
        </div>

        {lab.trackCategory === 'cybersecurity' || lab.category === 'mini_ctf' ? (
          <form onSubmit={handleFlagSubmit} className="flex flex-wrap sm:flex-nowrap gap-2">
            <input
              type="text"
              placeholder="WEBFORGE{...}"
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              className="flex-1 bg-slate-950 text-emerald-400 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Security Flag</span>
            </button>
          </form>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-300">
              {isLabCompleted ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  All acceptance criteria verified! You earned +{lab.xp} XP.
                </span>
              ) : (
                <span>Complete the tasks in the interactive workspace tab, then verify your solution.</span>
              )}
            </div>

            <button
              onClick={() => {
                const res = LabService.completeLab(lab.id);
                if (res.success) {
                  const updatedInst = LabService.getActiveInstance(lab.id);
                  setActiveInstance(updatedInst);
                  if (res.pointsAwarded > 0 && onUpdateXP) {
                    onUpdateXP(res.pointsAwarded);
                  }
                  setFlagFeedback({
                    success: true,
                    message: `🎉 Challenge Complete! Verified all acceptance criteria. +${lab.xp} XP awarded.`
                  });
                }
              }}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Check My Solution</span>
            </button>
          </div>
        )}

        {flagFeedback.message && (
          <div
            className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
              flagFeedback.success ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}
          >
            {flagFeedback.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
            <span>{flagFeedback.message}</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => setActiveTab('app')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'app' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Live Production App</span>
        </button>

        <button
          onClick={() => setActiveTab('terminal')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'terminal' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <TerminalIcon className="w-3.5 h-3.5" />
          <span>Terminal Shell</span>
        </button>

        <button
          onClick={() => setActiveTab('docker')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'docker' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Docker Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'files' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Files & Assets ({lab.assets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hints')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'hints' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Progressive Hints ({activeInstance.unlockedHintIds.length}/{lab.hints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('writeup')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'writeup' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Solution Writeup</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'notes' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Notes</span>
        </button>
      </div>

      {/* Main Tab Panel Content */}
      <div className="space-y-6">
        {activeTab === 'app' && <AppContainer lab={lab} />}

        {activeTab === 'terminal' && (
          <LabTerminal
            lab={lab}
            history={activeInstance.terminalHistory}
            onCommandRun={handleAppendTerminalLog}
            onClear={handleClearTerminal}
          />
        )}

        {activeTab === 'docker' && (
          <DockerInspector
            lab={lab}
            onRestartContainer={() => alert('Container restarted successfully.')}
            onResetRuntime={handleResetRuntime}
          />
        )}

        {activeTab === 'files' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Downloadable Lab Files & Source Configs</h3>
            {lab.assets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lab.assets.map((asset) => (
                  <div key={asset.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs font-mono">{asset.name}</span>
                      <span className="text-[10px] text-slate-500">{asset.size}</span>
                    </div>
                    <p className="text-xs text-slate-600">{asset.description}</p>
                    <button
                      onClick={() => {
                        const blob = new Blob([asset.content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = asset.name;
                        a.click();
                      }}
                      className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download File</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No external files provided for this lab. All assets are served via live containers.</p>
            )}
          </div>
        )}

        {activeTab === 'hints' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Progressive Hint Ladder</h3>
            <p className="text-xs text-slate-500">
              Hints unlock sequentially to guide your thinking without revealing the answer outright.
            </p>

            <div className="space-y-3">
              {lab.hints.map((hint, idx) => {
                const isUnlocked = activeInstance.unlockedHintIds.includes(hint.id);
                return (
                  <div
                    key={hint.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isUnlocked ? 'bg-indigo-50/60 border-indigo-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
                        {isUnlocked ? <Unlock className="w-4 h-4 text-indigo-600" /> : <Lock className="w-4 h-4 text-slate-400" />}
                        {hint.title} ({hint.type.toUpperCase()})
                      </span>

                      {!isUnlocked && (
                        <button
                          onClick={() => handleUnlockHint(hint.id)}
                          className="text-xs font-bold text-indigo-600 bg-white hover:bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg transition-all"
                        >
                          Unlock Hint
                        </button>
                      )}
                    </div>

                    {isUnlocked ? (
                      <p className="text-xs text-slate-700 mt-2 leading-relaxed">{hint.content}</p>
                    ) : (
                      <p className="text-xs text-slate-400 italic mt-1">Hint content locked.</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'writeup' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Lab Official Solution & Writeup
              </h3>

              <button
                onClick={() => setIsInstructorOverride(!isInstructorOverride)}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg"
              >
                {isInstructorOverride ? 'Disable Override' : 'Instructor Override'}
              </button>
            </div>

            {isLabCompleted || isInstructorOverride ? (
              <div className="space-y-5 text-xs text-slate-800 leading-relaxed">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">1. Investigation Phase</h4>
                  <p className="text-slate-700">{lab.writeup.investigation}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">2. Vulnerability Discovery</h4>
                  <p className="text-slate-700">{lab.writeup.discovery}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">3. Technical Reasoning</h4>
                  <p className="text-slate-700">{lab.writeup.reasoning}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">4. Exploitation Steps</h4>
                  <p className="text-slate-700">{lab.writeup.exploitation}</p>
                  {lab.writeup.codeSnippet && (
                    <pre className="mt-3 p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto">
                      {lab.writeup.codeSnippet}
                    </pre>
                  )}
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-emerald-900">
                  <h4 className="font-bold text-emerald-950 text-xs mb-1">5. Remediation & Mitigation</h4>
                  <p>{lab.writeup.mitigation}</p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <Lock className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">Writeup Locked</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Solve the lab by submitting all flags or enable Instructor Override mode to reveal the step-by-step writeup.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Lab Scratchpad & Research Notes</h3>
            <textarea
              rows={8}
              value={userNotes}
              onChange={(e) => handleSaveNotes(e.target.value)}
              placeholder="Record your observation notes, payload strings, and command outputs here..."
              className="w-full p-3 border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};
