import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Generator from './pages/Generator';
import FlashcardDashboard from './pages/FlashcardDashboard';
import StudySession from './pages/StudySession';
import ScrollEffectWrapper from './components/ScrollEffectWrapper';

const App: React.FC = () => {
  return (
    <div className="antialiased text-secondary selection:bg-primary/30 font-sans min-h-screen">
      <AnimatedBackground />
      <HashRouter>
        <Navbar />
        {/* We wrap the routes in the ScrollEffectWrapper to apply physics-based motion blur during scroll.
            Navbar and Background remain outside to stay fixed and sharp. */}
        <ScrollEffectWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generate" element={<Generator />} />
            <Route path="/flashcards" element={<FlashcardDashboard />} />
            <Route path="/study/:id" element={<StudySession />} />
          </Routes>
        </ScrollEffectWrapper>
      </HashRouter>
    </div>
  );
};

export default App;