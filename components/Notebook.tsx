import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NoteLanguage } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Check, ZoomIn } from 'lucide-react';

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
      className={`relative group flex items-start gap-3 mb-3 cursor-pointer select-none transition-all duration-200 ${props.className || ''}`}
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
      `}>
        <Check 
          size={12} 
          className={`text-white transition-all duration-300 ${checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} 
          strokeWidth={3.5} 
        />
      </div>

      <div className={`flex-1 transition-all duration-300 ${checked ? 'opacity-50 line-through decoration-slate-400' : 'opacity-100'}`}>
        {children}
      </div>
    </li>
  );
};

const Notebook: React.FC<NotebookProps> = ({ content, language, settings = { fontSize: 'md', layout: 'standard' } }) => {
  const fontClass = language === NoteLanguage.Bengali ? 'font-bengali' : 'font-sans';
  
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

  const heading2Size = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  }[settings.fontSize];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full ${containerWidth} mx-auto transition-all duration-500 ease-in-out`}
    >
      {/* The Paper Card */}
      <div className="relative bg-zinc-50 rounded-lg shadow-2xl overflow-hidden min-h-[800px]">
        
        {/* Top Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500"></div>

        {/* Content Area */}
        <div className={`p-8 md:p-16 text-slate-900 ${fontClass} ${textSize} leading-relaxed transition-all duration-300`}>
            
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    // Elegant Typography
                    h1: ({node, ...props}) => <h1 className={`${heading1Size} font-bold tracking-tight text-slate-900 mb-8 mt-4 pb-4 border-b border-slate-200`} {...props} />,
                    h2: ({node, ...props}) => <h2 className={`${heading2Size} font-semibold text-slate-800 mt-12 mb-4 flex items-center gap-2`} {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-medium text-slate-700 mt-8 mb-3" {...props} />,
                    
                    // Lists
                    ul: ({node, ...props}) => <ul className="list-none list-outside ml-2 space-y-2 mb-6 text-slate-700" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 space-y-2 mb-6 text-slate-700 marker:text-slate-400 marker:font-medium pl-2" {...props} />,
                    
                    // List Item with Checkbox
                    li: ListItem,
                    
                    // Emphasis
                    strong: ({node, ...props}) => <strong className="font-semibold text-slate-900" {...props} />,
                    blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-violet-500 pl-6 italic text-slate-600 my-8 py-2 bg-violet-50/50 rounded-r-lg" {...props} />
                    ),
                    p: ({node, ...props}) => <p className="mb-6 text-slate-800 leading-8" {...props} />,
                    
                    // Tables - Clean & Modern (Enhanced for the new strict rules)
                    table: ({node, ...props}) => (
                        <div className="overflow-x-auto my-8 rounded-lg border border-slate-200 shadow-sm">
                            <table className="min-w-full divide-y divide-slate-200 bg-white" {...props} />
                        </div>
                    ),
                    thead: ({node, ...props}) => <thead className="bg-slate-50" {...props} />,
                    th: ({node, ...props}) => <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200" {...props} />,
                    td: ({node, ...props}) => <td className="px-6 py-4 text-sm text-slate-700 leading-relaxed border-t border-slate-100 align-top" {...props} />,
                    tr: ({node, ...props}) => <tr className="hover:bg-slate-50/50 transition-colors" {...props} />,

                    // Images (Diagrams)
                    img: ({node, ...props}) => (
                      <div className="my-8 flex flex-col items-center">
                        <div className="relative group overflow-hidden rounded-xl border border-slate-200 shadow-lg">
                          <img 
                            {...props} 
                            className="max-w-full h-auto object-cover bg-white"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none"></div>
                        </div>
                        {props.alt && (
                          <span className="mt-3 text-sm text-slate-500 font-medium italic flex items-center gap-1">
                            <ZoomIn size={12} /> {props.alt}
                          </span>
                        )}
                      </div>
                    ),

                    // Code - JetBrains Mono style
                    code: (props: any) => {
                      const { node, inline, className, children, ...rest } = props;
                      if (inline) {
                         return <code className={`font-mono text-[0.9em] bg-slate-100 text-violet-700 px-1.5 py-0.5 rounded border border-slate-200 ${className || ''}`} {...rest}>{children}</code>;
                      }
                      return (
                         <div className="my-6 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-[#0d1117]">
                             <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-slate-800">
                                 <div className="flex gap-1.5">
                                     <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                     <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                     <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                 </div>
                             </div>
                             <code className={`block p-6 text-sm font-mono text-slate-300 overflow-x-auto ${className || ''}`} {...rest}>{children}</code>
                         </div>
                      );
                    },
                    pre: ({node, ...props}) => <pre className="not-prose" {...props} />,
                    
                    // Divider
                    hr: ({node, ...props}) => <hr className="border-t border-slate-200 my-10" {...props} />,
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
