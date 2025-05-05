import { useEffect, useState } from 'react';
import { useChatStore } from '../store/chatStore';
import ChatSidebar from './chat/ChatSidebar';
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';
import OnlineUsers from './chat/OnlineUsers';
import RoomManagement from './chat/RoomManagement';
import api from '../services/api';
import { User } from '../types/chat';

const ChatApp = () => {
  const { 
    rooms, 
    activeRoomId, 
    messages, 
    fetchRooms
  } = useChatStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showRoomManagement, setShowRoomManagement] = useState(false);
  const [roomFormData, setRoomFormData] = useState({
    name: '',
    description: '',
    type: 'public',
    isPrivate: false,
    members: [] as number[]
  });
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  
  // Get current user ID from localStorage for message display
  const currentUserId = parseInt(localStorage.getItem('user_id') || '0');

  // Fetch rooms when component mounts
  useEffect(() => {
    fetchRooms();
    fetchAvailableUsers();
  }, [fetchRooms]);

  // Fetch users that can be added to rooms
  const fetchAvailableUsers = async () => {
    try {
      const response = await api.get('/users');
      setAvailableUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to fetch users');
    }
  };

  // Create a new room
  const createRoom = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await api.post('/rooms', {
        name: roomFormData.name,
        description: roomFormData.description,
        type: roomFormData.type,
        is_private: roomFormData.isPrivate,
        members: roomFormData.members
      });
      
      // Refresh rooms list
      await fetchRooms();
      
      // Reset form and close modal
      setRoomFormData({
        name: '',
        description: '',
        type: 'public',
        isPrivate: false,
        members: []
      });
      setShowCreateRoom(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Failed to create room';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRoomFormData({
      ...roomFormData,
      [name]: value
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setRoomFormData({
      ...roomFormData,
      [name]: checked
    });
  };

  // Handle member selection
  const handleMemberSelection = (userId: number) => {
    setRoomFormData(prev => {
      const isSelected = prev.members.includes(userId);
      return {
        ...prev,
        members: isSelected
          ? prev.members.filter(id => id !== userId)
          : [...prev.members, userId]
      };
    });
  };

  // Get active room messages
  const activeRoomMessages = activeRoomId ? messages[activeRoomId] || [] : [];
  
  // Get active room data
  const activeRoom = rooms.find(room => room.id === activeRoomId);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat sidebar with room list */}
      <div className="w-1/4 bg-white border-r">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Rooms</h2>
          <button 
            onClick={() => setShowCreateRoom(true)}
            className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700"
            aria-label="Create new room"
          >
            New Room
          </button>
        </div>
        <ChatSidebar rooms={rooms} activeRoomId={activeRoomId} />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {activeRoomId && activeRoom ? (
          <>
            {/* Room header */}
            <div className="bg-white p-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{activeRoom.name}</h2>
                <p className="text-sm text-gray-500">
                  {activeRoom.type.charAt(0).toUpperCase() + activeRoom.type.slice(1)} room • 
                  {activeRoom.members.length} members
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowRoomManagement(true)}
                  className="text-indigo-600 hover:text-indigo-800 px-3 py-1"
                  aria-label="Room Settings"
                >
                  Room Settings
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <MessageList messages={activeRoomMessages} currentUserId={currentUserId} />
            </div>

            {/* Message input */}
            <div className="bg-white border-t p-4">
              <MessageInput />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-xl text-gray-500">Select a room to start chatting</p>
          </div>
        )}
      </div>

      {/* Online users sidebar */}
      <div className="w-1/5 bg-white border-l">
        <OnlineUsers />
      </div>

      {/* Create room modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Room</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={(e) => { e.preventDefault(); createRoom(); }}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="room-name">Room Name</label>
                <input
                  id="room-name"
                  type="text"
                  name="name"
                  value={roomFormData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter room name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="room-description">Description</label>
                <textarea
                  id="room-description"
                  name="description"
                  value={roomFormData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Enter room description"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="room-type">Room Type</label>
                <select
                  id="room-type"
                  name="type"
                  value={roomFormData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  aria-label="Select room type"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="direct">Direct Message</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    id="room-private"
                    type="checkbox"
                    name="isPrivate"
                    checked={roomFormData.isPrivate}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <span>Make room private (only visible to members)</span>
                </label>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Add Members</label>
                <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                  {availableUsers.map(user => (
                    <label key={user.id} className="flex items-center py-1">
                      <input
                        type="checkbox"
                        checked={roomFormData.members.includes(user.id)}
                        onChange={() => handleMemberSelection(user.id)}
                        className="mr-2"
                        aria-label={`Add ${user.name} to room`}
                      />
                      <span>{user.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateRoom(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Room management modal */}
      {showRoomManagement && activeRoom && (
        <RoomManagement 
          room={activeRoom} 
          onClose={() => setShowRoomManagement(false)} 
        />
      )}
    </div>
  );
};

export default ChatApp;