import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Github, Linkedin, Heart, Globe, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <footer className="relative w-full mt-32 border-t border-white/5 bg-[#050507]/80 backdrop-blur-xl">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-12"
        >
          {/* Brand Column */}
          <motion.div variants={item} className="space-y-6 col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              PoroBangla AI
            </h2>
            <p className="text-slate-500 leading-relaxed text-sm">
              Empowering students with next-generation AI tools. Turning complex topics into elegant, structured knowledge.
            </p>
            <div className="flex gap-4 pt-2">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, color: '#a78bfa' }}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 transition-colors border border-white/5 hover:bg-white/10"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Column 1 */}
          <motion.div variants={item} className="space-y-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Product</h3>
            <ul className="space-y-4">
              {['Features', 'Pricing', 'API Access', 'Showcase'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-500 hover:text-violet-400 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-violet-400 transition-colors"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Links Column 2 */}
          <motion.div variants={item} className="space-y-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Resources</h3>
            <ul className="space-y-4">
              {['Documentation', 'Community', 'Blog', 'Help Center'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-500 hover:text-violet-400 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-violet-400 transition-colors"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Column */}
          <motion.div variants={item} className="space-y-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Stay Updated</h3>
            <p className="text-slate-500 text-sm">Join our newsletter for the latest AI study tips.</p>
            <div className="relative group">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" size={16} />
               <input 
                 type="email" 
                 placeholder="Enter your email" 
                 className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
               />
               <button className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium rounded-md transition-colors">
                 Join
               </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="text-slate-600 text-xs flex items-center gap-1">
            © 2024 PoroBangla AI. All rights reserved.
          </div>
          <div className="flex gap-6 text-xs text-slate-600 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Systems Operational
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;