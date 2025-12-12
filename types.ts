export enum NoteLanguage {
  English = 'English',
  Bengali = 'Bengali'
}

export interface NoteRequest {
  topic: string;
  grade: string;
  language: NoteLanguage;
}

export interface GeneratedNote {
  content: string; // Markdown content
}

export interface Feature {
  title: string;
  description: string;
  icon: any; // Lucide icon type
}

// --- MOCK TEST SYSTEM TYPES ---

export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface MockTest {
  topic: string;
  level: string;
  questions: Question[];
}

export interface TestResult {
  test: MockTest;
  userAnswers: (number | null)[];
  score: number;
  total: number;
}

// --- FLASHCARD SYSTEM TYPES ---

export interface GeneratedFlashcard {
  front: string;
  back: string;
  cardType: string;
  tags: string[];
}

export interface Flashcard extends GeneratedFlashcard {
  id: string;
  interval: number;
  repetition: number;
  easeFactor: number;
  nextReviewDate: number;
  status: 'new' | 'learning' | 'review';
}

export interface Deck {
  id: string;
  title: string;
  cards: Flashcard[];
  createdAt: number;
  lastStudied: number;
  topic: string;
}