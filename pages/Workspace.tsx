import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, GraduationCap, Hash, ArrowRight, Loader2, AlertCircle, 
  Sparkles, Settings, Type, LayoutTemplate, X, Download, Languages, 
  FileText, BookOpen 
} from 'lucide-react';
import { MockTest, NoteRequest, NoteLanguage } from '../types';
import { generateMockTest, generateNotes } from '../services/geminiService';
import Notebook, { NotebookSettings } from '../components/Notebook';
import Footer from '../components/Footer';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Workspace: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'notes' | 'mocktests'>('notes');

    // --- NOTES STATE ---
    const [noteStep, setNoteStep] = useState<'input' | 'result'>('input');
    const [isNoteLoading, setIsNoteLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [noteError, setNoteError] = useState<string | null>(null);
    const [noteForm, setNoteForm] = useState<NoteRequest>({
        topic: '',
        grade: '',
        language: NoteLanguage.English
    });
    const [generatedContent, setGeneratedContent] = useState<string>('');
    const [showSettings, setShowSettings] = useState(false);
    const [printSettings, setPrintSettings] = useState<NotebookSettings>({
        fontSize: 'md',
        layout: 'standard'
    });

    // --- MOCK TEST STATE ---
    const [isTestLoading, setIsTestLoading] = useState(false);
    const [testError, setTestError] = useState<string | null>(null);
    const [testForm, setTestForm] = useState({
        topic: '',
        level: '',
        numQuestions: 10
    });

    // --- NOTES HANDLERS ---
    const handleGenerateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteForm.topic || !noteForm.grade) return;

        setIsNoteLoading(true);
        setNoteError(null);

        try {
            const result = await generateNotes(noteForm);
            setGeneratedContent(result.content);
            setNoteStep('result');
        } catch (err: any) {
            setNoteError(err.message || "An unexpected error occurred.");
        } finally {
            setIsNoteLoading(false);
        }
    };

    const handleExportPDF = async () => {
        const element = document.getElementById('printable-notebook');
        if (!element) return;

        setIsExporting(true);

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#0F0F0F',
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [imgWidth, imgHeight]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`${noteForm.topic.replace(/[^a-z0-9]/gi, '_')}_PoroBangla.pdf`);

        } catch (err) {
            console.error("Export failed:", err);
            alert("Could not export PDF. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    // --- MOCK TEST HANDLERS ---
    const handleGenerateTest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!testForm.topic || !testForm.level) return;

        setIsTestLoading(true);
        setTestError(null);

        try {
            const questions = await generateMockTest(testForm.topic, testForm.level, testForm.numQuestions);
            const newTest: MockTest = {
                topic: testForm.topic,
                level: testForm.level,
                questions: questions,
            };
            navigate('/test-session', { state: { test: newTest } });
        } catch (err: any) {
            setTestError(err.message || "An unexpected error occurred while generating the test.");
        } finally {
            setIsTestLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 w-full pt-28 px-4 md:px-8 pb-20 max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col items-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center font-serif">My Workspace</h1>
                    <p className="text-secondary-dark text-center mb-8">Synthesize knowledge and test your understanding.</p>

                    {/* Tab Switcher */}
                    <div className="bg-white/5 p-1 rounded-full flex gap-1 border border-white/5 relative">
                        <button
                            onClick={() => setActiveTab('notes')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all z-10 flex items-center gap-2 ${
                                activeTab === 'notes' ? 'text-black' : 'text-secondary hover:text-white'
                            }`}
                        >
                            <BookOpen size={14} /> Study Notes
                        </button>
                        <button
                            onClick={() => setActiveTab('mocktests')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all z-10 flex items-center gap-2 ${
                                activeTab === 'mocktests' ? 'text-black' : 'text-secondary hover:text-white'
                            }`}
                        >
                            <GraduationCap size={16} /> Mock Tests
                        </button>
                        
                        {/* Sliding Background */}
                        <motion.div 
                            className="absolute top-1 bottom-1 bg-gradient-to-r from-[#D8A441] to-[#F3C567] rounded-full"
                            initial={false}
                            animate={{
                                left: activeTab === 'notes' ? '4px' : '50%',
                                width: 'calc(50% - 4px)',
                                x: 0
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'notes' ? (
                        <motion.div
                            key="notes"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full flex flex-col items-center"
                        >
                            {noteStep === 'input' && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full max-w-2xl"
                                >
                                    <div className="relative group rounded-3xl p-[1px] overflow-hidden w-full shadow-2xl shadow-black/80">
                                        <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#D8A441_70%,#C8CCD1_100%)] opacity-100 will-change-transform" />
                                        
                                        <div className="relative bg-[#0F0F0F] rounded-3xl p-8 md:p-10 h-full w-full border border-white/5">
                                            <div className="mb-8 flex items-center gap-3">
                                                <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                                                    <Sparkles size={24} />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-white">Generate Notes</h2>
                                                    <p className="text-xs text-secondary-dark">AI-Powered Synthesis Engine</p>
                                                </div>
                                            </div>

                                            {noteError && (
                                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-200 text-sm">
                                                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-400" />
                                                    <span className="font-medium">{noteError}</span>
                                                </div>
                                            )}

                                            <form onSubmit={handleGenerateNote} className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-secondary-dark uppercase tracking-[0.2em] ml-1">Topic</label>
                                                    <div className="relative group">
                                                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-dark group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                                                        <input 
                                                            type="text" 
                                                            placeholder="Quantum Physics, The Civil War..."
                                                            value={noteForm.topic}
                                                            onChange={(e) => setNoteForm({...noteForm, topic: e.target.value})}
                                                            disabled={isNoteLoading}
                                                            className="w-full pl-12 pr-4 py-4 bg-[#141414] border border-secondary/20 rounded-xl focus:border-primary/50 focus:bg-[#1A1A1A] outline-none text-white placeholder-secondary-dark transition-all font-medium text-base shadow-inner"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-secondary-dark uppercase tracking-[0.2em] ml-1">Level / Context</label>
                                                    <div className="relative group">
                                                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-dark group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                                                        <input 
                                                            type="text"
                                                            list="grades"
                                                            placeholder="Undergraduate, Class 12, Professional..."
                                                            value={noteForm.grade}
                                                            onChange={(e) => setNoteForm({...noteForm, grade: e.target.value})}
                                                            disabled={isNoteLoading}
                                                            className="w-full pl-12 pr-4 py-4 bg-[#141414] border border-secondary/20 rounded-xl focus:border-primary/50 focus:bg-[#1A1A1A] outline-none text-white placeholder-secondary-dark transition-all font-medium text-base shadow-inner"
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

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-secondary-dark uppercase tracking-[0.2em] ml-1">Language</label>
                                                    <div className="relative bg-[#141414] p-1 rounded-xl border border-secondary/20 flex shadow-inner">
                                                        <button
                                                            type="button"
                                                            onClick={() => setNoteForm({...noteForm, language: NoteLanguage.English})}
                                                            disabled={isNoteLoading}
                                                            className={`relative flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 z-10 ${
                                                            noteForm.language === NoteLanguage.English 
                                                            ? 'text-black bg-gradient-to-r from-[#C8CCD1] to-[#E2E4E7] shadow-md border border-white/10' 
                                                            : 'text-secondary-dark hover:text-white'
                                                            }`}
                                                        >
                                                            <Type size={14} className={noteForm.language === NoteLanguage.English ? 'text-black' : 'opacity-50'} />
                                                            English
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setNoteForm({...noteForm, language: NoteLanguage.Bengali})}
                                                            disabled={isNoteLoading}
                                                            className={`relative flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 z-10 ${
                                                            noteForm.language === NoteLanguage.Bengali 
                                                            ? 'text-black bg-gradient-to-r from-[#C8CCD1] to-[#E2E4E7] shadow-md border border-white/10' 
                                                            : 'text-secondary-dark hover:text-white'
                                                            }`}
                                                        >
                                                            <Languages size={14} className={noteForm.language === NoteLanguage.Bengali ? 'text-black' : 'opacity-50'} />
                                                            Bengali
                                                        </button>
                                                    </div>
                                                </div>

                                                <motion.button 
                                                    type="submit"
                                                    disabled={isNoteLoading}
                                                    whileHover={!isNoteLoading ? { scale: 1.01, boxShadow: "0 0 25px -5px rgba(243, 197, 103, 0.5)" } : {}}
                                                    whileTap={!isNoteLoading ? { scale: 0.98 } : {}}
                                                    className={`w-full py-4 mt-2 bg-gradient-to-r from-[#D8A441] via-[#F3C567] to-[#D8A441] bg-[length:200%_auto] animate-gradient text-black font-bold tracking-wide rounded-xl shadow-lg shadow-[#D8A441]/20 flex items-center justify-center gap-2 overflow-hidden relative border border-white/10 ${
                                                        isNoteLoading ? 'cursor-not-allowed opacity-80' : ''
                                                    }`}
                                                    style={{ backgroundSize: '200% auto' }}
                                                >
                                                    {isNoteLoading ? (
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
                                </motion.div>
                            )}

                            {noteStep === 'result' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-full flex flex-col items-center"
                                >
                                    <div className="w-full max-w-5xl mb-8 flex flex-col md:flex-row justify-between items-end border-b border-secondary/20 pb-6">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif">{noteForm.topic}</h2>
                                                <div className="flex items-center gap-3 text-sm text-secondary-dark">
                                                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-medium text-primary">
                                                        {noteForm.grade}
                                                    </span>
                                                    <span className="text-secondary-dark">•</span>
                                                    <span className="text-secondary">{noteForm.language}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
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
                                                            className="absolute top-full right-0 mt-3 w-72 glass-panel bg-[#0F0F0F]/95 rounded-2xl border border-secondary/20 shadow-2xl p-5 z-50 backdrop-blur-2xl"
                                                        >
                                                            <div className="flex justify-between items-center mb-5 pb-2 border-b border-white/5">
                                                                <span className="text-xs font-bold uppercase tracking-wider text-secondary-dark">Appearance</span>
                                                                <button onClick={() => setShowSettings(false)} className="text-secondary-dark hover:text-white transition-colors">
                                                                    <X size={16} />
                                                                </button>
                                                            </div>

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

                                            <div className="flex gap-3">
                                                <button 
                                                    onClick={() => setNoteStep('input')}
                                                    className="px-6 py-2.5 rounded-xl bg-white/5 text-secondary hover:bg-white/10 hover:text-white transition-colors text-sm font-semibold border border-white/10"
                                                >
                                                    New Note
                                                </button>

                                                <button 
                                                    onClick={handleExportPDF}
                                                    disabled={isExporting}
                                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D8A441] to-[#F3C567] text-black hover:brightness-110 transition-all text-sm font-semibold shadow-lg shadow-[#D8A441]/20 flex items-center gap-2"
                                                >
                                                    {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                                    Export PDF
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <Notebook 
                                        content={generatedContent} 
                                        language={noteForm.language} 
                                        title={noteForm.topic}
                                        settings={printSettings}
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="mocktests"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full flex justify-center"
                        >
                            {/* Mock Test View */}
                            <div className="w-full max-w-2xl">
                                <div className="relative group rounded-3xl p-[1px] overflow-hidden w-full shadow-2xl shadow-black/80">
                                    <div className="absolute inset-[-100%] bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
                                    
                                    <div className="relative bg-[#0F0F0F] rounded-3xl p-8 shadow-2xl overflow-hidden border border-white/5">
                                        <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                                        
                                        <div className="flex items-center gap-3 mb-8 relative z-10">
                                            <div className="p-3 bg-gradient-to-br from-[#D8A441] to-[#F3C567] rounded-xl text-black shadow-lg shadow-[#D8A441]/20">
                                                <GraduationCap size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">New Practice Test</h2>
                                                <p className="text-xs text-secondary-dark">AI-Generated Assessment</p>
                                            </div>
                                        </div>

                                        {testError && (
                                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-200 text-sm">
                                                <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-400" />
                                                <span className="font-medium">{testError}</span>
                                            </div>
                                        )}

                                        <form onSubmit={handleGenerateTest} className="space-y-6 relative z-10">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-secondary-dark uppercase tracking-[0.2em] ml-1">Topic</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Biochemistry, History of Art"
                                                    value={testForm.topic}
                                                    onChange={(e) => setTestForm({ ...testForm, topic: e.target.value })}
                                                    disabled={isTestLoading}
                                                    className="w-full px-4 py-4 bg-[#141414] border border-secondary/20 rounded-xl focus:border-primary/50 outline-none text-white text-base font-medium transition-all"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-secondary-dark uppercase tracking-[0.2em] ml-1">Difficulty Level</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Undergraduate, Expert"
                                                    value={testForm.level}
                                                    onChange={(e) => setTestForm({ ...testForm, level: e.target.value })}
                                                    disabled={isTestLoading}
                                                    className="w-full px-4 py-4 bg-[#141414] border border-secondary/20 rounded-xl focus:border-primary/50 outline-none text-white text-base font-medium transition-all"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-secondary-dark uppercase tracking-[0.2em] ml-1">Questions ({testForm.numQuestions})</label>
                                                <div className="flex items-center gap-4 bg-[#141414] p-3 rounded-xl border border-secondary/20">
                                                    <Hash size={18} className="text-secondary-dark ml-2" />
                                                    <input
                                                        type="range"
                                                        min="5"
                                                        max="20"
                                                        step="1"
                                                        value={testForm.numQuestions}
                                                        onChange={(e) => setTestForm({ ...testForm, numQuestions: parseInt(e.target.value) })}
                                                        disabled={isTestLoading}
                                                        className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer range-slider"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isTestLoading}
                                                className="w-full py-4 mt-2 bg-white text-black font-bold rounded-xl shadow-lg hover:bg-gray-100 flex items-center justify-center gap-2 transition-all text-base"
                                            >
                                                {isTestLoading ? (
                                                    <>
                                                        <Loader2 size={18} className="animate-spin" /> Preparing Exam...
                                                    </>
                                                ) : (
                                                    <>
                                                        Start Assessment <ArrowRight size={18} />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <style>{`
                    .range-slider::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        width: 16px;
                        height: 16px;
                        background: #F3C567;
                        cursor: pointer;
                        border-radius: 50%;
                    }
                    @keyframes gradient {
                      0% { background-position: 0% 50%; }
                      50% { background-position: 100% 50%; }
                      100% { background-position: 0% 50%; }
                    }
                    .animate-gradient {
                      animation: gradient 4s ease infinite;
                    }
                `}</style>
            </div>
            <Footer />
        </div>
    );
};

export default Workspace;