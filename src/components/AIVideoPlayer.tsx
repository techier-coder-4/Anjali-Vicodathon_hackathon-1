import React, { useState, useEffect, useRef } from 'react';
import { Challenge, LearningVideoScript, VideoScriptSection } from '../types';
import { generateFallbackVideoScript } from '../data/videoScripts';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FileText,
  Sparkles,
  CheckCircle2,
  Tv,
  Info,
  ChevronRight,
  Lightbulb,
  Globe,
  Briefcase,
  Target,
  Rocket
} from 'lucide-react';

interface AIVideoPlayerProps {
  challenge: Challenge;
  onStartChallenge?: () => void;
}

export const AIVideoPlayer: React.FC<AIVideoPlayerProps> = ({ challenge, onStartChallenge }) => {
  const [script, setScript] = useState<LearningVideoScript | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showFallbackText, setShowFallbackText] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cache key for script
  const cacheKey = `video_script_${challenge.trackId}_${challenge.dayId}_${challenge.title.replace(/\s+/g, '_')}`;

  // Fetch or retrieve cached video script
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadScript = async () => {
      // 1. Try local cache
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.sections) {
            if (isMounted) {
              setScript(parsed);
              setLoading(false);
            }
            return;
          }
        }
      } catch (e) {
        console.warn('Cache read error:', e);
      }

      // 2. Fetch from backend API
      try {
        const res = await fetch('/api/gemini/video-script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            trackId: challenge.trackId,
            dayId: challenge.dayId,
            challengeTitle: challenge.title,
            learningObjective: challenge.learningObjective,
            whyItMatters: challenge.whyItMatters,
            requirements: challenge.requirements,
            curiosityPrompt: challenge.curiosityPrompt,
            description: challenge.description
          })
        });

        const data = await res.json();
        if (data.success && data.script && isMounted) {
          setScript(data.script);
          try {
            localStorage.setItem(cacheKey, JSON.stringify(data.script));
          } catch (e) {}
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('API script fetch failed, using grounded fallback:', err);
      }

      // 3. Grounded Fallback
      if (isMounted) {
        const fallback = generateFallbackVideoScript(challenge);
        setScript(fallback);
        setLoading(false);
      }
    };

    loadScript();

    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [challenge.dayId, challenge.trackId, challenge.title]);

  // Speech synthesis handle
  const speakSection = (narrationText: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick friendly voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Playback timer & section progression
  useEffect(() => {
    if (!isPlaying || !script) return;

    const currentSec = script.sections[currentSectionIndex];
    if (currentSec && currentTime === 0) {
      speakSection(currentSec.narration);
    }

    timerRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const nextTime = prev + 1;
        const totalDuration = script.durationSeconds || 60;

        if (nextTime >= totalDuration) {
          setIsPlaying(false);
          setHasWatched(true);
          if (timerRef.current) clearInterval(timerRef.current);
          if (window.speechSynthesis) window.speechSynthesis.cancel();
          return totalDuration;
        }

        // Calculate current section index based on time
        let accumulated = 0;
        for (let i = 0; i < script.sections.length; i++) {
          accumulated += script.sections[i].durationSeconds;
          if (nextTime <= accumulated) {
            if (i !== currentSectionIndex) {
              setCurrentSectionIndex(i);
              speakSection(script.sections[i].narration);
            }
            break;
          }
        }

        return nextTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentSectionIndex, script, isMuted]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    } else {
      if (currentTime >= (script?.durationSeconds || 60)) {
        setCurrentTime(0);
        setCurrentSectionIndex(0);
      }
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    setIsPlaying(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setCurrentTime(0);
    setCurrentSectionIndex(0);
    setTimeout(() => {
      setIsPlaying(true);
    }, 100);
  };

  const handleToggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (next && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      } else if (!next && script && isPlaying) {
        const sec = script.sections[currentSectionIndex];
        if (sec) speakSection(sec.narration);
      }
      return next;
    });
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = Math.floor(sec % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  if (loading) {
    return (
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4 animate-pulse">
        <div className="flex items-center gap-3 text-amber-400">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider">Generating AI Motivational Intro...</span>
        </div>
        <div className="h-48 bg-slate-800 rounded-xl flex items-center justify-center">
          <p className="text-xs text-slate-400">Synthesizing real-world context for Day {challenge.dayId}...</p>
        </div>
      </div>
    );
  }

  if (!script) return null;

  const currentSection: VideoScriptSection = script.sections[currentSectionIndex] || script.sections[0];
  const totalDuration = script.durationSeconds || 65;
  const progressPercent = Math.min(100, Math.max(0, (currentTime / totalDuration) * 100));

  // Section icon mapper
  const getSectionIcon = (type: VideoScriptSection['type']) => {
    switch (type) {
      case 'intro': return <Tv className="w-4 h-4 text-amber-400" />;
      case 'what': return <Lightbulb className="w-4 h-4 text-sky-400" />;
      case 'why_matters': return <Info className="w-4 h-4 text-emerald-400" />;
      case 'where_used': return <Globe className="w-4 h-4 text-indigo-400" />;
      case 'student_benefits': return <Briefcase className="w-4 h-4 text-purple-400" />;
      case 'today_mission': return <Target className="w-4 h-4 text-rose-400" />;
      case 'motivation': return <Rocket className="w-4 h-4 text-amber-300" />;
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 text-white overflow-hidden shadow-xl transition-all">
      {/* Top Banner Header */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              <span>Why Should I Learn This?</span>
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                45–75 sec AI Intro
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Understand the real-world purpose before writing a single line of code.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setShowFallbackText(!showFallbackText)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] flex items-center gap-1 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>{showFallbackText ? 'Hide Summary' : 'Read 60s Summary'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] flex items-center gap-1 transition-colors"
          >
            <span>Full Script</span>
          </button>
        </div>
      </div>

      {/* Main Video Canvas Screen */}
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 sm:p-8 min-h-[260px] flex flex-col justify-between select-none">
        {/* Background Visual Scene Graphics */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Current Scene Header Badge */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 bg-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/80 text-xs font-semibold text-slate-200 shadow-sm">
            {getSectionIcon(currentSection.type)}
            <span className="uppercase tracking-wider text-[10px] font-extrabold text-amber-400">
              {currentSection.title}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-[11px] text-slate-300">{currentSectionIndex + 1} of {script.sections.length}</span>
          </div>

          <div className="text-[11px] font-mono font-bold text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/50">
            {formatSeconds(currentTime)} / {formatSeconds(totalDuration)}
          </div>
        </div>

        {/* Center Visual Content Card */}
        <div className="relative z-10 my-6 text-center max-w-xl mx-auto space-y-3">
          <div className="text-sm font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg inline-block">
            {currentSection.visualHook}
          </div>

          {/* Spoken Narration Captions */}
          {showCaptions && (
            <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800 backdrop-blur-xs shadow-inner">
              "{currentSection.narration}"
            </p>
          )}

          {/* Immediate Jargon Translation Box if available */}
          {currentSection.jargonTerms && currentSection.jargonTerms.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {currentSection.jargonTerms.map((j, idx) => (
                <span key={idx} className="text-[11px] bg-slate-800/80 text-sky-300 px-2.5 py-1 rounded-lg border border-sky-500/30">
                  <strong>{j.term}</strong> ({j.simpleMeaning})
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Video Player Controls Bar */}
        <div className="relative z-10 space-y-2">
          {/* Timeline Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden cursor-pointer relative group">
            <div
              className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePlayPause}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg hover:scale-102 transition-all min-h-[40px]"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-slate-950" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>{currentTime === 0 ? 'Watch AI Intro' : 'Resume'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReplay}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Replay Video"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title={isMuted ? 'Unmute Audio Narration' : 'Mute Audio Narration'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={() => setShowCaptions(!showCaptions)}
                className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] border transition-colors ${
                  showCaptions
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                CC
              </button>
            </div>

            {/* Ready to build CTA */}
            {onStartChallenge && (
              <button
                type="button"
                onClick={onStartChallenge}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all min-h-[40px] ${
                  hasWatched
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg scale-102 animate-bounce'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <span>Ready to Build?</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 60-Second Text Explanation Drawer (if requested or video unavailable) */}
      {showFallbackText && (
        <div className="p-5 bg-slate-950 border-t border-slate-800 text-xs space-y-3">
          <div className="flex items-center justify-between text-amber-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              <span>60-Second Executive Explanation</span>
            </span>
            <span className="text-[10px] text-slate-500">Plain English</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-medium bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            {script.fallbackExplanation}
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-[11px] pt-1">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <h4 className="font-bold text-sky-400 mb-1">Where is this used in production?</h4>
              <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                {script.realWorldUses.map((use, idx) => (
                  <li key={idx}>{use}</li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <h4 className="font-bold text-emerald-400 mb-1">Why should you learn this?</h4>
              <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                {script.studentBenefits.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Full Transcript Drawer */}
      {showTranscript && (
        <div className="p-5 bg-slate-950 border-t border-slate-800 text-xs space-y-3 max-h-60 overflow-y-auto">
          <div className="flex items-center justify-between text-slate-300 font-bold">
            <span>Complete Narration Transcript</span>
            <span className="text-[10px] text-slate-500">Mentor Voice</span>
          </div>
          <p className="text-slate-400 leading-relaxed font-mono text-[11px] bg-slate-900 p-3 rounded-xl border border-slate-800 whitespace-pre-line">
            {script.transcript}
          </p>
        </div>
      )}
    </div>
  );
};
