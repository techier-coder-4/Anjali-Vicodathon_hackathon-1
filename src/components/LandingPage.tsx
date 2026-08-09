import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Flame, Cpu, Code2, Sparkles, BookOpen, Layers, Target, Trophy, Terminal, Database, Globe, Brain, Shield, Server } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onExplore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onExplore }) => {
  return (
    <div className="bg-slate-50 text-slate-900 overflow-hidden">
      {/* Hero Section */}
      <section id="challenge" className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex flex-wrap justify-center items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-[10px] sm:text-xs font-extrabold shadow-2xs max-w-full text-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="break-words">LEARN → UNDERSTAND → EXPERIMENT → BUILD → PROVE → REFLECT</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-none">
            60 Days.<br />
            <span className="text-slate-900 underline decoration-amber-400 decoration-4 underline-offset-4">
              One Skill.
            </span>{' '}
            Real Progress.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Build consistently. Prove your skills. Stop repeating generic tutorials — experience 60 progressive challenges designed for real engineering growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base shadow-xs transition-all hover:scale-[1.01] flex items-center justify-center gap-2 group min-h-[44px]"
            >
              <span>Start Your 60-Day Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-amber-400" />
            </button>

            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-gray-100 text-slate-900 font-bold text-base border border-gray-200/80 shadow-2xs transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Explore All 60 Days</span>
            </button>
          </div>

          {/* Social Proof Stats */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-gray-200/80">
            <div>
              <p className="text-2xl font-black text-slate-900">60</p>
              <p className="text-xs text-slate-500 font-medium">Distinct Daily Challenges</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">7</p>
              <p className="text-xs text-slate-500 font-medium">Specialized Track Roadmaps</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">100%</p>
              <p className="text-xs text-slate-500 font-medium">Proof of Work Verified</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">24/7</p>
              <p className="text-xs text-slate-500 font-medium">AI Learning Guide</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY THIS MATTERS */}
      <section id="why-abtalks" className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">Why ABTalks</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Designed for Real Engineering Mastery
            </p>
            <p className="text-slate-600 text-sm mt-2">
              Most coding platforms test memory or repetitive syntax. ABTalks focuses on engineering intuition and consistency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Build Real Projects</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Move beyond toy code snippets. Work with APIs, state boundaries, debouncing, error fallbacks, and real capstone products.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Prove Your Work</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Attach public GitHub repository links and LinkedIn summaries to every challenge. Build an undeniable public engineering trail.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Build Consistency</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Daily streak tracking and anti-shaming recovery mechanisms ensure that missing a single day never causes you to quit completely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">How It Works</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            The 5-Step Daily Learning Engine
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { num: '01', title: 'Choose', desc: 'Confirm your technical track and target career level.', icon: <Target className="w-5 h-5" /> },
            { num: '02', title: 'Learn', desc: 'Understand what you are building and why it matters in production.', icon: <BookOpen className="w-5 h-5" /> },
            { num: '03', title: 'Build', desc: 'Execute the requirement checklist with hands-on code.', icon: <Layers className="w-5 h-5" /> },
            { num: '04', title: 'Prove', desc: 'Submit your GitHub commit or repository proof link.', icon: <ShieldCheck className="w-5 h-5" /> },
            { num: '05', title: 'Reflect', desc: 'Complete lightweight checkpoints to solidify conceptual understanding.', icon: <Trophy className="w-5 h-5" /> }
          ].map((step, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs relative">
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/80">
                Step {step.num}
              </span>
              <div className="my-3 text-slate-800">{step.icon}</div>
              <h4 className="font-bold text-slate-900 text-base mb-1">{step.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRACKS & LEARNING PATHS */}
      <section id="tracks" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">Learning Tracks</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              7 Specialized 60-Day Technical Roadmaps
            </p>
            <p className="text-slate-600 text-sm mt-2">
              Each track provides a genuinely tailored 60-day curriculum with distinct daily challenges, tools, and proof-of-work capstones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'frontend', title: 'Frontend Engineering', desc: 'React 18, TypeScript, Tailwind, State Management, Next.js, Web Vitals, Performance.', icon: <Globe className="w-6 h-6 text-blue-600" /> },
              { id: 'backend', title: 'Backend Systems', desc: 'Node.js, Express, PostgreSQL, SQL, Redis, REST APIs, System Architecture, Docker.', icon: <Database className="w-6 h-6 text-emerald-600" /> },
              { id: 'fullstack', title: 'Full-Stack Web', desc: 'End-to-End React + Node.js, Databases, Auth, Deployment, CI/CD, Capstone Web Apps.', icon: <Server className="w-6 h-6 text-purple-600" /> },
              { id: 'python', title: 'Python Development', desc: 'Core Python 3.12, Data Structures, FastAPI, Async IO, Automation, Web Scraping.', icon: <Terminal className="w-6 h-6 text-amber-600" /> },
              { id: 'data-ai', title: 'Data & AI Engineering', desc: 'Pandas, NumPy, Scikit-learn, Vector DBs, Gemini API, RAG Pipelines, Model Deployment.', icon: <Brain className="w-6 h-6 text-rose-600" /> },
              { id: 'java', title: 'Java Engineering', desc: 'Java 21, OOP, Collections, Concurrency, Spring Boot 3, Hibernate, Microservices.', icon: <Code2 className="w-6 h-6 text-indigo-600" /> },
              { id: 'cybersecurity', title: 'Cybersecurity', desc: 'Linux, Networking, Wireshark, OWASP Top 10, Burp Suite, DevSecOps, PenTesting.', icon: <Shield className="w-6 h-6 text-red-600" /> },
            ].map((t) => (
              <div key={t.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                  {t.icon}
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">{t.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{t.desc}</p>
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-indigo-600 hover:underline inline-flex items-center gap-1 cursor-pointer" onClick={onStart}>
                    Explore 60-Day Curriculum →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REAL STUDENT OUTCOMES */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest">Real Student Outcomes</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Transforming Habits into Software Careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Aarav Sharma',
                track: 'Frontend Development',
                persona: 'Active Student (Day 18)',
                quote: 'ABTalks kept me accountable every single morning. The curiosity prompts forced me to understand WHY code works, not just copy solutions.',
                proof: 'GitHub: 18 verified daily commits'
              },
              {
                name: 'Rahul Kumar',
                track: 'Backend Systems',
                persona: 'Recovered Student (Day 27)',
                quote: 'When I missed two days during midterms, ABTalks welcomed me back without resetting my entire journey to zero. That non-shaming recovery saved my momentum.',
                proof: 'LinkedIn: 22 public progress posts'
              },
              {
                name: 'Priya Nair',
                track: 'Data & AI',
                persona: 'Graduate (60/60 Days)',
                quote: 'Completing all 60 days gave me a full-stack portfolio on GitHub that landed me my software engineering internship offer.',
                proof: 'Full Capstone Showcase Complete'
              }
            ].map((outcome, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{outcome.name}</h4>
                    <p className="text-xs text-slate-400">{outcome.track}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {outcome.persona}
                  </span>
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed">"{outcome.quote}"</p>
                <div className="pt-2 border-t border-slate-700/60 flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{outcome.proof}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 text-center px-4 max-w-3xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 mx-auto flex items-center justify-center border border-indigo-500/30">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            60 days. One day at a time.
          </h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Your 60-day engineering transformation begins today. Select your track and tackle Day 1 now.
          </p>
          <button
            onClick={onStart}
            className="px-8 py-4 rounded-xl bg-white text-indigo-900 font-extrabold text-base hover:bg-slate-100 transition-all shadow-lg hover:scale-[1.02] min-h-[44px]"
          >
            Start Your 60-Day Journey Now
          </button>
        </div>
      </section>
    </div>
  );
};
