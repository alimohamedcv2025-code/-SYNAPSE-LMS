export type UserRole = 'student' | 'admin' | 'super_admin';

export type AdminScope = 'level_2' | 'level_3' | 'level_4' | 'summer' | 'case' | 'all';

export type AcademicLevel = 'level_2' | 'level_3' | 'level_4' | 'summer' | 'case';

export type Department = 'AI' | 'CS' | 'IS';

export type Semester = 1 | 2;

export type MaterialType = 'video' | 'pdf' | 'exam' | 'summary' | 'book' | 'other';

export type QuestionStatus = 'pending' | 'answered' | 'closed';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  adminScope?: AdminScope; // If role is 'admin'
  academicProfile?: AcademicProfile; // If role is 'student'
  isActive: boolean;
  createdAt: string;
}

export interface AcademicProfile {
  level: AcademicLevel;
  department?: Department; // Required for Level 3
  semester?: Semester; // Required for Level 2, Level 3, Case
  selectedSubjectIds: string[]; // List of subject IDs selected
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  iconName?: string;
  primaryLevel: AcademicLevel;
  department?: Department;
  semester?: Semester;
  tags: string[];
}

export interface SubjectOffering {
  id: string;
  subjectId: string;
  level: AcademicLevel;
  semester?: Semester;
  department?: Department;
  available: boolean;
}

export interface Material {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  url: string;
  subjectId: string;
  subjectName: string;
  targetLevel: AcademicLevel;
  department?: Department;
  semester?: Semester;
  isPublished: boolean;
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  durationOrPages?: string; // e.g. "45 mins" or "12 pages" or "250 pages"
  provider?: string; // e.g. "YouTube", "Google Drive", "Notion", "GitHub", "MIT OCW"
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  subjectId: string;
  subjectName: string;
  targetLevel: AcademicLevel;
  department?: Department;
  title: string;
  content: string;
  status: QuestionStatus;
  answers: Answer[];
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorScope?: AdminScope;
  content: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'material' | 'answer' | 'system' | 'academic';
  read: boolean;
  createdAt: string;
  linkUrl?: string;
}
