import { CustomChallenge, CustomChallengeRoadmapDay, Challenge, ExperienceLevel, TrackType } from '../types';
import { getRoadmapForTrack } from '../data/curriculum';

export interface CreateChallengeInput {
  goalTitle: string;
  category: string;
  experienceLevel: ExperienceLevel;
  dailyTimeGoal: string;
  finalOutcome: string;
}

export class CustomChallengeService {
  private static getStorageKey(userId: string): string {
    return `abtalks_custom_challenge_${userId}`;
  }

  static getCustomChallenge(userId: string): CustomChallenge | null {
    if (!userId) return null;
    try {
      const data = localStorage.getItem(this.getStorageKey(userId));
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static saveCustomChallenge(challenge: CustomChallenge): void {
    if (!challenge || !challenge.userId) return;
    try {
      localStorage.setItem(this.getStorageKey(challenge.userId), JSON.stringify(challenge));
    } catch (e) {
      console.error('Failed to save custom challenge:', e);
    }
  }

  static deleteCustomChallenge(userId: string): void {
    if (!userId) return;
    try {
      localStorage.removeItem(this.getStorageKey(userId));
    } catch (e) {
      console.error('Failed to delete custom challenge:', e);
    }
  }

  static async createCustomChallenge(
    userId: string,
    input: CreateChallengeInput
  ): Promise<{ challenge: CustomChallenge; isFallback: boolean }> {
    let roadmapDays: CustomChallengeRoadmapDay[] = [];
    let isFallback = false;

    // Try calling backend AI API
    try {
      const response = await fetch('/api/gemini/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalTitle: input.goalTitle,
          category: input.category,
          experienceLevel: input.experienceLevel,
          dailyTimeGoal: input.dailyTimeGoal,
          finalOutcome: input.finalOutcome
        })
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && Array.isArray(json.roadmap) && json.roadmap.length > 0) {
          roadmapDays = json.roadmap.map((day: any, idx: number) => ({
            dayId: idx + 1,
            title: day.title || `Day ${idx + 1}: ${input.goalTitle}`,
            whyItMatters: day.whyItMatters || 'Building solid core engineering mechanics and habits.',
            whatToLearn: day.whatToLearn || 'Core concepts, patterns, and principles.',
            whatToBuild: day.whatToBuild || 'Implement a minimal working prototype.',
            expectedOutcome: day.expectedOutcome || 'Clear understanding and verified working output.',
            estimatedMinutes: day.estimatedMinutes || (input.dailyTimeGoal.includes('20') ? 20 : input.dailyTimeGoal.includes('60') ? 60 : 30),
            curiosityPrompt: day.curiosityPrompt || 'How does this concept connect to real production systems?',
            skills: Array.isArray(day.skills) ? day.skills : [input.category || 'Engineering']
          }));
        } else {
          isFallback = true;
        }
      } else {
        isFallback = true;
      }
    } catch (e) {
      console.warn('AI generation unreachable. Falling back to starter template:', e);
      isFallback = true;
    }

    // Fallback template generator if AI was unavailable or failed
    if (isFallback || roadmapDays.length === 0) {
      roadmapDays = this.generateFallbackRoadmap(input);
    }

    const newChallenge: CustomChallenge = {
      id: `custom_${Date.now()}`,
      userId,
      goalTitle: input.goalTitle || input.category || 'My 60-Day Technical Mastery',
      category: input.category,
      experienceLevel: input.experienceLevel,
      dailyTimeGoal: input.dailyTimeGoal,
      finalOutcome: input.finalOutcome,
      roadmap: roadmapDays,
      createdAt: new Date().toISOString(),
      activeDay: 1
    };

    this.saveCustomChallenge(newChallenge);
    return { challenge: newChallenge, isFallback };
  }

  // Fallback 60-day roadmap generator using curated curriculum adaptation
  private static generateFallbackRoadmap(input: CreateChallengeInput): CustomChallengeRoadmapDay[] {
    const trackCategoryMap: Record<string, TrackType> = {
      'Frontend': 'frontend',
      'Backend': 'backend',
      'Full Stack': 'fullstack',
      'Python': 'python',
      'Data & AI': 'data-ai',
      'Java': 'java',
      'Cybersecurity': 'cybersecurity'
    };

    const trackKey = trackCategoryMap[input.category] || 'fullstack';
    const baseRoadmap = getRoadmapForTrack(trackKey);

    return baseRoadmap.map((ch) => ({
      dayId: ch.dayId,
      title: `${ch.title}`,
      whyItMatters: ch.whyItMatters || `Essential step towards achieving your goal: "${input.goalTitle}".`,
      whatToLearn: ch.description || ch.learningObjective,
      whatToBuild: ch.requirements ? ch.requirements.join(' • ') : 'Complete today\'s practical assignment and test your output.',
      expectedOutcome: `Successfully build and verify Day ${ch.dayId} deliverable for ${input.goalTitle}.`,
      estimatedMinutes: ch.estimatedMinutes || 30,
      curiosityPrompt: ch.curiosityPrompt || 'How would you explain this concept to another beginner?',
      skills: ch.skills || [input.category]
    }));
  }

  // Convert a custom roadmap day to standard Challenge interface for DailyChallengeView & AIMentor
  static convertToChallenge(customDay: CustomChallengeRoadmapDay, category: string): Challenge {
    const stageName = customDay.dayId <= 10
      ? 'Stage 1 — Discover'
      : customDay.dayId <= 25
      ? 'Stage 2 — Build'
      : customDay.dayId <= 35
      ? 'Stage 3 — Experiment'
      : customDay.dayId <= 45
      ? 'Stage 4 — Real-World Problems'
      : customDay.dayId <= 55
      ? 'Stage 5 — Build Your Own'
      : 'Stage 6 — Showcase';

    const stageKey = customDay.dayId <= 10
      ? 'discover'
      : customDay.dayId <= 25
      ? 'build'
      : customDay.dayId <= 35
      ? 'experiment'
      : customDay.dayId <= 45
      ? 'real-world'
      : customDay.dayId <= 55
      ? 'build-your-own'
      : 'showcase';

    const reqs = customDay.whatToBuild.split(' • ').map(s => s.trim()).filter(Boolean);

    return {
      dayId: customDay.dayId,
      trackId: 'fullstack',
      title: customDay.title,
      description: customDay.whatToLearn,
      requirements: reqs.length > 0 ? reqs : [
        `Understand the core concept: ${customDay.whatToLearn}`,
        `Build the practical exercise: ${customDay.title}`,
        `Verify output matches expected outcome: ${customDay.expectedOutcome}`
      ],
      learningObjective: customDay.whatToLearn,
      whyItMatters: customDay.whyItMatters,
      challengeType: 'build',
      difficulty: 'intermediate',
      estimatedMinutes: customDay.estimatedMinutes,
      curiosityPrompt: customDay.curiosityPrompt || 'What did you find most interesting or challenging today?',
      skills: customDay.skills,
      tools: [category || 'VS Code', 'Git', 'Terminal'],
      stage: stageKey,
      stageName
    };
  }
}
