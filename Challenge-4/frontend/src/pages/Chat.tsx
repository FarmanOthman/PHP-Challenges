import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Fixed import path
import { useChatStore } from '../store/chatStore';
import socketService from '../services/socket';
import ChatSidebar from '../components/chat/ChatSidebar';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import OnlineUsers from '../components/chat/OnlineUsers';

const Chat = () => {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const { 
    rooms,
    activeRoomId, 
    messages,
    loading,
    error,
    fetchRooms,
    setActiveRoom,
    addMessage,
    updateOnlineStatus
  } = useChatStore();
  
  const [socketInitialized, setSocketInitialized] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Setup socket connection and fetch initial data
  useEffect(() => {
    if (!token || !user || socketInitialized) return;

    const initializeChat = async () => {
      try {
        // Initialize socket connection
        await socketService.connect(token);
        setSocketInitialized(true);

        // Setup message listener
        socketService.onNewMessage((message) => {
          addMessage(message);
        });

        // Setup presence listener
        socketService.onPresenceChange(({ userId, status }) => {
          updateOnlineStatus(userId, status === 'online');
        });

        // Fetch rooms
        await fetchRooms();

      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    };

    initializeChat();

    // Cleanup function
    return () => {
      if (socketInitialized) {
        socketService.disconnect();
        setSocketInitialized(false);
      }
    };
  }, [token, user, socketInitialized, addMessage, updateOnlineStatus, fetchRooms]);

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  // Show not authenticated message
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  // Get active room messages
  const activeRoomMessages = activeRoomId ? messages[activeRoomId] || [] : [];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat sidebar */}
      <div className="w-64 bg-white border-r">
        <ChatSidebar 
          rooms={rooms}
          activeRoomId={activeRoomId}
          onRoomSelect={setActiveRoom}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {activeRoomId ? (
          <>
            {/* Room header */}
            <div className="bg-white p-4 border-b">
              <h2 className="text-xl font-semibold">
                {rooms.find(room => room.id === activeRoomId)?.name || 'Chat'}
              </h2>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4">
              <MessageList 
                messages={activeRoomMessages}
                currentUserId={user?.id || 0}
              />
            </div>
            
            {/* Message input */}
            <div className="p-4 bg-white border-t">
              <MessageInput />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a room to start chatting
          </div>
        )}
      </div>

      {/* Online users sidebar */}
      <div className="w-48 bg-white border-l">
        <OnlineUsers />
      </div>
    </div>
  );
};

export default Chat;