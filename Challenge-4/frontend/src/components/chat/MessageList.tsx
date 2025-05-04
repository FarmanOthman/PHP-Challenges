import { useRef, useEffect } from 'react';
import { Message } from '../../types/chat';
import { format } from 'date-fns';

interface MessageListProps {
  messages: Message[];
  currentUserId: number;
}

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages.reduce<{ [date: string]: Message[] }>((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="flex justify-center my-4">
            <div className="bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-600">
              {date === new Date().toDateString() ? 'Today' : date}
            </div>
          </div>

          <div className="space-y-3">
            {dateMessages.map((message) => {
              const isMine = message.userId === currentUserId;
              return (
                <div 
                  key={message.id} 
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                      isMine 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 rounded-bl-none shadow'
                    }`}
                  >
                    {!isMine && (
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        {message.user.name}
                      </p>
                    )}
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 text-right ${isMine ? 'text-indigo-100' : 'text-gray-500'}`}>
                      {format(new Date(message.createdAt), 'h:mm a')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {messages.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">No messages yet</p>
        </div>
      )}

      {/* Auto-scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;