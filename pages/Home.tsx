
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, BookOpen, BrainCircuit, ArrowRight, Target, GraduationCap } from 'lucide-react';
// FIX: Using * as Router to handle potential export issues in some environments
import * as Router from 'react-router-dom';
import Footer from '../components/Footer';

// FIX: Casting motion components to any to resolve property missing errors
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

const Home: React.FC = () => {
  const navigate = Router.useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between overflow-x-hidden">
      
      <div className="flex-1 w-full flex flex-col items-center justify-center p-6 text-center mt-20 md:mt-32">
        
        <MotionDiv 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 max-w-5xl flex flex-col items-center"
        >
          <MotionDiv 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-8"
          >
            PoroBangla AI 3.0 • Premium
          </MotionDiv>

          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-white mb-6 leading-none">
            Intelligence <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">
              Redefined.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-secondary-dark mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Your personal AI academic architect. Generate notes, flashcards, and study guides with world-class precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <MotionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/workspace')}
              className="px-10 py-5 bg-primary text-black font-extrabold rounded-full text-lg shadow-[0_0_50px_-10px_rgba(243,197,103,0.4)] flex items-center gap-3 transition-all"
            >
              Start Generating <ArrowRight size={20} />
            </MotionButton>
            <MotionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/study-guide')}
              className="px-10 py-5 bg-white/5 border border-white/10 text-white font-extrabold rounded-full text-lg hover:bg-white/10 transition-all"
            >
              Study Guide <Target size={20} className="inline ml-1" />
            </MotionButton>
          </div>
        </MotionDiv>

        {/* Features Grid */}
        <div className="mt-40 w-full max-w-7xl z-10 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Target, 
                title: "Study Guide Architect", 
                desc: "Get a customized learning plan with day-by-day objectives and practice challenges.",
                color: "text-primary"
              },
              { 
                icon: BrainCircuit, 
                title: "Cognitive Flashcards", 
                desc: "Smart flashcards powered by spaced-repetition logic for permanent retention.",
                color: "text-white"
              },
              { 
                icon: GraduationCap, 
                title: "Expert Mock Tests", 
                desc: "Challenge yourself with AI-curated exams that adapt to your academic level.",
                color: "text-secondary"
              }
            ].map((feature, idx) => (
              <MotionDiv
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel p-10 rounded-[2.5rem] text-left border border-white/5 hover:border-primary/20 transition-all duration-500 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 ${feature.color} border border-white/5 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-secondary-dark leading-relaxed font-light">{feature.desc}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
