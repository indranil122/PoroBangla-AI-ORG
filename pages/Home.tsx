import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, BookOpen, BrainCircuit, ArrowRight, FileQuestion } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between overflow-x-hidden">
      
      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col items-center justify-center p-6 text-center mt-20 md:mt-32">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 max-w-5xl flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="px-4 py-1.5 rounded-full bg-white/5 border border-secondary/20 backdrop-blur-md text-xs font-medium tracking-widest text-primary uppercase mb-8"
          >
            PoroBangla AI 2.0
          </motion.div>

          {/* Heading */}
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6 drop-shadow-2xl">
            Learn Faster. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D8A441] via-[#F3C567] to-[#C8CCD1]">
              Study Smarter.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-secondary-dark mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Transform complex topics into elegant, structured study materials instantly. 
            The future of learning is here.
          </p>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/generate')}
            className="group relative px-10 py-4 bg-gradient-to-r from-[#D8A441] to-[#F3C567] text-black font-bold rounded-full text-lg shadow-[0_0_40px_-10px_rgba(243,197,103,0.3)] hover:shadow-[0_0_60px_-15px_rgba(243,197,103,0.5)] transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              Create Notes <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-32 w-full max-w-6xl z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                icon: Zap, 
                title: "Instant Synthesis", 
                desc: "Generate comprehensive academic notes in seconds with our advanced AI engine." 
              },
              { 
                icon: FileQuestion, 
                title: "AI Mock Tests", 
                desc: "Test your knowledge with dynamic, AI-generated quizzes on any topic you've studied."
              },
              { 
                icon: BookOpen, 
                title: "Academic Structure", 
                desc: "Perfectly formatted with LaTeX math, clean tables, and hierarchical organization." 
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1, duration: 0.8 }}
                whileHover={{ y: -5 }}
                className="glass-card bg-[#0F0F0F] p-8 rounded-3xl text-left border border-secondary/10 hover:border-primary/30 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-secondary/20 flex items-center justify-center mb-6 text-primary">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-secondary-dark leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* New Footer */}
      <Footer />
    </div>
  );
};

export default Home;