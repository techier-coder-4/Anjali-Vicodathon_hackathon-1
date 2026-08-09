import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  // Initialize Gemini AI client lazily or safely
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI client:', e);
    }
  }

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Mentor API
  app.post('/api/gemini/mentor', async (req: Request, res: Response) => {
    const {
      dayId,
      prompt,
      userLevel,
      challengeTitle,
      challengeType,
      learningObjective,
      whyItMatters,
      requirements,
      curiosityPrompt,
      stageName
    } = req.body;

    const reqList: string[] = Array.isArray(requirements) ? requirements : [];

    // Construct static Guided Mode fallback structure for quota resilience
    const guidedModeFallback = {
      whyItMatters: whyItMatters || "This concept forms a core building block for technical proficiency.",
      whatYoullLearn: learningObjective || "Mastering the underlying mechanics and execution flow.",
      startHere: `Break down Day ${dayId}: ${challengeTitle || 'Today\'s Task'} into small steps. Start by setting up the structure first.`,
      thinkAboutThis: curiosityPrompt || "What happens if you remove one assumption from your implementation?",
      nextStep: reqList[0] || "Review the first requirement in your checklist and attempt a minimal prototype.",
      requirementsChecklist: reqList
    };

    // If Gemini client isn't available, return ABTalks Guided Mode immediately
    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        text: `💡 **ABTalks Guided Mode**\n\nAI Mentor is temporarily operating in Guided Mode. Here is your structured roadmap for today's challenge:\n\n` +
              `**Why it matters:** ${guidedModeFallback.whyItMatters}\n\n` +
              `**What you'll learn:** ${guidedModeFallback.whatYoullLearn}\n\n` +
              `**Start here:** ${guidedModeFallback.startHere}\n\n` +
              `**Think about this:** *"${guidedModeFallback.thinkAboutThis}"*\n\n` +
              `**Next Step:** ${guidedModeFallback.nextStep}`,
        guidedMode: guidedModeFallback
      });
    }

    try {
      const systemInstruction = `You are the official ABTalks AI Learning Mentor for the 60-Day Technical Consistency Platform.

CONTEXT & GROUNDING:
- Current Challenge: Day ${dayId} - "${challengeTitle}" (${stageName || 'Challenge Stage'})
- Challenge Type: ${challengeType || 'build'} | Difficulty Level: ${userLevel || 'intermediate'}
- Learning Objective: ${learningObjective || ''}
- Why It Matters: ${whyItMatters || ''}
- Curiosity Prompt: "${curiosityPrompt || ''}"
- Requirements:
${reqList.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}

PEDAGOGICAL RULES (CRITICAL):
1. PHILOSOPHY: Follow "UNDERSTAND → THINK → ATTEMPT → GET FEEDBACK → IMPROVE".
2. NO DIRECT SOLUTION DUMP: Do NOT dump complete working code solutions immediately if the student asks for "give me the answer" or "solve it for me". Instead, offer progressive hints, explain concepts simply, and guide them to write the code themselves.
3. ADAPT TO STUDENT LEVEL (${userLevel || 'beginner'}):
   - Beginner: Provide step-by-step plain explanations and conceptual mental models.
   - Intermediate: Emphasize reasoning, architectural patterns, and debugging steps.
   - Advanced: Focus on engineering tradeoffs, performance implications, and edge cases.
4. OFF-TOPIC CONTROL: If the student asks about something totally unrelated to Day ${dayId} (${challengeTitle}) or general software development (e.g. pop culture, sports, unrelated trivia), politely redirect:
   "That's outside today's ABTalks challenge. Let's keep today's focus on Day ${dayId}: ${challengeTitle}!"
5. TONE: Warm, encouraging, concise, highly structured, professional engineering mentor. Never shame or talk down to the student. Use markdown formatting with clear headings or bullet points where helpful.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
          topP: 0.95
        }
      });

      const responseText = response.text || "I'm ready to guide you on today's challenge! What specific part can we look at together?";

      return res.json({
        success: true,
        isFallback: false,
        text: responseText
      });
    } catch (err: any) {
      console.error('Gemini API Error (fallback triggered):', err?.message || err);

      return res.json({
        success: true,
        isFallback: true,
        text: `💡 **ABTalks Guided Mode**\n\nAI Mentor is temporarily in Guided Mode. Here is your structured roadmap for Day ${dayId} (${challengeTitle}):\n\n` +
              `**Why it matters:** ${guidedModeFallback.whyItMatters}\n\n` +
              `**What you'll learn:** ${guidedModeFallback.whatYoullLearn}\n\n` +
              `**Start Here:** ${guidedModeFallback.startHere}\n\n` +
              `**Think About This:** *"${guidedModeFallback.thinkAboutThis}"*\n\n` +
              `**Next Action:** Check off requirement #1: "${guidedModeFallback.nextStep}"`,
        guidedMode: guidedModeFallback
      });
    }
  });

  // AI "Why Learn This?" Video Script Generation API
  app.post('/api/gemini/video-script', async (req: Request, res: Response) => {
    const {
      trackId,
      dayId,
      challengeTitle,
      learningObjective,
      whyItMatters,
      requirements,
      curiosityPrompt,
      description
    } = req.body;

    const reqList: string[] = Array.isArray(requirements) ? requirements : [];

    // Fallback script if AI is missing or fails
    const fallbackScript = {
      trackId: trackId || 'fullstack',
      dayId: dayId || 1,
      challengeTitle: challengeTitle || 'Today\'s Challenge',
      durationSeconds: 65,
      sections: [
        {
          type: 'intro',
          title: 'Real-World Hook',
          narration: `Ever wondered how modern applications handle data and UI seamlessly for millions of users?`,
          visualHook: `🎬 Visualizing user interaction flow for ${challengeTitle || 'today\'s challenge'}`,
          durationSeconds: 8
        },
        {
          type: 'what',
          title: 'What Is It?',
          narration: `Today's concept is "${challengeTitle}". In simple words, it is about ${learningObjective || 'building reliable software components'}.`,
          visualHook: `💡 Architecture Diagram: ${challengeTitle}`,
          durationSeconds: 12,
          jargonTerms: [
            { term: 'Core Mechanic', simpleMeaning: 'the essential rule that makes this feature work' }
          ]
        },
        {
          type: 'why_matters',
          title: 'Why Does It Matter?',
          narration: `${whyItMatters || 'This concept ensures your applications remain fast, structured, and easy to maintain.'}`,
          visualHook: `⚡ Engineering Problem Solved`,
          durationSeconds: 10
        },
        {
          type: 'where_used',
          title: 'Where Is It Used?',
          narration: `Apps like Spotify, Instagram, Zomato, and Razorpay rely on this exact engineering pattern every day.`,
          visualHook: `🌐 Production Apps in Action`,
          durationSeconds: 10
        },
        {
          type: 'student_benefits',
          title: 'Why Should You Learn It?',
          narration: `Understanding this boosts your confidence in coding interviews and lets you build real portfolio projects.`,
          visualHook: `🎯 Career Impact & Portfolio Proof`,
          durationSeconds: 10
        },
        {
          type: 'today_mission',
          title: "Today's Mission",
          narration: `Today you will build: ${description || 'a hands-on working prototype for your portfolio'}.`,
          visualHook: `🛠️ Today's Project Blueprint`,
          durationSeconds: 10
        },
        {
          type: 'motivation',
          title: "Let's Build It!",
          narration: `Now you know why this matters. Let's get hands-on and build it!`,
          visualHook: `🚀 Ready to Start Challenge`,
          durationSeconds: 5
        }
      ],
      transcript: `Ever wondered how modern applications work seamlessly? Today's concept is "${challengeTitle}". In simple words: ${learningObjective}. ${whyItMatters}. Real-world apps use this every day. Mastering this boosts your engineering confidence. Today's mission: ${description}. Now you know why this matters—let's build it!`,
      cinematicHook: `Ever wondered how modern applications handle data and UI seamlessly for millions of users?`,
      cinematicEnding: `Now you know why this matters in production. Your challenge today is to build it yourself. Let's see what you can do!`,
      fallbackExplanation: `${whyItMatters} Today's hands-on project gives you real portfolio proof!`,
      realWorldUses: ['Spotify', 'Instagram', 'Razorpay', 'Swiggy'],
      studentBenefits: ['Builds real production-ready software', 'Frequently asked in tech interviews', 'Enhances GitHub portfolio'],
      todayMissionSummary: description || 'Complete today\'s hands-on project.'
    };

    if (!ai) {
      return res.json({ success: true, isFallback: true, script: fallbackScript });
    }

    try {
      const prompt = `Generate a 45-75 second CINEMATIC ANIMATED SHORT FILM SCRIPT for a student learning software engineering.

CRITICAL RULES FOR NARRATIVE STORYTELLING:
1. ZERO SLIDE LECTURE: Do NOT mention slide numbers, section headers, or "Today we will learn".
2. STORY FIRST: Start with a real, relatable situation ("Imagine working late at night...").
3. NARRATIVE ARC:
   - Act 1: Situation & Curiosity Hook
   - Act 2: Real Problem (something breaks, fails, or gets blocked)
   - Act 3: Consequence & Frustration
   - Act 4: Discovery (today's concept unlocks the solution)
   - Act 5: Real World Scale (how tech giants use this pattern)
   - Act 6: Payoff & Action ("Now that you understand why this matters... it's your turn.")
4. CONTINUOUS VOICE: The narration MUST read like ONE smooth, uninterrupted storytelling track.

GROUNDING DATA:
- Track: ${trackId || 'fullstack'}
- Day: ${dayId || 1}
- Challenge Title: ${challengeTitle}
- Objective: ${learningObjective}
- Why It Matters: ${whyItMatters}
- Curiosity Prompt: "${curiosityPrompt || ''}"
- Description: ${description}
- Requirements: ${reqList.join(', ')}

Return valid JSON:
{
  "durationSeconds": 60,
  "cinematicHook": "Imagine working late on a project that works on your machine, but breaks the moment anyone else tries to run it...",
  "cinematicEnding": "Now that you understand why this matters in production... it's your turn. Let's see what you can build today!",
  "sections": [
    {
      "type": "intro" | "what" | "why_matters" | "where_used" | "today_mission" | "motivation",
      "title": "Short internal scene tag",
      "narration": "Conversational mentor storytelling sentence",
      "visualHook": "Cinematic visual scene description",
      "durationSeconds": 10,
      "jargonTerms": [ { "term": "API", "simpleMeaning": "a way for two apps to communicate" } ],
      "choreography": {
        "theme": "network" | "frontend" | "security" | "database" | "ai" | "cloud" | "code",
        "cameraZoom": 1.2,
        "statusState": "normal" | "problem" | "breakthrough" | "solution" | "success",
        "environmentGlow": "#6366f1",
        "emphasisWords": ["request", "blocked", "speed"]
      }
    }
  ],
  "transcript": "Full combined narration story transcript",
  "fallbackExplanation": "1-2 sentence quick summary explanation",
  "realWorldUses": ["Spotify", "Instagram", "Razorpay"],
  "studentBenefits": ["Benefit 1", "Benefit 2"],
  "todayMissionSummary": "Summary of today's project"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.sections && Array.isArray(parsed.sections) && parsed.sections.length > 0) {
        return res.json({
          success: true,
          isFallback: false,
          script: {
            trackId,
            dayId,
            challengeTitle,
            durationSeconds: parsed.durationSeconds || 60,
            cinematicHook: parsed.cinematicHook || fallbackScript.cinematicHook,
            cinematicEnding: parsed.cinematicEnding || fallbackScript.cinematicEnding,
            sections: parsed.sections,
            transcript: parsed.transcript || fallbackScript.transcript,
            fallbackExplanation: parsed.fallbackExplanation || fallbackScript.fallbackExplanation,
            realWorldUses: parsed.realWorldUses || fallbackScript.realWorldUses,
            studentBenefits: parsed.studentBenefits || fallbackScript.studentBenefits,
            todayMissionSummary: parsed.todayMissionSummary || fallbackScript.todayMissionSummary
          }
        });
      }

      return res.json({ success: true, isFallback: true, script: fallbackScript });
    } catch (err: any) {
      console.error('Gemini Video Script Error:', err?.message || err);
      return res.json({ success: true, isFallback: true, script: fallbackScript });
    }
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ABTalks Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
