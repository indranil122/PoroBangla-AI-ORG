import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Twitter, Linkedin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SocialIcon = ({ icon: Icon, href }: { icon: any, href: string }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-secondary-dark hover:text-primary hover:bg-primary/10 transition-all duration-300 border border-white/5 hover:scale-110 hover:border-primary/50"
  >
    <Icon size={18} />
  </a>
);

// Stagger variant for individual links
const linkVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const FooterLink: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.li variants={linkVariants}>
    <a href="#" className="text-secondary-dark hover:text-primary transition-colors text-sm font-medium flex items-center gap-2 group">
      {/* Animated underline effect */}
      <span className="w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-4"></span>
      {children}
    </a>
  </motion.li>
);

// Stagger container for the list
const columnVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const FooterColumn = ({ title, links }: { title: string, links: string[] }) => (
  <div className="space-y-6">
    <h3 className="text-sm font-bold text-white uppercase tracking-widest opacity-80">{title}</h3>
    <motion.ul 
      variants={columnVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="space-y-4"
    >
      {links.map(link => <FooterLink key={link}>{link}</FooterLink>)}
    </motion.ul>
  </div>
);

const MarqueeItem = () => (
    <div className="flex items-center shrink-0 gap-8 mx-4">
        <h1 className="text-[10vw] md:text-[8vw] font-black tracking-tighter leading-[0.8] py-4 select-none whitespace-nowrap
                       text-transparent [-webkit-text-stroke:1px_theme(colors.primary/0.2)]
                       group-hover:[-webkit-text-stroke:1px_theme(colors.primary)] group-hover:text-primary/10 transition-all duration-700 ease-in-out">
            POROBANGLA AI
        </h1>
        <Sparkles className="w-[8vw] h-[8vw] md:w-[6vw] md:h-[6vw] text-primary/20 group-hover:text-primary transition-colors duration-700" strokeWidth={1} />
        <h1 className="text-[10vw] md:text-[8vw] font-black tracking-tighter leading-[0.8] py-4 select-none whitespace-nowrap
                       text-transparent [-webkit-text-stroke:1px_theme(colors.primary/0.2)]
                       group-hover:[-webkit-text-stroke:1px_theme(colors.primary)] group-hover:text-primary/10 transition-all duration-700 ease-in-out">
            LEARN FASTER
        </h1>
        <Sparkles className="w-[8vw] h-[8vw] md:w-[6vw] md:h-[6vw] text-primary/20 group-hover:text-primary transition-colors duration-700" strokeWidth={1} />
    </div>
);


const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative w-full bg-[#050505] pt-32 overflow-hidden border-t border-secondary/10">
      
      {/* Ambient Glow - Gold */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-[#F3C567]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Massive CTA Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 pb-24 border-b border-secondary/10">
            <div className="max-w-3xl">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-8 leading-[0.95]"
                >
                    Ready to learn <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D8A441] via-[#F3C567] to-white animate-pulse-slow">
                        superhumanly?
                    </span>
                </motion.h2>
                <p className="text-secondary-dark text-lg md:text-xl max-w-xl leading-relaxed">
                    Join the academic revolution. Turn complex chaos into structured clarity with PoroBangla AI.
                </p>
            </div>
            
            <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px -10px rgba(255, 255, 255, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/generate')}
                className="mt-10 md:mt-0 group flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold text-lg transition-all duration-300"
            >
                Launch Generator <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={2.5} />
            </motion.button>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 mb-32">
            
            {/* Brand Info */}
            <div className="col-span-2 md:col-span-4 pr-0 md:pr-12">
                <div className="flex items-center gap-3 mb-6">
                    <img 
                      src="https://github.com/indranil122/image/blob/main/Gemini_Generated_Image_hc3ecmhc3ecmhc3e-Photoroom.png?raw=true" 
                      alt="PoroBangla AI Logo"
                      className="w-10 h-10 object-contain drop-shadow-md"
                    />
                    <span className="font-bold text-2xl text-white tracking-tight">PoroBangla</span>
                </div>
                <p className="text-secondary-dark text-sm leading-7 mb-8">
                    An advanced AI research companion designed for students, professionals, and lifelong learners. We prioritize accuracy, structure, and aesthetic clarity.
                </p>
                <div className="flex gap-4">
                    <SocialIcon icon={Twitter} href="#" />
                    <SocialIcon icon={Github} href="#" />
                    <SocialIcon icon={Linkedin} href="#" />
                </div>
            </div>

            {/* Spacer */}
            <div className="hidden md:block md:col-span-2"></div>

            {/* Columns */}
            <div className="col-span-1 md:col-span-2">
                <FooterColumn title="Product" links={['Generator', 'Flashcards', 'Showcase', 'Pricing']} />
            </div>
            <div className="col-span-1 md:col-span-2">
                <FooterColumn title="Resources" links={['Documentation', 'API Reference', 'Community', 'Help']} />
            </div>
            <div className="col-span-1 md:col-span-2">
                 <FooterColumn title="Company" links={['About', 'Careers', 'Legal', 'Contact']} />
            </div>
        </div>

      </div>

      {/* DYNAMIC SCROLLING MARQUEE */}
      <div className="w-full border-t border-secondary/10 bg-black/50 overflow-hidden group cursor-default">
        <motion.div
            className="flex"
            initial={{ x: "0%" }}
            animate={{ x: "-100%" }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
            <MarqueeItem />
            <MarqueeItem />
            <MarqueeItem />
            <MarqueeItem />
        </motion.div>
      </div>
      
      {/* Bottom Bar */}
      <div className="w-full bg-black py-6 border-t border-secondary/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-secondary-dark">
            <p>© 2024 PoroBangla AI Inc. All rights reserved.</p>
            <div className="flex gap-8">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;