import React, { useState } from 'react';
import { X, Sparkles, Check, Flame, ChevronRight, Plus, Trash2, BookOpen, Target, Calendar, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { JourneyService } from '../services/journeyService';

interface JourneySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateModal: () => void;
}

export const JourneySelectorModal: React.FC<JourneySelectorModalProps> = ({
  isOpen,
  onClose,
  onOpenCreateModal
}) => {
  const { user, journeys, activeJourneyId, switchActiveJourney, deleteJourney } = useAuth();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const journeyToDelete = journeys.find(j => j.id === confirmDeleteId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col relative">
        {/* Custom Confirmation Overlay when deleting */}
        {confirmDeleteId && journeyToDelete && (
          <div className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-slate-900">Delete Challenge?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-slate-900">"{journeyToDelete.title}"</span>?
                </p>
                <p className="text-[11px] text-rose-600 font-semibold pt-1">
                  This action cannot be undone and will erase all daily progress for this challenge.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteJourney(journeyToDelete.id);
                    setConfirmDeleteId(null);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md min-h-[44px] flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>My Learning Journeys</span>
              </h2>
              <p className="text-xs text-slate-400">Switch between track roadmaps and personal challenges</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: List of Journeys */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Journeys ({journeys.length})
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenCreateModal();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-all min-h-[36px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Challenge Yourself</span>
            </button>
          </div>

          <div className="space-y-3">
            {journeys.map((j) => {
              const isActive = j.id === activeJourneyId;
              const jProg = JourneyService.getJourneyProgress(user.id, j.id, user.track);
              const completedCount = jProg.completedDays.length;
              const isCustom = j.type === 'custom';

              return (
                <div
                  key={j.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600 shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        isCustom ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {isCustom ? 'Personal Challenge' : 'Organizer Track'}
                      </span>

                      {isActive && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-600 text-white flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Active Journey</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug truncate">
                      {j.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                      <span>Day {jProg.currentDay} / 60</span>
                      <span>•</span>
                      <span>{completedCount} Completed ({Math.round((completedCount / 60) * 100)}%)</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-bold text-amber-600">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{jProg.currentStreak}-Day Streak</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    {!isActive ? (
                      <button
                        onClick={() => {
                          switchActiveJourney(j.id);
                          onClose();
                        }}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all min-h-[40px]"
                      >
                        <span>Switch</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-xs font-extrabold text-indigo-700 bg-indigo-100 px-3 py-1.5 rounded-xl">
                        Currently Selected
                      </span>
                    )}

                    {isCustom && (
                      <button
                        onClick={() => setConfirmDeleteId(j.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center border border-transparent hover:border-rose-200"
                        title="Delete this personal challenge"
                        aria-label={`Delete ${j.title}`}
                      >
                        <Trash2 className="w-4 h-4 text-rose-500" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 font-medium">
            Completing challenges in one journey will never affect progress in other journeys.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
