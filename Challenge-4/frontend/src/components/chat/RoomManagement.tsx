import { useState, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { Room, User } from '../../types/chat';
import api from '../../services/api';

interface RoomManagementProps {
  room: Room;
  onClose: () => void;
}

const RoomManagement = ({ room, onClose }: RoomManagementProps) => {
  const { updateRoom, deleteRoom, addMembers, removeMembers } = useChatStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedTab, setSelectedTab] = useState<'details' | 'members'>('details');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  
  const [formData, setFormData] = useState({
    name: room.name,
    description: room.description,
    type: room.type,
    is_private: room.is_private
  });
  
  // Fetch users that can be added to the room
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        // Filter out users that are already members
        const memberIds = room.members.map(member => member.id);
        const filteredUsers = response.data.filter((user: User) => !memberIds.includes(user.id));
        setAvailableUsers(filteredUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError('Failed to fetch users');
      }
    };
    
    fetchUsers();
  }, [room.members]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSaveRoom = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await updateRoom(room.id, formData);
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update room';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteRoom = async () => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await deleteRoom(room.id);
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete room';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUserSelection = (userId: number) => {
    setSelectedUsers(prev => {
      const isSelected = prev.includes(userId);
      return isSelected
        ? prev.filter(id => id !== userId)
        : [...prev, userId];
    });
  };
  
  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await addMembers(room.id, selectedUsers);
      setSelectedUsers([]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to add members';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveMember = async (userId: number) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await removeMembers(room.id, [userId]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to remove member';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Check if current user is room creator or admin
  const isCreator = room.creator?.id === parseInt(localStorage.getItem('user_id') || '0');
  const isAdmin = room.members.some(
    member => 
      member.id === parseInt(localStorage.getItem('user_id') || '0') && 
      member.pivot?.is_admin
  );
  
  // Only creator or admins can edit room details
  const canEditRoom = isCreator || isAdmin;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-2xl font-bold">Room Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`px-6 py-3 ${selectedTab === 'details' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
            onClick={() => setSelectedTab('details')}
            aria-label="Show room details"
          >
            Room Details
          </button>
          <button
            className={`px-6 py-3 ${selectedTab === 'members' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
            onClick={() => setSelectedTab('members')}
            aria-label="Show members"
          >
            Members
          </button>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="m-6 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          {selectedTab === 'details' && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="edit-room-name">Room Name</label>
                <input
                  id="edit-room-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!canEditRoom}
                  className={`w-full px-3 py-2 border rounded-md ${!canEditRoom ? 'bg-gray-100' : ''}`}
                  placeholder="Room name"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="edit-room-description">Description</label>
                <textarea
                  id="edit-room-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!canEditRoom}
                  className={`w-full px-3 py-2 border rounded-md ${!canEditRoom ? 'bg-gray-100' : ''}`}
                  rows={3}
                  placeholder="Room description"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="edit-room-type">Room Type</label>
                <select
                  id="edit-room-type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  disabled={!canEditRoom}
                  className={`w-full px-3 py-2 border rounded-md ${!canEditRoom ? 'bg-gray-100' : ''}`}
                  aria-label="Room type"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="direct">Direct Message</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="flex items-center" htmlFor="edit-room-is-private">
                  <input
                    id="edit-room-is-private"
                    type="checkbox"
                    name="is_private"
                    checked={formData.is_private}
                    onChange={handleCheckboxChange}
                    disabled={!canEditRoom}
                    className="mr-2"
                  />
                  <span>Make room private (only visible to members)</span>
                </label>
              </div>
              
              <div className="flex justify-between">
                {isCreator && (
                  <button
                    onClick={handleDeleteRoom}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    aria-label="Delete room"
                  >
                    Delete Room
                  </button>
                )}
                
                {canEditRoom && (
                  <button
                    onClick={handleSaveRoom}
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    aria-label="Save room changes"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                )}
              </div>
            </div>
          )}
          
          {selectedTab === 'members' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Current Members</h3>
              <div className="mb-6 max-h-48 overflow-y-auto border rounded-md">
                {room.members.length === 0 ? (
                  <p className="p-3 text-gray-500">No members in this room</p>
                ) : (
                  <ul className="divide-y" role="list" aria-label="Room members">
                    {room.members.map(member => (
                      <li key={member.id} className="flex justify-between items-center p-3">
                        <div>
                          <span>{member.name}</span>
                          {member.id === room.created_by && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Creator</span>
                          )}
                          {member.pivot?.is_admin && member.id !== room.created_by && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Admin</span>
                          )}
                        </div>
                        
                        {canEditRoom && member.id !== room.created_by && member.id !== parseInt(localStorage.getItem('user_id') || '0') && (
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-red-600 hover:text-red-800"
                            aria-label={`Remove ${member.name} from room`}
                          >
                            Remove
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {canEditRoom && (
                <>
                  <h3 className="text-lg font-semibold mb-3">Add New Members</h3>
                  {availableUsers.length > 0 ? (
                    <>
                      <div className="mb-4 max-h-48 overflow-y-auto border rounded-md p-2">
                        {availableUsers.map(user => (
                          <label key={user.id} className="flex items-center py-2 px-3 hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => handleUserSelection(user.id)}
                              className="mr-2"
                              aria-label={`Select ${user.name} to add to room`}
                            />
                            <span>{user.name}</span>
                          </label>
                        ))}
                      </div>
                      
                      <button
                        onClick={handleAddMembers}
                        disabled={selectedUsers.length === 0 || loading}
                        className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                        aria-label="Add selected members to room"
                      >
                        {loading ? 'Adding...' : `Add Selected Members (${selectedUsers.length})`}
                      </button>
                    </>
                  ) : (
                    <p className="text-gray-500">No users available to add</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomManagement;