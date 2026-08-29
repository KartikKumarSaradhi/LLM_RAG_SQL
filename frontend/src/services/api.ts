import axios from 'axios';
import { ChatResponse, HealthResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minutes timeout for complex RAG/SQL LLM tool calls
});

export interface CustomCredentials {
  groqApiKey?: string;
  tavilyApiKey?: string;
  postgresUri?: string;
}

export const apiService = {
  async getHealth(): Promise<HealthResponse> {
    try {
      const response = await apiClient.get<HealthResponse>('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend server is unavailable.');
    }
  },

  async uploadDocument(file: File, threadId: string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('thread_id', threadId);

      const response = await apiClient.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error(error.message || 'Failed to upload and index document.');
    }
  },

  async sendMessage(
    message: string,
    threadId: string,
    credentials?: CustomCredentials
  ): Promise<ChatResponse> {
    try {
      const response = await apiClient.post<ChatResponse>('/api/chat', {
        message,
        thread_id: threadId,
        groq_api_key: credentials?.groqApiKey || undefined,
        tavily_api_key: credentials?.tavilyApiKey || undefined,
        postgres_uri: credentials?.postgresUri || undefined,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error(error.message || 'Failed to communicate with Agentic AI backend.');
    }
  },
};
