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

// --- FLASHCARD SYSTEM TYPES ---

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  
  // Spaced Repetition Data
  interval: number; // Days until next review
  repetition: number; // Number of successful reviews
  easeFactor: number; // Difficulty multiplier (starts at 2.5)
  nextReviewDate: number; // Timestamp
  
  status: 'new' | 'learning' | 'review';
}

export interface Deck {
  id: string;
  title: string;
  cards: Flashcard[];
  createdAt: number;
  lastStudied: number;
  topic?: string;
}