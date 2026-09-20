import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AcademicLevel, Department, Semester } from '../../types';
import { UserPlus, ArrowRight, Layers, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, navigate, subjects } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Academic Selection State
  const [level, setLevel] = useState<AcademicLevel>('level_3');
  const [department, setDepartment] = useState<Department>('CS');
  const [semester, setSemester] = useState<Semester>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    register({
      name,
      email,
      phone,
      password,
      level,
      department: level === 'level_3' ? department : undefined,
      semester: level === 'summer' ? undefined : semester
    });
  };

  // Compute preview subjects based on selection
  const previewSubjects = subjects.filter(s => {
    if (level === 'level_2') return s.primaryLevel === 'level_2' && s.semester === semester;
    if (level === 'level_3') return s.primaryLevel === 'level_3' && s.department === department && s.semester === semester;
    return true;
  }).slice(0, 6);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-dot-pattern">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 p-6 sm:p-10 shadow-[8px_8px_0px_#000000]">
        
        {/* Header */}
        <div className="space-y-2 mb-8 border-b-2 border-black dark:border-neutral-700 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFE600] border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000000] text-black">
            <UserPlus className="w-3.5 h-3.5" />
            <span>STUDENT ENROLLMENT</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-neutral-900 dark:text-white">
            Create Student Account
          </h1>
          <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
            Select your academic level and department to configure your course material access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Personal Credentials */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-neutral-500 font-mono border-b border-black/10 dark:border-neutral-700 pb-1">
              1. Personal & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block font-bold mb-1 text-neutral-800 dark:text-neutral-200">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="neo-input dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-neutral-800 dark:text-neutral-200">
                  EMAIL *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="neo-input dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-neutral-800 dark:text-neutral-200">
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="neo-input dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-neutral-800 dark:text-neutral-200">
                  PASSWORD *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="neo-input dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Program Selection */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-neutral-500 font-mono border-b border-black/10 dark:border-neutral-700 pb-1">
              2. Academic Level & Program
            </h3>

            {/* Level Radio Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              {[
                { key: 'level_2', label: 'LEVEL 2', desc: 'Sem 1 / 2 (6 Subs)' },
                { key: 'level_3', label: 'LEVEL 3', desc: 'AI, CS, IS Tracks' },
                { key: 'summer', label: 'SUMMER', desc: 'Up to 3 Subjects' },
                { key: 'case', label: 'CASE', desc: 'Up to 6 / Sem' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => setLevel(item.key as AcademicLevel)}
                  className={`p-3 text-left border-2 transition-all cursor-pointer ${
                    level === item.key
                      ? 'bg-[#FFE600] text-black border-black shadow-[3px_3px_0px_#000000] font-bold'
                      : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-black dark:border-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <span className="block font-black text-sm">{item.label}</span>
                  <span className="text-[10px] opacity-80 mt-0.5 block">{item.desc}</span>
                </button>
              ))}
            </div>

            {/* Conditional Flow: LEVEL 3 Department Choice */}
            {level === 'level_3' && (
              <div className="p-4 bg-amber-50 dark:bg-neutral-800/80 border-2 border-black dark:border-neutral-700 space-y-3 font-mono text-xs">
                <label className="block font-bold text-neutral-900 dark:text-white uppercase">
                  Select Level 3 Department:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'AI', name: 'Artificial Intelligence', icon: '🤖' },
                    { key: 'CS', name: 'Computer Science', icon: '💻' },
                    { key: 'IS', name: 'Information Systems', icon: '📊' }
                  ].map((dept) => (
                    <button
                      type="button"
                      key={dept.key}
                      onClick={() => setDepartment(dept.key as Department)}
                      className={`p-3 text-left border-2 transition-all ${
                        department === dept.key
                          ? 'bg-black text-white border-black shadow-[3px_3px_0px_#FFE600] font-bold'
                          : 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border-black hover:bg-neutral-100'
                      }`}
                    >
                      <span className="text-base mr-1">{dept.icon}</span>
                      <span className="font-black">{dept.key}</span>
                      <span className="text-[10px] block opacity-80 truncate">{dept.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conditional Flow: Semester Choice (for Level 2, Level 3, Case) */}
            {level !== 'summer' && (
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/80 border-2 border-black dark:border-neutral-700 space-y-2 font-mono text-xs">
                <label className="block font-bold text-neutral-900 dark:text-white uppercase">
                  Select Semester:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 1, label: 'Semester 1 (Fall Term)' },
                    { key: 2, label: 'Semester 2 (Spring Term)' }
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.key}
                      onClick={() => setSemester(s.key as Semester)}
                      className={`p-2.5 text-center border-2 transition-all ${
                        semester === s.key
                          ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000000] font-bold'
                          : 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border-black hover:bg-neutral-100'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Summer Rule Notice */}
            {level === 'summer' && (
              <div className="p-4 bg-amber-100 dark:bg-amber-950/40 border-2 border-black text-xs font-mono text-neutral-900 dark:text-amber-200">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>SUMMER REGISTRATION RULE:</span>
                </div>
                <p>
                  In the Summer term, there is no semester split. You will be able to select <strong>up to 3 subjects</strong> from the entire 24-subject pool after account creation.
                </p>
              </div>
            )}

            {/* Preview of Subjects */}
            {(level === 'level_2' || level === 'level_3') && (
              <div className="p-4 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-neutral-500">
                  <span className="font-bold uppercase">Automated Enrollment ({previewSubjects.length} Core Subjects)</span>
                  <span>{level.toUpperCase()} {level === 'level_3' ? `• ${department}` : ''} • Sem {semester}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {previewSubjects.map((s) => (
                    <div key={s.id} className="p-2 border border-black/30 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-bold truncate">{s.code}: {s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t-2 border-black dark:border-neutral-700">
            <button
              type="submit"
              className="w-full neo-btn neo-btn-primary py-4 text-sm font-mono font-black flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000000]"
            >
              <span>Complete Registration & Open Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

        {/* Footer Link to Login */}
        <div className="mt-6 text-center font-mono text-xs text-neutral-600 dark:text-neutral-400">
          Already have an account?{' '}
          <button
            onClick={() => navigate('login')}
            className="font-bold text-black dark:text-[#FFE600] underline ml-1"
          >
            Sign In here →
          </button>
        </div>

      </div>
    </div>
  );
};
