import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../../types';
import { ChatMessageItem } from './ChatMessage';
import { AgentActivityView } from '../agent/AgentActivity';

interface MessageListProps {
  messages: ChatMessage[];
  isProcessing: boolean;
  activeStatusText?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isProcessing,
  activeStatusText,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.map((msg) => (
        <ChatMessageItem key={msg.id} message={msg} />
      ))}

      {isProcessing && (
        <div className="flex justify-start my-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md animate-pulse">
              <span className="font-bold text-xs">AI</span>
            </div>
            <div>
              <AgentActivityView
                isProcessing={true}
                activeStatusText={activeStatusText}
              />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
