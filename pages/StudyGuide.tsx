
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, BookOpen, Sparkles, Loader2, ArrowRight, 
  Target, Brain, Zap, Clock, ChevronRight, FileText, Download 
} from 'lucide-react';
import { generateStudyGuide } from '../services/geminiService';
import { StudyGuideRequest } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const StudyGuide: React.FC = () => {
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [guide, setGuide] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<StudyGuideRequest>({
    topic: '',
    days: 7,
    details: '',
    level: 'Intermediate'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await generateStudyGuide(formData);
      setGuide(res.content);
      setStep('result');
    } catch (err: any) {
      setError("Our tutor is busy right now. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCalendar = () => {
    if (!guide) return;

    // Helper to format date for ICS (YYYYMMDD)
    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}${m}${d}`;
    };

    // Regex to find "## Day X: Title" and extract content until next "Day X"
    const dayRegex = /## Day (\d+): (.*?)(?=## Day|$)/gs;
    const matches = [...guide.matchAll(dayRegex)];

    if (matches.length === 0) {
      alert("Could not extract daily tasks from the guide for the calendar. Please use the Print option.");
      return;
    }

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PoroBangla AI//Study Guide//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ].join('\r\n') + '\r\n';

    const startDate = new Date();

    matches.forEach((match) => {
      const dayNum = parseInt(match[1]);
      const title = match[2].trim();
      const description = match[0].replace(/#/g, '').trim(); // Basic cleanup of markdown for desc

      const eventDate = new Date(startDate);
      eventDate.setDate(startDate.getDate() + (dayNum - 1));
      const dateStr = formatDate(eventDate);

      icsContent += [
        'BEGIN:VEVENT',
        `SUMMARY:Study: ${title}`,
        `DTSTART;VALUE=DATE:${dateStr}`,
        `DTEND;VALUE=DATE:${dateStr}`,
        `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
        'STATUS:CONFIRMED',
        'TRANSP:TRANSPARENT',
        'END:VEVENT'
      ].join('\r\n') + '\r\n';
    });

    icsContent += 'END:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${formData.topic.replace(/\s+/g, '_')}_StudyPlan.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen w-full pt-28 pb-20 px-4 md:px-8 flex flex-col items-center">
      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div 
            key="input"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-3xl"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                 <Target size={14} /> AI Study Architect
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif">Master Any Topic.</h1>
              <p className="text-secondary-dark text-xl max-w-2xl mx-auto leading-relaxed">
                Receive a bespoke, day-by-day learning schedule tailored to your pace and goals.
              </p>
            </div>

            <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               
               <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-secondary-dark uppercase tracking-widest ml-1 flex items-center gap-2">
                        <BookOpen size={14} className="text-primary" /> Subject Topic
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.topic}
                        onChange={(e) => setFormData({...formData, topic: e.target.value})}
                        placeholder="e.g. Quantum Chemistry"
                        className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl focus:border-primary/50 outline-none text-white transition-all shadow-inner"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-secondary-dark uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Clock size={14} className="text-primary" /> Duration (Days)
                      </label>
                      <input 
                        type="number" 
                        min="1" 
                        max="30"
                        required
                        value={formData.days}
                        onChange={(e) => setFormData({...formData, days: parseInt(e.target.value)})}
                        className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl focus:border-primary/50 outline-none text-white transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-secondary-dark uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Brain size={14} className="text-primary" /> Specific Goals or Context
                    </label>
                    <textarea 
                      placeholder="e.g. Preparing for finals, focus on thermodynamics, I'm a visual learner..."
                      value={formData.details}
                      onChange={(e) => setFormData({...formData, details: e.target.value})}
                      className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl focus:border-primary/50 outline-none text-white transition-all min-h-[120px] shadow-inner"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-secondary-dark uppercase tracking-widest ml-1">Learning Level</label>
                    <div className="flex gap-2 p-1 bg-black/40 rounded-2xl border border-white/10">
                      {['Beginner', 'Intermediate', 'Expert'].map(l => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setFormData({...formData, level: l})}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                            formData.level === l ? 'bg-primary text-black shadow-lg' : 'text-secondary-dark hover:text-white'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    disabled={isLoading}
                    className="w-full py-5 bg-gradient-to-r from-primary-dark to-primary text-black font-extrabold text-lg rounded-2xl shadow-[0_0_40px_-5px_rgba(243,197,103,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={24} className="animate-spin" />
                        Architecting your plan...
                      </>
                    ) : (
                      <>
                        Generate Study Plan <Sparkles size={20} />
                      </>
                    )}
                  </button>
               </form>
            </div>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-5xl"
          >
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8">
              <div>
                <button 
                  onClick={() => setStep('input')}
                  className="mb-4 flex items-center gap-2 text-secondary-dark hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest"
                >
                  <ArrowRight size={16} className="rotate-180" /> Start Over
                </button>
                <h1 className="text-4xl md:text-5xl font-bold text-white font-serif">{formData.topic} Plan</h1>
                <p className="text-primary mt-2 flex items-center gap-2 font-mono text-sm">
                  <Calendar size={14} /> {formData.days} Day Strategic Schedule
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-6 md:mt-0">
                <button 
                  onClick={handleDownloadCalendar}
                  className="px-6 py-3 bg-primary/10 border border-primary/30 rounded-xl text-primary hover:bg-primary/20 transition-all flex items-center gap-2 font-bold"
                >
                  <Calendar size={18} /> Download Calendar
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all flex items-center gap-2 font-bold"
                >
                  <Download size={18} /> Print Plan
                </button>
              </div>
            </div>

            <div className="glass-panel p-8 md:p-16 rounded-[3rem] border border-primary/10 shadow-2xl relative overflow-hidden bg-[#0A0A0A]/80">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-dark via-primary to-primary-dark"></div>
                
                <div className="prose prose-invert prose-gold max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h2: ({node, ...props}) => (
                        <h2 className="text-3xl font-bold text-primary mt-12 mb-6 border-b border-primary/20 pb-4 flex items-center gap-3" {...props}>
                           <div className="w-2 h-8 bg-primary rounded-full"></div> {props.children}
                        </h2>
                      ),
                      h3: ({node, ...props}) => <h3 className="text-xl font-bold text-white mt-8 mb-3" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-none space-y-3 mb-8" {...props} />,
                      li: ({node, ...props}) => (
                        <li className="flex items-start gap-3 group" {...props}>
                          <ChevronRight size={18} className="text-primary mt-1 group-hover:translate-x-1 transition-transform" />
                          <span className="text-secondary leading-relaxed">{props.children}</span>
                        </li>
                      ),
                      p: ({node, ...props}) => <p className="text-secondary-dark text-lg leading-loose mb-6 font-light" {...props} />,
                      blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-primary bg-primary/5 p-6 rounded-r-2xl italic text-primary-dark font-medium my-8" {...props} />
                      )
                    }}
                  >
                    {guide}
                  </ReactMarkdown>
                </div>
            </div>
            
            <div className="mt-12 text-center">
               <p className="text-secondary-dark text-xs uppercase tracking-[0.3em] opacity-40">Architected by Myndra AI Core</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudyGuide;
