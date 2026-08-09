import { Challenge, CurriculumStage, TrackType } from '../types';
import { FRONTEND_ROADMAP } from './roadmaps/frontend';
import { BACKEND_ROADMAP } from './roadmaps/backend';
import { FULLSTACK_ROADMAP } from './roadmaps/fullstack';
import { PYTHON_ROADMAP } from './roadmaps/python';
import { DATA_AI_ROADMAP } from './roadmaps/data-ai';

export const STAGE_NAMES: Record<CurriculumStage, string> = {
  'discover': 'Stage 1 — Discover (Days 1–10)',
  'build': 'Stage 2 — Build (Days 11–25)',
  'experiment': 'Stage 3 — Experiment (Days 26–35)',
  'real-world': 'Stage 4 — Real-World Problems (Days 36–45)',
  'build-your-own': 'Stage 5 — Build Your Own (Days 46–55)',
  'showcase': 'Stage 6 — Showcase (Days 56–60)'
};

export const CHALLENGES: Challenge[] = FULLSTACK_ROADMAP;

export function getRoadmapForTrack(track: TrackType): Challenge[] {
  switch (track) {
    case 'frontend':
      return FRONTEND_ROADMAP;
    case 'backend':
      return BACKEND_ROADMAP;
    case 'fullstack':
      return FULLSTACK_ROADMAP;
    case 'python':
      return PYTHON_ROADMAP;
    case 'data-ai':
      return DATA_AI_ROADMAP;
    default:
      return FULLSTACK_ROADMAP;
  }
}

export function getChallengeByDay(dayId: number, track: TrackType = 'fullstack'): Challenge | undefined {
  const roadmap = getRoadmapForTrack(track);
  return roadmap.find(c => c.dayId === dayId) || CHALLENGES.find(c => c.dayId === dayId);
}
