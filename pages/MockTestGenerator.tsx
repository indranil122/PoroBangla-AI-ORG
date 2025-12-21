
import React, { useState } from 'react';
import { motion } from 'framer-motion';
// FIX: Using * as Router to handle potential export issues in some environments
import * as Router from 'react-router-dom';
import { Layers, GraduationCap, Hash, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { generateMockTest } from '../services/geminiService';
import { MockTest } from '../types';

// FIX: Casting motion components to any
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

const MockTestGenerator: React.FC = () => {
    const navigate = Router.useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        topic: '',
        level: '',
        numQuestions: 10
    });

    const handleGenerateTest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.topic || !formData.level) return;

        setIsLoading(true);
        setError(null);

        try {
            const questions = await generateMockTest(formData.topic, formData.level, formData.numQuestions);
            const newTest: MockTest = {
                topic: formData.topic,
                level: formData.level,
                questions: questions,
            };
            navigate('/test-session', { state: { test: newTest } });
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred while generating the test.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full z-10 flex flex-col items-center justify-center pt-24 pb-12 overflow-x-hidden">
            <MotionDiv
                key="mock-test-generator"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-2xl px-4"
            >
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4">AI Mock Test</h1>
                    <p className="text-lg md:text-xl text-secondary-dark max-w-xl mx-auto">Challenge your knowledge and identify areas for improvement with a custom-generated quiz.</p>
                </div>

                <div className="relative bg-[#0F0F0F] border border-secondary/10 rounded-3xl p-8 shadow-2xl">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-200 text-sm">
                            <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-400" />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}
                    <form onSubmit={handleGenerateTest} className="space-y-6">
                        {/* Topic Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-secondary-dark uppercase tracking-[0.2em] ml-1">Topic</label>
                            <div className="relative group">
                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-dark group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                                <input
                                    type="text"
                                    placeholder="e.g., Photosynthesis, World War II"
                                    value={formData.topic}
                                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                    disabled={isLoading}
                                    className="w-full pl-12 pr-4 py-4 bg-[#141414] border border-secondary/20 rounded-xl focus:border-primary/50 focus:bg-[#1A1A1A] focus:ring-4 focus:ring-primary/10 outline-none text-white placeholder-secondary-dark transition-all font-medium text-base shadow-inner"
                                    required
                                />
                            </div>
                        </div>

                        {/* Level Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-secondary-dark uppercase tracking-[0.2em] ml-1">Level / Context</label>
                            <div className="relative group">
                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-dark group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                                <input
                                    type="text"
                                    placeholder="e.g., High School, University, Beginner"
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                    disabled={isLoading}
                                    className="w-full pl-12 pr-4 py-4 bg-[#141414] border border-secondary/20 rounded-xl focus:border-primary/50 focus:bg-[#1A1A1A] focus:ring-4 focus:ring-primary/10 outline-none text-white placeholder-secondary-dark transition-all font-medium text-base shadow-inner"
                                    required
                                />
                            </div>
                        </div>

                        {/* Number of Questions */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-secondary-dark uppercase tracking-[0.2em] ml-1">Number of Questions ({formData.numQuestions})</label>
                            <div className="relative group flex items-center gap-4">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-dark pointer-events-none" size={18} />
                                <input
                                    type="range"
                                    min="5"
                                    max="20"
                                    step="1"
                                    value={formData.numQuestions}
                                    onChange={(e) => setFormData({ ...formData, numQuestions: parseInt(e.target.value) })}
                                    disabled={isLoading}
                                    className="w-full h-2 bg-[#141414] rounded-lg appearance-none cursor-pointer range-slider"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <MotionButton
                            type="submit"
                            disabled={isLoading}
                            whileHover={!isLoading ? { scale: 1.02, boxShadow: "0 0 25px -5px rgba(243, 197, 103, 0.4)" } : {}}
                            whileTap={!isLoading ? { scale: 0.98 } : {}}
                            className="w-full py-4 mt-4 bg-gradient-to-r from-[#D8A441] to-[#F3C567] text-black font-bold tracking-wide rounded-xl shadow-lg shadow-[#D8A441]/20 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> Generating Test...
                                </>
                            ) : (
                                <>
                                    Start Test <ArrowRight size={18} />
                                </>
                            )}
                        </MotionButton>
                    </form>
                </div>
            </MotionDiv>
            <style>{`
                .range-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: #F3C567;
                    cursor: pointer;
                    border-radius: 50%;
                    border: 2px solid #0F0F0F;
                }
                .range-slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    background: #F3C567;
                    cursor: pointer;
                    border-radius: 50%;
                    border: 2px solid #0F0F0F;
                }
            `}</style>
        </div>
    );
};

export default MockTestGenerator;
