import { Box, VStack, Text, Flex, Icon, Badge } from '@chakra-ui/react';
import { FaHashtag, FaLock, FaUserFriends } from 'react-icons/fa';
import type { Room } from '../../types/chat';

interface ChatSidebarProps {
  rooms: Room[];
  activeRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
}

const ChatSidebar = ({ rooms, activeRoomId, onRoomSelect }: ChatSidebarProps) => {
  const hoverBg = "gray.100";
  const activeBg = "blue.50";
  const activeColor = "blue.600";

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'private':
        return FaLock;
      case 'direct':
        return FaUserFriends;
      default:
        return FaHashtag;
    }
  };

  return (
    <VStack spacing={0} align="stretch" h="calc(100vh - 72px)" overflowY="auto">
      {rooms.map((room) => (
        <Box
          key={room.id}
          px={4}
          py={3}
          cursor="pointer"
          bg={activeRoomId === room.id ? activeBg : 'transparent'}
          color={activeRoomId === room.id ? activeColor : 'inherit'}
          _hover={{ bg: activeRoomId === room.id ? activeBg : hoverBg }}
          onClick={() => onRoomSelect(room.id)}
          transition="all 0.2s"
        >
          <Flex align="center" gap={2}>
            <Icon as={getRoomIcon(room.type)} />
            <Text fontWeight={activeRoomId === room.id ? 'semibold' : 'normal'} noOfLines={1}>
              {room.name}
            </Text>
            {room.unreadCount && room.unreadCount > 0 && (
              <Badge colorScheme="red" rounded="full" ml="auto">
                {room.unreadCount}
              </Badge>
            )}
          </Flex>
          {room.description && (
            <Text fontSize="xs" color="gray.500" ml={6} noOfLines={1}>
              {room.description}
            </Text>
          )}
        </Box>
      ))}
    </VStack>
  );
};

export default ChatSidebar;