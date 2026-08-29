import React, { useState } from 'react';
import { WebSource } from '../../types';
import { ChevronDown, ChevronRight, ExternalLink, Globe } from 'lucide-react';

interface WebSourceCardProps {
  sources?: WebSource[];
}

export const WebSourceCardView: React.FC<WebSourceCardProps> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="my-3 text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-950/30 hover:bg-sky-950/50 border border-sky-900/40 text-sky-300 font-medium transition-colors"
      >
        <Globe className="w-3.5 h-3.5 text-sky-400" />
        <span>Live Web Sources ({sources.length})</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 ml-1" /> : <ChevronRight className="w-3.5 h-3.5 ml-1" />}
      </button>

      {isOpen && (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2.5 max-w-2xl">
          {sources.map((src, idx) => {
            let domain = src.url;
            try {
              domain = new URL(src.url).hostname;
            } catch (e) {
              // fallback
            }

            return (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-900/90 border border-sky-900/30 text-slate-300 space-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between font-semibold text-sky-200 mb-1">
                    <span className="truncate pr-2">{src.title}</span>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300 flex items-center gap-0.5 shrink-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <span className="text-[10px] font-mono text-sky-400/80 block mb-1">
                    {domain}
                  </span>
                  <p className="text-[11px] leading-relaxed text-slate-400 line-clamp-3">
                    {src.snippet}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
