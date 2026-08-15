import React from 'react';
import { useApp } from '../../context/AppContext';
import { MaterialCard } from '../common/MaterialCard';
import { 
  BookOpen, 
  Layers, 
  HelpCircle, 
  ExternalLink, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Video, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  Plus
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { 
    currentUser, 
    getSubjectsForStudent, 
    materials, 
    questions, 
    navigate 
  } = useApp();

  const profile = currentUser?.academicProfile;
  const enrolledSubjects = getSubjectsForStudent();

  // Find recent materials relevant to student's level/subjects
  const relevantMaterials = materials
    .filter(m => {
      if (!profile) return true;
      if (profile.level === 'level_2') return m.targetLevel === 'level_2';
      if (profile.level === 'level_3') return m.targetLevel === 'level_3' && (!m.department || m.department === profile.department);
      return profile.selectedSubjectIds.includes(m.subjectId);
    })
    .slice(0, 3);

  // Student's questions
  const myQuestions = questions.filter(q => q.userId === currentUser?.id).slice(0, 3);

  const getAcademicTag = () => {
    if (!profile) return 'STUDENT';
    const lvl = profile.level.replace('_', ' ').toUpperCase();
    const dept = profile.department ? ` • ${profile.department}` : '';
    const sem = profile.semester ? ` • Semester ${profile.semester}` : '';
    return `${lvl}${dept}${sem}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. BENTO HERO HEADER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Welcome & Academic Status (Col 8) */}
        <div className="lg:col-span-8 neo-box p-6 sm:p-8 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#FFE600] text-black text-xs font-mono font-black px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000000] uppercase">
                {getAcademicTag()}
              </span>
              <span className="text-xs font-mono font-bold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 border border-black/20">
                ACTIVE SEMESTER
              </span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white uppercase tracking-tight">
              Welcome Back, {currentUser?.name.split(' ')[0]} 👋
            </h1>

            <p className="text-sm font-sans text-neutral-600 dark:text-neutral-300 max-w-xl">
              You are currently enrolled in <strong>{enrolledSubjects.length} subjects</strong>. Access link-based video lectures, lecture notes, and revision rubrics below.
            </p>
          </div>

          <div className="pt-4 border-t-2 border-black/10 dark:border-neutral-800 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('subjects')}
              className="neo-btn neo-btn-primary px-4 py-2 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Enrolled Subjects ({enrolledSubjects.length})</span>
            </button>

            <button
              onClick={() => navigate('subject-selection')}
              className="neo-btn neo-btn-white dark:bg-neutral-800 dark:text-white px-4 py-2 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Adjust Academic Scope / Subjects</span>
            </button>
          </div>
        </div>

        {/* Quick Academic Summary Bento Card (Col 4) */}
        <div className="lg:col-span-4 neo-box p-6 bg-[#FFE600] text-black border-2 border-black flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-black uppercase tracking-wider">
                PROGRAM TRACK
              </span>
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-display font-black text-2xl uppercase">
              {profile?.level.replace('_', ' ')}
            </h3>
            <p className="text-xs font-mono font-medium mt-1">
              {profile?.level === 'summer' 
                ? 'Summer Intensive Program (Max 3 Subjects)'
                : profile?.level === 'case'
                ? 'Special Case Study Plan (Max 6 / Semester)'
                : profile?.level === 'level_3'
                ? `Dept of ${profile?.department} Engineering`
                : 'General Computer Science Curriculum'}
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-black/80 dark:text-white border-2 border-black space-y-1 font-mono text-xs shadow-[2px_2px_0px_#000000]">
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-300">Selected Subjects:</span>
              <span className="font-bold">{enrolledSubjects.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-300">Active Questions:</span>
              <span className="font-bold">{myQuestions.length}</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. ENROLLED SUBJECTS BENTO SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500">
              [ YOUR ACTIVE CURRICULUM ]
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-neutral-900 dark:text-white mt-0.5">
              Enrolled Subjects
            </h2>
          </div>

          <button
            onClick={() => navigate('subject-selection')}
            className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 hover:underline flex items-center gap-1"
          >
            <span>Change Subject Selections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {enrolledSubjects.length === 0 ? (
          <div className="p-8 border-2 border-black border-dashed bg-white dark:bg-[#1a1a1e] text-center space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto text-amber-500" />
            <h3 className="font-display font-bold text-lg">No Subjects Selected Yet</h3>
            <p className="text-xs font-mono text-neutral-500 max-w-md mx-auto">
              Please choose your subjects from the academic catalog to unlock your link-based course materials.
            </p>
            <button
              onClick={() => navigate('subject-selection')}
              className="neo-btn neo-btn-primary px-4 py-2 text-xs font-mono font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Select Subjects Now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrolledSubjects.map((sub) => {
              const subMaterials = materials.filter(m => m.subjectId === sub.id && m.isPublished);
              return (
                <div
                  key={sub.id}
                  onClick={() => navigate('subject-details', sub.id)}
                  className="neo-box-interactive p-5 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs bg-black text-[#FFE600] px-2 py-0.5 border border-black">
                        {sub.code}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-neutral-500">
                        {sub.credits} Credits
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-[#FFE600] transition-colors leading-tight">
                      {sub.name}
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2">
                      {sub.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t-2 border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono">
                    <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 font-bold border border-neutral-300 dark:border-neutral-700">
                      {subMaterials.length} Link Materials
                    </span>
                    <span className="font-bold text-black dark:text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Open Subject →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. RECENTLY ADDED LINK MATERIALS (STACKED CARDS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500">
              [ DIRECT RESOURCE ACCESS ]
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-neutral-900 dark:text-white mt-0.5">
              Recently Added Materials
            </h2>
          </div>

          <button
            onClick={() => navigate('subjects')}
            className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 hover:underline flex items-center gap-1"
          >
            <span>View All Materials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {relevantMaterials.length === 0 ? (
            <div className="p-6 border-2 border-black bg-white dark:bg-[#1a1a1e] text-center text-xs font-mono text-neutral-500">
              No materials published yet for your current selection.
            </div>
          ) : (
            relevantMaterials.map(mat => (
              <MaterialCard 
                key={mat.id} 
                material={mat} 
                showAdminActions={false} 
              />
            ))
          )}
        </div>
      </div>

      {/* 4. RECENT Q&A DISCUSSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Q&A Snippets (Col 8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl uppercase text-neutral-900 dark:text-white">
              Subject Q&A Inquiries
            </h3>
            <button
              onClick={() => navigate('questions')}
              className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 hover:underline flex items-center gap-1"
            >
              <span>Ask Instructor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {myQuestions.length === 0 ? (
              <div className="p-5 border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] text-xs font-mono text-neutral-500 flex items-center justify-between">
                <span>You haven't posted any questions yet.</span>
                <button
                  onClick={() => navigate('questions')}
                  className="neo-btn neo-btn-primary px-3 py-1 text-xs"
                >
                  Post a Question
                </button>
              </div>
            ) : (
              myQuestions.map(q => (
                <div
                  key={q.id}
                  onClick={() => navigate('questions', undefined, q.id)}
                  className="p-4 border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] shadow-[3px_3px_0px_#000000] cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-neutral-500">
                      {q.subjectName}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${
                      q.status === 'answered'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-500'
                        : 'bg-amber-100 text-amber-800 border-amber-500'
                    }`}>
                      {q.status}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                    {q.title}
                  </h4>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                    <span>{q.answers.length} verified instructor answers</span>
                    <span className="text-black dark:text-[#FFE600] font-bold">View Thread →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System & Rules Card (Col 4) */}
        <div className="lg:col-span-4 neo-box p-6 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h4 className="font-display font-bold text-base uppercase">
              Academic Protocol
            </h4>
          </div>
          <ul className="text-xs font-mono space-y-2 text-neutral-600 dark:text-neutral-300">
            <li className="flex items-start gap-1.5">
              <span className="text-black dark:text-white font-bold">•</span>
              <span>All educational materials are external link references (videos, drive notes, book companions).</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-black dark:text-white font-bold">•</span>
              <span>Subject selection follows department semester caps strictly.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-black dark:text-white font-bold">•</span>
              <span>Need help? Submit inquiries directly via the Q&A portal.</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
