import React from 'react';
import { Conversation } from '../../types';
import { Bot, Info, MessageSquarePlus, MessagesSquare, Settings, Trash2, X } from 'lucide-react';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  isBackendOnline: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpenMobile,
  onCloseMobile,
  onOpenSettings,
  onOpenAbout,
  isBackendOnline,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300 transform ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Branding Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-100 tracking-tight">Agentic AI</h2>
              <p className="text-[10px] text-slate-400 font-mono">RAG • SQL • Web Search</p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Conversation Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewConversation();
              onCloseMobile();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-colors"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Conversation History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Recent Chats</span>
            <span className="font-mono text-[10px]">{conversations.length}</span>
          </div>

          {conversations.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 italic">
              No previous conversations.
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    onCloseMobile();
                  }}
                  className={`group relative flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-slate-800/90 text-slate-100 font-medium border border-slate-700/60'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-6">
                    <MessagesSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="truncate">{conv.title || 'Untitled Conversation'}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Settings & About Controls */}
        <div className="p-3 border-t border-slate-800 space-y-1 bg-slate-950">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings & Preferences</span>
          </button>

          <button
            onClick={onOpenAbout}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
          >
            <Info className="w-4 h-4 text-slate-400" />
            <span>About Architecture</span>
          </button>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-900">
            <span>Status</span>
            <span className={`inline-flex items-center gap-1 font-medium ${isBackendOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
              ● {isBackendOnline ? 'API Connected' : 'Offline'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
