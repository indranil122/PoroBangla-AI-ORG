import { Deck, Flashcard, GeneratedFlashcard } from "../types";

const STORAGE_KEY = 'porobangla_flashcard_decks';

// --- SM-2 ALGORITHM ---
// Quality: 0 (Fail), 3 (Hard), 4 (Good), 5 (Easy)
export const calculateNextReview = (card: Flashcard, quality: number): Flashcard => {
  let { interval, repetition, easeFactor } = card;

  if (quality >= 3) {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetition += 1;
  } else {
    repetition = 0;
    interval = 1;
  }

  // Update Ease Factor (standard SM-2 formula)
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextReviewDate = Date.now() + interval * 24 * 60 * 60 * 1000;

  return {
    ...card,
    interval,
    repetition,
    easeFactor,
    nextReviewDate,
    status: quality < 3 ? 'learning' : 'review'
  };
};

// --- DECK MANAGEMENT ---

export const getDecks = (): Deck[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load decks", e);
    return [];
  }
};

export const saveDeck = (deck: Deck): void => {
  const decks = getDecks();
  const existingIndex = decks.findIndex(d => d.id === deck.id);
  
  if (existingIndex >= 0) {
    decks[existingIndex] = deck;
  } else {
    decks.push(deck);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
};

export const deleteDeck = (deckId: string): void => {
  const decks = getDecks().filter(d => d.id !== deckId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
};

export const createDeckFromAI = (topic: string, cardsData: GeneratedFlashcard[]): Deck => {
  const newCards: Flashcard[] = cardsData.map(c => ({
    id: crypto.randomUUID(),
    front: c.front,
    back: c.back,
    cardType: c.cardType,
    tags: c.tags,
    interval: 0,
    repetition: 0,
    easeFactor: 2.5,
    nextReviewDate: Date.now(), // Due immediately
    status: 'new'
  }));

  const newDeck: Deck = {
    id: crypto.randomUUID(),
    title: topic,
    cards: newCards,
    createdAt: Date.now(),
    lastStudied: 0,
    topic
  };

  saveDeck(newDeck);
  return newDeck;
};