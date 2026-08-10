# ABTalks

A 60-day learning and consistency platform for college students.

---

## 🌐 Quick Links

- **Live Application**: [https://ais-pre-amdzihvzatrc63h2uxadlv-740479080993.asia-southeast1.run.app](https://ais-pre-amdzihvzatrc63h2uxadlv-740479080993.asia-southeast1.run.app)
- **Development Environment**: [https://ais-dev-amdzihvzatrc63h2uxadlv-740479080993.asia-southeast1.run.app](https://ais-dev-amdzihvzatrc63h2uxadlv-740479080993.asia-southeast1.run.app)
- **GitHub Repository**: [https://github.com/techier-coder-4/Anjali-Vicodathon_hackathon-1](https://github.com/techier-coder-4/Anjali-Vicodathon_hackathon-1)

---

## 🗺️ First-Time User Evaluation Route Map & Flow

For judges, developers, and first-time reviewers, here is the exact step-by-step route map to explore the application:

```
[ 1. Landing Page (`/`) ]
        │
        ├── View active tracks & features -> Click "Get Started" or "Explore Challenges"
        │
[ 2. Student Dashboard (`/dashboard`) ]
        │
        ├── View Active 60-Day Journey, Daily Streaks & Stage Milestones
        ├── Click "Challenge Yourself" to create a custom 60-day roadmap
        ├── Click "Switch Journey" to manage multiple independent learning paths
        │
[ 3. Daily Challenge Page (`/day/12` or `/day/1`) ]
        │
        ├── Step-by-step interactive task checklist & deliverable guidelines
        ├── Submit Proof of Work (GitHub Repo link / LinkedIn post)
        ├── Complete Reflection Checkpoint & tag understanding (Grasped / Needs Review / Struggling)
        ├── Interact with AI Learning Guide (Gemini AI Mentor or Guided Mode)
        │
[ 4. Challenges Explorer (`/challenges`) ]
        │
        └── Browse all domain-specific tracks (Frontend, Backend, VLSI, AI/Data, Embedded, etc.)
        │
[ 5. Student Profile (`/profile`) ]
        └── Review cumulative statistics, submitted proofs of work, and unlocked badges
```

---

## 1. Overview

**ABTalks** is an interactive 60-day learning and challenge platform designed to transform passive tech learners into consistent, practical builders. 

Students can participate in organizer-curated tracks (e.g. *Backend Engineering*) or leverage the **Challenge Yourself** engine to create custom 60-day journeys for **ANY technical domain or goal** — from *VLSI Design* and *Embedded Systems* to *React*, *Python*, *Cybersecurity*, or *AI/ML*.

Each journey provides a structured 60-day roadmap, daily practical tasks, reflection checkpoints, streak tracking, and proof-of-work submissions (GitHub & LinkedIn), backed by an AI Learning Guide powered by Google Gemini.

---

## 2. Problem

Many tech students and aspiring engineers struggle with:
- **Inconsistency**: Starting online courses or tutorials but losing momentum after a few days.
- **Passive Consumption**: Watching video playlists without writing real code or building tangible projects.
- **Rigid Curricula**: LMS platforms only offering fixed tracks, with no structured path for niche or custom technical fields (e.g., VLSI, Embedded Systems, IoT, Cloud Security).
- **Lack of Proof & Accountability**: Completing tasks without verifiable proof of work or reflection on long-term retention.

---

## 3. Solution

ABTalks solves these pain points through:
- **Daily Discipline Engine**: Bite-sized, actionable 60-day daily challenges that build consistency.
- **Dynamic "Challenge Yourself" Roadmaps**: AI & algorithmic generation of 60-day structured plans for any user-defined topic or goal.
- **Strict Journey & Progress Isolation**: Students can pursue multiple independent challenges simultaneously without progress cross-contamination.
- **Proof of Work & Reflection**: Integrated GitHub repository links, LinkedIn updates, and understanding self-assessments at milestones.
- **Resilient AI Mentor**: Contextual AI guidance powered by Google Gemini that degrades gracefully into Guided Mode if API quotas are reached.

---

## 4. Core Features

- **60-Day Structured Journeys**: Comprehensive 60-day roadmaps structured across 6 progression stages (Foundations, Core Concepts, Advanced Topics, System Architecture, Capstone Project, Interview Prep).
- **"Challenge Yourself" Custom Engine**: Enter any technical domain/goal to generate a tailored 60-day curriculum with daily objectives, practical tasks, and difficulty scaling.
- **Multi-Journey Management & Progress Isolation**: Switch seamlessly between active journeys while preserving independent completion rates, streaks, reflections, and proof of work.
- **Daily Challenge Experience**: Interactive task checklists, code/repo links, LinkedIn proof sharing, and reflection journals.
- **Reflection Checkpoints & Understanding Tracker**: Rate understanding (*Grasped*, *Needs Review*, *Struggling*) per day to monitor long-term retention separate from task completion.
- **Daily Streaks & Gamified Achievements**: Track current and longest streaks, unlock badges, and maintain continuous learning momentum.
- **AI Learning Mentor (Gemini)**: Context-aware AI mentor integrated via secure backend server routes for conceptual explanations, debugging tips, and guided learning.
- **Mobile-First Responsive Experience**: Fully optimized for touch devices and small screens down to 390px.

---

## 5. How ABTalks Works

1. **Onboarding & Track Selection**: Choose an organizer-curated track or define a custom technical goal in the "Challenge Yourself" modal.
2. **Roadmap Initialization**: Receive a dedicated 60-day curriculum with daily objectives, estimated duration, and practical tasks.
3. **Daily Action**: Access today's challenge, execute the hands-on task, and mark sub-tasks complete.
4. **Submit Proof & Reflect**: Attach GitHub links, post updates to LinkedIn, and complete reflection checkpoints with understanding ratings.
5. **Track Momentum**: Review current streak count, stage progression, and achievements on the unified Dashboard.

---

## 6. Personal "Challenge Yourself" Journeys

Unlike traditional LMS platforms restricted to predefined static video courses, ABTalks empowers students to master **any technical domain**:
- Enter any goal or domain (e.g., *"VLSI Design"*, *"Embedded Systems"*, *"Cybersecurity"*, *"RISC-V Architecture"*, *"Python Automation"*).
- The system constructs a unique 60-day roadmap with domain-relevant daily challenges.
- All progress, reflections, and proof submissions are isolated strictly to that custom challenge instance.

---

## 7. Multiple Journey / Progress Isolation

A student can pursue multiple concurrent learning paths (e.g., *Backend Engineering* alongside *VLSI Design*).
- **Isolated State**: `completedDays`, `currentDay`, `streak`, `dayProgress`, `reflections`, and `proofOfWork` are scoped to each unique `journeyId`.
- **Zero Cross-Contamination**: Completing Day 1 in one journey never alters completed status or streaks in another journey.
- **Instant Context Switching**: Selecting a journey in the Journey Selector immediately updates the Dashboard, Roadmap, and Daily Challenge views.

---

## 8. Category-Specific 60-Day Roadmaps

Every journey features a dedicated 60-day curriculum grouped into 6 logical stages:
- **Days 1–10**: Foundations & Core Mechanics
- **Days 11–20**: Intermediate Concepts & Design Patterns
- **Days 21–30**: Advanced Implementations & Frameworks
- **Days 31–45**: Production Workflows & Architecture
- **Days 46–55**: Capstone Project Construction
- **Days 56–60**: Showcase & Interview Preparation

Every stage contains domain-specific objectives, duration estimates, and practical deliverables.

---

## 9. Daily Challenges

Each daily challenge screen provides:
- **Concept Breakdown & Why It Matters**: Clear explanation of today's objective.
- **Interactive Checklist**: Actionable steps to complete the deliverable.
- **Code & Reference Resources**: Curated learning materials and code snippets.
- **AI Mentor Panel**: Direct access to the Gemini AI guide for contextual explanations and debugging support.

---

## 10. Proof of Work

To foster accountability and build a public portfolio:
- **GitHub Integration**: Add repository or commit URLs for the day's code.
- **LinkedIn Sharing**: One-click formatting for sharing daily progress and learnings with professional networks.
- **Proof History**: View all submitted deliverables directly on the Profile and Daily Challenge screens.

---

## 11. Reflection Checkpoints

At key milestones, students complete reflection checkpoints:
- **Journal Entry**: Summarize key takeaways and challenges faced.
- **Understanding Rating**: Tag understanding status as *Grasped*, *Needs Review*, or *Struggling*.
- **Separation of Concerns**: A task can be physically completed while marked as *Needs Review*, enabling target revision during milestone reviews.

---

## 12. Streaks and Achievements

- **Daily Streaks**: Calculated dynamically based on consecutive daily challenge completions.
- **Longest Streak Record**: Tracks historical best streak length.
- **Gamified Badges**: Unlock achievements for milestones (e.g., *First Step*, *7-Day Warrior*, *Halfway Hero*, *Milestone Master*).

---

## 13. AI Learning Guide

- **Context-Aware Assistance**: The AI Mentor knows the active journey, active day, challenge title, and student experience level.
- **Socratic Guidance**: Focuses on conceptual understanding and debugging strategies rather than dumping full answers.
- **Secure Server Proxy**: API calls are routed through Express backend endpoints (`/api/ai-mentor`), keeping API keys hidden from client browsers.

---

## 14. AI Fallback & Error Handling

- **429 / Quota Reached**: Displays a clear notification: *"AI guidance is temporarily unavailable because the AI service limit has been reached. You can continue your challenge without AI guidance."*
- **401 / 403 / Credentials**: Displays a service configuration notice without exposing sensitive keys or tokens.
- **500 / 503 / Network**: Automatically retries requests with exponential backoff before transitioning to Guided Mode.
- **Platform Independence**: All core platform features (roadmaps, daily checklists, progress tracking, proof submissions) remain 100% functional even if AI services are offline or rate-limited.

---

## 15. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Motion (`motion/react`), Lucide React
- **Backend / API**: Node.js, Express, `tsx`, `esbuild`
- **AI Integration**: Google Gen AI SDK (`@google/genai` - `gemini-3.6-flash`)
- **Persistence**: LocalStorage with modular state managers (`JourneyService`, `ProgressService`, `CustomChallengeService`)

---

## 16. Architecture Overview

```
[ Client Browser (React SPA) ]
        │
        ├── AuthContext / State Services (Journey, Progress, Custom Challenge)
        │       └── LocalStorage Data Persistence
        │
        └── Server API Routes (Express - server.ts)
                └── Google Gen AI SDK (@google/genai)
                        └── Gemini 3.6 Flash API
```

---

## 17. Project Structure

```
├── server.ts                       # Express backend server & Gemini API proxy
├── src/
│   ├── components/                 # UI components (Dashboard, DailyChallengeView, AIMentor, etc.)
│   ├── context/                    # AuthContext & global state management
│   ├── data/                       # Predefined curricula & fallback data
│   ├── services/                   # Journey, Progress, and Custom Challenge services
│   ├── types/                      # TypeScript definitions
│   ├── App.tsx                     # Main app router & view container
│   └── main.tsx                    # React application entry point
├── package.json                    # Dependencies & build scripts
├── .env.example                    # Environment variable template
└── README.md                       # Documentation
```

---

## 18. Local Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd abtalks-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

## 19. Environment Variables

Create `.env.local` in the project root based on `.env.example`:

```bash
cp .env.example .env.local
```

Define required variables:
```env
# Required for Gemini AI Mentor API calls
GEMINI_API_KEY=your_gemini_api_key_here

# Required for self-referential links and backend proxying
APP_URL=http://localhost:3000
```

---

## 20. Running the Application

To start the development server with Vite and Express middleware:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 21. Production Build

To test or execute a production build:

```bash
npm run build
npm start
```

This compiles client static assets to `dist/` and bundles `server.ts` to `dist/server.cjs` via `esbuild`.

---

## 22. Security Notes

- **Secrets Protection**: `GEMINI_API_KEY` is strictly accessed in server-side code (`server.ts`) and is never sent to the client browser.
- **Git Hygiene**: `.env.local`, `node_modules/`, and build artifacts are strictly ignored in `.gitignore`.
- **No Secret Leaks**: No API keys, credentials, or personal access tokens (PATs) are committed to source control.

---

## 23. Hackathon Route Map & Evaluation Flow

The primary application routes provided for hackathon evaluation:

- `/` — **Landing Page**: Platform overview, core feature showcase, and entry point.
- `/dashboard` — **Student Dashboard**: Active journey overview, current streak counter, stage progress, journey switcher, and "Challenge Yourself" modal trigger.
- `/day/12` (or `/day/1`) — **Daily Challenge Workspace**: Task checklist, resource guides, GitHub/LinkedIn proof of work submission, reflection checkpoints, and AI Mentor panel.
- `/challenges` — **Curated Roadmaps**: Category-specific 60-day roadmaps across software, hardware, and emerging tech domains.
- `/profile` — **Student Portfolio**: Overall stats, completed deliverables, reflection logs, and earned achievement badges.

