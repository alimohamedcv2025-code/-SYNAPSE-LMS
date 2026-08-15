import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Subject, AcademicLevel, Department, Semester } from '../../types';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  ShieldCheck 
} from 'lucide-react';

export const AdminSubjectsPage: React.FC = () => {
  const { 
    subjects, 
    addSubject, 
    updateSubject, 
    deleteSubject, 
    currentUser, 
    canAdministerScope,
    showToast,
    materials 
  } = useApp();

  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Search & Filter
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  // Form fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [primaryLevel, setPrimaryLevel] = useState<AcademicLevel>('level_3');
  const [department, setDepartment] = useState<Department | 'none'>('CS');
  const [semester, setSemester] = useState<Semester | 'none'>(1);
  const [credits, setCredits] = useState(3);
  const [tagsStr, setTagsStr] = useState('');

  const scopedSubjects = useMemo(() => {
    return subjects.filter(s => {
      if (!isSuperAdmin && !canAdministerScope(s.primaryLevel, s.department)) {
        return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const matches = 
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (levelFilter !== 'all' && s.primaryLevel !== levelFilter) return false;
      if (deptFilter !== 'all' && s.department !== deptFilter) return false;

      return true;
    });
  }, [subjects, isSuperAdmin, canAdministerScope, search, levelFilter, deptFilter]);

  const openCreateModal = () => {
    setEditingSubjectId(null);
    setCode('');
    setName('');
    setDescription('');
    setPrimaryLevel('level_3');
    setDepartment('CS');
    setSemester(1);
    setCredits(3);
    setTagsStr('');
    setIsModalOpen(true);
  };

  const openEditModal = (s: Subject) => {
    if (!isSuperAdmin && !canAdministerScope(s.primaryLevel, s.department)) {
      showToast('Scope Error: You cannot edit subjects outside your domain.', 'error');
      return;
    }

    setEditingSubjectId(s.id);
    setCode(s.code);
    setName(s.name);
    setDescription(s.description);
    setPrimaryLevel(s.primaryLevel);
    setDepartment(s.department || 'none');
    setSemester(s.semester || 'none');
    setCredits(s.credits);
    setTagsStr(s.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !description) return;

    const dept = department === 'none' ? undefined : department;
    const sem = semester === 'none' ? undefined : (semester as Semester);
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

    // Permission check
    if (!canAdministerScope(primaryLevel, dept)) {
      showToast(`Permission Error: Your role is not authorized for ${primaryLevel.toUpperCase()}.`, 'error');
      return;
    }

    if (editingSubjectId) {
      updateSubject(editingSubjectId, {
        code,
        name,
        description,
        primaryLevel,
        department: dept,
        semester: sem,
        credits: Number(credits),
        tags
      });
    } else {
      addSubject({
        code,
        name,
        description,
        primaryLevel,
        department: dept,
        semester: sem,
        credits: Number(credits),
        tags
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-neutral-700 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFE600] border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000000] text-black">
            <BookOpen className="w-3.5 h-3.5" />
            <span>CURRICULUM CATALOG GOVERNANCE</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white uppercase tracking-tight">
            Academic Course Catalog
          </h1>
          <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
            Define college subjects, credit units, departmental affiliations, and term requirements.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="neo-btn neo-btn-primary px-5 py-3 text-xs font-mono font-black flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000000] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 p-4 shadow-[4px_4px_0px_#000000] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search subjects by code, name, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border-2 border-black dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 outline-none"
          />
        </div>

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

        <span className="bg-[#FFE600] text-black px-2.5 py-1 font-bold border border-black">
          {scopedSubjects.length} SUBJECTS
        </span>
      </div>

      {/* Subjects Table */}
      <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] shadow-[6px_6px_0px_#000000] overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-black text-white uppercase text-[11px] border-b-2 border-black">
              <th className="p-3.5">Code & Subject Name</th>
              <th className="p-3.5">Level & Dept</th>
              <th className="p-3.5">Semester & Credits</th>
              <th className="p-3.5">Link Resources</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-200 dark:divide-neutral-800">
            {scopedSubjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-neutral-500">
                  No subjects found in your academic administrative domain.
                </td>
              </tr>
            ) : (
              scopedSubjects.map(sub => {
                const subMaterials = materials.filter(m => m.subjectId === sub.id);
                const canEdit = isSuperAdmin || canAdministerScope(sub.primaryLevel, sub.department);

                return (
                  <tr key={sub.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors">
                    
                    {/* Code & Name */}
                    <td className="p-3.5 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black bg-black text-[#FFE600] px-2 py-0.5 text-[11px] border border-black">
                          {sub.code}
                        </span>
                        <span className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                          {sub.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-sans line-clamp-1 max-w-md">
                        {sub.description}
                      </p>
                    </td>

                    {/* Level & Dept */}
                    <td className="p-3.5 space-y-0.5">
                      <span className="font-bold uppercase text-[10px] bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 border border-black/20">
                        {sub.primaryLevel.toUpperCase()}
                      </span>
                      {sub.department && (
                        <p className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
                          Dept: {sub.department}
                        </p>
                      )}
                    </td>

                    {/* Sem & Credits */}
                    <td className="p-3.5 space-y-0.5">
                      <p className="font-bold text-neutral-900 dark:text-white">
                        {sub.semester ? `Semester ${sub.semester}` : 'All Terms'}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        {sub.credits} Credit Hours
                      </p>
                    </td>

                    {/* Resources */}
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-400 text-[10px] font-bold">
                        {subMaterials.length} Link Materials
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      {canEdit ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(sub)}
                            className="p-1.5 bg-white dark:bg-neutral-700 border border-black hover:bg-[#FFE600] text-black dark:text-white dark:hover:text-black transition-colors"
                            title="Edit Subject"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteSubject(sub.id)}
                            className="p-1.5 bg-white dark:bg-neutral-700 border border-black hover:bg-red-500 hover:text-white text-red-600 transition-colors"
                            title="Delete Subject"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-neutral-400 italic">Locked</span>
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT SUBJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-[#FAF9F5] dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 p-6 sm:p-8 shadow-[8px_8px_0px_#000000] max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b-2 border-black dark:border-neutral-700 pb-3">
              <div>
                <h2 className="font-display font-black text-2xl uppercase text-neutral-900 dark:text-white">
                  {editingSubjectId ? 'Edit Course Subject' : 'Add New Course Subject'}
                </h2>
                <p className="text-xs font-mono text-neutral-500">
                  College curriculum syllabus database
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 border border-black hover:bg-neutral-200 text-neutral-800 dark:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1 uppercase">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. CS301"
                    className="neo-input dark:bg-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase">Subject Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Database Systems"
                    className="neo-input dark:bg-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold mb-1 uppercase">Primary Level *</label>
                  <select
                    value={primaryLevel}
                    onChange={(e) => setPrimaryLevel(e.target.value as AcademicLevel)}
                    className="neo-input dark:bg-neutral-900 dark:text-white"
                  >
                    <option value="level_2">Level 2</option>
                    <option value="level_3">Level 3</option>
                    <option value="summer">Summer</option>
                    <option value="case">Case</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="neo-input dark:bg-neutral-900 dark:text-white"
                  >
                    <option value="none">General (All Depts)</option>
                    <option value="CS">CS (Computer Science)</option>
                    <option value="AI">AI (Artificial Intelligence)</option>
                    <option value="IS">IS (Information Systems)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value === 'none' ? 'none' : Number(e.target.value) as Semester)}
                    className="neo-input dark:bg-neutral-900 dark:text-white"
                  >
                    <option value="none">No Specific Semester</option>
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1 uppercase">Credit Units</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    className="neo-input dark:bg-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase">Topic Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tagsStr}
                    onChange={(e) => setTagsStr(e.target.value)}
                    placeholder="sql, normalization, indexing, acid"
                    className="neo-input dark:bg-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 uppercase">Subject Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Syllabus overview and learning objectives..."
                  className="neo-input dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t-2 border-black dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="neo-btn neo-btn-white dark:bg-neutral-800 dark:text-white px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neo-btn neo-btn-primary px-6 py-2 font-black"
                >
                  {editingSubjectId ? 'Update Subject' : 'Save Subject to Catalog'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
