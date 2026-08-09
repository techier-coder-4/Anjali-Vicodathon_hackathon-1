import { User, UserProgressState, DayProgress } from '../types';

export const DEMO_USERS: Record<string, { user: User; progress: UserProgressState }> = {
  'new_student': {
    user: {
      id: 'usr_new_01',
      name: 'Aarav',
      email: 'aarav@student.abtalks.dev',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      track: 'frontend',
      experienceLevel: 'beginner',
      primaryGoal: 'Learn frontend engineering step by step and build consistency over 60 days.',
      persona: 'new',
      onboardingCompleted: false,
      createdAt: '2026-08-01T10:00:00Z'
    },
    progress: {
      userId: 'usr_new_01',
      currentDay: 1,
      currentStreak: 0,
      longestStreak: 0,
      completedDays: [],
      missedDays: [],
      unlockedAchievementIds: [],
      dayProgresses: {
        1: {
          dayId: 1,
          activityStatus: 'not_started',
          understandingStatus: 'not_checked',
          checkedRequirements: []
        }
      }
    }
  },

  'active_student': {
    user: {
      id: 'usr_active_12',
      name: 'Ananya',
      email: 'ananya@student.abtalks.dev',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
      track: 'frontend',
      experienceLevel: 'intermediate',
      primaryGoal: 'Transition into frontend engineering by building consistent daily coding habits.',
      persona: 'active',
      onboardingCompleted: true,
      createdAt: '2026-07-22T10:00:00Z'
    },
    progress: {
      userId: 'usr_active_12',
      currentDay: 12,
      currentStreak: 7,
      longestStreak: 7,
      completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      missedDays: [],
      unlockedAchievementIds: ['first_build', 'streak_3', 'streak_7', 'first_project'],
      dayProgresses: (() => {
        const progs: Record<number, DayProgress> = {};
        for (let i = 1; i <= 11; i++) {
          progs[i] = {
            dayId: i,
            activityStatus: 'submitted',
            understandingStatus: 'understood',
            completedAt: new Date(Date.now() - (12 - i) * 86400000).toISOString(),
            repoUrl: `https://github.com/ananya/abtalks-60days/tree/main/day-${i}`,
            linkedinUrl: `https://linkedin.com/posts/ananya_abtalks60days-day${i}`,
            checkedRequirements: [0, 1, 2, 3],
            checkpointData: (i % 3 === 0) ? {
              learned: `Solidified key concepts around day ${i}. Handled state transitions and async calls smoothly.`,
              usage: `Applied directly when designing client REST adapters and React hooks.`,
              confusing: `Initial edge case handling needed an extra refactor pass.`
            } : undefined
          };
        }
        progs[12] = {
          dayId: 12,
          activityStatus: 'not_started',
          understandingStatus: 'not_checked',
          checkedRequirements: []
        };
        return progs;
      })()
    }
  },

  'inconsistent_student': {
    user: {
      id: 'usr_inconsistent_23',
      name: 'Rahul',
      email: 'rahul@student.abtalks.dev',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      track: 'fullstack',
      experienceLevel: 'intermediate',
      primaryGoal: 'Master full-stack web development without giving up mid-way.',
      persona: 'inconsistent',
      onboardingCompleted: true,
      createdAt: '2026-07-15T10:00:00Z'
    },
    progress: {
      userId: 'usr_inconsistent_23',
      currentDay: 23,
      currentStreak: 2,
      longestStreak: 18,
      completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22],
      missedDays: [19, 21],
      unlockedAchievementIds: ['first_build', 'streak_3', 'streak_7', 'streak_14', 'first_project'],
      dayProgresses: (() => {
        const progs: Record<number, DayProgress> = {};
        const completed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22];
        for (const i of completed) {
          progs[i] = {
            dayId: i,
            activityStatus: 'submitted',
            understandingStatus: 'understood',
            completedAt: new Date(Date.now() - (24 - i) * 86400000).toISOString(),
            repoUrl: `https://github.com/rahul/abtalks-challenge/day${i}`,
            linkedinUrl: `https://linkedin.com/posts/rahul_day${i}-abtalks`,
            checkedRequirements: [0, 1, 2]
          };
        }
        progs[19] = { dayId: 19, activityStatus: 'missed', understandingStatus: 'needs_revisiting', checkedRequirements: [] };
        progs[21] = { dayId: 21, activityStatus: 'missed', understandingStatus: 'needs_revisiting', checkedRequirements: [] };
        progs[23] = { dayId: 23, activityStatus: 'not_started', understandingStatus: 'not_checked', checkedRequirements: [] };
        return progs;
      })()
    }
  },

  'completed_student': {
    user: {
      id: 'usr_completed_60',
      name: 'Meera',
      email: 'meera@student.abtalks.dev',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      track: 'fullstack',
      experienceLevel: 'advanced',
      primaryGoal: 'Build a production-ready portfolio to launch my software engineering career.',
      persona: 'completed',
      onboardingCompleted: true,
      createdAt: '2026-06-08T10:00:00Z'
    },
    progress: {
      userId: 'usr_completed_60',
      currentDay: 60,
      currentStreak: 21,
      longestStreak: 60,
      completedDays: Array.from({ length: 60 }, (_, i) => i + 1),
      missedDays: [],
      unlockedAchievementIds: ['first_build', 'streak_3', 'streak_7', 'streak_14', 'first_project', 'streak_30', 'builder_45', 'completion_60'],
      dayProgresses: (() => {
        const progs: Record<number, DayProgress> = {};
        for (let i = 1; i <= 60; i++) {
          progs[i] = {
            dayId: i,
            activityStatus: 'submitted',
            understandingStatus: 'understood',
            completedAt: new Date(Date.now() - (60 - i) * 86400000).toISOString(),
            repoUrl: `https://github.com/meera/abtalks-60day-mastery/tree/main/day-${i}`,
            linkedinUrl: `https://linkedin.com/posts/meera_abtalks60days-day${i}`,
            checkedRequirements: [0, 1, 2, 3],
            checkpointData: (i % 3 === 0) ? {
              learned: `Deeply mastered the concepts of day ${i}. Built scalable interfaces and clean backend logic.`,
              usage: `Used in production portfolio app deployed on Cloud Run.`,
              confusing: `Resolved all edge cases during optimization pass.`
            } : undefined
          };
        }
        return progs;
      })()
    }
  }
};

