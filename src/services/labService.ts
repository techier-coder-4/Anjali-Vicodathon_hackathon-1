import {
  Lab,
  ActiveLabInstance,
  LabFlag,
  LabQAResult,
  LabCategory,
  RealisticAppType,
  DifficultyLevel,
  LabLifecycleStatus
} from '../types/lab';
import { TrackType } from '../types';
import { LAB_CATALOG, getLabById } from '../data/labCatalog';

const LAB_INSTANCE_KEY_PREFIX = 'webforge_lab_instance_';
const CUSTOM_LABS_KEY = 'webforge_custom_labs_catalog';

export class LabService {
  static getLabs(filter?: {
    trackCategory?: TrackType;
    category?: LabCategory;
    appType?: RealisticAppType;
    difficulty?: DifficultyLevel;
    status?: LabLifecycleStatus;
    search?: string;
  }): Lab[] {
    const customLabs = this.getCustomLabs();
    const allLabs = [...LAB_CATALOG, ...customLabs];

    if (!filter) return allLabs;

    return allLabs.filter((lab) => {
      if (filter.trackCategory && lab.trackCategory !== filter.trackCategory) return false;
      if (filter.category && lab.category !== filter.category) return false;
      if (filter.appType && lab.appType !== filter.appType) return false;
      if (filter.difficulty && lab.difficulty !== filter.difficulty) return false;
      if (filter.status && lab.status !== filter.status) return false;
      if (filter.search && filter.search.trim()) {
        const query = filter.search.toLowerCase();
        const matchTitle = lab.title.toLowerCase().includes(query);
        const matchScenario = lab.scenario.toLowerCase().includes(query);
        const matchSkills = lab.requiredSkills.some((s) => s.toLowerCase().includes(query));
        if (!matchTitle && !matchScenario && !matchSkills) return false;
      }
      return true;
    });
  }

  static getLab(labId: string): Lab | undefined {
    const customLabs = this.getCustomLabs();
    return customLabs.find((l) => l.id === labId || l.slug === labId) || getLabById(labId);
  }

  static getActiveInstance(labId: string): ActiveLabInstance {
    const storageKey = `${LAB_INSTANCE_KEY_PREFIX}${labId}`;
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse active lab instance:', e);
      }
    }

    const newInstance: ActiveLabInstance = {
      labId,
      instanceId: `inst_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      startedAt: new Date().toISOString(),
      status: 'running',
      solvedFlagIds: [],
      unlockedHintIds: [],
      userNotes: '',
      terminalHistory: [
        'Welcome to WebForge Terminal Environment (Docker v24.0.5)',
        'Container shell initialized. Type "help" or "docker ps" for available commands.'
      ],
      containerStates: {},
      apiLogs: []
    };

    this.saveActiveInstance(newInstance);
    return newInstance;
  }

  static saveActiveInstance(instance: ActiveLabInstance): void {
    const storageKey = `${LAB_INSTANCE_KEY_PREFIX}${instance.labId}`;
    localStorage.setItem(storageKey, JSON.stringify(instance));
  }

  static resetInstance(labId: string): ActiveLabInstance {
    const freshInstance: ActiveLabInstance = {
      labId,
      instanceId: `inst_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      startedAt: new Date().toISOString(),
      status: 'running',
      solvedFlagIds: [],
      unlockedHintIds: [],
      userNotes: '',
      terminalHistory: [
        'System reset initiated.',
        'Database re-seeded with pristine default state.',
        'Docker containers restarted in clean isolated environment.'
      ],
      containerStates: {},
      apiLogs: []
    };
    this.saveActiveInstance(freshInstance);
    return freshInstance;
  }

  static completeLab(labId: string): { success: boolean; pointsAwarded: number } {
    const lab = this.getLab(labId);
    if (!lab) {
      return { success: false, pointsAwarded: 0 };
    }

    const instance = this.getActiveInstance(labId);
    let newlyAwarded = 0;

    lab.flags.forEach((f) => {
      if (!instance.solvedFlagIds.includes(f.id)) {
        instance.solvedFlagIds.push(f.id);
        newlyAwarded += f.points;
      }
    });

    this.saveActiveInstance(instance);
    return { success: true, pointsAwarded: newlyAwarded };
  }

  static validateFlag(
    labId: string,
    submittedFlag: string
  ): { success: boolean; flag?: LabFlag; message: string; pointsAwarded: number } {
    const lab = this.getLab(labId);
    if (!lab) {
      return { success: false, message: 'Lab not found.', pointsAwarded: 0 };
    }

    const trimmed = submittedFlag.trim();
    const matchedFlag = lab.flags.find((f) => f.flagValue === trimmed);

    if (!matchedFlag) {
      return { success: false, message: 'Invalid flag. Check your payload or output and try again.', pointsAwarded: 0 };
    }

    const instance = this.getActiveInstance(labId);
    if (instance.solvedFlagIds.includes(matchedFlag.id)) {
      return { success: true, flag: matchedFlag, message: 'Flag already solved and credited!', pointsAwarded: 0 };
    }

    instance.solvedFlagIds.push(matchedFlag.id);
    this.saveActiveInstance(instance);

    return {
      success: true,
      flag: matchedFlag,
      message: `Congratulations! Flag verified. +${matchedFlag.points} XP awarded.`,
      pointsAwarded: matchedFlag.points
    };
  }

  static unlockHint(labId: string, hintId: string): { success: boolean; instance: ActiveLabInstance } {
    const instance = this.getActiveInstance(labId);
    if (!instance.unlockedHintIds.includes(hintId)) {
      instance.unlockedHintIds.push(hintId);
      this.saveActiveInstance(instance);
    }
    return { success: true, instance };
  }

  static saveNotes(labId: string, notes: string): void {
    const instance = this.getActiveInstance(labId);
    instance.userNotes = notes;
    this.saveActiveInstance(instance);
  }

  static appendTerminalLog(labId: string, logLine: string): void {
    const instance = this.getActiveInstance(labId);
    instance.terminalHistory.push(logLine);
    if (instance.terminalHistory.length > 200) {
      instance.terminalHistory.shift();
    }
    this.saveActiveInstance(instance);
  }

  // Author Studio functions
  static getCustomLabs(): Lab[] {
    const raw = localStorage.getItem(CUSTOM_LABS_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse custom labs:', e);
      }
    }
    return [];
  }

  static saveCustomLab(lab: Lab): void {
    const customLabs = this.getCustomLabs();
    const index = customLabs.findIndex((l) => l.id === lab.id);
    if (index >= 0) {
      customLabs[index] = lab;
    } else {
      customLabs.push(lab);
    }
    localStorage.setItem(CUSTOM_LABS_KEY, JSON.stringify(customLabs));
  }

  static cloneLabTemplate(sourceLabId: string, newTitle: string): Lab {
    const source = this.getLab(sourceLabId);
    if (!source) {
      throw new Error('Source lab not found for cloning');
    }

    const newId = `lab-custom-${Date.now()}`;
    const newSlug = `${source.appType}-clone-${Math.random().toString(36).substring(2, 6)}`;

    const clonedLab: Lab = {
      ...JSON.parse(JSON.stringify(source)),
      id: newId,
      slug: newSlug,
      title: newTitle || `Cloned: ${source.title}`,
      status: 'draft',
      version: '1.0.0-draft',
      updatedAt: new Date().toISOString(),
      analytics: {
        completionsCount: 0,
        avgTimeMinutes: source.estimatedMinutes,
        resetCount: 0,
        passRatePercentage: 100,
        totalSubmissions: 0
      }
    };

    this.saveCustomLab(clonedLab);
    return clonedLab;
  }

  // Automated QA Engine
  static runQATestSuite(labId: string): LabQAResult {
    const lab = this.getLab(labId);
    const timestamp = new Date().toISOString();

    if (!lab) {
      return {
        labId,
        labTitle: 'Unknown Lab',
        passed: false,
        timestamp,
        checks: [{ name: 'Lab Existence Check', passed: false, durationMs: 2, details: 'Lab record missing from database' }]
      };
    }

    const checks = [
      { name: 'Application Load Check', passed: lab.validation.applicationLoads, durationMs: 12 },
      { name: 'Routes Existence Check', passed: lab.validation.routesExist, durationMs: 8 },
      { name: 'Database Seed Check', passed: lab.validation.databaseSeeded, durationMs: 15 },
      { name: 'Authentication System Check', passed: lab.validation.authenticationWorks, durationMs: 14 },
      { name: 'Sessions Integrity Check', passed: lab.validation.sessionsWork, durationMs: 10 },
      { name: 'API Endpoints Health Check', passed: lab.validation.apiWorks, durationMs: 18 },
      { name: 'Assets & Static Files Check', passed: lab.validation.assetsLoad, durationMs: 9 },
      { name: 'Flags Reachability Check', passed: lab.flags.length > 0 && lab.validation.flagsReachable, durationMs: 22 },
      { name: 'Progressive Hints Check', passed: lab.hints.length >= 3 && lab.validation.hintsAvailable, durationMs: 7 },
      { name: 'Writeup Integrity Check', passed: !!lab.writeup.exploitation && lab.validation.writeupsLinked, durationMs: 6 },
      { name: 'Reset Engine Check', passed: lab.validation.resetWorks, durationMs: 25 },
      { name: 'Zero Runtime Errors Check', passed: lab.validation.noRuntimeErrors, durationMs: 5 }
    ];

    const passed = checks.every((c) => c.passed);

    // Update validation timestamp in record if custom
    if (lab.id.startsWith('lab-custom-')) {
      lab.validation.lastTestedAt = timestamp;
      if (passed && lab.status === 'local_test') {
        lab.status = 'automated_validation';
      }
      this.saveCustomLab(lab);
    }

    return {
      labId: lab.id,
      labTitle: lab.title,
      passed,
      timestamp,
      checks
    };
  }
}
