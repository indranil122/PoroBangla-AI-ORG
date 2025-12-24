
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Layout, Brain, Target, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navVariants = {
    top: { 
      width: "100%", 
      y: 0, 
      borderRadius: "0px",
      backgroundColor: "rgba(5, 5, 5, 0)",
      paddingTop: "2rem",
      paddingBottom: "1.5rem",
      backdropFilter: "blur(0px)",
      borderColor: "transparent",
    },
    scrolled: { 
      width: "95%", 
      maxWidth: "1100px", 
      y: 15, 
      borderRadius: "100px",
      backgroundColor: "rgba(10, 10, 10, 0.85)", 
      paddingTop: "0.6rem",
      paddingBottom: "0.6rem",
      backdropFilter: "blur(24px)",
      borderColor: "rgba(255, 255, 255, 0.08)",
      boxShadow: "0 20px 40px -15px rgba(0,0,0,0.7)"
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
        <motion.nav
          initial="top"
          animate={isScrolled ? "scrolled" : "top"}
          variants={navVariants}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto flex items-center justify-between px-6 md:px-12 border transition-all duration-300"
        >
          {/* Brand Logo Section */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative">
              <img 
                src="https://github.com/indranil122/image/blob/main/Gemini_Generated_Image_hc3ecmhc3ecmhc3e-Photoroom.png?raw=true" 
                alt="Logo"
                className={`transition-all duration-500 ${isScrolled ? 'w-7 h-7' : 'w-9 h-9'}`}
              />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            
            <div className="flex items-center">
              <span className={`font-extrabold tracking-tighter text-white transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-2xl'}`}>
                PoroBangla
              </span>
              <div className="ml-1 px-1.5 py-0.5 bg-primary rounded-[4px] flex items-center justify-center">
                <span className="text-[10px] font-black text-black">AI</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <button 
              onClick={() => navigate('/workspace')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] transition-all group ${
                location.pathname === '/workspace' ? 'text-white' : 'text-secondary-dark hover:text-white'
              }`}
            >
              <Layout size={15} className={`transition-colors ${location.pathname === '/workspace' ? 'text-primary' : 'group-hover:text-primary'}`} />
              Workspace
            </button>

            <button 
              onClick={() => navigate('/study-guide')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] transition-all group ${
                location.pathname === '/study-guide' ? 'text-white' : 'text-secondary-dark hover:text-white'
              }`}
            >
              <Target size={15} className={`transition-colors ${location.pathname === '/study-guide' ? 'text-primary' : 'group-hover:text-primary'}`} />
              <div className="flex flex-col items-start leading-[1.1]">
                <span>Study</span>
                <span className="opacity-50 text-[8px]">Guide</span>
              </div>
            </button>

            <button 
              onClick={() => navigate('/flashcards')}
              className={`ml-2 flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] transition-all border ${
                location.pathname.includes('/flashcards') || location.pathname.includes('/study/')
                ? 'bg-primary border-primary text-black' 
                : 'bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_20px_-5px_rgba(243,197,103,0.5)]'
              }`}
            >
              <Brain size={15} />
              Flashcards
            </button>
          </div>

          {/* Launch / Action Area */}
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition-all"
             >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
             </button>

             <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/workspace')}
                className={`
                   hidden md:flex items-center gap-2 font-black rounded-full transition-all uppercase tracking-[0.2em] text-[10px]
                   ${isScrolled 
                      ? 'px-6 py-2.5 bg-white text-black hover:bg-primary transition-colors' 
                      : 'px-7 py-3 bg-white/5 border border-white/10 text-white hover:border-primary hover:text-primary backdrop-blur-md'
                   }
                `}
             >
               Launch <ArrowRight size={14} />
             </motion.button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
             initial={{ opacity: 0, y: -20, scale: 0.95 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: -20, scale: 0.95 }}
             className="fixed top-24 left-4 right-4 z-[99] bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl md:hidden overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
             
             <div className="flex flex-col gap-3 relative z-10">
               {[
                 { name: 'Workspace', path: '/workspace', icon: Layout },
                 { name: 'Study Guide', path: '/study-guide', icon: Target },
                 { name: 'Flashcards', path: '/flashcards', icon: Brain },
                 { name: 'Mock Tests', path: '/mock-test', icon: Sparkles },
               ].map(link => (
                 <button 
                    key={link.path}
                    onClick={() => { navigate(link.path); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-between p-5 rounded-2xl transition-all border ${
                      location.pathname === link.path 
                      ? 'bg-primary/10 border-primary/30 text-white' 
                      : 'bg-white/5 border-transparent text-secondary hover:text-white'
                    }`}
                 >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${location.pathname === link.path ? 'bg-primary text-black' : 'bg-white/5 text-primary'}`}>
                        <link.icon size={20} />
                      </div>
                      <span className="font-bold text-base tracking-tight">{link.name}</span>
                    </div>
                    <ArrowRight size={18} className="opacity-40" />
                 </button>
               ))}
               
               <button 
                  onClick={() => { navigate('/workspace'); setIsMobileMenuOpen(false); }}
                  className="mt-6 w-full py-5 bg-primary text-black font-black text-sm uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 shadow-[0_15px_30px_-10px_rgba(243,197,103,0.3)] active:scale-95 transition-all"
               >
                  Launch App <ArrowRight size={18} />
               </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
