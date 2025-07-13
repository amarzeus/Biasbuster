import React, { useState, useEffect } from 'react';
import { XIcon, CheckCircleIcon, XCircleIcon, TrophyIcon, GraduationCapIcon } from './icons/Icons';
import { quizQuestions } from '../data/quizData';

interface QuizModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setScore(0);
        setShowResults(false);
    };

    const handleClose = () => {
        onClose();
        // Delay reset to allow closing animation
        setTimeout(() => {
            resetQuiz();
        }, 300);
    };

    const handleAnswerSelect = (answer: string) => {
        if (selectedAnswer) return; // Prevent changing answer after selection

        setSelectedAnswer(answer);
        if (answer === quizQuestions[currentQuestionIndex].correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
        } else {
            setShowResults(true);
        }
    };

    if (!isOpen) return null;

    const currentQuestion = quizQuestions[currentQuestionIndex];

    const getButtonClass = (option: string) => {
        if (!selectedAnswer) {
            return 'bg-white dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600';
        }
        if (option === currentQuestion.correctAnswer) {
            return 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-800 dark:text-green-300 ring-2 ring-green-500';
        }
        if (option === selectedAnswer) {
            return 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-800 dark:text-red-300';
        }
        return 'bg-white dark:bg-neutral-700 opacity-60';
    };
    
    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in"
            role="dialog"
            aria-modal="true"
        >
            <div className="relative bg-neutral-100 dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col m-4 animate-fade-in-up">
                <button 
                    onClick={handleClose} 
                    className="absolute top-3 right-3 p-2 rounded-full text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors z-10"
                    aria-label="Close quiz"
                >
                    <XIcon className="h-6 w-6" />
                </button>
                
                <div className="p-8 flex-grow overflow-y-auto">
                    { !showResults ? (
                        <>
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-trust-blue/10 dark:bg-ai-teal/20 text-trust-blue dark:text-ai-teal mb-3">
                                    <GraduationCapIcon className="h-7 w-7" />
                                </div>
                                <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">Bias Knowledge Quiz</h2>
                                <p className="text-sm text-neutral-500 mt-1">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
                            </div>
                            
                            <div className="text-lg font-semibold text-neutral-700 dark:text-neutral-200 mb-6 text-center">
                                {currentQuestion.question}
                            </div>

                            <div className="space-y-4">
                                {currentQuestion.options.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleAnswerSelect(option)}
                                        disabled={!!selectedAnswer}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${getButtonClass(option)}`}
                                    >
                                        <span className="font-medium">{option}</span>
                                        {selectedAnswer && option === currentQuestion.correctAnswer && <CheckCircleIcon className="h-6 w-6 text-green-600" />}
                                        {selectedAnswer && option !== currentQuestion.correctAnswer && option === selectedAnswer && <XCircleIcon className="h-6 w-6 text-red-600" />}
                                    </button>
                                ))}
                            </div>

                            {selectedAnswer && (
                                <div className="mt-6 p-4 bg-blue-50 dark:bg-neutral-700/50 border-l-4 border-blue-400 dark:border-blue-500 rounded-r-lg animate-fade-in">
                                    <p className="font-bold text-blue-800 dark:text-blue-300">Explanation</p>
                                    <p className="text-blue-700 dark:text-blue-300/90">{currentQuestion.explanation}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center flex flex-col items-center justify-center h-full">
                            <TrophyIcon className="h-24 w-24 text-gold-accent mb-4" />
                            <h2 className="text-3xl font-extrabold text-neutral-800 dark:text-white">Quiz Complete!</h2>
                            <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-300">You scored</p>
                            <p className="text-6xl font-bold text-trust-blue dark:text-ai-teal my-4">{score} / {quizQuestions.length}</p>
                             <div className="flex space-x-4">
                                <button onClick={resetQuiz} className="px-6 py-2 bg-neutral-200 dark:bg-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-500 font-semibold rounded-md transition-colors">
                                    Retake Quiz
                                </button>
                                <button onClick={handleClose} className="px-6 py-2 bg-trust-blue hover:bg-trust-blue-light dark:bg-ai-teal dark:hover:bg-ai-teal-light text-white font-bold rounded-md transition-colors">
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                {selectedAnswer && !showResults && (
                    <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 text-right">
                        <button 
                            onClick={handleNextQuestion}
                            className="px-6 py-2 bg-trust-blue hover:bg-trust-blue-light dark:bg-ai-teal dark:hover:bg-ai-teal-light text-white font-bold rounded-md shadow-sm transition-colors"
                        >
                            {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Show Results'}
                        </button>
                    </div>
                )}
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translate3d(0, 1rem, 0) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default QuizModal;