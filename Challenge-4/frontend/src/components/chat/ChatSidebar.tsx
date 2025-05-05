import { Room } from '../../types/chat';

interface ChatSidebarProps {
  rooms: Room[];
  activeRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
}

const ChatSidebar = ({ rooms, activeRoomId, onRoomSelect }: ChatSidebarProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Chats</h2>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {rooms.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No chats available
          </div>
        ) : (
          <ul>
            {rooms.map((room) => (
              <li 
                key={room.id}
                onClick={() => onRoomSelect(room.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                  activeRoomId === room.id ? 'bg-indigo-50' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{room.name}</h3>
                    {room.lastMessage && (
                      <p className="text-sm text-gray-500 truncate">
                        {room.lastMessage.content}
                      </p>
                    )}
                  </div>
                  
                  {room.unreadCount && room.unreadCount > 0 && (
                    <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-1">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;