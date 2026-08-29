import React from 'react';
import { Bot, Menu, Sparkles } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  isBackendOnline: boolean;
  activeThreadId: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isBackendOnline,
  activeThreadId,
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-sm text-slate-100">Agentic AI Assistant</h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                LangGraph Agent
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Thread: <span className="text-slate-300">{activeThreadId.slice(0, 16)}...</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-800">
          <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span className={isBackendOnline ? 'text-emerald-400' : 'text-rose-400'}>
            {isBackendOnline ? 'Online' : 'Unavailable'}
          </span>
        </div>
      </div>
    </header>
  );
};
