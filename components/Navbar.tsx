
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Using * as Router to handle potential export issues in some environments
import * as Router from 'react-router-dom';
import { Menu, X, ArrowRight, Layout, Brain, Target, Sparkles, Home } from 'lucide-react';

// FIX: Casting motion components to any
const MotionNav = motion.nav as any;
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = Router.useLocation();
  const navigate = Router.useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Workspace', path: '/workspace', icon: Layout },
    { name: 'Study Guide', path: '/study-guide', icon: Target },
    { name: 'Flashcards', path: '/flashcards', icon: Brain },
  ];

  const navVariants: any = {
    top: { 
      width: "100%", 
      y: 0, 
      borderRadius: "0px",
      backgroundColor: "rgba(5, 5, 5, 0)",
      paddingTop: "2.5rem",
      paddingBottom: "1.5rem",
      backdropFilter: "blur(0px)",
      borderColor: "transparent",
    },
    scrolled: { 
      width: "auto", 
      minWidth: "600px",
      y: 20, 
      borderRadius: "100px",
      backgroundColor: "rgba(10, 10, 10, 0.75)", 
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem",
      paddingLeft: "0.75rem",
      paddingRight: "0.75rem",
      backdropFilter: "blur(24px)",
      borderColor: "rgba(255, 255, 255, 0.08)",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 20px 0 rgba(243, 197, 103, 0.05)"
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4">
        <MotionNav
          initial="top"
          animate={isScrolled ? "scrolled" : "top"}
          variants={navVariants}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto flex items-center justify-between border transition-all duration-500"
        >
          {/* Brand - Condensed on scroll */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer group shrink-0 pl-4 pr-6"
          >
            <div className="relative">
              <img 
                src="https://github.com/indranil122/image/blob/main/Gemini_Generated_Image_hc3ecmhc3ecmhc3e-Photoroom.png?raw=true" 
                alt="Logo"
                className={`transition-all duration-500 ${isScrolled ? 'w-6 h-6' : 'w-9 h-9'}`}
              />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            
            <AnimatePresence mode="wait">
              {!isScrolled && (
                <MotionDiv
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center"
                >
                  <span className="font-extrabold tracking-tighter text-white text-xl">
                    PoroBangla
                  </span>
                  <div className="ml-1 px-1.5 py-0.5 bg-primary rounded-[4px] flex items-center justify-center">
                    <span className="text-[9px] font-black text-black">AI</span>
                  </div>
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Navigation - Elegant & Minimal */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
             {navLinks.map((link) => {
               const isActive = location.pathname === link.path;
               return (
                 <button 
                   key={link.path}
                   onClick={() => navigate(link.path)}
                   className={`
                     relative px-5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full transition-all flex items-center gap-2 overflow-hidden
                     ${isActive ? 'text-black' : 'text-secondary-dark hover:text-white hover:bg-white/5'}
                   `}
                 >
                   {isActive && (
                     <MotionDiv 
                        layoutId="nav-active-bg"
                        className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark z-0"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                     />
                   )}
                   <span className="relative z-10 flex items-center gap-2">
                    <link.icon size={14} className={isActive ? 'text-black' : 'text-primary/70 group-hover:text-primary'} /> 
                    {link.name}
                   </span>
                 </button>
               );
             })}
          </div>

          {/* Actions Area */}
          <div className="flex items-center gap-2 pl-4">
             <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 text-secondary hover:text-white transition-colors"
             >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
             </button>

             <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/workspace')}
                className={`
                   hidden md:flex items-center gap-2 font-black rounded-full transition-all uppercase tracking-[0.15em] text-[10px]
                   ${isScrolled 
                      ? 'px-6 py-2 bg-white text-black hover:bg-primary transition-colors' 
                      : 'px-8 py-3 bg-white/5 border border-white/10 text-white hover:border-primary hover:text-primary backdrop-blur-md'
                   }
                `}
             >
               Launch App <ArrowRight size={14} />
             </MotionButton>
          </div>
        </MotionNav>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MotionDiv
             initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
             animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
             exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
             className="fixed inset-0 z-[90] bg-black/60 md:hidden flex items-center justify-center p-6"
             onClick={() => setIsMobileMenuOpen(false)}
          >
             <MotionDiv
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-sm bg-[#0F0F0F] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                
                <div className="flex flex-col gap-3 relative z-10">
                   <div className="flex items-center justify-center gap-3 mb-8">
                      <img 
                        src="https://github.com/indranil122/image/blob/main/Gemini_Generated_Image_hc3ecmhc3ecmhc3e-Photoroom.png?raw=true" 
                        alt="Logo"
                        className="w-8 h-8"
                      />
                      <span className="font-black text-xl tracking-tight text-white">PoroBangla <span className="text-primary">AI</span></span>
                   </div>

                   {navLinks.map(link => (
                     <button 
                        key={link.path}
                        onClick={() => { navigate(link.path); setIsMobileMenuOpen(false); }}
                        className={`flex items-center justify-between p-5 rounded-2xl transition-all ${
                          location.pathname === link.path ? 'bg-primary text-black' : 'bg-white/5 text-white hover:bg-white/10'
                        }`}
                     >
                        <div className="flex items-center gap-4">
                          <link.icon size={20} /> 
                          <span className="font-bold">{link.name}</span>
                        </div>
                        <ArrowRight size={18} />
                     </button>
                   ))}
                   
                   <button 
                      onClick={() => { navigate('/workspace'); setIsMobileMenuOpen(false); }}
                      className="mt-6 w-full py-5 bg-white text-black font-black text-sm uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                   >
                      Get Started <Sparkles size={18} />
                   </button>
                </div>
             </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
