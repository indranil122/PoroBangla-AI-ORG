import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, AlertCircle, Layers, GraduationCap, Settings, Type, LayoutTemplate, X, ArrowLeft } from 'lucide-react';
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
    } catch (err) {
      setError("Unable to generate notes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full z-10 flex flex-col pt-32">
      
      <AnimatePresence mode="wait">
        
        {/* INPUT FORM STATE */}
        {step === 'input' && (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col items-center justify-center p-6"
          >
            <div className="w-full max-w-lg">
              
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Configuration</h2>
                <p className="text-slate-500">Define the parameters for your study material.</p>
              </div>

              <div className="glass-panel p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 opacity-50"></div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 text-sm">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleGenerate} className="space-y-6">
                  
                  {/* Topic Input */}
                  <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Topic</label>
                      <div className="relative group">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Quantum Physics, The Civil War..."
                            value={formData.topic}
                            onChange={(e) => setFormData({...formData, topic: e.target.value})}
                            disabled={isLoading}
                            className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-xl focus:border-violet-500/50 focus:bg-black/40 focus:ring-1 focus:ring-violet-500/20 outline-none text-white placeholder-slate-600 transition-all font-medium"
                            required
                        />
                      </div>
                  </div>

                  {/* Grade Input */}
                  <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Level / Context</label>
                      <div className="relative group">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" size={18} />
                        <input 
                            type="text"
                            list="grades"
                            placeholder="Undergraduate, Class 12, Professional..."
                            value={formData.grade}
                            onChange={(e) => setFormData({...formData, grade: e.target.value})}
                            disabled={isLoading}
                            className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-xl focus:border-violet-500/50 focus:bg-black/40 focus:ring-1 focus:ring-violet-500/20 outline-none text-white placeholder-slate-600 transition-all font-medium"
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
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Language</label>
                      <div className="flex bg-black/20 p-1.5 rounded-xl border border-white/5">
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, language: NoteLanguage.English})}
                            disabled={isLoading}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                              formData.language === NoteLanguage.English 
                              ? 'bg-white/10 text-white shadow-lg border border-white/10' 
                              : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            English
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, language: NoteLanguage.Bengali})}
                            disabled={isLoading}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                              formData.language === NoteLanguage.Bengali 
                              ? 'bg-white/10 text-white shadow-lg border border-white/10' 
                              : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            Bengali
                        </button>
                      </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button 
                      type="submit"
                      disabled={isLoading}
                      whileHover={!isLoading ? { scale: 1.02 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                      className={`w-full py-4 mt-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-900/20 flex items-center justify-center gap-2 overflow-hidden relative ${
                          isLoading ? 'cursor-not-allowed opacity-80' : ''
                      }`}
                  >
                      {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 size={18} className="animate-spin" />
                            <span>Synthesizing...</span>
                          </div>
                      ) : (
                          <>
                              <span className="relative z-10 flex items-center gap-2">
                                Generate Material <Sparkles size={16} />
                              </span>
                              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                          </>
                      )}
                  </motion.button>
                </form>
              </div>
            </div>
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
             <div className="w-full max-w-5xl mb-8 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6">
                 <div className="flex items-center gap-4">
                     <button 
                        onClick={() => setStep('input')}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                     >
                        <ArrowLeft size={20} />
                     </button>
                     <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif">{formData.topic}</h2>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                                {formData.grade}
                            </span>
                            <span>•</span>
                            <span>{formData.language}</span>
                        </div>
                     </div>
                 </div>
                 
                 {/* Action Buttons & Settings Container */}
                 <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
                    
                    {/* Settings Toggle & Dropdown */}
                    <div className="relative">
                        <button 
                          onClick={() => setShowSettings(!showSettings)}
                          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors mb-1"
                        >
                          <Settings size={14} /> Print Settings
                        </button>
                        
                        <AnimatePresence>
                          {showSettings && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute bottom-full right-0 mb-3 w-64 glass-panel bg-[#0f1115]/95 rounded-xl border border-white/10 shadow-2xl p-4 z-50"
                            >
                              <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Appearance</span>
                                <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-white">
                                  <X size={14} />
                                </button>
                              </div>

                              {/* Font Size Control */}
                              <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2 text-slate-300 text-sm">
                                  <Type size={14} /> <span>Font Size</span>
                                </div>
                                <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                                  {(['sm', 'md', 'lg'] as const).map((size) => (
                                    <button
                                      key={size}
                                      onClick={() => setPrintSettings(s => ({ ...s, fontSize: size }))}
                                      className={`flex-1 py-1.5 rounded text-xs font-medium transition-all ${
                                        printSettings.fontSize === size 
                                        ? 'bg-violet-600 text-white shadow-md' 
                                        : 'text-slate-500 hover:text-slate-300'
                                      }`}
                                    >
                                      {size === 'sm' ? 'A-' : size === 'md' ? 'A' : 'A+'}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Layout Control */}
                              <div>
                                <div className="flex items-center gap-2 mb-2 text-slate-300 text-sm">
                                  <LayoutTemplate size={14} /> <span>Layout</span>
                                </div>
                                <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                                  {(['standard', 'wide'] as const).map((layout) => (
                                    <button
                                      key={layout}
                                      onClick={() => setPrintSettings(s => ({ ...s, layout: layout }))}
                                      className={`flex-1 py-1.5 rounded text-xs font-medium transition-all ${
                                        printSettings.layout === layout 
                                        ? 'bg-violet-600 text-white shadow-md' 
                                        : 'text-slate-500 hover:text-slate-300'
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
                            className="px-5 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium border border-white/10"
                        >
                            New Note
                        </button>
                        <button 
                            onClick={() => window.print()}
                            className="px-5 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors text-sm font-medium shadow-lg shadow-violet-900/20"
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
             <div className="mt-12 text-center text-slate-600 text-xs">
                Generated by PoroBangla AI Engine
             </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default Generator;