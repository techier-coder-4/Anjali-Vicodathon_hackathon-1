export type TrackType = 'frontend' | 'backend' | 'fullstack' | 'python' | 'data-ai' | 'java' | 'cybersecurity';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type StudentPersona = 'new' | 'active' | 'inconsistent' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  track: TrackType;
  experienceLevel: ExperienceLevel;
  primaryGoal: string;
  college?: string;
  graduationYear?: string;
  dailyTimeGoal?: string;
  persona: StudentPersona;
  onboardingCompleted: boolean;
  journeyStartDate?: string;
  createdAt: string;
}

export type ChallengeType = 'build' | 'debug' | 'experiment' | 'solve' | 'design' | 'improve' | 'project';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type CurriculumStage = 'discover' | 'build' | 'experiment' | 'real-world' | 'build-your-own' | 'showcase';

export interface Challenge {
  dayId: number;
  trackId: TrackType;
  title: string;
  description: string;
  requirements: string[];
  learningObjective: string;
  whyItMatters: string;
  challengeType: ChallengeType;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  curiosityPrompt: string;
  skills: string[];
  tools: string[];
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

export interface CustomChallengeRoadmapDay {
  dayId: number;
  title: string;
  whyItMatters: string;
  whatToLearn: string;
  whatToBuild: string;
  expectedOutcome: string;
  estimatedMinutes: number;
  curiosityPrompt?: string;
  skills: string[];
}

export interface CustomChallenge {
  id: string;
  userId: string;
  goalTitle: string;
  category: string;
  experienceLevel: ExperienceLevel;
  dailyTimeGoal: string;
  finalOutcome: string;
  roadmap: CustomChallengeRoadmapDay[];
  createdAt: string;
  activeDay: number;
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
  joinedCommunityChallengeIds?: string[];
  completedCommunityChallengeIds?: string[];
  activeMode?: 'track' | 'custom';
  activeCustomChallengeId?: string;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  category: 'Weekend Build' | 'JavaScript Sprint' | 'UI Recreation' | 'API Challenge' | 'Debugging Sprint' | 'AI Mini Project' | 'Security Challenge' | 'Community Open Source';
  difficulty: DifficultyLevel;
  startDate: string;
  endDate: string;
  durationLabel: string;
  estimatedTime: string;
  participantsCount: number;
  statusType: 'upcoming' | 'ongoing' | 'completed';
  skills: string[];
  rules: string[];
  rewardBadge: string;
  projectPrompt: string;
  whoItIsFor?: string;
  whatYoullBuild?: string;
  submissionExpectations?: string;
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
