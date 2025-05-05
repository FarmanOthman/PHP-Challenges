import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Updated import path
import { useChatStore } from '../store/chatStore';
import socketService from '../services/socket';
import ChatSidebar from '../components/chat/ChatSidebar';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import OnlineUsers from '../components/chat/OnlineUsers';
import { User } from '../types/chat'; // Import User type

const Chat = () => {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const { 
    rooms,
    activeRoomId, 
    messages, 
    onlineUsers,
    fetchRooms,
    addMessage,
    updateOnlineStatus
  } = useChatStore();
  
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Setup socket connection and listeners
  useEffect(() => {
    if (!token) return;

    const setupSocket = async () => {
      try {
        await socketService.connect(token);
        
        // Setup listeners
        socketService.onNewMessage((message) => {
          addMessage(message);
        });
        
        socketService.onPresenceChange((data) => {
          updateOnlineStatus(data.userId, data.status === 'online');
        });
      } catch (error) {
        console.error('Failed to connect to socket:', error);
      }
    };

    setupSocket();

    // Fetch rooms
    fetchRooms();

    // Cleanup
    return () => {
      socketService.disconnect();
    };
  }, [token, addMessage, updateOnlineStatus, fetchRooms]);

  // Show loading or not authenticated message
  if (authLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  // Get active room messages
  const activeRoomMessages = activeRoomId ? messages[activeRoomId] || [] : [];
  const activeRoom = rooms.find(room => room.id === activeRoomId);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Room list */}
      <div className="w-64 bg-white border-r">
        <ChatSidebar rooms={rooms} activeRoomId={activeRoomId} />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {activeRoomId ? (
          <>
            {/* Room header */}
            <div className="bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">{activeRoom?.name || 'Chat'}</h2>
              
              {/* Online status indicator - use is_private and members */}
              {activeRoom?.is_private && activeRoom.members.length === 2 && (
                <span className="flex items-center">
                  {activeRoom.members
                    .filter((u: User) => u.id !== user?.id) // Add User type
                    .map((otherUser: User) => ( // Add User type
                      <span key={otherUser.id} className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${onlineUsers[otherUser.id] ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {onlineUsers[otherUser.id] ? 'Online' : 'Offline'}
                      </span>
                    ))}
                </span>
              )}
            </div>
            
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <MessageList messages={activeRoomMessages} currentUserId={user?.id || 0} />
            </div>
            
            {/* Message input */}
            <div className="p-4 bg-white border-t">
              <MessageInput />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-xl">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Online users sidebar */}
      <div className="w-64 bg-white border-l hidden md:block">
        <OnlineUsers />
      </div>
    </div>
  );
};

export default Chat;