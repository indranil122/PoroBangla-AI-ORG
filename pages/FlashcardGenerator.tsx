
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Using * as Router to handle potential export issues in some environments
import * as Router from 'react-router-dom';
import { Layers, FileText, ArrowRight, Loader2, Save, Trash2, Plus, Sparkles, Tag, AlertCircle } from 'lucide-react';
import { generateFlashcards } from '../services/geminiService';
import { createDeckFromAI } from '../services/flashcardService';
import { GeneratedFlashcard } from '../types';

// FIX: Casting motion components to any
const MotionDiv = motion.div as any;

const FlashcardGenerator: React.FC = () => {
  const navigate = Router.useNavigate();
  const [step, setStep] = useState<'input' | 'review'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [cards, setCards] = useState<GeneratedFlashcard[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const generatedCards = await generateFlashcards(topic, context);
      setCards(generatedCards);
      setStep('review');
    } catch (err: any) {
      setError(err.message || "Failed to generate flashcards.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDeck = () => {
    if (cards.length === 0) return;
    createDeckFromAI(topic, cards);
    navigate('/flashcards');
  };

  const handleDeleteCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleUpdateCard = (index: number, field: keyof GeneratedFlashcard, value: string) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    setCards(updated);
  };

  return (
    <div className="min-h-screen w-full pt-24 pb-12 px-4 md:px-8 flex flex-col items-center">
      <AnimatePresence mode="wait">
        
        {/* INPUT MODE */}
        {step === 'input' && (
          <MotionDiv
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
                 <Sparkles size={12} /> AI Flashcard Engine
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Create Your Deck</h1>
              <p className="text-secondary-dark text-lg">
                Enter a topic or paste your notes. We'll extract concepts and build a study deck for you.
              </p>
            </div>

            <div className="bg-[#0F0F0F] border border-secondary/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
               {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-200 text-sm">
                      <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-400" />
                      <span className="font-medium">{error}</span>
                  </div>
               )}

               <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-secondary-dark uppercase tracking-widest ml-1">Topic</label>
                    <div className="relative group">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-dark group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input 
                            type="text" 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Photosynthesis, The Cold War..." 
                            className="w-full pl-12 pr-4 py-4 bg-[#141414] border border-secondary/20 rounded-xl focus:border-blue-500/50 focus:bg-[#1A1A1A] outline-none text-white placeholder-secondary-dark transition-all"
                            required
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-secondary-dark uppercase tracking-widest ml-1">Content / Notes (Optional)</label>
                    <div className="relative group">
                        <FileText className="absolute left-4 top-4 text-secondary-dark group-focus-within:text-blue-400 transition-colors" size={18} />
                        <textarea 
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder="Paste text here to generate specific cards from your material..." 
                            className="w-full pl-12 pr-4 py-4 bg-[#141414] border border-secondary/20 rounded-xl focus:border-blue-500/50 focus:bg-[#1A1A1A] outline-none text-white placeholder-secondary-dark transition-all min-h-[150px] resize-none"
                        />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                  >
                    {isLoading ? (
                        <>
                           <Loader2 size={20} className="animate-spin" /> Analyzing Content...
                        </>
                    ) : (
                        <>
                           Generate Cards <ArrowRight size={20} />
                        </>
                    )}
                  </button>
               </form>
            </div>
          </MotionDiv>
        )}

        {/* REVIEW MODE */}
        {step === 'review' && (
          <MotionDiv
            key="review"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-6xl"
          >
             <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{topic}</h1>
                    <p className="text-secondary-dark">{cards.length} cards generated</p>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <button 
                        onClick={() => setStep('input')}
                        className="px-6 py-2.5 rounded-xl bg-white/5 text-secondary hover:text-white transition-colors"
                    >
                        Discard
                    </button>
                    <button 
                        onClick={handleSaveDeck}
                        className="px-8 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                        <Save size={18} /> Save Deck
                    </button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.map((card, idx) => (
                    <MotionDiv 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-[#0F0F0F] border border-secondary/10 rounded-2xl p-6 group hover:border-blue-500/30 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20`}>
                                    {card.cardType}
                                </span>
                                {card.tags?.map(tag => (
                                    <span key={tag} className="text-[10px] font-bold px-2 py-1 rounded bg-white/5 text-secondary border border-white/5 flex items-center gap-1">
                                        <Tag size={10} /> {tag}
                                    </span>
                                ))}
                            </div>
                            <button 
                                onClick={() => handleDeleteCard(idx)}
                                className="text-secondary-dark hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-secondary-dark uppercase tracking-wider block mb-1">Front</label>
                                <textarea
                                    value={card.front}
                                    onChange={(e) => handleUpdateCard(idx, 'front', e.target.value)}
                                    className="w-full bg-[#141414] border border-secondary/20 rounded-lg p-3 text-white text-sm focus:border-blue-500/50 outline-none resize-none h-20"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-secondary-dark uppercase tracking-wider block mb-1">Back</label>
                                <textarea
                                    value={card.back}
                                    onChange={(e) => handleUpdateCard(idx, 'back', e.target.value)}
                                    className="w-full bg-[#141414] border border-secondary/20 rounded-lg p-3 text-secondary text-sm focus:border-blue-500/50 outline-none resize-none h-24"
                                />
                            </div>
                        </div>
                    </MotionDiv>
                ))}
                
                {/* Add Manual Card Button */}
                <button 
                    onClick={() => setCards([...cards, { front: '', back: '', cardType: 'Manual', tags: [] }])}
                    className="border border-dashed border-secondary/20 rounded-2xl p-6 flex flex-col items-center justify-center text-secondary-dark hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all min-h-[300px]"
                >
                    <Plus size={32} className="mb-2" />
                    <span className="font-bold">Add Custom Card</span>
                </button>
             </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlashcardGenerator;
