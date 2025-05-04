export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface Message {
  id: number;
  content: string;
  roomId: string;
  userId: number;
  user: User;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  isPrivate: boolean;
  users: User[];
  lastMessage?: Message;
  unreadCount?: number;
}

export type OnlineStatus = {
  [userId: number]: boolean;
};