
import React from 'react';
import { Group, UserRole } from './types';

export const COLORS = {
  primary: '#2481cc', // Telegram Blue
  secondary: '#34b7f1',
  success: '#31b545',
  error: '#ff595a',
};

export const MOCK_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'English Advanced A1',
    studentsCount: 12,
    lessons: [
      {
        id: 'l1',
        topic: 'Present Simple vs Continuous',
        description: 'Deep dive into everyday actions and current movements.',
        files: ['grammar_sheet.pdf'],
        createdAt: Date.now() - 86400000,
        homework: {
          id: 'hw1',
          title: 'Verb Practice',
          attempts: 2,
          bestScore: 85,
          tasks: [
            {
              id: 't1',
              type: 'fill-blanks',
              question: 'Complete the sentence',
              data: { text: 'I [___] to school every day.', options: ['go', 'goes', 'going'] },
              correctAnswer: 'go'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'g2',
    name: 'IELTS Preparation',
    studentsCount: 8,
    lessons: []
  }
];
