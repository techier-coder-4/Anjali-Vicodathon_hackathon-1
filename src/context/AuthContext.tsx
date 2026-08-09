import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProgressState, StudentPersona, TrackType, ExperienceLevel, DayProgress, UnderstandingStatus, CheckpointData, Journey, Challenge } from '../types';
import { AuthService } from '../services/auth';
import { ProgressService } from '../services/progressService';
import { JourneyService } from '../services/journeyService';
import { CreateChallengeInput } from '../services/customChallengeService';
import { getRoadmapForTrack } from '../data/curriculum';

interface AuthContextType {
  user: User | null;
  activeJourney: Journey | null;
  activeJourneyId: string;
  journeys: Journey[];
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
  switchActiveJourney: (journeyId: string) => void;
  createPersonalChallenge: (input: CreateChallengeInput) => Promise<{ journey: Journey; isFallback: boolean }>;
  deleteJourney: (journeyId: string) => void;
  archiveJourney: (journeyId: string) => void;
  toggleRequirement: (dayId: number, reqIndex: number) => void;
  submitProofOfWork: (dayId: number, repoUrl: string, linkedinUrl: string, checkpointData?: CheckpointData) => string[];
  saveReflection: (dayId: number, checkpointData: CheckpointData) => void;
  updateUnderstandingStatus: (dayId: number, status: UnderstandingStatus) => void;
  getDayProgress: (dayId: number) => DayProgress;
  getChallengeForDay: (dayId: number) => Challenge;
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

  // Journeys list
  const [journeys, setJourneys] = useState<Journey[]>(() =>
    user ? JourneyService.getJourneys(user.id, user.track) : []
  );

  // Active journey ID
  const [activeJourneyId, setActiveJourneyId] = useState<string>(() =>
    user ? JourneyService.getActiveJourneyId(user.id, user.track) : ''
  );

  // Isolated active journey progress
  const [progress, setProgress] = useState<UserProgressState>(() =>
    user && activeJourneyId ? JourneyService.getJourneyProgress(user.id, activeJourneyId, user.track) : defaultProgress
  );

  const persona = user?.persona || 'new';

  // Sync state when user changes or active journey changes
  useEffect(() => {
    if (user) {
      const userJourneys = JourneyService.getJourneys(user.id, user.track);
      setJourneys(userJourneys);

      let currentActiveId = activeJourneyId;
      if (!currentActiveId || !userJourneys.some(j => j.id === currentActiveId)) {
        currentActiveId = JourneyService.getActiveJourneyId(user.id, user.track);
        setActiveJourneyId(currentActiveId);
      }

      const activeProg = JourneyService.getJourneyProgress(user.id, currentActiveId, user.track);
      setProgress(activeProg);
    } else {
      setJourneys([]);
      setActiveJourneyId('');
      setProgress(defaultProgress);
    }
  }, [user?.id, activeJourneyId]);

  const activeJourney = journeys.find(j => j.id === activeJourneyId) || journeys[0] || null;

  const switchActiveJourney = (newJourneyId: string) => {
    if (!user || !newJourneyId) return;
    JourneyService.setActiveJourneyId(user.id, newJourneyId);
    setActiveJourneyId(newJourneyId);
    const newProg = JourneyService.getJourneyProgress(user.id, newJourneyId, user.track);
    setProgress(newProg);
  };

  const createPersonalChallenge = async (input: CreateChallengeInput) => {
    if (!user) throw new Error('User not authenticated');
    const { journey, isFallback } = await JourneyService.createPersonalJourney(user.id, input);

    // Refresh journeys and set active
    const updatedJourneys = JourneyService.getJourneys(user.id, user.track);
    setJourneys(updatedJourneys);
    setActiveJourneyId(journey.id);

    const freshProg = JourneyService.getJourneyProgress(user.id, journey.id, user.track);
    setProgress(freshProg);

    return { journey, isFallback };
  };

  const deleteJourney = (journeyIdToDelete: string) => {
    if (!user) return;
    const nextActiveId = JourneyService.deleteJourney(user.id, journeyIdToDelete);
    const updatedJourneys = JourneyService.getJourneys(user.id, user.track);
    setJourneys(updatedJourneys);
    setActiveJourneyId(nextActiveId);
    const newProg = JourneyService.getJourneyProgress(user.id, nextActiveId, user.track);
    setProgress(newProg);
  };

  const archiveJourney = (journeyIdToArchive: string) => {
    if (!user) return;
    const nextActiveId = JourneyService.archiveJourney(user.id, journeyIdToArchive);
    const updatedJourneys = JourneyService.getJourneys(user.id, user.track);
    setJourneys(updatedJourneys);
    setActiveJourneyId(nextActiveId);
    const newProg = JourneyService.getJourneyProgress(user.id, nextActiveId, user.track);
    setProgress(newProg);
  };

  const switchPersona = (newPersona: StudentPersona): User => {
    const { user: updatedUser } = AuthService.switchPersona(newPersona);
    setUser(updatedUser);

    const userJourneys = JourneyService.getJourneys(updatedUser.id, updatedUser.track);
    setJourneys(userJourneys);
    const firstActiveId = userJourneys[0]?.id || `track_${updatedUser.track}`;
    JourneyService.setActiveJourneyId(updatedUser.id, firstActiveId);
    setActiveJourneyId(firstActiveId);

    const activeProg = JourneyService.getJourneyProgress(updatedUser.id, firstActiveId, updatedUser.track);
    setProgress(activeProg);

    return updatedUser;
  };

  const login = (email: string, password?: string): User => {
    const { user: loggedInUser } = AuthService.login(email, password);
    setUser(loggedInUser);

    const userJourneys = JourneyService.getJourneys(loggedInUser.id, loggedInUser.track);
    setJourneys(userJourneys);
    const activeId = JourneyService.getActiveJourneyId(loggedInUser.id, loggedInUser.track);
    setActiveJourneyId(activeId);

    const activeProg = JourneyService.getJourneyProgress(loggedInUser.id, activeId, loggedInUser.track);
    setProgress(activeProg);

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
    const { user: signedUpUser } = AuthService.signUp(
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

    const userJourneys = JourneyService.getJourneys(signedUpUser.id, signedUpUser.track);
    setJourneys(userJourneys);
    const activeId = userJourneys[0]?.id || `track_${signedUpUser.track}`;
    JourneyService.setActiveJourneyId(signedUpUser.id, activeId);
    setActiveJourneyId(activeId);

    const activeProg = JourneyService.getJourneyProgress(signedUpUser.id, activeId, signedUpUser.track);
    setProgress(activeProg);

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

    // Refresh default track journey if track updated
    const userJourneys = JourneyService.getJourneys(updatedUser.id, track);
    setJourneys(userJourneys);
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
    setJourneys([]);
    setActiveJourneyId('');
    setProgress(defaultProgress);
  };

  const toggleRequirement = (dayId: number, reqIndex: number) => {
    if (!user || !activeJourneyId) return;
    const updated = JourneyService.toggleRequirement(user.id, activeJourneyId, dayId, reqIndex);
    setProgress(updated);
  };

  const submitProofOfWork = (
    dayId: number,
    repoUrl: string,
    linkedinUrl: string,
    checkpointData?: CheckpointData
  ): string[] => {
    if (!user || !activeJourneyId) return [];
    const { updatedProgress, newAchievements } = JourneyService.submitProofOfWork(
      user.id,
      activeJourneyId,
      dayId,
      repoUrl,
      linkedinUrl,
      checkpointData
    );
    setProgress(updatedProgress);
    return newAchievements;
  };

  const saveReflection = (dayId: number, checkpointData: CheckpointData) => {
    if (!user || !activeJourneyId) return;
    const updated = JourneyService.saveReflection(user.id, activeJourneyId, dayId, checkpointData);
    setProgress(updated);
  };

  const updateUnderstandingStatus = (dayId: number, status: UnderstandingStatus) => {
    if (!user || !activeJourneyId) return;
    const updated = JourneyService.updateUnderstandingStatus(user.id, activeJourneyId, dayId, status);
    setProgress(updated);
  };

  const getDayProgress = (dayId: number) => {
    return ProgressService.getDayProgress(progress, dayId);
  };

  const getChallengeForDay = (dayId: number): Challenge => {
    if (activeJourney && activeJourney.roadmap && activeJourney.roadmap.length > 0) {
      const match = activeJourney.roadmap.find(c => c.dayId === dayId);
      if (match) return match;
    }
    const defaultRoadmap = getRoadmapForTrack(user?.track || 'fullstack');
    return defaultRoadmap.find(c => c.dayId === dayId) || defaultRoadmap[0];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeJourney,
        activeJourneyId,
        journeys,
        progress,
        persona,
        switchPersona,
        login,
        signUp,
        updateUserOnboarding,
        updateUserProfile,
        logout,
        switchActiveJourney,
        createPersonalChallenge,
        deleteJourney,
        archiveJourney,
        toggleRequirement,
        submitProofOfWork,
        saveReflection,
        updateUnderstandingStatus,
        getDayProgress,
        getChallengeForDay
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

