export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  status?: string;
}

export interface Message {
  id: number;
  content: string;
  roomId: string;
  userId: number;
  user: User;
  createdAt: string;
  updatedAt: string;
  readBy?: number[];
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  isPrivate: boolean;
  owner_id: number;
  members: User[];
  admins: User[];
  availableUsers?: User[];  // Add this line
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  lastMessage?: Message;
  unreadCount?: number;
}

export interface OnlineStatus {
  [userId: number]: boolean;
}

export interface RoomMember {
  userId: number;
  roomId: string;
  isAdmin: boolean;
  joinedAt: string;
}

export type MessageEventPayload = {
  message: Message;
  room: Room;
}