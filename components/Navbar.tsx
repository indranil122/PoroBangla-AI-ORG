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

  const navVariants = {
    top: { 
      width: "100%", 
      maxWidth: "100vw",
      y: 0, 
      borderRadius: "0px",
      backgroundColor: "rgba(5, 5, 5, 0)",
      borderColor: "rgba(255, 255, 255, 0)",
      paddingTop: "2.5rem",
      paddingBottom: "1.5rem",
      backdropFilter: "blur(0px)",
      boxShadow: "0 0 0 0 rgba(0,0,0,0)",
      transform: "translateZ(0)"
    },
    scrolled: { 
      width: "90%", 
      maxWidth: "800px", 
      y: 20, 
      borderRadius: "9999px",
      backgroundColor: "rgba(15, 15, 15, 0.9)", // Dark Card
      borderColor: "rgba(200, 204, 209, 0.2)", // Silver border
      paddingTop: "0.75rem",
      paddingBottom: "0.75rem",
      backdropFilter: "blur(16px)",
      boxShadow: "0 10px 40px -10px rgba(0,0,0,0.8)",
      transform: "translateZ(0)"
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
            <img 
              src="https://github.com/indranil122/image/blob/main/Gemini_Generated_Image_hc3ecmhc3ecmhc3e-Photoroom.png?raw=true" 
              alt="PoroBangla AI Logo"
              className="w-8 h-8 object-contain drop-shadow-lg"
            />
            <span className={`
              font-bold tracking-tight transition-all duration-300
              ${isScrolled ? 'text-sm text-secondary' : 'text-lg text-secondary'}
            `}>
              PoroBangla<span className="text-primary">AI</span>
            </span>
          </div>

          {/* Desktop Links (Center) */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
             {!isGenerator && (
               <>
                 <button 
                   onClick={() => navigate('/flashcards')}
                   className={`
                     px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-full
                     ${isScrolled 
                       ? 'text-secondary-dark hover:text-white hover:bg-white/5' 
                       : 'text-secondary hover:text-white'
                     }
                   `}
                 >
                   Flashcards
                 </button>
                 {['Features', 'Pricing'].map((item) => (
                    <button 
                      key={item}
                      className={`
                        px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-full
                        ${isScrolled 
                          ? 'text-secondary-dark hover:text-white hover:bg-white/5' 
                          : 'text-secondary hover:text-white'
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
                className="md:hidden p-2 text-secondary hover:text-primary transition-colors"
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
                         ? 'px-5 py-2 text-xs bg-gradient-to-r from-[#D8A441] to-[#F3C567] text-black rounded-full'
                         : 'px-6 py-2.5 text-sm bg-white/5 text-secondary border border-secondary/20 rounded-full hover:bg-white/10 hover:border-primary/50 hover:text-primary'
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
                      ${isScrolled ? 'text-xs text-secondary-dark hover:text-white' : 'text-sm text-secondary hover:text-white'}
                    `}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
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
             className="fixed top-24 left-4 right-4 z-40 bg-[#0F0F0F]/95 backdrop-blur-xl border border-secondary/20 rounded-2xl overflow-hidden shadow-2xl md:hidden"
          >
             <div className="p-6 flex flex-col gap-4">
               <button onClick={() => { navigate('/flashcards'); setIsMobileMenuOpen(false); }} className="text-left text-secondary py-3 border-b border-white/5 flex items-center justify-between group">
                  Flashcards
                  <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
               </button>
               {['Features', 'Pricing', 'Resources'].map((item) => (
                 <button key={item} className="text-left text-secondary py-3 border-b border-white/5 last:border-0 hover:text-white flex items-center justify-between group">
                   {item}
                   <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                 </button>
               ))}
               <button 
                 onClick={() => {
                    navigate('/generate');
                    setIsMobileMenuOpen(false);
                 }}
                 className="mt-2 w-full py-4 bg-gradient-to-r from-[#D8A441] to-[#F3C567] text-black font-bold rounded-xl flex items-center justify-center gap-2"
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