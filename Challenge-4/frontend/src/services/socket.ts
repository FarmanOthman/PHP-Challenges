import { io, Socket } from 'socket.io-client';
import { Message } from '../types/chat';

class SocketService {
  private socket: Socket | null = null;
  private connected = false;

  // Initialize the socket connection
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io('http://localhost:8000', {
        auth: { token },
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        this.connected = true;
        console.log('Socket connected successfully');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        reject(error);
      });

      this.socket.on('disconnect', () => {
        this.connected = false;
        console.log('Socket disconnected');
      });
    });
  }

  // Disconnect the socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Join a specific chat room
  joinRoom(roomId: string): void {
    if (!this.socket || !this.connected) return;
    this.socket.emit('join-room', { roomId });
  }

  // Leave a specific chat room
  leaveRoom(roomId: string): void {
    if (!this.socket || !this.connected) return;
    this.socket.emit('leave-room', { roomId });
  }

  // Send a message to a room
  sendMessage(roomId: string, content: string): void {
    if (!this.socket || !this.connected) return;
    this.socket.emit('send-message', { roomId, content });
  }

  // Listen for new messages in a room
  onNewMessage(callback: (message: Message) => void): void {
    if (!this.socket) return;
    this.socket.on('new-message', callback);
  }

  // Listen for user presence changes
  onPresenceChange(callback: (data: { userId: number; status: 'online' | 'offline' }) => void): void {
    if (!this.socket) return;
    this.socket.on('presence-change', callback);
  }

  // Remove a specific listener
  off(event: string): void {
    if (!this.socket) return;
    this.socket.off(event);
  }

  // Check if socket is connected
  isConnected(): boolean {
    return this.connected;
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;