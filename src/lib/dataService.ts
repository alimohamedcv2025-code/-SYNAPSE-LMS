import { supabase } from './supabase';
import {
  User, Subject, Material, Question, NotificationItem,
  UserRole, AdminScope, AcademicLevel, Department,
  MaterialType, QuestionStatus
} from '../types';

// ============ DB Row Types (snake_case) ============

export interface ProfileRow {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  admin_scope: AdminScope | null;
  is_active: boolean;
  level: AcademicLevel | null;
  dept: Department | null;
  semester: number | null;
  created_at: string;
}

export interface SubjectRow {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  icon_name: string | null;
  primary_level: AcademicLevel;
  dept: Department | null;
  semester: number | null;
  tags: string[];
  created_at: string;
}

export interface MaterialRow {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  url: string;
  subject_id: string;
  target_level: AcademicLevel;
  dept: Department | null;
  semester: number | null;
  is_published: boolean;
  created_by: string;
  duration_or_pages: string | null;
  provider: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  subjects?: { name: string } | null;
  profiles?: { name: string; role: UserRole } | null;
}

export interface AnswerRow {
  id: string;
  question_id: string;
  author_id: string;
  content: string;
  created_at: string;
  profiles?: { name: string; role: UserRole; admin_scope: AdminScope | null } | null;
}

export interface QuestionRow {
  id: string;
  user_id: string;
  subject_id: string;
  title: string;
  content: string;
  status: QuestionStatus;
  target_level: AcademicLevel;
  dept: Department | null;
  created_at: string;
  updated_at: string;
  profiles?: { name: string; avatar?: string } | null;
  subjects?: { name: string } | null;
  answers?: AnswerRow[];
}

export interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'material' | 'answer' | 'system' | 'academic';
  read: boolean;
  link_url: string | null;
  created_at: string;
}

// ============ Mappers (DB -> App types) ============

export function mapProfileToUser(row: ProfileRow): User {
  const isStudent = row.role === 'student';
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    role: row.role,
    adminScope: row.admin_scope || undefined,
    isActive: row.is_active,
    createdAt: row.created_at,
    academicProfile: isStudent && row.level
      ? {
          level: row.level,
          department: row.dept || undefined,
          semester: (row.semester as 1 | 2) || undefined,
          selectedSubjectIds: [] // hydrated separately from enrollments
        }
      : undefined
  };
}

export function mapSubjectRow(row: SubjectRow): Subject {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    credits: row.credits,
    iconName: row.icon_name || undefined,
    primaryLevel: row.primary_level,
    department: row.dept || undefined,
    semester: (row.semester as 1 | 2) || undefined,
    tags: row.tags || []
  };
}

export function mapMaterialRow(row: MaterialRow): Material {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    url: row.url,
    subjectId: row.subject_id,
    subjectName: row.subjects?.name || 'Subject',
    targetLevel: row.target_level,
    department: row.dept || undefined,
    semester: (row.semester as 1 | 2) || undefined,
    isPublished: row.is_published,
    createdBy: {
      id: row.created_by,
      name: row.profiles?.name || 'Staff',
      role: row.profiles?.role || 'admin'
    },
    durationOrPages: row.duration_or_pages || undefined,
    provider: row.provider || undefined,
    viewCount: row.view_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function mapQuestionRow(row: QuestionRow): Question {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.profiles?.name || 'Student',
    subjectId: row.subject_id,
    subjectName: row.subjects?.name || 'Subject',
    targetLevel: row.target_level,
    department: row.dept || undefined,
    title: row.title,
    content: row.content,
    status: row.status,
    answers: (row.answers || []).map(a => ({
      id: a.id,
      questionId: a.question_id,
      authorId: a.author_id,
      authorName: a.profiles?.name || 'Instructor',
      authorRole: a.profiles?.role || 'admin',
      authorScope: a.profiles?.admin_scope || undefined,
      content: a.content,
      createdAt: a.created_at
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function mapNotificationRow(row: NotificationRow): NotificationItem {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    type: row.type,
    read: row.read,
    createdAt: row.created_at,
    linkUrl: row.link_url || undefined
  };
}

// ============ Data Fetchers ============

const MATERIAL_SELECT = '*, subjects(name), profiles(name, role)';
const QUESTION_SELECT = '*, profiles(name), subjects(name), answers(*, profiles(name, role, admin_scope))';

export async function fetchProfiles(): Promise<User[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at');
  if (error) throw error;
  return (data as ProfileRow[]).map(mapProfileToUser);
}

export async function fetchSubjects(): Promise<Subject[]> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('code');
  if (error) throw error;
  return (data as SubjectRow[]).map(mapSubjectRow);
}

export async function fetchMaterials(): Promise<Material[]> {
  const { data, error } = await supabase
    .from('materials')
    .select(MATERIAL_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as MaterialRow[]).map(mapMaterialRow);
}

export async function fetchQuestions(): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select(QUESTION_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as QuestionRow[]).map(mapQuestionRow);
}

export async function fetchNotifications(userId: string): Promise<NotificationItem[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as NotificationRow[]).map(mapNotificationRow);
}

export async function fetchEnrollmentIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('subject_id')
    .eq('user_id', userId);
  if (error) throw error;
  return (data as { subject_id: string }[]).map(r => r.subject_id);
}
