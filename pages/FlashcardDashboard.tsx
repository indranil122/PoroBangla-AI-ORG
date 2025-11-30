import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layers, BrainCircuit, Trash2, ArrowRight, Play, Clock } from 'lucide-react';
import { Deck } from '../types';
import { getDecks, deleteDeck } from '../services/flashcardService';

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Flashcard Decks</h1>
          <p className="text-secondary-dark">Master your subjects with spaced repetition.</p>
        </div>
        <button 
          onClick={() => navigate('/generate')}
          className="mt-4 md:mt-0 px-6 py-3 bg-white/5 border border-secondary/20 hover:border-primary/50 text-secondary hover:text-white rounded-xl transition-all flex items-center gap-2"
        >
          <Layers size={18} /> Create New from Notes
        </button>
      </div>

      {decks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-secondary/20 rounded-3xl bg-[#0F0F0F]">
          <BrainCircuit size={48} className="text-secondary-dark mb-4 opacity-50" />
          <h3 className="text-xl text-white font-medium mb-2">No Decks Found</h3>
          <p className="text-secondary-dark mb-6 max-w-md">Generate notes first, then convert them into intelligent flashcards to start building your library.</p>
          <button 
             onClick={() => navigate('/generate')}
             className="px-6 py-2.5 bg-primary text-black font-bold rounded-full hover:shadow-[0_0_20px_rgba(243,197,103,0.4)] transition-all"
          >
            Go to Generator
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => {
            const dueCount = getDueCount(deck);
            const totalCards = deck.cards.length;
            
            return (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/study/${deck.id}`)}
                className="group relative bg-[#0F0F0F] border border-secondary/10 hover:border-primary/50 rounded-2xl p-6 cursor-pointer transition-all shadow-lg hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => handleDelete(e, deck.id)} className="p-2 text-secondary-dark hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{deck.title}</h3>
                <p className="text-xs text-secondary-dark uppercase tracking-widest mb-6">
                  {new Date(deck.createdAt).toLocaleDateString()}
                </p>

                <div className="flex items-center justify-between mt-auto">
                   <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-secondary-dark font-medium flex items-center gap-1">
                          <Layers size={12} /> Total
                        </span>
                        <span className="text-lg font-bold text-secondary">{totalCards}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-secondary-dark font-medium flex items-center gap-1">
                          <Clock size={12} /> Due
                        </span>
                        <span className={`text-lg font-bold ${dueCount > 0 ? 'text-primary' : 'text-green-500'}`}>
                          {dueCount}
                        </span>
                      </div>
                   </div>

                   <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                      <Play size={18} fill="currentColor" />
                   </button>
                </div>
                
                {/* Progress Bar Visual */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 overflow-hidden rounded-b-2xl">
                   <div 
                      className="h-full bg-primary/50" 
                      style={{ width: `${(totalCards - dueCount) / totalCards * 100}%` }}
                   />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FlashcardDashboard;