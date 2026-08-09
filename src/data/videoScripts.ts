import { LearningVideoScript, Challenge, TrackType, VisualSceneChoreography } from '../types';

/**
 * Pre-built grounded cinematic storytelling scripts for all tracks and challenges.
 * Generates continuous narrative arcs (Hook -> Problem -> Struggle -> Discovery -> Transformation -> Payoff).
 */

export function generateFallbackVideoScript(challenge: Challenge): LearningVideoScript {
  const title = challenge.title;
  const track = challenge.trackId;
  const day = challenge.dayId;

  // Real world example mapper based on track
  const realWorldExamplesMap: Record<TrackType, string[]> = {
    frontend: ['Spotify Web', 'Instagram Feed', 'Airbnb Search'],
    backend: ['Stripe Payments', 'Uber Dispatch System', 'WhatsApp Realtime Core'],
    fullstack: ['Netflix Web Portal', 'Linear Task Manager', 'GitHub Pull Requests'],
    python: ['Automated Pipeline Services', 'FastAPI Microservices', 'Data Transformer Engines'],
    'data-ai': ['ChatGPT Assistant', 'Recommendation Engines', 'Fraud Detection System'],
    java: ['Banking Transaction Engine', 'Enterprise Core Services', 'High-Frequency Exchange'],
    cybersecurity: ['Cloudflare Edge Shield', 'Google OAuth Portal', 'Threat Detection Engine']
  };

  const realWorld = realWorldExamplesMap[track] || ['Google Cloud', 'YouTube Live', 'Mobile Banking'];

  // Theme mapper
  const themeMap: Record<TrackType, VisualSceneChoreography['theme']> = {
    frontend: 'frontend',
    backend: 'network',
    fullstack: 'cloud',
    python: 'code',
    'data-ai': 'ai',
    java: 'code',
    cybersecurity: 'security'
  };

  const currentTheme = themeMap[track] || 'network';

  // Topic-specific story generation logic
  const isSetupOrHello = title.toLowerCase().includes('setup') || title.toLowerCase().includes('hello') || day === 1;
  const isAuth = title.toLowerCase().includes('auth') || title.toLowerCase().includes('login') || title.toLowerCase().includes('jwt');
  const isDB = title.toLowerCase().includes('db') || title.toLowerCase().includes('database') || title.toLowerCase().includes('sql') || title.toLowerCase().includes('mongo');
  const isAPI = title.toLowerCase().includes('api') || title.toLowerCase().includes('fetch') || title.toLowerCase().includes('rest');
  const isDebug = title.toLowerCase().includes('debug') || title.toLowerCase().includes('test') || title.toLowerCase().includes('bug');

  let storyHook = `A developer sits at their desk late at night with a bold idea. But the moment they try to run their code, nothing happens. The screen stays blank.`;
  let problemStory = `Without proper "${title}", tiny missing pieces cause hidden failures. Requests drop, screens freeze, and users walk away frustrated.`;
  let discoveryStory = `Then comes the breakthrough. Introducing ${title} turns chaotic code into a predictable, robust engine—giving you complete control over how data flows.`;
  let impactStory = `This isn't just theory. Production platforms like ${realWorld.join(', ')} rely on this exact pattern every second to serve millions seamlessly.`;
  let payoffStory = `Now, the barrier is gone. You're ready to write real, production-grade code that actually works. Let's start building!`;

  if (isSetupOrHello) {
    storyHook = `A student sits down with a great project idea. They open their laptop, eager to build, but the terminal throws error after error. Nothing is configured yet.`;
    problemStory = `An idea is useless if your machine doesn't know how to run it. Missing tools and incorrect paths leave you stranded before you even type a line of code.`;
    discoveryStory = `By setting up your development environment and crafting your first executable file, your computer finally understands your commands.`;
    impactStory = `Every senior developer at companies like ${realWorld[0]} started with this exact step—preparing the foundation before building complex systems.`;
    payoffStory = `Your machine is now ready, the terminal is listening, and your project is born. Now you can actually start building!`;
  } else if (isAuth) {
    storyHook = `Imagine launching a user app where anyone can view anyone else's private messages just by guessing a URL. Chaos immediately breaks loose.`;
    problemStory = `Without secure identity verification, your application cannot distinguish trusted users from bad actors, risking sensitive data leaks.`;
    discoveryStory = `By implementing ${title}, your system creates an unforgeable digital key that verifies identities and guards restricted resources automatically.`;
    impactStory = `Tech giants like ${realWorld.slice(0, 2).join(' and ')} use this exact security model to safeguard billions of personal accounts every day.`;
    payoffStory = `You now hold the power to keep user data safe and build software that people can truly trust. Let me see what you build!`;
  } else if (isDB) {
    storyHook = `An app goes viral overnight! Thousands of users sign up, but information is stored in messy flat files. The server slows to a crawl and crashes.`;
    problemStory = `Unorganized data turns simple lookups into agonizing wait times, causing database timeouts and corrupted user records.`;
    discoveryStory = `Applying ${title} structures your data into lightning-fast, indexed storage towers that scale effortlessly under heavy load.`;
    impactStory = `Systems at ${realWorld.join(', ')} process millions of complex data queries per second using this fundamental architecture.`;
    payoffStory = `With structured data persistence, your applications can scale from ten users to ten million without breaking a sweat.`;
  } else if (isAPI) {
    storyHook = `Two independent applications need to talk to each other. But without a shared language, data gets garbled and communication completely breaks down.`;
    problemStory = `When frontends and backends cannot communicate reliably, user interfaces display stale data and operations fail silently.`;
    discoveryStory = `Using ${title} establishes a clean, predictable contract between systems—allowing data to travel across networks in milliseconds.`;
    impactStory = `Every modern digital experience, from ${realWorld[0]} to ${realWorld[1]}, is powered by thousands of interconnecting API calls.`;
    payoffStory = `You now have the key to connect frontends, backends, and third-party services into one unified product. Let's dive in!`;
  } else if (isDebug) {
    storyHook = `Everything looks perfect on paper. But when you click the submit button in production, an mysterious edge-case error crashes the server.`;
    problemStory = `Relying on guesswork to fix bugs leads to endless hours of frustration and temporary fixes that break again tomorrow.`;
    discoveryStory = `By mastering ${title}, you gain systematic diagnostic vision—tracing execution paths directly to the root cause in minutes.`;
    impactStory = `Top engineers at ${realWorld[0]} spend a huge portion of their time refining debugging workflows to keep systems 99.99% resilient.`;
    payoffStory = `You'll no longer fear mysterious bugs—you'll have the tools and mindset to diagnose and fix them like a pro.`;
  }

  const cinematicEnding = `Now that you understand why this matters in production... it's your turn. Let me see what you can build today!`;

  return {
    trackId: track,
    dayId: day,
    challengeTitle: title,
    durationSeconds: 58,
    cinematicHook: storyHook,
    cinematicEnding,
    sections: [
      {
        type: 'intro',
        title: 'The Situation',
        narration: storyHook,
        visualHook: `Night time developer room with glowing monitor and coffee cup`,
        durationSeconds: 10,
        choreography: {
          theme: currentTheme,
          cameraZoom: 1.0,
          cameraPanX: 0,
          cameraPanY: 0,
          statusState: 'normal',
          environmentGlow: '#6366f1',
          primaryActorName: 'Developer Studio',
          particleSpeed: 1.0,
          emphasisWords: ['desk', 'idea', 'laptop', 'blank']
        }
      },
      {
        type: 'what',
        title: 'The Struggle',
        narration: problemStory,
        visualHook: `Zooming into screen showing blocked data stream and flashing alert`,
        durationSeconds: 12,
        choreography: {
          theme: currentTheme,
          cameraZoom: 1.35,
          cameraPanX: -12,
          cameraPanY: 8,
          statusState: 'problem',
          environmentGlow: '#f43f5e',
          primaryActorName: 'Critical Barrier',
          secondaryActorName: 'Blocked Connection',
          focusHighlightLabel: 'Failure Point',
          particleSpeed: 0.4,
          emphasisWords: ['failures', 'drop', 'freeze', 'frustrated']
        }
      },
      {
        type: 'why_matters',
        title: 'The Discovery',
        narration: discoveryStory,
        visualHook: `Golden light beam unlocking the system, converting red lights into glowing green`,
        durationSeconds: 12,
        choreography: {
          theme: currentTheme,
          cameraZoom: 1.5,
          cameraPanX: 0,
          cameraPanY: -10,
          statusState: 'breakthrough',
          environmentGlow: '#f59e0b',
          primaryActorName: title,
          focusHighlightLabel: 'Golden Key',
          particleSpeed: 2.2,
          emphasisWords: ['breakthrough', 'predictable', 'control', 'flow']
        }
      },
      {
        type: 'where_used',
        title: 'Real World Impact',
        narration: impactStory,
        visualHook: `Vast global network grid with data travelling across glowing server towers`,
        durationSeconds: 12,
        choreography: {
          theme: currentTheme,
          cameraZoom: 1.15,
          cameraPanX: 20,
          cameraPanY: -5,
          statusState: 'solution',
          environmentGlow: '#10b981',
          primaryActorName: realWorld[0],
          secondaryActorName: realWorld[1],
          focusHighlightLabel: 'Production Grid',
          particleSpeed: 2.6,
          emphasisWords: ['millions', 'production', 'seamlessly', 'every second']
        }
      },
      {
        type: 'motivation',
        title: 'The Payoff',
        narration: `${payoffStory} ${cinematicEnding}`,
        visualHook: `3D glowing project portal coming together, inviting the student to start`,
        durationSeconds: 12,
        choreography: {
          theme: currentTheme,
          cameraZoom: 1.0,
          cameraPanX: 0,
          cameraPanY: 0,
          statusState: 'success',
          environmentGlow: '#3b82f6',
          primaryActorName: 'Start Mission',
          particleSpeed: 3.0,
          emphasisWords: ['barrier gone', 'ready', 'build', 'your turn']
        }
      }
    ],
    transcript: `${storyHook} ${problemStory} ${discoveryStory} ${impactStory} ${payoffStory} ${cinematicEnding}`,
    fallbackExplanation: `Why Learn "${title}"? ${challenge.whyItMatters} In production, engineering teams at ${realWorld.join(', ')} rely on this concept to ensure reliability, security, and performance.`,
    realWorldUses: realWorld,
    studentBenefits: [
      'Master fundamental software architecture',
      'Ace technical interview questions at leading tech companies',
      'Build scalable, resilient applications for your portfolio'
    ],
    todayMissionSummary: challenge.description
  };
}


