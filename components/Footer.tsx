import React from 'react';
// FIX: Framer Motion's `Variants` type is imported and applied to the `linkVariants` object. This ensures the `ease` property is correctly typed as a specific easing string literal ('easeOut') rather than the generic `string`, resolving the TypeScript error.
import { motion, Variants } from 'framer-motion';
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

const linkVariants: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const FooterLink: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.li variants={linkVariants}>
    <a href="#" className="text-secondary-dark hover:text-primary transition-colors text-sm font-medium flex items-center gap-2 group">
      <span className="w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-4"></span>
      {children}
    </a>
  </motion.li>
);

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
    <div className="flex items-center gap-8 mx-4">
        <Sparkles size={24} className="text-primary-dark" />
        <span className="font-extrabold tracking-tighter text-5xl md:text-7xl">
            POROBANGLA AI
        </span>
    </div>
);

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative w-full bg-[#0A0A0A] pt-24 overflow-hidden border-t border-secondary/10 mt-32">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 mb-20">
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
                    An advanced AI research companion for students, professionals, and lifelong learners.
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
      
      {/* INFINITE SCROLLING MARQUEE */}
      <div className="relative w-full py-10 border-y border-secondary/10 overflow-hidden group cursor-default">
          <motion.div 
            className="flex whitespace-nowrap"
            animate={{ x: '-100%' }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
              <div className="flex">
                  <MarqueeItem />
                  <MarqueeItem />
                  <MarqueeItem />
                  <MarqueeItem />
              </div>
              <div className="flex">
                  <MarqueeItem />
                  <MarqueeItem />
                  <MarqueeItem />
                  <MarqueeItem />
              </div>
          </motion.div>
          <style>{`
              .marquee-text {
                  -webkit-text-stroke: 1px #D8A441;
                  color: transparent;
                  transition: color 0.5s ease;
              }
              .group:hover .marquee-text {
                  color: #F3C567;
              }
          `}</style>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A]"></div>
      </div>

      {/* Bottom Bar with Myndra AI Branding */}
      <div className="w-full bg-black/30 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-secondary-dark">
            <p>© 2024 PoroBangla AI. All rights reserved.</p>
            <a href="#" className="flex items-center gap-2 font-medium text-secondary-dark hover:text-primary transition-colors cursor-pointer">
              <span>Powered by</span>
              <svg width="20" height="20" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0z m288 608l-128-128-160 160-160-160-128 128V320h608v288z"/>
              </svg>
              <span className="font-bold">Myndra AI</span>
            </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;