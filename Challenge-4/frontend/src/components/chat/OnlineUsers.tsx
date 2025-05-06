import {
  VStack,
  Text,
  Box,
  Avatar,
  AvatarBadge,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import type { User } from '../../types/chat';
import { useChatStore } from '../../store/chatStore';
import { useMemo } from 'react';

const OnlineUsers = () => {
  const { onlineUsers, availableUsers } = useChatStore();
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');

  // Transform onlineUsers object into an array of online users
  const onlineUsersList = useMemo(() => {
    // Filter available users by those who are online (have a truthy value in onlineUsers)
    return availableUsers.filter(user => onlineUsers[user.id] === true);
  }, [onlineUsers, availableUsers]);

  return (
    <Box>
      <Box p={4} bg={headerBg} borderBottom="1px" borderColor="inherit">
        <Text fontSize="lg" fontWeight="bold">Online Users</Text>
        <Text fontSize="sm" color="gray.500">{onlineUsersList.length} online</Text>
      </Box>
      <VStack spacing={0} align="stretch" h="calc(100vh - 85px)" overflowY="auto">
        {onlineUsersList.map((user: User) => (
          <Flex
            key={user.id}
            p={3}
            alignItems="center"
            gap={3}
            cursor="pointer"
            _hover={{ bg: hoverBg }}
            transition="background 0.2s"
          >
            <Avatar size="sm" name={user.name} src={user.avatar}>
              <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
            <Box>
              <Text fontSize="sm" fontWeight="medium">
                {user.name}
              </Text>
              {user.status && (
                <Text fontSize="xs" color="gray.500">
                  {user.status}
                </Text>
              )}
            </Box>
          </Flex>
        ))}
        {onlineUsersList.length === 0 && (
          <Box p={4} textAlign="center">
            <Text color="gray.500">No users online</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default OnlineUsers;