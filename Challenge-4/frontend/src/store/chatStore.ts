import { create } from 'zustand';
import type { Message, Room, OnlineStatus, User } from '../types/chat';
import api from '../services/api';
import socketService from '../services/socket';
import axios from 'axios'; // Import axios to check for AxiosError

interface ChatState {
  rooms: Room[];
  availableUsers: User[];  // Add this line
  activeRoomId: string | null;
  messages: { [roomId: string]: Message[] };
  onlineUsers: OnlineStatus;
  typingUsers: { [roomId: string]: string[] };
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchRooms: (options?: { member?: boolean; type?: string }) => Promise<void>;
  fetchMessages: (roomId: string) => Promise<void>;
  setActiveRoom: (roomId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  addMessage: (message: Message) => void;
  updateOnlineStatus: (userId: number, isOnline: boolean) => void;
  setTypingStatus: (roomId: string, userId: string, isTyping: boolean) => void;
  
  // Room management
  createRoom: (roomData: {
    name: string;
    description: string;
    type: string;
    is_private: boolean;
    members: number[];
  }) => Promise<Room>;
  
  updateRoom: (roomId: string, roomData: {
    name?: string;
    description?: string;
    type?: string;
    is_private?: boolean;
  }) => Promise<Room>;
  
  deleteRoom: (roomId: string) => Promise<void>;
  addMembers: (roomId: string, memberIds: number[], isAdmin?: boolean) => Promise<Room>;
  removeMembers: (roomId: string, memberIds: number[]) => Promise<Room>;
  getRoomDetails: (roomId: string) => Promise<Room>;
}

// Helper to get error message safely
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};


export const useChatStore = create<ChatState>((set, get) => ({
  rooms: [],
  availableUsers: [], // Add the missing property
  activeRoomId: null,
  messages: {},
  onlineUsers: {},
  typingUsers: {},
  loading: false,
  error: null,
  
  fetchRooms: async (options = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (options.member !== undefined) {
        params.append('member', options.member.toString());
      }
      if (options.type) {
        params.append('type', options.type);
      }
      
      const queryString = params.toString();
      const url = queryString ? `/rooms?${queryString}` : '/rooms';
      
      const response = await api.get<{ rooms: { data: Room[] } }>(url);
      set({ rooms: response.data.rooms.data, loading: false });
    } catch (error) {
      console.error('Error fetching rooms:', error);
      set({ error: getErrorMessage(error, 'Failed to load chat rooms'), loading: false });
    }
  },
  
  fetchMessages: async (roomId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<{ messages: { data: Message[] } }>(`/rooms/${roomId}/messages`);
      const msgs = response.data.messages.data;
      set(state => ({
        messages: {
          ...state.messages,
          [roomId]: msgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        },
        loading: false
      }));
    } catch (error) {
      console.error(`Error fetching messages for room ${roomId}:`, error);
      set({ error: getErrorMessage(error, 'Failed to load messages'), loading: false });
    }
  },
  
  setActiveRoom: (roomId: string) => {
    const { fetchMessages } = get();
    const currentRoomId = get().activeRoomId;
    
    if (currentRoomId === roomId) return;
    
    if (currentRoomId) {
      socketService.leaveRoom(currentRoomId);
    }
    
    set(state => ({
      activeRoomId: roomId,
      error: null,
      typingUsers: {
        ...state.typingUsers,
        // Fix the type issue with a type guard
        ...(currentRoomId ? { [currentRoomId as string]: [] } : {})
      }
    }));
    
    socketService.joinRoom(roomId);
    fetchMessages(roomId);
  },
  
  sendMessage: async (content: string) => {
    const { activeRoomId, addMessage } = get();
    if (!activeRoomId || !content.trim()) return;
    set({ error: null });
    try {
      const newMessage = await socketService.sendMessage(activeRoomId, content);
      if (newMessage) {
        addMessage(newMessage);
      }
    } catch (error) {
      console.error('Error initiating message send:', error);
      set({ error: getErrorMessage(error, 'Failed to send message') });
    }
  },
  
  addMessage: (message: Message) => {
    set(state => {
      const roomMessages = state.messages[message.roomId] || [];
      
      if (roomMessages.some(m => m.id === message.id)) {
        return state; 
      }
      
      const updatedMessages = [...roomMessages, message]
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      return {
        messages: {
          ...state.messages,
          [message.roomId]: updatedMessages
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
  },

  setTypingStatus: (roomId: string, userId: string, isTyping: boolean) => {
    set(state => {
      const roomTypingUsers = state.typingUsers[roomId] || [];
      const updatedTypingUsers = isTyping
        ? [...new Set([...roomTypingUsers, userId])]
        : roomTypingUsers.filter(id => id !== userId);

      return {
        typingUsers: {
          ...state.typingUsers,
          [roomId]: updatedTypingUsers
        }
      };
    });
  },

  createRoom: async (roomData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<{ room: Room }>('/rooms', roomData);
      const newRoom = response.data.room;
      
      set(state => ({
        rooms: [...state.rooms, newRoom],
        loading: false
      }));
      
      return newRoom;
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to create room');
      console.error('Error creating room:', error);
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },
  
  updateRoom: async (roomId, roomData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put<{ room: Room }>(`/rooms/${roomId}`, roomData);
      const updatedRoom = response.data.room;
      
      set(state => ({
        rooms: state.rooms.map(room => 
          room.id === roomId ? updatedRoom : room
        ),
        loading: false
      }));
      
      return updatedRoom;
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to update room');
      console.error(`Error updating room ${roomId}:`, error);
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },
  
  deleteRoom: async (roomId) => {
    set({ loading: true, error: null });
    const currentActiveRoomId = get().activeRoomId;

    try {
      await api.delete(`/rooms/${roomId}`);
      
      set(state => {
        const newMessages = { ...state.messages };
        delete newMessages[roomId];

        const newRooms = state.rooms.filter(room => room.id !== roomId);
        
        const newActiveRoomId = state.activeRoomId === roomId ? null : state.activeRoomId;

        return {
          ...state,
          rooms: newRooms,
          messages: newMessages,
          activeRoomId: newActiveRoomId,
          loading: false,
          error: null
        };
      });

      if (currentActiveRoomId === roomId) {
        socketService.leaveRoom(roomId);
      }

    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to delete room');
      console.error(`Error deleting room ${roomId}:`, error);
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },
  
  addMembers: async (roomId, memberIds, isAdmin = false) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<{ room: Room }>(`/rooms/${roomId}/members`, {
        member_ids: memberIds,
        is_admin: isAdmin
      });
      
      const updatedRoom = response.data.room;
      set(state => ({
        rooms: state.rooms.map(room => 
          room.id === roomId ? updatedRoom : room
        ),
        loading: false
      }));
      
      return updatedRoom;
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to add members');
      console.error(`Error adding members to room ${roomId}:`, error);
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },
  
  removeMembers: async (roomId, memberIds) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete<{ room: Room }>(`/rooms/${roomId}/members`, {
        data: { member_ids: memberIds } 
      });
      
      const updatedRoom = response.data.room;
      set(state => ({
        rooms: state.rooms.map(room => 
          room.id === roomId ? updatedRoom : room
        ),
        loading: false
      }));
      
      return updatedRoom;
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to remove members');
      console.error(`Error removing members from room ${roomId}:`, error);
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },
  
  getRoomDetails: async (roomId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<{ room: Room }>(`/rooms/${roomId}`);
      const roomDetails = response.data.room;
      
      set(state => ({
        rooms: state.rooms.map(room => 
          room.id === roomId ? { ...room, ...roomDetails } : room
        ),
        loading: false
      }));
      
      return roomDetails;
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to get room details');
      console.error(`Error getting details for room ${roomId}:`, error);
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  }
}));