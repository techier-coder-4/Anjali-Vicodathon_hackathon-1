import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ALL_ACHIEVEMENTS } from '../data/achievements';
import { getRoadmapForTrack } from '../data/curriculum';
import { TrackType, ExperienceLevel } from '../types';
import { Flame, Trophy, ShieldCheck, Github, Linkedin, Award, Layers, ExternalLink, Edit3, Save, X, GraduationCap, Building2, Clock, CheckCircle2 } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, progress, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [graduationYear, setGraduationYear] = useState(user?.graduationYear || '2026');
  const [track, setTrack] = useState<TrackType>(user?.track || 'frontend');
  const [level, setLevel] = useState<ExperienceLevel>(user?.experienceLevel || 'beginner');
  const [primaryGoal, setPrimaryGoal] = useState(user?.primaryGoal || '');
  const [dailyTimeGoal, setDailyTimeGoal] = useState(user?.dailyTimeGoal || '30 mins');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const roadmap = getRoadmapForTrack(user?.track || 'frontend');
  const completedCount = progress.completedDays.length;
  const progressPercent = Math.round((completedCount / 60) * 100);
  const unlockedSet = new Set(progress.unlockedAchievementIds);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateUserProfile({
      name: name.trim(),
      college: college.trim(),
      graduationYear,
      track,
      experienceLevel: level,
      primaryGoal,
      dailyTimeGoal
    });

    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-gray-200 shadow-2xs"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{user?.name}</h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 uppercase">
                  {user?.persona || 'Active'} Student
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium">{user?.email}</p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold">
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 capitalize border border-slate-200">
                  Track: {user?.track || 'Frontend'}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 capitalize border border-slate-200">
                  Level: {user?.experienceLevel || 'Beginner'}
                </span>
                {user?.college && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200/80 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-indigo-600" />
                    {user.college}
                  </span>
                )}
                {user?.graduationYear && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-900 border border-purple-200/80 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-purple-600" />
                    Class of {user.graduationYear}
                  </span>
                )}
                {user?.dailyTimeGoal && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/80 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    {user.dailyTimeGoal}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col items-end gap-3 text-right">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-extrabold shadow-2xs">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{progress.currentStreak} Day Streak</span>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
            >
              {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Edit Form Drawer */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-200 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-extrabold text-slate-900">Update Profile Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Delhi Technological University"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Year</label>
                <select
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900 outline-hidden"
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Learning Track</label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value as TrackType)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900 outline-hidden"
                >
                  <option value="frontend">Frontend Engineering</option>
                  <option value="backend">Backend Systems</option>
                  <option value="fullstack">Full-Stack Web</option>
                  <option value="python">Python Development</option>
                  <option value="data-ai">Data & AI Engineering</option>
                  <option value="java">Java Engineering</option>
                  <option value="cybersecurity">Cybersecurity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Experience Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as ExperienceLevel)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900 outline-hidden"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Daily Time Goal</label>
                <select
                  value={dailyTimeGoal}
                  onChange={(e) => setDailyTimeGoal(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900 outline-hidden"
                >
                  <option value="20 mins">20 Mins / Day</option>
                  <option value="30 mins">30 Mins / Day</option>
                  <option value="45 mins">45 Mins / Day</option>
                  <option value="60+ mins">60+ Mins / Day</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary 60-Day Goal Statement</label>
              <textarea
                rows={2}
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900 outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </form>
        ) : (
          /* Primary Goal Statement */
          <div className="mt-6 pt-6 border-t border-gray-100 p-4 rounded-xl bg-gray-50 border border-gray-200/60 space-y-1">
            <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Primary 60-Day Goal</p>
            <p className="text-xs text-slate-700 italic">"{user?.primaryGoal || 'Build daily habits and an engineering portfolio.'}"</p>
          </div>
        )}
      </div>

      {/* Progress & Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Stats Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Challenge Progress</span>
          </h3>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between text-xs font-bold">
              <span className="text-2xl font-black text-slate-900">{progressPercent}%</span>
              <span className="text-slate-500">{completedCount} / 60 Completed</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-600 space-y-1.5">
            <p className="flex justify-between">
              <span>Active Streak:</span>
              <span className="font-bold text-slate-900">{progress.currentStreak} days</span>
            </p>
            <p className="flex justify-between">
              <span>Longest Streak:</span>
              <span className="font-bold text-slate-900">{progress.longestStreak} days</span>
            </p>
            <p className="flex justify-between">
              <span>Missed Days:</span>
              <span className="font-bold text-slate-900">{progress.missedDays.length}</span>
            </p>
          </div>
        </div>

        {/* Badges / Achievements List (2 cols) */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-purple-600" />
            <span>Unlocked Achievements ({unlockedSet.size} / {ALL_ACHIEVEMENTS.length})</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ALL_ACHIEVEMENTS.map((ach) => {
              const isUnlocked = unlockedSet.has(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border text-center space-y-1 transition-all ${
                    isUnlocked
                      ? 'bg-purple-50/60 border-purple-200/80 text-purple-950'
                      : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center font-bold text-xs ${
                    isUnlocked ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <p className="font-bold text-xs line-clamp-1">{ach.title}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">{ach.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Completed Challenges & Proof Archive */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Proof of Work Archive ({progress.completedDays.length} Submissions)</span>
        </h3>

        {progress.completedDays.length === 0 ? (
          <p className="text-xs text-slate-500 italic p-4 text-center">No completed challenges submitted yet. Complete Day 1 to build your proof portfolio!</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {progress.completedDays.map((dayNum) => {
              const challenge = roadmap.find((c) => c.dayId === dayNum);
              const dayProg = progress.dayProgresses[dayNum];
              if (!challenge) return null;

              return (
                <div key={dayNum} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        Day {dayNum}
                      </span>
                      <span className="font-bold text-slate-900">{challenge.title}</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">{challenge.stageName}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {dayProg?.repoUrl && (
                      <a
                        href={dayProg.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Repo Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {dayProg?.linkedinUrl && (
                      <a
                        href={dayProg.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
