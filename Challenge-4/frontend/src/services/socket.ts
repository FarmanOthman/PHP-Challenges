import Pusher, { Channel, Members } from 'pusher-js';
// Import only the Message interface as it's the only one used
import type { Message } from '../types/chat';

// Define interfaces for Pusher event data
interface PusherError {
  type: string;
  error: {
    type: string;
    data: {
      code: number;
      message: string;
    };
  };
}

// Define interface for a presence channel member
interface PusherMember {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: Record<string, any>; // Or a more specific type if you know the structure of 'info'
}

type MessageCallback = (message: Message) => void;
type PresenceCallback = (data: { userId: number; status: 'online' | 'offline' }) => void;
type TypingCallback = (data: { roomId: string; userId: string; isTyping: boolean }) => void;

class SocketService {
  private pusher: Pusher | null = null;
  private channels: { [key: string]: Channel } = {};
  private connected = false;
  private messageCallback: MessageCallback | null = null;
  private presenceCallback: PresenceCallback | null = null;
  private typingCallback: TypingCallback | null = null;

  // Initialize the Pusher connection
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.pusher = new Pusher('app-key', {
          wsHost: '127.0.0.1',
          wsPort: 6001,
          wssPort: 6001,
          cluster: 'mt1',
          forceTLS: false,
          enabledTransports: ['ws', 'wss'],
          authEndpoint: 'http://localhost:8000/broadcasting/auth',
          auth: {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        });

        this.pusher.connection.bind('connected', () => {
          this.connected = true;
          console.log('Pusher connected successfully');
          resolve();
        });

        this.pusher.connection.bind('error', (error: PusherError) => {
          console.error('Pusher connection error:', error);
          reject(error);
        });

        this.pusher.connection.bind('disconnected', () => {
          this.connected = false;
          console.log('Pusher disconnected');
        });
      } catch (error) {
        console.error('Error initializing Pusher:', error);
        reject(error);
      }
    });
  }

  // Disconnect from Pusher
  disconnect(): void {
    if (this.pusher) {
      Object.keys(this.channels).forEach(channelName => {
        this.channels[channelName].unsubscribe();
      });
      this.channels = {};
      this.pusher.disconnect();
      this.pusher = null;
      this.connected = false;
    }
  }

  // Join a specific chat room
  joinRoom(roomId: string): void {
    if (!this.pusher || !this.connected) return;
    
    const channelName = `presence-room.${roomId}`;
    if (this.channels[channelName]) return;

    const channel = this.pusher.subscribe(channelName);
    this.channels[channelName] = channel;

    channel.bind('pusher:subscription_succeeded', (members: Members) => {
      console.log('Successfully joined room:', roomId);
      console.log('Members currently in room:', members.count);
    });

    channel.bind('pusher:member_added', (member: PusherMember) => {
      console.log('Member joined:', member.info);
      this.emitPresenceChange(parseInt(member.id, 10), 'online');
    });

    channel.bind('pusher:member_removed', (member: PusherMember) => {
      console.log('Member left:', member.info);
      this.emitPresenceChange(parseInt(member.id, 10), 'offline');
    });

    channel.bind('new.message', (data: { message: Message }) => {
      if (this.messageCallback) {
        this.messageCallback(data.message);
      }
    });

    channel.bind('typing', (data: { user_id: string; is_typing: boolean }) => {
      if (this.typingCallback) {
        this.typingCallback({
          roomId,
          userId: data.user_id,
          isTyping: data.is_typing
        });
      }
    });
  }

  // Leave a specific chat room
  leaveRoom(roomId: string): void {
    if (!this.pusher || !this.connected) return;
    
    const channelName = `presence-room.${roomId}`;
    if (this.channels[channelName]) {
      this.channels[channelName].unsubscribe();
      delete this.channels[channelName];
    }
  }

  // Listen for new messages in a room
  onNewMessage(callback: (message: Message) => void): void {
    this.messageCallback = callback;
  }

  // Listen for user presence changes
  onPresenceChange(callback: (data: { userId: number; status: 'online' | 'offline' }) => void): void {
    this.presenceCallback = callback;
  }

  // Listen for typing status changes
  onTypingStatus(callback: TypingCallback): void {
    this.typingCallback = callback;
  }

  private emitPresenceChange(userId: number, status: 'online' | 'offline'): void {
    if (this.presenceCallback) {
      this.presenceCallback({ userId, status });
    }
  }

  /**
   * @internal
   * Internal method for emitting typing status updates to subscribers
   * This is currently not used directly but kept for future implementation
   */
  private emitTypingStatus(roomId: string, userId: string, isTyping: boolean): void {
    if (this.typingCallback) {
      this.typingCallback({ roomId, userId, isTyping });
    }
  }

  // Send a message to a room
  sendMessage(roomId: string, content: string): void {
    if (!this.connected) return;
    
    // Use the API to send the message, the WebSocket will handle the broadcast
    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        content,
        room_id: roomId
      })
    }).catch(error => {
      console.error('Error sending message:', error);
    });
  }

  // Send typing status
  sendTypingStatus(roomId: string, isTyping: boolean): void {
    const channel = this.channels[`presence-room.${roomId}`];
    if (!channel) return;

    channel.trigger('client-typing', {
      room_id: roomId,
      is_typing: isTyping
    });
  }

  // Check if socket is connected
  isConnected(): boolean {
    return this.connected;
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;