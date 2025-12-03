import React, { ReactNode } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
// FIX: Framer Motion's `Transition` type is imported to correctly type the page transition configuration, resolving a TypeScript error where string literals were being inferred as the general `string` type.
import { motion, AnimatePresence, Transition } from 'framer-motion';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Generator from './pages/Generator';
import FlashcardDashboard from './pages/FlashcardDashboard';
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

// FIX: Refactored to use a 'page' prop instead of 'children' to avoid a TypeScript inference issue with React Router's 'element' prop.
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
        <Route path="/flashcards" element={<PageWrapper page={<FlashcardDashboard />} />} />
        <Route path="/study/:id" element={<PageWrapper page={<StudySession />} />} />
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