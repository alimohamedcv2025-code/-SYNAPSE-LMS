import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, navigate, switchUser, users } = useApp();
  const [email, setEmail] = useState('ahmed.mansoor@college.edu');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-dot-pattern">
      <div className="w-full max-w-md bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 p-8 shadow-[8px_8px_0px_#000000]">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFE600] border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000000] text-black">
            <Lock className="w-3.5 h-3.5" />
            <span>SECURE ACADEMIC LOGIN</span>
          </div>
          <h1 className="font-display font-black text-3xl uppercase tracking-tight text-neutral-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
            Sign in to access your scoped subjects and link materials.
          </p>
        </div>

        {/* Demo Fast Logins */}
        <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-950/40 border border-black dark:border-amber-700 space-y-2">
          <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-neutral-800 dark:text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Instant Demo Accounts:</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
            <button
              type="button"
              onClick={() => { switchUser('usr_student_1'); }}
              className="p-1.5 bg-white dark:bg-neutral-800 border border-black text-left hover:bg-[#FFE600] dark:hover:bg-[#FFE600] dark:hover:text-black font-bold truncate"
            >
              🎓 Student (L3 CS)
            </button>
            <button
              type="button"
              onClick={() => { switchUser('usr_student_2'); }}
              className="p-1.5 bg-white dark:bg-neutral-800 border border-black text-left hover:bg-[#FFE600] dark:hover:bg-[#FFE600] dark:hover:text-black font-bold truncate"
            >
              ☀️ Student (Summer)
            </button>
            <button
              type="button"
              onClick={() => { switchUser('usr_admin_l3'); }}
              className="p-1.5 bg-white dark:bg-neutral-800 border border-black text-left hover:bg-blue-300 dark:hover:bg-blue-400 dark:hover:text-black font-bold truncate"
            >
              🛡️ Admin (Level 3)
            </button>
            <button
              type="button"
              onClick={() => { switchUser('usr_super_admin'); }}
              className="p-1.5 bg-white dark:bg-neutral-800 border border-black text-left hover:bg-purple-300 dark:hover:bg-purple-400 dark:hover:text-black font-bold truncate"
            >
              👑 Super Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block font-bold text-neutral-800 dark:text-neutral-200 uppercase mb-1">
              Institutional Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="neo-input dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-800 dark:text-neutral-200 uppercase mb-1">
              Password
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

          <div className="pt-2">
            <button
              type="submit"
              className="w-full neo-btn neo-btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Bottom Switch to Register */}
        <div className="mt-6 pt-4 border-t-2 border-neutral-100 dark:border-neutral-800 text-center font-mono text-xs">
          <p className="text-neutral-600 dark:text-neutral-400">
            Don't have an academic account yet?{' '}
            <button
              onClick={() => navigate('register')}
              className="font-bold text-black dark:text-[#FFE600] underline hover:opacity-80 ml-1"
            >
              Register Now →
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
