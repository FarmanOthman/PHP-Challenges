import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useChatStore } from '../store/chatStore';
import socketService from '../services/socket';
import ChatSidebar from '../components/chat/ChatSidebar';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import OnlineUsers from '../components/chat/OnlineUsers';
import CreateRoomModal from '../components/chat/CreateRoomModal';
import CreateDirectMessageModal from '../components/chat/CreateDirectMessageModal';
import api from '../services/api';
import type { User } from '../types/chat';  // Changed to type-only import
import { motion } from 'framer-motion';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Avatar,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  useColorModeValue,
  Spinner,
  Tooltip,
  VStack,
  HStack,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
  useToast,
  chakra
} from "@chakra-ui/react";
import {
  AddIcon,
  HamburgerIcon,
  SearchIcon,
  SettingsIcon,
  ChevronDownIcon,
  BellIcon,
  ChatIcon
} from "@chakra-ui/icons";
import { FaUsers, FaUserFriends, FaUserCircle, FaSignOutAlt, FaCog } from 'react-icons/fa';

// Create motion components with Chakra UI
const MotionFlex = chakra(motion.div, {
  shouldForwardProp: (prop) => !['direction', 'variants', 'initial', 'animate', 'exit'].includes(prop),
  baseStyle: {
    display: "flex",
  },
});

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => !['variants', 'initial', 'animate', 'exit'].includes(prop),
});

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Chat = () => {
  const { user, token, isAuthenticated, loading: authLoading, logout } = useAuth();
  const { 
    rooms,
    activeRoomId, 
    messages,
    loading,
    error,
    fetchRooms,
    setActiveRoom,
    addMessage,
    updateOnlineStatus,
    setTypingStatus
  } = useChatStore();

  const [socketInitialized, setSocketInitialized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRooms, setFilteredRooms] = useState(rooms);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  
  const navigate = useNavigate();
  const toast = useToast();
  
  const { 
    isOpen: isMobileSidebarOpen, 
    onOpen: onMobileSidebarOpen, 
    onClose: onMobileSidebarClose 
  } = useDisclosure();
  
  const { 
    isOpen: isOnlineUsersOpen, 
    onOpen: onOnlineUsersOpen, 
    onClose: onOnlineUsersClose 
  } = useDisclosure();
  
  const {
    isOpen: isCreateRoomOpen,
    onOpen: onCreateRoomOpen,
    onClose: onCreateRoomClose
  } = useDisclosure();

  const {
    isOpen: isDirectMessageOpen,
    onOpen: onDirectMessageOpen,
    onClose: onDirectMessageClose
  } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const chatBgColor = useColorModeValue('gray.50', 'gray.900');

  const handleSearchNavigate = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  // Fetch available users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setAvailableUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast({
          title: 'Error fetching users',
          description: 'Could not load the list of users',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated, toast]);

  // Filter rooms based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRooms(rooms);
      return;
    }
    
    const filtered = rooms.filter(room => 
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.description && room.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setFilteredRooms(filtered);
  }, [searchQuery, rooms]);

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

        // Setup typing listener
        socketService.onTypingStatus(({ roomId, userId, isTyping }) => {
          setTypingStatus(roomId, userId, isTyping);
        });

        // Fetch rooms
        await fetchRooms();

      } catch (error) {
        console.error('Failed to initialize chat:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to chat server. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
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
  }, [token, user, socketInitialized, addMessage, updateOnlineStatus, setTypingStatus, fetchRooms, toast]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get active room messages
  const activeRoomMessages = activeRoomId ? messages[activeRoomId] || [] : [];
  const activeRoom = rooms.find(room => room.id === activeRoomId);

  // Loading state with Chakra UI spinner
  if (authLoading || loading) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Flex direction="column" align="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
            mb={4}
          />
          <Text>Loading Chat...</Text>
        </Flex>
      </Flex>
    );
  }

  // Error state
  if (error) {
    return (
      <Flex height="100vh" align="center" justify="center" p={6}>
        <Box textAlign="center" maxW="500px">
          <Heading size="lg" color="red.500" mb={4}>Something went wrong</Heading>
          <Text mb={6}>{error}</Text>
          <Button colorScheme="blue" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Desktop Sidebar */}
      <Box
        w={{ base: "full", md: "300px" }}
        bg={bgColor}
        borderRight="1px"
        borderColor={borderColor}
        display={{ base: "none", md: "block" }}
        overflow="hidden"
      >
        <VStack h="full">
          {/* Sidebar Header */}
          <Flex 
            w="full" 
            p={4} 
            align="center" 
            justify="space-between" 
            borderBottomWidth="1px" 
            borderColor={borderColor}
          >
            <Heading size="md">Chats</Heading>
            <Flex gap={2}>
              <IconButton
                aria-label="Search messages"
                icon={<SearchIcon />}
                size="sm"
                variant="ghost"
                onClick={handleSearchNavigate}
              />
              <Tooltip label="New Direct Message">
                <IconButton
                  aria-label="New direct message"
                  icon={<FaUserFriends />}
                  size="sm"
                  onClick={onDirectMessageOpen}
                />
              </Tooltip>
              <Tooltip label="New Room">
                <IconButton
                  aria-label="Create new room"
                  icon={<AddIcon />}
                  size="sm"
                  colorScheme="blue"
                  onClick={onCreateRoomOpen}
                />
              </Tooltip>
            </Flex>
          </Flex>
          
          {/* Search Box */}
          <Box px={4} pt={2} pb={2} w="full">
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search chats..."
                borderRadius="full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <InputRightElement>
                  <IconButton
                    aria-label="Clear search"
                    icon={<CloseIcon />}
                    size="xs"
                    variant="ghost"
                    onClick={() => setSearchQuery('')}
                  />
                </InputRightElement>
              )}
            </InputGroup>
          </Box>
          
          {/* Rooms List */}
          <Box w="full" flex="1" overflowY="auto">
            <ChatSidebar
              rooms={filteredRooms}
              activeRoomId={activeRoomId}
              onRoomSelect={setActiveRoom}
            />
          </Box>
          
          {/* User Profile */}
          <Box
            w="full"
            p={3}
            borderTopWidth="1px"
            borderColor={borderColor}
          >
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                width="full"
                justifyContent="flex-start"
                rightIcon={<ChevronDownIcon />}
                _hover={{ bg: hoverBgColor }}
              >
                <HStack spacing={3}>
                  <Avatar 
                    size="sm" 
                    name={user?.name || 'User'} 
                    src={user?.avatar || undefined}
                  />
                  <VStack spacing={0} alignItems="flex-start">
                    <Text fontWeight="medium" fontSize="sm" noOfLines={1}>
                      {user?.name || 'User'}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Online
                    </Text>
                  </VStack>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FaUserCircle />}>My Profile</MenuItem>
                <MenuItem icon={<FaCog />}>Settings</MenuItem>
                <MenuItem icon={<BellIcon />}>Notifications</MenuItem>
                <Divider />
                <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </VStack>
      </Box>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        isOpen={isMobileSidebarOpen}
        placement="left"
        onClose={onMobileSidebarClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Chats</DrawerHeader>
          <DrawerBody p={0}>
            {/* Search Box */}
            <Box p={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Box>
            
            {/* Mobile Rooms List */}
            <Box>
              <ChatSidebar
                rooms={filteredRooms}
                activeRoomId={activeRoomId}
                onRoomSelect={(id) => {
                  setActiveRoom(id);
                  onMobileSidebarClose();
                }}
              />
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Chat Area */}
      <Flex flex={1} direction="column" overflow="hidden">
        {/* Chat Header */}
        <Flex 
          bg={bgColor} 
          p={4} 
          align="center" 
          justify="space-between" 
          borderBottom="1px" 
          borderColor={borderColor}
        >
          <HStack>
            <IconButton
              aria-label="Menu"
              icon={<HamburgerIcon />}
              display={{ base: "flex", md: "none" }}
              variant="ghost"
              onClick={onMobileSidebarOpen}
            />
            
            {activeRoom ? (
              <HStack spacing={2}>
                {activeRoom.type === 'direct' ? (
                  <Avatar size="sm" name={activeRoom.name} src={activeRoom.members?.[0]?.avatar} />
                ) : (
                  <Flex
                    bg={activeRoom.type === 'private' ? 'red.100' : 'blue.100'}
                    color={activeRoom.type === 'private' ? 'red.500' : 'blue.500'}
                    w="32px"
                    h="32px"
                    borderRadius="md"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ChatIcon />
                  </Flex>
                )}
                <Box>
                  <Heading size="md">
                    {activeRoom.name}
                    <Badge ml={2} colorScheme={activeRoom.type === 'private' ? 'red' : 'blue'}>
                      {activeRoom.type}
                    </Badge>
                  </Heading>
                  {activeRoom.members?.length > 0 && (
                    <Text fontSize="xs" color="gray.500">
                      {activeRoom.members.length} members
                    </Text>
                  )}
                </Box>
              </HStack>
            ) : (
              <Heading size="md">Chat</Heading>
            )}
          </HStack>
          
          <HStack>
            {activeRoom && (
              <Tooltip label="Room settings">
                <IconButton
                  aria-label="Room settings"
                  icon={<SettingsIcon />}
                  variant="ghost"
                />
              </Tooltip>
            )}
            <Tooltip label="Show online users">
              <IconButton
                aria-label="Online users"
                icon={<FaUsers />}
                variant="ghost"
                display={{ base: "flex", lg: "none" }}
                onClick={onOnlineUsersOpen}
              />
            </Tooltip>
          </HStack>
        </Flex>

        {/* Chat Messages Area */}
        <MotionFlex
          flexDirection="column"
          flex={1}
          bg={chatBgColor}
          overflow="hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {activeRoomId ? (
            <Flex direction="column" h="full">
              {/* Messages */}
              <Box flex={1} overflowY="auto" p={4}>
                <MessageList
                  messages={activeRoomMessages}
                  currentUserId={user?.id || 0}
                />
              </Box>
              
              {/* Message Input */}
              <Box p={4} bg={bgColor} borderTop="1px" borderColor={borderColor}>
                <MessageInput roomId={activeRoomId} />
              </Box>
            </Flex>
          ) : (
            <Flex h="full" align="center" justify="center" p={6} direction="column">
              <MotionBox
                mb={8}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                <Flex
                  w="80px"
                  h="80px"
                  borderRadius="full"
                  bg="blue.50"
                  color="blue.500"
                  justify="center"
                  align="center"
                  fontSize="3xl"
                  mb={4}
                  mx="auto"
                >
                  <ChatIcon boxSize={10} />
                </Flex>
              </MotionBox>
              
              <Heading size="lg" textAlign="center" mb={3}>
                Welcome to Chat App
              </Heading>
              <Text textAlign="center" color="gray.500" mb={6} maxW="md">
                Select a chat room from the sidebar or create a new one to start messaging.
              </Text>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="blue"
                onClick={onCreateRoomOpen}
                size="lg"
              >
                Create New Room
              </Button>
            </Flex>
          )}
        </MotionFlex>
      </Flex>

      {/* Online Users Sidebar - Desktop */}
      <Box
        w="250px"
        bg={bgColor}
        borderLeft="1px"
        borderColor={borderColor}
        display={{ base: "none", lg: "block" }}
        overflow="hidden"
      >
        <OnlineUsers />
      </Box>

      {/* Online Users Drawer - Mobile */}
      <Drawer
        isOpen={isOnlineUsersOpen}
        placement="right"
        onClose={onOnlineUsersClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Online Users</DrawerHeader>
          <DrawerBody p={0}>
            <OnlineUsers />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={isCreateRoomOpen}
        onClose={onCreateRoomClose}
        availableUsers={availableUsers}
      />

      {/* Create Direct Message Modal */}
      <CreateDirectMessageModal
        isOpen={isDirectMessageOpen}
        onClose={onDirectMessageClose}
        availableUsers={availableUsers}
      />
    </Flex>
  );
};

// Add CloseIcon for search clear button
const CloseIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L9 9M1 9L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default Chat;