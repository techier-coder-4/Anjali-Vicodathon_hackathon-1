import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProgressState, StudentPersona, TrackType, ExperienceLevel, DayProgress, UnderstandingStatus, CheckpointData } from '../types';
import { AuthService } from '../services/auth';
import { ProgressService } from '../services/progressService';

interface AuthContextType {
  user: User | null;
  progress: UserProgressState;
  persona: StudentPersona;
  switchPersona: (persona: StudentPersona) => void;
  login: (email: string) => void;
  signUp: (name: string, email: string, track: TrackType, level: ExperienceLevel, goal: string) => void;
  updateUserOnboarding: (track: TrackType, level: ExperienceLevel, goal: string) => void;
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

  const switchPersona = (newPersona: StudentPersona) => {
    const { user: updatedUser, progress: updatedProgress } = AuthService.switchPersona(newPersona);
    setUser(updatedUser);
    setProgress(updatedProgress);
  };

  const login = (email: string) => {
    const { user: loggedInUser, progress: loggedInProg } = AuthService.login(email);
    setUser(loggedInUser);
    setProgress(loggedInProg);
  };

  const signUp = (name: string, email: string, track: TrackType, level: ExperienceLevel, goal: string) => {
    const { user: signedUpUser, progress: signedUpProg } = AuthService.signUp(name, email, track, level, goal);
    setUser(signedUpUser);
    setProgress(signedUpProg);
  };

  const updateUserOnboarding = (track: TrackType, level: ExperienceLevel, goal: string) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      track,
      experienceLevel: level,
      primaryGoal: goal,
      onboardingCompleted: true
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
