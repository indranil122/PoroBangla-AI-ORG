import React, { useEffect, useState } from 'react';
// FIX: The `Variants` type from Framer Motion is used to correctly type the animation variants object. This resolves a TypeScript error where the `type` property was being inferred as a generic `string` instead of the required literal type ('spring').
import { motion, Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layers, BrainCircuit, Trash2, ArrowRight, Play, Clock, Plus } from 'lucide-react';
import { Deck } from '../types';
import { getDecks, deleteDeck } from '../services/flashcardService';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const FlashcardDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    setDecks(getDecks().sort((a, b) => b.createdAt - a.createdAt));
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this deck?")) {
      deleteDeck(id);
      setDecks(prev => prev.filter(d => d.id !== id));
    }
  };

  const getDueCount = (deck: Deck) => {
    const now = Date.now();
    return deck.cards.filter(c => c.nextReviewDate <= now).length;
  };

  return (
    <div className="min-h-screen w-full pt-32 px-6 pb-20 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 pb-8 border-b border-white/5">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2 block">Your Library</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 font-serif">Flashcard Decks</h1>
          <p className="text-secondary-dark text-lg font-light max-w-lg mt-4">
            Master your subjects with our advanced spaced repetition system.
          </p>
        </div>
        <button 
          onClick={() => navigate('/generate-flashcards')}
          className="mt-6 md:mt-0 px-8 py-4 bg-[#F3C567] hover:bg-[#D8A441] text-black font-bold rounded-full transition-all flex items-center gap-2 shadow-[0_0_30px_-5px_rgba(243,197,103,0.4)] group"
        >
          <Plus size={20} /> New Deck <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Empty State */}
      {decks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-secondary/10 rounded-[2rem] bg-[#0A0A0A] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 text-secondary-dark group-hover:text-primary transition-colors duration-500">
             <BrainCircuit size={48} />
          </div>
          <h3 className="text-2xl text-white font-bold mb-3 font-serif">Your Library is Empty</h3>
          <p className="text-secondary-dark mb-8 max-w-md leading-relaxed">
            Generate your first intelligent flashcard deck from your notes to start learning efficiently.
          </p>
          <button 
             onClick={() => navigate('/generate-flashcards')}
             className="px-8 py-3 bg-white/10 hover:bg-white text-white hover:text-black font-bold rounded-full transition-all"
          >
            Create First Deck
          </button>
        </div>
      ) : (
        /* Deck Grid */
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          {decks.map((deck) => {
            const dueCount = getDueCount(deck);
            const totalCards = deck.cards.length;
            const progress = totalCards > 0 ? (totalCards - dueCount) / totalCards * 100 : 100;
            
            return (
              <motion.div
                key={deck.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                onClick={() => navigate(`/study/${deck.id}`)}
                className="group relative bg-[#0F0F0F] border border-white/5 hover:border-primary/30 rounded-[2rem] p-8 cursor-pointer transition-all duration-300 shadow-xl hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden"
              >
                {/* Hover Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/5 rounded-2xl text-primary border border-white/5 group-hover:border-primary/20 transition-colors">
                        <Layers size={24} />
                    </div>
                    <button onClick={(e) => handleDelete(e, deck.id)} className="p-2 text-secondary-dark hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 size={18} />
                    </button>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 line-clamp-1 font-serif group-hover:text-primary transition-colors">{deck.title}</h3>
                <p className="text-xs text-secondary-dark uppercase tracking-widest mb-8 font-bold opacity-60">
                  Created {new Date(deck.createdAt).toLocaleDateString()}
                </p>

                <div className="flex items-end justify-between mt-auto">
                   <div className="flex gap-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-secondary-dark font-bold uppercase tracking-wider mb-1">Total</span>
                        <span className="text-xl font-bold text-white">{totalCards}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-secondary-dark font-bold uppercase tracking-wider mb-1">Due</span>
                        <span className={`text-xl font-bold ${dueCount > 0 ? 'text-primary' : 'text-green-500'}`}>
                          {dueCount}
                        </span>
                      </div>
                   </div>

                   <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Play size={20} fill="currentColor" className="ml-1" />
                   </button>
                </div>
                
                {/* Progress Line */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/5">
                   <div 
                      className="h-full bg-primary transition-all duration-700 ease-out" 
                      style={{ width: `${progress}%` }}
                   />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default FlashcardDashboard;