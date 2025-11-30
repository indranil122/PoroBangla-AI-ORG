import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, AlertCircle, Layers, GraduationCap, Settings, Type, LayoutTemplate, X, ArrowLeft, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NoteLanguage, NoteRequest } from '../types';
import { generateNotes } from '../services/geminiService';
import Notebook, { NotebookSettings } from '../components/Notebook';

const Generator: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NoteRequest>({
    topic: '',
    grade: '',
    language: NoteLanguage.English
  });
  const [generatedContent, setGeneratedContent] = useState<string>('');
  
  // Print Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [printSettings, setPrintSettings] = useState<NotebookSettings>({
    fontSize: 'md',
    layout: 'standard'
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic || !formData.grade) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateNotes(formData);
      setGeneratedContent(result.content);
      setStep('result');
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full z-10 flex flex-col pt-24 md:pt-32 pb-12 overflow-x-hidden">
      
      <AnimatePresence mode="wait">
        
        {/* INPUT FORM STATE */}
        {step === 'input' && (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col items-center justify-start px-4 md:px-6"
          >
            <div className="w-full max-w-[640px] flex flex-col items-center">
              
              {/* Cinematic Header Section */}
              <div className="text-center mb-12 relative w-full px-4">
                {/* Refined Volumetric Glow - Gold/White */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-[#F3C567]/10 blur-[80px] rounded-full pointer-events-none"></div>
                
                {/* Main Title */}
                <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-4 leading-[1.1] drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                  Craft Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-[#F3C567] to-[#8A8F94]">
                    Knowledge Blueprint
                  </span>
                </h1>
                
                {/* Subtitle */}
                <p className="relative z-10 text-secondary-dark text-lg md:text-xl font-light tracking-wide max-w-lg mx-auto leading-relaxed">
                  Define the foundation of your personalized study material.
                </p>
              </div>

              {/* Running Border Container - Gold/Silver */}
              <div className="relative group rounded-3xl p-[1px] overflow-hidden w-full max-w-[540px] shadow-2xl shadow-black/80">
                
                {/* The Animated Spinner Gradient - Gold & Silver */}
                <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#D8A441_70%,#C8CCD1_100%)] opacity-100 will-change-transform" />
                
                {/* The Inner Content Card */}
                <div className="relative bg-[#0F0F0F] rounded-3xl p-8 md:p-10 h-full w-full border border-white/5">
                    
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-200 text-sm">
                            <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-400" />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleGenerate} className="space-y-7">
                      
                      {/* Topic Input */}
                      <div className="space-y-2">
                          <label className="text-[10px] font-bold text-secondary-dark uppercase tracking-[0.2em] ml-1">Topic</label>
                          <div className="relative group">
                            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-dark group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                            <input 
                                type="text" 
                                placeholder="Quantum Physics, The Civil War..."
                                value={formData.topic}
                                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-4 bg-[#141414] border border-secondary/20 rounded-xl focus:border-primary/50 focus:bg-[#1A1A1A] focus:ring-4 focus:ring-primary/10 outline-none text-white placeholder-secondary-dark transition-all font-medium text-base shadow-inner"
                                required
                            />
                          </div>
                      </div>

                      {/* Grade Input */}
                      <div className="space-y-2">
                          <label className="text-[10px] font-bold text-secondary-dark uppercase tracking-[0.2em] ml-1">Level / Context</label>
                          <div className="relative group">
                            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-dark group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                            <input 
                                type="text"
                                list="grades"
                                placeholder="Undergraduate, Class 12, Professional..."
                                value={formData.grade}
                                onChange={(e) => setFormData({...formData, grade: e.target.value})}
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-4 bg-[#141414] border border-secondary/20 rounded-xl focus:border-primary/50 focus:bg-[#1A1A1A] focus:ring-4 focus:ring-primary/10 outline-none text-white placeholder-secondary-dark transition-all font-medium text-base shadow-inner"
                                required
                            />
                            <datalist id="grades">
                                <option value="High School (Class 12)" />
                                <option value="Undergraduate (B.Sc)" />
                                <option value="Postgraduate (MBA)" />
                                <option value="Research Level (PhD)" />
                                <option value="Professional Certification" />
                                <option value="Beginner Guide" />
                            </datalist>
                          </div>
                      </div>

                      {/* Language Selector */}
                      <div className="space-y-2">
                          <label className="text-[10px] font-bold text-secondary-dark uppercase tracking-[0.2em] ml-1">Language</label>
                          <div className="relative bg-[#141414] p-1 rounded-xl border border-secondary/20 flex shadow-inner">
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, language: NoteLanguage.English})}
                                disabled={isLoading}
                                className={`relative flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 z-10 ${
                                  formData.language === NoteLanguage.English 
                                  ? 'text-black bg-gradient-to-r from-[#C8CCD1] to-[#E2E4E7] shadow-md border border-white/10' 
                                  : 'text-secondary-dark hover:text-white'
                                }`}
                            >
                                <Type size={14} className={formData.language === NoteLanguage.English ? 'text-black' : 'opacity-50'} />
                                English
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, language: NoteLanguage.Bengali})}
                                disabled={isLoading}
                                className={`relative flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 z-10 ${
                                  formData.language === NoteLanguage.Bengali 
                                  ? 'text-black bg-gradient-to-r from-[#C8CCD1] to-[#E2E4E7] shadow-md border border-white/10' 
                                  : 'text-secondary-dark hover:text-white'
                                }`}
                            >
                                <Languages size={14} className={formData.language === NoteLanguage.Bengali ? 'text-black' : 'opacity-50'} />
                                Bengali
                            </button>
                          </div>
                      </div>

                      {/* Submit Button */}
                      <motion.button 
                          type="submit"
                          disabled={isLoading}
                          whileHover={!isLoading ? { scale: 1.01, boxShadow: "0 0 25px -5px rgba(243, 197, 103, 0.5)" } : {}}
                          whileTap={!isLoading ? { scale: 0.98 } : {}}
                          className={`w-full py-4 mt-2 bg-gradient-to-r from-[#D8A441] via-[#F3C567] to-[#D8A441] bg-[length:200%_auto] animate-gradient text-black font-bold tracking-wide rounded-xl shadow-lg shadow-[#D8A441]/20 flex items-center justify-center gap-2 overflow-hidden relative border border-white/10 ${
                              isLoading ? 'cursor-not-allowed opacity-80' : ''
                          }`}
                          style={{ backgroundSize: '200% auto' }}
                      >
                          {isLoading ? (
                              <div className="flex items-center gap-2">
                                <Loader2 size={18} className="animate-spin text-black" />
                                <span>Synthesizing...</span>
                              </div>
                          ) : (
                              <>
                                  <span className="relative z-10 flex items-center gap-2">
                                    Generate Material <Sparkles size={16} className="text-black" />
                                  </span>
                              </>
                          )}
                      </motion.button>
                    </form>
                </div>
              </div>
            </div>
            
            <style>{`
              @keyframes gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .animate-gradient {
                animation: gradient 4s ease infinite;
              }
            `}</style>
          </motion.div>
        )}

        {/* RESULT STATE */}
        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full min-h-screen pt-4 pb-20 px-4 md:px-8 flex flex-col items-center"
          >
             <div className="w-full max-w-5xl mb-8 flex flex-col md:flex-row justify-between items-end border-b border-secondary/20 pb-6">
                 <div className="flex items-center gap-4">
                     <button 
                        onClick={() => setStep('input')}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-secondary hover:text-white transition-colors border border-white/5"
                     >
                        <ArrowLeft size={20} />
                     </button>
                     <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif">{formData.topic}</h2>
                        <div className="flex items-center gap-3 text-sm text-secondary-dark">
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-medium text-primary">
                                {formData.grade}
                            </span>
                            <span className="text-secondary-dark">•</span>
                            <span className="text-secondary">{formData.language}</span>
                        </div>
                     </div>
                 </div>
                 
                 {/* Action Buttons & Settings Container */}
                 <div className="flex flex-col items-end gap-3 mt-4 md:mt-0 relative z-50">
                    
                    {/* Settings Toggle & Dropdown */}
                    <div className="relative">
                        <button 
                          onClick={() => setShowSettings(!showSettings)}
                          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary-dark hover:text-white transition-colors mb-2 bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10"
                        >
                          <Settings size={14} /> Print Settings
                        </button>
                        
                        <AnimatePresence>
                          {showSettings && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              className="absolute top-full right-0 mt-3 w-72 glass-panel bg-[#0F0F0F]/95 rounded-2xl border border-secondary/20 shadow-2xl p-5 z-[100] backdrop-blur-2xl"
                            >
                              <div className="flex justify-between items-center mb-5 pb-2 border-b border-white/5">
                                <span className="text-xs font-bold uppercase tracking-wider text-secondary-dark">Appearance</span>
                                <button onClick={() => setShowSettings(false)} className="text-secondary-dark hover:text-white transition-colors">
                                  <X size={16} />
                                </button>
                              </div>

                              {/* Font Size Control */}
                              <div className="mb-5">
                                <div className="flex items-center gap-2 mb-3 text-secondary text-sm font-medium">
                                  <Type size={16} className="text-primary" /> <span>Font Size</span>
                                </div>
                                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                                  {(['sm', 'md', 'lg'] as const).map((size) => (
                                    <button
                                      key={size}
                                      onClick={() => setPrintSettings(s => ({ ...s, fontSize: size }))}
                                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                                        printSettings.fontSize === size 
                                        ? 'bg-primary text-black shadow-lg' 
                                        : 'text-secondary-dark hover:text-white'
                                      }`}
                                    >
                                      {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Layout Control */}
                              <div>
                                <div className="flex items-center gap-2 mb-3 text-secondary text-sm font-medium">
                                  <LayoutTemplate size={16} className="text-primary" /> <span>Page Layout</span>
                                </div>
                                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                                  {(['standard', 'wide'] as const).map((layout) => (
                                    <button
                                      key={layout}
                                      onClick={() => setPrintSettings(s => ({ ...s, layout: layout }))}
                                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                                        printSettings.layout === layout 
                                        ? 'bg-primary text-black shadow-lg' 
                                        : 'text-secondary-dark hover:text-white'
                                      }`}
                                    >
                                      {layout.charAt(0).toUpperCase() + layout.slice(1)}
                                    </button>
                                  ))}
                                </div>
                              </div>

                            </motion.div>
                          )}
                        </AnimatePresence>
                    </div>

                    {/* Main Actions */}
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setStep('input')}
                            className="px-6 py-2.5 rounded-xl bg-white/5 text-secondary hover:bg-white/10 hover:text-white transition-colors text-sm font-semibold border border-white/10"
                        >
                            New Note
                        </button>
                        <button 
                            onClick={() => window.print()}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D8A441] to-[#F3C567] text-black hover:brightness-110 transition-all text-sm font-semibold shadow-lg shadow-[#D8A441]/20 flex items-center gap-2"
                        >
                            Export PDF
                        </button>
                    </div>
                 </div>
             </div>
             
             <Notebook 
                content={generatedContent} 
                language={formData.language} 
                title={formData.topic}
                settings={printSettings}
             />

             {/* Footer Mark */}
             <div className="mt-12 mb-8 text-center text-secondary-dark text-xs font-mono uppercase tracking-widest opacity-50">
                Generated by PoroBangla AI Engine
             </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default Generator;