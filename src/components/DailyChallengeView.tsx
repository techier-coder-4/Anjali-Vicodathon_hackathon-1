import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Challenge, CheckpointData } from '../types';
import { AIMentor } from './AIMentor';
import { CheckCircle2, Circle, Clock, ShieldCheck, Github, Linkedin, ArrowLeft, ArrowRight, Sparkles, HelpCircle, Check, AlertCircle } from 'lucide-react';

interface DailyChallengeViewProps {
  challenge: Challenge;
  onBackToDashboard: () => void;
  onNavigateDay: (dayId: number) => void;
}

export const DailyChallengeView: React.FC<DailyChallengeViewProps> = ({
  challenge,
  onBackToDashboard,
  onNavigateDay
}) => {
  const { toggleRequirement, submitProofOfWork, updateUnderstandingStatus, getDayProgress } = useAuth();

  const dayProg = getDayProgress(challenge.dayId);

  const [repoUrl, setRepoUrl] = useState(dayProg.repoUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(dayProg.linkedinUrl || '');

  // Checkpoint reflection form state
  const isCheckpointDay = challenge.dayId % 3 === 0;
  const [learnedAnswer, setLearnedAnswer] = useState(dayProg.checkpointData?.learned || '');
  const [usageAnswer, setUsageAnswer] = useState(dayProg.checkpointData?.usage || '');
  const [confusingAnswer, setConfusingAnswer] = useState(dayProg.checkpointData?.confusing || '');

  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  useEffect(() => {
    setRepoUrl(dayProg.repoUrl || '');
    setLinkedinUrl(dayProg.linkedinUrl || '');
    setLearnedAnswer(dayProg.checkpointData?.learned || '');
    setUsageAnswer(dayProg.checkpointData?.usage || '');
    setConfusingAnswer(dayProg.checkpointData?.confusing || '');
    setSubmitError('');
    setSubmitSuccess(dayProg.activityStatus === 'submitted');
  }, [challenge.dayId, dayProg]);

  const checkedCount = (dayProg.checkedRequirements || []).length;
  const totalReqs = challenge.requirements.length;
  const reqPercent = totalReqs > 0 ? Math.round((checkedCount / totalReqs) * 100) : 0;

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!repoUrl.trim()) {
      setSubmitError('Please provide a GitHub repository or commit link.');
      return;
    }

    if (!linkedinUrl.trim()) {
      setSubmitError('Please provide a LinkedIn post link.');
      return;
    }

    let checkpointData: CheckpointData | undefined = undefined;
    if (isCheckpointDay) {
      if (!learnedAnswer.trim() || !usageAnswer.trim()) {
        setSubmitError('Please complete the 3rd-day reflection questions.');
        return;
      }
      checkpointData = {
        learned: learnedAnswer,
        usage: usageAnswer,
        confusing: confusingAnswer
      };
    }

    const newAchievements = submitProofOfWork(
      challenge.dayId,
      repoUrl,
      linkedinUrl,
      checkpointData
    );

    setSubmitSuccess(true);
    setUnlockedBadges(newAchievements);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb / Nav Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBackToDashboard}
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-2xs hover:bg-slate-50 transition-all min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {challenge.dayId > 1 && (
            <button
              onClick={() => onNavigateDay(challenge.dayId - 1)}
              className="p-2.5 text-slate-600 hover:text-slate-900 bg-white rounded-xl border border-slate-200/80 hover:bg-slate-50 min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Previous Day"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <span className="text-xs font-extrabold text-slate-900 px-3 py-2 bg-slate-100 rounded-xl">
            Day {challenge.dayId} of 60
          </span>

          {challenge.dayId < 60 && (
            <button
              onClick={() => onNavigateDay(challenge.dayId + 1)}
              className="p-2.5 text-slate-600 hover:text-slate-900 bg-white rounded-xl border border-slate-200/80 hover:bg-slate-50 min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Next Day"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Challenge Header */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-900 text-white uppercase tracking-wider">
              DAY {challenge.dayId}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 capitalize">
              {challenge.challengeType}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-slate-700 capitalize">
              {challenge.difficulty}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>~{challenge.estimatedMinutes} Mins</span>
            </div>

            {/* Separate Activity Status */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Activity:</span>
              <span
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${
                  dayProg.activityStatus === 'submitted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : dayProg.activityStatus === 'missed'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-gray-100 text-slate-700'
                }`}
              >
                {dayProg.activityStatus}
              </span>
            </div>

            {/* Separate Understanding Status */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Understanding:</span>
              <span
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${
                  dayProg.understandingStatus === 'understood'
                    ? 'bg-slate-900 text-white'
                    : dayProg.understandingStatus === 'needs_revisiting'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-gray-100 text-slate-600'
                }`}
              >
                {dayProg.understandingStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{challenge.stageName}</p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{challenge.title}</h1>
          <p className="text-slate-600 text-sm leading-relaxed">{challenge.description}</p>
        </div>
      </div>

      {/* Main Grid: Left Column = Challenge Details & Form, Right Column = AI Mentor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* REAL-WORLD CONTEXT SCENARIO */}
          <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-2xs space-y-3 bg-gradient-to-r from-indigo-50/50 via-white to-sky-50/30">
            <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Imagine this...</span>
            </div>
            <p className="text-slate-800 text-sm font-medium leading-relaxed">
              {challenge.whyItMatters || challenge.description}
            </p>
            <p className="text-xs text-slate-500">
              Today you'll learn how engineering principles solve this real-world production challenge hands-on.
            </p>
          </div>

          {/* Goals & Why It Matters */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">What You'll Learn</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{challenge.learningObjective}</p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1">
                <h3 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider">Why This Matters</h3>
                <p className="text-xs text-indigo-800 leading-relaxed">{challenge.whyItMatters}</p>
              </div>
            </div>

            {/* CURIOSITY CHALLENGE BOX */}
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Today's Curiosity Challenge</span>
              </div>
              <p className="text-amber-900 font-medium text-sm italic">
                "{challenge.curiosityPrompt}"
              </p>
              <p className="text-[11px] text-amber-700">
                Experiment with this scenario in your code before submitting!
              </p>
            </div>
          </div>

          {/* REQUIREMENTS CHECKLIST */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">What You Need To Do</h3>
                <p className="text-xs text-slate-500">Check off requirements as you complete them in your code</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-slate-900">{checkedCount}/{totalReqs}</span>
                <span className="text-xs text-slate-400 font-medium ml-1">({reqPercent}%)</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-slate-900 h-full rounded-full transition-all duration-300"
                style={{ width: `${reqPercent}%` }}
              />
            </div>

            {/* Checklist Items */}
            <div className="space-y-2 pt-2">
              {challenge.requirements.map((req, idx) => {
                const isChecked = (dayProg.checkedRequirements || []).includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleRequirement(challenge.dayId, idx)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      isChecked
                        ? 'bg-gray-50 border-gray-300 text-slate-900'
                        : 'bg-white border-gray-200/80 hover:bg-gray-50 text-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-slate-900 fill-amber-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <span className={`text-xs sm:text-sm font-medium leading-normal ${isChecked ? 'line-through text-slate-400' : ''}`}>
                      {req}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CHECKPOINT REFLECTION (Every 3rd Day) */}
          {isCheckpointDay && (
            <div className="bg-white rounded-2xl border border-indigo-200/80 shadow-2xs p-6 space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Every 3rd Day Reflection Checkpoint</span>
              </div>
              <p className="text-sm font-extrabold text-slate-900">
                Lightweight Checkpoint — "What did you actually learn?"
              </p>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    1. What did you actually learn today?
                  </label>
                  <textarea
                    rows={2}
                    value={learnedAnswer}
                    onChange={(e) => setLearnedAnswer(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    placeholder="Describe the key concept in your own words..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    2. Where could you use this concept in a real project?
                  </label>
                  <textarea
                    rows={2}
                    value={usageAnswer}
                    onChange={(e) => setUsageAnswer(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    placeholder="e.g. When handling user authentication token refreshes or pagination..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    3. What part is still confusing or needs revisiting?
                  </label>
                  <textarea
                    rows={2}
                    value={confusingAnswer}
                    onChange={(e) => setConfusingAnswer(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    placeholder="Optional: Note any edge cases you want to revisit later..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* PROOF OF WORK SUBMISSION FORM */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Proof of Work Submission</h3>
                <p className="text-xs text-slate-500">Provide verifiable proof of your implementation to complete Day {challenge.dayId}</p>
              </div>
            </div>

            {submitError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1">
                <p className="font-extrabold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Submitted Successfully! Challenge Status: Completed</span>
                </p>
                {unlockedBadges.length > 0 && (
                  <p className="text-emerald-700 font-medium">
                    🎉 Achievement Unlocked: {unlockedBadges.join(', ')}
                  </p>
                )}
              </div>
            )}

            <form onSubmit={handleSubmitProof} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  GitHub Repository / Code Link *
                </label>
                <div className="relative">
                  <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/yourusername/abtalks-60days/day-1"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              {challenge.trackId === 'frontend' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Live Demo / Vercel / Netlify URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://my-frontend-demo.vercel.app"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              )}

              {challenge.trackId === 'backend' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    API Endpoint / Health Route (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://my-backend-api.onrender.com/api/v1/health"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  LinkedIn Progress Post Link *
                </label>
                <div className="relative">
                  <Linkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/posts/yourprofile_abtalks60days-day1"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateUnderstandingStatus(challenge.dayId, 'understood')}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-colors flex-1 sm:flex-none min-h-[40px] ${
                      dayProg.understandingStatus === 'understood'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    I Understood This
                  </button>

                  <button
                    type="button"
                    onClick={() => updateUnderstandingStatus(challenge.dayId, 'needs_revisiting')}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-colors flex-1 sm:flex-none min-h-[40px] ${
                      dayProg.understandingStatus === 'needs_revisiting'
                        ? 'bg-amber-500 text-white border-amber-400'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    Needs Revisiting
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-2xs flex items-center justify-center gap-2 transition-transform hover:scale-102 min-h-[44px]"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Submit Proof of Work</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (5 cols) = AI LEARNING MENTOR */}
        <div className="lg:col-span-5 sticky top-20">
          <AIMentor challenge={challenge} />
        </div>
      </div>
    </div>
  );
};
