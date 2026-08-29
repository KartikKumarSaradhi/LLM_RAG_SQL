import React, { useState } from 'react';
import { RAGSource } from '../../types';
import { BookOpen, ChevronDown, ChevronRight, FileText } from 'lucide-react';

interface RAGSourceCardProps {
  sources?: RAGSource[];
}

export const RAGSourceCardView: React.FC<RAGSourceCardProps> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="my-3 text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/30 hover:bg-amber-950/50 border border-amber-900/40 text-amber-300 font-medium transition-colors"
      >
        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
        <span>RAG Knowledge Sources ({sources.length})</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 ml-1" /> : <ChevronRight className="w-3.5 h-3.5 ml-1" />}
      </button>

      {isOpen && (
        <div className="mt-2 flex flex-col gap-2.5 max-w-2xl">
          {sources.map((src, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-900/90 border border-amber-900/30 text-slate-300 space-y-1.5"
            >
              <div className="flex items-center justify-between font-semibold text-amber-200">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>{src.title}</span>
                </div>
                {src.section && (
                  <span className="text-[10px] bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-800/40">
                    {src.section}
                  </span>
                )}
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300 font-sans whitespace-pre-wrap bg-slate-950/60 p-2 rounded border border-slate-800/60">
                {src.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
