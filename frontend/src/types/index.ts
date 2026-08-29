export type ToolType = 'sql' | 'policy_rag' | 'stories_rag' | 'web_search' | 'general';

export interface ToolActivity {
  tool: string;
  label: string;
  status: 'completed' | 'running' | 'failed';
  details?: string;
}

export interface RAGSource {
  title: string;
  section?: string;
  content: string;
}

export interface WebSource {
  title: string;
  url: string;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  toolUsed?: ToolType;
  toolActivities?: ToolActivity[];
  sqlQuery?: string;
  sqlData?: Record<string, any>[];
  ragSources?: RAGSource[];
  webSources?: WebSource[];
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  timestamp: string;
  lastUpdated: number;
  messages: ChatMessage[];
}

export interface ChatResponse {
  thread_id: string;
  answer: string;
  tool_used: ToolType;
  tool_activities: ToolActivity[];
  sql_query?: string;
  sql_data?: Record<string, any>[];
  rag_sources: RAGSource[];
  web_sources: WebSource[];
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}
