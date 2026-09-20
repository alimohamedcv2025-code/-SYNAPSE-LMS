import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, navigate } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(email, password);
    setIsSubmitting(false);
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block font-bold text-neutral-800 dark:text-neutral-200 uppercase mb-1">
              Email
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
