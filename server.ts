import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

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
4. OFF-TOPIC CONTROL: If the student asks about something totally unrelated to Day ${dayId} (${challengeTitle}) or general software development (e.g. pop culture, sports, unrelated trivia), politely redirect:
   "That's outside today's ABTalks challenge. Let's keep today's focus on Day ${dayId}: ${challengeTitle}!"
5. TONE: Warm, encouraging, concise, highly structured, professional engineering mentor. Never shame or talk down to the student. Use markdown formatting with clear headings or bullet points where helpful.`;

      let responseText = '';
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          attempts++;
          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
              systemInstruction,
              temperature: 0.7,
              topP: 0.95
            }
          });
          responseText = response.text || '';
          if (responseText) break;
        } catch (callErr: any) {
          if (attempts >= maxAttempts) throw callErr;
          await new Promise(res => setTimeout(res, attempts * 600));
        }
      }

      const finalText = responseText || "I'm ready to guide you on today's challenge! What specific part can we look at together?";

      return res.json({
        success: true,
        isFallback: false,
        text: finalText
      });
    } catch (err: any) {
      const errStr = (err?.message || String(err)).toLowerCase();
      const errCode = err?.status || err?.statusCode || 0;

      let statusMsg = "AI guidance is temporarily unavailable. You can continue your challenge without AI guidance.";

      if (errCode === 429 || errStr.includes('429') || errStr.includes('quota') || errStr.includes('resource_exhausted') || errStr.includes('rate limit')) {
        statusMsg = "AI guidance is temporarily unavailable because the AI service limit has been reached. You can continue your challenge without AI guidance.";
      } else if (errCode === 401 || errCode === 403 || errStr.includes('401') || errStr.includes('403') || errStr.includes('api_key') || errStr.includes('permission')) {
        statusMsg = "AI guidance is currently unavailable due to service configuration. You can continue your challenge without AI guidance.";
      } else if (errCode === 500 || errCode === 503 || errStr.includes('500') || errStr.includes('503') || errStr.includes('unavailable') || errStr.includes('network')) {
        statusMsg = "AI guidance is temporarily unavailable due to service interruption. You can continue your challenge without AI guidance.";
      }

      console.warn('Gemini API notice (guided mode fallback activated):', errStr);

      return res.json({
        success: true,
        isFallback: true,
        text: `⚠️ **${statusMsg}**\n\n💡 **ABTalks Guided Mode:**\n\n` +
              `**Why it matters:** ${guidedModeFallback.whyItMatters}\n\n` +
              `**What you'll learn:** ${guidedModeFallback.whatYoullLearn}\n\n` +
              `**Start Here:** ${guidedModeFallback.startHere}\n\n` +
              `**Think About This:** *"${guidedModeFallback.thinkAboutThis}"*\n\n` +
              `**Next Action:** Check off requirement #1: "${guidedModeFallback.nextStep}"`,
        guidedMode: guidedModeFallback
      });
    }
  });

  // AI Roadmap Generation API
  app.post('/api/gemini/generate-roadmap', async (req: Request, res: Response) => {
    const { goalTitle, category, experienceLevel, dailyTimeGoal, finalOutcome } = req.body;

    if (!ai) {
      return res.json({
        success: false,
        message: 'Gemini AI API key not configured. Using starter roadmap fallback.'
      });
    }

    try {
      const prompt = `Generate a structured, beginner-friendly 60-day technical learning and building roadmap for a student.

STUDENT PROFILE:
- Goal: "${goalTitle || category || 'Custom Goal'}"
- Track Category: ${category || 'Software Development'}
- Current Skill Level: ${experienceLevel || 'beginner'}
- Daily Time Commitment: ${dailyTimeGoal || '30-45 minutes'}
- Final Desired Outcome: "${finalOutcome || 'Build real-world projects and become confident'}"

REQUIREMENTS:
1. Return a JSON array containing exactly 60 day objects (Day 1 through Day 60).
2. Format MUST be strictly JSON (no markdown formatting outside the json block, pure JSON array or object with key "roadmap").
3. Each day object must contain:
   - dayId: number (1 to 60)
   - title: string (short, engaging, action-oriented title)
   - whyItMatters: string (plain English explanation of why this concept/skill matters)
   - whatToLearn: string (core concept to read/understand)
   - whatToBuild: string (practical mini-project or code exercise to build today)
   - expectedOutcome: string (clear tangible outcome after finishing today)
   - estimatedMinutes: number (e.g. 20, 30, 45, 60)
   - skills: string[] (1-3 relevant skills/keywords)
   - curiosityPrompt: string (a thought-provoking question for reflection)

Maintain a progressive curriculum structure:
- Days 1-10: Fundamentals & Core Mechanics
- Days 11-25: Practical Building & Component Design
- Days 26-35: Experimentation & Debugging
- Days 36-45: Real-World Architecture & Integrations
- Days 46-55: Capstone Project Construction
- Days 56-60: Showcase & Interview Preparation`;

      let responseText = '';
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          attempts++;
          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.7
            }
          });
          responseText = response.text || '';
          if (responseText) break;
        } catch (callErr: any) {
          if (attempts >= maxAttempts) throw callErr;
          await new Promise(res => setTimeout(res, attempts * 600));
        }
      }

      const parsedData = JSON.parse(responseText);
      const roadmapArray = Array.isArray(parsedData) ? parsedData : (parsedData.roadmap || parsedData.days || []);

      if (roadmapArray && roadmapArray.length > 0) {
        return res.json({
          success: true,
          roadmap: roadmapArray
        });
      }

      return res.json({
        success: false,
        message: 'Could not parse structured roadmap JSON.'
      });
    } catch (err: any) {
      console.warn('AI roadmap generation notice (starter template fallback activated):', err?.message || 'High demand');
      return res.json({
        success: false,
        message: 'AI generation error. Falling back to local template.'
      });
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
