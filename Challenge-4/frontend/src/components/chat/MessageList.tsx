import { VStack, Box, Text, Avatar, Flex, useColorModeValue } from '@chakra-ui/react';
import type { Message } from '../../types/chat';
import { useChatStore } from '../../store/chatStore';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: Message[];
  currentUserId: number;
}

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const { typingUsers, activeRoomId } = useChatStore();
  const bubbleBg = useColorModeValue('gray.100', 'gray.700');
  const myBubbleBg = useColorModeValue('blue.500', 'blue.400');
  const myTextColor = 'white';

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Get current typing users for this room
  const currentTypingUsers = activeRoomId ? typingUsers[activeRoomId] || [] : [];

  return (
    <VStack spacing={4} align="stretch">
      {messages.map((message, index) => {
        const isMyMessage = message.userId === currentUserId;
        const showAvatar = index === 0 || messages[index - 1]?.userId !== message.userId;

        return (
          <Flex
            key={message.id}
            justify={isMyMessage ? 'flex-end' : 'flex-start'}
            align="flex-end"
            gap={2}
          >
            {!isMyMessage && showAvatar && (
              <Avatar 
                size="sm" 
                name={message.user?.name || 'User'} 
                src={message.user?.avatar} 
              />
            )}
            {!isMyMessage && !showAvatar && <Box w="32px" />}
            <Box maxW="70%">
              {showAvatar && (
                <Flex 
                  gap={2} 
                  align="center" 
                  mb={1}
                  justify={isMyMessage ? 'flex-end' : 'flex-start'}
                >
                  <Text fontSize="sm" fontWeight="bold">
                    {message.user?.name || 'User'}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {formatTime(message.createdAt)}
                  </Text>
                </Flex>
              )}
              <Box
                bg={isMyMessage ? myBubbleBg : bubbleBg}
                color={isMyMessage ? myTextColor : 'inherit'}
                px={4}
                py={2}
                borderRadius="lg"
                borderTopLeftRadius={!isMyMessage && !showAvatar ? 'md' : 'lg'}
                borderTopRightRadius={isMyMessage && !showAvatar ? 'md' : 'lg'}
              >
                <Text>{message.content}</Text>
              </Box>
            </Box>
            {isMyMessage && showAvatar && (
              <Avatar 
                size="sm" 
                name={message.user?.name || 'User'} 
                src={message.user?.avatar} 
              />
            )}
            {isMyMessage && !showAvatar && <Box w="32px" />}
          </Flex>
        );
      })}
      
      {/* Show typing indicators */}
      {currentTypingUsers.length > 0 && (
        <Box pl={4}>
          {currentTypingUsers.map(userId => (
            <TypingIndicator 
              key={userId} 
              username={messages.find(m => m.userId.toString() === userId)?.user?.name || 'User'} 
            />
          ))}
        </Box>
      )}
    </VStack>
  );
};

export default MessageList;