import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MaterialCard } from '../common/MaterialCard';
import { MaterialType } from '../../types';
import { 
  BookOpen, 
  Video, 
  FileText, 
  FileCheck, 
  BookMarked, 
  Book, 
  HelpCircle, 
  Sparkles, 
  ArrowLeft, 
  Plus, 
  ExternalLink,
  MessageSquare,
  Send,
  ShieldCheck,
  Link2
} from 'lucide-react';

type TabType = 'all' | 'video' | 'pdf' | 'exam' | 'summary' | 'book' | 'other' | 'questions';

export const SubjectDetailsPage: React.FC = () => {
  const { 
    selectedSubjectId, 
    getSubjectById, 
    materials, 
    questions, 
    askQuestion, 
    navigate,
    currentUser,
    canAdministerScope
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionContent, setQuestionContent] = useState('');

  const subject = selectedSubjectId ? getSubjectById(selectedSubjectId) : null;

  if (!subject) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4 font-mono">
        <h2 className="text-2xl font-bold font-display">Subject not found</h2>
        <button
          onClick={() => navigate('subjects')}
          className="neo-btn neo-btn-primary px-4 py-2 text-xs"
        >
          ← Back to Catalog
        </button>
      </div>
    );
  }

  // Filter materials for this subject
  const subjectMaterials = materials.filter(m => m.subjectId === subject.id && m.isPublished);

  const filteredMaterials = subjectMaterials.filter(m => {
    if (activeTab === 'all') return true;
    return m.type === activeTab;
  });

  // Filter questions for this subject
  const subjectQuestions = questions.filter(q => q.subjectId === subject.id);

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionTitle || !questionContent) return;
    askQuestion(subject.id, questionTitle, questionContent);
    setQuestionTitle('');
    setQuestionContent('');
    setIsAskingQuestion(false);
    setActiveTab('questions');
  };

  const isAuthorizedAdmin = currentUser && canAdministerScope(subject.primaryLevel, subject.department);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('subjects')}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold hover:underline text-neutral-600 dark:text-neutral-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Subjects Catalog</span>
        </button>

        {isAuthorizedAdmin && (
          <button
            onClick={() => navigate('admin-materials')}
            className="neo-btn neo-btn-primary px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Link Material to this Subject</span>
          </button>
        )}
      </div>

      {/* Subject Hero Card */}
      <div className="neo-box p-6 sm:p-8 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono font-black text-xs bg-black text-[#FFE600] px-2.5 py-1 border border-black shadow-[1.5px_1.5px_0px_#000000]">
            {subject.code}
          </span>
          <span className="text-xs font-mono font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 border border-black/20">
            {subject.primaryLevel.toUpperCase()}
            {subject.department ? ` · ${subject.department}` : ''}
            {subject.semester ? ` · Semester ${subject.semester}` : ''}
          </span>
          <span className="text-xs font-mono font-bold text-neutral-500">
            {subject.credits} Credit Hours
          </span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900 dark:text-white">
          {subject.name}
        </h1>

        <p className="text-sm font-sans text-neutral-700 dark:text-neutral-300 max-w-3xl leading-relaxed">
          {subject.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {subject.tags.map((t, idx) => (
            <span
              key={idx}
              className="text-[11px] font-mono font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 border border-neutral-300 dark:border-neutral-700"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Categorized Navigation Tabs (Videos, PDFs, Exams, Summaries, Books, Other, Questions) */}
      <div className="border-b-2 border-black dark:border-neutral-700 flex flex-wrap gap-2 pb-0">
        {[
          { key: 'all', label: `All Materials (${subjectMaterials.length})`, icon: <Sparkles className="w-3.5 h-3.5" /> },
          { key: 'video', label: `Videos (${subjectMaterials.filter(m => m.type === 'video').length})`, icon: <Video className="w-3.5 h-3.5" /> },
          { key: 'pdf', label: `PDFs (${subjectMaterials.filter(m => m.type === 'pdf').length})`, icon: <FileText className="w-3.5 h-3.5" /> },
          { key: 'exam', label: `Exams (${subjectMaterials.filter(m => m.type === 'exam').length})`, icon: <FileCheck className="w-3.5 h-3.5" /> },
          { key: 'summary', label: `Summaries (${subjectMaterials.filter(m => m.type === 'summary').length})`, icon: <BookMarked className="w-3.5 h-3.5" /> },
          { key: 'book', label: `Books (${subjectMaterials.filter(m => m.type === 'book').length})`, icon: <Book className="w-3.5 h-3.5" /> },
          { key: 'other', label: `Other (${subjectMaterials.filter(m => m.type === 'other').length})`, icon: <Link2 className="w-3.5 h-3.5" /> },
          { key: 'questions', label: `Q&A Forum (${subjectQuestions.length})`, icon: <HelpCircle className="w-3.5 h-3.5" /> }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabType)}
            className={`px-4 py-2.5 font-mono text-xs font-bold border-t-2 border-x-2 transition-all flex items-center gap-1.5 cursor-pointer -mb-[2px] ${
              activeTab === tab.key
                ? 'bg-[#FFE600] text-black border-black shadow-[2px_-2px_0px_#000000] z-10'
                : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-black dark:border-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Section based on active tab */}
      {activeTab !== 'questions' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500">
              [ STACKED LINK MATERIALS • NO RAW UPLOADS ]
            </span>
            <span className="font-mono text-xs text-neutral-500">
              Showing {filteredMaterials.length} resource{filteredMaterials.length === 1 ? '' : 's'}
            </span>
          </div>

          {filteredMaterials.length === 0 ? (
            <div className="p-12 border-2 border-black border-dashed bg-white dark:bg-[#1a1a1e] text-center space-y-3 font-mono text-xs text-neutral-500">
              <Sparkles className="w-8 h-8 mx-auto opacity-40" />
              <p className="font-bold">No {activeTab.toUpperCase()} materials posted yet for this subject.</p>
              <p>Department instructors will link verified external study materials soon.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMaterials.map(mat => (
                <MaterialCard 
                  key={mat.id} 
                  material={mat} 
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Q&A Questions Forum for this Subject */
        <div className="space-y-6">
          
          {/* Ask Question Toggle Header */}
          <div className="flex items-center justify-between bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 p-4 shadow-[3px_3px_0px_#000000]">
            <div>
              <h3 className="font-display font-black text-lg uppercase text-neutral-900 dark:text-white">
                Course Q&A Discussions
              </h3>
              <p className="text-xs font-mono text-neutral-500">
                Ask questions specific to {subject.name} curriculum. Verified answers are provided by department instructors.
              </p>
            </div>

            <button
              onClick={() => setIsAskingQuestion(!isAskingQuestion)}
              className="neo-btn neo-btn-primary px-4 py-2 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ask a Question</span>
            </button>
          </div>

          {/* Ask Question Form Drawer */}
          {isAskingQuestion && (
            <form onSubmit={handlePostQuestion} className="p-6 border-2 border-black bg-amber-50 dark:bg-neutral-800/90 shadow-[4px_4px_0px_#000000] space-y-4 font-mono text-xs">
              <h4 className="font-display font-black text-base uppercase text-neutral-900 dark:text-white">
                Submit a Question for {subject.name} Instructors
              </h4>

              <div>
                <label className="block font-bold mb-1 uppercase">Question Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  placeholder="e.g. When is Boyce-Codd Normal Form strictly required over 3NF?"
                  className="neo-input dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 uppercase">Detailed Explanation *</label>
                <textarea
                  rows={4}
                  required
                  value={questionContent}
                  onChange={(e) => setQuestionContent(e.target.value)}
                  placeholder="Explain your confusion, references to specific lectures, or code snippets..."
                  className="neo-input dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAskingQuestion(false)}
                  className="neo-btn neo-btn-white dark:bg-neutral-700 dark:text-white px-4 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neo-btn neo-btn-primary px-5 py-2 text-xs font-black flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Question</span>
                </button>
              </div>
            </form>
          )}

          {/* Questions Thread List */}
          <div className="space-y-4">
            {subjectQuestions.length === 0 ? (
              <div className="p-12 border-2 border-black border-dashed bg-white dark:bg-[#1a1a1e] text-center space-y-2 font-mono text-xs text-neutral-500">
                <HelpCircle className="w-8 h-8 mx-auto opacity-40" />
                <p className="font-bold">No questions asked yet for this subject.</p>
                <p>Be the first to post a conceptual query to the instructors!</p>
              </div>
            ) : (
              subjectQuestions.map(q => (
                <div
                  key={q.id}
                  className="p-6 border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#1a1a1e] shadow-[4px_4px_0px_#000000] space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-500">
                      Asked by <strong className="text-neutral-900 dark:text-white">{q.userName}</strong> • {new Date(q.createdAt).toLocaleDateString()}
                    </span>

                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${
                      q.status === 'answered'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-500'
                        : 'bg-amber-100 text-amber-800 border-amber-500'
                    }`}>
                      {q.status}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
                    {q.title}
                  </h3>

                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-mono">
                    {q.content}
                  </p>

                  {/* Answers section */}
                  {q.answers.length > 0 ? (
                    <div className="mt-4 pt-4 border-t-2 border-neutral-100 dark:border-neutral-800 space-y-3">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verified Instructor Answer:</span>
                      </span>

                      {q.answers.map(ans => (
                        <div key={ans.id} className="p-4 bg-neutral-50 dark:bg-neutral-800/80 border-2 border-black dark:border-neutral-700 space-y-2 font-mono text-xs">
                          <div className="flex items-center justify-between text-neutral-500">
                            <span className="font-bold text-neutral-900 dark:text-white">
                              {ans.authorName} ({ans.authorScope?.toUpperCase() || 'Instructor'})
                            </span>
                            <span>{new Date(ans.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans text-sm">
                            {ans.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pt-2 text-[11px] font-mono text-neutral-500 italic">
                      ⏳ Awaiting verified answer from department instructor...
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
