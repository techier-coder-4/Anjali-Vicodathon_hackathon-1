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

      // Quota / Rate limit or API error fallback to ABTalks Guided Mode
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
