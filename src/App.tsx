import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationsModal } from './components/common/NotificationsModal';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { StudentDashboard } from './components/student/StudentDashboard';
import { SubjectListPage } from './components/student/SubjectListPage';
import { SubjectDetailsPage } from './components/student/SubjectDetailsPage';
import { SubjectSelectionPage } from './components/student/SubjectSelectionPage';
import { QuestionsPage } from './components/student/QuestionsPage';
import { ProfilePage } from './components/student/ProfilePage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminMaterialsPage } from './components/admin/AdminMaterialsPage';
import { AdminStudentsPage } from './components/admin/AdminStudentsPage';
import { AdminSubjectsPage } from './components/admin/AdminSubjectsPage';
import { AdminManagePage } from './components/admin/AdminManagePage';

const AppContent: React.FC = () => {
  const { activePage, darkMode, currentUser, isLoading } = useApp();

  const renderCurrentPage = () => {
    if (isLoading) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center font-mono text-sm text-neutral-500">
          LOADING PLATFORM...
        </div>
      );
    }
    // Auth guard: any page other than public ones requires a session
    const isPublic = activePage === 'landing' || activePage === 'login' || activePage === 'register';
    if (!currentUser && !isPublic) {
      return <LandingPage />;
    }

    switch (activePage) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'student-dashboard':
        return <StudentDashboard />;
      case 'subjects':
        return <SubjectListPage />;
      case 'subject-details':
        return <SubjectDetailsPage />;
      case 'subject-selection':
        return <SubjectSelectionPage />;
      case 'questions':
        return <QuestionsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-materials':
        return <AdminMaterialsPage />;
      case 'admin-students':
        return <AdminStudentsPage />;
      case 'admin-subjects':
        return <AdminSubjectsPage />;
      case 'admin-questions':
        return <QuestionsPage />;
      case 'admin-management':
      case 'admin-admins':
        return <AdminManagePage />;
      default:
        return currentUser?.role === 'student'
          ? <StudentDashboard />
          : <AdminDashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-[#FAF9F5] dark:bg-[#121316] text-neutral-900 dark:text-white flex flex-col font-sans transition-colors duration-150 selection:bg-[#FFE600] selection:text-black`}>
      {/* 1. Primary Navigation Header */}
      <Navbar />

      {/* 2. Main Routed View */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* 3. Global Modals & Notifications */}
      <GlobalSearchModal />
      <NotificationsModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
