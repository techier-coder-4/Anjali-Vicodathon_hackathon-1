import { CommunityChallenge } from '../types';

export const COMMUNITY_CHALLENGES: CommunityChallenge[] = [
  {
    id: 'cc_weekend_weather',
    title: 'Weekend Build: Live Weather & Air Quality Dashboard',
    description: 'Build a responsive weather dashboard using a free public API with real-time location search, 5-day forecasts, and clean glassmorphism UI.',
    category: 'Weekend Build',
    difficulty: 'intermediate',
    startDate: 'Saturday, Aug 15',
    endDate: 'Sunday, Aug 16',
    durationLabel: '48 Hours',
    estimatedTime: '3-4 Hours',
    participantsCount: 248,
    status: 'active',
    ctaText: 'Join Challenge',
    skills: ['REST APIs', 'Async/Await', 'Tailwind CSS', 'State Management'],
    rules: [
      'Must connect to an open public API (e.g., Open-Meteo or OpenWeatherMap)',
      'Include loading states, error handling for invalid cities, and responsive layout',
      'Submit GitHub repo & live preview link by Sunday 11:59 PM IST'
    ],
    rewardBadge: '🏆 Weekend Warrior Badge + 100 XP',
    projectPrompt: 'Design an intuitive dashboard showing temperature, humidity, UV index, and air quality index for any searched city.'
  },
  {
    id: 'cc_js_sprint',
    title: 'JavaScript Async & Array Method Sprint',
    description: 'Solve 10 real-world data transformation problems using JavaScript array methods (map, filter, reduce) and Promises/Async-Await.',
    category: 'JavaScript Sprint',
    difficulty: 'beginner',
    startDate: 'Monday, Aug 17',
    endDate: 'Wednesday, Aug 19',
    durationLabel: '3 Days',
    estimatedTime: '2 Hours',
    participantsCount: 412,
    status: 'upcoming',
    ctaText: 'Remind Me',
    skills: ['ES6 JavaScript', 'Array Methods', 'Promise Handling'],
    rules: [
      'Write clean, readable functions without external libraries',
      'Pass all automated test cases in the starter kit',
      'Share your solution snippet on LinkedIn tagged with #ABTalksJSSprint'
    ],
    rewardBadge: '⚡ JS Ninja Badge',
    projectPrompt: 'Refactor legacy spaghetti code into functional, immutably transformed data pipelines.'
  },
  {
    id: 'cc_ui_recreation',
    title: 'UI Recreation: Linear / Stripe Minimalist Component',
    description: 'Pixel-perfect recreation of Linear or Stripe landing page interaction components with keyboard navigation and dark theme aesthetics.',
    category: 'UI Recreation',
    difficulty: 'intermediate',
    startDate: 'Friday, Aug 21',
    endDate: 'Sunday, Aug 23',
    durationLabel: 'Weekend',
    estimatedTime: '3 Hours',
    participantsCount: 189,
    status: 'upcoming',
    ctaText: 'Register Now',
    skills: ['Tailwind CSS', 'Framer Motion', 'Accessibility (a11y)'],
    rules: [
      'Focus on typography, micro-interactions, and smooth transitions',
      'Pass WCAG AA contrast guidelines',
      'Provide screen recording demo in your submission'
    ],
    rewardBadge: '🎨 Pixel Craft Badge',
    projectPrompt: 'Recreate the sleek task matrix with animated hover cards and dark mode contrast.'
  },
  {
    id: 'cc_api_challenge',
    title: 'Backend API: Rate-Limited Auth & Middleware',
    description: 'Construct a Node.js/Express API service featuring JWT authentication, token refreshing, and sliding-window rate limiting.',
    category: 'API Challenge',
    difficulty: 'advanced',
    startDate: 'Aug 24',
    endDate: 'Aug 27',
    durationLabel: '4 Days',
    estimatedTime: '4 Hours',
    participantsCount: 156,
    status: 'upcoming',
    ctaText: 'Register Now',
    skills: ['Express.js', 'JWT Auth', 'Middleware', 'Rate Limiting'],
    rules: [
      'Implement custom middleware for rate limiting (e.g. 100 requests per 15 min per IP)',
      'Handle expired tokens gracefully with 401 response and refresh endpoints',
      'Include Postman collection or Curl documentation in README'
    ],
    rewardBadge: '🛡️ API Master Badge',
    projectPrompt: 'Protect a microservice route against brute-force attacks with custom sliding-window counters.'
  },
  {
    id: 'cc_ai_mini_project',
    title: 'AI Mini Project: Code Review & Explainability Bot',
    description: 'Leverage the Gemini API to build an automated code reviewer that spots bug patterns and explains code line-by-line to beginners.',
    category: 'AI Mini Project',
    difficulty: 'intermediate',
    startDate: 'Aug 28',
    endDate: 'Aug 30',
    durationLabel: 'Weekend',
    estimatedTime: '3-5 Hours',
    participantsCount: 310,
    status: 'upcoming',
    ctaText: 'Join Challenge',
    skills: ['Gemini API', 'Prompt Engineering', 'TypeScript', 'Server API Routes'],
    rules: [
      'Make server-side API calls to Gemini using @google/genai SDK',
      'Format output in Markdown with syntax-highlighted code suggestions',
      'Include fallback handling if API quota is reached'
    ],
    rewardBadge: '🤖 AI Architect Badge',
    projectPrompt: 'Build a web interface where students paste a function snippet and receive instant plain-English explanations and performance tips.'
  },
  {
    id: 'cc_debugging_sprint',
    title: 'Debugging Sprint: Fix 5 Production Memory & State Leaks',
    description: 'Receive a broken React app with infinite render loops, uncleaned WebSocket listeners, and memory leaks. Find and fix all 5 bugs!',
    category: 'Debugging Sprint',
    difficulty: 'intermediate',
    startDate: 'Sep 01',
    endDate: 'Sep 03',
    durationLabel: '48 Hours',
    estimatedTime: '2 Hours',
    participantsCount: 175,
    status: 'upcoming',
    ctaText: 'Get Notified',
    skills: ['React DevTools', 'Memory Leak Profiling', 'useEffect Hooks'],
    rules: [
      'Document root cause for each bug in a DEBUGGING.md file',
      'All unit tests must pass without browser console warnings',
      'No removing existing feature requirements to bypass bugs'
    ],
    rewardBadge: '🔍 Bug Hunter Badge',
    projectPrompt: 'Fix the re-render bug causing CPU usage spikes on list filtering.'
  },
  {
    id: 'cc_cybersecurity',
    title: 'Security Challenge: OWASP Top 5 Vulnerability Patching',
    description: 'Inspect a vulnerable web application, exploit SQL injection & XSS vulnerabilities in a sandbox environment, and submit security patches.',
    category: 'Security Challenge',
    difficulty: 'advanced',
    startDate: 'Sep 05',
    endDate: 'Sep 07',
    durationLabel: '3 Days',
    estimatedTime: '4 Hours',
    participantsCount: 142,
    status: 'upcoming',
    ctaText: 'Get Notified',
    skills: ['Web Security', 'OWASP Top 10', 'Sanitization', 'SQLi / XSS'],
    rules: [
      'Demonstrate vulnerability reproduction in local dev setup',
      'Apply input sanitization and parameterized queries to patch the security gaps',
      'Submit write-up of before & after vulnerability behavior'
    ],
    rewardBadge: '🔐 Cyber Sentinel Badge',
    projectPrompt: 'Patch an insecure endpoint vulnerable to SQL Injection and Stored Cross-Site Scripting (XSS).'
  },
  {
    id: 'cc_open_source',
    title: 'Community Open Source: Accessible Design System',
    description: 'Collaborate with the ABTalks community to build and publish a lightweight accessible UI component library for student builders.',
    category: 'Community Open Source',
    difficulty: 'beginner',
    startDate: 'Sep 10',
    endDate: 'Sep 20',
    durationLabel: '10 Days',
    estimatedTime: '5 Hours total',
    participantsCount: 520,
    status: 'upcoming',
    ctaText: 'Join Open Source',
    skills: ['TypeScript', 'Component Architecture', 'Tailwind', 'NPM Package'],
    rules: [
      'Submit a Pull Request with at least 1 accessible UI component (e.g. Accordion, Modal, Toast)',
      'Include Storybook or demo documentation with keyboard controls',
      'Review at least 1 fellow student PR'
    ],
    rewardBadge: '🌟 Open Source Champion',
    projectPrompt: 'Contribute a key component with ARIA attributes and keyboard shortcuts to the collective student UI library.'
  }
];
