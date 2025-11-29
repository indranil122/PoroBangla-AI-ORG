import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Generator from './pages/Generator';

const App: React.FC = () => {
  return (
    <div className="antialiased text-slate-200 selection:bg-violet-500/30 font-sans min-h-screen">
      <AnimatedBackground />
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<Generator />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;