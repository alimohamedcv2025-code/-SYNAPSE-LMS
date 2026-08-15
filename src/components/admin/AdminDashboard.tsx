import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Plus, 
  ArrowRight, 
  Lock, 
  AlertTriangle,
  Sparkles,
  Layers,
  ExternalLink
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, 
    users, 
    subjects, 
    materials, 
    questions, 
    getScopedSubjects, 
    navigate 
  } = useApp();

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const adminScope = currentUser?.adminScope || 'level_3';
  const scopedSubjects = getScopedSubjects();

  // Scoped metrics
  const scopedStudents = users.filter(u => u.role === 'student');
  const scopedMaterials = materials.filter(m => {
    if (isSuperAdmin) return true;
    return scopedSubjects.some(s => s.id === m.subjectId);
  });
  const scopedQuestions = questions.filter(q => {
    if (isSuperAdmin) return true;
    return scopedSubjects.some(s => s.id === q.subjectId);
  });

  const getScopeBadgeText = () => {
    if (isSuperAdmin) return 'GLOBAL SUPER ADMIN CONSOLE';
    return `SCOPED ADMIN: ${adminScope.toUpperCase()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. ADMIN HERO & SCOPE BANNER */}
      <div className="neo-box p-6 sm:p-8 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 font-mono font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000000] ${
              isSuperAdmin ? 'bg-purple-300 text-purple-950' : 'bg-[#FFE600] text-black'
            }`}>
              {getScopeBadgeText()}
            </span>
            <span className="text-xs font-mono text-neutral-500 font-bold">
              ID: {currentUser?.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('admin-materials')}
              className="neo-btn neo-btn-primary px-3.5 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link Material</span>
            </button>
            <button
              onClick={() => navigate('admin-subjects')}
              className="neo-btn neo-btn-white dark:bg-neutral-800 dark:text-white px-3.5 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manage Subjects</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white uppercase tracking-tight">
            Academic Administration Console
          </h1>
          <p className="text-sm font-sans text-neutral-600 dark:text-neutral-300 max-w-2xl mt-1">
            {isSuperAdmin
              ? 'You have global privileges over all collegiate levels, department tracks, instructors, and link resources.'
              : `You are authorized to manage courses, students, and link-based materials strictly within the ${adminScope.toUpperCase()} academic domain.`}
          </p>
        </div>

        {/* Scope boundary notification */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-black dark:border-amber-700 flex items-center justify-between text-xs font-mono text-neutral-800 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>
              <strong>RBAC Active:</strong> Material additions and subject modifications are automatically constrained to your assigned academic scope.
            </span>
          </div>
          <span className="font-bold uppercase text-[10px] bg-black text-[#FFE600] px-2 py-0.5">
            100% LINK BASED
          </span>
        </div>
      </div>

      {/* 2. BENTO METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Students */}
        <div 
          onClick={() => navigate('admin-students')}
          className="neo-box-interactive p-5 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-neutral-500 uppercase">Enrolled Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-display font-black text-3xl text-neutral-900 dark:text-white">
            {scopedStudents.length}
          </div>
          <div className="text-[11px] font-mono text-neutral-500 flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <span>Active profiles</span>
            <span className="text-black dark:text-[#FFE600] font-bold">Manage →</span>
          </div>
        </div>

        {/* Metric 2: Scoped Subjects */}
        <div 
          onClick={() => navigate('admin-subjects')}
          className="neo-box-interactive p-5 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-neutral-500 uppercase">Scoped Subjects</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-display font-black text-3xl text-neutral-900 dark:text-white">
            {scopedSubjects.length}
          </div>
          <div className="text-[11px] font-mono text-neutral-500 flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <span>In your domain</span>
            <span className="text-black dark:text-[#FFE600] font-bold">Catalog →</span>
          </div>
        </div>

        {/* Metric 3: Link Materials */}
        <div 
          onClick={() => navigate('admin-materials')}
          className="neo-box-interactive p-5 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-neutral-500 uppercase">Link Materials</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-display font-black text-3xl text-neutral-900 dark:text-white">
            {scopedMaterials.length}
          </div>
          <div className="text-[11px] font-mono text-neutral-500 flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <span>Zero file uploads</span>
            <span className="text-black dark:text-[#FFE600] font-bold">Manage →</span>
          </div>
        </div>

        {/* Metric 4: Open Questions */}
        <div 
          onClick={() => navigate('questions')}
          className="neo-box-interactive p-5 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-neutral-500 uppercase">Subject Inquiries</span>
            <HelpCircle className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-display font-black text-3xl text-neutral-900 dark:text-white">
            {scopedQuestions.length}
          </div>
          <div className="text-[11px] font-mono text-neutral-500 flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <span>Student forum</span>
            <span className="text-black dark:text-[#FFE600] font-bold">Reply →</span>
          </div>
        </div>

      </div>

      {/* 3. MANAGEMENT MODULE QUICK ACCESS */}
      <div className="space-y-4">
        <h3 className="font-display font-black text-2xl uppercase tracking-tight text-neutral-900 dark:text-white">
          Administrative Workspaces
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Module 1: Materials Hub */}
          <div className="neo-box p-6 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-[#FFE600] text-black text-[10px] font-mono font-black px-2 py-0.5 border border-black">
                RESOURCES
              </span>
              <h4 className="font-display font-black text-xl uppercase">
                Link-Based Materials Hub
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Publish and curate external YouTube playlists, lecture slide PDFs, past exam rubrics, and textbook companion links.
              </p>
            </div>

            <button
              onClick={() => navigate('admin-materials')}
              className="neo-btn neo-btn-primary py-2.5 px-4 text-xs font-mono font-bold flex items-center justify-between mt-4"
            >
              <span>Manage Materials ({scopedMaterials.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Module 2: Students & Enrolments */}
          <div className="neo-box p-6 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-blue-200 text-blue-900 text-[10px] font-mono font-black px-2 py-0.5 border border-black">
                ACADEMICS
              </span>
              <h4 className="font-display font-black text-xl uppercase">
                Student Roster & Scopes
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Audit student academic standing, change levels (Level 2, Level 3, Summer, Case), and verify subject enrollments.
              </p>
            </div>

            <button
              onClick={() => navigate('admin-students')}
              className="neo-btn neo-btn-white dark:bg-neutral-800 dark:text-white py-2.5 px-4 text-xs font-mono font-bold flex items-center justify-between mt-4"
            >
              <span>View Roster ({scopedStudents.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Module 3: Scoped Admins Management (Super Admin) */}
          <div className="neo-box p-6 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-purple-200 text-purple-900 text-[10px] font-mono font-black px-2 py-0.5 border border-black">
                GOVERNANCE
              </span>
              <h4 className="font-display font-black text-xl uppercase">
                Admin Roles & Scopes
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Provision new departmental admins and assign strict scope boundaries (Level 2, Level 3, Summer, Case).
              </p>
            </div>

            {isSuperAdmin ? (
              <button
                onClick={() => navigate('admin-admins')}
                className="neo-btn neo-btn-primary py-2.5 px-4 text-xs font-mono font-bold flex items-center justify-between mt-4"
              >
                <span>Manage Admins</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 border border-black/20 text-[11px] font-mono text-neutral-500 flex items-center gap-1.5 mt-4">
                <Lock className="w-3.5 h-3.5" />
                <span>Super Admin Privileges Required</span>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
