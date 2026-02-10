
export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export type TaskType = 'fill-blanks' | 'word-order' | 'matching' | 'multiple-choice';

export interface Task {
  id: string;
  type: TaskType;
  question: string;
  data: any; // Context specific to type
  correctAnswer: any;
}

export interface Homework {
  id: string;
  title: string;
  tasks: Task[];
  attempts: number;
  bestScore?: number;
}

export interface Lesson {
  id: string;
  topic: string;
  description: string;
  files: string[];
  homework?: Homework;
  createdAt: number;
}

export interface Group {
  id: string;
  name: string;
  studentsCount: number;
  lessons: Lesson[];
}

export interface UserState {
  role: UserRole;
  username: string;
  name?: string;
  phone?: string;
  onboarded: boolean;
  groups: Group[];
}
