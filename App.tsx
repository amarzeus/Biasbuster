import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BiasAnalyser from './components/BiasAnalyser';
import HowItWorks from './components/HowItWorks';
import Education from './components/Education';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Modal from './components/Modal';
import PrivacyPolicyContent from './components/content/PrivacyPolicyContent';
import TermsContent from './components/content/TermsContent';
import AccessibilityContent from './components/content/AccessibilityContent';
import QuizModal from './components/QuizModal';
import Dashboard from './components/Dashboard';
import AccessibilityToolbar from './components/AccessibilityToolbar';
import KnowledgeBase from './components/KnowledgeBase';
import Transparency from './components/Transparency';
import Blog from './components/Blog';
import BlogPostModal from './components/BlogPostModal';
import { HistoryItem, FeedbackVote, BiasAnalysisResult, GroundingChunk, BlogPost } from './types';
import ExtensionCTA from './components/ExtensionCTA';

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

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);

    // This is for the Chrome extension to receive the API key.
    // It checks for the key and sends it to the content script if the extension is installed.
    const apiKey = process.env.API_KEY;
    if (apiKey) {
        window.postMessage({
            type: "BIASBUSTER_API_KEY",
            apiKey: apiKey,
        }, "*");
    }

    try {
      const storedHistory = localStorage.getItem('biasbuster_history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Could not load history from localStorage", error);
      setHistory([]);
    }
    
    // Set initial font size class on mount
    document.documentElement.classList.add(`text-size-${fontSize}`);
  }, []);

  useEffect(() => {
    // Save history whenever it changes
    try {
        localStorage.setItem('biasbuster_history', JSON.stringify(history));
    } catch (error) {
        console.error("Could not save history to localStorage", error);
    }
  }, [history]);

  useEffect(() => {
    const htmlEl = document.documentElement;
    
    // Dark Mode
    if (isDarkMode) {
      htmlEl.classList.add('dark');
    } else {
      htmlEl.classList.remove('dark');
    }
    
    // Font Size
    htmlEl.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
    htmlEl.classList.add(`text-size-${fontSize}`);

    // High Contrast
    if (highContrast) {
        htmlEl.classList.add('high-contrast');
    } else {
        htmlEl.classList.remove('high-contrast');
    }

  }, [isDarkMode, fontSize, highContrast]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const openModal = (modal: ModalType) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  const openQuiz = () => setIsQuizOpen(true);
  const closeQuiz = () => setIsQuizOpen(false);

  const openPost = (post: BlogPost) => setSelectedPost(post);
  const closePost = () => setSelectedPost(null);
  
  const getModalContent = () => {
      switch (activeModal) {
          case 'privacy':
              return { title: 'Privacy Policy', content: <PrivacyPolicyContent /> };
          case 'terms':
              return { title: 'Terms of Service', content: <TermsContent /> };
          case 'accessibility':
              return { title: 'Accessibility Statement', content: <AccessibilityContent /> };
          default:
              return { title: '', content: null };
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
      // Keep the last 50 items
      setHistory(prev => [newItem, ...prev].slice(0, 50));
      return newId;
  };

  const updateFeedbackForHistoryItem = (historyId: number, findingIndex: number, vote: FeedbackVote) => {
      setHistory(prev => prev.map(item => {
          if (item.id === historyId) {
              return {
                  ...item,
                  feedback: {
                      ...item.feedback,
                      [findingIndex]: vote,
                  }
              };
          }
          return item;
      }));
  };

  const modalContent = getModalContent();

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow">
        <section id="analyser" className="bg-white dark:bg-neutral-800/50 py-16">
          <BiasAnalyser
            addHistoryItem={addHistoryItem}
            updateFeedbackForHistoryItem={updateFeedbackForHistoryItem}
          />
        </section>
        
        <section id="how-it-works" className="bg-neutral-100 dark:bg-neutral-900 py-16">
          <HowItWorks />
        </section>

        <section id="extension" className="bg-white dark:bg-neutral-800/50 py-16">
          <ExtensionCTA />
        </section>

        <section id="dashboard" className="bg-neutral-100 dark:bg-neutral-900 py-16">
          <Dashboard history={history} />
        </section>

        <section id="education" className="bg-white dark:bg-neutral-800/50 py-16">
          <Education openQuiz={openQuiz} />
        </section>

        <section id="about" className="bg-neutral-100 dark:bg-neutral-900 py-16">
          <About />
        </section>
        
        <section id="transparency" className="bg-white dark:bg-neutral-800/50 py-16">
          <Transparency />
        </section>

        <section id="testimonials" className="bg-neutral-100 dark:bg-neutral-900 py-16">
            <Testimonials />
        </section>

        <section id="knowledge-base" className="bg-white dark:bg-neutral-800/50 py-16">
            <KnowledgeBase />
        </section>
        
        <section id="blog" className="bg-neutral-100 dark:bg-neutral-900 py-16">
            <Blog onPostSelect={openPost} />
        </section>

      </main>
      <Footer openModal={openModal} />
      
      <Modal
        isOpen={activeModal !== null}
        onClose={closeModal}
        title={modalContent.title}
      >
        {modalContent.content}
      </Modal>

      <QuizModal isOpen={isQuizOpen} onClose={closeQuiz} />

      <BlogPostModal isOpen={selectedPost !== null} onClose={closePost} post={selectedPost} />

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