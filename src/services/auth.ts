import { User, UserProgressState, StudentPersona, TrackType, ExperienceLevel } from '../types';
import { DEMO_USERS } from '../data/demoUsers';
import { getKolkataDateString, syncProgressWithJourneyDate } from '../utils/dateUtils';

const AUTH_USER_KEY = 'abtalks_auth_user';
const AUTH_PROGRESS_KEY = 'abtalks_auth_progress';
const REGISTERED_USERS_KEY = 'abtalks_registered_users';

export class AuthService {
  static getRegisteredUsers(): User[] {
    try {
      const stored = localStorage.getItem(REGISTERED_USERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading registered users:', e);
    }

    // Default registered demo users
    const defaultUsers = Object.values(DEMO_USERS).map(d => d.user);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  static saveRegisteredUsers(users: User[]): void {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  }

  static getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading auth user from storage:', e);
    }
    return null;
  }

  static getProgress(userId: string): UserProgressState {
    let rawProgress: UserProgressState | null = null;
    try {
      const stored = localStorage.getItem(`${AUTH_PROGRESS_KEY}_${userId}`);
      if (stored) {
        rawProgress = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading progress from storage:', e);
    }

    if (!rawProgress) {
      const demoEntry = Object.values(DEMO_USERS).find(d => d.user.id === userId);
      if (demoEntry) {
        rawProgress = demoEntry.progress;
      } else {
        rawProgress = {
          userId,
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
      }
    }

    const user = this.getCurrentUser();
    if (user && user.id === userId && user.journeyStartDate) {
      const synced = syncProgressWithJourneyDate(user, rawProgress);
      return synced;
    }

    return rawProgress;
  }

  static saveUser(user: User): void {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

    // Also update registered users list
    const users = this.getRegisteredUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    this.saveRegisteredUsers(users);
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

  static login(email: string, password?: string): { user: User; progress: UserProgressState } {
    const cleanEmail = email.toLowerCase().trim();
    const registered = this.getRegisteredUsers();

    // Check if user exists in registered users or DEMO_USERS
    const foundUser = registered.find(u => u.email.toLowerCase() === cleanEmail) ||
      Object.values(DEMO_USERS).map(d => d.user).find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      throw new Error('Email or password is incorrect.');
    }

    // Check password match (if provided, otherwise demo default)
    if (password) {
      const expectedPassword = foundUser.password || 'DemoPassword123';
      if (password !== expectedPassword) {
        throw new Error('Email or password is incorrect.');
      }
    }

    const progress = this.getProgress(foundUser.id);
    this.saveUser(foundUser);
    this.saveProgress(progress);

    return { user: foundUser, progress };
  }

  static signUp(
    name: string,
    email: string,
    password?: string,
    track: TrackType = 'frontend',
    level: ExperienceLevel = 'beginner',
    goal: string = 'Build consistency over 60 days',
    college?: string,
    graduationYear?: string
  ): { user: User; progress: UserProgressState } {
    const cleanEmail = email.toLowerCase().trim();
    if (!name.trim()) {
      throw new Error('Full Name is required.');
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      throw new Error('A valid Email address is required.');
    }
    if (password && password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const registered = this.getRegisteredUsers();
    if (registered.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists. Please Sign In.');
    }

    const newUser: User = {
      id: `usr_custom_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: password || 'DemoPassword123',
      track,
      experienceLevel: level,
      primaryGoal: goal,
      college: college?.trim(),
      graduationYear: graduationYear?.trim(),
      persona: 'new',
      onboardingCompleted: false, // Triggers Onboarding flow after signup
      journeyStartDate: getKolkataDateString(),
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

  static verifyAccountExists(email: string): User | null {
    const cleanEmail = email.toLowerCase().trim();
    const registered = this.getRegisteredUsers();
    const foundUser = registered.find(u => u.email.toLowerCase() === cleanEmail) ||
      Object.values(DEMO_USERS).map(d => d.user).find(u => u.email.toLowerCase() === cleanEmail);
    return foundUser || null;
  }

  static resetPassword(email: string, newPassword: string): void {
    const cleanEmail = email.toLowerCase().trim();
    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters.');
    }

    const registered = this.getRegisteredUsers();
    const idx = registered.findIndex(u => u.email.toLowerCase() === cleanEmail);

    if (idx >= 0) {
      registered[idx].password = newPassword;
      this.saveRegisteredUsers(registered);
    } else {
      const demoUser = Object.values(DEMO_USERS).map(d => d.user).find(u => u.email.toLowerCase() === cleanEmail);
      if (demoUser) {
        const updatedDemoUser = { ...demoUser, password: newPassword };
        registered.push(updatedDemoUser);
        this.saveRegisteredUsers(registered);
      } else {
        throw new Error('No account found with this email address. Please create an account first.');
      }
    }
  }

  static logout(): void {
    localStorage.removeItem(AUTH_USER_KEY);
  }
}
