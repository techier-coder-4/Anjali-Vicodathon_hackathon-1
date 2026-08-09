export type LabCategory =
  | 'browser'
  | 'api'
  | 'docker'
  | 'multi_container'
  | 'terminal'
  | 'investigation'
  | 'discovery'
  | 'scenario'
  | 'guided'
  | 'practice'
  | 'boss'
  | 'mini_ctf'
  | 'exam';

export type RealisticAppType =
  | 'corporate_portal'
  | 'bank_dashboard'
  | 'hospital_system'
  | 'learning_management'
  | 'ecommerce_platform'
  | 'forum'
  | 'cms'
  | 'travel_booking'
  | 'bug_tracker'
  | 'support_portal'
  | 'cloud_dashboard'
  | 'developer_portal'
  | 'git_repository'
  | 'file_storage'
  | 'analytics_dashboard'
  | 'hr_portal'
  | 'inventory_system'
  | 'student_portal'
  | 'iot_dashboard'
  | 'government_portal';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type LabLifecycleStatus =
  | 'draft'
  | 'local_test'
  | 'automated_validation'
  | 'peer_review'
  | 'published'
  | 'monitored'
  | 'versioned'
  | 'archived';

export interface LabFlag {
  id: string;
  title: string;
  flagValue: string;
  points: number;
  description: string;
  unlockedHint?: string;
  solved?: boolean;
}

export type HintType = 'observation' | 'reasoning' | 'method' | 'tool' | 'final';

export interface LabHint {
  id: string;
  type: HintType;
  title: string;
  content: string;
  costXP?: number;
}

export interface LabWriteup {
  investigation: string;
  discovery: string;
  reasoning: string;
  exploitation: string;
  codeSnippet?: string;
  alternativeSolution?: string;
  mitigation: string;
}

export interface ContainerSpec {
  name: string;
  image: string;
  port: number;
  status: 'running' | 'healthy' | 'restarting' | 'stopped';
  cpuUsage: number; // percentage e.g. 1.2
  memoryUsage: number; // MB e.g. 64
  healthCheckPassed: boolean;
  logs: string[];
}

export interface LabDockerConfig {
  containers: ContainerSpec[];
  networkName: string;
  healthChecks: {
    serviceName: string;
    endpoint: string;
    expectedStatus: number;
  }[];
  dependencies: string[];
  resetStrategy: 'fast_rollback' | 'reseed_db' | 'cold_reboot';
}

export interface LabValidation {
  applicationLoads: boolean;
  routesExist: boolean;
  databaseSeeded: boolean;
  authenticationWorks: boolean;
  sessionsWork: boolean;
  apiWorks: boolean;
  assetsLoad: boolean;
  flagsReachable: boolean;
  hintsAvailable: boolean;
  writeupsLinked: boolean;
  resetWorks: boolean;
  noRuntimeErrors: boolean;
  lastTestedAt?: string;
}

export interface LabAnalytics {
  completionsCount: number;
  avgTimeMinutes: number;
  resetCount: number;
  passRatePercentage: number;
  totalSubmissions: number;
}

export interface LabAssetFile {
  id: string;
  name: string;
  size: string;
  type: 'code' | 'pcap' | 'sql' | 'log' | 'doc' | 'image' | 'json';
  content: string;
  description: string;
}

export interface Lab {
  id: string;
  slug: string;
  title: string;
  category: LabCategory;
  appType: RealisticAppType;
  difficulty: DifficultyLevel;
  xp: number;
  estimatedMinutes: number;
  requiredSkills: string[];
  scenario: string;
  objectives: string[];
  status: LabLifecycleStatus;
  version: string;
  flags: LabFlag[];
  hints: LabHint[];
  writeup: LabWriteup;
  dockerConfig: LabDockerConfig;
  validation: LabValidation;
  analytics: LabAnalytics;
  assets: LabAssetFile[];
  authorName: string;
  updatedAt: string;
}

export interface ActiveLabInstance {
  labId: string;
  instanceId: string;
  startedAt: string;
  expiresAt?: string;
  status: 'initializing' | 'running' | 'resetting' | 'terminated';
  solvedFlagIds: string[];
  unlockedHintIds: string[];
  userNotes: string;
  terminalHistory: string[];
  containerStates: Record<string, 'running' | 'restarting' | 'stopped'>;
  apiLogs: { id: string; method: string; path: string; status: number; timestamp: string }[];
}

export interface LabQAResult {
  labId: string;
  labTitle: string;
  passed: boolean;
  timestamp: string;
  checks: {
    name: string;
    passed: boolean;
    durationMs: number;
    details?: string;
  }[];
}
