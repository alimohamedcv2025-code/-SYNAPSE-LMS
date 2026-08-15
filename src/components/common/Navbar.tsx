import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  LayoutDashboard, 
  Layers, 
  HelpCircle, 
  User as UserIcon, 
  ShieldAlert, 
  FolderPlus, 
  Users, 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  LogOut, 
  Sliders, 
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    activePage, 
    navigate, 
    logout, 
    unreadNotificationCount, 
    setIsNotificationsOpen, 
    setIsSearchOpen, 
    darkMode, 
    toggleDarkMode 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isStudent = currentUser?.role === 'student';
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';
  const isSuperAdmin = currentUser?.role === 'super_admin';

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5] dark:bg-[#121316] border-b-2 border-black dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Logo & Scope Tag */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(currentUser ? (isStudent ? 'student-dashboard' : 'admin-dashboard') : 'landing')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-10 h-10 bg-[#FFE600] border-2 border-black flex items-center justify-center font-black text-black text-xl shadow-[2px_2px_0px_#000000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
                S
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-xl tracking-tight text-neutral-900 dark:text-white">
                    SYNAPSE
                  </span>
                  <span className="bg-black text-[#FFE600] text-[10px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-wider">
                    LMS
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 block -mt-1 font-semibold">
                  COLLEGE LEARNING PLATFORM
                </span>
              </div>
            </button>

            {/* Scope Badge if Admin */}
            {isAdmin && (
              <div className="hidden lg:flex items-center gap-1 ml-3 px-2 py-1 bg-amber-100 dark:bg-amber-950/60 border border-black dark:border-amber-700 text-neutral-900 dark:text-amber-200 text-xs font-mono font-bold shadow-[2px_2px_0px_#000000]">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>
                  {isSuperAdmin 
                    ? 'SUPER ADMIN [GLOBAL]' 
                    : `SCOPE: ${currentUser?.adminScope?.toUpperCase()}`}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {!currentUser ? (
              <>
                <button
                  onClick={() => navigate('landing')}
                  className={`px-3 py-2 text-sm font-bold transition-colors ${
                    activePage === 'landing'
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => navigate('login')}
                  className="px-4 py-2 text-sm font-bold text-neutral-900 dark:text-white hover:underline font-mono"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate('register')}
                  className="neo-btn neo-btn-primary px-4 py-2 text-sm ml-2"
                >
                  Join Platform →
                </button>
              </>
            ) : isStudent ? (
              <>
                <button
                  onClick={() => navigate('student-dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold border-2 transition-all ${
                    activePage === 'student-dashboard'
                      ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000000]'
                      : 'border-transparent text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-neutral-700'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>

                <button
                  onClick={() => navigate('subjects')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold border-2 transition-all ${
                    activePage === 'subjects' || activePage === 'subject-details'
                      ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000000]'
                      : 'border-transparent text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-neutral-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  My Subjects
                </button>

                <button
                  onClick={() => navigate('subject-selection')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold border-2 transition-all ${
                    activePage === 'subject-selection'
                      ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000000]'
                      : 'border-transparent text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-neutral-700'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Academic Selection
                </button>

                <button
                  onClick={() => navigate('questions')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold border-2 transition-all ${
                    activePage === 'questions'
                      ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000000]'
                      : 'border-transparent text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-neutral-700'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  Q&A Questions
                </button>

                <button
                  onClick={() => navigate('profile')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold border-2 transition-all ${
                    activePage === 'profile'
                      ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000000]'
                      : 'border-transparent text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-neutral-700'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  Profile
                </button>
              </>
            ) : (
              // Admin Navigation
              <>
                <button
                  onClick={() => navigate('admin-dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold border-2 transition-all ${
                    activePage === 'admin-dashboard'
                      ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000000]'
                      : 'border-transparent text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-neutral-700'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Overview
                </button>

                <button
                  onClick={() => navigate('admin-materials')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold border-2 transition-all ${
                    activePage === 'admin-materials'
                      ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000000]'
                      : 'border-transparent text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-neutral-700'
                  }`}
                >
                  <FolderPlus className="w-4 h-4" />
                  Materials (Links)
                </button>

                <button
                  onClick={() => navigate('admin-subjects')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold border-2 transition-all ${
                    activePage === 'admin-subjects'
                      ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000000]'
                      : 'border-transparent text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-neutral-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Subjects
                </button>

                <button
                  onClick={() => navigate('admin-questions')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold border-2 transition-all ${
                    activePage === 'admin-questions'
                      ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000000]'
                      : 'border-transparent text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-neutral-700'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  Questions
                </button>

                <button
                  onClick={() => navigate('admin-students')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold border-2 transition-all ${
                    activePage === 'admin-students'
                      ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000000]'
                      : 'border-transparent text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-neutral-700'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Students
                </button>

                {isSuperAdmin && (
                  <button
                    onClick={() => navigate('admin-management')}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold border-2 transition-all ${
                      activePage === 'admin-management'
                        ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000000]'
                        : 'border-transparent text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-neutral-700'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Admin Management
                  </button>
                )}
              </>
            )}
          </nav>

          {/* Right Action Icons (Search, Notifications, Dark Mode, Profile) */}
          <div className="flex items-center gap-2">
            
            {/* Global Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-[2px_2px_0px_#000000] hover:bg-neutral-100 transition-all"
              title="Search subjects and materials (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications Button */}
            {currentUser && (
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="relative p-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-[2px_2px_0px_#000000] hover:bg-neutral-100 transition-all"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#FF4747] text-white text-[10px] font-mono font-bold w-5 h-5 flex items-center justify-center border border-black rounded-full animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-[2px_2px_0px_#000000] hover:bg-neutral-100 transition-all"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-[#FFE600]" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile / Auth Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-[2px_2px_0px_#000000] font-bold text-xs font-mono"
                >
                  <div className="w-5 h-5 bg-[#FFE600] text-black border border-black flex items-center justify-center font-black text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                </button>

                {/* Profile dropdown */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a1a1e] border-2 border-black dark:border-neutral-700 shadow-[4px_4px_0px_#000000] py-2 z-50 font-mono text-xs"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b-2 border-black/10 dark:border-neutral-700 mb-1">
                      <p className="font-bold text-neutral-900 dark:text-white truncate">{currentUser.name}</p>
                      <p className="text-neutral-500 dark:text-neutral-400 text-[11px] truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 bg-black text-[#FFE600] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                        {currentUser.role} {currentUser.adminScope ? `[${currentUser.adminScope}]` : ''}
                      </span>
                    </div>

                    {isStudent && (
                      <button
                        onClick={() => navigate('profile')}
                        className="w-full text-left px-3 py-2 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                      >
                        <UserIcon className="w-3.5 h-3.5" />
                        Student Profile
                      </button>
                    )}

                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 border-t border-black/10 dark:border-neutral-700 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('login')}
                className="hidden sm:inline-flex neo-btn neo-btn-primary px-3 py-1.5 text-xs font-mono"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-[2px_2px_0px_#000000]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black dark:border-neutral-800 bg-[#FAF9F5] dark:bg-[#121316] p-4 space-y-2">
          {/* Quick theme toggle inside mobile menu */}
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between p-2.5 font-bold border-2 border-black bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-[2px_2px_0px_#000000] mb-2 font-mono text-xs"
          >
            <span className="flex items-center gap-2">
              {darkMode ? <Sun className="w-4 h-4 text-[#FFE600]" /> : <Moon className="w-4 h-4" />}
              {darkMode ? 'Light Theme (الوضع النهاري)' : 'Dark Theme (الوضع الليلي)'}
            </span>
            <span className="px-2 py-0.5 bg-[#FFE600] text-black border border-black font-bold uppercase text-[10px]">
              {darkMode ? 'DARK' : 'LIGHT'}
            </span>
          </button>
          {!currentUser ? (
            <>
              <button
                onClick={() => { navigate('landing'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 font-bold border-2 border-black bg-white dark:bg-neutral-800 dark:text-white"
              >
                Platform Overview
              </button>
              <button
                onClick={() => { navigate('login'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 font-bold border-2 border-black bg-white dark:bg-neutral-800 dark:text-white"
              >
                Log In
              </button>
              <button
                onClick={() => { navigate('register'); setMobileMenuOpen(false); }}
                className="w-full p-2.5 font-bold border-2 border-black bg-[#FFE600] text-black shadow-[2px_2px_0px_#000000]"
              >
                Register Student Account
              </button>
            </>
          ) : isStudent ? (
            <>
              <button
                onClick={() => { navigate('student-dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 font-bold border-2 border-black bg-white dark:bg-neutral-800 dark:text-white flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button>
              <button
                onClick={() => { navigate('subjects'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 font-bold border-2 border-black bg-white dark:bg-neutral-800 dark:text-white flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> My Subjects
              </button>
              <button
                onClick={() => { navigate('subject-selection'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 font-bold border-2 border-black bg-white dark:bg-neutral-800 dark:text-white flex items-center gap-2"
              >
                <Layers className="w-4 h-4" /> Academic & Subject Selection
              </button>
              <button
                onClick={() => { navigate('questions'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 font-bold border-2 border-black bg-white dark:bg-neutral-800 dark:text-white flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" /> Q&A Questions
              </button>
              <button
                onClick={() => { navigate('profile'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 font-bold border-2 border-black bg-white dark:bg-neutral-800 dark:text-white flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4" /> Profile & Academic Flow
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { navigate('admin-dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 font-bold border-2 border-black bg-white dark:bg-neutral-800 dark:text-white flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Admin Overview
              </button>
              <button
                onClick={() => { navigate('admin-materials'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 font-bold border-2 border-black bg-white dark:bg-neutral-800 dark:text-white flex items-center gap-2"
              >
                <FolderPlus className="w-4 h-4" /> Materials (Link Management)
              </button>
              <button
                onClick={() => { navigate('admin-subjects'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 font-bold border-2 border-black bg-white dark:bg-neutral-800 dark:text-white flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Subjects
              </button>
              <button
                onClick={() => { navigate('admin-questions'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 font-bold border-2 border-black bg-white dark:bg-neutral-800 dark:text-white flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" /> Questions Triage
              </button>
              <button
                onClick={() => { navigate('admin-students'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 font-bold border-2 border-black bg-white dark:bg-neutral-800 dark:text-white flex items-center gap-2"
              >
                <Users className="w-4 h-4" /> Student Roster
              </button>
              {isSuperAdmin && (
                <button
                  onClick={() => { navigate('admin-management'); setMobileMenuOpen(false); }}
                  className="w-full text-left p-2.5 font-bold border-2 border-black bg-[#FFE600] text-black flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" /> Admin Account Scopes
                </button>
              )}
            </>
          )}

          {currentUser && (
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="w-full text-left p-2.5 font-bold border-2 border-black bg-red-500 text-white flex items-center gap-2 mt-4"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          )}
        </div>
      )}
    </header>
  );
};
