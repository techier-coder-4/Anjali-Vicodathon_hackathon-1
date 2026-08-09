import { LearningVideoScript, Challenge, TrackType } from '../types';

/**
 * Pre-built grounded motivational scripts for key track challenges.
 * Used as instant fallbacks if AI API is unavailable, offline, or quota-limited.
 */

export function generateFallbackVideoScript(challenge: Challenge): LearningVideoScript {
  const title = challenge.title;
  const track = challenge.trackId;
  const day = challenge.dayId;

  // Real world example mapper based on track
  const realWorldExamplesMap: Record<TrackType, string[]> = {
    frontend: ['Spotify Web Player', 'Instagram Web Feed', 'Swiggy Food Ordering'],
    backend: ['Payment Gateways (Razorpay/Stripe)', 'Uber Driver Dispatch System', 'WhatsApp Real-Time Messaging'],
    fullstack: ['Netflix Video Streaming Portal', 'Airbnb Property Booking Engine', 'GitHub Pull Request Dashboard'],
    python: ['Data Automation Scripts', 'Machine Learning Models', 'Backend Web Services'],
    'data-ai': ['ChatGPT Recommendation Engine', 'Zomato Demand Forecasting', 'Financial Fraud Detection'],
    java: ['Banking Transaction Microservices', 'Android Enterprise Apps', 'High-Frequency Trading Engines'],
    cybersecurity: ['Cloudflare DDoS Protection', 'Google OAuth Security Shield', 'Corporate Vulnerability Scanners']
  };

  const realWorld = realWorldExamplesMap[track] || ['Google Search', 'YouTube Streaming', 'Mobile Banking Apps'];

  return {
    trackId: track,
    dayId: day,
    challengeTitle: title,
    durationSeconds: 65,
    sections: [
      {
        type: 'intro',
        title: 'Real-World Hook',
        narration: `Ever wondered how apps like ${realWorld[0]} and ${realWorld[1]} handle millions of users every single second without crashing?`,
        visualHook: `🎬 Visualizing ${realWorld[0]} interacting with millions of daily users`,
        durationSeconds: 8
      },
      {
        type: 'what',
        title: 'What Is It?',
        narration: `Today's concept is "${title}". In simple words, it's about ${challenge.learningObjective.toLowerCase()}`,
        visualHook: `💡 Simplified Diagram: How ${title} connects to modern applications`,
        durationSeconds: 12,
        jargonTerms: challenge.skills.slice(0, 2).map(s => ({
          term: s,
          simpleMeaning: `a core software building block used to build reliable applications`
        }))
      },
      {
        type: 'why_matters',
        title: 'Why Does It Matter?',
        narration: `${challenge.whyItMatters} Without this, applications become slow, confusing, and prone to breaking when unexpected data arrives.`,
        visualHook: `⚡ Engineering Impact: Before vs After using ${title}`,
        durationSeconds: 10
      },
      {
        type: 'where_used',
        title: 'Where Is It Used?',
        narration: `You see this in action every day: ${realWorld.join(', ')} all rely on this exact pattern to keep their systems smooth and responsive.`,
        visualHook: `🌐 Real-World Examples: ${realWorld[0]} & ${realWorld[1]} logo interactions`,
        durationSeconds: 10
      },
      {
        type: 'student_benefits',
        title: 'Why Should You Learn It?',
        narration: `Mastering this gives you a huge advantage! It is frequently tested in technical interview rounds and gives you the exact skills needed to build production-grade projects.`,
        visualHook: `🎯 Career Boost: Portfolio highlight & Technical interview readiness`,
        durationSeconds: 10
      },
      {
        type: 'today_mission',
        title: "Today's Mission",
        narration: `Today, your goal is to build: ${challenge.description}`,
        visualHook: `🛠️ Today's Project Blueprint: ${challenge.title}`,
        durationSeconds: 10
      },
      {
        type: 'motivation',
        title: "Let's Build It!",
        narration: `Now you know why this matters so much in the real world. You've got this! Let's get hands-on and build it now.`,
        visualHook: `🚀 Launch Pad: Ready to code today's challenge!`,
        durationSeconds: 5
      }
    ],
    transcript: `Ever wondered how apps like ${realWorld[0]} and ${realWorld[1]} handle millions of users every single second? Today's concept is "${title}". In simple words: ${challenge.learningObjective}. ${challenge.whyItMatters}. Real-world applications like ${realWorld.join(', ')} use this every day. Mastering this boosts your engineering confidence and portfolio. Today, you'll build: ${challenge.description}. Now you know why this matters—let's build it!`,
    fallbackExplanation: `Why Learn "${title}"? ${challenge.whyItMatters} In production, apps like ${realWorld.join(', ')} rely on this concept to ensure reliability and performance. Today's hands-on project gives you real portfolio proof!`,
    realWorldUses: realWorld,
    studentBenefits: [
      'Helps build real production-ready web applications',
      'Frequently asked in technical rounds at top product companies',
      'Improves problem-solving ability and code architecture',
      'Provides verifiable proof of work for your GitHub portfolio'
    ],
    todayMissionSummary: challenge.description
  };
}
