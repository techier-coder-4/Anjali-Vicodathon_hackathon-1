import { CustomChallenge, CustomChallengeRoadmapDay, Challenge, ExperienceLevel, TrackType } from '../types';
import { getRoadmapForTrack } from '../data/curriculum';

export interface CreateChallengeInput {
  goalTitle: string;
  category: string;
  experienceLevel: ExperienceLevel;
  dailyTimeGoal: string;
  finalOutcome: string;
}

export class CustomChallengeService {
  private static getStorageKey(userId: string): string {
    return `abtalks_custom_challenge_${userId}`;
  }

  static getCustomChallenge(userId: string): CustomChallenge | null {
    if (!userId) return null;
    try {
      const data = localStorage.getItem(this.getStorageKey(userId));
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static saveCustomChallenge(challenge: CustomChallenge): void {
    if (!challenge || !challenge.userId) return;
    try {
      localStorage.setItem(this.getStorageKey(challenge.userId), JSON.stringify(challenge));
    } catch (e) {
      console.error('Failed to save custom challenge:', e);
    }
  }

  static deleteCustomChallenge(userId: string): void {
    if (!userId) return;
    try {
      localStorage.removeItem(this.getStorageKey(userId));
    } catch (e) {
      console.error('Failed to delete custom challenge:', e);
    }
  }

  static async createCustomChallenge(
    userId: string,
    input: CreateChallengeInput
  ): Promise<{ challenge: CustomChallenge; isFallback: boolean }> {
    let roadmapDays: CustomChallengeRoadmapDay[] = [];
    let isFallback = false;

    // Try calling backend AI API
    try {
      const response = await fetch('/api/gemini/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalTitle: input.goalTitle,
          category: input.category,
          experienceLevel: input.experienceLevel,
          dailyTimeGoal: input.dailyTimeGoal,
          finalOutcome: input.finalOutcome
        })
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && Array.isArray(json.roadmap) && json.roadmap.length > 0) {
          roadmapDays = json.roadmap.map((day: any, idx: number) => ({
            dayId: idx + 1,
            title: day.title || `Day ${idx + 1}: ${input.goalTitle}`,
            whyItMatters: day.whyItMatters || 'Building solid core engineering mechanics and habits.',
            whatToLearn: day.whatToLearn || 'Core concepts, patterns, and principles.',
            whatToBuild: day.whatToBuild || 'Implement a minimal working prototype.',
            expectedOutcome: day.expectedOutcome || 'Clear understanding and verified working output.',
            estimatedMinutes: day.estimatedMinutes || (input.dailyTimeGoal.includes('20') ? 20 : input.dailyTimeGoal.includes('60') ? 60 : 30),
            curiosityPrompt: day.curiosityPrompt || 'How does this concept connect to real production systems?',
            skills: Array.isArray(day.skills) ? day.skills : [input.category || 'Engineering']
          }));
        } else {
          isFallback = true;
        }
      } else {
        isFallback = true;
      }
    } catch (e) {
      console.warn('AI generation unreachable. Falling back to starter template:', e);
      isFallback = true;
    }

    // Fallback template generator if AI was unavailable or failed
    if (isFallback || roadmapDays.length === 0) {
      roadmapDays = this.generateFallbackRoadmap(input);
    }

    const newChallenge: CustomChallenge = {
      id: `custom_${Date.now()}`,
      userId,
      goalTitle: input.goalTitle || input.category || 'My 60-Day Technical Mastery',
      category: input.category,
      experienceLevel: input.experienceLevel,
      dailyTimeGoal: input.dailyTimeGoal,
      finalOutcome: input.finalOutcome,
      roadmap: roadmapDays,
      createdAt: new Date().toISOString(),
      activeDay: 1
    };

    this.saveCustomChallenge(newChallenge);
    return { challenge: newChallenge, isFallback };
  }

  // Fallback 60-day roadmap generator using domain-specific modules
  private static generateFallbackRoadmap(input: CreateChallengeInput): CustomChallengeRoadmapDay[] {
    const textToMatch = `${input.goalTitle} ${input.category}`.toLowerCase();

    // 1. VLSI / ASIC / Verilog / Hardware / FPGA
    if (textToMatch.includes('vlsi') || textToMatch.includes('hardware') || textToMatch.includes('verilog') || textToMatch.includes('asic') || textToMatch.includes('fpga') || textToMatch.includes('rtl')) {
      return this.generateVLSIRoadmap(input);
    }

    // 2. Embedded Systems / Microcontrollers / STM32 / Arduino / C++
    if (textToMatch.includes('embedded') || textToMatch.includes('stm32') || textToMatch.includes('microcontroller') || textToMatch.includes('arduino') || textToMatch.includes('iot')) {
      return this.generateEmbeddedRoadmap(input);
    }

    // 3. React / Frontend / Web Development
    if (textToMatch.includes('frontend') || textToMatch.includes('react') || textToMatch.includes('web') || textToMatch.includes('html') || textToMatch.includes('css')) {
      return this.mapCurriculumToRoadmap('frontend', input);
    }

    // 4. Backend / Node / Express / REST
    if (textToMatch.includes('backend') || textToMatch.includes('express') || textToMatch.includes('node') || textToMatch.includes('api')) {
      return this.mapCurriculumToRoadmap('backend', input);
    }

    // 5. Python / Automation / Scraping
    if (textToMatch.includes('python') || textToMatch.includes('automation') || textToMatch.includes('scraping')) {
      return this.mapCurriculumToRoadmap('python', input);
    }

    // 6. Data & AI / Machine Learning
    if (textToMatch.includes('data') || textToMatch.includes('ai') || textToMatch.includes('machine learning') || textToMatch.includes('ml')) {
      return this.mapCurriculumToRoadmap('data-ai', input);
    }

    // 7. Cybersecurity / Security
    if (textToMatch.includes('cyber') || textToMatch.includes('security') || textToMatch.includes('hacking') || textToMatch.includes('network')) {
      return this.mapCurriculumToRoadmap('cybersecurity', input);
    }

    // 8. Java / Spring Boot
    if (textToMatch.includes('java') || textToMatch.includes('spring')) {
      return this.mapCurriculumToRoadmap('java', input);
    }

    // 9. Generic Custom Topic Interpolation Generator
    return this.generateGenericCustomRoadmap(input);
  }

  private static mapCurriculumToRoadmap(trackKey: TrackType, input: CreateChallengeInput): CustomChallengeRoadmapDay[] {
    const baseRoadmap = getRoadmapForTrack(trackKey);
    return baseRoadmap.map((ch) => ({
      dayId: ch.dayId,
      title: `${ch.title}`,
      whyItMatters: ch.whyItMatters || `Essential step towards achieving your goal: "${input.goalTitle}".`,
      whatToLearn: ch.description || ch.learningObjective,
      whatToBuild: ch.requirements ? ch.requirements.join(' • ') : 'Complete today\'s practical assignment and test your output.',
      expectedOutcome: `Successfully build and verify Day ${ch.dayId} deliverable for ${input.goalTitle}.`,
      estimatedMinutes: ch.estimatedMinutes || 30,
      curiosityPrompt: ch.curiosityPrompt || 'How would you explain this concept to another engineer?',
      skills: ch.skills || [input.category]
    }));
  }

  private static generateVLSIRoadmap(input: CreateChallengeInput): CustomChallengeRoadmapDay[] {
    const topic = input.goalTitle || 'VLSI Design Mastery';
    return Array.from({ length: 60 }, (_, i) => {
      const day = i + 1;
      if (day <= 10) {
        return {
          dayId: day,
          title: `Day ${day}: Semiconductor & Digital Logic Foundations — Part ${day}`,
          whyItMatters: 'Digital IC design relies heavily on understanding CMOS transistors, Boolean algebra, and timing gates.',
          whatToLearn: `Learn CMOS transistor operation, pull-up/pull-down networks, and logic gate propagation delays.`,
          whatToBuild: `Model logic gates (NAND, NOR, XOR) and verify truth tables using Boolean reduction.`,
          expectedOutcome: `Verified functional model of basic digital logic gates.`,
          estimatedMinutes: 30,
          curiosityPrompt: `Why do CMOS inverters consume minimal static power compared to dynamic switching power?`,
          skills: ['VLSI', 'Digital Logic', 'CMOS']
        };
      } else if (day <= 25) {
        return {
          dayId: day,
          title: `Day ${day}: Verilog HDL & Combinational Circuit Design — Part ${day - 10}`,
          whyItMatters: 'Verilog is the industry-standard Hardware Description Language for modeling ASIC/FPGA RTL design.',
          whatToLearn: `Verilog syntax, always blocks, assign statements, multiplexers, ALUs, and encoders.`,
          whatToBuild: `Write a modular ${day % 2 === 0 ? '4-bit ALU' : 'Priority Encoder'} in Verilog HDL.`,
          expectedOutcome: `Working Verilog RTL module ready for simulation.`,
          estimatedMinutes: 45,
          curiosityPrompt: `What is the difference between blocking (=) and non-blocking (<=) assignments in Verilog?`,
          skills: ['Verilog HDL', 'RTL Design', 'Combinational Logic']
        };
      } else if (day <= 35) {
        return {
          dayId: day,
          title: `Day ${day}: Sequential Circuits & Finite State Machines (FSM) — Part ${day - 25}`,
          whyItMatters: 'Registers, Flip-Flops, and FSMs form the brain of microprocessors and memory controllers.',
          whatToLearn: `Mealy vs. Moore state machines, state encoding, setup and hold time constraints.`,
          whatToBuild: `Design a 3-process ${day % 2 === 0 ? 'Traffic Light Controller FSM' : 'Sequence Detector FSM'} in Verilog.`,
          expectedOutcome: `Simulated FSM state transitions verified with clean state diagrams.`,
          estimatedMinutes: 45,
          curiosityPrompt: `How do setup and hold violations lead to metastability in digital circuits?`,
          skills: ['Verilog HDL', 'FSM', 'Sequential Logic']
        };
      } else if (day <= 45) {
        return {
          dayId: day,
          title: `Day ${day}: Simulation, Testbenches & STA Timing Analysis — Part ${day - 35}`,
          whyItMatters: 'RTL verification ensures chip functionality before expensive tape-out manufacturing.',
          whatToLearn: `Self-checking testbenches, clock generation, Static Timing Analysis (STA), critical path detection.`,
          whatToBuild: `Write a testbench with automated assertions and run simulation using Icarus Verilog / GTKWave.`,
          expectedOutcome: `Waveform output confirming zero timing or logic defects.`,
          estimatedMinutes: 45,
          curiosityPrompt: `How does clock domain crossing (CDC) cause race conditions in multi-clock systems?`,
          skills: ['Simulation', 'Testbench', 'Static Timing Analysis']
        };
      } else if (day <= 55) {
        return {
          dayId: day,
          title: `Day ${day}: Capstone: Pipelined RISC-V CPU Core Design — Day ${day - 45}`,
          whyItMatters: 'Building a RISC-V pipeline synthesizes all digital design, architecture, and verification concepts.',
          whatToLearn: `Fetch, Decode, Execute, Memory, and Writeback pipeline stages, hazard detection, and forwarding.`,
          whatToBuild: `Implement pipeline stage ${((day - 46) % 5) + 1} and wire register file ALU datapaths.`,
          expectedOutcome: `Executing instructions on functional pipelined CPU core architecture.`,
          estimatedMinutes: 60,
          curiosityPrompt: `How do branch predictors mitigate control hazards in deeply pipelined processors?`,
          skills: ['RISC-V Architecture', 'Pipeline Design', 'ASIC Synthesis']
        };
      } else {
        return {
          dayId: day,
          title: `Day ${day}: ASIC Synthesis, PPA Optimization & Tape-Out Prep — Day ${day - 55}`,
          whyItMatters: 'Final stage: Optimizing Power, Performance, and Area (PPA) for physical chip fabrication.',
          whatToLearn: `Gate-level netlists, cell library mapping, layout constraints, and interview problem solving.`,
          whatToBuild: `Generate synthesis PPA reports and prepare portfolio documentation for ${topic}.`,
          expectedOutcome: `Completed portfolio-ready VLSI digital design showcase.`,
          estimatedMinutes: 45,
          curiosityPrompt: `How do multi-threshold CMOS (MTCMOS) techniques reduce leakage current?`,
          skills: ['Synthesis', 'PPA Optimization', 'Hardware Tape-Out']
        };
      }
    });
  }

  private static generateEmbeddedRoadmap(input: CreateChallengeInput): CustomChallengeRoadmapDay[] {
    const topic = input.goalTitle || 'Embedded Systems Mastery';
    return Array.from({ length: 60 }, (_, i) => {
      const day = i + 1;
      return {
        dayId: day,
        title: `Day ${day}: Embedded ${day <= 10 ? 'C/C++ Fundamentals' : day <= 25 ? 'Peripherals & Drivers' : day <= 35 ? 'Protocols (UART/I2C/SPI)' : day <= 45 ? 'FreeRTOS & Memory' : day <= 55 ? 'Capstone Firmware' : 'Optimization & Showcase'} — Part ${day}`,
        whyItMatters: `Bare-metal programming controls physical hardware sensors, actuators, and real-time systems.`,
        whatToLearn: `Master embedded systems concept #${day} for ${topic}.`,
        whatToBuild: `Implement and verify functional firmware code module for Day ${day}.`,
        expectedOutcome: `Working hardware driver / firmware simulation compiled with zero warnings.`,
        estimatedMinutes: 30,
        curiosityPrompt: `How does memory-mapped I/O allow C pointers to directly manipulate microcontroller registers?`,
        skills: ['Embedded C', 'Microcontrollers', 'Firmware']
      };
    });
  }

  private static generateGenericCustomRoadmap(input: CreateChallengeInput): CustomChallengeRoadmapDay[] {
    const topic = input.goalTitle || input.category || 'Custom Technical Challenge';
    return Array.from({ length: 60 }, (_, i) => {
      const day = i + 1;
      const stageName = day <= 10 ? 'Foundations' : day <= 25 ? 'Core Skill Building' : day <= 35 ? 'Hands-on Projects' : day <= 45 ? 'Advanced Systems' : day <= 55 ? 'Capstone Development' : 'Mastery & Showcase';
      return {
        dayId: day,
        title: `Day ${day}: ${stageName} in ${topic} — Module ${day}`,
        whyItMatters: `Day ${day} is a crucial milestone towards mastering "${topic}".`,
        whatToLearn: `Understand essential principles, patterns, and practical techniques of ${topic} for Day ${day}.`,
        whatToBuild: `Build a functional hands-on exercise and verify output for Day ${day}.`,
        expectedOutcome: `Successfully verified working output and key takeaway for Day ${day}.`,
        estimatedMinutes: 30,
        curiosityPrompt: `How does today's concept connect to real-world production systems?`,
        skills: [input.category || 'Engineering']
      };
    });
  }

  // Convert a custom roadmap day to standard Challenge interface for DailyChallengeView & AIMentor
  static convertToChallenge(customDay: CustomChallengeRoadmapDay, category: string): Challenge {
    const stageName = customDay.dayId <= 10
      ? 'Stage 1 — Discover'
      : customDay.dayId <= 25
      ? 'Stage 2 — Build'
      : customDay.dayId <= 35
      ? 'Stage 3 — Experiment'
      : customDay.dayId <= 45
      ? 'Stage 4 — Real-World Problems'
      : customDay.dayId <= 55
      ? 'Stage 5 — Build Your Own'
      : 'Stage 6 — Showcase';

    const stageKey = customDay.dayId <= 10
      ? 'discover'
      : customDay.dayId <= 25
      ? 'build'
      : customDay.dayId <= 35
      ? 'experiment'
      : customDay.dayId <= 45
      ? 'real-world'
      : customDay.dayId <= 55
      ? 'build-your-own'
      : 'showcase';

    const reqs = customDay.whatToBuild.split(' • ').map(s => s.trim()).filter(Boolean);

    return {
      dayId: customDay.dayId,
      trackId: 'fullstack',
      title: customDay.title,
      description: customDay.whatToLearn,
      requirements: reqs.length > 0 ? reqs : [
        `Understand the core concept: ${customDay.whatToLearn}`,
        `Build the practical exercise: ${customDay.title}`,
        `Verify output matches expected outcome: ${customDay.expectedOutcome}`
      ],
      learningObjective: customDay.whatToLearn,
      whyItMatters: customDay.whyItMatters,
      challengeType: 'build',
      difficulty: 'intermediate',
      estimatedMinutes: customDay.estimatedMinutes,
      curiosityPrompt: customDay.curiosityPrompt || 'What did you find most interesting or challenging today?',
      skills: customDay.skills,
      tools: [category || 'VS Code', 'Git', 'Terminal'],
      stage: stageKey,
      stageName
    };
  }
}
