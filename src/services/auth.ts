import { User, UserProgressState, StudentPersona, TrackType, ExperienceLevel } from '../types';
import { DEMO_USERS } from '../data/demoUsers';

const AUTH_USER_KEY = 'abtalks_auth_user';
const AUTH_PROGRESS_KEY = 'abtalks_auth_progress';

export class AuthService {
  static getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading auth user from storage:', e);
    }
    // Return null when no user is logged in
    return null;
  }

  static getProgress(userId: string): UserProgressState {
    try {
      const stored = localStorage.getItem(`${AUTH_PROGRESS_KEY}_${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading progress from storage:', e);
    }

    // Match demo user progress if available
    const demoEntry = Object.values(DEMO_USERS).find(d => d.user.id === userId);
    if (demoEntry) {
      return demoEntry.progress;
    }

    // Fallback default progress state
    return DEMO_USERS['new_student'].progress;
  }

  static saveUser(user: User): void {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }

  static saveProgress(progress: UserProgressState): void {
    localStorage.setItem(`${AUTH_PROGRESS_KEY}_${progress.userId}`, JSON.stringify(progress));
  }

  static switchPersona(persona: StudentPersona): { user: User; progress: UserProgressState } {
    const keyMap: Record<StudentPersona, string> = {
      new: 'new_student',
      active: 'active_student',
      inconsistent: 'inconsistent_student',
      completed: 'completed_student'
    };

    const targetKey = keyMap[persona];
    const demo = DEMO_USERS[targetKey] || DEMO_USERS['active_student'];

    this.saveUser(demo.user);
    this.saveProgress(demo.progress);

    return { user: demo.user, progress: demo.progress };
  }

  static login(email: string): { user: User; progress: UserProgressState } {
    const cleanEmail = email.toLowerCase().trim();

    // Check if email or name matches any demo account
    const foundDemo = Object.values(DEMO_USERS).find(
      d => d.user.email.toLowerCase() === cleanEmail ||
           cleanEmail.includes(d.user.name.toLowerCase()) ||
           cleanEmail.includes(d.user.persona)
    );

    if (foundDemo) {
      this.saveUser(foundDemo.user);
      this.saveProgress(foundDemo.progress);
      return { user: foundDemo.user, progress: foundDemo.progress };
    }

    // Load custom account if existing in localStorage
    const existing = this.getCurrentUser();
    if (existing && existing.email.toLowerCase() === cleanEmail) {
      return { user: existing, progress: this.getProgress(existing.id) };
    }

    const newUser: User = {
      id: `usr_custom_${Date.now()}`,
      name: email.split('@')[0] || 'Student',
      email: email,
      track: 'fullstack',
      experienceLevel: 'beginner',
      primaryGoal: 'Build coding consistency over 60 days',
      persona: 'new',
      onboardingCompleted: false,
      createdAt: new Date().toISOString()
    };

    const newProgress: UserProgressState = {
      userId: newUser.id,
      currentDay: 1,
      currentStreak: 0,
      longestStreak: 0,
      completedDays: [],
      missedDays: [],
      unlockedAchievementIds: [],
      dayProgresses: {
        1: { dayId: 1, activityStatus: 'not_started', understandingStatus: 'not_checked', checkedRequirements: [] }
      }
    };

    this.saveUser(newUser);
    this.saveProgress(newProgress);
    return { user: newUser, progress: newProgress };
  }

  static signUp(name: string, email: string, track: TrackType, level: ExperienceLevel, goal: string): { user: User; progress: UserProgressState } {
    const newUser: User = {
      id: `usr_custom_${Date.now()}`,
      name,
      email,
      track,
      experienceLevel: level,
      primaryGoal: goal,
      persona: 'new',
      onboardingCompleted: false, // Redirect to onboarding flow after signup
      createdAt: new Date().toISOString()
    };

    const newProgress: UserProgressState = {
      userId: newUser.id,
      currentDay: 1,
      currentStreak: 0,
      longestStreak: 0,
      completedDays: [],
      missedDays: [],
      unlockedAchievementIds: [],
      dayProgresses: {
        1: { dayId: 1, activityStatus: 'not_started', understandingStatus: 'not_checked', checkedRequirements: [] }
      }
    };

    this.saveUser(newUser);
    this.saveProgress(newProgress);
    return { user: newUser, progress: newProgress };
  }

  static logout(): void {
    localStorage.removeItem(AUTH_USER_KEY);
  }
}
