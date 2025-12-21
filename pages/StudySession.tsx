
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Using * as Router to handle potential export issues in some environments
import * as Router from 'react-router-dom';
import { ArrowLeft, CheckCircle, RotateCcw, BrainCircuit, X } from 'lucide-react';
import { Deck, Flashcard } from '../types';
import { getDecks, saveDeck, calculateNextReview } from '../services/flashcardService';

// FIX: Casting motion components to any
const MotionDiv = motion.div as any;
const MotionP = motion.p as any;

const StudySession: React.FC = () => {
  const { id } = Router.useParams();
  const navigate = Router.useNavigate();
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
      // Filter due cards or cards in learning state
      const dueCards = foundDeck.cards.filter(c => c.nextReviewDate <= now || c.status === 'learning');
      setQueue(dueCards.length > 0 ? dueCards : []); 
    }
  }, [id]);

  const handleRate = (quality: number) => {
    if (!deck || !queue[currentCardIndex]) return;

    const currentCard = queue[currentCardIndex];
    const updatedCard = calculateNextReview(currentCard, quality);

    // Update card in deck data
    const updatedCards = deck.cards.map(c => c.id === currentCard.id ? updatedCard : c);
    const updatedDeck = { ...deck, cards: updatedCards, lastStudied: Date.now() };
    
    setDeck(updatedDeck);
    saveDeck(updatedDeck);

    // Move to next card
    if (currentCardIndex < queue.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIndex(prev => prev + 1), 250); // Slight delay for smooth transition
    } else {
      setSessionComplete(true);
    }
  };

  if (!deck) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-secondary animate-pulse">Loading Study Session...</div>
    </div>
  );

  // EMPTY STATE (No cards due)
  if (queue.length === 0 && !sessionComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#050505] relative overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[#050505] opacity-50 z-0"></div>
        
        <div className="z-10 bg-[#0F0F0F] border border-secondary/10 p-12 rounded-3xl shadow-2xl max-w-md w-full relative">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-green-500/20">
                <CheckCircle size={40} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 font-serif">All Caught Up!</h1>
            <p className="text-secondary-dark mb-8 leading-relaxed">
                You've reviewed all pending cards for <span className="text-primary font-semibold">{deck.title}</span>. Great job!
            </p>
            <button 
                onClick={() => navigate('/flashcards')} 
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-medium transition-all flex items-center justify-center gap-2 group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Decks
            </button>
        </div>
      </div>
    );
  }

  // SESSION COMPLETE STATE
  if (sessionComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#050505]">
        <MotionDiv 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0F0F0F] border border-primary/20 p-12 rounded-3xl shadow-[0_0_50px_-20px_rgba(243,197,103,0.3)] max-w-md w-full"
        >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-primary/20">
                <BrainCircuit size={40} className="text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 font-serif">Session Complete</h1>
            <p className="text-secondary-dark mb-8">
                You reviewed <span className="text-white font-bold">{queue.length}</span> cards today.
                <br/>Knowledge reinforced.
            </p>
            <button 
                onClick={() => navigate('/flashcards')} 
                className="w-full py-4 bg-gradient-to-r from-[#D8A441] to-[#F3C567] text-black rounded-xl font-bold hover:shadow-lg transition-all"
            >
                Finish Session
            </button>
        </MotionDiv>
      </div>
    );
  }

  const currentCard = queue[currentCardIndex];
  const progress = ((currentCardIndex) / queue.length) * 100;

  return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

      {/* Navbar / Header */}
      <div className="w-full max-w-6xl mx-auto px-6 py-8 flex justify-between items-center z-10">
        <button 
            onClick={() => navigate('/flashcards')} 
            className="text-secondary-dark hover:text-white flex items-center gap-2 transition-colors"
        >
            <X size={24} />
            <span className="hidden sm:inline font-medium">Exit Study Mode</span>
        </button>
        
        <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-secondary-dark uppercase tracking-widest mb-1">Progress</span>
            <div className="flex items-center gap-3">
                <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-primary transition-all duration-500 ease-out" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <span className="text-sm font-mono text-primary font-bold">
                    {currentCardIndex + 1}/{queue.length}
                </span>
            </div>
        </div>
      </div>

      {/* MAIN CARD AREA */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12 relative z-10">
        
        {/* The Card Container */}
        <div 
            className="perspective-1500 w-full max-w-2xl aspect-[1.6/1] md:aspect-[1.8/1] relative group cursor-pointer" 
            onClick={() => setIsFlipped(!isFlipped)}
        >
             {/* Realistic Stack Effect (Cards behind) */}
             {queue.length - currentCardIndex > 1 && (
                 <div className="absolute top-2 left-2 w-full h-full bg-[#1a1a1a] rounded-3xl border border-white/5 shadow-none -z-10 scale-[0.98]"></div>
             )}
             {queue.length - currentCardIndex > 2 && (
                 <div className="absolute top-4 left-4 w-full h-full bg-[#141414] rounded-3xl border border-white/5 shadow-none -z-20 scale-[0.96]"></div>
             )}

             <MotionDiv
                className="w-full h-full relative preserve-3d transition-all duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)]"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                style={{ transformStyle: 'preserve-3d' }}
             >
                {/* FRONT FACE */}
                <div 
                    className="absolute inset-0 backface-hidden bg-[#0F0F0F] rounded-3xl flex flex-col items-center justify-center p-8 md:p-16 text-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7)] border border-secondary/10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2' fill='%23ffffff' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`
                    }}
                >
                    <div className="absolute top-6 right-6">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-secondary-dark">?</span>
                        </div>
                    </div>
                    
                    <span className="text-xs font-bold text-secondary-dark uppercase tracking-[0.2em] mb-6 opacity-60">Question</span>
                    
                    <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight font-medium drop-shadow-md select-none">
                        {currentCard.front}
                    </h2>
                    
                    <div className="absolute bottom-8 text-sm text-secondary-dark font-medium opacity-50 animate-pulse">
                        Click card to flip
                    </div>
                </div>

                {/* BACK FACE */}
                <div 
                    className="absolute inset-0 backface-hidden bg-[#161616] rounded-3xl flex flex-col items-center justify-center p-8 md:p-16 text-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7)] border border-primary/20"
                    style={{ 
                        transform: 'rotateY(180deg)',
                        backgroundImage: `radial-gradient(circle at top right, rgba(243, 197, 103, 0.05), transparent 70%)`
                    }}
                >
                    <div className="absolute top-6 right-6">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <BrainCircuit size={14} className="text-primary" />
                        </div>
                    </div>

                    <span className="text-xs font-bold text-primary-dark uppercase tracking-[0.2em] mb-6 opacity-80">Answer</span>
                    
                    <p className="text-xl md:text-2xl text-secondary leading-relaxed font-light select-none">
                        {currentCard.back}
                    </p>
                </div>
             </MotionDiv>
        </div>

        {/* CONTROLS AREA */}
        <div className="mt-16 w-full max-w-xl h-24 flex items-center justify-center">
            <AnimatePresence mode="wait">
                {!isFlipped ? (
                    <MotionP 
                        key="instruction"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-secondary-dark italic text-sm font-medium tracking-wide"
                    >
                        Recall the answer, then reveal the card.
                    </MotionP>
                ) : (
                    <MotionDiv 
                        key="controls"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="grid grid-cols-4 gap-4 w-full"
                    >
                        <button onClick={() => handleRate(0)} className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-red-500/50 hover:bg-red-500/5 transition-all">
                            <span className="text-[10px] font-bold uppercase text-secondary-dark group-hover:text-red-400 transition-colors">Again</span>
                            <RotateCcw size={20} className="text-secondary group-hover:text-red-400 transition-colors" />
                        </button>
                        <button onClick={() => handleRate(3)} className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-white/30 hover:bg-white/5 transition-all">
                            <span className="text-[10px] font-bold uppercase text-secondary-dark group-hover:text-white transition-colors">Hard</span>
                            <span className="text-sm font-bold text-secondary group-hover:text-white transition-colors">3d</span>
                        </button>
                        <button onClick={() => handleRate(4)} className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
                            <span className="text-[10px] font-bold uppercase text-secondary-dark group-hover:text-blue-400 transition-colors">Good</span>
                            <span className="text-sm font-bold text-secondary group-hover:text-blue-400 transition-colors">5d</span>
                        </button>
                        <button onClick={() => handleRate(5)} className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all">
                            <span className="text-[10px] font-bold uppercase text-secondary-dark group-hover:text-primary transition-colors">Easy</span>
                            <span className="text-sm font-bold text-secondary group-hover:text-primary transition-colors">7d</span>
                        </button>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default StudySession;
