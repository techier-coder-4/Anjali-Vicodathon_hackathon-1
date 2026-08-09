import { Challenge, CurriculumStage } from '../types';

export const STAGE_NAMES: Record<CurriculumStage, string> = {
  'discover': 'Stage 1 — Discover (Days 1–10)',
  'build': 'Stage 2 — Build (Days 11–25)',
  'experiment': 'Stage 3 — Experiment (Days 26–35)',
  'real-world': 'Stage 4 — Real-World Problems (Days 36–45)',
  'build-your-own': 'Stage 5 — Build Your Own (Days 46–55)',
  'showcase': 'Stage 6 — Showcase (Days 56–60)'
};

export const CHALLENGES: Challenge[] = [
  // STAGE 1 — DISCOVER (Days 1–10)
  {
    dayId: 1,
    title: "Environment Setup & The Minimal First Script",
    description: "Configure your modern development workspace, Node.js environment, and run your first CLI tool that reads environment variables.",
    requirements: [
      "Initialize Node.js project with ESM support",
      "Create a CLI script that takes process arguments",
      "Read a custom environment variable using dotenv or native env",
      "Format console output with timestamped logging"
    ],
    learningObjective: "Understand runtime environments, process arguments, and environment isolation.",
    whyItMatters: "Every software engineering system starts with a predictable environment configuration. Environment leaks are a leading cause of production outages.",
    challengeType: "build",
    difficulty: "beginner",
    estimatedMinutes: 25,
    curiosityPrompt: "What happens if an environment variable is omitted at boot? How should your application fail gracefully?",
    stage: "discover",
    stageName: STAGE_NAMES['discover']
  },
  {
    dayId: 2,
    title: "DOM Manipulation without Frameworks",
    description: "Build an interactive dynamic list using pure vanilla JavaScript DOM methods without relying on React or Vue.",
    requirements: [
      "Use document.createElement and appendChild dynamically",
      "Implement event delegation on a parent list container",
      "Add interactive item deletion and text updating",
      "Sanitize input to prevent basic XSS script injection"
    ],
    learningObjective: "Master core web standards and DOM tree lifecycle before abstraction.",
    whyItMatters: "Frameworks come and go, but the browser DOM remains the underlying runtime target.",
    challengeType: "build",
    difficulty: "beginner",
    estimatedMinutes: 30,
    curiosityPrompt: "Why is attaching one event listener to a container more efficient than attaching 1,000 listeners to individual items?",
    stage: "discover",
    stageName: STAGE_NAMES['discover']
  },
  {
    dayId: 3,
    title: "Debug the Broken Event Loop",
    description: "Analyze a buggy JavaScript script where asynchronous code executes out of order and blocks UI rendering.",
    requirements: [
      "Identify microtask vs macrotask execution order in given code snippet",
      "Fix blocking synchronous loops by introducing setImmediate / setTimeout",
      "Refactor callback hell into clean async/await promises",
      "Verify non-blocking execution using console timestamps"
    ],
    learningObjective: "Master the JavaScript Event Loop, Call Stack, Microtasks, and Macrotasks.",
    whyItMatters: "Understanding asynchronous non-blocking I/O is crucial for high-throughput single-threaded Node.js and fluid browser UI.",
    challengeType: "debug",
    difficulty: "beginner",
    estimatedMinutes: 35,
    curiosityPrompt: "Why does Promise.resolve().then() run before setTimeout(..., 0)?",
    stage: "discover",
    stageName: STAGE_NAMES['discover']
  },
  {
    dayId: 4,
    title: "Array Transformation Lab & Immutability",
    description: "Implement higher-order array manipulations (map, filter, reduce, flatMap) without mutating original data.",
    requirements: [
      "Transform flat transactional data into nested summary analytics using Array.prototype.reduce",
      "Enforce data immutability using Object.freeze and spread operators",
      "Write a custom re-implementation of Array.prototype.map from scratch",
      "Pass unit assertions verifying original dataset was untouched"
    ],
    learningObjective: "Functional data transformations and immutable state mutation patterns.",
    whyItMatters: "Data mutations are the primary source of race conditions and unexpected state bugs in complex applications.",
    challengeType: "experiment",
    difficulty: "beginner",
    estimatedMinutes: 30,
    curiosityPrompt: "How does deep immutability impact memory garbage collection compared to in-place mutation?",
    stage: "discover",
    stageName: STAGE_NAMES['discover']
  },
  {
    dayId: 5,
    title: "Fetch API & Robust Error Boundaries",
    description: "Fetch live HTTP JSON data from a public API, handle HTTP status codes (404, 500), network disconnects, and timeout constraints.",
    requirements: [
      "Fetch data using browser Fetch API with AbortController timeout",
      "Handle non-200 HTTP status responses gracefully with typed error objects",
      "Implement a basic retry counter for transient 503 errors",
      "Display fallback UI when request fails or time outs after 3 seconds"
    ],
    learningObjective: "Network resilience, HTTP response status verification, and request cancellation.",
    whyItMatters: "Networks are inherently unreliable. Production applications must handle failure as a first-class state.",
    challengeType: "solve",
    difficulty: "beginner",
    estimatedMinutes: 35,
    curiosityPrompt: "What happens if a user navigates away while a 10MB request is in flight? Why is AbortController crucial?",
    stage: "discover",
    stageName: STAGE_NAMES['discover']
  },
  {
    dayId: 6,
    title: "Local Storage State Synchronization",
    description: "Build a persistent state manager using window.localStorage with dynamic serialization and error handling.",
    requirements: [
      "Safely serialize and deserialize complex JavaScript objects with JSON.stringify/parse",
      "Handle JSON parse exceptions gracefully without breaking app state",
      "Listen to window 'storage' events for cross-tab synchronization",
      "Implement automatic schema versioning and migration check"
    ],
    learningObjective: "Client-side persistence, JSON serialization safety, and multi-tab state sync.",
    whyItMatters: "Users expect their progress and settings to persist across page refreshes and browser tabs.",
    challengeType: "build",
    difficulty: "beginner",
    estimatedMinutes: 30,
    curiosityPrompt: "What happens when localStorage quota (typically 5MB) is exceeded? How does your application recover?",
    stage: "discover",
    stageName: STAGE_NAMES['discover']
  },
  {
    dayId: 7,
    title: "CSS Flexbox vs Grid Architectural Layout",
    description: "Construct a responsive dashboard canvas layout using CSS Grid for macro structure and Flexbox for micro alignment.",
    requirements: [
      "Build a 3-zone layout (sidebar, main content, contextual panel) with CSS Grid",
      "Use flexbox for micro-alignments inside navigation items and toolbar chips",
      "Ensure fluid responsive adaptation down to 375px mobile viewport",
      "Eliminate all hardcoded pixels with relative rem/em units and CSS container queries"
    ],
    learningObjective: "Modern layout positioning, responsive design systems, and mobile-first CSS architecture.",
    whyItMatters: "Clean CSS structure reduces layout shifts (CLS) and makes responsive refactoring effortless.",
    challengeType: "design",
    difficulty: "beginner",
    estimatedMinutes: 30,
    curiosityPrompt: "When should you pick CSS Grid over Flexbox? Is one inherently superior or do they solve different dimensions?",
    stage: "discover",
    stageName: STAGE_NAMES['discover']
  },
  {
    dayId: 8,
    title: "Form Validation & Accessible Inputs",
    description: "Create an accessible registration form with real-time field validation, screen-reader aria attributes, and keyboard navigation.",
    requirements: [
      "Validate email, password complexity, and required fields on blur and submit",
      "Attach aria-invalid, aria-describedby, and semantic label tags",
      "Ensure complete keyboard navigation (Tab, Shift+Tab, Enter)",
      "Provide visually distinct focus rings and high contrast error messaging"
    ],
    learningObjective: "Web accessibility (a11y), semantic HTML, and defensive form validation.",
    whyItMatters: "Accessible interfaces ensure every user can operate your product, regardless of physical or assistive tool constraints.",
    challengeType: "improve",
    difficulty: "beginner",
    estimatedMinutes: 35,
    curiosityPrompt: "Why shouldn't you rely solely on color to indicate form field validation errors?",
    stage: "discover",
    stageName: STAGE_NAMES['discover']
  },
  {
    dayId: 9,
    title: "TypeScript Foundations & Type Guards",
    description: "Convert a plain untyped JavaScript module into strict TypeScript with custom type guards and interface definitions.",
    requirements: [
      "Define strict interfaces and union types for application payloads",
      "Implement custom Type Guard functions (isProduct, isUserPayload)",
      "Eliminate all instances of 'any' types with generics or unknown",
      "Configure strict compiler options in tsconfig.json"
    ],
    learningObjective: "Static typing, compile-time safety, runtime narrowing, and type definitions.",
    whyItMatters: "TypeScript catches entire classes of null/undefined reference errors before code ever hits production.",
    challengeType: "solve",
    difficulty: "beginner",
    estimatedMinutes: 40,
    curiosityPrompt: "How does TypeScript's 'unknown' type differ from 'any', and why is unknown significantly safer?",
    stage: "discover",
    stageName: STAGE_NAMES['discover']
  },
  {
    dayId: 10,
    title: "Stage 1 Milestone: Interactive Counter & Mini Project",
    description: "Combine Stage 1 concepts into a polished interactive task tracker with persistence, keyboard controls, and error handling.",
    requirements: [
      "Build a functional single-screen task tracker with pure JS/TS & DOM",
      "Persist items to localStorage with dynamic filtering (Active/Completed)",
      "Include keyboard shortcuts (Enter to add, Esc to clear)",
      "Write a short reflection summary on your Stage 1 progress"
    ],
    learningObjective: "Integration of web fundamentals, DOM handling, persistence, and functional data flows.",
    whyItMatters: "Synthesizing individual tools into a cohesive mini-app proves true conceptual understanding.",
    challengeType: "project",
    difficulty: "beginner",
    estimatedMinutes: 45,
    curiosityPrompt: "Looking back at Days 1–9, which web core concept challenged your prior assumptions the most?",
    stage: "discover",
    stageName: STAGE_NAMES['discover']
  },

  // STAGE 2 — BUILD (Days 11–25)
  {
    dayId: 11,
    title: "Express API Server & Route Handlers",
    description: "Build a RESTful Node.js Express HTTP server with JSON middleware and parameterized routes.",
    requirements: [
      "Setup Express application with express.json() middleware",
      "Implement GET, POST, PUT, DELETE endpoints for a resources resource",
      "Extract path parameters (:id) and query parameters cleanly",
      "Return standard HTTP status codes (200, 201, 400, 404)"
    ],
    learningObjective: "RESTful HTTP API principles, route parameters, and Express middleware pipeline.",
    whyItMatters: "APIs form the digital contracts between client interfaces and database infrastructure.",
    challengeType: "build",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    curiosityPrompt: "What is the semantic difference between PUT and PATCH when updating a resource?",
    stage: "build",
    stageName: STAGE_NAMES['build']
  },
  {
    dayId: 12,
    title: "React Component Hierarchy & Props Flow",
    description: "Structure a modular React component tree demonstrating clean top-down props flow and single responsibility.",
    requirements: [
      "Decompose a UI design into Card, Badge, Avatar, and List components",
      "Pass typed props with TypeScript interface constraints",
      "Implement children props composition pattern",
      "Verify components render without extraneous props drilling"
    ],
    learningObjective: "React component architecture, composition, and component isolation.",
    whyItMatters: "Modular components enable team velocity and UI design consistency across large web apps.",
    challengeType: "build",
    difficulty: "intermediate",
    estimatedMinutes: 30,
    curiosityPrompt: "When does prop drilling become a signal that your state should be lifted or placed in Context?",
    stage: "build",
    stageName: STAGE_NAMES['build']
  },
  {
    dayId: 13,
    title: "React State Management & useState Hooks",
    description: "Build a multi-step interactive wizard using React useState hook with functional updates.",
    requirements: [
      "Manage step navigation state (Next, Back, Submit)",
      "Use functional state updates (prev => prev + 1) to avoid state race conditions",
      "Validate each wizard step's state before allowing progression",
      "Reset wizard state back to initial default cleanly"
    ],
    learningObjective: "Controlled state loops, functional state setter patterns, and component lifecycle.",
    whyItMatters: "State mutation bugs during multi-step user flows directly impair conversion and trust.",
    challengeType: "build",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    curiosityPrompt: "Why can referencing stale state inside asynchronous callbacks cause subtle bugs when using useState?",
    stage: "build",
    stageName: STAGE_NAMES['build']
  },
  {
    dayId: 14,
    title: "Effect Lifecycle & Cleanups in useEffect",
    description: "Implement window resize listeners, interval timers, and WebSocket subscriptions safely inside useEffect.",
    requirements: [
      "Attach a window resize event listener inside useEffect",
      "Return a clean teardown function that removes event listeners on unmount",
      "Include correct primitive dependency arrays to prevent infinite re-renders",
      "Demonstrate cleanup timing using console logs"
    ],
    learningObjective: "React side-effect lifecycle, cleanup subscriptions, and dependency array hygiene.",
    whyItMatters: "Uncleaned event listeners or intervals cause memory leaks that degrade browser performance over time.",
    challengeType: "solve",
    difficulty: "intermediate",
    estimatedMinutes: 40,
    curiosityPrompt: "Why does React Strict Mode execute useEffect setup and cleanup twice during development?",
    stage: "build",
    stageName: STAGE_NAMES['build']
  },
  {
    dayId: 15,
    title: "Controlled vs Uncontrolled Forms in React",
    description: "Compare controlled input state vs FormData / useRef uncontrolled inputs in React.",
    requirements: [
      "Build a complex form using controlled React state for instant field validation",
      "Build a performance-critical form using useRef / native FormData",
      "Compare render counts between controlled and uncontrolled implementations",
      "Handle submit payloads cleanly in both patterns"
    ],
    learningObjective: "Form input rendering performance, controlled state, and direct DOM ref access.",
    whyItMatters: "Rerendering massive forms on every keystroke causes frame drops on lower-end mobile devices.",
    challengeType: "experiment",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    curiosityPrompt: "In what scenarios is an uncontrolled form significantly faster to implement and execute?",
    stage: "build",
    stageName: STAGE_NAMES['build']
  },
  {
    dayId: 16,
    title: "Express Middleware & Centralized Error Handlers",
    description: "Build a custom logging middleware, request timing middleware, and a global Express 4-argument error handler.",
    requirements: [
      "Create request duration timing middleware (res.on('finish'))",
      "Build route protection middleware checking Authorization headers",
      "Implement centralized Express error handler (err, req, res, next)",
      "Ensure API errors return standardized JSON shapes ({ error, status, timestamp })"
    ],
    learningObjective: "Express middleware execution pipeline, error propagation, and HTTP standards.",
    whyItMatters: "Centralized error handling prevents unhandled promise rejections from crashing server processes.",
    challengeType: "build",
    difficulty: "intermediate",
    estimatedMinutes: 40,
    curiosityPrompt: "Why must an Express error handling middleware function explicitly declare 4 parameters?",
    stage: "build",
    stageName: STAGE_NAMES['build']
  },
  {
    dayId: 17,
    title: "Reusable Custom Hooks & State Encapsulation",
    description: "Extract complex logic into custom React hooks (e.g., useLocalStorage, useDebounce, useFetchData).",
    requirements: [
      "Create a typed useLocalStorage<T> hook supporting state updates across components",
      "Create a useToggle hook for modal/drawer boolean state management",
      "Ensure clean React hook rules compliance (no conditional hook invocation)",
      "Test custom hook behavior across multiple distinct consumer components"
    ],
    learningObjective: "Custom React Hooks design, state reuse, and UI/logic separation.",
    whyItMatters: "Custom hooks allow teams to share sophisticated stateful behavior without duplicating UI code.",
    challengeType: "build",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    curiosityPrompt: "How do custom hooks maintain isolated state instances across different component instances?",
    stage: "build",
    stageName: STAGE_NAMES['build']
  },
  {
    dayId: 18,
    title: "React Context API & Global App Settings",
    description: "Build a Theme and User Settings Context Provider without introducing unnecessary global re-renders.",
    requirements: [
      "Create ThemeContext providing theme state ('light' | 'dark') and toggle method",
      "Wrap application layout with ThemeProvider",
      "Memoize context value object using useMemo to prevent unnecessary consumer re-renders",
      "Consume context across deep component children cleanly"
    ],
    learningObjective: "React Context pattern, state distribution, and render optimization.",
    whyItMatters: "Context provides global state access without passing props down through dozens of intermediate components.",
    challengeType: "build",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    curiosityPrompt: "Why does every component subscribing to a Context re-render whenever any part of the Context value updates?",
    stage: "build",
    stageName: STAGE_NAMES['build']
  },
  {
    dayId: 19,
    title: "Express Input Validation with Schema Libraries",
    description: "Protect Express backend routes against invalid or malicious request bodies using runtime schema validation.",
    requirements: [
      "Define request validation schemas for incoming JSON bodies",
      "Validate params, query strings, and body payload before route controller execution",
      "Return detailed 400 Bad Request error lists for invalid fields",
      "Sanitize inputs to strip unwanted or extra JSON payload keys"
    ],
    learningObjective: "Backend defensive validation, schema integrity, and input sanitization.",
    whyItMatters: "Never trust user input. Unvalidated payloads lead to SQL injection, NoSQL injection, and data corruption.",
    challengeType: "solve",
    difficulty: "intermediate",
    estimatedMinutes: 40,
    curiosityPrompt: "What is the danger of directly passing req.body into a database creation query?",
    stage: "build",
    stageName: STAGE_NAMES['build']
  },
  {
    dayId: 20,
    title: "REST Client Integration & Loading/Error UI",
    description: "Connect a React frontend component to an Express REST API with full lifecycle states (Loading, Error, Data, Empty).",
    requirements: [
      "Fetch data from backend route using async/await inside custom hook or useEffect",
      "Display animated skeleton loader during pending request state",
      "Render user-friendly error card with Retry action on network failure",
      "Render empty state UI when returned dataset array is empty"
    ],
    learningObjective: "Full-stack integration, complete UI state handling, and network UX design.",
    whyItMatters: "Users panic when screens freeze white without loading feedback or clear error recovery options.",
    challengeType: "build",
    difficulty: "intermediate",
    estimatedMinutes: 40,
    curiosityPrompt: "Why are skeleton loaders perceived as faster by users compared to traditional spinner wheels?",
    stage: "build",
    stageName: STAGE_NAMES['build']
  },
  {
    dayId: 21,
    title: "Environment Variables in Full-Stack Apps",
    description: "Safely isolate backend API secrets from public client bundle variables using .env setup.",
    requirements: [
      "Declare server-only process.env secrets vs client VITE_ public variables",
      "Verify client build bundle contains no exposed server secret keys",
      "Implement missing environment variable runtime boot checks",
      "Create clean .env.example configuration template"
    ],
    learningObjective: "Environment variable boundary security, client bundle isolation, and config check.",
    whyItMatters: "Exposing secret keys in frontend source code leads to automated API abuse and security breaches.",
    challengeType: "solve",
    difficulty: "intermediate",
    estimatedMinutes: 30,
    curiosityPrompt: "Why will process.env.SECRET_KEY be undefined in a client browser bundle unless Vite injects it?",
    stage: "build",
    stageName: STAGE_NAMES['build']
  },
  {
    dayId: 22,
    title: "Pagination & Infinite Loading Patterns",
    description: "Implement page-based and cursor-based pagination for large tabular or card datasets.",
    requirements: [
      "Build Express API supporting limit and page query parameters",
      "Build React pagination controls (Previous, Next, Page Numbers, Page Size)",
      "Return metadata headers/JSON ({ totalItems, totalPages, currentPage })",
      "Handle edge cases (out of range pages, empty page results)"
    ],
    learningObjective: "Dataset pagination strategy, performance scalability, and UI pagination mechanics.",
    whyItMatters: "Loading 10,000 records in a single payload crashes client memory and spikes database CPU.",
    challengeType: "build",
    difficulty: "intermediate",
    estimatedMinutes: 40,
    curiosityPrompt: "Why is cursor-based pagination preferred over offset-based pagination for high-velocity real-time feeds?",
    stage: "build",
    stageName: STAGE_NAMES['build']
  },
  {
    dayId: 23,
    title: "Debug Stale State & Closures in React",
    description: "Locate and resolve a subtle bug where a counter inside setInterval or event listener displays old state.",
    requirements: [
      "Reproduce stale closure issue in provided React timer component",
      "Fix stale closure using useRef or functional state updater (prev => prev + 1)",
      "Document exact cause of stale reference in JS closure context",
      "Verify timer updates accurately without re-subscribing on every tick"
    ],
    learningObjective: "JavaScript closure mechanics, React hook dependency rules, and ref mutable containers.",
    whyItMatters: "Stale closures are one of the most common mid-level React interview and production bugs.",
    challengeType: "debug",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    curiosityPrompt: "How does useRef allow values to persist across renders without triggering a re-render?",
    stage: "build",
    stageName: STAGE_NAMES['build']
  },
  {
    dayId: 24,
    title: "CSS Animations & Smooth Transitions",
    description: "Enhance user experience with GPU-accelerated CSS keyframe animations and Motion page transitions.",
    requirements: [
      "Create keyframe fade-in and slide-up modal entry animations",
      "Optimize properties using transform and opacity (GPU accelerated)",
      "Implement micro-interactions on button click and card hover",
      "Respect user prefers-reduced-motion media query settings"
    ],
    learningObjective: "Web animation performance, composite layers, accessibility preferences, and UI motion.",
    whyItMatters: "Fluid animations give web products a premium feel, but unoptimized animations cause stutter.",
    challengeType: "design",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    curiosityPrompt: "Why does animating transform: translate() perform better than animating top/left CSS properties?",
    stage: "build",
    stageName: STAGE_NAMES['build']
  },
  {
    dayId: 25,
    title: "Stage 2 Milestone: Mini Full-Stack Resource Hub",
    description: "Combine Stage 2 skills into a full-stack CRUD application with Express API, React frontend, and validation.",
    requirements: [
      "Build Express REST API for resources with full CRUD routes",
      "Build React dashboard interface with creation modal, list, and pagination",
      "Implement form validation and error handling on both client and server",
      "Write a reflection on your Stage 2 learning journey"
    ],
    learningObjective: "End-to-end full-stack web integration, client-server communication, and application structure.",
    whyItMatters: "Building a full-stack CRUD application is the foundational milestone of web software engineering.",
    challengeType: "project",
    difficulty: "intermediate",
    estimatedMinutes: 50,
    curiosityPrompt: "How did separating your API logic from UI components simplify debugging during development?",
    stage: "build",
    stageName: STAGE_NAMES['build']
  },

  // STAGE 3 — EXPERIMENT (Days 26–35)
  {
    dayId: 26,
    title: "Debounce & Throttle Implementation from Scratch",
    description: "Build custom debounce and throttle utilities without using external libraries like Lodash.",
    requirements: [
      "Write custom debounce function that delays execution until user stops typing for N ms",
      "Write custom throttle function limiting execution rate to once per N ms",
      "Connect debounce utility to a real-time search input box",
      "Verify search API request count drops from 20 requests to 1 request during rapid typing"
    ],
    learningObjective: "Rate limiting algorithms, timing functions, closures, and DOM optimization.",
    whyItMatters: "Unthrottled event handlers (scroll, resize, keypress) overload client CPUs and API servers.",
    challengeType: "experiment",
    difficulty: "intermediate",
    estimatedMinutes: 40,
    curiosityPrompt: "In what user interaction scenario would you pick throttle over debounce?",
    stage: "experiment",
    stageName: STAGE_NAMES['experiment']
  },
  {
    dayId: 27,
    title: "Custom Event Emitter / PubSub Engine",
    description: "Implement a lightweight publish-subscribe Event Emitter pattern in TypeScript.",
    requirements: [
      "Create EventEmitter class with on(event, listener), off(event, listener), and emit(event, data)",
      "Support multiple listener callbacks registered for a single event key",
      "Provide unsubscribe cleanup handle returned from on()",
      "Verify events transmit payloads cleanly between decoupled components"
    ],
    learningObjective: "Event-driven design patterns, Pub/Sub architecture, and loose coupling.",
    whyItMatters: "Pub/Sub allows complex applications to communicate without creating tight component dependencies.",
    challengeType: "build",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    curiosityPrompt: "How does Pub/Sub compare to React Context or state management libraries for cross-component signaling?",
    stage: "experiment",
    stageName: STAGE_NAMES['experiment']
  },
  {
    dayId: 28,
    title: "Virtual List / Windowed Rendering Experiment",
    description: "Render a dataset of 10,000 items smoothly by only rendering DOM elements visible inside the scroll viewport.",
    requirements: [
      "Calculate visible item indices based on container scrollTop, clientHeight, and item height",
      "Position absolute item nodes within a spacer container of total calculated height",
      "Benchmark rendering performance against a traditional unwindowed 10,000 node list",
      "Ensure smooth 60fps scrolling performance"
    ],
    learningObjective: "DOM rendering boundaries, DOM node count optimization, and windowing techniques.",
    whyItMatters: "Rendering tens of thousands of DOM elements degrades browser memory and causes severe layout thrashing.",
    challengeType: "experiment",
    difficulty: "advanced",
    estimatedMinutes: 45,
    curiosityPrompt: "What happens to browser memory when DOM node count grows beyond 5,000 elements?",
    stage: "experiment",
    stageName: STAGE_NAMES['experiment']
  },
  {
    dayId: 29,
    title: "Rebuilding a Client-Side Router from Scratch",
    description: "Implement a lightweight SPA hash / pushState router with dynamic param extraction without react-router.",
    requirements: [
      "Listen to window popstate and hashchange navigation events",
      "Match window.location.pathname against route definitions (/user/:id)",
      "Extract dynamic URL parameter objects ({ id: '123' })",
      "Render target view component dynamically based on route match"
    ],
    learningObjective: "Browser History API, URL routing mechanics, and single page app navigation.",
    whyItMatters: "Understanding browser navigation fundamentals unlocks deep insight into modern SPA framework internals.",
    challengeType: "experiment",
    difficulty: "advanced",
    estimatedMinutes: 45,
    curiosityPrompt: "How does history.pushState alter the browser URL bar without triggering a full HTML page reload from the server?",
    stage: "experiment",
    stageName: STAGE_NAMES['experiment']
  },
  {
    dayId: 30,
    title: "Web Workers & Background Thread Execution",
    description: "Offload CPU-intensive computation (e.g. prime calculation or data crunching) to a Web Worker thread.",
    requirements: [
      "Instantiate a dedicated Web Worker script from main thread",
      "Send payload using worker.postMessage()",
      "Receive calculated result via worker.onmessage without blocking UI main thread rendering",
      "Verify UI inputs remain responsive while background calculation executes"
    ],
    learningObjective: "Multithreaded web execution, Web Worker messaging, and main thread responsiveness.",
    whyItMatters: "Heavy mathematical calculations on the main thread cause frozen UI screens and dropped frames.",
    challengeType: "experiment",
    difficulty: "advanced",
    estimatedMinutes: 40,
    curiosityPrompt: "Why can't Web Workers directly manipulate the browser DOM or access window object variables?",
    stage: "experiment",
    stageName: STAGE_NAMES['experiment']
  },
  {
    dayId: 31,
    title: "Custom Memoization & Cache Strategy",
    description: "Implement a custom memoize function with LRU (Least Recently Used) cache eviction strategy.",
    requirements: [
      "Write memoize(fn) wrapper that caches function returns based on serialized argument keys",
      "Implement max cache size limit with LRU eviction algorithm",
      "Test execution timing with expensive Fibonacci or recursive function calls",
      "Provide cache clear / cache inspect utility methods"
    ],
    learningObjective: "Caching algorithms, LRU eviction, algorithmic optimization, and memoization.",
    whyItMatters: "Smart caching prevents redundant expensive calculations and network roundtrips.",
    challengeType: "build",
    difficulty: "advanced",
    estimatedMinutes: 40,
    curiosityPrompt: "What are the tradeoffs of caching function returns in memory vs calculating on demand?",
    stage: "experiment",
    stageName: STAGE_NAMES['experiment']
  },
  {
    dayId: 32,
    title: "CSS Container Queries & Adaptive Components",
    description: "Build adaptive UI cards that re-layout based on parent container width rather than viewport screen width.",
    requirements: [
      "Define @container queries on component container wrappers",
      "Switch card layout from horizontal to vertical stack based on container size",
      "Compare container queries against traditional @media screen viewport queries",
      "Verify components adapt correctly when placed in wide main panels or narrow sidebars"
    ],
    learningObjective: "Modern CSS layout architecture, container queries, and component-driven design.",
    whyItMatters: "Component-driven design requires components to be self-aware of their container space, not just screen size.",
    challengeType: "design",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    curiosityPrompt: "Why were traditional @media queries limited when building reusable component libraries?",
    stage: "experiment",
    stageName: STAGE_NAMES['experiment']
  },
  {
    dayId: 33,
    title: "State Machine Pattern for Complex UI",
    description: "Model a complex multi-state component (e.g. media player or payment flow) using a Finite State Machine.",
    requirements: [
      "Define explicit states (idle, loading, success, error, retrying)",
      "Define explicit transitions allowed between state nodes",
      "Prevent impossible state transitions (e.g. transitioning directly from idle to success without loading)",
      "Render UI directly derived from current state machine node"
    ],
    learningObjective: "Finite State Machine theory, state predictability, and eliminating impossible UI states.",
    whyItMatters: "State machines eliminate bug classes where components end up in impossible combined state booleans.",
    challengeType: "build",
    difficulty: "advanced",
    estimatedMinutes: 45,
    curiosityPrompt: "Why is `isLoading && isError` an example of bad state modeling compared to an explicit state string enum?",
    stage: "experiment",
    stageName: STAGE_NAMES['experiment']
  },
  {
    dayId: 34,
    title: "Optimistic UI Updates & Rollback",
    description: "Implement instant UI feedback on item creation/deletion with automatic server rollback on failure.",
    requirements: [
      "Update local React state immediately on user action before network request finishes",
      "Send asynchronous API request in background",
      "On API success, reconcile temporary local item ID with real server database ID",
      "On API failure, revert local state back to previous snapshot and display notification"
    ],
    learningObjective: "Optimistic UI patterns, state snapshots, error recovery, and perceived performance.",
    whyItMatters: "Optimistic UI makes applications feel instantaneous by eliminating artificial network waiting spinners.",
    challengeType: "experiment",
    difficulty: "advanced",
    estimatedMinutes: 45,
    curiosityPrompt: "How do you handle user actions performed on an optimistic item before the server returns its real ID?",
    stage: "experiment",
    stageName: STAGE_NAMES['experiment']
  },
  {
    dayId: 35,
    title: "Stage 3 Milestone: Performance & Experimentation Playground",
    description: "Combine Stage 3 experiments (Debounce, Memoization, Optimistic UI) into a interactive performance benchmark tool.",
    requirements: [
      "Build interactive dashboard demonstrating Debounced Search vs Unthrottled Search metrics",
      "Include toggleable Optimistic UI updates with simulated 30% API network error rate",
      "Display real-time render counts and execution latency stats",
      "Write a reflection on your Stage 3 experimentation findings"
    ],
    learningObjective: "Performance benchmarking, UI responsiveness, and advanced engineering experimentation.",
    whyItMatters: "Measuring and experimenting with performance tradeoffs is what distinguishes senior engineers from beginners.",
    challengeType: "project",
    difficulty: "advanced",
    estimatedMinutes: 50,
    curiosityPrompt: "Which experiment yielded the most dramatic quantitative performance improvement during your testing?",
    stage: "experiment",
    stageName: STAGE_NAMES['experiment']
  },

  // STAGE 4 — REAL-WORLD PROBLEMS (Days 36–45)
  {
    dayId: 36,
    title: "API Network Retry & Exponential Backoff",
    description: "Build an API fetch client wrapper with configurable retry attempts, jitter, and exponential backoff delay.",
    requirements: [
      "Implement retry loop for failed requests with 5xx status codes or network drops",
      "Calculate exponential backoff delay: baseDelay * 2^attempt + randomJitter",
      "Do NOT retry client 4xx status error codes (e.g. 401 Unauthorized, 404 Not Found)",
      "Provide request progress metrics (Attempt 1/3, Retrying in 2000ms...)"
    ],
    learningObjective: "Resilient networking, exponential backoff with jitter, and error classification.",
    whyItMatters: "Retrying failing API endpoints immediately without backoff causes thundering herd server collapses.",
    challengeType: "solve",
    difficulty: "advanced",
    estimatedMinutes: 40,
    curiosityPrompt: "Why is adding randomized jitter to retry delays essential when thousands of clients disconnect simultaneously?",
    stage: "real-world",
    stageName: STAGE_NAMES['real-world']
  },
  {
    dayId: 37,
    title: "Authentication Token Expiration & Silent Refresh",
    description: "Simulate JWT authentication flow with short-lived access tokens and silent refresh token rotation.",
    requirements: [
      "Store access token in memory and refresh token in secure HTTP-only cookie abstraction",
      "Intercept 401 Unauthorized response from API client",
      "Queue pending requests while silently fetching a new access token",
      "Re-play queued requests seamlessly once token refresh succeeds"
    ],
    learningObjective: "JWT authentication mechanics, token rotation, silent request interception, and auth security.",
    whyItMatters: "Token expiration without seamless refresh causes user sessions to drop abruptly during critical actions.",
    challengeType: "solve",
    difficulty: "advanced",
    estimatedMinutes: 45,
    curiosityPrompt: "Why shouldn't long-lived JWT access tokens be stored directly in browser localStorage?",
    stage: "real-world",
    stageName: STAGE_NAMES['real-world']
  },
  {
    dayId: 38,
    title: "Concurrent API Request Queue & Batching",
    description: "Build a request manager that throttles concurrent outgoing API calls to a maximum limit of N simultaneous connections.",
    requirements: [
      "Create RequestQueue class with concurrency limit (e.g. max 3 requests at a time)",
      "Queue overflow requests and process them as active requests resolve",
      "Support request cancellation and priority ordering",
      "Test with 20 simultaneous image download calls"
    ],
    learningObjective: "Concurrency control, queue management, resource throttling, and browser network limits.",
    whyItMatters: "Browsers limit concurrent TCP connections per domain. Uncontrolled request bursts cause queue stagnation.",
    challengeType: "solve",
    difficulty: "advanced",
    estimatedMinutes: 40,
    curiosityPrompt: "What is the maximum number of simultaneous HTTP/1.1 TCP connections browser engines allow per domain?",
    stage: "real-world",
    stageName: STAGE_NAMES['real-world']
  },
  {
    dayId: 39,
    title: "React Error Boundaries & Fallback Recovery",
    description: "Create custom React Error Boundaries catching render-time JavaScript exceptions cleanly.",
    requirements: [
      "Implement class component componentDidCatch / getDerivedStateFromError boundary",
      "Display isolated component-level error fallback UI without crashing entire page tree",
      "Provide 'Try Again' reset button that clears boundary error state",
      "Log error trace payload to monitoring logger abstraction"
    ],
    learningObjective: "React error handling lifecycle, fault isolation, and resilient UI hierarchy.",
    whyItMatters: "A runtime error in one unhandled component shouldn't white-screen the entire application.",
    challengeType: "improve",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    curiosityPrompt: "Why can't React Error Boundaries catch errors inside asynchronous callbacks or event handlers?",
    stage: "real-world",
    stageName: STAGE_NAMES['real-world']
  },
  {
    dayId: 40,
    title: "Data Export & File Generation (CSV / JSON)",
    description: "Build client-side data export triggers generating CSV and JSON file downloads from memory.",
    requirements: [
      "Convert structured JSON dataset into sanitized CSV string format",
      "Escape special CSV characters (commas, newlines, double quotes)",
      "Create temporary Blob URL and trigger synthetic download anchor element click",
      "Clean up ObjectURL memory reference after download completion"
    ],
    learningObjective: "Blob memory handling, data parsing, browser file APIs, and memory cleanup.",
    whyItMatters: "Exporting data to CSV/JSON is a universal enterprise feature required by business users.",
    challengeType: "build",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    curiosityPrompt: "Why is calling URL.revokeObjectURL(blobUrl) critical after triggering a file download?",
    stage: "real-world",
    stageName: STAGE_NAMES['real-world']
  },
  {
    dayId: 41,
    title: "Dark Mode Theme System & System Preferences",
    description: "Implement a dark/light theme switcher respecting system prefers-color-scheme and persisting manual user choice.",
    requirements: [
      "Detect browser prefers-color-scheme media query setting on boot",
      "Apply dark theme CSS class or data-theme attribute to root document element",
      "Listen to real-time OS theme preference changes",
      "Allow user manual override stored in localStorage"
    ],
    learningObjective: "CSS variables, media queries, theme engine design, and accessibility color contrast.",
    whyItMatters: "Proper theme support reduces eye strain and respects user OS choices across devices.",
    challengeType: "design",
    difficulty: "intermediate",
    estimatedMinutes: 30,
    curiosityPrompt: "How can you prevent 'theme flash' (white screen flicker before dark mode CSS loads) on initial page load?",
    stage: "real-world",
    stageName: STAGE_NAMES['real-world']
  },
  {
    dayId: 42,
    title: "Real-World Search with Multi-Filter & Sorting",
    description: "Build a rich search panel supporting text search, multiple category checkboxes, price/date ranges, and sorting.",
    requirements: [
      "Filter dataset across multiple combined criteria (Category AND Range AND Status)",
      "Implement dynamic sorting (Price Low-High, Date Newest, Relevance)",
      "Reflect active filter state cleanly in URL query params for shareable search links",
      "Provide 'Clear All Filters' single action button"
    ],
    learningObjective: "Complex array filtering, URL state synchronization, and search UI patterns.",
    whyItMatters: "Syncing filter state to URL params allows users to bookmark and share specific filtered views.",
    challengeType: "build",
    difficulty: "intermediate",
    estimatedMinutes: 40,
    curiosityPrompt: "Why is synchronizing UI filter state with URL search params better than keeping state purely in React memory?",
    stage: "real-world",
    stageName: STAGE_NAMES['real-world']
  },
  {
    dayId: 43,
    title: "Client-Side Drag and Drop Interface",
    description: "Build an interactive Kanban board or re-orderable list using HTML5 Drag and Drop API or Pointer Events.",
    requirements: [
      "Implement dragstart, dragover, drop event handlers cleanly",
      "Provide visual feedback on drop zones during active drag operation",
      "Re-order array items upon drop completion",
      "Ensure keyboard fallback actions (Move Up, Move Down buttons) for accessibility"
    ],
    learningObjective: "Browser Drag and Drop APIs, array re-ordering algorithms, and accessible interaction fallbacks.",
    whyItMatters: "Drag and drop interfaces make task management intuitive, but must maintain keyboard accessibility.",
    challengeType: "build",
    difficulty: "advanced",
    estimatedMinutes: 45,
    curiosityPrompt: "Why must you preventDefault() inside the dragover event handler for drop events to fire?",
    stage: "real-world",
    stageName: STAGE_NAMES['real-world']
  },
  {
    dayId: 44,
    title: "Web Storage Quota Management & Cleanup",
    description: "Build an automated storage manager monitoring localStorage quota usage and pruning oldest cached records.",
    requirements: [
      "Calculate current estimated localStorage usage in kilobytes",
      "Detect approaching quota limit errors (QuotaExceededError)",
      "Implement LRU cache eviction algorithm pruning oldest cached API payloads",
      "Provide storage health metric widget in settings panel"
    ],
    learningObjective: "Browser storage limitations, graceful eviction strategies, and storage monitoring.",
    whyItMatters: "Unmonitored client caching crashes silently when localStorage limits are reached.",
    challengeType: "solve",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    curiosityPrompt: "How does storage capacity differ between localStorage, IndexedDB, and SessionStorage?",
    stage: "real-world",
    stageName: STAGE_NAMES['real-world']
  },
  {
    dayId: 45,
    title: "Stage 4 Milestone: Production Readiness Audit",
    description: "Perform a comprehensive security, accessibility, and error handling audit on your application suite.",
    requirements: [
      "Audit all forms for WCAG AA contrast, labels, and aria attributes",
      "Verify all API endpoints fail safely without exposing stack traces",
      "Audit bundle size and strip unused package imports",
      "Write a complete Stage 4 retrospective reflection"
    ],
    learningObjective: "Production quality assurance, security hardening, accessibility auditing, and code hygiene.",
    whyItMatters: "Production readiness requires checking performance, security, and accessibility standards.",
    challengeType: "project",
    difficulty: "advanced",
    estimatedMinutes: 50,
    curiosityPrompt: "What single vulnerability or accessibility issue did your audit uncover that you had initially overlooked?",
    stage: "real-world",
    stageName: STAGE_NAMES['real-world']
  },

  // STAGE 5 — BUILD YOUR OWN (Days 46–55)
  {
    dayId: 46,
    title: "Capstone Specs & User Stories Definition",
    description: "Define the functional scope, target user personas, user stories, and feature requirements for your 10-day Capstone Project.",
    requirements: [
      "Write detailed PRD (Product Requirements Document) outlining core problem and solution",
      "Draft 5 user stories in format: As a [User], I want [Feature] so that [Benefit]",
      "Define MVP scope vs Post-MVP nice-to-have features",
      "Select core technology stack and architecture model"
    ],
    learningObjective: "Software product design, scope management, user story specification, and architectural planning.",
    whyItMatters: "Clear feature specifications prevent scope creep and ensure focus on high-impact MVP goals.",
    challengeType: "design",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    curiosityPrompt: "How do you decide which feature belongs in the core 10-day MVP vs post-launch backlog?",
    stage: "build-your-own",
    stageName: STAGE_NAMES['build-your-own']
  },
  {
    dayId: 47,
    title: "Architecture & Data Model Schema Design",
    description: "Design relational / document schemas, entity relationships, and API endpoint contracts for your Capstone.",
    requirements: [
      "Create Entity Relationship Diagram (ERD) or TypeScript interfaces for all database models",
      "Define API endpoint specs (HTTP method, URL path, request payload, response schema)",
      "Identify state management strategy for frontend application",
      "Document data validation rules for entity fields"
    ],
    learningObjective: "Data architecture, schema normalization, API contract design, and domain modeling.",
    whyItMatters: "A solid schema foundation prevents costly database migrations and API refactoring mid-build.",
    challengeType: "design",
    difficulty: "intermediate",
    estimatedMinutes: 40,
    curiosityPrompt: "What are the primary tradeoffs between a relational (SQL) schema vs a document (NoSQL) store for your project?",
    stage: "build-your-own",
    stageName: STAGE_NAMES['build-your-own']
  },
  {
    dayId: 48,
    title: "Capstone Core: Backend API Blueprint & Setup",
    description: "Initialize backend API foundation for your Capstone with middleware, routes, and error handling.",
    requirements: [
      "Setup Express server structure with clean modular route files",
      "Implement health check endpoint (/api/health) and resource CRUD controllers",
      "Hook up input validation and error handling middlewares",
      "Test backend endpoints using API client"
    ],
    learningObjective: "Backend boilerplate setup, route modularity, and server architecture.",
    whyItMatters: "Building a clean server foundation enables rapid endpoint additions during full-stack feature development.",
    challengeType: "build",
    difficulty: "intermediate",
    estimatedMinutes: 45,
    curiosityPrompt: "How does organizing route handlers into separate controller modules improve project maintainability?",
    stage: "build-your-own",
    stageName: STAGE_NAMES['build-your-own']
  },
  {
    dayId: 49,
    title: "Capstone Core: UI Layout & Navigation Structure",
    description: "Construct the primary visual scaffolding, navigation shell, and theme container for your Capstone.",
    requirements: [
      "Build primary navigation bar, mobile drawer, and header layout shell",
      "Configure global styles, typography, and responsive container constraints",
      "Implement route navigation transitions between primary views",
      "Ensure top navigation reflects active view route accurately"
    ],
    learningObjective: "Application layout architecture, navigation flows, and UI scaffolding.",
    whyItMatters: "A cohesive navigation layout establishes the visual identity and usability of your entire product.",
    challengeType: "build",
    difficulty: "intermediate",
    estimatedMinutes: 40,
    curiosityPrompt: "Why should navigation shells remain rendered while nested child view components swap dynamically?",
    stage: "build-your-own",
    stageName: STAGE_NAMES['build-your-own']
  },
  {
    dayId: 50,
    title: "Capstone Feature 1: Primary User Input Flow",
    description: "Build the core interactive data creation flow for your Capstone (e.g. post editor, item generator, or logger).",
    requirements: [
      "Build rich input form component with live validation and field hints",
      "Connect input submission to backend API creation endpoint",
      "Implement optimistic UI update or loading spinner feedback during creation",
      "Handle validation errors and server rejection cleanly"
    ],
    learningObjective: "Full-stack feature delivery, interactive form processing, and user feedback loops.",
    whyItMatters: "The primary input flow is where users generate value in your application.",
    challengeType: "build",
    difficulty: "advanced",
    estimatedMinutes: 45,
    curiosityPrompt: "How do you balance inline auto-saving vs explicit submit buttons in modern web tools?",
    stage: "build-your-own",
    stageName: STAGE_NAMES['build-your-own']
  },
  {
    dayId: 51,
    title: "Capstone Feature 2: Dashboard Data Display & Visualization",
    description: "Build the primary dashboard view rendering dynamic lists, summary metrics, or charts for your Capstone.",
    requirements: [
      "Render dynamic dataset cards/rows fetched from backend API",
      "Implement summary metric highlight cards (e.g. Total, Completed, Average)",
      "Add interactive search or category filter bar to dashboard",
      "Handle empty dataset state with clear onboarding call-to-action"
    ],
    learningObjective: "Data visualization, dashboard composition, state filtering, and empty state design.",
    whyItMatters: "Dashboards transform raw stored data into actionable visual insights for end users.",
    challengeType: "build",
    difficulty: "advanced",
    estimatedMinutes: 45,
    curiosityPrompt: "Why are empty states crucial for converting first-time users into active platform builders?",
    stage: "build-your-own",
    stageName: STAGE_NAMES['build-your-own']
  },
  {
    dayId: 52,
    title: "Capstone Feature 3: Detail View & Item Modification",
    description: "Build deep item view pages with edit modal capabilities, status toggles, and deletion confirmations.",
    requirements: [
      "Implement parameter-based route view (/item/:id) loading item detail payload",
      "Build inline edit controls or edit modal form",
      "Implement dangerous action confirmation modal (Delete Resource)",
      "Reconcile updated data cleanly across parent dashboard views"
    ],
    learningObjective: "Deep routing, resource mutation lifecycle, confirmation patterns, and state reconciliation.",
    whyItMatters: "Safe mutation options (editing and confirmation modals) build user confidence when managing critical data.",
    challengeType: "build",
    difficulty: "advanced",
    estimatedMinutes: 45,
    curiosityPrompt: "Why should destructive actions (like permanent deletion) require explicit modal confirmation?",
    stage: "build-your-own",
    stageName: STAGE_NAMES['build-your-own']
  },
  {
    dayId: 53,
    title: "Capstone Polish: Edge Cases & Defensive Safeguards",
    description: "Rigorously test and fix boundary conditions, long text truncation, missing images, and rapid double-clicks.",
    requirements: [
      "Disable action buttons during in-flight network requests to prevent duplicate submissions",
      "Add CSS text truncation (line-clamp, text-ellipsis) for arbitrarily long text titles",
      "Implement fallback image placeholders for broken media URLs",
      "Verify app behavior under extreme small/large screen dimensions"
    ],
    learningObjective: "Defensive UI design, boundary testing, network idempotency, and visual resilience.",
    whyItMatters: "Unpolished edge case glitches destroy the perception of quality in an otherwise great project.",
    challengeType: "improve",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    curiosityPrompt: "What happens if a user double-clicks 'Submit Payment' before the first request finishes?",
    stage: "build-your-own",
    stageName: STAGE_NAMES['build-your-own']
  },
  {
    dayId: 54,
    title: "Capstone Integration Testing & Bug Squashing",
    description: "Conduct systematic end-to-end user path testing across all Capstone views and fix discovered defects.",
    requirements: [
      "Walk through entire user journey from Onboarding → Dashboard → Feature Execution → Export",
      "Document discovered bugs in a simple defect tracking checklist",
      "Fix all critical/blocker bugs identified during walkthrough",
      "Verify application console is free of uncaught errors or key warning logs"
    ],
    learningObjective: "Quality assurance walkthrough, defect triage, debugging strategy, and stability verification.",
    whyItMatters: "Systematic testing ensures users encounter a seamless, error-free experience.",
    challengeType: "debug",
    difficulty: "advanced",
    estimatedMinutes: 45,
    curiosityPrompt: "Why is walking through the full user journey sequentially better than testing components in isolation?",
    stage: "build-your-own",
    stageName: STAGE_NAMES['build-your-own']
  },
  {
    dayId: 55,
    title: "Stage 5 Milestone: Capstone MVP Feature Complete",
    description: "Achieve feature complete status on your Capstone Project and prepare for documentation and showcase.",
    requirements: [
      "Verify all core user stories defined on Day 46 are fully functional",
      "Ensure backend and frontend run without manual intervention",
      "Capture screenshots and feature GIFs of primary working flows",
      "Write a reflection on building your own custom product from scratch"
    ],
    learningObjective: "Milestone execution, MVP delivery, self-assessment, and milestone celebration.",
    whyItMatters: "Shipping a complete MVP product from concept to working software builds real engineering pride.",
    challengeType: "project",
    difficulty: "advanced",
    estimatedMinutes: 50,
    curiosityPrompt: "How close was your final MVP implementation to the initial PRD specification drafted on Day 46?",
    stage: "build-your-own",
    stageName: STAGE_NAMES['build-your-own']
  },

  // STAGE 6 — SHOWCASE (Days 56–60)
  {
    dayId: 56,
    title: "Professional Documentation & README Crafting",
    description: "Write an exemplary GitHub README.md documenting problem statement, architecture diagram, setup guide, and API reference.",
    requirements: [
      "Structure README with Hero banner, Problem Statement, Features List, and Tech Stack",
      "Write step-by-step local installation and environment setup instructions",
      "Document API endpoints with example request/response payloads",
      "Include badge shields for build status, license, and technical stack"
    ],
    learningObjective: "Technical documentation, developer communication, and repository presentation.",
    whyItMatters: "Great code without documentation is invisible. Clear READMEs allow hiring managers and collaborators to evaluate your work in seconds.",
    challengeType: "design",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    curiosityPrompt: "Why do hiring managers look at repository READMEs before reading source code files?",
    stage: "showcase",
    stageName: STAGE_NAMES['showcase']
  },
  {
    dayId: 57,
    title: "Production Build Optimization & Security Audit",
    description: "Configure production build scripts, esbuild bundling, source maps, and security header checks.",
    requirements: [
      "Execute production build and analyze bundle asset output sizes",
      "Verify environment secrets are isolated from static bundle outputs",
      "Add security headers (X-Frame-Options, Content-Security-Policy basics)",
      "Ensure zero TypeScript or Linter warnings during production build step"
    ],
    learningObjective: "Production build configuration, asset bundling, performance optimization, and deployment security.",
    whyItMatters: "Production builds must be optimized for cold starts, minimal download sizes, and hardened security headers.",
    challengeType: "solve",
    difficulty: "advanced",
    estimatedMinutes: 40,
    curiosityPrompt: "How does esbuild bundle server code into CommonJS to eliminate runtime ESM module resolution overhead?",
    stage: "showcase",
    stageName: STAGE_NAMES['showcase']
  },
  {
    dayId: 58,
    title: "Live Cloud Deployment & Hosting Setup",
    description: "Deploy your full-stack application to a live Cloud Run container or cloud platform with custom domain / URL.",
    requirements: [
      "Verify container startup script binds to PORT 3000 on host 0.0.0.0",
      "Deploy application build and verify live public URL accessibility",
      "Verify environment variables are securely injected in deployment configuration",
      "Perform live smoke test on public production deployment URL"
    ],
    learningObjective: "Cloud deployment, containerization runtime, host binding, and cloud hosting.",
    whyItMatters: "Software only creates impact when deployed live on the web where real users can access it.",
    challengeType: "project",
    difficulty: "advanced",
    estimatedMinutes: 45,
    curiosityPrompt: "Why is binding to host 0.0.0.0 required inside container environments like Docker and Cloud Run?",
    stage: "showcase",
    stageName: STAGE_NAMES['showcase']
  },
  {
    dayId: 59,
    title: "Portfolio Showcase Page & Proof of Work",
    description: "Create a professional project showcase summary with working GitHub repository links, commit logs, and LinkedIn summary post.",
    requirements: [
      "Compile project showcase card with live demo link and GitHub repository link",
      "Draft a professional LinkedIn update highlighting your 60-day technical growth",
      "Format proof links verifying submission status across all 60 days",
      "Review your 60-day consistency streak metrics"
    ],
    learningObjective: "Career presentation, public proof of work, professional storytelling, and networking.",
    whyItMatters: "Public proof of work distinguishes disciplined engineers who execute continuously from passive learners.",
    challengeType: "project",
    difficulty: "intermediate",
    estimatedMinutes: 40,
    curiosityPrompt: "Why does sharing public proof of work on LinkedIn and GitHub open unexpected engineering career opportunities?",
    stage: "showcase",
    stageName: STAGE_NAMES['showcase']
  },
  {
    dayId: 60,
    title: "60-Day Completion & Graduation Reflection",
    description: "Celebrate completing the full 60-Day ABTalks Technical Challenge! Complete your final reflection and unlock your Graduation Certificate.",
    requirements: [
      "Complete final 60-day reflection on technical transformation, consistency habits, and future goals",
      "Unlock the 60-Day Master Builder Achievement Badge",
      "Review complete 60-day journey map with 100% completion badge",
      "Share your official graduation summary with the ABTalks community"
    ],
    learningObjective: "Self-reflection, habit consolidation, milestone celebration, and lifelong learning commitment.",
    whyItMatters: "Building software consistently for 60 consecutive days shifts your identity from student to unstoppable builder.",
    challengeType: "project",
    difficulty: "advanced",
    estimatedMinutes: 30,
    curiosityPrompt: "Looking back at Day 1 vs Day 60, what is the single biggest mindset shift in how you approach software engineering problems?",
    stage: "showcase",
    stageName: STAGE_NAMES['showcase']
  }
];

export function getChallengeByDay(dayId: number): Challenge | undefined {
  return CHALLENGES.find(c => c.dayId === dayId);
}
