import { Lab } from '../types/lab';

export const LAB_CATALOG: Lab[] = [
  // ==========================================
  // FRONTEND DEVELOPMENT LABS
  // ==========================================
  {
    id: 'lab-fe-flexbox-01',
    slug: 'css-flexbox-responsive-grid',
    title: 'CSS Flexbox & Responsive Layout Grid Lab',
    trackCategory: 'frontend',
    category: 'practice',
    labFormat: 'playground',
    appType: 'code_playground',
    difficulty: 'beginner',
    xp: 150,
    estimatedMinutes: 20,
    requiredSkills: ['CSS Flexbox', 'Responsive Design', 'Grid Layouts', 'CSS Alignment'],
    scenario:
      'Your team\'s student dashboard works perfectly on laptops. But students accessing it from their phones are seeing the course cards pushed outside the screen. Your job is to fix the responsive layout without breaking the desktop version.',
    whyItMatters:
      'Most users now access websites from phones. If your layout only works on a laptop, real users may not be able to use your product. Responsive layouts help the same website work across phones, tablets, and computers.',
    whatYouWillLearn: [
      'Flexbox Basics & Layout Direction',
      'Preventing Screen Overflow',
      'Mobile-First Responsive Design'
    ],
    objectives: [
      'Cards fit inside a 390px mobile screen without horizontal scrolling',
      'Cards stack vertically on mobile and stretch to fit the viewport width',
      'Tablet layout (768px) and Desktop layout (1200px) remain functional'
    ],
    relatedChallengeDays: [2, 8, 15],
    status: 'published',
    version: '1.2.0',
    authorName: 'ABTalks Frontend Lead',
    updatedAt: '2026-08-08T10:00:00Z',
    flags: [
      {
        id: 'flag-fe-1',
        title: 'Verify Responsive Layout Solution',
        flagValue: 'WEBFORGE{frontend_flexbox_responsive_grid_mastered_102}',
        points: 150,
        description: 'Verify solution requirements on 390px mobile viewport.'
      }
    ],
    hints: [
      {
        id: 'hint-fe-1',
        type: 'observation',
        title: 'Hint 1: Space Constraints',
        content: 'Think about what should happen when there isn\'t enough horizontal space on a 390px phone screen.',
        costXP: 0
      },
      {
        id: 'hint-fe-2',
        type: 'reasoning',
        title: 'Hint 2: Line Wrapping',
        content: 'Should the cards remain forced on a single horizontal line when screen space runs out?',
        costXP: 0
      },
      {
        id: 'hint-fe-3',
        type: 'method',
        title: 'Hint 3: CSS Flexbox Properties',
        content: 'Look at flex-direction (controls horizontal vs vertical layout) and flex-wrap (controls whether items move onto another line). Setting flex-direction: column and flex-wrap: wrap fixes the mobile overflow.',
        costXP: 0
      }
    ],
    writeup: {
      investigation: 'Inspected DOM elements on 390px viewport and identified horizontal scrollbar caused by fixed width child cards.',
      discovery: 'The navbar container used `flex-direction: row` without media queries or wrap settings.',
      reasoning: 'Using media queries with fluid gap spacing allows items to stack cleanly on narrow devices.',
      exploitation: 'Updated container classes to `flex flex-col sm:flex-row items-center justify-between gap-4`.',
      codeSnippet: '.nav-container { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; }',
      mitigation: 'Always test layouts down to 360px and use relative units (rem/em/%).'
    },
    dockerConfig: {
      containers: [
        {
          name: 'frontend-sandbox',
          image: 'webforge/fe-sandbox:v1.2',
          port: 3001,
          status: 'healthy',
          cpuUsage: 0.5,
          memoryUsage: 30,
          healthCheckPassed: true,
          logs: ['[INFO] Flexbox CSS layout engine initialized']
        }
      ],
      networkName: 'fe-net',
      healthChecks: [{ serviceName: 'frontend-sandbox', endpoint: '/health', expectedStatus: 200 }],
      dependencies: ['vite', 'tailwindcss'],
      resetStrategy: 'fast_rollback'
    },
    validation: {
      applicationLoads: true,
      routesExist: true,
      databaseSeeded: true,
      authenticationWorks: true,
      sessionsWork: true,
      apiWorks: true,
      assetsLoad: true,
      flagsReachable: true,
      hintsAvailable: true,
      writeupsLinked: true,
      resetWorks: true,
      noRuntimeErrors: true
    },
    analytics: {
      completionsCount: 890,
      avgTimeMinutes: 14,
      resetCount: 10,
      passRatePercentage: 96.5,
      totalSubmissions: 920
    },
    assets: []
  },
  {
    id: 'lab-fe-responsive-02',
    slug: 'mobile-breakpoints-navigation-debugger',
    title: 'Mobile Breakpoints & Navigation Menu Debugger Lab',
    trackCategory: 'frontend',
    category: 'guided',
    labFormat: 'debugging',
    appType: 'code_playground',
    difficulty: 'intermediate',
    xp: 200,
    estimatedMinutes: 25,
    requiredSkills: ['Mobile-First Design', 'Media Queries', 'DOM State Management', 'Touch Target Sizing'],
    scenario:
      'Students on mobile phones report that clicking the navigation menu drawer cuts off active buttons and touch targets are smaller than 44px.',
    objectives: [
      'Inspect mobile viewports at 390px and 430px',
      'Increase touch button targets to a minimum of 44px x 44px',
      'Implement smooth backdrop overlay dismiss state for slide-over drawer',
      'Pass mobile UX layout validation checks'
    ],
    relatedChallengeDays: [4, 15, 22],
    status: 'published',
    version: '1.1.0',
    authorName: 'UI/UX Mobile Lead',
    updatedAt: '2026-08-07T12:00:00Z',
    flags: [
      {
        id: 'flag-fe-2',
        title: 'Submit Mobile Menu Verification Flag',
        flagValue: 'WEBFORGE{frontend_mobile_breakpoint_nav_repaired_304}',
        points: 200,
        description: 'Submit the flag unlocked after fixing touch target sizes and mobile drawer transition state.'
      }
    ],
    hints: [
      {
        id: 'hint-fe-2-1',
        type: 'observation',
        title: 'Touch Target Guideline',
        content: 'Apple Human Interface Guidelines and WCAG AA require touch targets to be at least 44x44 CSS pixels.',
        costXP: 0
      },
      {
        id: 'hint-fe-2-2',
        type: 'method',
        title: 'Tailwind Target Padding',
        content: 'Add `min-h-[44px] min-w-[44px] py-3 px-4` to menu button links.',
        costXP: 10
      }
    ],
    writeup: {
      investigation: 'Tested touch interactions on mobile simulation. Menu buttons were only 28px tall, causing missed taps.',
      discovery: 'Buttons lacked padding and drawer container had overflow hidden cutoffs.',
      reasoning: 'Mobile-first padding ensures reliable single-tap accuracy.',
      exploitation: 'Updated drawer padding and set touch height constraints.',
      codeSnippet: '<button className="min-h-[44px] px-4 py-3 text-sm font-bold flex items-center gap-2">Menu Item</button>',
      mitigation: 'Enforce mobile touch minimums in design system guidelines.'
    },
    dockerConfig: {
      containers: [
        {
          name: 'mobile-nav-sandbox',
          image: 'webforge/mobile-nav:v1.1',
          port: 3002,
          status: 'healthy',
          cpuUsage: 0.4,
          memoryUsage: 28,
          healthCheckPassed: true,
          logs: ['[INFO] Mobile menu simulator online']
        }
      ],
      networkName: 'fe-net',
      healthChecks: [{ serviceName: 'mobile-nav-sandbox', endpoint: '/health', expectedStatus: 200 }],
      dependencies: ['react', 'lucide-react'],
      resetStrategy: 'fast_rollback'
    },
    validation: {
      applicationLoads: true,
      routesExist: true,
      databaseSeeded: true,
      authenticationWorks: true,
      sessionsWork: true,
      apiWorks: true,
      assetsLoad: true,
      flagsReachable: true,
      hintsAvailable: true,
      writeupsLinked: true,
      resetWorks: true,
      noRuntimeErrors: true
    },
    analytics: {
      completionsCount: 650,
      avgTimeMinutes: 18,
      resetCount: 8,
      passRatePercentage: 94.0,
      totalSubmissions: 680
    },
    assets: []
  },
  {
    id: 'lab-fe-react-state-03',
    slug: 'react-state-custom-hook-debugger',
    title: 'React State & Custom Hook Race Condition Lab',
    trackCategory: 'frontend',
    category: 'scenario',
    labFormat: 'editor',
    appType: 'code_playground',
    difficulty: 'advanced',
    xp: 250,
    estimatedMinutes: 30,
    requiredSkills: ['React Hooks', 'useEffect Lifecycle', 'Closure State', 'AbortController'],
    scenario:
      'A custom `useFetch` hook suffers from stale state closures and memory leaks when rapid search queries are typed in quick succession.',
    objectives: [
      'Identify race condition when typing fast in student search input',
      'Implement `AbortController` cleanup function in `useEffect` hook',
      'Prevent state mutation on unmounted component state updates',
      'Submit verified React hook flag'
    ],
    relatedChallengeDays: [10, 22, 35],
    status: 'published',
    version: '1.0.0',
    authorName: 'React Architect Lead',
    updatedAt: '2026-08-06T14:00:00Z',
    flags: [
      {
        id: 'flag-fe-3',
        title: 'Submit React Closure Race Condition Flag',
        flagValue: 'WEBFORGE{react_state_closure_race_condition_fixed_502}',
        points: 250,
        description: 'Submit the flag awarded upon implementing AbortController cleanup in the custom hook.'
      }
    ],
    hints: [
      {
        id: 'hint-fe-3-1',
        type: 'observation',
        title: 'Network Out-of-Order Responses',
        content: 'When Query 1 resolves after Query 2, Query 1 overwrites the newer search result.',
        costXP: 0
      },
      {
        id: 'hint-fe-3-2',
        type: 'method',
        title: 'AbortController Pattern',
        content: 'Return `() => controller.abort()` inside your `useEffect` callback.',
        costXP: 10
      }
    ],
    writeup: {
      investigation: 'Monitored state updates during rapid keystrokes in search input.',
      discovery: 'Previous asynchronous fetch requests resolved out of order and updated component state with stale responses.',
      reasoning: 'Using an AbortController cancels pending HTTP requests when dependencies change.',
      exploitation: 'Added AbortController instance and passed signal to fetch options.',
      codeSnippet: 'useEffect(() => {\n  const controller = new AbortController();\n  fetch(url, { signal: controller.signal }).then(...);\n  return () => controller.abort();\n}, [url]);',
      mitigation: 'Always cancel asynchronous side effects on hook unmount or dependency change.'
    },
    dockerConfig: {
      containers: [
        {
          name: 'react-hooks-sandbox',
          image: 'webforge/react-hooks:v1.0',
          port: 3003,
          status: 'healthy',
          cpuUsage: 0.6,
          memoryUsage: 35,
          healthCheckPassed: true,
          logs: ['[INFO] React custom hook test suite initialized']
        }
      ],
      networkName: 'fe-net',
      healthChecks: [{ serviceName: 'react-hooks-sandbox', endpoint: '/health', expectedStatus: 200 }],
      dependencies: ['react', 'typescript'],
      resetStrategy: 'fast_rollback'
    },
    validation: {
      applicationLoads: true,
      routesExist: true,
      databaseSeeded: true,
      authenticationWorks: true,
      sessionsWork: true,
      apiWorks: true,
      assetsLoad: true,
      flagsReachable: true,
      hintsAvailable: true,
      writeupsLinked: true,
      resetWorks: true,
      noRuntimeErrors: true
    },
    analytics: {
      completionsCount: 510,
      avgTimeMinutes: 22,
      resetCount: 14,
      passRatePercentage: 91.2,
      totalSubmissions: 550
    },
    assets: []
  },

  // ==========================================
  // BACKEND DEVELOPMENT LABS
  // ==========================================
  {
    id: 'lab-be-http-rest-01',
    slug: 'rest-api-inspector-custom-headers',
    title: 'REST API Inspector & Custom Headers Lab',
    trackCategory: 'backend',
    category: 'api',
    labFormat: 'playground',
    appType: 'code_playground',
    difficulty: 'beginner',
    xp: 150,
    estimatedMinutes: 20,
    requiredSkills: ['HTTP Verbs', 'REST Endpoints', 'Request Headers', 'JSON Payload Analysis'],
    scenario:
      'The ABTalks Microservice Backend requires clients to include a valid API authorization header and client identifier to query student progress records.',
    objectives: [
      'Inspect HTTP request methods (GET, POST, PUT, DELETE)',
      'Set `X-Student-Track: backend` and `X-Api-Key: abtalks_secret_2026` in API tester header',
      'Parse JSON response payload for verification token',
      'Submit HTTP REST inspection flag'
    ],
    relatedChallengeDays: [11, 14, 18],
    status: 'published',
    version: '1.0.0',
    authorName: 'Backend Core Team',
    updatedAt: '2026-08-05T11:00:00Z',
    flags: [
      {
        id: 'flag-be-1',
        title: 'Submit REST API Verification Flag',
        flagValue: 'WEBFORGE{backend_rest_headers_inspected_701}',
        points: 150,
        description: 'Submit the flag returned in the JSON response body after supplying custom headers.'
      }
    ],
    hints: [
      {
        id: 'hint-be-1-1',
        type: 'observation',
        title: 'Check 401 Unauthorized Response',
        content: 'When making requests without `X-Api-Key`, the server returns 401 Unauthorized with error message details.',
        costXP: 0
      },
      {
        id: 'hint-be-1-2',
        type: 'method',
        title: 'Header Value',
        content: 'Add `X-Api-Key: abtalks_secret_2026` to the header input field in the API inspector.',
        costXP: 10
      }
    ],
    writeup: {
      investigation: 'Sent GET request to `/api/v1/student/progress` without custom headers.',
      discovery: 'Backend inspects `req.headers["x-api-key"]` before executing database queries.',
      reasoning: 'API keys passed via HTTP headers validate client application origin.',
      exploitation: 'Configured request headers and executed GET `/api/v1/student/progress`.',
      codeSnippet: 'curl -H "X-Api-Key: abtalks_secret_2026" -H "X-Student-Track: backend" https://api.abtalks.internal/v1/student/progress',
      mitigation: 'Use bearer token JWT authorization for user-scoped endpoints.'
    },
    dockerConfig: {
      containers: [
        {
          name: 'backend-rest-api',
          image: 'webforge/rest-api:v1.0',
          port: 3004,
          status: 'healthy',
          cpuUsage: 0.5,
          memoryUsage: 32,
          healthCheckPassed: true,
          logs: ['[INFO] Express REST API server running on port 3004']
        }
      ],
      networkName: 'be-net',
      healthChecks: [{ serviceName: 'backend-rest-api', endpoint: '/health', expectedStatus: 200 }],
      dependencies: ['express', 'cors'],
      resetStrategy: 'fast_rollback'
    },
    validation: {
      applicationLoads: true,
      routesExist: true,
      databaseSeeded: true,
      authenticationWorks: true,
      sessionsWork: true,
      apiWorks: true,
      assetsLoad: true,
      flagsReachable: true,
      hintsAvailable: true,
      writeupsLinked: true,
      resetWorks: true,
      noRuntimeErrors: true
    },
    analytics: {
      completionsCount: 920,
      avgTimeMinutes: 12,
      resetCount: 6,
      passRatePercentage: 97.2,
      totalSubmissions: 940
    },
    assets: []
  },
  {
    id: 'lab-be-express-middleware-02',
    slug: 'express-middleware-rate-limiting-pipeline',
    title: 'Express Middleware & Rate Limiting Pipeline Lab',
    trackCategory: 'backend',
    category: 'guided',
    labFormat: 'builder',
    appType: 'interactive_builder',
    difficulty: 'intermediate',
    xp: 220,
    estimatedMinutes: 25,
    requiredSkills: ['Node.js Express', 'Middleware Execution Chain', 'IP Rate Limiting', 'HTTP 429 Error Handling'],
    scenario:
      'The login service is vulnerable to automated credential stuffing attacks because it lacks rate limiting middleware.',
    objectives: [
      'Build a custom Express middleware function receiving `(req, res, next)`',
      'Track request count per client IP address inside an in-memory sliding window map',
      'Return `HTTP 429 Too Many Requests` when requests exceed 10 per minute',
      'Pass automated load test suite'
    ],
    relatedChallengeDays: [16, 20, 28],
    status: 'published',
    version: '1.2.0',
    authorName: 'Backend Security Architect',
    updatedAt: '2026-08-06T16:00:00Z',
    flags: [
      {
        id: 'flag-be-2',
        title: 'Submit Express Rate Limiter Flag',
        flagValue: 'WEBFORGE{express_middleware_rate_limiter_active_904}',
        points: 220,
        description: 'Submit the flag unlocked after successfully implementing IP rate limiting middleware.'
      }
    ],
    hints: [
      {
        id: 'hint-be-2-1',
        type: 'observation',
        title: 'Middleware Next Function',
        content: 'Remember to call `next()` when the request count is below the threshold, otherwise the request will hang indefinitely.',
        costXP: 0
      },
      {
        id: 'hint-be-2-2',
        type: 'method',
        title: 'Rate Limit Logic',
        content: 'If `ipHits[ip] > 10`, return `res.status(429).json({ error: "Rate limit exceeded" })`.',
        costXP: 10
      }
    ],
    writeup: {
      investigation: 'Ran load test script firing 50 consecutive POST requests to `/api/login`. All 50 were processed without throttling.',
      discovery: 'Express app defined routes directly without mounting rate limiting middleware.',
      reasoning: 'Middleware functions execute sequentially before route handlers.',
      exploitation: 'Mounted sliding window rate limiting middleware before route definitions.',
      codeSnippet: 'const rateLimiter = (req, res, next) => {\n  const ip = req.ip;\n  hits[ip] = (hits[ip] || 0) + 1;\n  if (hits[ip] > 10) return res.status(429).json({ error: "Rate limit exceeded" });\n  next();\n};',
      mitigation: 'Use redis-backed rate limiters for distributed multi-instance backends.'
    },
    dockerConfig: {
      containers: [
        {
          name: 'express-limiter-service',
          image: 'webforge/express-limiter:v1.2',
          port: 3005,
          status: 'healthy',
          cpuUsage: 0.8,
          memoryUsage: 40,
          healthCheckPassed: true,
          logs: ['[INFO] Express middleware rate limiter service online']
        }
      ],
      networkName: 'be-net',
      healthChecks: [{ serviceName: 'express-limiter-service', endpoint: '/health', expectedStatus: 200 }],
      dependencies: ['express', 'express-rate-limit'],
      resetStrategy: 'fast_rollback'
    },
    validation: {
      applicationLoads: true,
      routesExist: true,
      databaseSeeded: true,
      authenticationWorks: true,
      sessionsWork: true,
      apiWorks: true,
      assetsLoad: true,
      flagsReachable: true,
      hintsAvailable: true,
      writeupsLinked: true,
      resetWorks: true,
      noRuntimeErrors: true
    },
    analytics: {
      completionsCount: 710,
      avgTimeMinutes: 20,
      resetCount: 9,
      passRatePercentage: 93.5,
      totalSubmissions: 745
    },
    assets: []
  },

  // ==========================================
  // FULL STACK DEVELOPMENT LABS
  // ==========================================
  {
    id: 'lab-fs-todo-api-01',
    slug: 'fullstack-api-optimistic-ui-integration',
    title: 'Full Stack API Integration & Optimistic State Sync Lab',
    trackCategory: 'fullstack',
    category: 'scenario',
    labFormat: 'builder',
    appType: 'interactive_builder',
    difficulty: 'intermediate',
    xp: 250,
    estimatedMinutes: 30,
    requiredSkills: ['Full Stack Integration', 'React State Sync', 'Express REST API', 'Optimistic UI', 'Error Rollback'],
    scenario:
      'Students on slower cellular networks experience lag when ticking off daily challenges because the UI waits for server round-trip responses before updating item checkmarks.',
    objectives: [
      'Implement optimistic UI update on student task checkbox toggle',
      'Issue background POST request to Express backend endpoint `/api/tasks/toggle`',
      'Roll back UI state and show error toast if backend responds with 500 error',
      'Pass end-to-end full stack sync test'
    ],
    relatedChallengeDays: [21, 30, 42],
    status: 'published',
    version: '1.0.0',
    authorName: 'Full Stack Lead',
    updatedAt: '2026-08-07T15:00:00Z',
    flags: [
      {
        id: 'flag-fs-1',
        title: 'Submit Full Stack Sync Verification Flag',
        flagValue: 'WEBFORGE{fullstack_optimistic_ui_api_sync_complete_220}',
        points: 250,
        description: 'Submit the flag unlocked after building optimistic UI state updates with error rollback.'
      }
    ],
    hints: [
      {
        id: 'hint-fs-1-1',
        type: 'observation',
        title: 'Optimistic Pattern',
        content: 'Immediately update local React state before awaiting `fetch()`. If `res.ok` is false, revert state back to original value.',
        costXP: 0
      },
      {
        id: 'hint-fs-1-2',
        type: 'method',
        title: 'State Rollback Code',
        content: 'Store previous state in `const prevTasks = [...tasks]`. In catch block, execute `setTasks(prevTasks)`.',
        costXP: 10
      }
    ],
    writeup: {
      investigation: 'Measured UI latency on 3G network simulation. Toggling a task took 1200ms to reflect visually.',
      discovery: 'React handler awaited API promise before calling `setTasks()`.',
      reasoning: 'Optimistic rendering updates the UI instantly, providing immediate user feedback.',
      exploitation: 'Updated task state immediately and added rollback logic inside `.catch()`.',
      codeSnippet: 'const handleToggle = async (id) => {\n  const prev = [...tasks];\n  setTasks(prev.map(t => t.id === id ? { ...t, done: !t.done } : t));\n  try { await api.toggle(id); }\n  catch (e) { setTasks(prev); toast.error("Sync failed"); }\n};',
      mitigation: 'Use React Query or SWR for built-in optimistic updates and cache revalidation.'
    },
    dockerConfig: {
      containers: [
        {
          name: 'fullstack-app-server',
          image: 'webforge/fullstack-app:v1.0',
          port: 3006,
          status: 'healthy',
          cpuUsage: 1.0,
          memoryUsage: 50,
          healthCheckPassed: true,
          logs: ['[INFO] Full stack React + Express server online']
        }
      ],
      networkName: 'fs-net',
      healthChecks: [{ serviceName: 'fullstack-app-server', endpoint: '/health', expectedStatus: 200 }],
      dependencies: ['react', 'express', 'cors'],
      resetStrategy: 'fast_rollback'
    },
    validation: {
      applicationLoads: true,
      routesExist: true,
      databaseSeeded: true,
      authenticationWorks: true,
      sessionsWork: true,
      apiWorks: true,
      assetsLoad: true,
      flagsReachable: true,
      hintsAvailable: true,
      writeupsLinked: true,
      resetWorks: true,
      noRuntimeErrors: true
    },
    analytics: {
      completionsCount: 680,
      avgTimeMinutes: 24,
      resetCount: 11,
      passRatePercentage: 92.4,
      totalSubmissions: 715
    },
    assets: []
  },

  // ==========================================
  // AI / MACHINE LEARNING LABS
  // ==========================================
  {
    id: 'lab-ai-prompt-01',
    slug: 'system-prompt-grounding-context-injector',
    title: 'System Prompt Grounding & Context Injector Lab',
    trackCategory: 'data-ai',
    category: 'practice',
    labFormat: 'playground',
    appType: 'code_playground',
    difficulty: 'beginner',
    xp: 180,
    estimatedMinutes: 20,
    requiredSkills: ['Prompt Engineering', 'System Instructions', 'Context Grounding', 'Hallucination Defense'],
    scenario:
      'The ABTalks AI Learning Mentor generates inaccurate or hallucinated answers when students ask specific questions about curriculum Day 14 requirement criteria.',
    objectives: [
      'Configure System Instruction prompt boundary ("You are an expert ABTalks AI Guide...")',
      'Inject verified curriculum context documentation into the model prompt template',
      'Set temperature parameter to `0.2` for factual precision',
      'Pass AI grounding validation check'
    ],
    relatedChallengeDays: [7, 19, 31],
    status: 'published',
    version: '1.1.0',
    authorName: 'AI Engineering Lead',
    updatedAt: '2026-08-08T09:00:00Z',
    flags: [
      {
        id: 'flag-ai-1',
        title: 'Submit AI Context Grounding Flag',
        flagValue: 'WEBFORGE{ai_prompt_context_grounding_verified_310}',
        points: 180,
        description: 'Submit the flag generated upon successfully grounding the LLM prompt template.'
      }
    ],
    hints: [
      {
        id: 'hint-ai-1-1',
        type: 'observation',
        title: 'Temperature Effect',
        content: 'High temperature (> 0.8) increases randomness and hallucinations. For technical guides, keep temperature between 0.1 and 0.3.',
        costXP: 0
      },
      {
        id: 'hint-ai-1-2',
        type: 'method',
        title: 'Prompt Grounding Template',
        content: 'Format prompt: "Context: {document_text} \\n\\n Question: {user_query} \\n\\n Answer strictly based on the context above."',
        costXP: 10
      }
    ],
    writeup: {
      investigation: 'Tested AI responses to "What is the requirement for Day 14?". Model hallucinated non-existent submission links.',
      discovery: 'Prompt template sent raw query without system boundary or reference context.',
      reasoning: 'Retrieval Augmented Generation (RAG) and prompt grounding force the LLM to adhere strictly to provided context.',
      exploitation: 'Injected reference document into prompt and set strict system instructions.',
      codeSnippet: 'const prompt = `System: Answer using ONLY provided context.\\nContext: ${curriculumContext}\\nUser: ${query}`;',
      mitigation: 'Implement strict grounding checks and fallback messages when context is missing.'
    },
    dockerConfig: {
      containers: [
        {
          name: 'ai-prompt-sandbox',
          image: 'webforge/ai-prompt:v1.1',
          port: 3007,
          status: 'healthy',
          cpuUsage: 0.9,
          memoryUsage: 45,
          healthCheckPassed: true,
          logs: ['[INFO] AI prompt grounding engine online']
        }
      ],
      networkName: 'ai-net',
      healthChecks: [{ serviceName: 'ai-prompt-sandbox', endpoint: '/health', expectedStatus: 200 }],
      dependencies: ['@google/genai'],
      resetStrategy: 'fast_rollback'
    },
    validation: {
      applicationLoads: true,
      routesExist: true,
      databaseSeeded: true,
      authenticationWorks: true,
      sessionsWork: true,
      apiWorks: true,
      assetsLoad: true,
      flagsReachable: true,
      hintsAvailable: true,
      writeupsLinked: true,
      resetWorks: true,
      noRuntimeErrors: true
    },
    analytics: {
      completionsCount: 810,
      avgTimeMinutes: 16,
      resetCount: 5,
      passRatePercentage: 96.0,
      totalSubmissions: 830
    },
    assets: []
  },
  {
    id: 'lab-ai-confusion-matrix-02',
    slug: 'classification-metrics-confusion-matrix-evaluator',
    title: 'Classification Metrics & Confusion Matrix Evaluator Lab',
    trackCategory: 'data-ai',
    category: 'guided',
    labFormat: 'playground',
    appType: 'code_playground',
    difficulty: 'intermediate',
    xp: 240,
    estimatedMinutes: 25,
    requiredSkills: ['Machine Learning', 'Confusion Matrix', 'Precision & Recall', 'F1-Score', 'Decision Threshold'],
    scenario:
      'A student submission spam detector model has high accuracy (92%) but misses 60% of real spam because the default decision probability threshold is set too high (0.85).',
    objectives: [
      'Analyze True Positives (TP), False Positives (FP), True Negatives (TN), and False Negatives (FN)',
      'Calculate Precision = TP / (TP + FP) and Recall = TP / (TP + FN)',
      'Adjust probability classification threshold slider from 0.85 down to 0.50 to maximize F1-Score',
      'Submit model evaluation flag'
    ],
    relatedChallengeDays: [24, 36, 48],
    status: 'published',
    version: '1.0.0',
    authorName: 'Data Science Lead',
    updatedAt: '2026-08-07T11:00:00Z',
    flags: [
      {
        id: 'flag-ai-2',
        title: 'Submit Confusion Matrix Evaluation Flag',
        flagValue: 'WEBFORGE{ai_confusion_matrix_precision_recall_tuned_620}',
        points: 240,
        description: 'Submit the flag unlocked after optimizing the decision threshold to achieve F1-Score > 0.88.'
      }
    ],
    hints: [
      {
        id: 'hint-ai-2-1',
        type: 'observation',
        title: 'High Accuracy Fallback Paradox',
        content: 'When 90% of samples are non-spam, a model predicting "never spam" gets 90% accuracy but 0% recall.',
        costXP: 0
      },
      {
        id: 'hint-ai-2-2',
        type: 'method',
        title: 'Optimal Threshold',
        content: 'Slide the decision threshold to 0.52 to balance precision (0.90) and recall (0.87).',
        costXP: 10
      }
    ],
    writeup: {
      investigation: 'Evaluated confusion matrix at threshold 0.85: TP=40, FP=2, TN=900, FN=58.',
      discovery: 'Recall was only 40.8% due to overly conservative probability threshold.',
      reasoning: 'Lowering the threshold captures more true spam positives without drastically increasing false alarms.',
      exploitation: 'Adjusted decision threshold to 0.52. Model achieved TP=88, FP=10, Recall=89.8%, F1=0.893.',
      codeSnippet: 'y_pred = (y_probs >= 0.52).astype(int)\nf1 = f1_score(y_true, y_pred)',
      mitigation: 'Plot ROC and Precision-Recall curves to choose threshold based on business costs.'
    },
    dockerConfig: {
      containers: [
        {
          name: 'ml-eval-service',
          image: 'webforge/ml-eval:v1.0',
          port: 3008,
          status: 'healthy',
          cpuUsage: 0.7,
          memoryUsage: 42,
          healthCheckPassed: true,
          logs: ['[INFO] ML evaluation engine initialized']
        }
      ],
      networkName: 'ai-net',
      healthChecks: [{ serviceName: 'ml-eval-service', endpoint: '/health', expectedStatus: 200 }],
      dependencies: ['scikit-learn', 'numpy'],
      resetStrategy: 'fast_rollback'
    },
    validation: {
      applicationLoads: true,
      routesExist: true,
      databaseSeeded: true,
      authenticationWorks: true,
      sessionsWork: true,
      apiWorks: true,
      assetsLoad: true,
      flagsReachable: true,
      hintsAvailable: true,
      writeupsLinked: true,
      resetWorks: true,
      noRuntimeErrors: true
    },
    analytics: {
      completionsCount: 590,
      avgTimeMinutes: 21,
      resetCount: 7,
      passRatePercentage: 94.8,
      totalSubmissions: 615
    },
    assets: []
  },

  // ==========================================
  // CYBERSECURITY LABS
  // ==========================================
  {
    id: 'lab-corp-portal-01',
    slug: 'corporate-portal-config-leak',
    title: 'Acme Corp Portal — Secret Key Discovery & Administrative Bypass',
    trackCategory: 'cybersecurity',
    category: 'investigation',
    labFormat: 'app',
    appType: 'corporate_portal',
    difficulty: 'beginner',
    xp: 150,
    estimatedMinutes: 20,
    requiredSkills: ['HTTP Reconnaissance', 'Source Inspection', 'Header Analysis', 'Auth Bypass'],
    scenario:
      'Acme Global Enterprise recently upgraded their internal employee portal. Security auditors suspect that developer debug flags and environment secrets were accidentally compiled into public static bundles.',
    objectives: [
      'Perform HTTP reconnaissance on the corporate intranet portal',
      'Inspect public static assets and API metadata for leaked credentials',
      'Locate the secret JWT signing key or admin API key hidden in the portal debug logs',
      'Exfiltrate the flag from the executive vault document archive'
    ],
    relatedChallengeDays: [13, 27, 41],
    status: 'published',
    version: '1.4.0',
    authorName: 'Senior SecOps Lead',
    updatedAt: '2026-08-01T12:00:00Z',
    flags: [
      {
        id: 'flag-corp-1',
        title: 'Exfiltrate Executive Vault Flag',
        flagValue: 'WEBFORGE{corp_portal_jwt_secret_revealed_9942}',
        points: 150,
        description: 'Submit the master secret flag retrieved from the Acme Executive Vault.'
      }
    ],
    hints: [
      {
        id: 'hint-corp-1',
        type: 'observation',
        title: 'Observation Hint',
        content: 'Check DevTools Network tab or static bundle comments for `.env` strings or `/api/v1/debug` endpoints.',
        costXP: 0
      },
      {
        id: 'hint-corp-2',
        type: 'reasoning',
        title: 'Reasoning Hint',
        content: 'Change the role header in the top-bar from "employee" to "executive" or view the document labeled "Vault Archive Q3".',
        costXP: 10
      }
    ],
    writeup: {
      investigation: 'Inspected network traffic generated by the Acme Corporate Portal frontend.',
      discovery: 'The JSON payload included "JWT_SECRET": "acme_super_secret_key_2026".',
      reasoning: 'Administrative endpoints rely on client-asserted role headers.',
      exploitation: 'Sent a GET request with header X-User-Role: executive.',
      codeSnippet: 'curl -H "X-User-Role: executive" https://corp-portal.local/api/corp/documents?vault=true',
      mitigation: 'Remove debug endpoints from production builds.'
    },
    dockerConfig: {
      containers: [
        {
          name: 'acme-portal-web',
          image: 'webforge/acme-portal:v1.4',
          port: 8080,
          status: 'healthy',
          cpuUsage: 0.8,
          memoryUsage: 42,
          healthCheckPassed: true,
          logs: ['[INFO] Acme Corp Portal v1.4 started']
        }
      ],
      networkName: 'acme-corp-net',
      healthChecks: [{ serviceName: 'acme-portal-web', endpoint: '/health', expectedStatus: 200 }],
      dependencies: ['express'],
      resetStrategy: 'reseed_db'
    },
    validation: {
      applicationLoads: true,
      routesExist: true,
      databaseSeeded: true,
      authenticationWorks: true,
      sessionsWork: true,
      apiWorks: true,
      assetsLoad: true,
      flagsReachable: true,
      hintsAvailable: true,
      writeupsLinked: true,
      resetWorks: true,
      noRuntimeErrors: true
    },
    analytics: {
      completionsCount: 1420,
      avgTimeMinutes: 14,
      resetCount: 88,
      passRatePercentage: 94.2,
      totalSubmissions: 1510
    },
    assets: []
  },
  {
    id: 'lab-bank-dash-02',
    slug: 'apex-bank-idor-transfer',
    title: 'Apex Global Bank — IDOR Funds Transfer & Ledger Manipulation',
    trackCategory: 'cybersecurity',
    category: 'api',
    labFormat: 'app',
    appType: 'bank_dashboard',
    difficulty: 'intermediate',
    xp: 250,
    estimatedMinutes: 30,
    requiredSkills: ['API Security', 'Insecure Direct Object Reference (IDOR)', 'JSON Request Tampering'],
    scenario:
      'Apex Bank offers an online banking portal. The transaction API trusts the sender account parameter sent in JSON bodies without verifying JWT owner claims.',
    objectives: [
      'Log into the Apex Bank dashboard as User A (Account #ACC-1001)',
      'Analyze the JSON structure sent when making a wire transfer',
      'Exploit IDOR by modifying fromAccountId to drain target Account #ACC-9999',
      'Retrieve the flag from the administrator transfer receipt log'
    ],
    relatedChallengeDays: [17, 33, 45],
    status: 'published',
    version: '2.1.0',
    authorName: 'FinTech RedTeam Lead',
    updatedAt: '2026-08-03T14:30:00Z',
    flags: [
      {
        id: 'flag-bank-1',
        title: 'Exfiltrate Vault Account Flag',
        flagValue: 'WEBFORGE{idor_bank_transfer_ledger_manipulated_7831}',
        points: 250,
        description: 'Submit the flag returned in the transaction receipt after executing the IDOR transfer.'
      }
    ],
    hints: [
      {
        id: 'hint-bank-1',
        type: 'observation',
        title: 'Observation Hint',
        content: 'Observe transfer request body: { "fromAccount": "ACC-1001", "toAccount": "ACC-2002", "amount": 500 }.',
        costXP: 0
      }
    ],
    writeup: {
      investigation: 'Inspected API traffic during standard transfer.',
      discovery: 'The endpoint performs no authorization check mapping user identity to source account.',
      reasoning: 'An attacker can specify any source account ID.',
      exploitation: 'Submitted request with fromAccount = ACC-9999.',
      codeSnippet: 'POST /api/bank/transfer\n{"fromAccount": "ACC-9999", "toAccount": "ACC-1001", "amount": 10000}',
      mitigation: 'Bind session identity to database queries.'
    },
    dockerConfig: {
      containers: [
        {
          name: 'apex-bank-api',
          image: 'webforge/apex-bank:v2.1',
          port: 8081,
          status: 'healthy',
          cpuUsage: 1.1,
          memoryUsage: 58,
          healthCheckPassed: true,
          logs: ['[INFO] Apex Banking Core started']
        }
      ],
      networkName: 'apex-bank-net',
      healthChecks: [{ serviceName: 'apex-bank-api', endpoint: '/api/bank/health', expectedStatus: 200 }],
      dependencies: ['postgres'],
      resetStrategy: 'fast_rollback'
    },
    validation: {
      applicationLoads: true,
      routesExist: true,
      databaseSeeded: true,
      authenticationWorks: true,
      sessionsWork: true,
      apiWorks: true,
      assetsLoad: true,
      flagsReachable: true,
      hintsAvailable: true,
      writeupsLinked: true,
      resetWorks: true,
      noRuntimeErrors: true
    },
    analytics: {
      completionsCount: 980,
      avgTimeMinutes: 22,
      resetCount: 45,
      passRatePercentage: 91.5,
      totalSubmissions: 1070
    },
    assets: []
  },
  {
    id: 'lab-hospital-03',
    slug: 'medtech-ehrs-sql-injection',
    title: 'MedTech Hospital System — EHR Patient Database SQL Injection',
    trackCategory: 'cybersecurity',
    category: 'scenario',
    labFormat: 'app',
    appType: 'hospital_system',
    difficulty: 'intermediate',
    xp: 300,
    estimatedMinutes: 35,
    requiredSkills: ['SQL Injection', 'Database Exploitation', 'Sanitization Bypass'],
    scenario:
      'MedTech Regional Health Network manages electronic health records. A search filter on the patient directory page concatenates un-sanitized user strings directly into SQL queries.',
    objectives: [
      'Access the MedTech Hospital System Doctor Portal',
      'Navigate to Patient Search',
      'Inject SQL payloads into the search bar to bypass input validation',
      'Extract the confidential VIP Patient Record containing the flag'
    ],
    relatedChallengeDays: [29, 38, 51],
    status: 'published',
    version: '1.2.0',
    authorName: 'HealthSec Researcher',
    updatedAt: '2026-08-04T09:15:00Z',
    flags: [
      {
        id: 'flag-hospital-1',
        title: 'Extract VIP Patient EHR Flag',
        flagValue: 'WEBFORGE{sqli_hospital_patient_ehr_extracted_8812}',
        points: 300,
        description: 'Extract the flag stored inside the clinical notes column of patient ID #999.'
      }
    ],
    hints: [
      {
        id: 'hint-hosp-1',
        type: 'observation',
        title: 'Observation Hint',
        content: 'Searching for `\' OR id=999--` bypasses search filtering and returns Patient #999.',
        costXP: 0
      }
    ],
    writeup: {
      investigation: 'Tested input validation on search parameter.',
      discovery: 'Unescaped string concatenation allowed arbitrary SQL execution.',
      reasoning: 'Parameterized statements are required.',
      exploitation: 'Injected `\' OR id=999--`.',
      codeSnippet: "SELECT * FROM patients WHERE name LIKE '' OR id=999--%'",
      mitigation: 'Use prepared statements with parameter bindings.'
    },
    dockerConfig: {
      containers: [
        {
          name: 'medtech-ehr-app',
          image: 'webforge/medtech-ehr:v1.2',
          port: 8082,
          status: 'healthy',
          cpuUsage: 0.9,
          memoryUsage: 48,
          healthCheckPassed: true,
          logs: ['[INFO] MedTech EHR Portal initialized']
        }
      ],
      networkName: 'medtech-net',
      healthChecks: [{ serviceName: 'medtech-ehr-app', endpoint: '/health', expectedStatus: 200 }],
      dependencies: ['sqlite3'],
      resetStrategy: 'reseed_db'
    },
    validation: {
      applicationLoads: true,
      routesExist: true,
      databaseSeeded: true,
      authenticationWorks: true,
      sessionsWork: true,
      apiWorks: true,
      assetsLoad: true,
      flagsReachable: true,
      hintsAvailable: true,
      writeupsLinked: true,
      resetWorks: true,
      noRuntimeErrors: true
    },
    analytics: {
      completionsCount: 810,
      avgTimeMinutes: 28,
      resetCount: 31,
      passRatePercentage: 88.4,
      totalSubmissions: 916
    },
    assets: []
  },
  {
    id: 'lab-lms-04',
    slug: 'forge-lms-file-upload-xss',
    title: 'Forge LMS — Unrestricted Assignment Upload & Stored XSS',
    trackCategory: 'cybersecurity',
    category: 'guided',
    labFormat: 'app',
    appType: 'learning_management',
    difficulty: 'beginner',
    xp: 180,
    estimatedMinutes: 25,
    requiredSkills: ['File Upload Security', 'Cross-Site Scripting (XSS)', 'MIME Validation'],
    scenario:
      'Forge Learning Management System allows students to submit assignment files. The file processor fails to sanitize SVG/HTML content.',
    objectives: [
      'Navigate to Student Portal Assignment Submission',
      'Upload an SVG file containing a script execution trigger',
      'Simulate instructor evaluation to capture the flag'
    ],
    relatedChallengeDays: [23, 39, 49],
    status: 'published',
    version: '1.1.0',
    authorName: 'EdTech Security Lead',
    updatedAt: '2026-08-05T11:20:00Z',
    flags: [
      {
        id: 'flag-lms-1',
        title: 'Exfiltrate Instructor Session Flag',
        flagValue: 'WEBFORGE{stored_xss_lms_assignment_payload_4410}',
        points: 180,
        description: 'Submit the flag executed during instructor review.'
      }
    ],
    hints: [
      {
        id: 'hint-lms-1',
        type: 'observation',
        title: 'Observation Hint',
        content: 'Upload file named `solution.svg` calling `window.getLmsFlag()`.',
        costXP: 0
      }
    ],
    writeup: {
      investigation: 'Tested file upload route with SVG vector format.',
      discovery: 'SVG files execute nested JavaScript when rendered inline.',
      reasoning: 'Lacking Content-Disposition attachment headers allows code execution.',
      exploitation: 'Uploaded SVG calling instructor vault function.',
      codeSnippet: '<svg xmlns="http://www.w3.org/2000/svg"><script>window.getLmsFlag()</script></svg>',
      mitigation: 'Serve uploaded assets from isolated sandbox domains.'
    },
    dockerConfig: {
      containers: [
        {
          name: 'forge-lms-app',
          image: 'webforge/lms:v1.1',
          port: 8083,
          status: 'healthy',
          cpuUsage: 0.7,
          memoryUsage: 38,
          healthCheckPassed: true,
          logs: ['[INFO] Forge LMS initialized']
        }
      ],
      networkName: 'lms-net',
      healthChecks: [{ serviceName: 'forge-lms-app', endpoint: '/health', expectedStatus: 200 }],
      dependencies: ['express'],
      resetStrategy: 'fast_rollback'
    },
    validation: {
      applicationLoads: true,
      routesExist: true,
      databaseSeeded: true,
      authenticationWorks: true,
      sessionsWork: true,
      apiWorks: true,
      assetsLoad: true,
      flagsReachable: true,
      hintsAvailable: true,
      writeupsLinked: true,
      resetWorks: true,
      noRuntimeErrors: true
    },
    analytics: {
      completionsCount: 1150,
      avgTimeMinutes: 18,
      resetCount: 22,
      passRatePercentage: 96.1,
      totalSubmissions: 1196
    },
    assets: []
  },
  {
    id: 'lab-ecom-05',
    slug: 'shopmax-price-tampering',
    title: 'ShopMax E-Commerce — Client-Side Price Tampering & Cart Exploitation',
    trackCategory: 'cybersecurity',
    category: 'practice',
    labFormat: 'app',
    appType: 'ecommerce_platform',
    difficulty: 'beginner',
    xp: 200,
    estimatedMinutes: 20,
    requiredSkills: ['HTTP Interception', 'Business Logic Exploitation', 'Cart Manipulation'],
    scenario:
      'ShopMax accepts order item unit prices directly from client request payloads without server-side database validation.',
    objectives: [
      'Add a $2,500 workstation to cart',
      'Tamper price parameter in checkout request payload to $0.01',
      'Complete order to receive confirmation flag'
    ],
    relatedChallengeDays: [34, 44, 55],
    status: 'published',
    version: '1.3.0',
    authorName: 'ECom Auditor',
    updatedAt: '2026-08-06T15:00:00Z',
    flags: [
      {
        id: 'flag-ecom-1',
        title: 'Complete Tampered Order Flag',
        flagValue: 'WEBFORGE{ecommerce_price_tampered_checkout_success_1029}',
        points: 200,
        description: 'Submit the flag generated upon completing a tampered checkout order.'
      }
    ],
    hints: [
      {
        id: 'hint-ecom-1',
        type: 'observation',
        title: 'Observation Hint',
        content: 'Change unit price to 0.01 in the checkout payload form.',
        costXP: 0
      }
    ],
    writeup: {
      investigation: 'Monitored checkout POST payload.',
      discovery: 'Client supplies item price.',
      reasoning: 'Server must look up authoritative prices in database.',
      exploitation: 'Sent price = 0.01.',
      codeSnippet: 'POST /api/ecommerce/checkout\n{"items": [{"id": "ITEM-99", "price": 0.01}]}',
      mitigation: 'Recalculate order totals server-side.'
    },
    dockerConfig: {
      containers: [
        {
          name: 'shopmax-store',
          image: 'webforge/shopmax:v1.3',
          port: 8084,
          status: 'healthy',
          cpuUsage: 1.0,
          memoryUsage: 50,
          healthCheckPassed: true,
          logs: ['[INFO] ShopMax E-Commerce Engine running']
        }
      ],
      networkName: 'shopmax-net',
      healthChecks: [{ serviceName: 'shopmax-store', endpoint: '/health', expectedStatus: 200 }],
      dependencies: ['express'],
      resetStrategy: 'fast_rollback'
    },
    validation: {
      applicationLoads: true,
      routesExist: true,
      databaseSeeded: true,
      authenticationWorks: true,
      sessionsWork: true,
      apiWorks: true,
      assetsLoad: true,
      flagsReachable: true,
      hintsAvailable: true,
      writeupsLinked: true,
      resetWorks: true,
      noRuntimeErrors: true
    },
    analytics: {
      completionsCount: 1650,
      avgTimeMinutes: 12,
      resetCount: 19,
      passRatePercentage: 98.2,
      totalSubmissions: 1680
    },
    assets: []
  },
  {
    id: 'lab-cloud-06',
    slug: 'skywall-cloud-metadata-ssrf',
    title: 'SkyWall Cloud Dashboard — SSRF & AWS Metadata Key Extraction',
    trackCategory: 'cybersecurity',
    category: 'boss',
    labFormat: 'app',
    appType: 'cloud_dashboard',
    difficulty: 'advanced',
    xp: 500,
    estimatedMinutes: 45,
    requiredSkills: ['Server-Side Request Forgery (SSRF)', 'Cloud Metadata Analysis', 'IAM Escalation'],
    scenario:
      'SkyWall Cloud Console features a URL Health Inspector service that triggers backend HTTP requests to arbitrary user-supplied endpoints.',
    objectives: [
      'Access SkyWall Cloud Dashboard',
      'Exploit SSRF to query internal AWS IMDS metadata endpoint (`http://169.254.169.254`)',
      'Exfiltrate temporary IAM role credentials and retrieve master flag'
    ],
    relatedChallengeDays: [48, 52, 60],
    status: 'published',
    version: '2.0.0',
    authorName: 'Cloud Security Architect',
    updatedAt: '2026-08-07T16:45:00Z',
    flags: [
      {
        id: 'flag-cloud-1',
        title: 'Exfiltrate IAM Cloud Master Flag',
        flagValue: 'WEBFORGE{ssrf_cloud_metadata_iam_keys_compromised_9091}',
        points: 500,
        description: 'Submit master flag retrieved from simulated IAM metadata endpoint.'
      }
    ],
    hints: [
      {
        id: 'hint-cloud-1',
        type: 'observation',
        title: 'Observation Hint',
        content: 'Fetch `http://169.254.169.254/latest/meta-data/iam/security-credentials/admin-role`.',
        costXP: 0
      }
    ],
    writeup: {
      investigation: 'Identified SSRF vector in URL status checker.',
      discovery: 'Internal link-local addresses were unblocked.',
      reasoning: 'Requesting cloud metadata dumps host instance credentials.',
      exploitation: 'Queried AWS IMDS path.',
      codeSnippet: 'POST /api/cloud/fetch-url\n{"url": "http://169.254.169.254/latest/meta-data/iam/security-credentials/admin-role"}',
      mitigation: 'Require IMDSv2 session tokens.'
    },
    dockerConfig: {
      containers: [
        {
          name: 'skywall-cloud-node',
          image: 'webforge/skywall-cloud:v2.0',
          port: 8085,
          status: 'healthy',
          cpuUsage: 1.4,
          memoryUsage: 68,
          healthCheckPassed: true,
          logs: ['[INFO] SkyWall Cloud Console running']
        }
      ],
      networkName: 'skywall-net',
      healthChecks: [{ serviceName: 'skywall-cloud-node', endpoint: '/health', expectedStatus: 200 }],
      dependencies: ['express'],
      resetStrategy: 'cold_reboot'
    },
    validation: {
      applicationLoads: true,
      routesExist: true,
      databaseSeeded: true,
      authenticationWorks: true,
      sessionsWork: true,
      apiWorks: true,
      assetsLoad: true,
      flagsReachable: true,
      hintsAvailable: true,
      writeupsLinked: true,
      resetWorks: true,
      noRuntimeErrors: true
    },
    analytics: {
      completionsCount: 520,
      avgTimeMinutes: 38,
      resetCount: 64,
      passRatePercentage: 79.8,
      totalSubmissions: 652
    },
    assets: []
  },

  // ==========================================
  // DATA & PROGRAMMING (PYTHON / JAVA) LABS
  // ==========================================
  {
    id: 'lab-py-data-struct-01',
    slug: 'python-data-structures-json-parser',
    title: 'Python Data Structures & JSON Processor Lab',
    trackCategory: 'python',
    category: 'practice',
    labFormat: 'editor',
    appType: 'code_playground',
    difficulty: 'beginner',
    xp: 160,
    estimatedMinutes: 20,
    requiredSkills: ['Python Lists & Dicts', 'JSON Parsing', 'List Comprehension', 'Exception Handling'],
    scenario:
      'A student data export script fails when encountering missing dictionary keys or null values in JSON telemetry files.',
    objectives: [
      'Parse student JSON telemetry data using `json.loads()`',
      'Filter active students with completed days > 10 using list comprehension',
      'Handle missing optional fields safely with `.get(key, default)`',
      'Submit Python data processor flag'
    ],
    relatedChallengeDays: [3, 9, 18],
    status: 'published',
    version: '1.0.0',
    authorName: 'Python Track Lead',
    updatedAt: '2026-08-08T08:00:00Z',
    flags: [
      {
        id: 'flag-py-1',
        title: 'Submit Python JSON Processor Flag',
        flagValue: 'WEBFORGE{python_json_dictionary_comprehension_solved_405}',
        points: 160,
        description: 'Submit the flag awarded after filtering active student JSON records.'
      }
    ],
    hints: [
      {
        id: 'hint-py-1-1',
        type: 'observation',
        title: 'Safely Accessing Keys',
        content: 'Use `record.get("completedDays", 0)` instead of `record["completedDays"]` to avoid KeyError crashes.',
        costXP: 0
      },
      {
        id: 'hint-py-1-2',
        type: 'method',
        title: 'List Comprehension',
        content: '`active_students = [s["name"] for s in data if s.get("completedDays", 0) > 10]`',
        costXP: 10
      }
    ],
    writeup: {
      investigation: 'Ran Python parser against raw telemetry export. Script crashed with KeyError on record #42.',
      discovery: 'Record #42 lacked optional key "completedDays".',
      reasoning: 'Dictionary `.get()` avoids KeyError exceptions by returning safe defaults.',
      exploitation: 'Refactored parsing logic with dict comprehension and safe getters.',
      codeSnippet: 'import json\n\ndef process_students(raw_json):\n    data = json.loads(raw_json)\n    return [s["id"] for s in data if s.get("completedDays", 0) > 10]',
      mitigation: 'Use Pydantic or Dataclasses for strong data validation in Python.'
    },
    dockerConfig: {
      containers: [
        {
          name: 'python-runner',
          image: 'webforge/python-runner:v3.11',
          port: 3009,
          status: 'healthy',
          cpuUsage: 0.4,
          memoryUsage: 25,
          healthCheckPassed: true,
          logs: ['[INFO] Python 3.11 runtime ready']
        }
      ],
      networkName: 'py-net',
      healthChecks: [{ serviceName: 'python-runner', endpoint: '/health', expectedStatus: 200 }],
      dependencies: ['python:3.11-alpine'],
      resetStrategy: 'fast_rollback'
    },
    validation: {
      applicationLoads: true,
      routesExist: true,
      databaseSeeded: true,
      authenticationWorks: true,
      sessionsWork: true,
      apiWorks: true,
      assetsLoad: true,
      flagsReachable: true,
      hintsAvailable: true,
      writeupsLinked: true,
      resetWorks: true,
      noRuntimeErrors: true
    },
    analytics: {
      completionsCount: 780,
      avgTimeMinutes: 15,
      resetCount: 4,
      passRatePercentage: 97.8,
      totalSubmissions: 798
    },
    assets: []
  },
  {
    id: 'lab-java-oop-02',
    slug: 'java-class-hierarchy-exception-debugger',
    title: 'Java Class Hierarchy & Exception Handling Debugger',
    trackCategory: 'java',
    category: 'scenario',
    labFormat: 'editor',
    appType: 'code_playground',
    difficulty: 'intermediate',
    xp: 220,
    estimatedMinutes: 25,
    requiredSkills: ['Java OOP', 'Inheritance & Interfaces', 'Custom Exceptions', 'Polymorphism'],
    scenario:
      'A Java banking account model throws unhandled `NullPointerException` during multi-account batch settlement transactions.',
    objectives: [
      'Implement custom checked exception `InvalidTransactionException`',
      'Override `@Override public boolean equals(Object obj)` and `hashCode()` correctly in `Account` class',
      'Handle null checks before executing `account.withdraw(amount)`',
      'Submit Java OOP verification flag'
    ],
    relatedChallengeDays: [15, 28, 40],
    status: 'published',
    version: '1.0.0',
    authorName: 'Java Systems Lead',
    updatedAt: '2026-08-07T10:00:00Z',
    flags: [
      {
        id: 'flag-java-1',
        title: 'Submit Java OOP Verification Flag',
        flagValue: 'WEBFORGE{java_oop_polymorphism_exception_handled_912}',
        points: 220,
        description: 'Submit the flag awarded upon implementing custom Java exception handling and null safety.'
      }
    ],
    hints: [
      {
        id: 'hint-java-1-1',
        type: 'observation',
        title: 'Null Safety Check',
        content: 'Check for null before calling methods on object references: `if (acc == null) throw new InvalidTransactionException("Account null");`.',
        costXP: 0
      }
    ],
    writeup: {
      investigation: 'Ran JUnit test suite on account batch processor.',
      discovery: 'Batch loop crashed when iterating over null entries in array.',
      reasoning: 'Java requires explicit null validation or Optional handling.',
      exploitation: 'Added try-catch block wrapping custom exception.',
      codeSnippet: 'public void process(Account acc, double amount) throws InvalidTransactionException {\n    if (acc == null) throw new InvalidTransactionException("Null account reference");\n    acc.withdraw(amount);\n}',
      mitigation: 'Utilize Java 17 Records and @NonNull annotations.'
    },
    dockerConfig: {
      containers: [
        {
          name: 'java-runner',
          image: 'webforge/java-runner:v17',
          port: 3010,
          status: 'healthy',
          cpuUsage: 0.6,
          memoryUsage: 60,
          healthCheckPassed: true,
          logs: ['[INFO] OpenJDK 17 environment ready']
        }
      ],
      networkName: 'java-net',
      healthChecks: [{ serviceName: 'java-runner', endpoint: '/health', expectedStatus: 200 }],
      dependencies: ['openjdk:17-alpine'],
      resetStrategy: 'fast_rollback'
    },
    validation: {
      applicationLoads: true,
      routesExist: true,
      databaseSeeded: true,
      authenticationWorks: true,
      sessionsWork: true,
      apiWorks: true,
      assetsLoad: true,
      flagsReachable: true,
      hintsAvailable: true,
      writeupsLinked: true,
      resetWorks: true,
      noRuntimeErrors: true
    },
    analytics: {
      completionsCount: 450,
      avgTimeMinutes: 22,
      resetCount: 8,
      passRatePercentage: 92.0,
      totalSubmissions: 489
    },
    assets: []
  }
];

export function getLabById(id: string): Lab | undefined {
  return LAB_CATALOG.find((lab) => lab.id === id || lab.slug === id);
}
