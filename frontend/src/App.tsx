import React, { useEffect, useState } from 'react';
import { ChatMessage, Conversation } from './types';
import { apiService, CustomCredentials } from './services/api';
import { Sidebar } from './components/sidebar/Sidebar';
import { Header } from './components/chat/Header';
import { WelcomeScreen } from './components/chat/WelcomeScreen';
import { MessageList } from './components/chat/MessageList';
import { ChatInput } from './components/chat/ChatInput';
import { SettingsModal } from './components/common/SettingsModal';
import { AboutModal } from './components/common/AboutModal';

const STORAGE_KEY = 'agentic_ai_conversations_v1';

export const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved conversations', e);
    }
    return [];
  });

  const [activeId, setActiveId] = useState<string>(() => {
    const existing = conversations[0]?.id;
    return existing || `thread-${Date.now()}`;
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStatusText, setActiveStatusText] = useState('Agent analyzing query...');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isBackendOnline, setIsBackendOnline] = useState(true);

  // Modals state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Save conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to save conversations to localStorage', e);
    }
  }, [conversations]);

  // Check health periodically
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await apiService.getHealth();
        setIsBackendOnline(true);
      } catch (err) {
        setIsBackendOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get current active conversation
  const currentConv = conversations.find((c) => c.id === activeId) || {
    id: activeId,
    title: 'New Conversation',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    lastUpdated: Date.now(),
    messages: [],
  };

  const handleNewConversation = () => {
    const newId = `thread-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: 'New Conversation',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lastUpdated: Date.now(),
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newId);
  };

  const handleDeleteConversation = (id: string) => {
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    if (activeId === id) {
      if (updated.length > 0) {
        setActiveId(updated[0].id);
      } else {
        handleNewConversation();
      }
    }
  };

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | undefined>(undefined);

  const [credentials, setCredentials] = useState<CustomCredentials>(() => {
    try {
      const saved = localStorage.getItem('agentic_ai_creds_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved credentials', e);
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem('agentic_ai_creds_v1', JSON.stringify(credentials));
    } catch (e) {
      console.error('Failed to save credentials', e);
    }
  }, [credentials]);

  const handleUploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const res = await apiService.uploadDocument(file, activeId);
      setUploadedFileName(file.name);

      const sysMsg: ChatMessage = {
        id: `msg-${Date.now()}-sys`,
        sender: 'assistant',
        text: `📄 **Document Uploaded & Indexed**: Successfully parsed **\`${file.name}\`** (${res.chunks || 'multiple'} text chunks embedded into Vector DB). You can now ask questions about this document!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolUsed: 'policy_rag',
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, messages: [...c.messages, sysMsg] } : c
        )
      );
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Update conversation state with user message
    const updatedMessages = [...currentConv.messages, userMsg];
    const updatedTitle = currentConv.messages.length === 0 ? text.slice(0, 32) : currentConv.title;

    const updatedConv: Conversation = {
      ...currentConv,
      title: updatedTitle,
      lastUpdated: Date.now(),
      messages: updatedMessages,
    };

    setConversations((prev) => {
      const exists = prev.some((c) => c.id === activeId);
      if (exists) {
        return prev.map((c) => (c.id === activeId ? updatedConv : c));
      }
      return [updatedConv, ...prev];
    });

    setIsProcessing(true);
    setActiveStatusText('Agent analyzing intent and selecting tools...');

    try {
      // Call backend API with custom credentials if specified
      const res = await apiService.sendMessage(text, activeId, credentials);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        sender: 'assistant',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolUsed: res.tool_used,
        toolActivities: res.tool_activities,
        sqlQuery: res.sql_query,
        sqlData: res.sql_data,
        ragSources: res.rag_sources,
        webSources: res.web_sources,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, messages: [...c.messages, assistantMsg] } : c
        )
      );
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: 'assistant',
        text: `⚠️ **Agent Error**: ${err.message || 'Unable to complete request. Please ensure backend service is running.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, messages: [...c.messages, errorMsg] } : c
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearCurrentChat = () => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, messages: [] } : c))
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Left Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeId}
        onSelectConversation={(id) => setActiveId(id)}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        isBackendOnline={isBackendOnline}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
        <Header
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isBackendOnline={isBackendOnline}
          activeThreadId={activeId}
        />

        {currentConv.messages.length === 0 ? (
          <WelcomeScreen
            onSelectPrompt={(prompt) => {
              setInputPrompt(prompt);
            }}
          />
        ) : (
          <MessageList
            messages={currentConv.messages}
            isProcessing={isProcessing}
            activeStatusText={activeStatusText}
          />
        )}

        <ChatInput
          onSendMessage={handleSendMessage}
          onUploadFile={handleUploadFile}
          isProcessing={isProcessing}
          isUploading={isUploading}
          uploadedFileName={uploadedFileName}
          onClearUploadedFile={() => setUploadedFileName(undefined)}
          inputPrompt={inputPrompt}
        />
      </main>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeThreadId={activeId}
        isBackendOnline={isBackendOnline}
        onClearCurrentChat={handleClearCurrentChat}
        credentials={credentials}
        onSaveCredentials={setCredentials}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
};

export default App;
