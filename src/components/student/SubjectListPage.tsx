import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AcademicLevel, Department, Semester } from '../../types';
import { BookOpen, Search, Filter, Layers, ArrowRight, Sparkles } from 'lucide-react';

export const SubjectListPage: React.FC = () => {
  const { subjects, materials, navigate, currentUser } = useApp();

  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const filteredSubjects = useMemo(() => {
    return subjects.filter(sub => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesQuery = 
          sub.name.toLowerCase().includes(q) ||
          sub.code.toLowerCase().includes(q) ||
          sub.description.toLowerCase().includes(q) ||
          sub.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // Level
      if (levelFilter !== 'all' && sub.primaryLevel !== levelFilter) {
        return false;
      }

      // Department
      if (departmentFilter !== 'all' && sub.department !== departmentFilter) {
        return false;
      }

      return true;
    });
  }, [subjects, search, levelFilter, departmentFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b-2 border-black dark:border-neutral-700 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFE600] border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000000] text-black">
          <BookOpen className="w-3.5 h-3.5" />
          <span>COURSE CATALOG & CURRICULUM</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white uppercase tracking-tight">
          College Subjects Catalog
        </h1>
        <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
          Browse comprehensive university subjects across Level 2, Level 3 tracks (AI, CS, IS), Summer, and Case programs.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 p-4 shadow-[4px_4px_0px_#000000] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by subject code, title, topic or keywords..."
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
          </select>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-500 uppercase">Dept:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 dark:text-white font-bold outline-none"
          >
            <option value="all">All Depts</option>
            <option value="CS">CS (Computer Science)</option>
            <option value="AI">AI (Artificial Intelligence)</option>
            <option value="IS">IS (Information Systems)</option>
          </select>
        </div>

        {/* Results Counter */}
        <span className="bg-[#FFE600] text-black px-2.5 py-1 font-bold border border-black">
          {filteredSubjects.length} SUBJECTS
        </span>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map(sub => {
          const subMaterials = materials.filter(m => m.subjectId === sub.id && m.isPublished);

          return (
            <div
              key={sub.id}
              onClick={() => navigate('subject-details', sub.id)}
              className="neo-box-interactive p-6 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                
                {/* Badge Header */}
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs bg-black text-[#FFE600] px-2.5 py-1 border border-black shadow-[1.5px_1.5px_0px_#000000]">
                    {sub.code}
                  </span>

                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold">
                    <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2 py-0.5 border border-neutral-300 dark:border-neutral-700">
                      {sub.primaryLevel.toUpperCase()}
                      {sub.department ? ` · ${sub.department}` : ''}
                      {sub.semester ? ` · S${sub.semester}` : ''}
                    </span>
                  </div>
                </div>

                {/* Subject Name */}
                <h3 className="font-display font-bold text-xl text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-[#FFE600] transition-colors leading-tight">
                  {sub.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-3 leading-relaxed">
                  {sub.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sub.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-1.5 py-0.5 border border-neutral-200 dark:border-neutral-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom stats & action */}
              <div className="pt-4 border-t-2 border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono">
                <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 px-2 py-0.5 font-bold border border-amber-300 dark:border-amber-700">
                  {subMaterials.length} Link Materials
                </span>

                <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Subject →
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
