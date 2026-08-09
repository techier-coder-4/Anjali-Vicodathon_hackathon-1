import { User, UserProgressState, DayProgress } from '../types';
import { getKolkataDateString } from '../utils/dateUtils';

const todayKolkata = getKolkataDateString();
const daysAgo = (days: number) => {
  const d = new Date(`${todayKolkata}T00:00:00+05:30`);
  d.setDate(d.getDate() - days);
  return getKolkataDateString(d);
};

export const DEMO_USERS: Record<string, { user: User; progress: UserProgressState }> = {
  'new_student': {
    user: {
      id: 'usr_new_01',
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      password: 'DemoPassword123',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      track: 'frontend',
      experienceLevel: 'beginner',
      primaryGoal: 'Learn frontend engineering step by step and build consistency over 60 days.',
      college: 'Delhi Technological University',
      graduationYear: '2026',
      dailyTimeGoal: '30 mins',
      persona: 'new',
      onboardingCompleted: false,
      journeyStartDate: todayKolkata,
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
      joinedCommunityChallengeIds: [],
      completedCommunityChallengeIds: [],
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
      name: 'Ananya Reddy',
      email: 'ananya@example.com',
      password: 'DemoPassword123',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
      track: 'fullstack',
      experienceLevel: 'intermediate',
      primaryGoal: 'Transition into full-stack engineering by building consistent daily coding habits.',
      college: 'IIT Hyderabad',
      graduationYear: '2025',
      dailyTimeGoal: '45 mins',
      persona: 'active',
      onboardingCompleted: true,
      journeyStartDate: daysAgo(17),
      createdAt: '2026-07-22T10:00:00Z'
    },
    progress: {
      userId: 'usr_active_12',
      currentDay: 18,
      currentStreak: 12,
      longestStreak: 12,
      completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      missedDays: [],
      unlockedAchievementIds: ['first_build', 'streak_3', 'streak_7', 'first_project'],
      joinedCommunityChallengeIds: ['cc_weekend_weather', 'cc_js_sprint'],
      completedCommunityChallengeIds: ['cc_js_sprint'],
      dayProgresses: (() => {
        const progs: Record<number, DayProgress> = {};
        for (let i = 1; i <= 12; i++) {
          progs[i] = {
            dayId: i,
            activityStatus: 'submitted',
            understandingStatus: (i % 3 === 0) ? 'understood' : 'not_checked',
            completedAt: new Date(Date.now() - (18 - i) * 86400000).toISOString(),
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
        progs[18] = {
          dayId: 18,
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
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      password: 'DemoPassword123',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      track: 'backend',
      experienceLevel: 'intermediate',
      primaryGoal: 'Master backend systems without giving up mid-way.',
      college: 'NIT Trichy',
      graduationYear: '2026',
      dailyTimeGoal: '30 mins',
      persona: 'inconsistent',
      onboardingCompleted: true,
      journeyStartDate: daysAgo(26),
      createdAt: '2026-07-15T10:00:00Z'
    },
    progress: {
      userId: 'usr_inconsistent_23',
      currentDay: 27,
      currentStreak: 2,
      longestStreak: 18,
      completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 23, 25],
      missedDays: [19, 21, 24, 26],
      unlockedAchievementIds: ['first_build', 'streak_3', 'streak_7', 'streak_14', 'first_project'],
      joinedCommunityChallengeIds: ['cc_api_challenge'],
      completedCommunityChallengeIds: [],
      dayProgresses: (() => {
        const progs: Record<number, DayProgress> = {};
        const completed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 23, 25];
        for (const i of completed) {
          progs[i] = {
            dayId: i,
            activityStatus: 'submitted',
            understandingStatus: (i % 3 === 0) ? 'understood' : 'not_checked',
            completedAt: new Date(Date.now() - (27 - i) * 86400000).toISOString(),
            repoUrl: `https://github.com/rahul/abtalks-challenge/day${i}`,
            linkedinUrl: `https://linkedin.com/posts/rahul_day${i}-abtalks`,
            checkedRequirements: [0, 1, 2]
          };
        }
        progs[19] = { dayId: 19, activityStatus: 'missed', understandingStatus: 'not_checked', checkedRequirements: [] };
        progs[21] = { dayId: 21, activityStatus: 'missed', understandingStatus: 'not_checked', checkedRequirements: [] };
        progs[24] = { dayId: 24, activityStatus: 'missed', understandingStatus: 'not_checked', checkedRequirements: [] };
        progs[26] = { dayId: 26, activityStatus: 'missed', understandingStatus: 'not_checked', checkedRequirements: [] };
        progs[27] = { dayId: 27, activityStatus: 'not_started', understandingStatus: 'not_checked', checkedRequirements: [] };
        return progs;
      })()
    }
  },

  'completed_student': {
    user: {
      id: 'usr_completed_60',
      name: 'Priya Nair',
      email: 'priya@example.com',
      password: 'DemoPassword123',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      track: 'data-ai',
      experienceLevel: 'advanced',
      primaryGoal: 'Build a production-ready portfolio in Data & AI to launch my software engineering career.',
      college: 'BITS Pilani',
      graduationYear: '2025',
      dailyTimeGoal: '60+ mins',
      persona: 'completed',
      onboardingCompleted: true,
      journeyStartDate: daysAgo(59),
      createdAt: '2026-06-08T10:00:00Z'
    },
    progress: {
      userId: 'usr_completed_60',
      currentDay: 60,
      currentStreak: 60,
      longestStreak: 60,
      completedDays: Array.from({ length: 60 }, (_, i) => i + 1),
      missedDays: [],
      unlockedAchievementIds: ['first_build', 'streak_3', 'streak_7', 'streak_14', 'first_project', 'streak_30', 'builder_45', 'completion_60'],
      joinedCommunityChallengeIds: ['cc_weekend_weather', 'cc_js_sprint', 'cc_open_source', 'cc_debugging_sprint'],
      completedCommunityChallengeIds: ['cc_js_sprint', 'cc_open_source'],
      dayProgresses: (() => {
        const progs: Record<number, DayProgress> = {};
        for (let i = 1; i <= 60; i++) {
          progs[i] = {
            dayId: i,
            activityStatus: 'submitted',
            understandingStatus: (i % 3 === 0) ? 'understood' : 'not_checked',
            completedAt: new Date(Date.now() - (60 - i) * 86400000).toISOString(),
            repoUrl: `https://github.com/priya/abtalks-data-ai/tree/main/day-${i}`,
            linkedinUrl: `https://linkedin.com/posts/priya_abtalks60days-day${i}`,
            checkedRequirements: [0, 1, 2, 3],
            checkpointData: (i % 3 === 0) ? {
              learned: `Deeply mastered the concepts of day ${i}. Built scalable interfaces and clean ML pipelines.`,
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
