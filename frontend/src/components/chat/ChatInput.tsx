import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Database, Globe, Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  inputPrompt?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isProcessing,
  inputPrompt = '',
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputPrompt) {
      setText(inputPrompt);
      textareaRef.current?.focus();
    }
  }, [inputPrompt]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isProcessing) return;
    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 bg-slate-950/80 border-t border-slate-800 shrink-0">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Capability Indicators */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="font-medium">Active Agent Capabilities:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40">
              <BookOpen className="w-3 h-3 text-amber-400" />
              RAG Policy
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
              <Database className="w-3 h-3 text-emerald-400" />
              NL → SQL
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-950/40 text-sky-300 border border-sky-800/40">
              <Globe className="w-3 h-3 text-sky-400" />
              Web Search
            </span>
          </div>
        </div>

        {/* Text Input Container */}
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about policies, stories, your database, or the web..."
            disabled={isProcessing}
            className="w-full bg-slate-900 text-slate-100 border border-slate-800 focus:border-indigo-500 rounded-xl py-3.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none transition-colors placeholder:text-slate-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!text.trim() || isProcessing}
            className="absolute right-2.5 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 disabled:hover:bg-indigo-600 transition-all shadow-md shadow-indigo-600/20"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-center text-slate-500">
          Agentic AI evaluates your question dynamically and selects the optimal tool (RAG, PostgreSQL SQL Agent, or Tavily Search).
        </p>
      </div>
    </div>
  );
};
