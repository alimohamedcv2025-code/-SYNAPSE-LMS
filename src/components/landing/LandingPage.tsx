import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowRight, 
  BookOpen, 
  Video, 
  FileText, 
  FileCheck, 
  BookMarked, 
  Book, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  HelpCircle, 
  Sparkles, 
  Zap, 
  ExternalLink,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate, subjects, switchUser } = useApp();

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#121316] text-neutral-900 dark:text-white selection:bg-[#FFE600] selection:text-black">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b-2 border-black dark:border-neutral-800 bg-dot-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFE600] border-2 border-black font-mono font-black text-xs text-black shadow-[3px_3px_0px_#000000] mb-8">
            <Sparkles className="w-4 h-4 text-black animate-spin" />
            <span>COLLEGE LEARNING PLATFORM • CORE MVP</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Editorial Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="font-display font-black text-4xl sm:text-6xl xl:text-7xl leading-[1.05] tracking-tight uppercase">
                The Academic <br />
                <span className="bg-[#FFE600] text-black px-2 inline-block border-2 border-black shadow-[4px_4px_0px_#000000] my-1">
                  Knowledge Hub
                </span>
                <br />For Modern College.
              </h1>

              <p className="text-lg sm:text-xl font-sans text-neutral-700 dark:text-neutral-300 max-w-2xl leading-relaxed">
                A link-first educational platform unifying verified lecture streams, curated PDF notes, past exams, and textbooks under strict departmental scopes.
              </p>

              {/* CTAs & Quick Try Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('register')}
                  className="neo-btn neo-btn-primary px-7 py-4 text-base font-mono font-black flex items-center gap-2 cursor-pointer"
                >
                  <span>Enter Student Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => navigate('login')}
                  className="neo-btn neo-btn-white dark:bg-neutral-800 dark:text-white px-6 py-4 text-base font-mono font-bold cursor-pointer"
                >
                  <span>Sign In</span>
                </button>
              </div>

              {/* Persona Quick Launch Bar */}
              <div className="pt-6 border-t-2 border-black/10 dark:border-neutral-800 space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 block">
                  ⚡ 1-Click Interactive Persona Launch:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { switchUser('usr_student_1'); navigate('student-dashboard'); }}
                    className="px-3 py-1.5 bg-white dark:bg-neutral-800 border-2 border-black dark:border-neutral-700 text-xs font-mono font-bold shadow-[2px_2px_0px_#000000] hover:bg-[#FFE600] dark:hover:bg-[#FFE600] dark:hover:text-black transition-colors"
                  >
                    🎓 Ahmed (L3 CS Student)
                  </button>
                  <button
                    onClick={() => { switchUser('usr_student_2'); navigate('student-dashboard'); }}
                    className="px-3 py-1.5 bg-white dark:bg-neutral-800 border-2 border-black dark:border-neutral-700 text-xs font-mono font-bold shadow-[2px_2px_0px_#000000] hover:bg-[#FFE600] dark:hover:bg-[#FFE600] dark:hover:text-black transition-colors"
                  >
                    ☀️ Sarah (Summer - Max 3)
                  </button>
                  <button
                    onClick={() => { switchUser('usr_admin_l3'); navigate('admin-dashboard'); }}
                    className="px-3 py-1.5 bg-white dark:bg-neutral-800 border-2 border-black dark:border-neutral-700 text-xs font-mono font-bold shadow-[2px_2px_0px_#000000] hover:bg-blue-400 hover:text-black transition-colors"
                  >
                    🛡️ Dr. Vance (Level 3 Admin)
                  </button>
                  <button
                    onClick={() => { switchUser('usr_super_admin'); navigate('admin-dashboard'); }}
                    className="px-3 py-1.5 bg-white dark:bg-neutral-800 border-2 border-black dark:border-neutral-700 text-xs font-mono font-bold shadow-[2px_2px_0px_#000000] hover:bg-purple-400 hover:text-black transition-colors"
                  >
                    👑 Dean Arthur (Super Admin)
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Neo-Brutalist Bento Card Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="neo-box p-5 bg-white dark:bg-[#1a1a1e] space-y-4 border-2 border-black dark:border-neutral-700">
                <div className="flex items-center justify-between border-b-2 border-black dark:border-neutral-700 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 border border-black"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400 border border-black"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 border border-black"></div>
                    <span className="font-mono text-xs font-bold ml-2">SYSTEM_STATUS: ONLINE</span>
                  </div>
                  <span className="bg-[#FFE600] text-black text-[10px] font-mono font-black px-2 py-0.5 border border-black">
                    LINK-BASED ARCHITECTURE
                  </span>
                </div>

                {/* Sample Stacked Box 1 */}
                <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/80 border-2 border-black dark:border-neutral-700 shadow-[3px_3px_0px_#000000]">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-100 text-rose-900 border border-black">
                      <Video className="w-3 h-3" /> VIDEO LECTURE
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">52 mins</span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                    Normalization: 1NF to BCNF Masterclass
                  </h4>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-neutral-500">Database Systems · L3 CS</span>
                    <span className="text-black dark:text-[#FFE600] font-bold flex items-center gap-0.5">
                      Launch ↗
                    </span>
                  </div>
                </div>

                {/* Sample Stacked Box 2 */}
                <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/80 border-2 border-black dark:border-neutral-700 shadow-[3px_3px_0px_#000000]">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-purple-100 text-purple-900 border border-black">
                      <FileCheck className="w-3 h-3" /> EXAM & RUBRIC
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">12 pages</span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                    Midterm Exam 2025: Official Solutions
                  </h4>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-neutral-500">Database Systems · L3 CS</span>
                    <span className="text-black dark:text-[#FFE600] font-bold flex items-center gap-0.5">
                      Launch ↗
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-center text-xs font-mono text-neutral-500">
                  ⚡ 0 byte storage footprint • Direct URL routing
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION BENTO GRID */}
      <section className="py-20 border-b-2 border-black dark:border-neutral-800 bg-[#FAF9F5] dark:bg-[#121316]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500">
              [ CORE PLATFORM ARCHITECTURE ]
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight mt-1 uppercase">
              Engineered for Academic Rigor.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Bento Card 1: 100% Link-Based */}
            <div className="md:col-span-7 neo-box p-8 bg-white dark:bg-[#1a1a1e] space-y-4">
              <div className="w-12 h-12 bg-[#FFE600] border-2 border-black flex items-center justify-center text-black font-black text-xl shadow-[3px_3px_0px_#000000]">
                <ExternalLink className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-2xl uppercase">
                100% Link-Based Material Architecture
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                No storage bottlenecks, no file size limits, no upload delays. All lecture streams, slide decks, research papers, and textbook companions are stored as verified external URLs with rich metadata.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 border border-black text-xs font-mono font-bold">YouTube Playlists</span>
                <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 border border-black text-xs font-mono font-bold">Stanford OCW</span>
                <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 border border-black text-xs font-mono font-bold">Google Drive</span>
                <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 border border-black text-xs font-mono font-bold">GitHub Repos</span>
              </div>
            </div>

            {/* Bento Card 2: Scoped Authorization */}
            <div className="md:col-span-5 neo-box p-8 bg-[#FFE600] text-black space-y-4">
              <div className="w-12 h-12 bg-black text-[#FFE600] border-2 border-black flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_#000000]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-2xl uppercase">
                Strict Scoped RBAC
              </h3>
              <p className="text-black/90 font-medium leading-relaxed">
                Admins operate strictly within authorized scopes (Level 2, Level 3, Level 4, Summer, Case). Cross-scope tampering is blocked both at the UI layer and verified backend checks.
              </p>
              <div className="pt-2 font-mono text-xs font-bold uppercase">
                🔒 Super Admin + Scoped Admins
              </div>
            </div>

            {/* Bento Card 3: Academic Rules Enforcement */}
            <div className="md:col-span-4 neo-box p-8 bg-white dark:bg-[#1a1a1e] space-y-4">
              <div className="w-12 h-12 bg-blue-500 text-white border-2 border-black flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_#000000]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-xl uppercase">
                Precise Academic Selection Rules
              </h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Enforces Level 2 semester splits, Level 3 department branches (AI, CS, IS), Summer selection (up to 3 subjects), and Case mode (up to 6 per sem).
              </p>
            </div>

            {/* Bento Card 4: Community Q&A */}
            <div className="md:col-span-4 neo-box p-8 bg-white dark:bg-[#1a1a1e] space-y-4">
              <div className="w-12 h-12 bg-purple-500 text-white border-2 border-black flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_#000000]">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-xl uppercase">
                Subject-Linked Instructor Q&A
              </h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Students submit targeted conceptual questions directly attached to subjects. Scoped department instructors provide verified official solutions.
              </p>
            </div>

            {/* Bento Card 5: Swiss Neo-Brutalist UI */}
            <div className="md:col-span-4 neo-box p-8 bg-white dark:bg-[#1a1a1e] space-y-4">
              <div className="w-12 h-12 bg-emerald-500 text-white border-2 border-black flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_#000000]">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-xl uppercase">
                High-Contrast Swiss Design
              </h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Crafted with hard offset shadows, crisp borders, high-legibility typography, and instant responsiveness across desktop, tablet, and mobile.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. ACADEMIC LEVELS & SELECTION FLOWS */}
      <section className="py-20 border-b-2 border-black dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider bg-black text-[#FFE600] px-2 py-0.5">
              CURRICULUM FLOW
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight">
              Academic Selection Engine
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 font-sans">
              Built strictly according to university core regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Level 2 Card */}
            <div className="neo-box p-6 bg-white dark:bg-[#1a1a1e] space-y-3 border-2 border-black dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5">
                  LEVEL 2
                </span>
                <span className="text-xs font-mono font-bold text-neutral-500">6 Subjects / Sem</span>
              </div>
              <h3 className="font-display font-bold text-xl">General Computing</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Select Semester 1 or 2. Automatically enrolls in the 6 standard core courses for that term.
              </p>
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 text-[11px] font-mono text-neutral-500">
                • Data Structures I<br />
                • Object-Oriented Java<br />
                • Discrete Math
              </div>
            </div>

            {/* Level 3 Card */}
            <div className="neo-box p-6 bg-white dark:bg-[#1a1a1e] space-y-3 border-2 border-black dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-[#FFE600] text-black px-2 py-0.5 border border-black">
                  LEVEL 3
                </span>
                <span className="text-xs font-mono font-bold text-neutral-500">3 Majors</span>
              </div>
              <h3 className="font-display font-bold text-xl">Specialized Tracks</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Choose Department (<strong>AI</strong>, <strong>CS</strong>, or <strong>IS</strong>) + Semester to unlock the exact 6 specialized courses.
              </p>
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 text-[11px] font-mono text-neutral-500">
                • Database Systems<br />
                • Operating Systems<br />
                • Machine Learning
              </div>
            </div>

            {/* Summer Card */}
            <div className="neo-box p-6 bg-white dark:bg-[#1a1a1e] space-y-3 border-2 border-black dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-amber-200 text-amber-900 px-2 py-0.5">
                  SUMMER
                </span>
                <span className="text-xs font-mono font-bold text-neutral-500">0 → 3 Allowed</span>
              </div>
              <h3 className="font-display font-bold text-xl">Summer Intensive</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                No semester selection. Pick up to 3 subjects from the pool of 24. Replace or remove subjects dynamically.
              </p>
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 text-[11px] font-mono text-neutral-500">
                • Flexible enrollment<br />
                • Maximum 3 subjects<br />
                • Real-time replacement
              </div>
            </div>

            {/* Case Card */}
            <div className="neo-box p-6 bg-white dark:bg-[#1a1a1e] space-y-3 border-2 border-black dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-blue-200 text-blue-900 px-2 py-0.5">
                  CASE
                </span>
                <span className="text-xs font-mono font-bold text-neutral-500">Up to 6 / Sem</span>
              </div>
              <h3 className="font-display font-bold text-xl">Custom Academic Plan</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Select Semester 1 or 2. Choose up to 6 custom subjects per semester with dynamic replacement.
              </p>
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 text-[11px] font-mono text-neutral-500">
                • Semester-specific plan<br />
                • 0 to 6 subjects per sem<br />
                • Full catalog access
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. MATERIAL TYPES SHOWCASE */}
      <section className="py-20 border-b-2 border-black dark:border-neutral-800 bg-[#FAF9F5] dark:bg-[#121316]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500">
                [ 6 STANDARDIZED FORMATS ]
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight mt-1">
                Supported Material Types
              </h2>
            </div>
            <p className="text-sm font-mono text-neutral-500 max-w-md">
              Every resource is displayed as a clean stacked box with instant launch capability.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] shadow-[3px_3px_0px_#000000] text-center space-y-2">
              <div className="w-10 h-10 mx-auto bg-rose-100 text-rose-900 border border-black flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm">Videos</h4>
              <p className="text-[10px] font-mono text-neutral-500">Lectures & tutorials</p>
            </div>

            <div className="p-4 border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] shadow-[3px_3px_0px_#000000] text-center space-y-2">
              <div className="w-10 h-10 mx-auto bg-amber-100 text-amber-900 border border-black flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm">PDFs</h4>
              <p className="text-[10px] font-mono text-neutral-500">Slides & handouts</p>
            </div>

            <div className="p-4 border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] shadow-[3px_3px_0px_#000000] text-center space-y-2">
              <div className="w-10 h-10 mx-auto bg-purple-100 text-purple-900 border border-black flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm">Exams</h4>
              <p className="text-[10px] font-mono text-neutral-500">Past exams & rubrics</p>
            </div>

            <div className="p-4 border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] shadow-[3px_3px_0px_#000000] text-center space-y-2">
              <div className="w-10 h-10 mx-auto bg-emerald-100 text-emerald-900 border border-black flex items-center justify-center">
                <BookMarked className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm">Summaries</h4>
              <p className="text-[10px] font-mono text-neutral-500">Revision cheatsheets</p>
            </div>

            <div className="p-4 border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] shadow-[3px_3px_0px_#000000] text-center space-y-2">
              <div className="w-10 h-10 mx-auto bg-sky-100 text-sky-900 border border-black flex items-center justify-center">
                <Book className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm">Books</h4>
              <p className="text-[10px] font-mono text-neutral-500">Textbook companions</p>
            </div>

            <div className="p-4 border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] shadow-[3px_3px_0px_#000000] text-center space-y-2">
              <div className="w-10 h-10 mx-auto bg-neutral-200 text-neutral-900 border border-black flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm">Other</h4>
              <p className="text-[10px] font-mono text-neutral-500">Simulators & tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="py-20 bg-[#FFE600] text-black border-b-2 border-black">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight">
            Ready to Access Your College Resources?
          </h2>
          <p className="text-lg font-mono font-bold max-w-2xl mx-auto">
            Experience the new standard in collegiate academic portals. Clean, link-based, zero bloat.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('register')}
              className="neo-btn neo-btn-dark px-8 py-4 text-base font-mono font-black shadow-[4px_4px_0px_#ffffff] cursor-pointer"
            >
              Create Student Account →
            </button>
            <button
              onClick={() => navigate('login')}
              className="neo-btn neo-btn-white px-8 py-4 text-base font-mono font-bold cursor-pointer"
            >
              Log In
            </button>
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL FOOTER */}
      <footer className="py-12 bg-black text-white font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#FFE600] text-black border border-black flex items-center justify-center font-black">
                  S
                </div>
                <span className="font-display font-black text-lg text-[#FFE600]">SYNAPSE</span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Next-generation collegiate learning platform. Link-based knowledge delivery with strict departmental scoping.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#FFE600] uppercase mb-3">Academic Programs</h4>
              <ul className="space-y-1.5 text-neutral-400 text-[11px]">
                <li>Level 2 General CS</li>
                <li>Level 3 Artificial Intelligence</li>
                <li>Level 3 Computer Science</li>
                <li>Level 3 Information Systems</li>
                <li>Summer Term Program</li>
                <li>Case Study Program</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#FFE600] uppercase mb-3">Role-Based Access</h4>
              <ul className="space-y-1.5 text-neutral-400 text-[11px]">
                <li>Student Enrolled View</li>
                <li>Scoped Admin (Level 2/3/4)</li>
                <li>Scoped Admin (Summer/Case)</li>
                <li>Super Admin Global Console</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#FFE600] uppercase mb-3">System Specifications</h4>
              <div className="p-3 bg-neutral-900 border border-neutral-700 text-neutral-300 text-[10px] space-y-1">
                <p>• Architecture: 100% External Links</p>
                <p>• File Uploads: Strictly Disabled</p>
                <p>• Language: English Only</p>
                <p>• UI Archetype: Neo-Brutalist Bento</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800 flex flex-wrap justify-between items-center text-neutral-500 text-[10px]">
            <p>© 2026 SYNAPSE College Learning Platform. All rights reserved.</p>
            <p className="font-mono">Built for academic excellence</p>
          </div>
        </div>
      </footer>

    </div>
  );
};
