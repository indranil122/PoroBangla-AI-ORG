import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, Repeat } from 'lucide-react';
import { TestResult } from '../types';

const TestResult: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const result: TestResult | undefined = location.state?.result;

    if (!result) {
        // Redirect if no result data is present
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center">
                <p className="text-secondary-dark mb-4">No test result found.</p>
                <button onClick={() => navigate('/mock-test')} className="px-6 py-2 bg-primary text-black rounded-full font-bold">
                    Create a New Test
                </button>
            </div>
        );
    }
    
    const { test, userAnswers, score, total } = result;
    const percentage = Math.round((score / total) * 100);

    return (
        <div className="min-h-screen w-full pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header and Score Summary */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-[#0F0F0F] border border-secondary/10 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-8"
                >
                    <div className="flex-1">
                        <p className="text-sm font-medium text-primary-dark mb-1">Test Results</p>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{test.topic}</h1>
                        <p className="text-secondary-dark">{test.level}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-white">{score}<span className="text-2xl text-secondary-dark">/{total}</span></p>
                            <p className="text-xs text-secondary-dark uppercase font-bold tracking-wider">Score</p>
                        </div>
                        {/* Donut Chart */}
                        <div className="relative w-24 h-24">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                    className="stroke-current text-white/10"
                                    d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    strokeWidth="3"
                                />
                                <motion.path
                                    className="stroke-current text-primary"
                                    d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    strokeWidth="3"
                                    strokeDasharray={`${percentage}, 100`}
                                    initial={{ strokeDashoffset: 100 }}
                                    animate={{ strokeDashoffset: 100 - percentage }}
                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">{percentage}%</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Question Review */}
                <h2 className="text-2xl font-bold text-white mb-6">Review Your Answers</h2>
                <div className="space-y-6">
                    {test.questions.map((q, index) => {
                        const userAnswer = userAnswers[index];
                        const isCorrect = userAnswer === q.correctAnswerIndex;

                        return (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-6 rounded-2xl border ${isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}
                            >
                                <p className="font-semibold text-secondary mb-4">{index + 1}. {q.question}</p>
                                <div className="space-y-2 mb-4">
                                    {q.options.map((opt, i) => {
                                        const isUserChoice = userAnswer === i;
                                        const isCorrectChoice = q.correctAnswerIndex === i;
                                        return (
                                            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
                                                isCorrectChoice ? 'bg-green-500/10 text-green-300' :
                                                isUserChoice && !isCorrect ? 'bg-red-500/10 text-red-300 line-through' :
                                                'bg-white/5 text-secondary-dark'
                                            }`}>
                                                {isCorrectChoice ? <Check size={16} /> : isUserChoice ? <X size={16} /> : <div className="w-4 h-4"></div>}
                                                <span>{opt}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-secondary-dark p-3 bg-black/20 rounded-lg">
                                    <strong className="text-primary-dark">Explanation:</strong> {q.explanation}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
                
                {/* Actions */}
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => navigate('/mock-test')}
                        className="px-8 py-3 bg-primary text-black font-bold rounded-full flex items-center gap-2"
                    >
                        <Repeat size={16} /> Take Another Test
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestResult;
