// Past Life Calculator (Rebirth) - Main exports

export * from './types';
export * from './storage';
export * from './calculator';

// Re-export questionnaire data
import questions from '@/data/rebirth-questions.json';
import type { Question } from './types';

export const REBIRTH_QUESTIONS = questions as Question[];
