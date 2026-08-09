import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LearningVideoScript, VideoScriptSection, Challenge } from '../types';
import { cinematicStoryService } from '../services/cinematicStoryService';
import { generateFallbackVideoScript } from '../data/videoScripts';
import { audioSynth } from '../utils/audioSynth';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Film,
  Maximize2,
  Minimize2,
  Subtitles,
  Info,
  FileText,
  ChevronRight,
  Zap,
  CheckCircle2,
  Tv,
  Mic,
  Activity
} from 'lucide-react';

interface CinematicPlayerProps {
  challenge: Challenge;
  onStartChallenge?: () => void;
  autoPlay?: boolean;
}

export const CinematicPlayer: React.FC<CinematicPlayerProps> = ({
  challenge,
  onStartChallenge,
  autoPlay = false
}) => {
  const [script, setScript] = useState<LearningVideoScript | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPhase, setLoadingPhase] = useState('Writing anime story arc...');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const prevSectionIndexRef = useRef<number>(0);
  const currentSpokenSectionRef = useRef<number>(-1);

  // Helper to generate a valid master ambient audio track URL matching exact script duration
  const createWavDataUrl = (durationSeconds: number): string => {
    if (typeof window === 'undefined') return '';
    const sampleRate = 8000;
    const numSamples = Math.floor(sampleRate * Math.max(1, durationSeconds));
    const buffer = new ArrayBuffer(44 + numSamples);
    const view = new DataView(buffer);

    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate, true);
    view.setUint16(32, 1, true);
    view.setUint16(34, 8, true); // 8-bit
    writeString(36, 'data');
    view.setUint32(40, numSamples, true);

    for (let i = 0; i < numSamples; i++) {
      // 128 in 8-bit unsigned PCM represents pure silence
      view.setUint8(44 + i, 128);
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  // Derive current section index smoothly from currentTime
  const currentSectionIndex = useMemo(() => {
    if (!script || !script.sections || script.sections.length === 0) return 0;
    let accumulated = 0;
    for (let i = 0; i < script.sections.length; i++) {
      accumulated += script.sections[i].durationSeconds;
      if (currentTime < accumulated) {
        return i;
      }
    }
    return script.sections.length - 1;
  }, [currentTime, script]);

  // 1. Fetch or load cached story script using CinematicStoryService
  useEffect(() => {
    let isMounted = true;

    // Fast check local cache first
    const cached = cinematicStoryService.getCachedStory(challenge);
    if (cached) {
      setScript(cached);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Animated loading messages for anime story creation
    const phaseInterval = setInterval(() => {
      setLoadingPhase(prev => {
        if (prev.includes('Writing anime story')) return 'Drawing anime scenes...';
        if (prev.includes('Drawing anime')) return 'Composing narration soundtrack...';
        return 'Writing anime story arc...';
      });
    }, 1200);

    const loadStory = async () => {
      try {
        const storyScript = await cinematicStoryService.generateStoryArc(challenge);
        if (isMounted) {
          setScript(storyScript);
          clearInterval(phaseInterval);
          setLoading(false);
          if (autoPlay) setIsPlaying(true);
        }
      } catch (err) {
        console.warn('[CinematicPlayer] Generation failed, loading grounded anime fallback:', err);
        if (isMounted) {
          const fallback = generateFallbackVideoScript(challenge);
          setScript(fallback);
          clearInterval(phaseInterval);
          setLoading(false);
        }
      }
    };

    loadStory();

    return () => {
      isMounted = false;
      clearInterval(phaseInterval);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      audioSynth.stopAmbient();
    };
  }, [challenge.dayId, challenge.trackId, challenge.title]);

  // 2. Robust Speech Synthesis Voiceover per Section with Normal Rate & Smooth Transitions
  const speakSectionText = (textToSpeak: string, sectionIndex: number, forceRestart: boolean = false) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      // Normal, constant rate and natural tone throughout the entire video
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      const voices = window.speechSynthesis.getVoices();
      const bestVoice =
        voices.find(
          v =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha') ||
              v.name.includes('Daniel') ||
              v.name.includes('Alex'))
        ) || voices.find(v => v.lang.startsWith('en'));

      if (bestVoice) utterance.voice = bestVoice;

      activeUtteranceRef.current = utterance;
      currentSpokenSectionRef.current = sectionIndex;

      // Micro-pause (100ms) prevents SpeechSynthesis click/pop and ensures smooth utterance queuing
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.speak(utterance);
        }
      }, 100);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  };

  // Sound chime effect on visual section transition
  useEffect(() => {
    if (isPlaying && currentSectionIndex !== prevSectionIndexRef.current) {
      audioSynth.playChime('transition');
    }
    prevSectionIndexRef.current = currentSectionIndex;
  }, [currentSectionIndex, isPlaying]);

  // Heartbeat to keep SpeechSynthesis alive across long video durations in Chrome/Edge
  useEffect(() => {
    if (!isPlaying || isMuted) {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      return;
    }

    heartbeatRef.current = setInterval(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
        // Known WebSpeech API fix for Chrome background audio stalling
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 5000);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [isPlaying, isMuted]);

  // Speak narration when active section changes or playback resumes
  useEffect(() => {
    if (isPlaying && script && script.sections[currentSectionIndex] && !isMuted) {
      if (currentSpokenSectionRef.current !== currentSectionIndex) {
        const section = script.sections[currentSectionIndex];
        // Queue smoothly on natural progression; only force restart if speech is idle
        const forceRestart = !window.speechSynthesis.speaking;
        speakSectionText(section.narration, currentSectionIndex, forceRestart);
      }
    }
  }, [currentSectionIndex, isPlaying, isMuted, script]);

  // 3. Master requestAnimationFrame Sync Engine tied to audioRef.currentTime
  useEffect(() => {
    if (!script) return;

    // Create or update master soundtrack audio URL matching script duration
    const totalDuration = script.durationSeconds || 58;
    const url = createWavDataUrl(totalDuration);
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.currentTime = currentTime;
    }

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [script]);

  useEffect(() => {
    if (!isPlaying || !script) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      audioSynth.stopAmbient();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.pause();
      }
      setIsSpeaking(false);
      return;
    }

    // Play master audio track
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(err => {
        console.warn('audioRef play error:', err);
      });
    }

    audioSynth.startAmbient();

    if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const totalDuration = script.durationSeconds || 58;

    const updateFrame = () => {
      if (!isPlaying) return;

      const masterAudioTime = audioRef.current ? audioRef.current.currentTime : 0;
      setCurrentTime(masterAudioTime);

      if (masterAudioTime >= totalDuration || (audioRef.current && audioRef.current.ended)) {
        setIsPlaying(false);
        if (audioRef.current) audioRef.current.pause();
        audioSynth.stopAmbient();
        audioSynth.playChime('success');
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
        return;
      }

      rafIdRef.current = requestAnimationFrame(updateFrame);
    };

    rafIdRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isPlaying, script, isMuted]);

  // Controls
  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      audioSynth.stopAmbient();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    } else {
      if (currentTime >= (script?.durationSeconds || 58)) {
        if (audioRef.current) audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
      currentSpokenSectionRef.current = -1;
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    setIsPlaying(false);
    if (audioRef.current) audioRef.current.pause();
    audioSynth.stopAmbient();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    currentSpokenSectionRef.current = -1;
    if (audioRef.current) audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setTimeout(() => {
      setIsPlaying(true);
    }, 200);
  };

  const handleToggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (audioRef.current) audioRef.current.muted = next;
      audioSynth.setMuted(next);
      if (next && typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else if (!next && script && isPlaying && script.sections[currentSectionIndex]) {
        const section = script.sections[currentSectionIndex];
        speakSectionText(section.narration, currentSectionIndex, true);
      }
      return next;
    });
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!script) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newPercent = Math.min(1, Math.max(0, clickX / width));
    const newTime = Math.floor(newPercent * (script.durationSeconds || 58));

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
    currentSpokenSectionRef.current = -1;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.warn('Fullscreen error:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => {
        console.warn('Exit fullscreen error:', err);
      });
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  // Determine story act from narrative section
  const currentSection: VideoScriptSection | null =
    script?.sections[currentSectionIndex] || script?.sections[0] || null;
  const totalDuration = script?.durationSeconds || 58;
  const progressPercent = Math.min(100, Math.max(0, (currentTime / totalDuration) * 100));

  // Determine story act
  const act = useMemo(() => {
    if (currentSectionIndex === 0) return 'hook';
    if (currentSectionIndex === 1) return 'problem';
    if (currentSectionIndex === 2) return 'discovery';
    if (currentSectionIndex === 3) return 'impact';
    return 'payoff';
  }, [currentSectionIndex]);

  // Loading Screen
  if (loading) {
    return (
      <div className="bg-[#05070e] text-white rounded-2xl p-6 sm:p-8 space-y-4 border border-indigo-900/40 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-indigo-900/30 via-purple-950/20 to-[#05070e] pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-amber-400">
            <Film className="w-5 h-5 animate-spin text-amber-400" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-100">
              Anime Story Short
            </span>
          </div>
          <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 shadow-xs">
            {loadingPhase}
          </span>
        </div>

        <div className="h-64 sm:h-80 bg-[#070914] rounded-2xl flex flex-col items-center justify-center border border-indigo-900/40 relative overflow-hidden">
          {/* Animated Anime Aperture Lens */}
          <div className="relative w-24 h-24 rounded-full border-2 border-amber-400/50 flex items-center justify-center animate-pulse shadow-[0_0_40px_rgba(245,158,11,0.3)]">
            <div className="w-16 h-16 rounded-full border border-cyan-400/80 animate-spin" />
            <Tv className="w-7 h-7 text-amber-400 absolute" />
          </div>

          <div className="mt-5 space-y-1.5 text-center px-4 z-10">
            <h4 className="text-base font-extrabold text-slate-100 tracking-wide">
              {challenge.title}
            </h4>
            <p className="text-xs text-indigo-300 max-w-md leading-relaxed">
              Generating an anime-style animated short film about why today's skill matters...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!script || !currentSection) return null;

  return (
    <div
      ref={containerRef}
      className="bg-[#03050c] rounded-2xl border border-indigo-950/80 text-white overflow-hidden shadow-2xl transition-all"
    >
      <audio ref={audioRef} className="hidden" preload="auto" />
      {/* 1. ANIME MOVIE HEADER */}
      <div className="bg-[#070914] px-4 py-3 border-b border-indigo-950/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 via-rose-500/20 to-indigo-500/20 text-amber-400 border border-amber-500/30 shadow-xs">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
              <span>Day {challenge.dayId}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                Anime Short
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {isSpeaking && (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-mono text-[11px] animate-pulse">
              <Activity className="w-3.5 h-3.5" />
              <span>Voice Narration</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowSummary(prev => !prev)}
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all flex items-center gap-1.5 ${
              showSummary
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Key Concept</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTranscript(prev => !prev)}
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all flex items-center gap-1.5 ${
              showTranscript
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Story Text</span>
          </button>
        </div>
      </div>

      {/* 2. ANIME CINEMATIC ANIMATED CANVAS */}
      <div className="relative p-2 sm:p-4 bg-[#020308]">
        <div className="relative w-full h-full min-h-[340px] sm:min-h-[440px] bg-[#020308] overflow-hidden rounded-2xl border border-indigo-950/80 shadow-2xl flex flex-col justify-between p-4 sm:p-6 select-none">
          {/* A. CONTINUOUS ANIME AMBIENT LIGHTING & DYNAMIC SKY */}
          <div
            className="absolute inset-0 transition-all duration-1000 pointer-events-none opacity-50"
            style={{
              background:
                act === 'hook'
                  ? 'radial-gradient(circle at 50% 40%, #4338ca 0%, #1e1b4b 50%, #020308 100%)'
                  : act === 'problem'
                  ? 'radial-gradient(circle at 50% 40%, #be123c 0%, #450a0a 50%, #020308 100%)'
                  : act === 'discovery'
                  ? 'radial-gradient(circle at 50% 40%, #d97706 0%, #451a03 50%, #020308 100%)'
                  : act === 'impact'
                  ? 'radial-gradient(circle at 50% 40%, #059669 0%, #064e3b 50%, #020308 100%)'
                  : 'radial-gradient(circle at 50% 40%, #0284c7 0%, #0f172a 50%, #020308 100%)'
            }}
          />

          {/* Anime Movie Lens Flare & Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-[#020308]/20 to-[#020308]/90 z-10" />

          {/* Anime Speed Lines (Active during transitions / action) */}
          {isPlaying && (act === 'problem' || act === 'discovery') && (
            <div className="absolute inset-0 pointer-events-none opacity-20 z-10 overflow-hidden">
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-cyan-400/20 to-transparent animate-ping" />
            </div>
          )}

          {/* Floating anime sakura / energy sparkles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {Array.from({ length: 22 }).map((_, i) => {
              const speed = i % 2 === 0 ? 1.2 : 2.0;
              const topPos = (i * 9 + currentTime * 6 * speed) % 100;
              const leftPos = (i * 13 + (i % 5) * 12) % 100;
              return (
                <div
                  key={i}
                  className="absolute rounded-full transition-all duration-500"
                  style={{
                    top: `${topPos}%`,
                    left: `${leftPos}%`,
                    width: i % 4 === 0 ? '4px' : '2px',
                    height: i % 4 === 0 ? '4px' : '2px',
                    backgroundColor:
                      act === 'problem'
                        ? '#f43f5e'
                        : act === 'discovery'
                        ? '#fbbf24'
                        : act === 'impact'
                        ? '#34d399'
                        : '#38bdf8',
                    opacity: isPlaying ? 0.35 + (i % 3) * 0.2 : 0.15,
                    boxShadow: `0 0 10px ${
                      act === 'problem' ? '#f43f5e' : act === 'discovery' ? '#f59e0b' : '#38bdf8'
                    }`
                  }}
                />
              );
            })}
          </div>

          {/* B. MAIN ANIME ILLUSTRATED MOVIE SCENE CANVAS */}
          <div className="relative z-20 my-auto w-full h-full flex items-center justify-center transition-all duration-700 py-2 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`scene-${act}-${currentSectionIndex}`}
                initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex items-center justify-center animate-fade animate-camera-pan"
              >
                {/* === SCENE 1: HOOK / ANIME STUDENT AT LATE NIGHT STUDIO DESK === */}
                {act === 'hook' && (
                  <div className="relative w-full max-w-xl flex flex-col items-center justify-center space-y-3">
                    {/* Tokyo Skyline Window Background */}
                    <div className="relative w-full h-44 sm:h-52 rounded-2xl bg-[#060812] border border-indigo-900/60 overflow-hidden shadow-2xl p-4 flex flex-col justify-between">
                      {/* Sky & Moon */}
                      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-indigo-950/80 via-purple-950/40 to-transparent pointer-events-none" />
                      <div className="absolute top-3 right-6 w-10 h-10 rounded-full bg-amber-100/90 shadow-[0_0_30px_rgba(254,243,199,0.8)] flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-[#060812] translate-x-2.5 -translate-y-1" />
                      </div>

                      {/* Skyscraper Silhouettes */}
                      <div className="absolute bottom-0 inset-x-0 h-24 flex items-end justify-between px-6 opacity-80 pointer-events-none">
                        <div className="w-12 h-20 bg-slate-900 rounded-t border-t border-cyan-400/40 relative">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full absolute top-2 left-2 animate-ping" />
                        </div>
                        <div className="w-16 h-24 bg-indigo-950 rounded-t border-t border-purple-400/40" />
                        <div className="w-20 h-16 bg-slate-950 rounded-t border-t border-amber-400/40" />
                        <div className="w-14 h-22 bg-indigo-900 rounded-t border-t border-cyan-400/60" />
                      </div>

                      {/* High Quality Anime Editor Display */}
                      <div className="relative z-10 w-full h-full bg-[#090d1a]/95 rounded-xl border border-indigo-500/40 p-3 shadow-2xl flex flex-col justify-between backdrop-blur-md">
                        {/* IDE Header Bar */}
                        <div className="flex items-center justify-between border-b border-indigo-900/60 pb-1.5 text-[11px]">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                            </div>
                            <span className="font-mono text-indigo-300 font-bold ml-2">
                              Day{challenge.dayId}_App.tsx
                            </span>
                          </div>
                          <span className="text-[10px] text-amber-400 font-mono bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                            {challenge.trackId.toUpperCase()}
                          </span>
                        </div>

                        {/* Realistic Highlighted Code Mockup */}
                        <div className="font-mono text-[11px] sm:text-xs space-y-1 py-1 text-slate-300">
                          <div className="flex gap-3">
                            <span className="text-slate-600 select-none">1</span>
                            <span>
                              <span className="text-purple-400">export default function</span>{' '}
                              <span className="text-cyan-300 font-bold">
                                {challenge.title.replace(/\s+/g, '')}
                              </span>
                              () {'{'}
                            </span>
                          </div>
                          <div className="flex gap-3 bg-indigo-500/10 px-1 rounded">
                            <span className="text-slate-600 select-none">2</span>
                            <span className="pl-4 text-emerald-300">
                              // Goal: Build production-ready architecture
                            </span>
                          </div>
                          <div className="flex gap-3">
                            <span className="text-slate-600 select-none">3</span>
                            <span className="pl-4 text-slate-300">
                              <span className="text-rose-400">return</span> &lt;
                              <span className="text-amber-300 font-bold">InteractiveControl</span>{' '}
                              onClick={'{'}handleClick{'}'} /&gt;
                            </span>
                          </div>
                          <div className="flex gap-3">
                            <span className="text-slate-600 select-none">4</span>
                            <span>{'}'}</span>
                          </div>
                        </div>

                        {/* Terminal Status Footer */}
                        <div className="flex items-center justify-between pt-1 border-t border-indigo-900/60 text-[10px] text-slate-400 font-mono">
                          <div className="flex items-center gap-1.5 text-cyan-400">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            <span>Ready to build • Today's Topic</span>
                          </div>
                          <span className="text-slate-500">UTF-8</span>
                        </div>
                      </div>
                    </div>

                    {/* Developer Desk & Mug */}
                    <div className="flex items-center justify-between w-full px-4 text-xs">
                      <div className="flex items-center gap-2 bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-800/60 text-indigo-200">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span>Late Night Developer Studio</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-mono bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{challenge.title}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* === SCENE 2: STRUGGLE / CLEAR VISUAL PROBLEM DIAGRAM === */}
                {act === 'problem' && (
                  <div className="relative w-full max-w-xl bg-[#0d0409] border-2 border-rose-500/80 rounded-2xl p-4 sm:p-5 shadow-[0_0_60px_rgba(244,63,94,0.3)] space-y-3">
                    {/* Header Banner */}
                    <div className="flex items-center justify-between border-b border-rose-900/60 pb-2">
                      <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs tracking-wider uppercase">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                        <span>The Critical Anti-Pattern & Barrier</span>
                      </div>
                      <span className="text-[10px] font-mono text-rose-300 bg-rose-950 px-2.5 py-0.5 rounded border border-rose-700/60">
                        Anti-Pattern Detected
                      </span>
                    </div>

                    {/* Side-by-Side Diagram */}
                    <div className="grid sm:grid-cols-2 gap-3 text-xs">
                      {/* Faulty Code Box */}
                      <div className="bg-[#14060c] p-3 rounded-xl border border-rose-800/80 space-y-2">
                        <div className="flex items-center justify-between text-rose-400 font-bold text-[11px]">
                          <span>Faulty Code Snippet</span>
                          <span className="text-rose-500">❌ Error</span>
                        </div>
                        <div className="bg-[#080205] p-2.5 rounded-lg border border-rose-950 font-mono text-[11px] text-rose-300 space-y-1">
                          <div className="text-slate-500">// Non-accessible element</div>
                          <div className="text-rose-400 font-bold">&lt;div onClick={'{'}submit{'}'}&gt;</div>
                          <div className="pl-3 text-slate-300">Click Here</div>
                          <div className="text-rose-400 font-bold">&lt;/div&gt;</div>
                        </div>
                      </div>

                      {/* System Impact Breakdown */}
                      <div className="bg-[#14060c] p-3 rounded-xl border border-rose-800/80 space-y-2 flex flex-col justify-between">
                        <div className="text-rose-400 font-bold text-[11px] flex items-center justify-between">
                          <span>Real World Impact</span>
                          <span className="text-rose-400">Broken UX</span>
                        </div>
                        <ul className="space-y-1.5 text-[11px] text-slate-300">
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>Screen Readers skip over non-buttons</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>Keyboard navigation (Tab/Enter) breaks</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>Search engine crawlers ignore clicks</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Visual Impact Box */}
                    <div className="bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/60 text-center text-xs text-rose-200 font-medium">
                      ⚠️ "{currentSection.narration}"
                    </div>
                  </div>
                )}

                {/* === SCENE 3: DISCOVERY / CLEAR VISUAL SOLUTION DIAGRAM === */}
                {act === 'discovery' && (
                  <div className="relative w-full max-w-xl bg-[#050f0a] border-2 border-emerald-400/90 rounded-2xl p-4 sm:p-5 shadow-[0_0_70px_rgba(16,185,129,0.35)] space-y-3">
                    {/* Header Banner */}
                    <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs tracking-wider uppercase">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                        <span>The Production Solution Pattern</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-700/60">
                        Production Grade
                      </span>
                    </div>

                    {/* Side-by-Side Diagram */}
                    <div className="grid sm:grid-cols-2 gap-3 text-xs">
                      {/* Clean Fix Snippet */}
                      <div className="bg-[#091710] p-3 rounded-xl border border-emerald-800/80 space-y-2">
                        <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px]">
                          <span>Production Correct Code</span>
                          <span className="text-emerald-400">✅ Verified</span>
                        </div>
                        <div className="bg-[#030906] p-2.5 rounded-lg border border-emerald-950 font-mono text-[11px] text-emerald-300 space-y-1">
                          <div className="text-emerald-500/80">// Semantic & Accessible</div>
                          <div className="text-emerald-400 font-bold">&lt;button type="button"</div>
                          <div className="pl-3 text-amber-300">onClick={'{'}submit{'}'}&gt;</div>
                          <div className="pl-3 text-slate-200">Submit Action</div>
                          <div className="text-emerald-400 font-bold">&lt;/button&gt;</div>
                        </div>
                      </div>

                      {/* Unlocked Benefits */}
                      <div className="bg-[#091710] p-3 rounded-xl border border-emerald-800/80 space-y-2 flex flex-col justify-between">
                        <div className="text-emerald-400 font-bold text-[11px] flex items-center justify-between">
                          <span>Unlocked Features</span>
                          <span className="text-emerald-300">100% WCAG</span>
                        </div>
                        <ul className="space-y-1.5 text-[11px] text-slate-200">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Native keyboard focus ring enabled</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Screen readers announce button state</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Zero reliance on custom hacky scripts</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Transformation Callout */}
                    <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-700/60 text-center text-xs text-emerald-200 font-medium">
                      ✨ "{currentSection.narration}"
                    </div>
                  </div>
                )}

                {/* === SCENE 4: IMPACT / ENTERPRISE PRODUCTION DASHBOARD === */}
                {act === 'impact' && (
                  <div className="relative w-full max-w-xl bg-[#030a14] border-2 border-cyan-400/90 rounded-2xl p-4 sm:p-5 shadow-[0_0_70px_rgba(56,189,248,0.35)] space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
                      <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-xs uppercase tracking-wider">
                        <Tv className="w-4 h-4 text-cyan-400" />
                        <span>Real World Production Enterprise Scale</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
                        99.99% Uptime
                      </span>
                    </div>

                    {/* High Tech Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      <div className="bg-[#071324] p-3 rounded-xl border border-cyan-900/60 space-y-1">
                        <div className="text-lg font-black text-emerald-400">100 / 100</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Lighthouse Score
                        </div>
                      </div>
                      <div className="bg-[#071324] p-3 rounded-xl border border-cyan-900/60 space-y-1">
                        <div className="text-lg font-black text-cyan-300">10M+</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Daily Users
                        </div>
                      </div>
                      <div className="bg-[#071324] p-3 rounded-xl border border-cyan-900/60 space-y-1">
                        <div className="text-lg font-black text-amber-300">0.02ms</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Interaction Time
                        </div>
                      </div>
                    </div>

                    {/* Real World Platform Logos */}
                    <div className="bg-[#071324] p-3 rounded-xl border border-cyan-900/60 flex items-center justify-between px-4 text-xs">
                      <span className="text-slate-400 font-medium">Deployed on:</span>
                      <div className="flex items-center gap-3 font-bold text-cyan-200">
                        <span className="bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          Spotify
                        </span>
                        <span className="bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          Stripe
                        </span>
                        <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          GitHub
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* === SCENE 5: PAYOFF / MISSION BRIEFING CALL TO ACTION === */}
                {act === 'payoff' && (
                  <div className="relative w-full max-w-xl bg-[#080512] border-2 border-amber-400/90 rounded-2xl p-5 sm:p-6 shadow-[0_0_80px_rgba(245,158,11,0.4)] text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Day {challenge.dayId} Mission Briefing Ready</span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                        {challenge.title}
                      </h3>
                      <p className="text-xs text-indigo-200 max-w-md mx-auto leading-relaxed">
                        You've seen why this concept matters in real production apps. Now it's time to build it yourself!
                      </p>
                    </div>

                    {/* Rewards / Badges */}
                    <div className="flex items-center justify-center gap-3 text-xs">
                      <span className="bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold px-3 py-1 rounded-lg">
                        +250 XP
                      </span>
                      <span className="bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-bold px-3 py-1 rounded-lg">
                        Production Resilience
                      </span>
                    </div>

                    {/* Primary CTA */}
                    {onStartChallenge && (
                      <button
                        type="button"
                        onClick={onStartChallenge}
                        className="w-full max-w-xs mx-auto py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 font-black text-sm shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Start Challenge Code Editor</span>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* C. SUBTITLES (CLOSED CAPTIONS BELOW THE ARTWORK) */}
          {showCaptions && (
            <div className="relative z-20 text-center max-w-xl mx-auto w-full pt-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`caption-${currentSectionIndex}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-950/90 backdrop-blur-md px-5 py-3 rounded-xl border border-indigo-900/80 shadow-2xl"
                >
                  <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed tracking-wide">
                    "{currentSection.narration}"
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Overlay Play Button when Paused at Start */}
          {!isPlaying && currentTime === 0 && (
            <div className="absolute inset-0 z-30 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 rounded-2xl">
              <div
                className="p-5 rounded-full bg-amber-400 text-slate-950 shadow-2xl hover:scale-110 transition-transform cursor-pointer border-2 border-amber-300"
                onClick={handlePlayPause}
              >
                <Play className="w-8 h-8 fill-slate-950 translate-x-0.5" />
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  {challenge.title}
                </h4>
                <p className="text-xs text-amber-300 font-medium">{script.cinematicHook}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. CONTROLS TOOLBAR */}
      <div className="bg-[#070914] p-3 sm:p-4 border-t border-indigo-950/80 space-y-3">
        {/* Scrubbable Timeline */}
        <div
          onClick={handleSeek}
          className="relative w-full h-2 bg-slate-900 rounded-full cursor-pointer group overflow-hidden border border-slate-800"
        >
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-400 via-indigo-500 to-cyan-400 transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlayPause}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-slate-950" />
              ) : (
                <Play className="w-4 h-4 fill-slate-950" />
              )}
              <span>
                {isPlaying ? 'Pause' : currentTime >= totalDuration ? 'Replay' : 'Play Movie'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleReplay}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
              title="Replay from Beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleToggleMute}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Voice' : 'Mute Voice'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowCaptions(prev => !prev)}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                showCaptions
                  ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
              title="Toggle Captions"
            >
              <Subtitles className="w-4 h-4" />
            </button>

            <span className="font-mono text-slate-400 text-[11px] ml-1">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onStartChallenge && (
              <button
                type="button"
                onClick={onStartChallenge}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Start Challenge</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. KEY CONCEPT BREAKDOWN DRAWER */}
      {showSummary && (
        <div className="p-5 bg-[#020308] border-t border-indigo-950/80 text-xs space-y-3">
          <div className="flex items-center justify-between text-amber-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Key Concept Breakdown</span>
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">
              Production Context
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed font-medium bg-[#070914] p-4 rounded-xl border border-indigo-900/60">
            {script.fallbackExplanation}
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-[11px] pt-1">
            <div className="bg-[#070914] p-3.5 rounded-xl border border-indigo-900/60 space-y-1">
              <h4 className="font-bold text-sky-400">Where is this used in production?</h4>
              <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                {script.realWorldUses.map((use, idx) => (
                  <li key={idx}>{use}</li>
                ))}
              </ul>
            </div>
            <div className="bg-[#070914] p-3.5 rounded-xl border border-indigo-900/60 space-y-1">
              <h4 className="font-bold text-emerald-400">What ability do you gain?</h4>
              <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                {script.studentBenefits.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 5. STORY TRANSCRIPT DRAWER */}
      {showTranscript && (
        <div className="p-5 bg-[#020308] border-t border-indigo-950/80 text-xs space-y-3 max-h-60 overflow-y-auto">
          <div className="flex items-center justify-between text-slate-300 font-bold">
            <span>Complete Story Script</span>
            <span className="text-[10px] text-slate-500">Narrator Voice</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans text-xs bg-[#070914] p-3.5 rounded-xl border border-indigo-900/60 whitespace-pre-line">
            {script.transcript}
          </p>
        </div>
      )}
    </div>
  );
};

export default CinematicPlayer;
