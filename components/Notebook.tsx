import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NoteLanguage } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Check, ZoomIn, BookOpen, Save } from 'lucide-react';

export interface NotebookSettings {
  fontSize: 'sm' | 'md' | 'lg';
  layout: 'standard' | 'wide';
}

interface NotebookProps {
  content: string;
  language: NoteLanguage;
  title: string;
  settings?: NotebookSettings;
}

const ListItem: React.FC<React.LiHTMLAttributes<HTMLLIElement> & { ordered?: boolean }> = ({ children, ordered, ...props }) => {
  const [checked, setChecked] = useState(false);

  return (
    <li 
      {...props} 
      className={`relative group flex items-start gap-3 mb-3 cursor-pointer select-none transition-all duration-200 break-inside-avoid ${props.className || ''}`}
      onClick={(e) => {
        e.stopPropagation();
        setChecked(!checked);
      }}
    >
      {/* Checkbox Container */}
      <div className={`
        mt-1.5 w-5 h-5 rounded-[6px] border flex items-center justify-center flex-shrink-0 transition-all duration-300 ease-out
        ${checked 
          ? 'bg-violet-500 border-violet-500 shadow-[0_2px_8px_rgba(139,92,246,0.3)]' 
          : 'bg-white border-slate-300 group-hover:border-violet-400 group-hover:shadow-sm'
        }
        print:border-black print:bg-white print:shadow-none print:w-4 print:h-4 print:mt-1
      `}>
        <Check 
          size={12} 
          className={`text-white transition-all duration-300 ${checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'} print:text-black`} 
          strokeWidth={3.5} 
        />
      </div>

      <div className={`flex-1 transition-all duration-300 ${checked ? 'opacity-50 line-through decoration-slate-400' : 'opacity-100'} print:opacity-100 print:no-underline`}>
        {children}
      </div>
    </li>
  );
};

const Notebook: React.FC<NotebookProps> = ({ content, language, title, settings = { fontSize: 'md', layout: 'standard' } }) => {
  const fontClass = language === NoteLanguage.Bengali ? 'font-bengali' : 'font-sans';
  const [isSaved, setIsSaved] = useState(false);
  
  // Dynamic Styles based on settings
  const containerWidth = settings.layout === 'wide' ? 'max-w-7xl' : 'max-w-5xl';
  
  const textSize = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl'
  }[settings.fontSize];

  const heading1Size = {
    sm: 'text-3xl',
    md: 'text-4xl',
    lg: 'text-5xl'
  }[settings.fontSize];

  const handleSave = () => {
    try {
      const noteData = {
        id: Date.now().toString(),
        title,
        content,
        language,
        date: new Date().toISOString(),
      };
      
      const existing = JSON.parse(localStorage.getItem('porobangla_saved_notes') || '[]');
      localStorage.setItem('porobangla_saved_notes', JSON.stringify([noteData, ...existing]));
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full ${containerWidth} mx-auto transition-all duration-500 ease-in-out print:w-full print:max-w-none print:mx-0`}
    >
      {/* The Paper Card */}
      <div id="printable-notebook" className="relative bg-zinc-50 rounded-lg shadow-2xl overflow-hidden min-h-[800px] print:shadow-none print:rounded-none print:bg-white print:overflow-visible group/notebook">
        
        {/* Top Accent Line - Hide in print */}
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 print:hidden"></div>

        {/* Save Button (Web Only) */}
        <button
          onClick={handleSave}
          disabled={isSaved}
          className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-400 hover:text-violet-600 hover:border-violet-200 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300 print:hidden opacity-0 group-hover/notebook:opacity-100 focus:opacity-100"
          title="Save to Browser Storage"
        >
          <AnimatePresence mode="wait">
            {isSaved ? (
              <motion.div
                key="saved"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <Check size={20} className="text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                key="save"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <Save size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* PRINT ONLY HEADER - Visible only on paper */}
        <div className="hidden print:block border-b-2 border-black mb-8 pb-4 pt-4 px-0">
            <div className="flex justify-between items-end mb-2">
                <h1 className="text-3xl font-bold text-black leading-tight uppercase tracking-tight">{title}</h1>
                <span className="text-sm font-mono text-gray-500">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-widest">
                <BookOpen size={12} /> Generated by PoroBangla AI
            </div>
        </div>

        {/* Content Area */}
        <div className={`p-8 md:p-16 text-slate-900 ${fontClass} ${textSize} leading-relaxed transition-all duration-300 print:p-0 print:text-black print:text-[11pt] print:leading-normal`}>
            
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    // Elegant Typography
                    h1: ({node, ...props}) => <h1 className={`${heading1Size} font-bold tracking-tight text-slate-900 mb-8 mt-4 pb-4 border-b border-slate-200 break-after-avoid print:text-2xl print:mb-4 print:mt-6 print:border-black`} {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-slate-800 mt-10 mb-4 flex items-center gap-2 break-after-avoid print:text-xl print:text-black print:mt-6 print:mb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-medium text-slate-700 mt-6 mb-3 break-after-avoid print:text-lg print:text-black print:font-bold" {...props} />,
                    
                    // Lists
                    ul: ({node, ...props}) => <ul className="list-none list-outside ml-2 space-y-2 mb-6 text-slate-700 print:mb-2 print:text-black" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 space-y-2 mb-6 text-slate-700 marker:text-slate-400 marker:font-medium pl-2 print:mb-2 print:marker:text-black print:text-black" {...props} />,
                    
                    // List Item with Checkbox
                    li: ListItem,
                    
                    // Emphasis
                    strong: ({node, ...props}) => <strong className="font-semibold text-slate-900 print:text-black print:font-bold" {...props} />,
                    blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-violet-500 pl-6 italic text-slate-600 my-8 py-2 bg-violet-50/50 rounded-r-lg print:bg-transparent print:border-l-2 print:border-black print:text-black print:pl-4 print:my-4 print:italic" {...props} />
                    ),
                    p: ({node, ...props}) => <p className="mb-6 text-slate-800 leading-8 print:mb-3 print:text-black print:leading-normal" {...props} />,
                    
                    // Tables - Clean & Modern
                    table: ({node, ...props}) => (
                        <div className="overflow-x-auto my-8 rounded-lg border border-slate-200 shadow-sm print:shadow-none print:border print:border-black print:my-4 print:rounded-none">
                            <table className="min-w-full divide-y divide-slate-200 bg-white print:divide-black" {...props} />
                        </div>
                    ),
                    thead: ({node, ...props}) => <thead className="bg-slate-50 print:bg-gray-100 print:border-b print:border-black" {...props} />,
                    th: ({node, ...props}) => <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 print:text-black print:px-3 print:py-2 print:border-black" {...props} />,
                    td: ({node, ...props}) => <td className="px-6 py-4 text-sm text-slate-700 leading-relaxed border-t border-slate-100 align-top print:text-black print:px-3 print:py-2 print:border-t print:border-gray-300" {...props} />,
                    tr: ({node, ...props}) => <tr className="hover:bg-slate-50/50 transition-colors print:hover:bg-transparent" {...props} />,

                    // Images (Diagrams)
                    img: ({node, ...props}) => (
                      <div className="my-8 flex flex-col items-center break-inside-avoid print:my-4">
                        <div className="relative group overflow-hidden rounded-xl border border-slate-200 shadow-lg print:shadow-none print:border print:border-black print:rounded-none">
                          <img 
                            {...props} 
                            className="max-w-full h-auto object-cover bg-white print:max-h-[300px]"
                            loading="lazy"
                          />
                        </div>
                        {props.alt && (
                          <span className="mt-3 text-sm text-slate-500 font-medium italic flex items-center gap-1 print:text-black print:not-italic print:text-xs">
                            <ZoomIn size={12} className="print:hidden" /> Figure: {props.alt}
                          </span>
                        )}
                      </div>
                    ),

                    // Code - JetBrains Mono style
                    code: (props: any) => {
                      const { node, inline, className, children, ...rest } = props;
                      if (inline) {
                         return <code className={`font-mono text-[0.9em] bg-slate-100 text-violet-700 px-1.5 py-0.5 rounded border border-slate-200 ${className || ''} print:bg-transparent print:text-black print:border-none print:font-bold print:px-0`} {...rest}>{children}</code>;
                      }
                      return (
                         <div className="my-6 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-[#0d1117] print:bg-white print:border print:border-black print:shadow-none print:rounded-none print:my-4 break-inside-avoid">
                             <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-slate-800 print:bg-gray-100 print:border-black print:py-1">
                                 <div className="flex gap-1.5 print:hidden">
                                     <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                     <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                     <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                 </div>
                                 <span className="text-xs text-slate-400 hidden print:block font-mono text-black">Code Snippet</span>
                             </div>
                             <code className={`block p-6 text-sm font-mono text-slate-300 overflow-x-auto ${className || ''} print:text-black print:whitespace-pre-wrap print:p-4 print:text-xs`} {...rest}>{children}</code>
                         </div>
                      );
                    },
                    pre: ({node, ...props}) => <pre className="not-prose" {...props} />,
                    
                    // Divider
                    hr: ({node, ...props}) => <hr className="border-t border-slate-200 my-10 print:my-6 print:border-black" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};

export default Notebook;