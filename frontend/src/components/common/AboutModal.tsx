import React from 'react';
import { Bot, Cpu, Database, FileText, Globe, Layers, ShieldCheck, X } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Agentic AI System</h3>
              <p className="text-[10px] text-slate-400 font-mono">Production RAG • SQL • Web Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-300">
          <p className="leading-relaxed">
            An enterprise-grade multi-tool AI assistant platform powered by <strong>LangGraph</strong> stateful decision graphs. The system dynamically analyzes user queries and chooses the optimal reasoning path across knowledge databases, relational SQL stores, or the live internet.
          </p>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Vector RAG</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">ChromaDB embeddings for Swiss Airline Policies & Stories.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>NL → SQL</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">PostgreSQL schema reasoning and execution toolkit.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-sky-300">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>Live Web</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">Real-time web search integration via Tavily API.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-purple-300">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Groq LLM</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">High-speed inference using state-of-the-art open models.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 space-y-1 text-indigo-200">
            <div className="flex items-center gap-1.5 font-semibold text-indigo-300">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Production & Security</span>
            </div>
            <p className="text-[11px] text-indigo-300/80 leading-relaxed">
              API credentials and database connection strings are safely managed server-side. Deployed cleanly on Render via static & web services.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
