import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  User, 
  Subject, 
  Material, 
  Question, 
  NotificationItem, 
  AcademicLevel, 
  Department, 
  Semester, 
  AdminScope, 
  MaterialType, 
  QuestionStatus,
  UserRole
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_SUBJECTS, 
  INITIAL_MATERIALS, 
  INITIAL_QUESTIONS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

export type NavigationPage = 
  | 'landing'
  | 'login'
  | 'register'
  | 'student-dashboard'
  | 'subjects'
  | 'subject-details'
  | 'subject-selection'
  | 'questions'
  | 'profile'
  | 'admin-dashboard'
  | 'admin-students'
  | 'admin-subjects'
  | 'admin-materials'
  | 'admin-questions'
  | 'admin-management'
  | 'admin-settings';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Auth & User
  currentUser: User | null;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  login: (email: string) => boolean;
  register: (data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    level: AcademicLevel;
    department?: Department;
    semester?: Semester;
  }) => void;
  logout: () => void;
  switchUser: (userId: string) => void;
  
  // Navigation
  activePage: NavigationPage;
  setActivePage: (page: NavigationPage) => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  selectedQuestionId: string | null;
  setSelectedQuestionId: (id: string | null) => void;
  navigate: (page: NavigationPage, subjectId?: string, questionId?: string) => void;

  // Subjects
  subjects: Subject[];
  createSubject: (subject: Omit<Subject, 'id'>) => boolean;
  addSubject: (subject: Omit<Subject, 'id'>) => boolean;
  updateSubject: (id: string, updates: Partial<Subject>) => boolean;
  deleteSubject: (id: string) => boolean;
  getSubjectById: (id: string) => Subject | undefined;
  getSubjectsForStudent: () => Subject[];
  getScopedSubjects: () => Subject[];
  getAvailableSubjectsForCatalog: (level: AcademicLevel, department?: Department, semester?: Semester) => Subject[];

  // Student Academic & Subject Selection
  updateAcademicProfile: (
    level: AcademicLevel, 
    department?: Department, 
    semester?: Semester, 
    selectedSubjectIds?: string[]
  ) => void;
  updateStudentByAdmin: (studentId: string, updates: Partial<User>) => boolean;
  toggleSubjectSelection: (subjectId: string) => { success: boolean; message?: string };
  saveSubjectSelections: (subjectIds: string[]) => { success: boolean; message?: string };

  // Materials (Links Only)
  materials: Material[];
  createMaterial: (data: {
    title: string;
    description: string;
    type: MaterialType;
    url: string;
    subjectId: string;
    targetLevel: AcademicLevel;
    department?: Department;
    semester?: Semester;
    isPublished?: boolean;
    durationOrPages?: string;
    provider?: string;
  }) => { success: boolean; message: string };
  addMaterial: (data: {
    title: string;
    description: string;
    type: MaterialType;
    url: string;
    subjectId: string;
    targetLevel: AcademicLevel;
    department?: Department;
    semester?: Semester;
    isPublished?: boolean;
    durationOrPages?: string;
    provider?: string;
  }) => { success: boolean; message: string };
  updateMaterial: (id: string, updates: Partial<Material>) => { success: boolean; message: string };
  deleteMaterial: (id: string) => { success: boolean; message: string };
  togglePublishMaterial: (id: string) => boolean;
  incrementMaterialView: (id: string) => void;
  getMaterialsForSubject: (subjectId: string) => Material[];

  // Questions & Answers
  questions: Question[];
  askQuestion: (subjectId: string, title: string, content: string) => boolean;
  answerQuestion: (questionId: string, content: string) => boolean;
  updateQuestionStatus: (questionId: string, status: QuestionStatus) => boolean;

  // Admin Management (Super Admin)
  createAdminUser: (name: string, email: string, scope: AdminScope) => boolean;
  updateAdminScope: (adminId: string, newScope: AdminScope) => boolean;
  toggleAdminActive: (adminId: string) => boolean;
  deleteAdmin: (adminId: string) => boolean;

  // Permissions & Scope Checking
  canAdministerScope: (targetLevel: AcademicLevel, targetDept?: Department) => boolean;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  // Search & Global Modals
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Theme & Toasts
  darkMode: boolean;
  toggleDarkMode: () => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'synapse_users_v1',
  CURRENT_USER_ID: 'synapse_current_user_id_v1',
  SUBJECTS: 'synapse_subjects_v1',
  MATERIALS: 'synapse_materials_v1',
  QUESTIONS: 'synapse_questions_v1',
  NOTIFICATIONS: 'synapse_notifications_v1',
  DARK_MODE: 'synapse_dark_mode_v1'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial or stored state
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'usr_student_1'; // Default to Ahmed Al-Mansoor for instant interactive preview
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return saved ? JSON.parse(saved) : false;
  });

  // Navigation State
  const [activePage, setActivePage] = useState<NavigationPage>('student-dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>('sub_l3_cs_s1_1');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  // Search & Modals
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Current user helper
  const currentUser = useMemo(() => {
    return users.find(u => u.id === currentUserId) || null;
  }, [users, currentUserId]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const navigate = (page: NavigationPage, subjectId?: string, questionId?: string) => {
    if (subjectId) setSelectedSubjectId(subjectId);
    if (questionId) setSelectedQuestionId(questionId);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Operations
  const login = (email: string): boolean => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      showToast('User with this email not found', 'error');
      return false;
    }
    if (!user.isActive) {
      showToast('This account has been deactivated by administrator', 'error');
      return false;
    }
    setCurrentUserId(user.id);
    if (user.role === 'student') {
      setActivePage('student-dashboard');
    } else {
      setActivePage('admin-dashboard');
    }
    showToast(`Welcome back, ${user.name}!`, 'success');
    return true;
  };

  const register = (data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    level: AcademicLevel;
    department?: Department;
    semester?: Semester;
  }) => {
    const existing = users.find(u => u.email.toLowerCase() === data.email.toLowerCase().trim());
    if (existing) {
      showToast('An account with this email already exists', 'error');
      return;
    }

    // Determine initial subjects according to rules
    let initialSelectedSubjectIds: string[] = [];
    if (data.level === 'level_2') {
      const sem = data.semester || 1;
      initialSelectedSubjectIds = subjects
        .filter(s => s.primaryLevel === 'level_2' && s.semester === sem)
        .map(s => s.id);
    } else if (data.level === 'level_3') {
      const dept = data.department || 'CS';
      const sem = data.semester || 1;
      initialSelectedSubjectIds = subjects
        .filter(s => s.primaryLevel === 'level_3' && s.department === dept && s.semester === sem)
        .map(s => s.id);
    } else if (data.level === 'summer') {
      // Pick first 3 as default or leave empty
      initialSelectedSubjectIds = subjects.slice(0, 3).map(s => s.id);
    } else if (data.level === 'case') {
      initialSelectedSubjectIds = subjects.slice(0, 6).map(s => s.id);
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'student',
      isActive: true,
      academicProfile: {
        level: data.level,
        department: data.department,
        semester: data.semester || 1,
        selectedSubjectIds: initialSelectedSubjectIds
      },
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    setActivePage('student-dashboard');
    showToast('Registration successful! Welcome to Synapse.', 'success');
  };

  const logout = () => {
    setCurrentUserId(null);
    setActivePage('landing');
    showToast('Logged out successfully', 'info');
  };

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    setCurrentUserId(user.id);
    if (user.role === 'student') {
      setActivePage('student-dashboard');
    } else {
      setActivePage('admin-dashboard');
    }
    showToast(`Switched persona to ${user.name} (${user.role.toUpperCase()})`, 'info');
  };

  // Scope & Permission Logic
  const canAdministerScope = (targetLevel: AcademicLevel, _targetDept?: Department): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    if (currentUser.role !== 'admin') return false;

    const scope = currentUser.adminScope;
    if (!scope) return false;
    if (scope === 'all') return true;

    if (scope === 'level_2' && targetLevel === 'level_2') return true;
    if (scope === 'level_3' && targetLevel === 'level_3') return true;
    if (scope === 'level_4' && targetLevel === 'level_4') return true;
    if (scope === 'summer' && targetLevel === 'summer') return true;
    if (scope === 'case' && targetLevel === 'case') return true;

    return false;
  };

  // Subjects Management
  const getSubjectById = (id: string): Subject | undefined => {
    return subjects.find(s => s.id === id);
  };

  const getAvailableSubjectsForCatalog = (
    level: AcademicLevel, 
    department?: Department, 
    semester?: Semester
  ): Subject[] => {
    if (level === 'level_2') {
      return subjects.filter(s => s.primaryLevel === 'level_2' && s.semester === semester);
    }
    if (level === 'level_3') {
      return subjects.filter(s => s.primaryLevel === 'level_3' && s.department === department && s.semester === semester);
    }
    if (level === 'summer' || level === 'case') {
      // In Summer & Case, all 24 subjects in the curriculum are available in the offering pool
      return subjects;
    }
    return subjects.filter(s => s.primaryLevel === level);
  };

  const getSubjectsForStudent = (): Subject[] => {
    if (!currentUser || currentUser.role !== 'student' || !currentUser.academicProfile) {
      return [];
    }
    const profile = currentUser.academicProfile;
    
    // For Level 2 & Level 3, auto-resolve to their 6 subjects
    if (profile.level === 'level_2') {
      return subjects.filter(s => s.primaryLevel === 'level_2' && s.semester === profile.semester);
    }
    if (profile.level === 'level_3') {
      return subjects.filter(
        s => s.primaryLevel === 'level_3' && 
             s.department === profile.department && 
             s.semester === profile.semester
      );
    }

    // For Summer & Case, return selected subjects
    return subjects.filter(s => profile.selectedSubjectIds.includes(s.id));
  };

  const getScopedSubjects = (): Subject[] => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') return subjects;
    return subjects.filter(s => canAdministerScope(s.primaryLevel, s.department));
  };

  const updateStudentByAdmin = (studentId: string, updates: Partial<User>): boolean => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
      showToast('Unauthorized operation', 'error');
      return false;
    }
    setUsers(prev => prev.map(u => {
      if (u.id === studentId) {
        return {
          ...u,
          ...updates,
          academicProfile: updates.academicProfile 
            ? { ...u.academicProfile, ...updates.academicProfile }
            : u.academicProfile
        };
      }
      return u;
    }));
    showToast('Student academic profile updated successfully', 'success');
    return true;
  };

  const createSubject = (subjectData: Omit<Subject, 'id'>): boolean => {
    if (!currentUser) return false;
    if (currentUser.role !== 'super_admin' && !canAdministerScope(subjectData.primaryLevel, subjectData.department)) {
      showToast(`Permission Denied: Your admin scope does not permit adding subjects to ${subjectData.primaryLevel.toUpperCase()}`, 'error');
      return false;
    }

    const newSub: Subject = {
      ...subjectData,
      id: `sub_${Date.now()}`
    };

    setSubjects(prev => [newSub, ...prev]);
    showToast(`Subject "${newSub.name}" created successfully`, 'success');
    return true;
  };

  const updateSubject = (id: string, updates: Partial<Subject>): boolean => {
    const existing = subjects.find(s => s.id === id);
    if (!existing) return false;

    const targetLevel = updates.primaryLevel || existing.primaryLevel;
    if (currentUser?.role !== 'super_admin' && !canAdministerScope(targetLevel, updates.department || existing.department)) {
      showToast('Permission Denied: Outside your admin scope', 'error');
      return false;
    }

    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showToast('Subject updated successfully', 'success');
    return true;
  };

  const deleteSubject = (id: string): boolean => {
    const existing = subjects.find(s => s.id === id);
    if (!existing) return false;

    if (currentUser?.role !== 'super_admin' && !canAdministerScope(existing.primaryLevel, existing.department)) {
      showToast('Permission Denied: Outside your admin scope', 'error');
      return false;
    }

    setSubjects(prev => prev.filter(s => s.id !== id));
    showToast('Subject removed', 'info');
    return true;
  };

  // Student Academic Profile Updates & Rules Enforcement
  const updateAcademicProfile = (
    level: AcademicLevel,
    department?: Department,
    semester?: Semester,
    selectedSubjectIds?: string[]
  ) => {
    if (!currentUser || currentUser.role !== 'student') return;

    let finalSubjectIds = selectedSubjectIds || [];

    if (level === 'level_2') {
      const sem = semester || 1;
      finalSubjectIds = subjects
        .filter(s => s.primaryLevel === 'level_2' && s.semester === sem)
        .map(s => s.id);
    } else if (level === 'level_3') {
      const dept = department || 'CS';
      const sem = semester || 1;
      finalSubjectIds = subjects
        .filter(s => s.primaryLevel === 'level_3' && s.department === dept && s.semester === sem)
        .map(s => s.id);
    }

    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          academicProfile: {
            level,
            department: level === 'level_3' ? department : undefined,
            semester: level === 'summer' ? undefined : (semester || 1),
            selectedSubjectIds: finalSubjectIds
          }
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    showToast('Academic profile and enrollment updated!', 'success');
  };

  const toggleSubjectSelection = (subjectId: string): { success: boolean; message?: string } => {
    if (!currentUser || !currentUser.academicProfile) {
      return { success: false, message: 'No student profile active' };
    }

    const profile = currentUser.academicProfile;
    const currentList = [...profile.selectedSubjectIds];
    const isSelected = currentList.includes(subjectId);

    if (isSelected) {
      // Remove
      const filtered = currentList.filter(id => id !== subjectId);
      updateAcademicProfile(profile.level, profile.department, profile.semester, filtered);
      return { success: true, message: 'Subject removed from your selection' };
    } else {
      // Add check limits
      if (profile.level === 'summer' && currentList.length >= 3) {
        return { success: false, message: 'Summer rule: Maximum 3 subjects allowed. Please remove a subject first.' };
      }
      if (profile.level === 'case' && currentList.length >= 6) {
        return { success: false, message: 'Case rule: Maximum 6 subjects allowed per semester. Please remove a subject first.' };
      }

      currentList.push(subjectId);
      updateAcademicProfile(profile.level, profile.department, profile.semester, currentList);
      return { success: true, message: 'Subject added to your enrollment' };
    }
  };

  const saveSubjectSelections = (subjectIds: string[]): { success: boolean; message?: string } => {
    if (!currentUser || !currentUser.academicProfile) {
      return { success: false, message: 'No student profile active' };
    }
    const profile = currentUser.academicProfile;

    if (profile.level === 'summer' && subjectIds.length > 3) {
      return { success: false, message: 'Summer rule violation: You cannot select more than 3 subjects.' };
    }
    if (profile.level === 'case' && subjectIds.length > 6) {
      return { success: false, message: 'Case rule violation: You cannot select more than 6 subjects per semester.' };
    }

    updateAcademicProfile(profile.level, profile.department, profile.semester, subjectIds);
    return { success: true, message: 'Subject selections successfully saved' };
  };

  // Materials CRUD (Pure Link-Based)
  const createMaterial = (data: {
    title: string;
    description: string;
    type: MaterialType;
    url: string;
    subjectId: string;
    targetLevel: AcademicLevel;
    department?: Department;
    semester?: Semester;
    isPublished?: boolean;
    durationOrPages?: string;
    provider?: string;
  }): { success: boolean; message: string } => {
    if (!currentUser || currentUser.role === 'student') {
      return { success: false, message: 'Unauthorized: Only admins can add materials.' };
    }

    // Check scope authorization
    if (!canAdministerScope(data.targetLevel, data.department)) {
      return {
        success: false,
        message: `Scope Violation: You are restricted to your assigned scope (${currentUser.adminScope?.toUpperCase()}). Cannot add material to ${data.targetLevel.toUpperCase()}.`
      };
    }

    // URL validation
    if (!data.url || !data.url.startsWith('http')) {
      return { success: false, message: 'Please enter a valid full URL starting with http:// or https://' };
    }

    const sub = subjects.find(s => s.id === data.subjectId);

    const newMaterial: Material = {
      id: `mat_${Date.now()}`,
      title: data.title,
      description: data.description,
      type: data.type,
      url: data.url,
      subjectId: data.subjectId,
      subjectName: sub ? sub.name : 'Curriculum Subject',
      targetLevel: data.targetLevel,
      department: data.department,
      semester: data.semester,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      createdBy: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role
      },
      durationOrPages: data.durationOrPages || (data.type === 'video' ? '30 mins' : '15 pages'),
      provider: data.provider || 'External Resource',
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMaterials(prev => [newMaterial, ...prev]);

    // Send a system notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `New ${data.type.toUpperCase()} Link in ${newMaterial.subjectName}`,
      message: `${currentUser.name} published: "${newMaterial.title}"`,
      type: 'material',
      read: false,
      createdAt: new Date().toISOString(),
      linkUrl: `/subjects/${newMaterial.subjectId}`
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Material link "${newMaterial.title}" published!`, 'success');
    return { success: true, message: 'Material published successfully' };
  };

  const updateMaterial = (id: string, updates: Partial<Material>): { success: boolean; message: string } => {
    const existing = materials.find(m => m.id === id);
    if (!existing) return { success: false, message: 'Material not found' };

    const targetLevel = updates.targetLevel || existing.targetLevel;
    if (!canAdministerScope(targetLevel, updates.department || existing.department)) {
      return { success: false, message: 'Permission Denied: Material outside your authorized scope.' };
    }

    setMaterials(prev => prev.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m));
    showToast('Material updated successfully', 'success');
    return { success: true, message: 'Material updated' };
  };

  const deleteMaterial = (id: string): { success: boolean; message: string } => {
    const existing = materials.find(m => m.id === id);
    if (!existing) return { success: false, message: 'Material not found' };

    if (!canAdministerScope(existing.targetLevel, existing.department)) {
      return { success: false, message: 'Permission Denied: Outside your admin scope.' };
    }

    setMaterials(prev => prev.filter(m => m.id !== id));
    showToast('Material deleted', 'info');
    return { success: true, message: 'Material deleted' };
  };

  const togglePublishMaterial = (id: string): boolean => {
    const existing = materials.find(m => m.id === id);
    if (!existing) return false;

    if (!canAdministerScope(existing.targetLevel, existing.department)) {
      showToast('Permission Denied: Outside your admin scope', 'error');
      return false;
    }

    setMaterials(prev => prev.map(m => m.id === id ? { ...m, isPublished: !m.isPublished } : m));
    showToast(`Material ${!existing.isPublished ? 'published' : 'hidden'}`, 'info');
    return true;
  };

  const incrementMaterialView = (id: string) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, viewCount: m.viewCount + 1 } : m));
  };

  const getMaterialsForSubject = (subjectId: string): Material[] => {
    return materials.filter(m => m.subjectId === subjectId && m.isPublished);
  };

  // Questions & Answers
  const askQuestion = (subjectId: string, title: string, content: string): boolean => {
    if (!currentUser) {
      showToast('Please log in to ask a question', 'error');
      return false;
    }

    const sub = subjects.find(s => s.id === subjectId);
    if (!sub) return false;

    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      subjectId: sub.id,
      subjectName: sub.name,
      targetLevel: sub.primaryLevel,
      department: sub.department,
      title,
      content,
      status: 'pending',
      answers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setQuestions(prev => [newQuestion, ...prev]);
    showToast('Your question has been posted for department instructors!', 'success');
    return true;
  };

  const answerQuestion = (questionId: string, content: string): boolean => {
    if (!currentUser || currentUser.role === 'student') {
      showToast('Only instructors and admins can submit verified answers', 'error');
      return false;
    }

    const q = questions.find(item => item.id === questionId);
    if (!q) return false;

    if (!canAdministerScope(q.targetLevel, q.department)) {
      showToast(`Permission Denied: Question belongs to ${q.targetLevel.toUpperCase()} outside your scope`, 'error');
      return false;
    }

    const newAns = {
      id: `ans_${Date.now()}`,
      questionId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorScope: currentUser.adminScope,
      content,
      createdAt: new Date().toISOString()
    };

    setQuestions(prev => prev.map(item => {
      if (item.id === questionId) {
        return {
          ...item,
          status: 'answered',
          answers: [...item.answers, newAns],
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    }));

    showToast('Verified instructor answer posted!', 'success');
    return true;
  };

  const updateQuestionStatus = (questionId: string, status: QuestionStatus): boolean => {
    if (!currentUser || currentUser.role === 'student') return false;

    const q = questions.find(item => item.id === questionId);
    if (!q) return false;

    if (!canAdministerScope(q.targetLevel, q.department)) {
      showToast('Permission Denied: Question outside your admin scope', 'error');
      return false;
    }

    setQuestions(prev => prev.map(item => item.id === questionId ? { ...item, status } : item));
    showToast(`Question status updated to ${status.toUpperCase()}`, 'info');
    return true;
  };

  // Super Admin: Admin Management
  const createAdminUser = (name: string, email: string, scope: AdminScope): boolean => {
    if (currentUser?.role !== 'super_admin') {
      showToast('Permission Denied: Only Super Admin can provision admin accounts', 'error');
      return false;
    }

    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      showToast('An account with this email already exists', 'error');
      return false;
    }

    const newAdmin: User = {
      id: `usr_adm_${Date.now()}`,
      name,
      email,
      role: 'admin',
      adminScope: scope,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newAdmin]);
    showToast(`Admin account for ${name} (${scope.toUpperCase()}) created!`, 'success');
    return true;
  };

  const updateAdminScope = (adminId: string, newScope: AdminScope): boolean => {
    if (currentUser?.role !== 'super_admin') {
      showToast('Only Super Admin can reassign admin scopes', 'error');
      return false;
    }

    setUsers(prev => prev.map(u => u.id === adminId ? { ...u, adminScope: newScope } : u));
    showToast('Admin scope updated successfully', 'success');
    return true;
  };

  const toggleAdminActive = (adminId: string): boolean => {
    if (currentUser?.role !== 'super_admin') return false;

    setUsers(prev => prev.map(u => {
      if (u.id === adminId) {
        const nextState = !u.isActive;
        showToast(`Admin account ${nextState ? 'enabled' : 'disabled'}`, 'info');
        return { ...u, isActive: nextState };
      }
      return u;
    }));
    return true;
  };

  const deleteAdmin = (adminId: string): boolean => {
    if (currentUser?.role !== 'super_admin') return false;

    setUsers(prev => prev.filter(u => u.id !== adminId));
    showToast('Admin account removed', 'info');
    return true;
  };

  // Notifications
  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        setUsers,
        login,
        register,
        logout,
        switchUser,
        activePage,
        setActivePage,
        selectedSubjectId,
        setSelectedSubjectId,
        selectedQuestionId,
        setSelectedQuestionId,
        navigate,
        subjects,
        createSubject,
        addSubject: createSubject,
        updateSubject,
        deleteSubject,
        getSubjectById,
        getSubjectsForStudent,
        getScopedSubjects,
        getAvailableSubjectsForCatalog,
        updateAcademicProfile,
        updateStudentByAdmin,
        toggleSubjectSelection,
        saveSubjectSelections,
        materials,
        createMaterial,
        addMaterial: createMaterial,
        updateMaterial,
        deleteMaterial,
        togglePublishMaterial,
        incrementMaterialView,
        getMaterialsForSubject,
        questions,
        askQuestion,
        answerQuestion,
        updateQuestionStatus,
        createAdminUser,
        updateAdminScope,
        toggleAdminActive,
        deleteAdmin,
        canAdministerScope,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        isNotificationsOpen,
        setIsNotificationsOpen,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        darkMode,
        toggleDarkMode,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
