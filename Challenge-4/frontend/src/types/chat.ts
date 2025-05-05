export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
  pivot?: {
    room_id: string;
    user_id: number;
    is_admin: boolean;
    created_at?: string;
    updated_at?: string;
  };
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
  description: string;
  type: 'public' | 'private' | 'direct';
  created_by: number;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  creator?: User;
  members: User[];
  lastMessage?: Message;
  unreadCount?: number;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface RoomResponse {
  room: Room;
  message?: string;
}

export interface RoomsResponse {
  rooms: {
    current_page: number;
    data: Room[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export type OnlineStatus = {
  [userId: number]: boolean;
};