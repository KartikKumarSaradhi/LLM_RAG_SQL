import React, { useState } from 'react';
import { ChatMessage } from '../../types';
import { AgentActivityView } from '../agent/AgentActivity';
import { SQLResultView } from '../sql/SQLResultView';
import { RAGSourceCardView } from '../sources/RAGSourceCard';
import { WebSourceCardView } from '../sources/WebSourceCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, Check, Copy, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end my-4 animate-fade-in">
        <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
          <div className="flex flex-col items-end">
            <div className="bg-indigo-600 text-white py-2.5 px-4 rounded-2xl rounded-br-xs text-sm leading-relaxed shadow-md shadow-indigo-600/10">
              <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 font-mono">{message.timestamp}</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start my-5 animate-fade-in group">
      <div className="flex items-start gap-3 max-w-[95%] sm:max-w-[88%]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20 mt-0.5">
          <Bot className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header metadata */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-xs text-slate-200">Agentic AI</span>
            <span className="text-[10px] text-slate-500 font-mono">{message.timestamp}</span>
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-200"
              title="Copy message"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Agent Activity Execution Indicator */}
          <AgentActivityView
            activities={message.toolActivities}
            toolUsed={message.toolUsed}
          />

          {/* Main Message Text with Markdown */}
          <div className="prose prose-invert max-w-none text-sm text-slate-200 leading-relaxed font-sans bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/80">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.text}
            </ReactMarkdown>
          </div>

          {/* Structured Outputs: SQL Tables, RAG Cards, Web Cards */}
          {message.sqlQuery && (
            <SQLResultView query={message.sqlQuery} data={message.sqlData} />
          )}

          {message.ragSources && message.ragSources.length > 0 && (
            <RAGSourceCardView sources={message.ragSources} />
          )}

          {message.webSources && message.webSources.length > 0 && (
            <WebSourceCardView sources={message.webSources} />
          )}
        </div>
      </div>
    </div>
  );
};
