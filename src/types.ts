export type TrackType = 'fullstack' | 'frontend' | 'backend' | 'ai';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type StudentPersona = 'new' | 'active' | 'inconsistent' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  track: TrackType;
  experienceLevel: ExperienceLevel;
  primaryGoal: string;
  persona: StudentPersona;
  onboardingCompleted: boolean;
  createdAt: string;
}

export type ChallengeType = 'build' | 'debug' | 'experiment' | 'solve' | 'design' | 'improve' | 'project';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type CurriculumStage = 'discover' | 'build' | 'experiment' | 'real-world' | 'build-your-own' | 'showcase';

export interface Challenge {
  dayId: number;
  title: string;
  description: string;
  requirements: string[];
  learningObjective: string;
  whyItMatters: string;
  challengeType: ChallengeType;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  curiosityPrompt: string;
  stage: CurriculumStage;
  stageName: string;
}

export type ActivityStatus = 'not_started' | 'pending' | 'submitted' | 'missed';
export type UnderstandingStatus = 'not_checked' | 'understood' | 'needs_revisiting';

export interface CheckpointData {
  learned: string;
  usage: string;
  confusing: string;
}

export interface DayProgress {
  dayId: number;
  activityStatus: ActivityStatus;
  understandingStatus: UnderstandingStatus;
  completedAt?: string;
  repoUrl?: string;
  linkedinUrl?: string;
  checkedRequirements: number[];
  checkpointData?: CheckpointData;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
}

export interface UserProgressState {
  userId: string;
  currentDay: number;
  currentStreak: number;
  longestStreak: number;
  completedDays: number[];
  missedDays: number[];
  unlockedAchievementIds: string[];
  dayProgresses: Record<number, DayProgress>;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
  isHint?: boolean;
  isFallback?: boolean;
}

export interface GuidedModeHelp {
  whyItMatters: string;
  whatYoullLearn: string;
  startHere: string;
  thinkAboutThis: string;
  nextStep: string;
  requirementsChecklist: string[];
}
