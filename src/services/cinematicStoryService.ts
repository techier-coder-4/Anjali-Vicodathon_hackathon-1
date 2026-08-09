import { LearningVideoScript, Challenge } from '../types';
import { generateFallbackVideoScript } from '../data/videoScripts';

/**
 * CinematicStoryService
 * 
 * Manages the generation, retrieval, and local caching of JSON story arcs
 * for challenge days using the Gemini API and grounded fallback narratives.
 */
class CinematicStoryService {
  private memoryCache: Map<string, LearningVideoScript> = new Map();
  private CACHE_PREFIX = 'cinematic_story_arc_v1_';

  /**
   * Generates a unique, deterministic cache key for a given challenge.
   */
  public getCacheKey(challenge: Challenge): string {
    const track = challenge.trackId || 'fullstack';
    const day = challenge.dayId || 1;
    const titleSlug = (challenge.title || 'challenge').toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `${this.CACHE_PREFIX}${track}_day${day}_${titleSlug}`;
  }

  /**
   * Retrieves a previously generated story arc from memory or localStorage.
   */
  public getCachedStory(challenge: Challenge): LearningVideoScript | null {
    const key = this.getCacheKey(challenge);

    // 1. In-memory cache check
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key)!;
    }

    // 2. localStorage check
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const cachedStr = localStorage.getItem(key);
        if (cachedStr) {
          const parsed = JSON.parse(cachedStr) as LearningVideoScript;
          if (parsed && parsed.sections && Array.isArray(parsed.sections) && parsed.sections.length > 0) {
            this.memoryCache.set(key, parsed);
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn('[CinematicStoryService] LocalStorage read failed:', err);
    }

    return null;
  }

  /**
   * Saves a story arc into memory and localStorage.
   */
  public setCachedStory(challenge: Challenge, script: LearningVideoScript): void {
    const key = this.getCacheKey(challenge);
    this.memoryCache.set(key, script);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, JSON.stringify(script));
      }
    } catch (err) {
      console.warn('[CinematicStoryService] LocalStorage write failed:', err);
    }
  }

  /**
   * Clears cached story arcs.
   */
  public clearCache(challenge?: Challenge): void {
    if (challenge) {
      const key = this.getCacheKey(challenge);
      this.memoryCache.delete(key);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem(key);
        }
      } catch (err) {}
    } else {
      this.memoryCache.clear();
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(this.CACHE_PREFIX)) {
              keysToRemove.push(k);
            }
          }
          keysToRemove.forEach(k => localStorage.removeItem(k));
        }
      } catch (err) {}
    }
  }

  /**
   * Main method to generate or retrieve a JSON story arc for a challenge.
   * Utilizes Gemini API on server, falling back gracefully to grounded narrative script.
   */
  public async generateStoryArc(challenge: Challenge, forceRefresh = false): Promise<LearningVideoScript> {
    // 1. Return cached story if available and not forced
    if (!forceRefresh) {
      const cached = this.getCachedStory(challenge);
      if (cached) {
        return cached;
      }
    }

    // 2. Call server-side Gemini API endpoint
    try {
      const response = await fetch('/api/gemini/video-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId: challenge.trackId,
          dayId: challenge.dayId,
          challengeTitle: challenge.title,
          learningObjective: challenge.learningObjective,
          whyItMatters: challenge.whyItMatters,
          requirements: challenge.requirements,
          curiosityPrompt: challenge.curiosityPrompt,
          description: challenge.description
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.script && data.script.sections && data.script.sections.length > 0) {
          const generatedScript: LearningVideoScript = data.script;
          this.setCachedStory(challenge, generatedScript);
          return generatedScript;
        }
      }
    } catch (err) {
      console.warn('[CinematicStoryService] Gemini story API call failed, using fallback:', err);
    }

    // 3. Fallback grounded narrative generation
    const fallbackScript = generateFallbackVideoScript(challenge);
    this.setCachedStory(challenge, fallbackScript);
    return fallbackScript;
  }

  /**
   * Preloads story arcs for upcoming challenges in the background.
   */
  public async preloadStoryArc(challenge: Challenge): Promise<void> {
    if (!this.getCachedStory(challenge)) {
      try {
        await this.generateStoryArc(challenge);
      } catch (err) {
        // Silent background preload ignore
      }
    }
  }
}

export const cinematicStoryService = new CinematicStoryService();
export default cinematicStoryService;
