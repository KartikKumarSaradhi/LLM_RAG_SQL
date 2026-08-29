import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Database, FileText, Globe, Loader2, Paperclip, Send, X } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onUploadFile: (file: File) => Promise<void>;
  isProcessing: boolean;
  isUploading: boolean;
  uploadedFileName?: string;
  onClearUploadedFile?: () => void;
  inputPrompt?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onUploadFile,
  isProcessing,
  isUploading,
  uploadedFileName,
  onClearUploadedFile,
  inputPrompt = '',
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUploadFile(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="p-4 bg-slate-950/80 border-t border-slate-800 shrink-0">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Active Uploaded Document Badge */}
        {uploadedFileName && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-200 text-xs w-fit animate-fade-in">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Indexed Document: <strong>{uploadedFileName}</strong></span>
            {onClearUploadedFile && (
              <button
                onClick={onClearUploadedFile}
                className="p-0.5 text-indigo-400 hover:text-indigo-200 transition-colors"
                title="Remove uploaded document"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Capability Indicators */}
        <div className="flex items-center justify-between px-1 overflow-x-auto">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 whitespace-nowrap">
            <span className="font-medium">Active Agent Capabilities:</span>
            {uploadedFileName && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 font-semibold">
                <FileText className="w-3 h-3 text-indigo-400" />
                Custom Doc RAG
              </span>
            )}
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
          {/* File Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isProcessing}
            className="absolute left-2.5 p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800/60 transition-colors disabled:opacity-50"
            title="Upload custom document (PDF, TXT, MD) to query via RAG"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            ) : (
              <Paperclip className="w-4 h-4" />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md"
            onChange={handleFileChange}
            className="hidden"
          />

          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              uploadedFileName
                ? `Ask questions about ${uploadedFileName} or policies, SQL, web...`
                : "Ask anything, or click paperclip to upload your own document..."
            }
            disabled={isProcessing}
            className="w-full bg-slate-900 text-slate-100 border border-slate-800 focus:border-indigo-500 rounded-xl py-3.5 pl-11 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none transition-colors placeholder:text-slate-500 disabled:opacity-50"
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
          Upload PDF/TXT documents to enable instant RAG queries against your own custom files.
        </p>
      </div>
    </div>
  );
};
