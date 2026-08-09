import { Journey, UserProgressState, TrackType, DayProgress, CheckpointData, UnderstandingStatus, Challenge, ExperienceLevel } from '../types';
import { getRoadmapForTrack } from '../data/curriculum';
import { CustomChallengeService, CreateChallengeInput } from './customChallengeService';
import { ProgressService } from './progressService';

export class JourneyService {
  private static getJourneysKey(userId: string): string {
    return `abtalks_journeys_${userId}`;
  }

  private static getProgressKey(userId: string, journeyId: string): string {
    return `abtalks_journey_progress_${userId}_${journeyId}`;
  }

  private static getActiveJourneyKey(userId: string): string {
    return `abtalks_active_journey_${userId}`;
  }

  // Get track human-friendly title
  static getTrackTitle(track: TrackType): string {
    switch (track) {
      case 'frontend': return 'Frontend Engineering';
      case 'backend': return 'Backend Engineering';
      case 'fullstack': return 'Full Stack Engineering';
      case 'python': return 'Python Engineering';
      case 'data-ai': return 'Data & AI Engineering';
      case 'java': return 'Java Engineering';
      case 'cybersecurity': return 'Cybersecurity Engineering';
      default: return 'Full Stack Engineering';
    }
  }

  // Get track category
  static getTrackCategory(track: TrackType): string {
    switch (track) {
      case 'frontend': return 'Frontend';
      case 'backend': return 'Backend';
      case 'fullstack': return 'Full Stack';
      case 'python': return 'Python';
      case 'data-ai': return 'Data & AI';
      case 'java': return 'Java';
      case 'cybersecurity': return 'Cybersecurity';
      default: return 'Full Stack';
    }
  }

  // Get all active (unarchived) journeys for a student
  static getJourneys(userId: string, userTrack: TrackType = 'frontend'): Journey[] {
    if (!userId) return [];
    try {
      const data = localStorage.getItem(this.getJourneysKey(userId));
      let journeys: Journey[] = data ? JSON.parse(data) : [];

      // Filter out archived
      journeys = journeys.filter(j => !j.archived);

      // If user has no journeys yet, initialize default track journey
      if (journeys.length === 0) {
        const defaultTrackJourney = this.createDefaultTrackJourney(userId, userTrack);
        journeys = [defaultTrackJourney];
        this.saveJourneys(userId, journeys);
      }

      return journeys;
    } catch {
      const fallback = [this.createDefaultTrackJourney(userId, userTrack)];
      return fallback;
    }
  }

  // Save journeys array
  static saveJourneys(userId: string, journeys: Journey[]): void {
    if (!userId) return;
    try {
      localStorage.setItem(this.getJourneysKey(userId), JSON.stringify(journeys));
    } catch (e) {
      console.error('Failed to save journeys:', e);
    }
  }

  // Create default track journey
  static createDefaultTrackJourney(userId: string, track: TrackType): Journey {
    const roadmap = getRoadmapForTrack(track);
    const todayStr = new Date().toISOString().split('T')[0];

    return {
      id: `track_${track}`,
      userId,
      title: this.getTrackTitle(track),
      category: this.getTrackCategory(track),
      type: 'track',
      trackKey: track,
      goalTitle: this.getTrackTitle(track),
      experienceLevel: 'beginner',
      dailyTimeGoal: '30-45 minutes',
      finalOutcome: 'Become job-ready and consistent in 60 days',
      createdAt: new Date().toISOString(),
      startDate: todayStr,
      roadmap
    };
  }

  // Get active journey ID for user
  static getActiveJourneyId(userId: string, defaultTrack: TrackType = 'frontend'): string {
    if (!userId) return `track_${defaultTrack}`;
    try {
      const activeId = localStorage.getItem(this.getActiveJourneyKey(userId));
      if (activeId) {
        const journeys = this.getJourneys(userId, defaultTrack);
        if (journeys.some(j => j.id === activeId)) {
          return activeId;
        }
      }
      const journeys = this.getJourneys(userId, defaultTrack);
      return journeys[0]?.id || `track_${defaultTrack}`;
    } catch {
      return `track_${defaultTrack}`;
    }
  }

  // Set active journey ID
  static setActiveJourneyId(userId: string, journeyId: string): void {
    if (!userId || !journeyId) return;
    try {
      localStorage.setItem(this.getActiveJourneyKey(userId), journeyId);
    } catch (e) {
      console.error('Failed to set active journey ID:', e);
    }
  }

  // Get ISOLATED progress state for a specific journey ID
  static getJourneyProgress(userId: string, journeyId: string, userTrack: TrackType = 'frontend'): UserProgressState {
    if (!userId || !journeyId) return this.createInitialProgress(userId, journeyId);

    const progressKey = this.getProgressKey(userId, journeyId);

    try {
      const data = localStorage.getItem(progressKey);
      if (data) {
        return JSON.parse(data);
      }

      // Migration check: If this is the default track journey and legacy progress exists under `abtalks_auth_progress_${userId}`
      if (journeyId.startsWith('track_')) {
        const legacyData = localStorage.getItem(`abtalks_auth_progress_${userId}`);
        if (legacyData) {
          const legacyProg: UserProgressState = JSON.parse(legacyData);
          legacyProg.journeyId = journeyId;
          this.saveJourneyProgress(userId, journeyId, legacyProg);
          return legacyProg;
        }
      }

      // Fresh new journey progress start state
      const newProgress = this.createInitialProgress(userId, journeyId);
      this.saveJourneyProgress(userId, journeyId, newProgress);
      return newProgress;
    } catch {
      return this.createInitialProgress(userId, journeyId);
    }
  }

  // Create isolated initial progress state
  static createInitialProgress(userId: string, journeyId: string): UserProgressState {
    return {
      userId,
      journeyId,
      currentDay: 1,
      currentStreak: 0,
      longestStreak: 0,
      completedDays: [],
      missedDays: [],
      unlockedAchievementIds: [],
      activityDates: [],
      dayProgresses: {
        1: { dayId: 1, activityStatus: 'not_started', understandingStatus: 'not_checked', checkedRequirements: [] }
      }
    };
  }

  // Save progress state for a specific journey ID
  static saveJourneyProgress(userId: string, journeyId: string, progress: UserProgressState): void {
    if (!userId || !journeyId) return;
    try {
      const key = this.getProgressKey(userId, journeyId);
      localStorage.setItem(key, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save journey progress:', e);
    }
  }

  // Create a new Personal Challenge / Journey
  static async createPersonalJourney(
    userId: string,
    input: CreateChallengeInput
  ): Promise<{ journey: Journey; isFallback: boolean }> {
    const { challenge, isFallback } = await CustomChallengeService.createCustomChallenge(userId, input);

    // Convert custom challenge roadmap to standard Challenge[] array
    const roadmap: Challenge[] = challenge.roadmap.map(rmDay =>
      CustomChallengeService.convertToChallenge(rmDay, input.category)
    );

    const todayStr = new Date().toISOString().split('T')[0];

    const newJourney: Journey = {
      id: challenge.id,
      userId,
      title: input.goalTitle || input.category || 'My 60-Day Personal Challenge',
      category: input.category,
      type: 'custom',
      goalTitle: input.goalTitle,
      experienceLevel: input.experienceLevel,
      dailyTimeGoal: input.dailyTimeGoal,
      finalOutcome: input.finalOutcome,
      createdAt: new Date().toISOString(),
      startDate: todayStr,
      roadmap
    };

    // Save journey to journeys list
    const existingJourneys = this.getJourneys(userId);
    existingJourneys.push(newJourney);
    this.saveJourneys(userId, existingJourneys);

    // Initialize completely fresh isolated progress starting at Day 1, 0 streak
    const initialProgress = this.createInitialProgress(userId, newJourney.id);
    this.saveJourneyProgress(userId, newJourney.id, initialProgress);

    // Set as active journey
    this.setActiveJourneyId(userId, newJourney.id);

    return { journey: newJourney, isFallback };
  }

  // Submit proof of work for specific journey ID
  static submitProofOfWork(
    userId: string,
    journeyId: string,
    dayId: number,
    repoUrl: string,
    linkedinUrl: string,
    checkpointData?: CheckpointData
  ): { updatedProgress: UserProgressState; newAchievements: string[] } {
    const progress = this.getJourneyProgress(userId, journeyId);

    const { updatedProgress, newAchievements } = ProgressService.submitProofOfWork(
      progress,
      dayId,
      repoUrl,
      linkedinUrl,
      checkpointData
    );

    updatedProgress.journeyId = journeyId;
    this.saveJourneyProgress(userId, journeyId, updatedProgress);

    return { updatedProgress, newAchievements };
  }

  // Toggle requirement checkbox for specific journey
  static toggleRequirement(userId: string, journeyId: string, dayId: number, reqIndex: number): UserProgressState {
    const progress = this.getJourneyProgress(userId, journeyId);
    const updated = ProgressService.toggleRequirement(progress, dayId, reqIndex);
    updated.journeyId = journeyId;
    this.saveJourneyProgress(userId, journeyId, updated);
    return updated;
  }

  // Save reflection for specific journey
  static saveReflection(userId: string, journeyId: string, dayId: number, checkpointData: CheckpointData): UserProgressState {
    const progress = this.getJourneyProgress(userId, journeyId);
    const updated = ProgressService.saveReflection(progress, dayId, checkpointData);
    updated.journeyId = journeyId;
    this.saveJourneyProgress(userId, journeyId, updated);
    return updated;
  }

  // Update understanding status for specific journey
  static updateUnderstandingStatus(userId: string, journeyId: string, dayId: number, status: UnderstandingStatus): UserProgressState {
    const progress = this.getJourneyProgress(userId, journeyId);
    const updated = ProgressService.updateUnderstandingStatus(progress, dayId, status);
    updated.journeyId = journeyId;
    this.saveJourneyProgress(userId, journeyId, updated);
    return updated;
  }

  // Permanently delete a journey and its stored progress
  static deleteJourney(userId: string, journeyId: string): string {
    let journeys = this.getJourneys(userId);
    journeys = journeys.filter(j => j.id !== journeyId);
    this.saveJourneys(userId, journeys);

    // Clean up stored progress
    try {
      localStorage.removeItem(this.getProgressKey(userId, journeyId));
    } catch (e) {
      console.error('Failed to clear deleted journey progress:', e);
    }

    const remaining = journeys.filter(j => !j.archived);
    const newActiveId = remaining[0]?.id || `track_frontend`;
    this.setActiveJourneyId(userId, newActiveId);
    return newActiveId;
  }

  // Archive a journey
  static archiveJourney(userId: string, journeyId: string): string {
    const journeys = this.getJourneys(userId);
    const target = journeys.find(j => j.id === journeyId);
    if (target) {
      target.archived = true;
      this.saveJourneys(userId, journeys);
    }

    const remaining = journeys.filter(j => !j.archived);
    const newActiveId = remaining[0]?.id || `track_frontend`;
    this.setActiveJourneyId(userId, newActiveId);
    return newActiveId;
  }
}
