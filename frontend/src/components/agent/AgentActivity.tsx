import React, { useState } from 'react';
import { ToolActivity } from '../../types';
import { Bot, CheckCircle2, ChevronDown, ChevronRight, Database, FileText, Globe, Loader2, Sparkles } from 'lucide-react';

interface AgentActivityProps {
  activities?: ToolActivity[];
  toolUsed?: string;
  isProcessing?: boolean;
  activeStatusText?: string;
}

export const AgentActivityView: React.FC<AgentActivityProps> = ({
  activities = [],
  toolUsed,
  isProcessing = false,
  activeStatusText = 'Agent analyzing query...'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isProcessing) {
    return (
      <div className="flex items-center gap-2.5 py-2 px-3.5 my-2 text-xs rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-indigo-300 animate-pulse w-fit">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
        <span className="font-medium">{activeStatusText}</span>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    if (!toolUsed || toolUsed === 'general') return null;
  }

  const getToolIcon = (name: string) => {
    if (name.includes('sql') || name.includes('sqldb')) return <Database className="w-3.5 h-3.5 text-emerald-400" />;
    if (name.includes('policy') || name.includes('stories')) return <FileText className="w-3.5 h-3.5 text-amber-400" />;
    if (name.includes('search') || name.includes('tavily')) return <Globe className="w-3.5 h-3.5 text-sky-400" />;
    return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
  };

  return (
    <div className="my-2 text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
      >
        <Bot className="w-3.5 h-3.5 text-indigo-400" />
        <span className="font-medium text-slate-300">Agent Activity</span>
        <span className="text-emerald-400 flex items-center gap-1 font-semibold ml-1">
          <CheckCircle2 className="w-3 h-3" />
          {activities.length > 0 ? `${activities.length} tool(s) used` : toolUsed}
        </span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 ml-1" /> : <ChevronRight className="w-3.5 h-3.5 ml-1" />}
      </button>

      {isOpen && (
        <div className="mt-2 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 flex flex-col gap-1.5 max-w-md">
          {activities.length > 0 ? (
            activities.map((act, idx) => (
              <div key={idx} className="flex items-center justify-between py-1 px-2 rounded bg-slate-950/60 border border-slate-800/50">
                <div className="flex items-center gap-2">
                  {getToolIcon(act.tool)}
                  <span className="font-mono text-slate-200">{act.label}</span>
                </div>
                <span className="text-[10px] uppercase font-semibold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800/40">
                  {act.status}
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 py-1 px-2 rounded bg-slate-950/60 border border-slate-800/50 text-slate-300">
              {getToolIcon(toolUsed || '')}
              <span>Executed {toolUsed} capability</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
