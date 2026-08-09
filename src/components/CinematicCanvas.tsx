import React, { useMemo } from 'react';
import { VideoScriptSection, TrackType, Challenge } from '../types';

interface CinematicCanvasProps {
  track: TrackType;
  section: VideoScriptSection;
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  challengeTitle: string;
  challenge: Challenge;
  showCaptions?: boolean;
}

export const CinematicCanvas: React.FC<CinematicCanvasProps> = ({
  track,
  section,
  currentTime,
  totalDuration,
  isPlaying,
  showCaptions = true
}) => {
  const choreo = section.choreography || {};
  const statusState = choreo.statusState || 'normal';
  const progressRatio = totalDuration > 0 ? Math.min(1, Math.max(0, currentTime / totalDuration)) : 0;

  // Determine story act from narrative timing or section state
  const act = useMemo(() => {
    if (statusState === 'problem') return 'problem';
    if (statusState === 'breakthrough') return 'discovery';
    if (statusState === 'solution') return 'production';
    if (statusState === 'success') return 'payoff';
    if (progressRatio < 0.20) return 'hook';
    if (progressRatio < 0.40) return 'problem';
    if (progressRatio < 0.60) return 'discovery';
    if (progressRatio < 0.80) return 'production';
    return 'payoff';
  }, [progressRatio, statusState]);

  // Lighting & Mood Colors based on narrative act
  const themeColors = useMemo(() => {
    switch (act) {
      case 'hook':
        return { bgGlow: '#6366f1', ambient: '#0f172a', accent: '#818cf8' };
      case 'problem':
        return { bgGlow: '#f43f5e', ambient: '#450a0a', accent: '#fb7185' };
      case 'discovery':
        return { bgGlow: '#f59e0b', ambient: '#451a03', accent: '#fbbf24' };
      case 'production':
        return { bgGlow: '#10b981', ambient: '#064e3b', accent: '#34d399' };
      case 'payoff':
      default:
        return { bgGlow: '#3b82f6', ambient: '#0284c7', accent: '#60a5fa' };
    }
  }, [act]);

  // Camera Motion Math (Slow continuous push-in, pan, tilt)
  const cameraScale = 1.0 + (progressRatio * 0.12) + (act === 'problem' ? 0.05 : act === 'discovery' ? 0.08 : 0);
  const cameraPanX = Math.sin(progressRatio * Math.PI * 2) * 10;
  const cameraPanY = Math.cos(progressRatio * Math.PI * 2) * 5;

  // Continuous traveling particle pulse
  const pulsePos = (currentTime * 25) % 100;

  return (
    <div className="relative w-full h-full min-h-[320px] sm:min-h-[420px] bg-[#020408] overflow-hidden flex flex-col justify-between p-4 sm:p-6 select-none border border-slate-800/80 rounded-2xl shadow-2xl">
      {/* 1. CONTINUOUS MOODY CINEMATIC AMBIENT LIGHTING */}
      <div
        className="absolute inset-0 transition-all duration-1000 pointer-events-none opacity-40"
        style={{
          background: `radial-gradient(circle at ${50 + cameraPanX}% ${45 + cameraPanY}%, ${themeColors.bgGlow} 0%, ${themeColors.ambient} 60%, #020408 100%)`
        }}
      />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-[#020408]/30 to-[#020408]/90 z-10" />

      {/* Atmospheric Floating Dust & Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 20 }).map((_, i) => {
          const speed = i % 2 === 0 ? 1 : 1.6;
          const topPos = (i * 11 + currentTime * 5 * speed) % 100;
          const leftPos = (i * 17 + (i % 5) * 11) % 100;
          return (
            <div
              key={i}
              className="absolute rounded-full transition-opacity duration-700"
              style={{
                top: `${topPos}%`,
                left: `${leftPos}%`,
                width: i % 3 === 0 ? '3px' : '2px',
                height: i % 3 === 0 ? '3px' : '2px',
                backgroundColor: i % 2 === 0 ? themeColors.accent : '#ffffff',
                opacity: isPlaying ? 0.25 + (i % 4) * 0.15 : 0.15,
                boxShadow: `0 0 10px ${themeColors.accent}`
              }}
            />
          );
        })}
      </div>

      {/* 2. MAIN CINEMATIC MOVIE CANVAS (ZERO TEXT) */}
      <div
        className="relative z-10 my-auto w-full h-full flex flex-col items-center justify-center transition-transform duration-1000 ease-out"
        style={{
          transform: `scale(${cameraScale}) translate(${cameraPanX}px, ${cameraPanY}px)`
        }}
      >
        {/* ==================== ACT 1: HOOK / LATE NIGHT DESK ==================== */}
        {act === 'hook' && (
          <div className="relative w-full max-w-md h-60 flex flex-col items-center justify-center">
            {/* Night Sky Window */}
            <div className="absolute top-0 w-64 h-28 rounded-xl bg-slate-950 border border-slate-800/80 overflow-hidden shadow-inner flex items-end justify-around px-4 opacity-75">
              <div className="absolute top-2 right-5 w-7 h-7 rounded-full bg-amber-100/90 shadow-[0_0_15px_rgba(254,243,199,0.5)]" />
              <div className="w-8 h-16 bg-slate-900/90 rounded-t-sm" />
              <div className="w-12 h-20 bg-slate-900 rounded-t-sm" />
              <div className="w-10 h-14 bg-slate-900/80 rounded-t-sm" />
            </div>

            {/* Developer Desk */}
            <div className="relative z-10 mt-14 w-72 h-24 bg-gradient-to-b from-slate-900 to-slate-950 rounded-t-2xl border-t border-slate-700/60 p-3 shadow-2xl flex items-center justify-center">
              {/* Laptop Screen */}
              <div className="relative w-40 h-24 -mt-8 bg-slate-950 rounded-lg border-2 border-slate-700 p-2 shadow-[0_0_30px_rgba(99,102,241,0.3)] flex flex-col justify-between overflow-hidden">
                <div className="flex items-center gap-1 border-b border-slate-800 pb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                {/* Flowing Code Lines */}
                <div className="space-y-1 py-1">
                  <div className="w-3/4 h-1 rounded bg-indigo-400/90 animate-pulse" />
                  <div className="w-1/2 h-1 rounded bg-amber-400/80" />
                  <div className="w-5/6 h-1 rounded bg-sky-400/80" />
                  <div className="w-2/3 h-1 rounded bg-emerald-400/80" />
                </div>
                <div className="w-full h-1 bg-indigo-500/30 rounded overflow-hidden">
                  <div className="h-full bg-indigo-400 animate-pulse" style={{ width: `${(currentTime * 20) % 100}%` }} />
                </div>
              </div>

              {/* Coffee Cup with Steam */}
              <div className="absolute right-5 bottom-3 w-5 h-6 rounded-md bg-amber-900/60 border border-amber-700/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400/40 animate-ping" />
              </div>

              {/* Desk Lamp Glow */}
              <div className="absolute left-5 bottom-6 w-6 h-10 border-l-2 border-t-2 border-slate-600 rounded-tl-lg">
                <div className="w-3 h-2.5 bg-amber-400 rounded-t-sm shadow-[0_0_15px_#f59e0b]" />
              </div>
            </div>
          </div>
        )}

        {/* ==================== ACT 2: STRUGGLE / BARRIER ==================== */}
        {act === 'problem' && (
          <div className="relative w-full max-w-md h-60 flex items-center justify-center">
            {/* System Node with Flashing Warning Shield */}
            <div className="w-full bg-slate-950/90 border border-rose-900/80 rounded-2xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.3)] flex items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-rose-950/20 animate-pulse" />

              {/* Sender Node */}
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-sky-400 shadow-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              {/* Blocked Connection Barrier */}
              <div className="flex-1 h-2 bg-slate-800 relative rounded-full overflow-hidden flex items-center justify-center">
                <div className="absolute w-8 h-full bg-rose-500 animate-ping" />
                <div className="relative z-10 p-2 rounded-full bg-rose-950 border-2 border-rose-500 text-rose-400 shadow-[0_0_20px_#f43f5e]">
                  <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              {/* Receiver Node */}
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 opacity-50 flex items-center justify-center text-slate-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* ==================== ACT 3: DISCOVERY / GOLDEN KEY ==================== */}
        {act === 'discovery' && (
          <div className="relative w-full max-w-md h-60 flex items-center justify-center">
            {/* Golden Key Illuminating System */}
            <div className="w-full bg-slate-950/90 border border-amber-500/60 rounded-2xl p-6 shadow-[0_0_60px_rgba(245,158,11,0.3)] flex items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-emerald-500/10" />

              {/* Source Power Node */}
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-slate-900 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg">
                <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              {/* Glowing Golden Stream */}
              <div className="flex-1 h-2.5 bg-gradient-to-r from-amber-500 via-yellow-300 to-emerald-400 relative rounded-full overflow-hidden shadow-[0_0_25px_#f59e0b]">
                <div
                  className="absolute top-0 bottom-0 w-12 bg-white/90 blur-xs"
                  style={{ left: `${pulsePos}%` }}
                />
              </div>

              {/* Unlocked Target Node */}
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_30px_#10b981]">
                <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* ==================== ACT 4: PRODUCTION NETWORK ==================== */}
        {act === 'production' && (
          <div className="relative w-full max-w-md h-60 flex items-center justify-center">
            {/* Global Server Network Towers */}
            <div className="w-full bg-slate-950/90 border border-emerald-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.25)] relative overflow-hidden flex items-center justify-around">
              {[1, 2, 3, 4].map((tower) => (
                <div key={tower} className="relative z-10 flex flex-col items-center gap-1.5">
                  <div className="w-11 h-20 bg-slate-900 border border-emerald-500/50 rounded-xl p-1.5 flex flex-col justify-between shadow-lg">
                    <div className="w-full h-1.5 bg-emerald-400/90 rounded animate-pulse" />
                    <div className="w-full h-1.5 bg-emerald-500/70 rounded" />
                    <div className="w-full h-1.5 bg-sky-400/90 rounded animate-pulse" />
                    <div className="w-full h-1.5 bg-emerald-400/90 rounded" />
                  </div>
                </div>
              ))}

              {/* Glowing High-Speed Highway Line */}
              <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-400 via-sky-300 to-emerald-400 rounded-full opacity-90 shadow-[0_0_20px_#10b981]" />
            </div>
          </div>
        )}

        {/* ==================== ACT 5: PAYOFF / PORTAL ==================== */}
        {act === 'payoff' && (
          <div className="relative w-full max-w-md h-60 flex items-center justify-center">
            {/* Project Portal Core */}
            <div className="w-full bg-slate-950/90 border border-sky-500/60 rounded-2xl p-6 shadow-[0_0_70px_rgba(59,130,246,0.35)] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-22 h-22 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-400 p-1 shadow-[0_0_40px_#3b82f6] animate-pulse flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-amber-400">
                  <svg className="w-10 h-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. OPTIONAL SUBTITLES / CLOSED CAPTIONS (OUTSIDE/BELOW THE ARTWORK AREA) */}
      {showCaptions && (
        <div className="relative z-20 text-center max-w-xl mx-auto w-full pt-2">
          <div className="bg-slate-950/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800/90 shadow-2xl">
            <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed tracking-wide">
              "{section.narration}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

