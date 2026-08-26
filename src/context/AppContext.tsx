import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
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
import { supabase } from '../lib/supabase';
import {
  fetchProfiles, fetchSubjects, fetchMaterials, fetchQuestions,
  fetchNotifications, fetchEnrollmentIds,
  ProfileRow, SubjectRow, MaterialRow
} from '../lib/dataService';

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

interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  level: AcademicLevel;
  department?: Department;
  semester?: Semester;
}

interface MaterialInput {
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
}

const DEMO_PASSWORD = 'password123';
const STORAGE_KEYS = { DARK_MODE: 'synapse_dark_mode_v1' };

interface AppContextType {
  // Auth & User
  isLoading: boolean;
  currentUser: User | null;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  switchUser: (userIdOrEmail: string) => Promise<void>;

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
  createSubject: (subject: Omit<Subject, 'id'>) => Promise<boolean>;
  addSubject: (subject: Omit<Subject, 'id'>) => Promise<boolean>;
  updateSubject: (id: string, updates: Partial<Subject>) => Promise<boolean>;
  deleteSubject: (id: string) => Promise<boolean>;
  getSubjectById: (id: string) => Subject | undefined;
  getSubjectsForStudent: () => Subject[];
  getScopedSubjects: () => Subject[];
  getCatalogSubjectsForStudent: () => Subject[];
  getAvailableSubjectsForCatalog: (level: AcademicLevel, department?: Department, semester?: Semester) => Subject[];

  // Student Academic & Subject Selection
  updateAcademicProfile: (
    level: AcademicLevel,
    department?: Department,
    semester?: Semester,
    selectedSubjectIds?: string[]
  ) => Promise<void>;
  updateStudentByAdmin: (studentId: string, updates: Partial<User>) => Promise<boolean>;
  toggleSubjectSelection: (subjectId: string) => Promise<{ success: boolean; message?: string }>;
  saveSubjectSelections: (subjectIds: string[]) => Promise<{ success: boolean; message?: string }>;

  // Materials (Links Only)
  materials: Material[];
  createMaterial: (data: MaterialInput) => Promise<{ success: boolean; message: string }>;
  addMaterial: (data: MaterialInput) => Promise<{ success: boolean; message: string }>;
  updateMaterial: (id: string, updates: Partial<Material>) => Promise<{ success: boolean; message: string }>;
  deleteMaterial: (id: string) => Promise<{ success: boolean; message: string }>;
  togglePublishMaterial: (id: string) => Promise<boolean>;
  incrementMaterialView: (id: string) => void;
  getMaterialsForSubject: (subjectId: string) => Material[];

  // Questions & Answers
  questions: Question[];
  askQuestion: (subjectId: string, title: string, content: string) => Promise<boolean>;
  answerQuestion: (questionId: string, content: string) => Promise<boolean>;
  updateQuestionStatus: (questionId: string, status: QuestionStatus) => Promise<boolean>;

  // Admin Management (Super Admin)
  createAdminUser: (name: string, email: string, scope: AdminScope) => Promise<boolean>;
  updateUserRole: (userId: string, role: UserRole, adminScope?: AdminScope) => Promise<boolean>;
  updateAdminScope: (adminId: string, newScope: AdminScope) => Promise<boolean>;
  toggleUserActive: (userId: string) => Promise<boolean>;
  toggleAdminActive: (adminId: string) => Promise<boolean>;
  deleteUserAccount: (userId: string) => Promise<boolean>;
  deleteAdmin: (adminId: string) => Promise<boolean>;

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

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return saved ? JSON.parse(saved) : false;
  });

  // Navigation State
  const [activePage, setActivePage] = useState<NavigationPage>('landing');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  // Search & Modals
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // ---------- Dark Mode ----------
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

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // ---------- Data Loading ----------
  const loadAllData = async (userId: string, isStaffUser: boolean) => {
    try {
      const [profilesRes, subjectsRes, materialsRes, questionsRes] = await Promise.all([
        fetchProfiles(), fetchSubjects(), fetchMaterials(), fetchQuestions()
      ]);
      setUsers(profilesRes);
      setSubjects(subjectsRes);
      setMaterials(materialsRes);
      setQuestions(questionsRes);

      // Enrollments: staff can read all; students read their own only
      let enrollmentMap = new Map<string, string[]>();
      if (isStaffUser) {
        const { data, error } = await supabase.from('enrollments').select('user_id, subject_id');
        if (!error && data) {
          enrollmentMap = new Map<string, string[]>();
          for (const r of data as { user_id: string; subject_id: string }[]) {
            const list = enrollmentMap.get(r.user_id) || [];
            list.push(r.subject_id);
            enrollmentMap.set(r.user_id, list);
          }
        }
        setUsers(prev => prev.map(u => ({
          ...u,
          academicProfile: u.academicProfile
            ? { ...u.academicProfile, selectedSubjectIds: enrollmentMap.get(u.id) || [] }
            : undefined
        })));
      }

      setNotifications(await fetchNotifications(userId));
    } catch (err) {
      console.error('Failed to load data:', err);
      showToast('Failed to load platform data. Check your connection.', 'error');
    }
  };

  // ---------- Auth Bootstrap ----------
  useEffect(() => {
    const bootstrap = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession) {
        const profile = await fetchOwnProfile(currentSession.user.id);
        const staff = profile?.role === 'admin' || profile?.role === 'super_admin';
        setSession(currentSession);
        await loadAllData(currentSession.user.id, staff);
      }
      setIsLoading(false);
    };
    bootstrap();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (!newSession) {
          setUsers([]); setSubjects([]); setMaterials([]);
          setQuestions([]); setNotifications([]);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const fetchOwnProfile = async (userId: string): Promise<ProfileRow | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error || !data) return null;
    return data as ProfileRow;
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const navigate = (page: NavigationPage, subjectId?: string, questionId?: string) => {
    if (subjectId) setSelectedSubjectId(subjectId);
    if (questionId) setSelectedQuestionId(questionId);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ---------- Current User (hydrated) ----------
  const currentUserId = session?.user?.id || null;

  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    const base = users.find(u => u.id === currentUserId);
    if (!base) return null;
    // Ensure own enrollments are present even if staff-only fetch skipped us
    if (base.role === 'student' && base.academicProfile) {
      return base;
    }
    return base;
  }, [users, currentUserId]);

  // Hydrate own selectedSubjectIds when they are empty (student case)
  useEffect(() => {
    if (!currentUser?.academicProfile || !currentUser.academicProfile.selectedSubjectIds.length) {
      if (currentUser?.role === 'student') {
        fetchEnrollmentIds(currentUser.id).then(ids => {
          if (ids.length) {
            setUsers(prev => prev.map(u =>
              u.id === currentUser!.id && u.academicProfile
                ? { ...u, academicProfile: { ...u.academicProfile, selectedSubjectIds: ids } }
                : u
            ));
          }
        });
      }
    }
  }, [currentUser?.id, currentUser?.role]);

  // ---------- Auth Operations ----------
  const routeAfterLogin = (user: User) => {
    setActivePage(user.role === 'student' ? 'student-dashboard' : 'admin-dashboard');
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    if (error || !data.user) {
      showToast(error?.message || 'Invalid email or password', 'error');
      return false;
    }

    const profileRow = await fetchOwnProfile(data.user.id);
    if (!profileRow) {
      await supabase.auth.signOut();
      showToast('Account profile not found. Contact your administrator.', 'error');
      return false;
    }
    if (!profileRow.is_active) {
      await supabase.auth.signOut();
      showToast('This account has been deactivated by administrator', 'error');
      return false;
    }

    const staff = profileRow.role !== 'student';
    await loadAllData(data.user.id, staff);
    const mapped = (await fetchProfiles()).find(u => u.id === data.user.id);
    if (mapped) routeAfterLogin(mapped);
    showToast(`Welcome back, ${profileRow.name}!`, 'success');
    return true;
  };

  const register = async (regData: RegisterData): Promise<void> => {
    const { data, error } = await supabase.auth.signUp({
      email: regData.email.trim(),
      password: regData.password || DEMO_PASSWORD,
      options: { data: { name: regData.name, phone: regData.phone } }
    });

    if (error) {
      showToast(error.message, 'error');
      return;
    }
    if (!data.user) {
      showToast('Registration failed unexpectedly', 'error');
      return;
    }

    // Trigger created the profile; now fill academic fields (own-row update allowed)
    const { error: updErr } = await supabase
      .from('profiles')
      .update({
        level: regData.level,
        dept: regData.department,
        semester: regData.semester || 1
      })
      .eq('id', data.user.id);

    if (updErr) {
      console.error(updErr);
      showToast('Account created but profile setup failed', 'error');
      return;
    }

    // Auto-enroll according to level rules
    const { data: allSubjects } = await supabase.from('subjects').select('*');
    let initialIds: string[] = [];
    const subs = (allSubjects as SubjectRow[]) || [];
    if (regData.level === 'level_2') {
      initialIds = subs.filter(s => s.primary_level === 'level_2' && s.semester === (regData.semester || 1)).map(s => s.id);
    } else if (regData.level === 'level_3') {
      initialIds = subs.filter(s => s.primary_level === 'level_3' && s.dept === (regData.department || 'CS') && s.semester === (regData.semester || 1)).map(s => s.id);
    } else if (regData.level === 'summer') {
      initialIds = subs.slice(0, 3).map(s => s.id);
    } else if (regData.level === 'case') {
      initialIds = subs.slice(0, 6).map(s => s.id);
    }
    if (initialIds.length) {
      await supabase.from('enrollments').insert(initialIds.map(sid => ({ user_id: data.user!.id, subject_id: sid })));
    }

    if (!data.session) {
      showToast('Account created! Please confirm your email, then sign in.', 'success');
      setActivePage('login');
      return;
    }

    setSession(data.session);
    await loadAllData(data.user.id, false);
    setActivePage('student-dashboard');
    showToast('Registration successful! Welcome to Synapse.', 'success');
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setSession(null);
    setActivePage('landing');
    showToast('Logged out successfully', 'info');
  };

  // Demo persona switching: signs in with shared demo credentials
  const switchUser = async (userIdOrEmail: string): Promise<void> => {
    // Accept a raw email even when the users list isn't loaded yet (logged-out state)
    const email = userIdOrEmail.includes('@')
      ? userIdOrEmail
      : users.find(u => u.id === userIdOrEmail)?.email;
    if (!email) {
      showToast('Demo persona not found', 'error');
      return;
    }
    await logout();
    await login(email, DEMO_PASSWORD);
  };

  // ---------- Scope & Permission Logic (mirrors RLS) ----------
  const canAdministerScope = (targetLevel: AcademicLevel, _targetDept?: Department): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    if (currentUser.role !== 'admin') return false;

    const scope = currentUser.adminScope;
    if (!scope) return false;
    if (scope === 'all') return true;
    return scope === targetLevel;
  };

  const isStaff = currentUser ? currentUser.role !== 'student' : false;

  // ---------- Subjects Management ----------
  const getSubjectById = (id: string): Subject | undefined => subjects.find(s => s.id === id);

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
      return subjects;
    }
    return subjects.filter(s => s.primaryLevel === level);
  };

  const getSubjectsForStudent = (): Subject[] => {
    if (!currentUser || currentUser.role !== 'student' || !currentUser.academicProfile) {
      return [];
    }
    const profile = currentUser.academicProfile;
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
    return subjects.filter(s => profile.selectedSubjectIds.includes(s.id));
  };

  const getScopedSubjects = (): Subject[] => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') return subjects;
    return subjects.filter(s => canAdministerScope(s.primaryLevel, s.department));
  };

  // Catalog visibility: L2/L3 students are locked to their own track+semester,
  // Summer/Case students browse the full offering pool
  const getCatalogSubjectsForStudent = (): Subject[] => {
    if (!currentUser || currentUser.role !== 'student' || !currentUser.academicProfile) {
      return subjects;
    }
    const profile = currentUser.academicProfile;
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
    return subjects;
  };

  const createSubject = async (subjectData: Omit<Subject, 'id'>): Promise<boolean> => {
    if (!currentUser) return false;
    if (!canAdministerScope(subjectData.primaryLevel, subjectData.department)) {
      showToast(`Permission Denied: Your admin scope does not permit adding subjects to ${subjectData.primaryLevel.toUpperCase()}`, 'error');
      return false;
    }

    const { data, error } = await supabase
      .from('subjects')
      .insert({
        code: subjectData.code,
        name: subjectData.name,
        description: subjectData.description,
        credits: subjectData.credits,
        icon_name: subjectData.iconName,
        primary_level: subjectData.primaryLevel,
        dept: subjectData.department,
        semester: subjectData.semester,
        tags: subjectData.tags
      })
      .select()
      .single();

    if (error) {
      showToast(error.message, 'error');
      return false;
    }

    const inserted = await supabase.from('subjects').select('*').eq('id', data.id).single();
    if (!inserted.error && inserted.data) {
      const row = inserted.data as SubjectRow;
      setSubjects(prev => [{
        id: row.id, code: row.code, name: row.name, description: row.description,
        credits: row.credits, iconName: row.icon_name || undefined,
        primaryLevel: row.primary_level, department: row.dept || undefined,
        semester: (row.semester as 1 | 2) || undefined, tags: row.tags || []
      }, ...prev]);
    }
    showToast(`Subject "${subjectData.name}" created successfully`, 'success');
    return true;
  };

  const updateSubject = async (id: string, updates: Partial<Subject>): Promise<boolean> => {
    const existing = subjects.find(s => s.id === id);
    if (!existing) return false;

    const targetLevel = updates.primaryLevel || existing.primaryLevel;
    if (!canAdministerScope(targetLevel, updates.department || existing.department)) {
      showToast('Permission Denied: Outside your admin scope', 'error');
      return false;
    }

    const dbUpdates: Record<string, unknown> = {};
    if (updates.code !== undefined) dbUpdates.code = updates.code;
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.credits !== undefined) dbUpdates.credits = updates.credits;
    if (updates.iconName !== undefined) dbUpdates.icon_name = updates.iconName;
    if (updates.primaryLevel !== undefined) dbUpdates.primary_level = updates.primaryLevel;
    if (updates.department !== undefined) dbUpdates.dept = updates.department;
    if (updates.semester !== undefined) dbUpdates.semester = updates.semester;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;

    const { error } = await supabase.from('subjects').update(dbUpdates).eq('id', id);
    if (error) {
      showToast(error.message, 'error');
      return false;
    }

    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showToast('Subject updated successfully', 'success');
    return true;
  };

  const deleteSubject = async (id: string): Promise<boolean> => {
    const existing = subjects.find(s => s.id === id);
    if (!existing) return false;

    if (!canAdministerScope(existing.primaryLevel, existing.department)) {
      showToast('Permission Denied: Outside your admin scope', 'error');
      return false;
    }

    const { error } = await supabase.from('subjects').delete().eq('id', id);
    if (error) {
      showToast(error.message, 'error');
      return false;
    }

    setSubjects(prev => prev.filter(s => s.id !== id));
    showToast('Subject removed', 'info');
    return true;
  };

  // ---------- Academic Profile & Enrollment ----------
  const persistAcademicProfile = async (
    level: AcademicLevel,
    department: Department | undefined,
    semester: Semester | undefined,
    finalSubjectIds: string[]
  ) => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        level,
        dept: level === 'level_3' ? department : null,
        semester: level === 'summer' ? null : (semester || 1)
      })
      .eq('id', currentUser.id);

    if (error) {
      showToast(error.message, 'error');
      return;
    }

    // Replace enrollments
    await supabase.from('enrollments').delete().eq('user_id', currentUser.id);
    if (finalSubjectIds.length) {
      const { error: enrErr } = await supabase
        .from('enrollments')
        .insert(finalSubjectIds.map(sid => ({ user_id: currentUser.id, subject_id: sid })));
      if (enrErr) {
        showToast(enrErr.message, 'error');
        return;
      }
    }

    setUsers(prev => prev.map(u => {
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
    }));
    showToast('Academic profile and enrollment updated!', 'success');
  };

  const updateAcademicProfile = async (
    level: AcademicLevel,
    department?: Department,
    semester?: Semester,
    selectedSubjectIds?: string[]
  ): Promise<void> => {
    if (!currentUser || currentUser.role !== 'student') return;

    let finalSubjectIds = selectedSubjectIds || [];
    if (level === 'level_2') {
      finalSubjectIds = subjects.filter(s => s.primaryLevel === 'level_2' && s.semester === (semester || 1)).map(s => s.id);
    } else if (level === 'level_3') {
      finalSubjectIds = subjects.filter(
        s => s.primaryLevel === 'level_3' && s.department === (department || 'CS') && s.semester === (semester || 1)
      ).map(s => s.id);
    }

    await persistAcademicProfile(level, department, semester, finalSubjectIds);
  };

  const toggleSubjectSelection = async (subjectId: string): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser || !currentUser.academicProfile) {
      return { success: false, message: 'No student profile active' };
    }

    const profile = currentUser.academicProfile;
    const currentList = [...profile.selectedSubjectIds];
    const isSelected = currentList.includes(subjectId);

    if (isSelected) {
      await persistAcademicProfile(profile.level, profile.department, profile.semester, currentList.filter(id => id !== subjectId));
      return { success: true, message: 'Subject removed from your selection' };
    }

    if (profile.level === 'summer' && currentList.length >= 3) {
      showToast('Summer rule: Maximum 3 subjects allowed. Please remove a subject first.', 'error');
      return { success: false, message: 'Summer rule: Maximum 3 subjects allowed.' };
    }
    if (profile.level === 'case' && currentList.length >= 6) {
      showToast('Case rule: Maximum 6 subjects allowed per semester.', 'error');
      return { success: false, message: 'Case rule: Maximum 6 subjects allowed.' };
    }

    currentList.push(subjectId);
    await persistAcademicProfile(profile.level, profile.department, profile.semester, currentList);
    return { success: true, message: 'Subject added to your enrollment' };
  };

  const saveSubjectSelections = async (subjectIds: string[]): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser || !currentUser.academicProfile) {
      return { success: false, message: 'No student profile active' };
    }
    const profile = currentUser.academicProfile;

    if (profile.level === 'summer' && subjectIds.length > 3) {
      showToast('Summer rule violation: You cannot select more than 3 subjects.', 'error');
      return { success: false, message: 'Summer rule violation.' };
    }
    if (profile.level === 'case' && subjectIds.length > 6) {
      showToast('Case rule violation: You cannot select more than 6 subjects.', 'error');
      return { success: false, message: 'Case rule violation.' };
    }

    await persistAcademicProfile(profile.level, profile.department, profile.semester, subjectIds);
    return { success: true, message: 'Subject selections successfully saved' };
  };

  const updateStudentByAdmin = async (studentId: string, updates: Partial<User>): Promise<boolean> => {
    if (!isStaff) {
      showToast('Unauthorized operation', 'error');
      return false;
    }

    const dbUpdates: Record<string, unknown> = {};
    const ap = updates.academicProfile;
    if (ap) {
      if (ap.level !== undefined) dbUpdates.level = ap.level;
      if (ap.department !== undefined) dbUpdates.dept = ap.department;
      if (ap.semester !== undefined) dbUpdates.semester = ap.semester;
    }

    const { error } = await supabase.from('profiles').update(dbUpdates).eq('id', studentId);
    if (error) {
      showToast(error.message, 'error');
      return false;
    }

    setUsers(prev => prev.map(u => {
      if (u.id === studentId) {
        return {
          ...u,
          ...updates,
          academicProfile: updates.academicProfile && u.academicProfile
            ? { ...u.academicProfile, ...updates.academicProfile }
            : u.academicProfile
        };
      }
      return u;
    }));
    showToast('Student academic profile updated successfully', 'success');
    return true;
  };

  // ---------- Materials CRUD ----------
  const createMaterial = async (data: MaterialInput): Promise<{ success: boolean; message: string }> => {
    if (!currentUser || currentUser.role === 'student') {
      return { success: false, message: 'Unauthorized: Only admins can add materials.' };
    }
    if (!canAdministerScope(data.targetLevel, data.department)) {
      return {
        success: false,
        message: `Scope Violation: You are restricted to your assigned scope (${currentUser.adminScope?.toUpperCase()}).`
      };
    }
    if (!data.url || !data.url.startsWith('http')) {
      return { success: false, message: 'Please enter a valid full URL starting with http:// or https://' };
    }

    const sub = subjects.find(s => s.id === data.subjectId);
    const { data: inserted, error } = await supabase
      .from('materials')
      .insert({
        title: data.title,
        description: data.description,
        type: data.type,
        url: data.url,
        subject_id: data.subjectId,
        target_level: data.targetLevel,
        dept: data.department,
        semester: data.semester,
        is_published: data.isPublished !== undefined ? data.isPublished : true,
        created_by: currentUser.id,
        duration_or_pages: data.durationOrPages || (data.type === 'video' ? '30 mins' : '15 pages'),
        provider: data.provider || 'External Resource'
      })
      .select()
      .single();

    if (error) {
      showToast(error.message, 'error');
      return { success: false, message: error.message };
    }

    const row = inserted as MaterialRow;
    setMaterials(prev => [{
      id: row.id, title: row.title, description: row.description, type: row.type,
      url: row.url, subjectId: row.subject_id, subjectName: sub?.name || 'Subject',
      targetLevel: row.target_level, department: row.dept || undefined,
      semester: (row.semester as 1 | 2) || undefined, isPublished: row.is_published,
      createdBy: { id: row.created_by, name: currentUser.name, role: currentUser.role },
      durationOrPages: row.duration_or_pages || undefined, provider: row.provider || undefined,
      viewCount: row.view_count, createdAt: row.created_at, updatedAt: row.updated_at
    }, ...prev]);

    // Notify audience within subject scope (DB function handles filtering)
    if (row.is_published) {
      await supabase.rpc('notify_subject_audience', {
        p_subject_id: row.subject_id,
        p_title: `New ${data.type.toUpperCase()} Link in ${sub?.name || 'Subject'}`,
        p_message: `${currentUser.name} published: "${row.title}"`,
        p_type: 'material',
        p_link_url: `/subjects/${row.subject_id}`
      });
    }

    showToast(`Material link "${row.title}" published!`, 'success');
    return { success: true, message: 'Material published successfully' };
  };

  const updateMaterial = async (id: string, updates: Partial<Material>): Promise<{ success: boolean; message: string }> => {
    const existing = materials.find(m => m.id === id);
    if (!existing) return { success: false, message: 'Material not found' };

    const targetLevel = updates.targetLevel || existing.targetLevel;
    if (!canAdministerScope(targetLevel, updates.department || existing.department)) {
      return { success: false, message: 'Permission Denied: Material outside your authorized scope.' };
    }

    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.url !== undefined) dbUpdates.url = updates.url;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.durationOrPages !== undefined) dbUpdates.duration_or_pages = updates.durationOrPages;
    if (updates.provider !== undefined) dbUpdates.provider = updates.provider;
    if (updates.isPublished !== undefined) dbUpdates.is_published = updates.isPublished;

    const { error } = await supabase.from('materials').update(dbUpdates).eq('id', id);
    if (error) {
      showToast(error.message, 'error');
      return { success: false, message: error.message };
    }

    setMaterials(prev => prev.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m));
    showToast('Material updated successfully', 'success');
    return { success: true, message: 'Material updated' };
  };

  const deleteMaterial = async (id: string): Promise<{ success: boolean; message: string }> => {
    const existing = materials.find(m => m.id === id);
    if (!existing) return { success: false, message: 'Material not found' };

    if (!canAdministerScope(existing.targetLevel, existing.department)) {
      return { success: false, message: 'Permission Denied: Outside your admin scope.' };
    }

    const { error } = await supabase.from('materials').delete().eq('id', id);
    if (error) {
      showToast(error.message, 'error');
      return { success: false, message: error.message };
    }

    setMaterials(prev => prev.filter(m => m.id !== id));
    showToast('Material deleted', 'info');
    return { success: true, message: 'Material deleted' };
  };

  const togglePublishMaterial = async (id: string): Promise<boolean> => {
    const existing = materials.find(m => m.id === id);
    if (!existing) return false;

    if (!canAdministerScope(existing.targetLevel, existing.department)) {
      showToast('Permission Denied: Outside your admin scope', 'error');
      return false;
    }

    const nextState = !existing.isPublished;
    const { error } = await supabase
      .from('materials')
      .update({ is_published: nextState, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      showToast(error.message, 'error');
      return false;
    }

    setMaterials(prev => prev.map(m => m.id === id ? { ...m, isPublished: nextState } : m));
    showToast(`Material ${nextState ? 'published' : 'hidden'}`, 'info');
    return true;
  };

  const incrementMaterialView = (id: string) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, viewCount: m.viewCount + 1 } : m));
    supabase.rpc('increment_material_view', { p_material_id: id }).then(({ error }) => {
      if (error) console.error('view increment failed:', error);
    });
  };

  const getMaterialsForSubject = (subjectId: string): Material[] => {
    return materials.filter(m => m.subjectId === subjectId && m.isPublished);
  };

  // ---------- Questions & Answers ----------
  const askQuestion = async (subjectId: string, title: string, content: string): Promise<boolean> => {
    if (!currentUser) {
      showToast('Please log in to ask a question', 'error');
      return false;
    }

    const { data: inserted, error } = await supabase
      .from('questions')
      .insert({ user_id: currentUser.id, subject_id: subjectId, title, content })
      .select()
      .single();

    if (error) {
      showToast(error.message, 'error');
      return false;
    }

    const row = inserted as any;
    const sub = subjects.find(s => s.id === subjectId);
    setQuestions(prev => [{
      id: row.id, userId: row.user_id, userName: currentUser.name,
      subjectId: row.subject_id, subjectName: sub?.name || 'Subject',
      targetLevel: row.target_level, department: row.dept || undefined,
      title: row.title, content: row.content, status: row.status,
      answers: [], createdAt: row.created_at, updatedAt: row.updated_at
    }, ...prev]);

    showToast('Your question has been posted for department instructors!', 'success');
    return true;
  };

  const answerQuestion = async (questionId: string, content: string): Promise<boolean> => {
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

    const { data: inserted, error } = await supabase
      .from('answers')
      .insert({ question_id: questionId, author_id: currentUser.id, content })
      .select()
      .single();

    if (error) {
      showToast(error.message, 'error');
      return false;
    }

    const ansRow = inserted as any;
    await supabase
      .from('questions')
      .update({ status: 'answered', updated_at: new Date().toISOString() })
      .eq('id', questionId);

    // Notify the asker
    await supabase.from('notifications').insert({
      user_id: q.userId,
      title: `Answer posted on "${q.title}"`,
      message: `${currentUser.name} answered your question.`,
      type: 'answer',
      link_url: `/questions/${questionId}`
    });

    const newAns = {
      id: ansRow.id, questionId, authorId: currentUser.id,
      authorName: currentUser.name, authorRole: currentUser.role,
      authorScope: currentUser.adminScope, content, createdAt: ansRow.created_at
    };

    setQuestions(prev => prev.map(item =>
      item.id === questionId
        ? { ...item, status: 'answered', answers: [...item.answers, newAns], updatedAt: new Date().toISOString() }
        : item
    ));

    showToast('Verified instructor answer posted!', 'success');
    return true;
  };

  const updateQuestionStatus = async (questionId: string, status: QuestionStatus): Promise<boolean> => {
    if (!currentUser || currentUser.role === 'student') return false;

    const q = questions.find(item => item.id === questionId);
    if (!q) return false;

    if (!canAdministerScope(q.targetLevel, q.department)) {
      showToast('Permission Denied: Question outside your admin scope', 'error');
      return false;
    }

    const { error } = await supabase
      .from('questions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', questionId);
    if (error) {
      showToast(error.message, 'error');
      return false;
    }

    setQuestions(prev => prev.map(item => item.id === questionId ? { ...item, status } : item));
    showToast(`Question status updated to ${status.toUpperCase()}`, 'info');
    return true;
  };

  // ---------- Super Admin: Admin Management ----------
  const createAdminUser = async (name: string, email: string, scope: AdminScope): Promise<boolean> => {
    if (currentUser?.role !== 'super_admin') {
      showToast('Permission Denied: Only Super Admin can provision admin accounts', 'error');
      return false;
    }

    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      showToast('An account with this email already exists', 'error');
      return false;
    }

    // Create the auth account, then restore our own session
    const { data: { session: mySession } } = await supabase.auth.getSession();
    const tempPassword = 'ChangeMe123!';

    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email: email.trim(),
      password: tempPassword,
      options: { data: { name } }
    });
    if (signUpErr || !signUpData.user) {
      showToast(signUpErr?.message || 'Failed to create admin auth account', 'error');
      return false;
    }
    const newId = signUpData.user.id;

    if (mySession) {
      await supabase.auth.setSession(mySession);
    }

    // Promote profile to admin (super_admin RLS policy permits this)
    const { error: profErr } = await supabase
      .from('profiles')
      .update({ role: 'admin', admin_scope: scope })
      .eq('id', newId);
    if (profErr) {
      showToast(profErr.message, 'error');
      return false;
    }

    setUsers(prev => [...prev, {
      id: newId, name, email: email.trim(), role: 'admin',
      adminScope: scope, isActive: true, createdAt: new Date().toISOString()
    }]);
    showToast(`Admin account for ${name} (${scope.toUpperCase()}) created! Temp password: ${tempPassword}`, 'success');
    return true;
  };

  const updateUserRole = async (userId: string, role: UserRole, adminScope?: AdminScope): Promise<boolean> => {
    if (currentUser?.role !== 'super_admin') {
      showToast('Only Super Admin can change account roles', 'error');
      return false;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role, admin_scope: role === 'student' ? null : (adminScope || null) })
      .eq('id', userId);
    if (error) {
      showToast(error.message, 'error');
      return false;
    }

    setUsers(prev => prev.map(u =>
      u.id === userId
        ? {
            ...u,
            role,
            adminScope: role === 'student' ? undefined : (adminScope || u.adminScope),
            academicProfile: role !== 'student' ? undefined : u.academicProfile
          }
        : u
    ));
    showToast(`Account role updated to ${role.replace('_', ' ').toUpperCase()}`, 'success');
    return true;
  };

  const updateAdminScope = async (adminId: string, newScope: AdminScope): Promise<boolean> => {
    if (currentUser?.role !== 'super_admin') {
      showToast('Only Super Admin can reassign admin scopes', 'error');
      return false;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ admin_scope: newScope })
      .eq('id', adminId);
    if (error) {
      showToast(error.message, 'error');
      return false;
    }

    setUsers(prev => prev.map(u => u.id === adminId ? { ...u, adminScope: newScope } : u));
    showToast('Admin scope updated successfully', 'success');
    return true;
  };

  const toggleAdminActive = async (adminId: string): Promise<boolean> => {
    if (currentUser?.role !== 'super_admin') return false;

    const admin = users.find(u => u.id === adminId);
    if (!admin) return false;
    const nextState = !admin.isActive;

    const { error } = await supabase
      .from('profiles')
      .update({ is_active: nextState })
      .eq('id', adminId);
    if (error) {
      showToast(error.message, 'error');
      return false;
    }

    setUsers(prev => prev.map(u => u.id === adminId ? { ...u, isActive: nextState } : u));
    showToast(`Admin account ${nextState ? 'enabled' : 'disabled'}`, 'info');
    return true;
  };

  const toggleUserActive = async (userId: string): Promise<boolean> => {
    if (currentUser?.role !== 'super_admin') {
      showToast('Only Super Admin can toggle account status', 'error');
      return false;
    }
    if (userId === currentUser.id) {
      showToast('You cannot deactivate your own account', 'error');
      return false;
    }
    const success = await toggleAdminActive(userId);
    return success;
  };

  const deleteUserAccount = async (userId: string): Promise<boolean> => {
    if (currentUser?.role !== 'super_admin') {
      showToast('Only Super Admin can delete accounts', 'error');
      return false;
    }
    if (userId === currentUser.id) {
      showToast('You cannot delete your own account', 'error');
      return false;
    }

    // Remove the profile row; the orphaned auth account can no longer sign in meaningfully.
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) {
      showToast(error.message, 'error');
      return false;
    }

    setUsers(prev => prev.filter(u => u.id !== userId));
    showToast('Account removed', 'info');
    return true;
  };

  const deleteAdmin = async (adminId: string): Promise<boolean> => {
    return deleteUserAccount(adminId);
  };

  // ---------- Notifications ----------
  const unreadNotificationCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  );

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    supabase.from('notifications').update({ read: true }).eq('id', id).then();
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (currentUserId) {
      supabase.from('notifications').update({ read: true }).eq('user_id', currentUserId).then();
    }
    showToast('All notifications marked as read', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        isLoading,
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
        getCatalogSubjectsForStudent,
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
        updateUserRole,
        updateAdminScope,
        toggleUserActive,
        toggleAdminActive,
        deleteUserAccount,
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
