import { useEffect, useState, useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import ChatSidebar from './chat/ChatSidebar';
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';
import OnlineUsers from './chat/OnlineUsers';
import RoomManagement from './chat/RoomManagement';
import api from '../services/api';
import type { User } from '../types/chat';
import {
  Box,
  Button,
  Flex,
  Input,
  Textarea,
  Stack,
  Text,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Checkbox,
  VStack,
  useToast,
  useColorModeValue
} from '@chakra-ui/react';
import { AddIcon, SettingsIcon } from '@chakra-ui/icons';
import { AnimatePresence, motion } from 'framer-motion';
import ChatSkeleton from './chat/ChatSkeleton';

// Create a motion component with Chakra UI
const MotionBox = motion(Box);

const ChatApp = () => {
  const {
    rooms,
    activeRoomId,
    messages,
    fetchRooms,
    setActiveRoom
  } = useChatStore();

  const [loading, setLoading] = useState(false);
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
  const [messagesLoading, setMessagesLoading] = useState(false);

  const toast = useToast();
  
  // Use Chakra's color mode values for consistent theming
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const messageListBgColor = useColorModeValue("gray.50", "gray.900");
  const mainBgColor = useColorModeValue("gray.50", "gray.900");

  const currentUserId = parseInt(localStorage.getItem('user_id') || '0');

  const fetchAvailableUsers = useCallback(async () => {
    try {
      const response = await api.get('/users');
      setAvailableUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: 'Error fetching users',
        description: 'Could not load the list of users.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchRooms();
    fetchAvailableUsers();
  }, [fetchRooms, fetchAvailableUsers]);

  const createRoom = async () => {
    if (!roomFormData.name.trim()) {
      toast({
        title: 'Room name required',
        description: 'Please enter a name for the room.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setLoading(true);

    try {
      await api.post('/rooms', {
        name: roomFormData.name,
        description: roomFormData.description,
        type: roomFormData.type,
        is_private: roomFormData.isPrivate,
        members: roomFormData.members
      });

      await fetchRooms();
      setRoomFormData({
        name: '',
        description: '',
        type: 'public',
        isPrivate: false,
        members: []
      });
      setShowCreateRoom(false);

      toast({
        title: 'Room created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create room';
      toast({
        title: 'Error creating room',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRoomFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setRoomFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

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

  const handleRoomSelect = (roomId: string) => {
    setMessagesLoading(true);
    setActiveRoom(roomId);
    setTimeout(() => setMessagesLoading(false), 500);
  };

  const activeRoomMessages = activeRoomId ? messages[activeRoomId] || [] : [];
  const activeRoom = rooms.find(room => room.id === activeRoomId);

  return (
    <Flex h="100vh" bg={mainBgColor}>
      {/* Chat sidebar */}
      <Box 
        w={{ base: "70px", md: "250px", lg: "300px" }} 
        bg={bgColor} 
        borderRight="1px" 
        borderColor={borderColor}
        overflow="hidden"
      >
        <Flex p={4} justify="space-between" align="center" borderBottom="1px" borderColor={borderColor}>
          <Text fontSize="xl" fontWeight="bold" display={{ base: "none", md: "block" }}>Rooms</Text>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => setShowCreateRoom(true)}
            leftIcon={<AddIcon />}
          >
            <Text display={{ base: "none", md: "block" }}>New Room</Text>
          </Button>
        </Flex>
        {loading ? (
          <ChatSkeleton type="rooms" />
        ) : (
          <ChatSidebar 
            rooms={rooms} 
            activeRoomId={activeRoomId} 
            onRoomSelect={handleRoomSelect}
          />
        )}
      </Box>

      {/* Main chat area */}
      <Flex flex={1} direction="column">
        <AnimatePresence mode="wait">
          {activeRoomId && activeRoom ? (
            <MotionBox
              key={activeRoomId}
              flex={1}
              display="flex"
              flexDirection="column"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Flex 
                px={6} 
                py={4} 
                bg={bgColor} 
                borderBottom="1px" 
                borderColor={borderColor} 
                justify="space-between" 
                align="center"
              >
                <Box>
                  <Flex align="center" gap={2}>
                    <Text fontSize="xl" fontWeight="bold">{activeRoom.name}</Text>
                    <Badge colorScheme={activeRoom.type === 'public' ? 'green' : activeRoom.type === 'direct' ? 'blue' : 'purple'}>
                      {activeRoom.type}
                    </Badge>
                  </Flex>
                  <Text fontSize="sm" color="gray.500">
                    {activeRoom.members.length} members
                  </Text>
                </Box>
                <Button
                  variant="ghost"
                  onClick={() => setShowRoomManagement(true)}
                  leftIcon={<SettingsIcon />}
                >
                  <Text display={{ base: "none", md: "block" }}>Settings</Text>
                </Button>
              </Flex>

              <Box flex={1} overflowY="auto" p={4} bg={messageListBgColor}>
                {messagesLoading ? (
                  <ChatSkeleton type="messages" />
                ) : (
                  <MessageList messages={activeRoomMessages} currentUserId={currentUserId} />
                )}
              </Box>

              <Box p={4} bg={bgColor} borderTop="1px" borderColor={borderColor}>
                <MessageInput roomId={activeRoomId} />
              </Box>
            </MotionBox>
          ) : (
            <MotionBox
              flex={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              gap={4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Text fontSize="xl" color="gray.500">Select a room to start chatting</Text>
              <Button
                colorScheme="blue"
                onClick={() => setShowCreateRoom(true)}
                leftIcon={<AddIcon />}
              >
                Create a Room
              </Button>
            </MotionBox>
          )}
        </AnimatePresence>
      </Flex>

      {/* Online users sidebar */}
      <Box 
        w={{ base: "70px", md: "200px", lg: "250px" }} 
        bg={bgColor} 
        borderLeft="1px" 
        borderColor={borderColor}
        display={{ base: "none", lg: "block" }}
      >
        <OnlineUsers />
      </Box>

      {/* Create room modal */}
      <Modal isOpen={showCreateRoom} onClose={() => setShowCreateRoom(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Room Name</FormLabel>
                <Input
                  name="name"
                  value={roomFormData.name}
                  onChange={handleInputChange}
                  placeholder="Enter room name"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={roomFormData.description}
                  onChange={handleInputChange}
                  placeholder="Enter room description"
                  resize="vertical"
                />
              </FormControl>

              <FormControl>
                <FormLabel id="room-type-label" htmlFor="room-type-select">Room Type</FormLabel>
                <Select
                  id="room-type-select"
                  name="type"
                  value={roomFormData.type}
                  onChange={handleInputChange}
                  aria-label="Room type selection"
                  aria-labelledby="room-type-label"
                  title="Select room type"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="direct">Direct Message</option>
                </Select>
              </FormControl>

              <FormControl>
                <Checkbox
                  name="isPrivate"
                  isChecked={roomFormData.isPrivate}
                  onChange={handleCheckboxChange}
                >
                  Make room private (only visible to members)
                </Checkbox>
              </FormControl>

              <FormControl>
                <FormLabel>Add Members</FormLabel>
                <Box 
                  maxH="200px" 
                  overflowY="auto" 
                  borderWidth={1} 
                  borderRadius="md" 
                  p={2}
                  borderColor={borderColor}
                >
                  <Stack spacing={2} direction="column">
                    {availableUsers.length > 0 ? (
                      availableUsers.map(user => (
                        <Checkbox
                          key={user.id}
                          isChecked={roomFormData.members.includes(user.id)}
                          onChange={() => handleMemberSelection(user.id)}
                        >
                          {user.name}
                        </Checkbox>
                      ))
                    ) : (
                      <Text fontSize="sm" color="gray.500">No users available</Text>
                    )}
                  </Stack>
                </Box>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setShowCreateRoom(false)}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={createRoom}
              isLoading={loading}
              loadingText="Creating..."
            >
              Create Room
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Room management modal */}
      {showRoomManagement && activeRoom && (
        <RoomManagement 
          room={activeRoom} 
          onClose={() => setShowRoomManagement(false)} 
        />
      )}
    </Flex>
  );
};

export default ChatApp;