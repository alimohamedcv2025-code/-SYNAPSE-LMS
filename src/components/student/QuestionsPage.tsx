import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HelpCircle, 
  Plus, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Search, 
  Filter, 
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const QuestionsPage: React.FC = () => {
  const { 
    questions, 
    subjects, 
    askQuestion, 
    answerQuestion, 
    updateQuestionStatus, 
    currentUser, 
    canAdministerScope,
    selectedQuestionId,
    setSelectedQuestionId 
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'answered'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  
  // Ask Question Form State
  const [isAsking, setIsAsking] = useState(false);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Admin Reply State
  const [replyingToId, setReplyingToId] = useState<string | null>(selectedQuestionId || null);
  const [adminAnswerText, setAdminAnswerText] = useState('');

  const isInstructor = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      if (search.trim()) {
        const query = search.toLowerCase();
        const matches = 
          q.title.toLowerCase().includes(query) ||
          q.content.toLowerCase().includes(query) ||
          q.subjectName.toLowerCase().includes(query) ||
          q.userName.toLowerCase().includes(query);
        if (!matches) return false;
      }

      if (statusFilter !== 'all' && q.status !== statusFilter) {
        return false;
      }

      if (subjectFilter !== 'all' && q.subjectId !== subjectFilter) {
        return false;
      }

      return true;
    });
  }, [questions, search, statusFilter, subjectFilter]);

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !subjectId) return;
    askQuestion(subjectId, title, content);
    setTitle('');
    setContent('');
    setIsAsking(false);
  };

  const handleAnswerSubmit = (qId: string) => {
    if (!adminAnswerText.trim()) return;
    answerQuestion(qId, adminAnswerText);
    setAdminAnswerText('');
    setReplyingToId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-neutral-700 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFE600] border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000000] text-black">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>COLLEGIATE Q&A COMMUNITY</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white uppercase tracking-tight">
            Academic Q&A Forum
          </h1>
          <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
            Submit conceptual questions directly to department faculty and browse verified model solutions.
          </p>
        </div>

        <button
          onClick={() => setIsAsking(!isAsking)}
          className="neo-btn neo-btn-primary px-5 py-3 text-xs font-mono font-black flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000000] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Question</span>
        </button>
      </div>

      {/* Ask Question Box */}
      {isAsking && (
        <form onSubmit={handleAskSubmit} className="neo-box p-6 bg-amber-50 dark:bg-neutral-800 border-2 border-black dark:border-neutral-700 space-y-4 font-mono text-xs shadow-[6px_6px_0px_#000000]">
          <div className="flex items-center justify-between border-b-2 border-black dark:border-neutral-700 pb-2">
            <h3 className="font-display font-black text-lg uppercase text-neutral-900 dark:text-white">
              Ask Course Instructors
            </h3>
            <span className="text-[10px] text-neutral-500">Verified by department scope</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1 uppercase">Select Subject *</label>
              <select
                required
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="neo-input dark:bg-neutral-900 dark:text-white"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code}: {s.name} ({s.primaryLevel.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1 uppercase">Question Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Asymptotic complexity of AVL rotation"
                className="neo-input dark:bg-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1 uppercase">Detailed Description *</label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="State your question with any relevant formulas or problem context..."
              className="neo-input dark:bg-neutral-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAsking(false)}
              className="neo-btn neo-btn-white dark:bg-neutral-700 dark:text-white px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="neo-btn neo-btn-primary px-6 py-2 font-black flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Question</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 p-4 shadow-[4px_4px_0px_#000000] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions by keyword, topic, or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border-2 border-black dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-500 uppercase">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 dark:text-white font-bold outline-none"
          >
            <option value="all">All Inquiries</option>
            <option value="pending">Pending Answers</option>
            <option value="answered">Answered by Instructors</option>
          </select>
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-500 uppercase">Subject:</span>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 dark:text-white font-bold outline-none max-w-[200px]"
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.code}: {s.name}</option>
            ))}
          </select>
        </div>

        <span className="bg-[#FFE600] text-black px-2.5 py-1 font-bold border border-black">
          {filteredQuestions.length} QUESTIONS
        </span>
      </div>

      {/* Questions Thread List */}
      <div className="space-y-5">
        {filteredQuestions.length === 0 ? (
          <div className="p-16 border-2 border-black border-dashed bg-white dark:bg-[#1a1a1e] text-center space-y-3 font-mono text-xs text-neutral-500">
            <HelpCircle className="w-8 h-8 mx-auto opacity-40" />
            <p className="font-bold text-sm">No questions match your current filter.</p>
            <p>Try resetting filters or post a new question to the college faculty.</p>
          </div>
        ) : (
          filteredQuestions.map(q => {
            const hasScopeAccess = isInstructor && canAdministerScope(q.targetLevel, q.department);

            return (
              <div
                key={q.id}
                className="neo-box p-6 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 space-y-4"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-black text-[#FFE600] px-2 py-0.5 border border-black">
                      {q.subjectName}
                    </span>
                    <span className="font-mono text-xs text-neutral-500">
                      Asked by <strong>{q.userName}</strong> • {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 text-xs font-mono font-bold uppercase border-2 shadow-[1.5px_1.5px_0px_#000000] ${
                    q.status === 'answered'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                      : 'bg-amber-100 text-amber-900 border-amber-800 dark:bg-amber-950 dark:text-amber-200'
                  }`}>
                    {q.status === 'answered' ? '✓ ANSWERED' : '⏳ PENDING'}
                  </span>
                </div>

                {/* Title & Body */}
                <div className="space-y-2">
                  <h3 className="font-display font-black text-xl text-neutral-900 dark:text-white leading-tight">
                    {q.title}
                  </h3>
                  <p className="text-sm font-sans text-neutral-800 dark:text-neutral-200 leading-relaxed bg-neutral-50 dark:bg-neutral-900/60 p-4 border border-black/10 dark:border-neutral-800">
                    {q.content}
                  </p>
                </div>

                {/* Verified Answers Feed */}
                {q.answers.length > 0 && (
                  <div className="mt-4 pt-4 border-t-2 border-neutral-100 dark:border-neutral-800 space-y-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verified Faculty Answers ({q.answers.length}):</span>
                    </span>

                    {q.answers.map(ans => (
                      <div
                        key={ans.id}
                        className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-600 dark:border-emerald-800 space-y-2 font-mono text-xs shadow-[2px_2px_0px_#059669]"
                      >
                        <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
                          <span className="font-bold text-neutral-900 dark:text-white">
                            🎓 {ans.authorName} [{ans.authorScope?.toUpperCase() || 'Instructor'}]
                          </span>
                          <span>{new Date(ans.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-neutral-900 dark:text-neutral-100 font-sans text-sm leading-relaxed">
                          {ans.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Instructor Action: Write Answer */}
                {hasScopeAccess && (
                  <div className="pt-3 border-t border-black/10 dark:border-neutral-800">
                    {replyingToId === q.id ? (
                      <div className="space-y-3 p-4 bg-amber-50 dark:bg-neutral-800 border-2 border-black font-mono text-xs">
                        <label className="block font-bold uppercase">Provide Official Model Solution / Answer:</label>
                        <textarea
                          rows={3}
                          value={adminAnswerText}
                          onChange={(e) => setAdminAnswerText(e.target.value)}
                          placeholder="Write clear, pedagogical explanation for the student..."
                          className="neo-input dark:bg-neutral-900 dark:text-white"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => { setReplyingToId(null); setAdminAnswerText(''); }}
                            className="neo-btn neo-btn-white dark:bg-neutral-700 px-3 py-1.5 text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAnswerSubmit(q.id)}
                            className="neo-btn neo-btn-primary px-4 py-1.5 text-xs font-bold"
                          >
                            Submit Answer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingToId(q.id)}
                        className="neo-btn neo-btn-primary px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Answer this question as Faculty</span>
                      </button>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
