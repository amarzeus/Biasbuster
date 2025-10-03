
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BiasAnalyser from '../components/BiasAnalyser';
import HowItWorks from '../components/HowItWorks';
import Education from './components/Education';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Modal from '../components/Modal';
import PrivacyPolicyContent from '../components/content/PrivacyPolicyContent';
import TermsContent from '../components/content/TermsContent';
import AccessibilityContent from '../components/content/AccessibilityContent';
import QuizModal from '../components/QuizModal';
import EnhancedDashboard from '../components/EnhancedDashboard';
import AccessibilityToolbar from '../components/AccessibilityToolbar';
import KnowledgeBase from '../components/KnowledgeBase';
import Transparency from '../components/Transparency';
import Blog from '../components/Blog';
import BlogPostModal from '../components/BlogPostModal';
import { HistoryItem, FeedbackVote, BiasAnalysisResult, GroundingChunk, BlogPost, QuizProgress, Badge, User } from '../types';
import ExtensionCTA from '../components/ExtensionCTA';
import JudgesCorner from './components/JudgesCorner';
import Hero from './components/Hero';
import { allBadges } from './data/badgesData';
import HistoryDetailModal from './components/HistoryDetailModal';

type ModalType = 'privacy' | 'terms' | 'accessibility';
export type FontSize = 'sm' | 'md' | 'lg';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [highContrast, setHighContrast] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const [quizProgress, setQuizProgress] = useState<QuizProgress>({ highScore: 0, attempts: 0 });
  const [unlockedBadges, setUnlockedBadges] = useState<Set<string>>(new Set());
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);
  const [isHistoryDetailOpen, setIsHistoryDetailOpen] = useState(false);

  // Mock current user - in real app this would come from auth
  const currentUser: User = {
    id: 'user-1',
    name: 'Demo User',
    email: 'demo@biasbuster.com',
  };

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);

    const apiKey = process.env.API_KEY;
    if (apiKey) {
        window.postMessage({
            type: "BIASBUSTER_API_KEY",
            apiKey: apiKey,
        }, "*");
    }

    try {
      const storedHistory = localStorage.getItem('biasbuster_history');
      if (storedHistory) setHistory(JSON.parse(storedHistory));
      const storedQuizProgress = localStorage.getItem('biasbuster_quiz_progress');
      if (storedQuizProgress) setQuizProgress(JSON.parse(storedQuizProgress));
      const storedBadges = localStorage.getItem('biasbuster_unlocked_badges');
      if (storedBadges) setUnlockedBadges(new Set(JSON.parse(storedBadges)));
    } catch (error) {
      console.error("Could not load from localStorage", error);
    }
    
    document.documentElement.classList.add(`text-size-${fontSize}`);
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('biasbuster_history', JSON.stringify(history));
    } catch (error) {
        console.error("Could not save history to localStorage", error);
    }
  }, [history]);

  useEffect(() => {
    try {
        localStorage.setItem('biasbuster_quiz_progress', JSON.stringify(quizProgress));
    } catch (error) {
        console.error("Could not save quiz progress to localStorage", error);
    }
  }, [quizProgress]);

  useEffect(() => {
    try {
        localStorage.setItem('biasbuster_unlocked_badges', JSON.stringify(Array.from(unlockedBadges)));
    } catch (error) {
        console.error("Could not save unlocked badges to localStorage", error);
    }
  }, [unlockedBadges]);
  
  const checkAndUnlockBadges = useCallback(() => {
    const newBadges = new Set(unlockedBadges);
    let changed = false;

    const unlock = (id: string) => {
        if (!newBadges.has(id)) {
            newBadges.add(id);
            changed = true;
        }
    };

    // Analysis-based badges
    if (history.length >= 1) unlock('first_analysis');
    if (history.length >= 5) unlock('analyst_5');
    if (history.length >= 20) unlock('analyst_20');

    // Feedback-based badges
    const feedbackCount = history.reduce((acc, item) => acc + Object.keys(item.feedback ?? {}).length, 0);
    if (feedbackCount >= 1) unlock('feedback_1');
    if (feedbackCount >= 10) unlock('feedback_10');
    
    // Quiz-based badges
    if (quizProgress.attempts > 0) unlock('quiz_taker');
    if (quizProgress.highScore === 5) unlock('quiz_master');

    if (changed) {
        setUnlockedBadges(newBadges);
    }
  }, [history, quizProgress, unlockedBadges]);

  useEffect(() => {
    checkAndUnlockBadges();
  }, [checkAndUnlockBadges]);

  useEffect(() => {
    const htmlEl = document.documentElement;
    if (isDarkMode) htmlEl.classList.add('dark'); else htmlEl.classList.remove('dark');
    htmlEl.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
    htmlEl.classList.add(`text-size-${fontSize}`);
    if (highContrast) htmlEl.classList.add('high-contrast'); else htmlEl.classList.remove('high-contrast');
  }, [isDarkMode, fontSize, highContrast]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const openModal = (modal: ModalType) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);
  const openQuiz = () => setIsQuizOpen(true);
  const closeQuiz = () => setIsQuizOpen(false);
  const openPost = (post: BlogPost) => setSelectedPost(post);
  const closePost = () => setSelectedPost(null);

  const getModalContent = () => {
      switch (activeModal) {
          case 'privacy': return { title: 'Privacy Policy', content: <PrivacyPolicyContent /> };
          case 'terms': return { title: 'Terms of Service', content: <TermsContent /> };
          case 'accessibility': return { title: 'Accessibility Statement', content: <AccessibilityContent /> };
          default: return { title: '', content: null };
      }
  };

  const addHistoryItem = (item: { sourceText: string, result: BiasAnalysisResult, sources: GroundingChunk[] }): number => {
      const newId = Date.now();
      const newItem: HistoryItem = {
          id: newId,
          timestamp: new Date().toLocaleString(),
          sourceText: item.sourceText,
          result: item.result,
          sources: item.sources,
          feedback: {},
      };
      setHistory(prev => [newItem, ...prev].slice(0, 50));
      return newId;
  };

  const updateFeedbackForHistoryItem = (historyId: number, findingIndex: number, vote: FeedbackVote) => {
      setHistory(prev => prev.map(item => {
          if (item.id === historyId) {
              const currentFeedback = item.feedback ?? {};
              return { ...item, feedback: { ...currentFeedback, [findingIndex]: vote } };
          }
          return item;
      }));
  };

  const handleQuizComplete = (score: number) => {
    setQuizProgress(prev => ({
        attempts: prev.attempts + 1,
        highScore: Math.max(prev.highScore, score),
    }));
  };

  const handleViewHistoryItem = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
    setIsHistoryDetailOpen(true);
  };

  const handleCloseHistoryDetail = () => {
    setIsHistoryDetailOpen(false);
    setSelectedHistoryItem(null);
  };

  const modalContent = getModalContent();

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow">
        <section id="home" className="bg-white dark:bg-neutral-900 overflow-hidden">
            <Hero />
        </section>

        <section id="analyser" className="bg-neutral-100 dark:bg-neutral-800/50 py-16">
          <BiasAnalyser addHistoryItem={addHistoryItem} updateFeedbackForHistoryItem={updateFeedbackForHistoryItem} />
        </section>
        
        <section id="how-it-works" className="bg-white dark:bg-neutral-900 py-16">
          <HowItWorks />
        </section>

        <section id="extension" className="bg-neutral-100 dark:bg-neutral-800 py-16">
          <ExtensionCTA />
        </section>

        <section id="dashboard" className="bg-white dark:bg-neutral-900 py-16">
          <EnhancedDashboard
            currentUser={currentUser}
          />
        </section>

        <section id="education" className="bg-neutral-100 dark:bg-neutral-800 py-16">
          <Education openQuiz={openQuiz} quizProgress={quizProgress} />
        </section>

        <section id="about" className="bg-white dark:bg-neutral-900 py-16">
          <About />
        </section>
        
        <section id="transparency" className="bg-neutral-100 dark:bg-neutral-800 py-16">
          <Transparency />
        </section>

        <section id="testimonials" className="bg-white dark:bg-neutral-900 py-16">
            <Testimonials />
        </section>

        <section id="knowledge-base" className="bg-neutral-100 dark:bg-neutral-800 py-16">
            <KnowledgeBase />
        </section>
        
        <section id="blog" className="bg-white dark:bg-neutral-900 py-16">
            <Blog onPostSelect={openPost} />
        </section>
        
        <section id="judges-corner" className="bg-neutral-100 dark:bg-neutral-800 py-16">
            <JudgesCorner />
        </section>

      </main>
      <Footer openModal={openModal} />
      
      <Modal isOpen={activeModal !== null} onClose={closeModal} title={modalContent.title}>
        {modalContent.content}
      </Modal>

      <QuizModal isOpen={isQuizOpen} onClose={closeQuiz} />

      <BlogPostModal isOpen={selectedPost !== null} onClose={closePost} post={selectedPost} />

      <HistoryDetailModal isOpen={isHistoryDetailOpen} onClose={handleCloseHistoryDetail} item={selectedHistoryItem} />

      <AccessibilityToolbar
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />
    </div>
  );
}

export default App;
