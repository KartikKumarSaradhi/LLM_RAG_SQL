import React from 'react';
import { CustomCredentials } from '../../services/api';
import { Bot, Key, KeyRound, Server, Trash2, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeThreadId: string;
  isBackendOnline: boolean;
  onClearCurrentChat: () => void;
  credentials: CustomCredentials;
  onSaveCredentials: (creds: CustomCredentials) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  activeThreadId,
  isBackendOnline,
  onClearCurrentChat,
  credentials,
  onSaveCredentials,
}) => {
  if (!isOpen) return null;

  const handleChange = (field: keyof CustomCredentials, value: string) => {
    onSaveCredentials({
      ...credentials,
      [field]: value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950 shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-slate-100 text-sm">System & Credential Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Backend Status */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <p className="font-semibold text-slate-200">Backend API Status</p>
              <p className="text-slate-500 text-[11px]">Render / Local FastAPI Service</p>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                isBackendOnline
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {isBackendOnline ? '● Online' : '● Offline'}
            </span>
          </div>

          {/* User API Keys & Custom DB URI Overrides */}
          <div className="space-y-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <KeyRound className="w-4 h-4 text-indigo-400" />
              <span>Custom API Keys & Database (Optional)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Visitors can enter their own API keys or custom PostgreSQL URI below. If left blank, the app automatically uses default server environment keys.
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                <Key className="w-3 h-3 text-purple-400" />
                Custom Groq API Key
              </label>
              <input
                type="password"
                value={credentials.groqApiKey || ''}
                onChange={(e) => handleChange('groqApiKey', e.target.value)}
                placeholder="gsk_... (Leave blank for default server key)"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                <Key className="w-3 h-3 text-sky-400" />
                Custom Tavily API Key
              </label>
              <input
                type="password"
                value={credentials.tavilyApiKey || ''}
                onChange={(e) => handleChange('tavilyApiKey', e.target.value)}
                placeholder="tvly-... (Leave blank for default search key)"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                <Server className="w-3 h-3 text-emerald-400" />
                Custom PostgreSQL Connection URI
              </label>
              <input
                type="password"
                value={credentials.postgresUri || ''}
                onChange={(e) => handleChange('postgresUri', e.target.value)}
                placeholder="postgresql+psycopg2://user:pass@host:5432/dbname"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Session Thread ID */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Active LangGraph Session Thread ID</label>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-indigo-300 break-all select-all">
              {activeThreadId}
            </div>
          </div>

          {/* Danger Actions */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                onClearCurrentChat();
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Active Conversation Messages</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
