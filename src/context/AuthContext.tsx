import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProgressState, StudentPersona, TrackType, ExperienceLevel, DayProgress, UnderstandingStatus, CheckpointData } from '../types';
import { AuthService } from '../services/auth';
import { ProgressService } from '../services/progressService';

interface AuthContextType {
  user: User | null;
  progress: UserProgressState;
  persona: StudentPersona;
  switchPersona: (persona: StudentPersona) => User;
  login: (email: string, password?: string) => User;
  signUp: (
    name: string,
    email: string,
    password?: string,
    track?: TrackType,
    level?: ExperienceLevel,
    goal?: string,
    college?: string,
    graduationYear?: string
  ) => User;
  updateUserOnboarding: (track: TrackType, level: ExperienceLevel, goal: string, college?: string, graduationYear?: string, timeGoal?: string) => void;
  updateUserProfile: (data: Partial<User>) => void;
  logout: () => void;
  toggleRequirement: (dayId: number, reqIndex: number) => void;
  submitProofOfWork: (dayId: number, repoUrl: string, linkedinUrl: string, checkpointData?: CheckpointData) => string[];
  updateUnderstandingStatus: (dayId: number, status: UnderstandingStatus) => void;
  getDayProgress: (dayId: number) => DayProgress;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultProgress: UserProgressState = {
  userId: '',
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => AuthService.getCurrentUser());
  const [progress, setProgress] = useState<UserProgressState>(() =>
    user ? AuthService.getProgress(user.id) : defaultProgress
  );

  const persona = user?.persona || 'new';

  useEffect(() => {
    if (user) {
      const p = AuthService.getProgress(user.id);
      setProgress(p);
    } else {
      setProgress(defaultProgress);
    }
  }, [user?.id]);

  const switchPersona = (newPersona: StudentPersona): User => {
    const { user: updatedUser, progress: updatedProgress } = AuthService.switchPersona(newPersona);
    setUser(updatedUser);
    setProgress(updatedProgress);
    return updatedUser;
  };

  const login = (email: string, password?: string): User => {
    const { user: loggedInUser, progress: loggedInProg } = AuthService.login(email, password);
    setUser(loggedInUser);
    setProgress(loggedInProg);
    return loggedInUser;
  };

  const signUp = (
    name: string,
    email: string,
    password?: string,
    track: TrackType = 'frontend',
    level: ExperienceLevel = 'beginner',
    goal: string = 'Build consistency over 60 days',
    college?: string,
    graduationYear?: string
  ): User => {
    const { user: signedUpUser, progress: signedUpProg } = AuthService.signUp(
      name,
      email,
      password,
      track,
      level,
      goal,
      college,
      graduationYear
    );
    setUser(signedUpUser);
    setProgress(signedUpProg);
    return signedUpUser;
  };

  const updateUserOnboarding = (
    track: TrackType,
    level: ExperienceLevel,
    goal: string,
    college?: string,
    graduationYear?: string,
    timeGoal?: string
  ) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      track,
      experienceLevel: level,
      primaryGoal: goal,
      college: college || user.college,
      graduationYear: graduationYear || user.graduationYear,
      dailyTimeGoal: timeGoal || user.dailyTimeGoal,
      onboardingCompleted: true
    };
    AuthService.saveUser(updatedUser);
    setUser(updatedUser);
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      ...data
    };
    AuthService.saveUser(updatedUser);
    setUser(updatedUser);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const toggleRequirement = (dayId: number, reqIndex: number) => {
    if (!progress) return;
    const updated = ProgressService.toggleRequirement(progress, dayId, reqIndex);
    setProgress(updated);
  };

  const submitProofOfWork = (
    dayId: number,
    repoUrl: string,
    linkedinUrl: string,
    checkpointData?: CheckpointData
  ): string[] => {
    if (!progress) return [];
    const { updatedProgress, newAchievements } = ProgressService.submitProofOfWork(
      progress,
      dayId,
      repoUrl,
      linkedinUrl,
      checkpointData
    );
    setProgress(updatedProgress);
    return newAchievements;
  };

  const updateUnderstandingStatus = (dayId: number, status: UnderstandingStatus) => {
    if (!progress) return;
    const updated = ProgressService.updateUnderstandingStatus(progress, dayId, status);
    setProgress(updated);
  };

  const getDayProgress = (dayId: number) => {
    return ProgressService.getDayProgress(progress, dayId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        progress,
        persona,
        switchPersona,
        login,
        signUp,
        updateUserOnboarding,
        updateUserProfile,
        logout,
        toggleRequirement,
        submitProofOfWork,
        updateUnderstandingStatus,
        getDayProgress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
