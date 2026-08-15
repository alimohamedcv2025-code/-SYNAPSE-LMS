import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { User, AcademicLevel, Department, Semester } from '../../types';
import { 
  Users, 
  Search, 
  Filter, 
  Edit3, 
  UserPlus, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  ShieldCheck,
  Mail,
  Phone
} from 'lucide-react';

export const AdminStudentsPage: React.FC = () => {
  const { 
    users, 
    subjects, 
    updateStudentByAdmin, 
    currentUser, 
    canAdministerScope,
    showToast 
  } = useApp();

  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Filters
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');

  // Edit Modal State
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [editLevel, setEditLevel] = useState<AcademicLevel>('level_3');
  const [editDept, setEditDept] = useState<Department | 'none'>('CS');
  const [editSem, setEditSem] = useState<Semester | 'none'>(1);
  const [editPhone, setEditPhone] = useState('');

  const students = useMemo(() => {
    return users.filter(u => u.role === 'student');
  }, [users]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const prof = s.academicProfile;
      if (!prof) return false;

      // Scope permission check for scoped admins
      if (!isSuperAdmin && !canAdministerScope(prof.level, prof.department)) {
        return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const matches = 
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.phone && s.phone.includes(q)) ||
          s.id.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (levelFilter !== 'all' && prof.level !== levelFilter) return false;
      if (deptFilter !== 'all' && prof.department !== deptFilter) return false;

      return true;
    });
  }, [students, isSuperAdmin, canAdministerScope, search, levelFilter, deptFilter]);

  const openEditModal = (s: User) => {
    const prof = s.academicProfile;
    if (!prof) return;

    if (!isSuperAdmin && !canAdministerScope(prof.level, prof.department)) {
      showToast('Scope Error: You cannot edit students outside your academic domain.', 'error');
      return;
    }

    setEditingStudent(s);
    setEditLevel(prof.level);
    setEditDept(prof.department || 'none');
    setEditSem(prof.semester || 'none');
    setEditPhone(s.phone || '');
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const dept = editDept === 'none' ? undefined : editDept;
    const sem = editSem === 'none' ? undefined : (editSem as Semester);

    // Permission check
    if (!canAdministerScope(editLevel, dept)) {
      showToast(`Permission Error: Your admin account cannot administer ${editLevel.toUpperCase()}.`, 'error');
      return;
    }

    // Auto calculate default subject enrollment if level is level_2 or level_3
    let newSubjectIds = editingStudent.academicProfile?.selectedSubjectIds || [];
    if (editLevel === 'level_2') {
      newSubjectIds = subjects
        .filter(sub => sub.primaryLevel === 'level_2' && sub.semester === sem)
        .map(sub => sub.id);
    } else if (editLevel === 'level_3') {
      newSubjectIds = subjects
        .filter(sub => sub.primaryLevel === 'level_3' && sub.department === dept && sub.semester === sem)
        .map(sub => sub.id);
    } else if (editLevel === 'summer') {
      newSubjectIds = newSubjectIds.slice(0, 3);
    }

    updateStudentByAdmin(editingStudent.id, {
      phone: editPhone,
      academicProfile: {
        level: editLevel,
        department: dept,
        semester: sem,
        selectedSubjectIds: newSubjectIds
      }
    });

    setEditingStudent(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-neutral-700 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFE600] border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000000] text-black">
            <Users className="w-3.5 h-3.5" />
            <span>COLLEGIATE STUDENT DIRECTORY</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white uppercase tracking-tight">
            Student Roster & Academic Levels
          </h1>
          <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
            Manage student records, review enrollment tracks, and adjust academic level scopes.
          </p>
        </div>

        <span className="px-4 py-2 bg-white dark:bg-neutral-800 border-2 border-black dark:border-neutral-700 font-mono text-xs font-bold shadow-[2px_2px_0px_#000000]">
          Total Scoped Students: <strong>{filteredStudents.length}</strong>
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 p-4 shadow-[4px_4px_0px_#000000] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search students by name, email, or student ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border-2 border-black dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 outline-none"
          />
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-500 uppercase">Level:</span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 dark:text-white font-bold outline-none"
          >
            <option value="all">All Levels</option>
            <option value="level_2">Level 2</option>
            <option value="level_3">Level 3</option>
            <option value="summer">Summer</option>
            <option value="case">Case</option>
          </select>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-500 uppercase">Dept:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 dark:text-white font-bold outline-none"
          >
            <option value="all">All Depts</option>
            <option value="CS">CS (Computer Science)</option>
            <option value="AI">AI (Artificial Intelligence)</option>
            <option value="IS">IS (Information Systems)</option>
          </select>
        </div>

      </div>

      {/* Students Table */}
      <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] shadow-[6px_6px_0px_#000000] overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-black text-white uppercase text-[11px] border-b-2 border-black">
              <th className="p-3.5">Student Information</th>
              <th className="p-3.5">Academic Track</th>
              <th className="p-3.5">Semester & Courses</th>
              <th className="p-3.5">Contact</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-200 dark:divide-neutral-800">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-neutral-500">
                  No students found in your assigned academic domain.
                </td>
              </tr>
            ) : (
              filteredStudents.map(student => {
                const prof = student.academicProfile;
                const canEdit = isSuperAdmin || (prof && canAdministerScope(prof.level, prof.department));

                return (
                  <tr key={student.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors">
                    
                    {/* Student Info */}
                    <td className="p-3.5 space-y-0.5">
                      <p className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                        {student.name}
                      </p>
                      <p className="text-[11px] text-neutral-500 font-mono">
                        {student.email} • ID: {student.id}
                      </p>
                    </td>

                    {/* Academic Track */}
                    <td className="p-3.5 space-y-1">
                      <span className="font-bold uppercase text-[10px] bg-[#FFE600] text-black px-2 py-0.5 border border-black inline-block">
                        {prof?.level.replace('_', ' ')}
                      </span>
                      {prof?.department && (
                        <p className="text-[11px] text-neutral-700 dark:text-neutral-300 font-bold">
                          Track: {prof.department}
                        </p>
                      )}
                    </td>

                    {/* Courses */}
                    <td className="p-3.5 space-y-1">
                      <p className="font-bold text-neutral-900 dark:text-white">
                        {prof?.semester ? `Semester ${prof.semester}` : 'Summer Intensive'}
                      </p>
                      <span className="text-[11px] text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 border border-neutral-300 dark:border-neutral-700">
                        {prof?.selectedSubjectIds.length || 0} Enrolled Subjects
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="p-3.5 text-neutral-600 dark:text-neutral-300">
                      {student.phone || '—'}
                    </td>

                    {/* Action */}
                    <td className="p-3.5 text-right">
                      {canEdit ? (
                        <button
                          onClick={() => openEditModal(student)}
                          className="px-3 py-1.5 bg-white dark:bg-neutral-700 border border-black font-bold hover:bg-[#FFE600] text-black dark:text-white dark:hover:text-black transition-colors inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Scope</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-neutral-400 italic">
                          Locked Scope
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT STUDENT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[#FAF9F5] dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 p-6 sm:p-8 shadow-[8px_8px_0px_#000000] space-y-6">
            
            <div className="flex items-center justify-between border-b-2 border-black dark:border-neutral-700 pb-3">
              <div>
                <h2 className="font-display font-black text-2xl uppercase text-neutral-900 dark:text-white">
                  Update Student Academic Scope
                </h2>
                <p className="text-xs font-mono text-neutral-500">
                  Modifying {editingStudent.name} ({editingStudent.id})
                </p>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1 border border-black hover:bg-neutral-200 text-neutral-800 dark:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 font-mono text-xs">
              
              <div>
                <label className="block font-bold mb-1 uppercase">Academic Level *</label>
                <select
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value as AcademicLevel)}
                  className="neo-input dark:bg-neutral-900 dark:text-white"
                >
                  <option value="level_2">Level 2 (General CS)</option>
                  <option value="level_3">Level 3 (Department Specialization)</option>
                  <option value="summer">Summer Term (Up to 3 subjects)</option>
                  <option value="case">Case Study Plan (Up to 6 subjects)</option>
                </select>
              </div>

              {editLevel === 'level_3' && (
                <div>
                  <label className="block font-bold mb-1 uppercase">Department Specialization *</label>
                  <select
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value as any)}
                    className="neo-input dark:bg-neutral-900 dark:text-white"
                  >
                    <option value="CS">Computer Science (CS)</option>
                    <option value="AI">Artificial Intelligence (AI)</option>
                    <option value="IS">Information Systems (IS)</option>
                  </select>
                </div>
              )}

              {editLevel !== 'summer' && (
                <div>
                  <label className="block font-bold mb-1 uppercase">Semester *</label>
                  <select
                    value={editSem}
                    onChange={(e) => setEditSem(Number(e.target.value) as Semester)}
                    className="neo-input dark:bg-neutral-900 dark:text-white"
                  >
                    <option value={1}>Semester 1 (Fall)</option>
                    <option value={2}>Semester 2 (Spring)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold mb-1 uppercase">Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="neo-input dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t-2 border-black dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="neo-btn neo-btn-white dark:bg-neutral-800 dark:text-white px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neo-btn neo-btn-primary px-6 py-2 font-black"
                >
                  Save Academic Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
