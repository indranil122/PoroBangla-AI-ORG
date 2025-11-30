import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, RotateCcw, BrainCircuit } from 'lucide-react';
import { Deck, Flashcard } from '../types';
import { getDecks, saveDeck, calculateNextReview } from '../services/flashcardService';

const StudySession: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    const allDecks = getDecks();
    const foundDeck = allDecks.find(d => d.id === id);
    if (foundDeck) {
      setDeck(foundDeck);
      const now = Date.now();
      const dueCards = foundDeck.cards.filter(c => c.nextReviewDate <= now);
      setQueue(dueCards);
    }
  }, [id]);

  const handleRate = (quality: number) => {
    if (!deck || !queue[currentCardIndex]) return;

    const currentCard = queue[currentCardIndex];
    const updatedCard = calculateNextReview(currentCard, quality);

    // Update card in deck
    const updatedCards = deck.cards.map(c => c.id === currentCard.id ? updatedCard : c);
    const updatedDeck = { ...deck, cards: updatedCards, lastStudied: Date.now() };
    
    setDeck(updatedDeck);
    saveDeck(updatedDeck);

    // Move to next
    if (currentCardIndex < queue.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIndex(prev => prev + 1), 300);
    } else {
      setSessionComplete(true);
    }
  };

  if (!deck) return <div className="pt-32 text-center text-white">Loading Deck...</div>;

  if (queue.length === 0 && !sessionComplete) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">All Caught Up!</h1>
        <p className="text-secondary-dark mb-8">No cards due for review in this deck right now.</p>
        <button onClick={() => navigate('/flashcards')} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all">
            Back to Decks
        </button>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6"
        >
            <BrainCircuit size={40} className="text-primary" />
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">Session Complete</h1>
        <p className="text-secondary-dark mb-8">You reviewed {queue.length} cards today.</p>
        <button onClick={() => navigate('/flashcards')} className="px-8 py-3 bg-primary text-black rounded-full font-bold hover:shadow-lg transition-all">
            Finish
        </button>
      </div>
    );
  }

  const currentCard = queue[currentCardIndex];

  return (
    <div className="min-h-screen w-full pt-28 pb-12 px-4 flex flex-col items-center max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={() => navigate('/flashcards')} className="text-secondary hover:text-white flex items-center gap-2">
            <ArrowLeft size={20} /> <span className="hidden md:inline">Exit</span>
        </button>
        <div className="text-sm font-mono text-secondary-dark">
            {currentCardIndex + 1} / {queue.length}
        </div>
      </div>

      {/* 3D Flip Card */}
      <div className="perspective-1000 w-full max-w-2xl aspect-[3/2] relative group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
         <motion.div
            className="w-full h-full relative preserve-3d transition-all duration-500"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            style={{ transformStyle: 'preserve-3d' }}
         >
            {/* FRONT */}
            <div className="absolute inset-0 backface-hidden bg-[#0F0F0F] border border-secondary/20 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-2xl">
                <span className="absolute top-6 left-6 text-xs font-bold text-secondary-dark uppercase tracking-widest">Front</span>
                <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed">
                    {currentCard.front}
                </p>
                <div className="absolute bottom-6 text-secondary-dark text-sm animate-pulse">
                    Tap to Flip
                </div>
            </div>

            {/* BACK */}
            <div className="absolute inset-0 backface-hidden bg-[#141414] border border-primary/30 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-[0_0_50px_-10px_rgba(243,197,103,0.1)]" style={{ transform: 'rotateY(180deg)' }}>
                <span className="absolute top-6 left-6 text-xs font-bold text-primary uppercase tracking-widest">Back</span>
                <p className="text-xl md:text-2xl text-secondary leading-relaxed">
                    {currentCard.back}
                </p>
            </div>
         </motion.div>
      </div>

      {/* Controls */}
      <div className="mt-12 w-full max-w-2xl h-24 flex items-center justify-center">
         {!isFlipped ? (
             <p className="text-secondary-dark italic text-sm">Review the card, then tap to reveal the answer.</p>
         ) : (
             <div className="grid grid-cols-4 gap-3 w-full">
                 <button onClick={() => handleRate(0)} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all">
                    <span className="text-xs font-bold uppercase">Again</span>
                    <RotateCcw size={16} />
                 </button>
                 <button onClick={() => handleRate(3)} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all">
                    <span className="text-xs font-bold uppercase">Hard</span>
                    <span className="text-xs opacity-50">3d</span>
                 </button>
                 <button onClick={() => handleRate(4)} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all">
                    <span className="text-xs font-bold uppercase">Good</span>
                    <span className="text-xs opacity-50">5d</span>
                 </button>
                 <button onClick={() => handleRate(5)} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all">
                    <span className="text-xs font-bold uppercase">Easy</span>
                    <span className="text-xs opacity-50">7d</span>
                 </button>
             </div>
         )}
      </div>
    </div>
  );
};

export default StudySession;