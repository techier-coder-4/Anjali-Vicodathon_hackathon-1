import { User, UserProgressState, DayProgress } from '../types';

/**
 * Utility for Asia/Kolkata timezone calendar date calculations
 */

export function getKolkataDateString(dateInput?: Date | string | number): string {
  const d = dateInput ? new Date(dateInput) : new Date();
  // Format in Asia/Kolkata timezone: YYYY-MM-DD
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  const parts = new Intl.DateTimeFormat('en-CA', options).formatToParts(d);
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;

  if (year && month && day) {
    return `${year}-${month}-${day}`;
  }

  // Fallback
  return d.toISOString().split('T')[0];
}

export function getDaysDifference(startDateStr: string, endDateStr: string): number {
  const start = new Date(`${startDateStr}T00:00:00+05:30`);
  const end = new Date(`${endDateStr}T00:00:00+05:30`);
  const diffTime = end.getTime() - start.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateCurrentDayFromStartDate(journeyStartDateStr?: string): number {
  if (!journeyStartDateStr) return 1;
  const todayKolkata = getKolkataDateString();
  const diffDays = getDaysDifference(journeyStartDateStr, todayKolkata);
  const calculatedDay = diffDays + 1;
  return Math.min(60, Math.max(1, calculatedDay));
}

/**
 * Calculates calendar progression for the user's 60-day journey.
 * - Advances currentDay based on journeyStartDate.
 * - Marks uncompleted past days as 'missed'.
 * - Breaks streak if past days were missed without completion.
 */
export function syncProgressWithJourneyDate(
  user: User,
  progress: UserProgressState
): UserProgressState {
  if (!user.journeyStartDate) {
    return progress;
  }

  const calculatedCurrentDay = calculateCurrentDayFromStartDate(user.journeyStartDate);
  const updatedDayProgresses = { ...progress.dayProgresses };
  const completedSet = new Set(progress.completedDays);
  const missedSet = new Set(progress.missedDays);

  // Check all days up to calculatedCurrentDay - 1
  for (let day = 1; day < calculatedCurrentDay; day++) {
    const dayProg = updatedDayProgresses[day];
    const isCompleted = completedSet.has(day) || dayProg?.activityStatus === 'submitted';

    if (!isCompleted) {
      missedSet.add(day);
      updatedDayProgresses[day] = {
        dayId: day,
        activityStatus: 'missed',
        understandingStatus: dayProg?.understandingStatus || 'not_checked',
        checkedRequirements: dayProg?.checkedRequirements || [],
        repoUrl: dayProg?.repoUrl,
        linkedinUrl: dayProg?.linkedinUrl
      };
    }
  }

  // Current day status
  if (!updatedDayProgresses[calculatedCurrentDay]) {
    updatedDayProgresses[calculatedCurrentDay] = {
      dayId: calculatedCurrentDay,
      activityStatus: 'not_started',
      understandingStatus: 'not_checked',
      checkedRequirements: []
    };
  }

  // Recalculate current streak
  let currentStreak = 0;
  for (let day = calculatedCurrentDay - 1; day >= 1; day--) {
    if (completedSet.has(day) || updatedDayProgresses[day]?.activityStatus === 'submitted') {
      currentStreak += 1;
    } else {
      break; // Streak broken on missed day
    }
  }

  // Include today if today is completed
  if (completedSet.has(calculatedCurrentDay) || updatedDayProgresses[calculatedCurrentDay]?.activityStatus === 'submitted') {
    currentStreak += 1;
  }

  const longestStreak = Math.max(progress.longestStreak || 0, currentStreak);

  return {
    ...progress,
    currentDay: calculatedCurrentDay,
    currentStreak,
    longestStreak,
    missedDays: Array.from(missedSet).sort((a, b) => a - b),
    dayProgresses: updatedDayProgresses
  };
}
