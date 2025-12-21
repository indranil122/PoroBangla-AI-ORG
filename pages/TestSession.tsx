
import React, { useState, useEffect } from 'react';
// FIX: Using * as Router to handle potential export issues in some environments
import * as Router from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2, ArrowRight } from 'lucide-react';
import { MockTest, TestResult } from '../types';

// FIX: Casting motion components to any
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

const TestSession: React.FC = () => {
    const navigate = Router.useNavigate();
    const location = Router.useLocation();
    const [test, setTest] = useState<MockTest | null>(null);
    const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    useEffect(() => {
        if (location.state?.test) {
            setTest(location.state.test);
            setUserAnswers(new Array(location.state.test.questions.length).fill(null));
        } else {
            // If no test data, redirect to generator
            navigate('/mock-test');
        }
    }, [location.state, navigate]);

    const handleAnswerSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedAnswer(index);
        setIsAnswered(true);

        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = index;
        setUserAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < test!.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            // Finish test
            const score = userAnswers.reduce((acc, answer, index) => {
                return answer === test!.questions[index].correctAnswerIndex ? acc + 1 : acc;
            }, 0);

            const result: TestResult = {
                test: test!,
                userAnswers,
                score,
                total: test!.questions.length
            };
            navigate('/test-result', { state: { result } });
        }
    };

    if (!test) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }
    
    const question = test.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

    return (
        <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-3xl">
                {/* Header and Progress */}
                <div className="mb-8">
                    <p className="text-sm font-medium text-primary mb-2 text-center">{test.topic}</p>
                    <div className="w-full bg-[#141414] rounded-full h-2.5 border border-secondary/10">
                        <MotionDiv
                            className="bg-primary h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        />
                    </div>
                    <p className="text-xs text-secondary-dark text-center mt-2 font-mono">Question {currentQuestionIndex + 1} of {test.questions.length}</p>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                    <MotionDiv
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="bg-[#0F0F0F] border border-secondary/10 rounded-3xl p-8 shadow-2xl"
                    >
                        <h2 className="text-xl md:text-2xl font-semibold text-white mb-8 leading-relaxed">{question.question}</h2>

                        {/* Options */}
                        <div className="space-y-4">
                            {question.options.map((option, index) => {
                                const isCorrect = index === question.correctAnswerIndex;
                                const isSelected = selectedAnswer === index;
                                
                                let stateClasses = "border-secondary/20 hover:border-primary/50 hover:bg-white/5";
                                if (isAnswered) {
                                    if (isCorrect) {
                                        stateClasses = "bg-green-500/10 border-green-500/50 ring-2 ring-green-500/50";
                                    } else if (isSelected && !isCorrect) {
                                        stateClasses = "bg-red-500/10 border-red-500/50 ring-2 ring-red-500/50";
                                    } else {
                                        stateClasses = "border-secondary/20 opacity-50";
                                    }
                                }

                                return (
                                    <MotionButton
                                        key={index}
                                        onClick={() => handleAnswerSelect(index)}
                                        disabled={isAnswered}
                                        whileHover={!isAnswered ? { scale: 1.02 } : {}}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all duration-300 ${stateClasses}`}
                                    >
                                        <span className="text-secondary font-medium">{option}</span>
                                        {isAnswered && (isCorrect ? <Check className="text-green-500" /> : isSelected ? <X className="text-red-500" /> : null)}
                                    </MotionButton>
                                );
                            })}
                        </div>
                        
                        {isAnswered && (
                            <MotionDiv 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                            >
                                <div className="p-4 bg-white/5 rounded-lg text-sm text-secondary-dark flex-1">
                                    <strong className="text-primary-dark">Explanation:</strong> {question.explanation}
                                </div>
                                <button
                                    onClick={handleNextQuestion}
                                    className="w-full sm:w-auto px-8 py-3 bg-primary text-black font-bold rounded-full flex items-center justify-center gap-2"
                                >
                                    {currentQuestionIndex === test.questions.length - 1 ? 'Finish' : 'Next'} <ArrowRight size={18} />
                                </button>
                            </MotionDiv>
                        )}
                    </MotionDiv>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TestSession;
