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