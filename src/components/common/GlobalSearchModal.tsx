import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, BookOpen, ExternalLink, HelpCircle, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    materials,
    questions,
    navigate,
    getCatalogSubjectsForStudent
  } = useApp();

  const [query, setQuery] = useState('');

  const visibleSubjects = useMemo(() => getCatalogSubjectsForStudent(), [getCatalogSubjectsForStudent]);

  const filteredSubjects = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return visibleSubjects.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 4);
  }, [visibleSubjects, query]);

  const visibleSubjectIds = useMemo(() => new Set(visibleSubjects.map(s => s.id)), [visibleSubjects]);

  const filteredMaterials = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return materials.filter(m =>
      (m.title.toLowerCase().includes(q) ||
       m.description.toLowerCase().includes(q) ||
       m.subjectName.toLowerCase().includes(q)) &&
      visibleSubjectIds.has(m.subjectId)
    ).slice(0, 5);
  }, [materials, query, visibleSubjectIds]);

  const filteredQuestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return questions.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.content.toLowerCase().includes(q) ||
      item.subjectName.toLowerCase().includes(q)
    ).slice(0, 3);
  }, [questions, query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-[#FAF9F5] dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 shadow-[8px_8px_0px_#000000] p-6 animate-in fade-in zoom-in duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-3 shadow-[3px_3px_0px_#000000]">
          <Search className="w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search subjects, video lectures, exam papers, notes, or questions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent outline-none font-mono text-sm text-neutral-900 dark:text-white placeholder-neutral-400"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-xs font-mono text-neutral-400 hover:text-black dark:hover:text-white"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="mt-5 max-h-[60vh] overflow-y-auto space-y-5 font-mono text-xs">
          {!query.trim() ? (
            <div className="py-8 text-center text-neutral-500 dark:text-neutral-400 space-y-2">
              <p className="font-bold text-sm">Type keywords to search across college catalog</p>
              <p className="text-xs">Examples: "Normalization", "Operating Systems", "TCP Handshake", "Midterm"</p>
            </div>
          ) : filteredSubjects.length === 0 && filteredMaterials.length === 0 && filteredQuestions.length === 0 ? (
            <div className="py-8 text-center text-neutral-500 dark:text-neutral-400">
              <p className="font-bold">No results found matching "{query}"</p>
              <p className="text-xs mt-1">Try searching by topic, subject code, or resource type.</p>
            </div>
          ) : (
            <>
              {/* Subjects Matches */}
              {filteredSubjects.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Subjects ({filteredSubjects.length})</span>
                  </div>
                  <div className="space-y-2">
                    {filteredSubjects.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate('subject-details', sub.id);
                        }}
                        className="w-full text-left p-3 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-[#FFE600] dark:hover:bg-[#FFE600] dark:hover:text-black transition-colors shadow-[2px_2px_0px_#000000] flex items-center justify-between group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black font-mono text-xs">{sub.code}</span>
                            <span className="font-bold font-display">{sub.name}</span>
                          </div>
                          <p className="text-[11px] opacity-75 line-clamp-1 mt-0.5">{sub.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials Matches */}
              {filteredMaterials.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Link-Based Materials ({filteredMaterials.length})</span>
                  </div>
                  <div className="space-y-2">
                    {filteredMaterials.map(mat => (
                      <div
                        key={mat.id}
                        className="p-3 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-[2px_2px_0px_#000000] flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-black text-[#FFE600] text-[9px] font-bold px-1.5 py-0.5 uppercase">
                              {mat.type}
                            </span>
                            <span className="font-bold text-neutral-900 dark:text-white font-display text-sm">{mat.title}</span>
                          </div>
                          <p className="text-[11px] text-neutral-600 dark:text-neutral-300 line-clamp-1">{mat.description}</p>
                          <span className="text-[10px] text-neutral-500">{mat.subjectName} · {mat.provider}</span>
                        </div>
                        <a
                          href={mat.url}
                          target="_blank"
                          rel="noreferrer"
                          className="neo-btn neo-btn-primary px-3 py-1 text-xs shrink-0"
                        >
                          Open ↗
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions Matches */}
              {filteredQuestions.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Q&A Community Questions ({filteredQuestions.length})</span>
                  </div>
                  <div className="space-y-2">
                    {filteredQuestions.map(q => (
                      <button
                        key={q.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate('questions', undefined, q.id);
                        }}
                        className="w-full text-left p-3 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 shadow-[2px_2px_0px_#000000] flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white">{q.title}</p>
                          <span className="text-[10px] text-neutral-500">{q.subjectName} · {q.answers.length} instructor answers</span>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                          q.status === 'answered' ? 'bg-emerald-100 text-emerald-800 border-emerald-500' : 'bg-amber-100 text-amber-800 border-amber-500'
                        }`}>
                          {q.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="mt-5 pt-3 border-t-2 border-black/10 dark:border-neutral-700 flex justify-between items-center text-[10px] font-mono text-neutral-500">
          <span>Search links only • Zero upload footprint</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
