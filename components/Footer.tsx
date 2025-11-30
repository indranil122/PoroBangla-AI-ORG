import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Twitter, Linkedin, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SocialIcon = ({ icon: Icon, href }: { icon: any, href: string }) => (
  <a 
    href={href}
    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300 border border-white/5 hover:scale-110 hover:border-white/20"
  >
    <Icon size={18} />
  </a>
);

const FooterLink: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.li variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
    <a href="#" className="text-slate-500 hover:text-violet-400 transition-colors text-sm font-medium flex items-center gap-2 group">
      <span className="w-0 h-[1px] bg-violet-400 transition-all duration-300 group-hover:w-3"></span>
      {children}
    </a>
  </motion.li>
);

const FooterColumn = ({ title, links }: { title: string, links: string[] }) => (
  <div className="space-y-6">
    <h3 className="text-sm font-bold text-white uppercase tracking-widest opacity-80">{title}</h3>
    <motion.ul 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.1 }}
      className="space-y-4"
    >
      {links.map(link => <FooterLink key={link}>{link}</FooterLink>)}
    </motion.ul>
  </div>
);

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative w-full bg-black pt-32 overflow-hidden border-t border-white/5">
      
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-violet-900/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Massive CTA Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 pb-24 border-b border-white/10">
            <div className="max-w-3xl">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-8 leading-[0.95]"
                >
                    Ready to learn <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white animate-pulse-slow">
                        superhumanly?
                    </span>
                </motion.h2>
                <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
                    Join the academic revolution. Turn complex chaos into structured clarity with PoroBangla AI.
                </p>
            </div>
            
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/generate')}
                className="mt-10 md:mt-0 group flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] transition-all duration-300"
            >
                Launch Generator <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={2.5} />
            </motion.button>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 mb-32">
            
            {/* Brand Info */}
            <div className="col-span-2 md:col-span-4 pr-0 md:pr-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-900/20">
                        <Zap size={20} fill="currentColor" />
                    </div>
                    <span className="font-bold text-2xl text-white tracking-tight">PoroBangla</span>
                </div>
                <p className="text-slate-500 text-sm leading-7 mb-8">
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
                <FooterColumn title="Product" links={['Generator', 'Templates', 'Showcase', 'Pricing']} />
            </div>
            <div className="col-span-1 md:col-span-2">
                <FooterColumn title="Resources" links={['Documentation', 'API Reference', 'Community', 'Help']} />
            </div>
            <div className="col-span-1 md:col-span-2">
                 <FooterColumn title="Company" links={['About', 'Careers', 'Legal', 'Contact']} />
            </div>
        </div>

      </div>

      {/* GIANT BRAND WATERMARK */}
      <div className="w-full border-t border-white/5 bg-white/[0.02] overflow-hidden group cursor-default">
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[1920px] mx-auto relative"
        >
            <h1 className="text-[15vw] md:text-[13vw] font-black text-center text-white/[0.03] tracking-tighter leading-[0.8] py-4 select-none transition-all duration-700 group-hover:text-white/[0.08] group-hover:scale-105">
                POROBANGLA
            </h1>
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay"></div>
        </motion.div>
      </div>
      
      {/* Bottom Bar */}
      <div className="w-full bg-black py-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
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