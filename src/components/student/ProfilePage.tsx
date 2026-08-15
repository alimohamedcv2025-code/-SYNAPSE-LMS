import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  GraduationCap, 
  Mail, 
  Phone, 
  Calendar, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, getSubjectsForStudent, navigate, showToast } = useApp();

  const profile = currentUser?.academicProfile;
  const enrolledSubjects = getSubjectsForStudent();

  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleUpdateContact = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Contact details updated successfully.', 'success');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b-2 border-black dark:border-neutral-700 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFE600] border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000000] text-black">
          <User className="w-3.5 h-3.5" />
          <span>STUDENT ACCOUNT & ACADEMIC STANDING</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white uppercase tracking-tight">
          Student Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Academic Credentials Card */}
        <div className="md:col-span-5 space-y-6">
          <div className="neo-box p-6 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 space-y-4">
            <div className="w-16 h-16 bg-[#FFE600] border-2 border-black flex items-center justify-center font-black text-2xl shadow-[3px_3px_0px_#000000]">
              {currentUser?.name.charAt(0)}
            </div>

            <div>
              <h2 className="font-display font-black text-2xl uppercase text-neutral-900 dark:text-white">
                {currentUser?.name}
              </h2>
              <span className="font-mono text-xs text-neutral-500 font-bold">
                ID: {currentUser?.id}
              </span>
            </div>

            <div className="pt-4 border-t-2 border-black/10 dark:border-neutral-700 space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                <span className="truncate">{currentUser?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>{currentUser?.phone || 'No phone on file'}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <GraduationCap className="w-4 h-4 text-neutral-400 shrink-0" />
                <span className="uppercase font-bold">{currentUser?.role.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Academic Standing Status Bento */}
          <div className="neo-box p-6 bg-[#FFE600] text-black border-2 border-black space-y-3">
            <span className="font-mono text-xs font-black uppercase tracking-wider">
              [ CURRICULUM ENROLLMENT ]
            </span>
            <h3 className="font-display font-black text-2xl uppercase">
              {profile?.level.replace('_', ' ')}
            </h3>
            {profile?.department && (
              <p className="text-xs font-mono font-bold">
                Department: {profile.department} (Specialized Track)
              </p>
            )}
            {profile?.semester && (
              <p className="text-xs font-mono font-bold">
                Term: Semester {profile.semester}
              </p>
            )}

            <div className="pt-2">
              <button
                onClick={() => navigate('subject-selection')}
                className="w-full neo-btn neo-btn-dark py-2 text-xs font-mono font-bold flex items-center justify-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Change Academic Program / Scope</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Enrolled Subject Details & Update Form */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Active Courses Box */}
          <div className="neo-box p-6 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black dark:border-neutral-700 pb-3">
              <h3 className="font-display font-black text-lg uppercase text-neutral-900 dark:text-white">
                Active Enrolled Courses ({enrolledSubjects.length})
              </h3>
              <button
                onClick={() => navigate('subject-selection')}
                className="text-xs font-mono font-bold text-neutral-800 dark:text-[#FFE600] underline"
              >
                Modify Courses →
              </button>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {enrolledSubjects.map(s => (
                <div
                  key={s.id}
                  onClick={() => navigate('subject-details', s.id)}
                  className="p-3 border-2 border-black dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 flex items-center justify-between hover:bg-amber-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors shadow-[2px_2px_0px_#000000]"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-black bg-black text-[#FFE600] px-1.5 py-0.5 text-[10px]">
                      {s.code}
                    </span>
                    <span className="font-bold text-neutral-900 dark:text-white truncate">
                      {s.name}
                    </span>
                  </div>
                  <span className="text-neutral-500 font-bold shrink-0">
                    {s.credits} Cr ↗
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Edit Form */}
          <div className="neo-box p-6 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 space-y-4">
            <h3 className="font-display font-black text-lg uppercase text-neutral-900 dark:text-white">
              Contact Preferences
            </h3>

            <form onSubmit={handleUpdateContact} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block font-bold mb-1 uppercase text-neutral-700 dark:text-neutral-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="neo-input dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="neo-btn neo-btn-primary px-5 py-2.5 font-black text-xs"
              >
                {isSaved ? 'Saved!' : 'Update Information'}
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
