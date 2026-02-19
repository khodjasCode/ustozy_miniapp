
export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export type TaskType = 'fill-blanks' | 'word-order' | 'matching' | 'multiple-choice';

export interface Task {
  id: string;
  type: TaskType;
  question: string;
  data: any;
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
  teacherNickname: string;
  studentNicknames: string[];
  lessons: Lesson[];
}

export interface UserState {
  role: UserRole;
  username: string;
  nickname: string;
  name: string;
  phone: string;
  onboarded: boolean;
  completedHomeworkIds?: string[];
}

export interface GlobalDB {
  users: UserState[];
  groups: Group[];
}
