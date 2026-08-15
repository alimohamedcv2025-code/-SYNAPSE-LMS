import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AcademicLevel, Department, Semester, Subject } from '../../types';
import { 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  Check, 
  RotateCcw,
  BookOpen,
  Info
} from 'lucide-react';

export const SubjectSelectionPage: React.FC = () => {
  const { 
    currentUser, 
    subjects, 
    updateAcademicProfile, 
    saveSubjectSelections, 
    navigate,
    showToast 
  } = useApp();

  const profile = currentUser?.academicProfile;

  // Active form states
  const [selectedLevel, setSelectedLevel] = useState<AcademicLevel>(profile?.level || 'level_3');
  const [selectedDepartment, setSelectedDepartment] = useState<Department>(profile?.department || 'CS');
  const [selectedSemester, setSelectedSemester] = useState<Semester>(profile?.semester || 1);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>(profile?.selectedSubjectIds || []);

  // Handle switching program level
  const handleLevelChange = (lvl: AcademicLevel) => {
    setSelectedLevel(lvl);
    if (lvl === 'level_2') {
      const semSubs = subjects
        .filter(s => s.primaryLevel === 'level_2' && s.semester === selectedSemester)
        .map(s => s.id);
      setSelectedSubjectIds(semSubs);
    } else if (lvl === 'level_3') {
      const semSubs = subjects
        .filter(s => s.primaryLevel === 'level_3' && s.department === selectedDepartment && s.semester === selectedSemester)
        .map(s => s.id);
      setSelectedSubjectIds(semSubs);
    } else if (lvl === 'summer') {
      // Summer pool: keep up to 3 or empty
      setSelectedSubjectIds(prev => prev.slice(0, 3));
    } else if (lvl === 'case') {
      setSelectedSubjectIds(prev => prev.slice(0, 6));
    }
  };

  // Handle semester change
  const handleSemesterChange = (sem: Semester) => {
    setSelectedSemester(sem);
    if (selectedLevel === 'level_2') {
      const semSubs = subjects
        .filter(s => s.primaryLevel === 'level_2' && s.semester === sem)
        .map(s => s.id);
      setSelectedSubjectIds(semSubs);
    } else if (selectedLevel === 'level_3') {
      const semSubs = subjects
        .filter(s => s.primaryLevel === 'level_3' && s.department === selectedDepartment && s.semester === sem)
        .map(s => s.id);
      setSelectedSubjectIds(semSubs);
    }
  };

  // Handle department change for Level 3
  const handleDepartmentChange = (dept: Department) => {
    setSelectedDepartment(dept);
    if (selectedLevel === 'level_3') {
      const semSubs = subjects
        .filter(s => s.primaryLevel === 'level_3' && s.department === dept && s.semester === selectedSemester)
        .map(s => s.id);
      setSelectedSubjectIds(semSubs);
    }
  };

  // Toggle selection for Summer / Case
  const handleToggleSubject = (subId: string) => {
    const isSelected = selectedSubjectIds.includes(subId);

    if (isSelected) {
      // Remove
      setSelectedSubjectIds(prev => prev.filter(id => id !== subId));
    } else {
      // Add with limit check
      if (selectedLevel === 'summer' && selectedSubjectIds.length >= 3) {
        showToast('Summer Term Rule: Maximum 3 subjects allowed. Remove a subject to add this one.', 'error');
        return;
      }
      if (selectedLevel === 'case' && selectedSubjectIds.length >= 6) {
        showToast('Case Program Rule: Maximum 6 subjects per semester. Remove a subject to add this one.', 'error');
        return;
      }
      setSelectedSubjectIds(prev => [...prev, subId]);
    }
  };

  // Save changes to student academic profile
  const handleSaveProfile = () => {
    updateAcademicProfile(
      selectedLevel,
      selectedLevel === 'level_3' ? selectedDepartment : undefined,
      selectedLevel === 'summer' ? undefined : selectedSemester,
      selectedSubjectIds
    );
    navigate('student-dashboard');
  };

  // Get available subjects for pool display
  const getSubjectPool = (): Subject[] => {
    if (selectedLevel === 'level_2') {
      return subjects.filter(s => s.primaryLevel === 'level_2' && s.semester === selectedSemester);
    }
    if (selectedLevel === 'level_3') {
      return subjects.filter(
        s => s.primaryLevel === 'level_3' && 
             s.department === selectedDepartment && 
             s.semester === selectedSemester
      );
    }
    // Summer & Case have full 24 subjects available
    return subjects;
  };

  const poolSubjects = getSubjectPool();
  const maxLimit = selectedLevel === 'summer' ? 3 : selectedLevel === 'case' ? 6 : 6;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b-2 border-black dark:border-neutral-700 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFE600] border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000000] text-black">
          <Layers className="w-3.5 h-3.5" />
          <span>ACADEMIC SELECTION FLOW & RULES</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white uppercase tracking-tight">
          Curriculum & Subject Selection
        </h1>
        <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
          Configure your academic level, department specialization, and semester course enrollment according to college regulations.
        </p>
      </div>

      {/* Step 1: Program / Level Switcher */}
      <div className="neo-box p-6 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500">
            Step 1: Academic Level Selection
          </span>
          <span className="text-xs font-mono font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 border border-black/20">
            Active Selection: {selectedLevel.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          {[
            { key: 'level_2', label: 'LEVEL 2', rule: '6 Subjects / Semester' },
            { key: 'level_3', label: 'LEVEL 3', rule: 'AI, CS, IS (6 Subjects)' },
            { key: 'summer', label: 'SUMMER', rule: 'Select UP TO 3 Subjects' },
            { key: 'case', label: 'CASE', rule: 'Select UP TO 6 / Sem' }
          ].map(item => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleLevelChange(item.key as AcademicLevel)}
              className={`p-3.5 text-left border-2 transition-all cursor-pointer ${
                selectedLevel === item.key
                  ? 'bg-[#FFE600] text-black border-black shadow-[3px_3px_0px_#000000] font-black'
                  : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-black dark:border-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <span className="block font-black text-sm">{item.label}</span>
              <span className="text-[10px] opacity-80 mt-1 block">{item.rule}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Department (Level 3 Only) & Semester Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Department Choice (If Level 3) */}
        {selectedLevel === 'level_3' ? (
          <div className="neo-box p-6 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 space-y-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500">
              Step 2: Choose Department
            </span>
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              {[
                { key: 'AI', name: 'Artificial Intelligence', icon: '🤖' },
                { key: 'CS', name: 'Computer Science', icon: '💻' },
                { key: 'IS', name: 'Information Systems', icon: '📊' }
              ].map(dept => (
                <button
                  key={dept.key}
                  type="button"
                  onClick={() => handleDepartmentChange(dept.key as Department)}
                  className={`p-3 text-center border-2 transition-all cursor-pointer ${
                    selectedDepartment === dept.key
                      ? 'bg-black text-[#FFE600] border-black shadow-[3px_3px_0px_#FFE600] font-black'
                      : 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border-black hover:bg-neutral-100'
                  }`}
                >
                  <span className="text-xl block mb-1">{dept.icon}</span>
                  <span className="font-black text-sm">{dept.key}</span>
                  <span className="text-[9px] block opacity-80 truncate">{dept.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="neo-box p-6 bg-neutral-50 dark:bg-neutral-900/60 border-2 border-black dark:border-neutral-700 flex items-center justify-between text-xs font-mono">
            <div>
              <p className="font-bold text-neutral-900 dark:text-white uppercase">General Program Scope</p>
              <p className="text-neutral-500 mt-0.5">Department specialization is only applicable to Level 3 students.</p>
            </div>
            <Info className="w-5 h-5 text-neutral-400" />
          </div>
        )}

        {/* Semester Choice (For Level 2, Level 3, Case) */}
        {selectedLevel !== 'summer' ? (
          <div className="neo-box p-6 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 space-y-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500">
              {selectedLevel === 'level_3' ? 'Step 3' : 'Step 2'}: Choose Semester
            </span>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              {[
                { key: 1, label: 'Semester 1 (Fall)' },
                { key: 2, label: 'Semester 2 (Spring)' }
              ].map(s => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => handleSemesterChange(s.key as Semester)}
                  className={`p-3 text-center border-2 transition-all cursor-pointer ${
                    selectedSemester === s.key
                      ? 'bg-[#FFE600] text-black border-black shadow-[3px_3px_0px_#000000] font-black'
                      : 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border-black hover:bg-neutral-100'
                  }`}
                >
                  <span className="font-black text-sm">{s.label}</span>
                  <span className="text-[10px] block opacity-80 mt-1">6 Core Courses</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="neo-box p-6 bg-amber-50 dark:bg-amber-950/40 border-2 border-black dark:border-amber-700 flex items-center justify-between text-xs font-mono text-neutral-900 dark:text-amber-200">
            <div>
              <p className="font-bold uppercase">☀️ Summer Term (No Semester Split)</p>
              <p className="opacity-80 mt-0.5">Select up to 3 subjects freely from the 24 available courses.</p>
            </div>
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
        )}

      </div>

      {/* Step 3/4: Subject Selection Grid & Removal / Replace Interface */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 p-4 shadow-[4px_4px_0px_#000000]">
          <div>
            <h3 className="font-display font-black text-xl uppercase text-neutral-900 dark:text-white">
              Subject Enrollment Pool
            </h3>
            <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
              {selectedLevel === 'summer'
                ? `Select UP TO 3 subjects (Currently: ${selectedSubjectIds.length} / 3). You can remove and replace subjects at any time.`
                : selectedLevel === 'case'
                ? `Select UP TO 6 subjects per semester (Currently: ${selectedSubjectIds.length} / 6). You can remove and replace subjects at any time.`
                : `Automatic enrollment: All 6 standard curriculum subjects for ${selectedLevel.toUpperCase()} Semester ${selectedSemester}.`}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className={`px-3 py-1 font-bold border-2 border-black ${
              selectedSubjectIds.length <= maxLimit ? 'bg-[#FFE600] text-black' : 'bg-red-500 text-white'
            }`}>
              {selectedSubjectIds.length} / {maxLimit} SUBJECTS SELECTED
            </span>
          </div>
        </div>

        {/* Grid of Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {poolSubjects.map(sub => {
            const isSelected = selectedSubjectIds.includes(sub.id);
            const isAutomaticFixed = selectedLevel === 'level_2' || selectedLevel === 'level_3';

            return (
              <div
                key={sub.id}
                className={`p-4 border-2 transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-black bg-amber-50 dark:bg-amber-950/30 shadow-[4px_4px_0px_#000000]'
                    : 'border-black dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] opacity-80 hover:opacity-100'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-xs bg-black text-[#FFE600] px-2 py-0.5 border border-black">
                      {sub.code}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-neutral-500">
                      {sub.credits} Credits • {sub.primaryLevel.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base text-neutral-900 dark:text-white leading-tight">
                    {sub.name}
                  </h4>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2">
                    {sub.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-black/10 dark:border-neutral-700 flex items-center justify-between">
                  {isAutomaticFixed ? (
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Core Mandatory Subject
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleSubject(sub.id)}
                      className={`w-full py-2 px-3 text-xs font-mono font-bold border-2 border-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red-100 text-red-900 hover:bg-red-200 shadow-[2px_2px_0px_#000000]'
                          : 'bg-[#FFE600] text-black hover:bg-[#FFF04D] shadow-[2px_2px_0px_#000000]'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                          <span>Remove from Selection</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Selection</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="sticky bottom-6 z-20 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 p-4 shadow-[6px_6px_0px_#000000] flex flex-wrap items-center justify-between gap-4 font-mono">
        <div className="text-xs">
          <p className="font-bold text-neutral-900 dark:text-white">
            Ready to confirm enrollment for {selectedLevel.toUpperCase()}?
          </p>
          <p className="text-neutral-500">
            {selectedSubjectIds.length} subjects will be active in your student dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('student-dashboard')}
            className="neo-btn neo-btn-white dark:bg-neutral-800 dark:text-white px-4 py-2.5 text-xs font-bold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveProfile}
            className="neo-btn neo-btn-primary px-6 py-2.5 text-xs font-black flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000000]"
          >
            <span>Save & Apply Curriculum</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
