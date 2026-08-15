import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Material, MaterialType, AcademicLevel, Department, Semester } from '../../types';
import { 
  FileText, 
  Plus, 
  Search, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Video, 
  FileCheck, 
  BookMarked, 
  Book, 
  Link2,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export const AdminMaterialsPage: React.FC = () => {
  const { 
    materials, 
    subjects, 
    addMaterial, 
    updateMaterial, 
    deleteMaterial, 
    currentUser, 
    canAdministerScope,
    showToast 
  } = useApp();

  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MaterialType>('video');
  const [targetLevel, setTargetLevel] = useState<AcademicLevel>('level_3');
  const [department, setDepartment] = useState<Department | 'none'>('CS');
  const [subjectId, setSubjectId] = useState('');
  const [semester, setSemester] = useState<Semester | 'none'>(1);
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  // Filter available subjects based on selected target level and department
  const filteredSubjectsForForm = useMemo(() => {
    return subjects.filter(s => {
      if (s.primaryLevel !== targetLevel && targetLevel !== 'summer' && targetLevel !== 'case') {
        return false;
      }
      if (targetLevel === 'level_3' && department !== 'none' && s.department !== department) {
        return false;
      }
      return true;
    });
  }, [subjects, targetLevel, department]);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setType('video');
    setTargetLevel('level_3');
    setDepartment('CS');
    setSubjectId(subjects[0]?.id || '');
    setSemester(1);
    setUrl('');
    setDescription('');
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (m: Material) => {
    // RBAC check
    if (!canAdministerScope(m.targetLevel, m.department)) {
      showToast('Access Denied: You cannot modify materials outside your academic scope.', 'error');
      return;
    }

    setEditingId(m.id);
    setTitle(m.title);
    setType(m.type);
    setTargetLevel(m.targetLevel);
    setDepartment(m.department || 'none');
    setSubjectId(m.subjectId);
    setSemester(m.semester || 'none');
    setUrl(m.url);
    setDescription(m.description);
    setIsPublished(m.isPublished);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || !subjectId) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    const finalDept = department === 'none' ? undefined : department;
    const finalSem = semester === 'none' ? undefined : (semester as Semester);

    // Permission check
    if (!canAdministerScope(targetLevel, finalDept)) {
      showToast(`Permission Error: Your admin role is not authorized for ${targetLevel.toUpperCase()}.`, 'error');
      return;
    }

    if (editingId) {
      updateMaterial(editingId, {
        title,
        type,
        targetLevel,
        department: finalDept,
        subjectId,
        semester: finalSem,
        url,
        description,
        isPublished
      });
    } else {
      addMaterial({
        title,
        type,
        targetLevel,
        department: finalDept,
        subjectId,
        semester: finalSem,
        url,
        description,
        isPublished
      });
    }

    setIsModalOpen(false);
  };

  // Filter materials table
  const displayedMaterials = useMemo(() => {
    return materials.filter(m => {
      // Scope constraint: show only scoped materials or all if super admin
      if (!isSuperAdmin && !canAdministerScope(m.targetLevel, m.department)) {
        return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const matches = 
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.subjectName.toLowerCase().includes(q) ||
          m.url.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (typeFilter !== 'all' && m.type !== typeFilter) return false;
      if (levelFilter !== 'all' && m.targetLevel !== levelFilter) return false;

      return true;
    });
  }, [materials, isSuperAdmin, canAdministerScope, search, typeFilter, levelFilter]);

  const getTypeIcon = (t: MaterialType) => {
    switch (t) {
      case 'video': return <Video className="w-3.5 h-3.5 text-rose-600" />;
      case 'pdf': return <FileText className="w-3.5 h-3.5 text-amber-600" />;
      case 'exam': return <FileCheck className="w-3.5 h-3.5 text-purple-600" />;
      case 'summary': return <BookMarked className="w-3.5 h-3.5 text-emerald-600" />;
      case 'book': return <Book className="w-3.5 h-3.5 text-sky-600" />;
      default: return <Link2 className="w-3.5 h-3.5 text-neutral-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-neutral-700 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFE600] border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000000] text-black">
            <FileText className="w-3.5 h-3.5" />
            <span>EXTERNAL LINK MATERIALS REPOSITORY</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white uppercase tracking-tight">
            Manage Link Materials
          </h1>
          <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
            Publish, edit, and organize link-based lecture videos, PDFs, past exam rubrics, and textbook companions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="neo-btn neo-btn-primary px-5 py-3 text-xs font-mono font-black flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000000] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Link Material</span>
        </button>
      </div>

      {/* Notice on 100% link based */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-2 border-black dark:border-amber-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-neutral-900 dark:text-amber-200 shadow-[3px_3px_0px_#000000]">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Zero File Upload Rule:</strong> All collegiate materials are external URLs (YouTube, Drive, GitHub, Stanford OCW). The system stores structured metadata and direct access links only.
          </span>
        </div>
        <span className="font-bold text-[10px] bg-black text-[#FFE600] px-2.5 py-1 shrink-0 border border-black">
          LINK ARCHITECTURE
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 p-4 shadow-[4px_4px_0px_#000000] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search materials by title, subject, or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border-2 border-black dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 outline-none"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-500 uppercase">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 dark:text-white font-bold outline-none"
          >
            <option value="all">All Types</option>
            <option value="video">Videos</option>
            <option value="pdf">PDFs</option>
            <option value="exam">Exams</option>
            <option value="summary">Summaries</option>
            <option value="book">Books</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-500 uppercase">Level:</span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 dark:text-white font-bold outline-none"
          >
            <option value="all">All Scopes</option>
            <option value="level_2">Level 2</option>
            <option value="level_3">Level 3</option>
            <option value="summer">Summer</option>
            <option value="case">Case</option>
          </select>
        </div>

        <span className="bg-[#FFE600] text-black px-2.5 py-1 font-bold border border-black">
          {displayedMaterials.length} MATERIALS
        </span>
      </div>

      {/* Materials Table / Stacked Card View */}
      <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] shadow-[6px_6px_0px_#000000] overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-black text-white uppercase text-[11px] border-b-2 border-black">
              <th className="p-3.5">Type & Title</th>
              <th className="p-3.5">Subject & Scope</th>
              <th className="p-3.5">External Resource Link</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-200 dark:divide-neutral-800">
            {displayedMaterials.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-neutral-500">
                  No link materials found matching your criteria.
                </td>
              </tr>
            ) : (
              displayedMaterials.map(m => {
                const canEdit = canAdministerScope(m.targetLevel, m.department);

                return (
                  <tr key={m.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors">
                    
                    {/* Title & Type */}
                    <td className="p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5">
                        {getTypeIcon(m.type)}
                        <span className="font-bold uppercase text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 border border-neutral-300 dark:border-neutral-700">
                          {m.type}
                        </span>
                      </div>
                      <p className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                        {m.title}
                      </p>
                      <p className="text-[11px] text-neutral-500 font-sans line-clamp-1">
                        {m.description}
                      </p>
                    </td>

                    {/* Subject & Scope */}
                    <td className="p-3.5 space-y-1">
                      <p className="font-bold text-neutral-900 dark:text-white">
                        {m.subjectName}
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        {m.targetLevel.toUpperCase()}
                        {m.department ? ` · ${m.department}` : ''}
                        {m.semester ? ` · Sem ${m.semester}` : ''}
                      </p>
                    </td>

                    {/* External Link */}
                    <td className="p-3.5">
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#1D4ED8] dark:text-blue-400 hover:underline max-w-[200px] truncate font-bold"
                        title={m.url}
                      >
                        <span className="truncate">{m.url}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </td>

                    {/* Publish Status */}
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase border ${
                        m.isPublished
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-600'
                          : 'bg-neutral-200 text-neutral-700 border-neutral-400'
                      }`}>
                        {m.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      {canEdit ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(m)}
                            className="p-1.5 bg-white dark:bg-neutral-700 border border-black hover:bg-[#FFE600] text-black dark:text-white dark:hover:text-black transition-colors"
                            title="Edit Material"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteMaterial(m.id)}
                            className="p-1.5 bg-white dark:bg-neutral-700 border border-black hover:bg-red-500 hover:text-white text-red-600 transition-colors"
                            title="Delete Material"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-neutral-400 font-mono italic">
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

      {/* CREATE / EDIT MATERIAL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-[#FAF9F5] dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 p-6 sm:p-8 shadow-[8px_8px_0px_#000000] max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-black dark:border-neutral-700 pb-3">
              <div>
                <h2 className="font-display font-black text-2xl uppercase text-neutral-900 dark:text-white">
                  {editingId ? 'Edit Link-Based Material' : 'Add New Link-Based Material'}
                </h2>
                <p className="text-xs font-mono text-neutral-500">
                  Zero upload architecture • Stored as external URL with metadata
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 border border-black hover:bg-neutral-200 text-neutral-800 dark:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4 font-mono text-xs">
              
              <div>
                <label className="block font-bold mb-1 uppercase">Material Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Normalization Masterclass: 1NF to BCNF"
                  className="neo-input dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block font-bold mb-1 uppercase">Material Type *</label>
                  <select
                    required
                    value={type}
                    onChange={(e) => setType(e.target.value as MaterialType)}
                    className="neo-input dark:bg-neutral-900 dark:text-white"
                  >
                    <option value="video">Video (Lecture / Tutorial)</option>
                    <option value="pdf">PDF (Slides / Lecture Notes)</option>
                    <option value="exam">Exam (Past Papers & Rubrics)</option>
                    <option value="summary">Summary (Revision Cheatsheet)</option>
                    <option value="book">Book (Textbook Companion)</option>
                    <option value="other">Other (Lab / Simulator / Repo)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase">Target Level *</label>
                  <select
                    required
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value as AcademicLevel)}
                    className="neo-input dark:bg-neutral-900 dark:text-white"
                  >
                    <option value="level_2">Level 2</option>
                    <option value="level_3">Level 3</option>
                    <option value="level_4">Level 4</option>
                    <option value="summer">Summer</option>
                    <option value="case">Case</option>
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div>
                  <label className="block font-bold mb-1 uppercase">Department (Optional)</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="neo-input dark:bg-neutral-900 dark:text-white"
                  >
                    <option value="none">None (General)</option>
                    <option value="CS">CS (Computer Science)</option>
                    <option value="AI">AI (Artificial Intelligence)</option>
                    <option value="IS">IS (Information Systems)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase">Semester (Optional)</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value === 'none' ? 'none' : Number(e.target.value) as Semester)}
                    className="neo-input dark:bg-neutral-900 dark:text-white"
                  >
                    <option value="none">None / Summer</option>
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase">Attach to Subject *</label>
                  <select
                    required
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="neo-input dark:bg-neutral-900 dark:text-white"
                  >
                    {filteredSubjectsForForm.length === 0 ? (
                      <option value="">No subjects match filter</option>
                    ) : (
                      filteredSubjectsForForm.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.code}: {s.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

              </div>

              <div>
                <label className="block font-bold mb-1 uppercase">
                  External Resource URL * (YouTube, Google Drive, Stanford OCW, GitHub, etc.)
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtu.be/... or https://drive.google.com/..."
                  className="neo-input dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 uppercase">Description / Overview *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief synopsis of topics covered in this link resource..."
                  className="neo-input dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                <label htmlFor="pub-check" className="font-bold cursor-pointer uppercase">
                  Publish Immediately for Students
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t-2 border-black dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="neo-btn neo-btn-white dark:bg-neutral-800 dark:text-white px-5 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neo-btn neo-btn-primary px-7 py-2.5 font-black flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingId ? 'Update Material' : 'Publish Link Material'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
