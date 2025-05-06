import { create } from 'zustand';
import type { Message } from '../types/chat';
import api from '../services/api';

interface SearchFilters {
  roomId?: string;
  fromDate?: string;
  toDate?: string;
  sender?: string;
  content?: string;
}

interface SearchState {
  searchResults: Message[];
  loading: boolean;
  error: string | null;
  filters: SearchFilters;
  
  // Actions
  searchMessages: (query: string, filters?: SearchFilters) => Promise<void>;
  setFilters: (filters: SearchFilters) => void;
  clearResults: () => void;
}

const useSearchStore = create<SearchState>((set) => ({
  searchResults: [],
  loading: false,
  error: null,
  filters: {},
  
  searchMessages: async (query: string, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      params.append('query', query);
      
      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get<{ messages: Message[] }>(`/messages/search?${params}`);
      set({ searchResults: response.data.messages, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search messages';
      set({ error: errorMessage, loading: false });
    }
  },
  
  setFilters: (filters: SearchFilters) => {
    set({ filters });
  },
  
  clearResults: () => {
    set({ searchResults: [], error: null });
  },
}));

export default useSearchStore;