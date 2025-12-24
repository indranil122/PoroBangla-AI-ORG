import React, { ReactNode } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Generator from './pages/Generator';
import Workspace from './pages/Workspace';
import TestSession from './pages/TestSession';
import TestResult from './pages/TestResult';
import FlashcardGenerator from './pages/FlashcardGenerator';
import StudySession from './pages/StudySession';
import ScrollEffectWrapper from './components/ScrollEffectWrapper';

const pageVariants = {
  initial: {
    opacity: 0,
    x: -50,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 50,
  },
};

const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const PageWrapper = ({ page }: { page: ReactNode }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {page}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper page={<Home />} />} />
        <Route path="/generate" element={<PageWrapper page={<Generator />} />} />
        <Route path="/workspace" element={<PageWrapper page={<Workspace />} />} />
        {/* Standalone sessions launched from workspace */}
        <Route path="/test-session" element={<TestSession />} />
        <Route path="/test-result" element={<TestResult />} />
        <Route path="/generate-flashcards" element={<PageWrapper page={<FlashcardGenerator />} />} />
        <Route path="/study/:id" element={<StudySession />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <div className="antialiased text-secondary selection:bg-primary/30 font-sans min-h-screen">
      <AnimatedBackground />
      <HashRouter>
        <Navbar />
        <ScrollEffectWrapper>
          <AnimatedRoutes />
        </ScrollEffectWrapper>
      </HashRouter>
    </div>
  );
};

export default App;