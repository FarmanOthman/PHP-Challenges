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
  fetchRooms: (options?: { member?: boolean; type?: string }) => Promise<void>;
  fetchMessages: (roomId: string) => Promise<void>;
  setActiveRoom: (roomId: string) => void;
  sendMessage: (content: string) => void;
  addMessage: (message: Message) => void;
  updateOnlineStatus: (userId: number, isOnline: boolean) => void;
  
  // Additional Room API actions
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

export const useChatStore = create<ChatState>((set, get) => ({
  rooms: [],
  activeRoomId: null,
  messages: {},
  onlineUsers: {},
  loading: false,
  error: null,
  
  fetchRooms: async (options = {}) => {
    set({ loading: true, error: null });
    try {
      // Build query params
      const params = new URLSearchParams();
      if (options.member !== undefined) {
        params.append('member', options.member.toString());
      }
      if (options.type) {
        params.append('type', options.type);
      }
      
      const queryString = params.toString();
      const url = queryString ? `/rooms?${queryString}` : '/rooms';
      
      const response = await api.get(url);
      set({ rooms: response.data.rooms.data, loading: false });
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
  },

  // New Room API functions
  createRoom: async (roomData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/rooms', roomData);
      const newRoom = response.data.room;
      
      // Update rooms list with the new room
      set(state => ({
        rooms: [...state.rooms, newRoom],
        loading: false
      }));
      
      return newRoom;
    } catch (error: unknown) {
      console.error('Error creating room:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create room';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },
  
  updateRoom: async (roomId, roomData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/rooms/${roomId}`, roomData);
      const updatedRoom = response.data.room;
      
      // Update the room in state
      set(state => ({
        rooms: state.rooms.map(room => 
          room.id === roomId ? updatedRoom : room
        ),
        loading: false
      }));
      
      return updatedRoom;
    } catch (error: unknown) {
      console.error(`Error updating room ${roomId}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update room';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },
  
  deleteRoom: async (roomId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/rooms/${roomId}`);
      
      // Remove room from state
      set(state => ({
        rooms: state.rooms.filter(room => room.id !== roomId),
        // If active room is deleted, set to null
        activeRoomId: state.activeRoomId === roomId ? null : state.activeRoomId,
        loading: false
      }));
    } catch (error: unknown) {
      console.error(`Error deleting room ${roomId}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete room';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },
  
  addMembers: async (roomId, memberIds, isAdmin = false) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/rooms/${roomId}/members`, {
        member_ids: memberIds,
        is_admin: isAdmin
      });
      
      const updatedRoom = response.data.room;
      
      // Update room in state
      set(state => ({
        rooms: state.rooms.map(room => 
          room.id === roomId ? updatedRoom : room
        ),
        loading: false
      }));
      
      return updatedRoom;
    } catch (error: unknown) {
      console.error(`Error adding members to room ${roomId}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add members';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },
  
  removeMembers: async (roomId, memberIds) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/rooms/${roomId}/members`, {
        data: { member_ids: memberIds }
      });
      
      const updatedRoom = response.data.room;
      
      // Update room in state
      set(state => ({
        rooms: state.rooms.map(room => 
          room.id === roomId ? updatedRoom : room
        ),
        loading: false
      }));
      
      return updatedRoom;
    } catch (error: unknown) {
      console.error(`Error removing members from room ${roomId}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove members';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },
  
  getRoomDetails: async (roomId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/rooms/${roomId}`);
      const roomDetails = response.data.room;
      
      // Update the room in state with fresh details
      set(state => ({
        rooms: state.rooms.map(room => 
          room.id === roomId ? roomDetails : room
        ),
        loading: false
      }));
      
      return roomDetails;
    } catch (error: unknown) {
      console.error(`Error fetching details for room ${roomId}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get room details';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  }
}));