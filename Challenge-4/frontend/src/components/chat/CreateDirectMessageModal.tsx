import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  VStack,
  Box,
  Text,
  Avatar,
  Flex,
  InputGroup,
  InputLeftElement,
  useToast,
  useColorModeValue
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import type { User } from '../../types/chat';
import { useChatStore } from '../../store/chatStore';

interface CreateDirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableUsers: User[];
}

const CreateDirectMessageModal = ({ isOpen, onClose, availableUsers }: CreateDirectMessageModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { createRoom } = useChatStore();
  const toast = useToast();
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  const filteredUsers = searchQuery.trim()
    ? availableUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableUsers;

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleStartConversation = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      await createRoom({
        name: selectedUser.name, // Use recipient's name as room name
        description: '', // No description needed for DMs
        type: 'direct',
        is_private: true,
        members: [selectedUser.id]
      });

      toast({
        title: 'Conversation started',
        description: `You can now chat with ${selectedUser.name}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error starting conversation',
        description: error instanceof Error ? error.message : 'Failed to start conversation',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Direct Message</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <Box w="100%" maxH="300px" overflowY="auto">
              {filteredUsers.length > 0 ? (
                <VStack spacing={2} align="stretch">
                  {filteredUsers.map((user) => (
                    <Flex
                      key={user.id}
                      p={2}
                      cursor="pointer"
                      borderRadius="md"
                      bg={selectedUser?.id === user.id ? hoverBg : undefined}
                      _hover={{ bg: hoverBg }}
                      onClick={() => handleUserSelect(user)}
                    >
                      <Avatar size="sm" name={user.name} src={user.avatar} />
                      <Box ml={3}>
                        <Text fontWeight="medium">{user.name}</Text>
                        <Text fontSize="sm" color="gray.500">{user.email}</Text>
                      </Box>
                    </Flex>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.500" textAlign="center" py={4}>
                  {searchQuery ? "No users found" : "No users available"}
                </Text>
              )}
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            isDisabled={!selectedUser}
            onClick={handleStartConversation}
            isLoading={isLoading}
          >
            Start Conversation
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateDirectMessageModal;