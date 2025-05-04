import { useEffect, useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { User } from '../../types/chat';

const OnlineUsers = () => {
  const { onlineUsers } = useChatStore();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data.filter((u: User) => u.id !== currentUser?.id));
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser?.id]);

  if (loading) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Online Users</h3>
        <div className="text-sm text-gray-500">Loading users...</div>
      </div>
    );
  }

  // Sort users by online status
  const sortedUsers = [...users].sort((a, b) => {
    const aOnline = onlineUsers[a.id] || false;
    const bOnline = onlineUsers[b.id] || false;
    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;
    return 0;
  });

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Users</h3>
      
      <ul className="space-y-2">
        {sortedUsers.map((user) => (
          <li key={user.id} className="flex items-center">
            <span 
              className={`w-3 h-3 rounded-full mr-2 ${
                onlineUsers[user.id] ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
            <span className="text-sm">
              {user.name} {onlineUsers[user.id] && <span className="text-xs text-gray-500">(online)</span>}
            </span>
          </li>
        ))}
      </ul>

      {users.length === 0 && (
        <div className="text-sm text-gray-500">No other users</div>
      )}
    </div>
  );
};

export default OnlineUsers;