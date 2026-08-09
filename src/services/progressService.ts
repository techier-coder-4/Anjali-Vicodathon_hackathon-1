import { UserProgressState, DayProgress, ActivityStatus, UnderstandingStatus, CheckpointData } from '../types';
import { AuthService } from './auth';

export class ProgressService {
  static getDayProgress(progress: UserProgressState, dayId: number): DayProgress {
    if (progress.dayProgresses[dayId]) {
      return progress.dayProgresses[dayId];
    }
    // Default day progress
    return {
      dayId,
      activityStatus: dayId < progress.currentDay && !progress.completedDays.includes(dayId) ? 'missed' : 'not_started',
      understandingStatus: 'not_checked',
      checkedRequirements: []
    };
  }

  static toggleRequirement(progress: UserProgressState, dayId: number, reqIndex: number): UserProgressState {
    const currentDayProg = this.getDayProgress(progress, dayId);
    const existingChecks = currentDayProg.checkedRequirements || [];
    const newChecks = existingChecks.includes(reqIndex)
      ? existingChecks.filter(i => i !== reqIndex)
      : [...existingChecks, reqIndex];

    const updatedDayProg: DayProgress = {
      ...currentDayProg,
      checkedRequirements: newChecks
    };

    const updatedProgress: UserProgressState = {
      ...progress,
      dayProgresses: {
        ...progress.dayProgresses,
        [dayId]: updatedDayProg
      }
    };

    AuthService.saveProgress(updatedProgress);
    return updatedProgress;
  }

  static submitProofOfWork(
    progress: UserProgressState,
    dayId: number,
    repoUrl: string,
    linkedinUrl: string,
    checkpointData?: CheckpointData
  ): { updatedProgress: UserProgressState; newAchievements: string[] } {
    const currentDayProg = this.getDayProgress(progress, dayId);

    let evalUnderstanding: UnderstandingStatus = currentDayProg.understandingStatus;
    if (checkpointData) {
      const learned = checkpointData.learned?.trim() || '';
      const usage = checkpointData.usage?.trim() || '';
      const confusing = checkpointData.confusing?.trim() || '';

      if (learned.length < 10 || usage.length < 10 || confusing.length > 30) {
        evalUnderstanding = 'needs_revisiting';
      } else {
        evalUnderstanding = 'understood';
      }
    }

    // Activity status becomes 'submitted'
    const updatedDayProg: DayProgress = {
      ...currentDayProg,
      activityStatus: 'submitted' as ActivityStatus,
      completedAt: new Date().toISOString(),
      repoUrl,
      linkedinUrl,
      checkpointData: checkpointData || currentDayProg.checkpointData,
      understandingStatus: evalUnderstanding
    };

    const updatedCompletedDays = progress.completedDays.includes(dayId)
      ? progress.completedDays
      : [...progress.completedDays, dayId].sort((a, b) => a - b);

    // Calculate streak
    let currentStreak = progress.currentStreak;
    if (!progress.completedDays.includes(dayId)) {
      currentStreak += 1;
    }
    const longestStreak = Math.max(progress.longestStreak, currentStreak);

    // Advance current day if this was the active current day
    const nextCurrentDay = dayId === progress.currentDay && dayId < 60 ? dayId + 1 : progress.currentDay;

    // Check achievement unlocks
    const newAchievements: string[] = [];
    const currentUnlocked = new Set(progress.unlockedAchievementIds);

    if (updatedCompletedDays.length >= 1 && !currentUnlocked.has('first_build')) {
      newAchievements.push('first_build');
      currentUnlocked.add('first_build');
    }
    if (currentStreak >= 3 && !currentUnlocked.has('streak_3')) {
      newAchievements.push('streak_3');
      currentUnlocked.add('streak_3');
    }
    if (currentStreak >= 7 && !currentUnlocked.has('streak_7')) {
      newAchievements.push('streak_7');
      currentUnlocked.add('streak_7');
    }
    if (currentStreak >= 14 && !currentUnlocked.has('streak_14')) {
      newAchievements.push('streak_14');
      currentUnlocked.add('streak_14');
    }
    if (updatedCompletedDays.includes(10) && !currentUnlocked.has('first_project')) {
      newAchievements.push('first_project');
      currentUnlocked.add('first_project');
    }
    if (updatedCompletedDays.length >= 30 && !currentUnlocked.has('streak_30')) {
      newAchievements.push('streak_30');
      currentUnlocked.add('streak_30');
    }
    if (updatedCompletedDays.length >= 45 && !currentUnlocked.has('builder_45')) {
      newAchievements.push('builder_45');
      currentUnlocked.add('builder_45');
    }
    if (updatedCompletedDays.length >= 60 && !currentUnlocked.has('completion_60')) {
      newAchievements.push('completion_60');
      currentUnlocked.add('completion_60');
    }

    const updatedProgress: UserProgressState = {
      ...progress,
      currentDay: nextCurrentDay,
      currentStreak,
      longestStreak,
      completedDays: updatedCompletedDays,
      unlockedAchievementIds: Array.from(currentUnlocked),
      dayProgresses: {
        ...progress.dayProgresses,
        [dayId]: updatedDayProg
      }
    };

    AuthService.saveProgress(updatedProgress);
    return { updatedProgress, newAchievements };
  }

  static saveReflection(
    progress: UserProgressState,
    dayId: number,
    checkpointData: CheckpointData
  ): UserProgressState {
    const currentDayProg = this.getDayProgress(progress, dayId);

    const learned = checkpointData.learned?.trim() || '';
    const usage = checkpointData.usage?.trim() || '';
    const confusing = checkpointData.confusing?.trim() || '';

    // Heuristic: requires meaningful answers for learned & usage (at least 10 chars each)
    // and confusing note length check
    let evalUnderstanding: UnderstandingStatus = 'understood';
    if (learned.length < 10 || usage.length < 10 || confusing.length > 30) {
      evalUnderstanding = 'needs_revisiting';
    }

    const updatedDayProg: DayProgress = {
      ...currentDayProg,
      checkpointData: {
        learned,
        usage,
        confusing
      },
      understandingStatus: evalUnderstanding
    };

    const updatedProgress: UserProgressState = {
      ...progress,
      dayProgresses: {
        ...progress.dayProgresses,
        [dayId]: updatedDayProg
      }
    };

    AuthService.saveProgress(updatedProgress);
    return updatedProgress;
  }

  static updateUnderstandingStatus(
    progress: UserProgressState,
    dayId: number,
    status: UnderstandingStatus
  ): UserProgressState {
    const currentDayProg = this.getDayProgress(progress, dayId);
    const updatedDayProg: DayProgress = {
      ...currentDayProg,
      understandingStatus: status
    };

    const updatedProgress: UserProgressState = {
      ...progress,
      dayProgresses: {
        ...progress.dayProgresses,
        [dayId]: updatedDayProg
      }
    };

    AuthService.saveProgress(updatedProgress);
    return updatedProgress;
  }
}
