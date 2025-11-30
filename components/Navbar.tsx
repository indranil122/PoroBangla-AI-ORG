import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight, Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isGenerator = location.pathname === '/generate';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants for the "squeeze" effect
  // Explicitly defining all properties in both states ensures smooth bidirectional animation
  const navVariants = {
    top: { 
      width: "100%", 
      maxWidth: "100vw", // FIX: Use 100vw to ensure it always interpolates correctly from 800px
      y: 0, 
      borderRadius: "0px",
      backgroundColor: "rgba(5, 5, 7, 0)",
      borderColor: "rgba(255, 255, 255, 0)",
      paddingTop: "1.5rem",
      paddingBottom: "1.5rem",
      backdropFilter: "blur(0px)",
      boxShadow: "0 0 0 0 rgba(0,0,0,0)",
      transform: "translateZ(0)" // Force hardware acceleration
    },
    scrolled: { 
      width: "90%", 
      maxWidth: "800px", 
      y: 20, 
      borderRadius: "9999px",
      backgroundColor: "rgba(15, 17, 21, 0.8)",
      borderColor: "rgba(255, 255, 255, 0.08)",
      paddingTop: "0.75rem",
      paddingBottom: "0.75rem",
      backdropFilter: "blur(16px)",
      boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
      transform: "translateZ(0)" // Force hardware acceleration
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
        <motion.nav
          initial="top"
          animate={isScrolled ? "scrolled" : "top"}
          variants={navVariants}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex items-center justify-between px-6 md:px-8 border"
        >
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className={`
              relative flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden transition-all duration-500
              ${isScrolled ? 'bg-violet-600' : 'bg-white/10 group-hover:bg-white/20'}
            `}>
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-fuchsia-600 opacity-80"></div>
              <Sparkles size={14} className="relative z-10 text-white" />
            </div>
            <span className={`
              font-bold tracking-tight transition-all duration-300
              ${isScrolled ? 'text-sm text-white' : 'text-lg text-white'}
            `}>
              PoroBangla<span className="text-violet-400">AI</span>
            </span>
          </div>

          {/* Desktop Links (Center) */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
             {!isGenerator && (
               <>
                 {['Features', 'Pricing', 'Resources'].map((item) => (
                    <button 
                      key={item}
                      className={`
                        px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-full
                        ${isScrolled 
                          ? 'text-slate-400 hover:text-white hover:bg-white/10' 
                          : 'text-slate-300 hover:text-white'
                        }
                      `}
                    >
                      {item}
                    </button>
                 ))}
               </>
             )}
          </div>

          {/* Actions (Right) */}
          <div className="flex items-center gap-3">
             {/* Mobile Menu Toggle */}
             <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
             >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
             </button>

             {/* Dynamic CTA */}
             <AnimatePresence mode="wait">
               {!isGenerator ? (
                 <motion.button
                   key="launch"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => navigate('/generate')}
                   className={`
                      hidden md:flex items-center gap-2 font-semibold transition-all duration-500
                      ${isScrolled 
                         ? 'px-5 py-2 text-xs bg-white text-black rounded-full'
                         : 'px-6 py-2.5 text-sm bg-white/10 text-white border border-white/10 rounded-full hover:bg-white/20'
                      }
                   `}
                 >
                   <span>Launch App</span>
                   <ArrowRight size={isScrolled ? 12 : 14} />
                 </motion.button>
               ) : (
                 <motion.button 
                    key="exit"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onClick={() => navigate('/')}
                    className={`
                      hidden md:flex items-center gap-2 font-medium transition-colors
                      ${isScrolled ? 'text-xs text-slate-400 hover:text-white' : 'text-sm text-slate-400 hover:text-white'}
                    `}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Exit Workspace
                </motion.button>
               )}
             </AnimatePresence>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
             initial={{ opacity: 0, y: -20, height: 0 }}
             animate={{ opacity: 1, y: 0, height: 'auto' }}
             exit={{ opacity: 0, y: -20, height: 0 }}
             className="fixed top-24 left-4 right-4 z-40 bg-[#0f1115]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl md:hidden"
          >
             <div className="p-6 flex flex-col gap-4">
               {['Features', 'Pricing', 'Resources', 'Community'].map((item) => (
                 <button key={item} className="text-left text-slate-300 py-3 border-b border-white/5 last:border-0 hover:text-white flex items-center justify-between group">
                   {item}
                   <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-violet-400" />
                 </button>
               ))}
               <button 
                 onClick={() => {
                    navigate('/generate');
                    setIsMobileMenuOpen(false);
                 }}
                 className="mt-2 w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
               >
                 <Zap size={16} fill="currentColor" /> Launch App
               </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;