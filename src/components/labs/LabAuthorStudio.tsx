import React, { useState } from 'react';
import { Lab, LabCategory, RealisticAppType, DifficultyLevel, LabLifecycleStatus } from '../../types/lab';
import { LabService } from '../../services/labService';
import {
  ArrowLeft,
  Copy,
  Plus,
  Save,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Layers,
  Settings,
  Code,
  FileText,
  ShieldCheck,
  Tag
} from 'lucide-react';

interface LabAuthorStudioProps {
  onBackToCatalog: () => void;
  onOpenLab: (labId: string) => void;
}

export const LabAuthorStudio: React.FC<LabAuthorStudioProps> = ({ onBackToCatalog, onOpenLab }) => {
  const [labs, setLabs] = useState<Lab[]>(() => LabService.getLabs());
  const [selectedLab, setSelectedLab] = useState<Lab | null>(labs[0] || null);
  const [cloneTitleInput, setCloneTitleInput] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const handleCloneLab = () => {
    if (!selectedLab) return;
    try {
      const cloned = LabService.cloneLabTemplate(selectedLab.id, cloneTitleInput || `Cloned: ${selectedLab.title}`);
      setLabs(LabService.getLabs());
      setSelectedLab(cloned);
      setNotification(`Lab cloned successfully! Created new draft "${cloned.title}" (${cloned.id}).`);
      setCloneTitleInput('');
    } catch (e: any) {
      alert(`Cloning error: ${e.message}`);
    }
  };

  const handleSaveLab = () => {
    if (!selectedLab) return;
    selectedLab.updatedAt = new Date().toISOString();
    LabService.saveCustomLab(selectedLab);
    setNotification(`Lab configuration saved! Updated version: ${selectedLab.version}.`);
  };

  const handleRunQA = () => {
    if (!selectedLab) return;
    const qaRes = LabService.runQATestSuite(selectedLab.id);
    setSelectedLab(LabService.getLab(selectedLab.id) || selectedLab);
    if (qaRes.passed) {
      setNotification(`QA Automated Test Suite PASSED! 12/12 validation checks green.`);
    } else {
      setNotification(`QA Test Suite FAILED. Please review missing flags or writeups.`);
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={onBackToCatalog}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-2xs hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          {selectedLab && (
            <button
              onClick={() => onOpenLab(selectedLab.id)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Preview Lab Runtime</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md space-y-2">
        <h1 className="text-xl font-extrabold flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Author Studio & Template Cloning Engine
        </h1>
        <p className="text-xs text-slate-300">
          Clone existing production applications, configure flags, hints, writeups, Docker specs, and manage lifecycle stages (Draft → Local Test → Automated Validation → Published).
        </p>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-emerald-400">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Lab Selector List */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Select Application / Lab Template</h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {labs.map((l) => (
              <div
                key={l.id}
                onClick={() => setSelectedLab(l)}
                className={`p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                  selectedLab?.id === l.id
                    ? 'border-indigo-600 bg-indigo-50/60 font-bold text-indigo-900'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{l.title}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    {l.status}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">{l.id} • v{l.version}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Clone Selected Template:</label>
            <input
              type="text"
              placeholder="New Lab Title..."
              value={cloneTitleInput}
              onChange={(e) => setCloneTitleInput(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:outline-none"
            />
            <button
              onClick={handleCloneLab}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Clone Selected Application</span>
            </button>
          </div>
        </div>

        {/* Right Editor Form */}
        {selectedLab ? (
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-extrabold text-slate-900 text-base">Editing: {selectedLab.title}</h2>
                <span className="text-[11px] font-mono text-slate-400">{selectedLab.id}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunQA}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Run QA Test</span>
                </button>

                <button
                  onClick={handleSaveLab}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Lab</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title:</label>
                <input
                  type="text"
                  value={selectedLab.title}
                  onChange={(e) => setSelectedLab({ ...selectedLab, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lifecycle Status:</label>
                <select
                  value={selectedLab.status}
                  onChange={(e) => setSelectedLab({ ...selectedLab, status: e.target.value as LabLifecycleStatus })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="local_test">Local Test</option>
                  <option value="automated_validation">Automated Validation</option>
                  <option value="peer_review">Peer Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Version:</label>
                <input
                  type="text"
                  value={selectedLab.version}
                  onChange={(e) => setSelectedLab({ ...selectedLab, version: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">XP Points:</label>
                <input
                  type="number"
                  value={selectedLab.xp}
                  onChange={(e) => setSelectedLab({ ...selectedLab, xp: parseInt(e.target.value) || 100 })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Scenario Description:</label>
              <textarea
                rows={3}
                value={selectedLab.scenario}
                onChange={(e) => setSelectedLab({ ...selectedLab, scenario: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 text-xs">Flag Configuration</h4>
              {selectedLab.flags.map((f, i) => (
                <div key={f.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <input
                    type="text"
                    value={f.flagValue}
                    onChange={(e) => {
                      const newFlags = [...selectedLab.flags];
                      newFlags[i].flagValue = e.target.value;
                      setSelectedLab({ ...selectedLab, flags: newFlags });
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono text-emerald-700 font-bold"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400">Select a lab template to edit or clone.</div>
        )}
      </div>
    </div>
  );
};
