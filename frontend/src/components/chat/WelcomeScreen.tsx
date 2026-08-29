import React from 'react';
import { BookOpen, Database, FileText, Globe, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onSelectPrompt: (promptText: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectPrompt }) => {
  const cards = [
    {
      title: 'Policy Intelligence',
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      description: 'Search Swiss Airline policy documents using vector RAG.',
      example: 'What is the baggage policy for Swiss Airlines?',
      tag: 'RAG Tool',
      borderColor: 'hover:border-amber-500/50',
    },
    {
      title: 'Knowledge Retrieval',
      icon: <BookOpen className="w-5 h-5 text-purple-400" />,
      description: 'Retrieve information from the story knowledge base.',
      example: 'Tell me what happened to the main character in the story.',
      tag: 'Vector DB',
      borderColor: 'hover:border-purple-500/50',
    },
    {
      title: 'Database Intelligence',
      icon: <Database className="w-5 h-5 text-emerald-400" />,
      description: 'Ask questions about PostgreSQL using natural language.',
      example: 'How many departments are present in department table?',
      tag: 'NL → SQL',
      borderColor: 'hover:border-emerald-500/50',
    },
    {
      title: 'Live Web Search',
      icon: <Globe className="w-5 h-5 text-sky-400" />,
      description: 'Search the live web for current real-time information.',
      example: 'What are the latest developments in AI agents?',
      tag: 'Tavily Search',
      borderColor: 'hover:border-sky-500/50',
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto text-center space-y-8 animate-fade-in my-auto">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Tool Agentic Intelligence</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
          What can I help you investigate?
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          Ask questions across your policy knowledge bases, PostgreSQL database, or search the live web.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(card.example)}
            className={`p-4 rounded-xl bg-slate-900/60 border border-slate-800 ${card.borderColor} transition-all duration-200 hover:scale-[1.01] hover:bg-slate-900 flex flex-col justify-between group text-left`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  {card.icon}
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                  {card.tag}
                </span>
              </div>
              <h3 className="font-semibold text-slate-200 text-sm mb-1 group-hover:text-white">
                {card.title}
              </h3>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                {card.description}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/60 text-xs text-indigo-400 font-mono truncate group-hover:text-indigo-300">
              "{card.example}"
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
