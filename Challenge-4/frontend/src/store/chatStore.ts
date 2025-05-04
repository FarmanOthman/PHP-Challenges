import { create } from 'zustand';
import { Message, Room, OnlineStatus } from '../types/chat';
import api from '../services/api';
import socketService from '../services/socket';

interface ChatState {
  rooms: Room[];
  activeRoomId: string | null;
  messages: { [roomId: string]: Message[] };
  onlineUsers: OnlineStatus;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchRooms: () => Promise<void>;
  fetchMessages: (roomId: string) => Promise<void>;
  setActiveRoom: (roomId: string) => void;
  sendMessage: (content: string) => void;
  addMessage: (message: Message) => void;
  updateOnlineStatus: (userId: number, isOnline: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  rooms: [],
  activeRoomId: null,
  messages: {},
  onlineUsers: {},
  loading: false,
  error: null,
  
  fetchRooms: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/rooms');
      set({ rooms: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching rooms:', error);
      set({ error: 'Failed to load chat rooms', loading: false });
    }
  },
  
  fetchMessages: async (roomId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/rooms/${roomId}/messages`);
      set(state => ({
        messages: { 
          ...state.messages, 
          [roomId]: response.data 
        },
        loading: false
      }));
    } catch (error) {
      console.error(`Error fetching messages for room ${roomId}:`, error);
      set({ error: 'Failed to load messages', loading: false });
    }
  },
  
  setActiveRoom: (roomId: string) => {
    const { fetchMessages } = get();
    set({ activeRoomId: roomId });
    
    // Leave previous room if any
    const prevRoomId = get().activeRoomId;
    if (prevRoomId) {
      socketService.leaveRoom(prevRoomId);
    }
    
    // Join new room and fetch messages
    socketService.joinRoom(roomId);
    fetchMessages(roomId);
  },
  
  sendMessage: (content: string) => {
    const { activeRoomId } = get();
    if (!activeRoomId || !content.trim()) return;
    
    socketService.sendMessage(activeRoomId, content);
    // The message will be added to the state when it comes back from the server
    // This ensures consistency and avoids duplicate messages
  },
  
  addMessage: (message: Message) => {
    set(state => {
      // Get current messages for the room or initialize empty array
      const roomMessages = state.messages[message.roomId] || [];
      
      // Check if message already exists to avoid duplicates
      const messageExists = roomMessages.some(m => m.id === message.id);
      if (messageExists) return state;
      
      return {
        messages: {
          ...state.messages,
          [message.roomId]: [...roomMessages, message]
        }
      };
    });
  },
  
  updateOnlineStatus: (userId: number, isOnline: boolean) => {
    set(state => ({
      onlineUsers: {
        ...state.onlineUsers,
        [userId]: isOnline
      }
    }));
  }
}));