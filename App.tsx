
import React, { ReactNode } from 'react';
// FIX: Using * as Router to handle potential export issues in some environments
import * as Router from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Generator from './pages/Generator';
import Workspace from './pages/Workspace';
import TestSession from './pages/TestSession';
import TestResult from './pages/TestResult';
import FlashcardDashboard from './pages/FlashcardDashboard';
import FlashcardGenerator from './pages/FlashcardGenerator';
import StudySession from './pages/StudySession';
import StudyGuide from './pages/StudyGuide';
import MockTestGenerator from './pages/MockTestGenerator';

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 20,
  },
};

// FIX: Removing Transition type import to resolve name collision error and using any for transition objects
const pageTransition: any = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

const MotionDiv = motion.div as any;

const PageWrapper = ({ page }: { page: ReactNode }) => (
  <MotionDiv
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {page}
  </MotionDiv>
);

const AnimatedRoutes = () => {
  const location = Router.useLocation();
  return (
    <AnimatePresence mode="wait">
      <Router.Routes location={location} key={location.pathname}>
        <Router.Route path="/" element={<PageWrapper page={<Home />} />} />
        <Router.Route path="/generate" element={<PageWrapper page={<Generator />} />} />
        <Router.Route path="/workspace" element={<PageWrapper page={<Workspace />} />} />
        <Router.Route path="/study-guide" element={<PageWrapper page={<StudyGuide />} />} />
        <Router.Route path="/mock-test" element={<PageWrapper page={<MockTestGenerator />} />} />
        <Router.Route path="/test-session" element={<TestSession />} />
        <Router.Route path="/test-result" element={<TestResult />} />
        <Router.Route path="/flashcards" element={<PageWrapper page={<FlashcardDashboard />} />} />
        <Router.Route path="/generate-flashcards" element={<PageWrapper page={<FlashcardGenerator />} />} />
        <Router.Route path="/study/:id" element={<StudySession />} />
      </Router.Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <div className="antialiased text-secondary selection:bg-primary/30 font-sans min-h-screen">
      <AnimatedBackground />
      <Router.HashRouter>
        <Navbar />
        <AnimatedRoutes />
      </Router.HashRouter>
    </div>
  );
};

export default App;
