import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  Text,
  useToast,
  Divider,
  Box,
  Checkbox,
  Stack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Flex,
  Badge,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Spinner
} from '@chakra-ui/react';
import { SearchIcon, DeleteIcon, CopyIcon } from '@chakra-ui/icons';
import { Room, User } from '../../types/chat';
import { useChatStore } from '../../store/chatStore';
import api from '../../services/api';

interface RoomManagementProps {
  room: Room;
  onClose: () => void;
}

interface FormData {
  name: string;
  description: string;
  isPrivate: boolean;
  members: User[];
}

const RoomManagement = ({ room, onClose }: RoomManagementProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isValidForm, setIsValidForm] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: room.name,
    description: room.description || '',
    isPrivate: room.type === 'private',
    members: room.members || []
  });
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  const { fetchRooms, deleteRoom } = useChatStore();
  const toast = useToast();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const highlightColor = useColorModeValue('blue.50', 'blue.900');

  // Get all available users
  const availableUsers = useMemo(() => {
    const existingMemberIds = new Set(room.members.map(m => m.id));
    return room.type !== 'direct' 
      ? room.members.concat(
          // Add other available users that aren't already members
          room.availableUsers?.filter((u: User) => !existingMemberIds.has(u.id)) || []
        )
      : room.members;
  }, [room.members, room.availableUsers, room.type]);

  // Current user ID
  const currentUserId = parseInt(localStorage.getItem('user_id') || '0');
  const isCurrentUserOwner = room.owner_id === currentUserId;

  // Validate form when name changes
  useEffect(() => {
    setIsValidForm(formData.name.trim().length > 0);
  }, [formData.name]);

  // Generate invite link when showing
  useEffect(() => {
    if (showInviteCode) {
      const baseUrl = window.location.origin;
      setInviteLink(`${baseUrl}/join/${room.id}`);
    }
  }, [showInviteCode, room.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberToggle = (toggleUser: User) => {
    // Prevent removing yourself from members
    if (toggleUser.id === currentUserId && formData.members.some(member => member.id === currentUserId)) {
      toast({
        title: "Cannot remove yourself",
        description: "You cannot remove yourself from the room. Use 'Leave Room' instead.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      members: prev.members.some(member => member.id === toggleUser.id)
        ? prev.members.filter(member => member.id !== toggleUser.id)
        : [...prev.members, toggleUser]
    }));
  };

  const handleSubmit = async () => {
    if (!isValidForm) {
      toast({
        title: "Invalid form",
        description: "Room name cannot be empty.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await api.put(`/rooms/${room.id}`, {
        name: formData.name,
        description: formData.description,
        type: formData.isPrivate ? 'private' : 'public',
        members: formData.members
      });

      await fetchRooms();
      toast({
        title: 'Room updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while updating the room.';
      toast({
        title: 'Error updating room',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    setIsLeaving(true);
    try {
      await api.post(`/rooms/${room.id}/leave`);
      await fetchRooms();
      toast({
        title: 'Left room successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while leaving the room.';
      toast({
        title: 'Error leaving room',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLeaving(false);
      setShowLeaveConfirm(false);
    }
  };

  const handleDeleteRoom = async () => {
    setIsDeleting(true);
    try {
      await deleteRoom(room.id);
      toast({
        title: 'Room deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while deleting the room.';
      toast({
        title: 'Error deleting room',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast({
        title: 'Invite link copied',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Failed to copy invite link:', errorMessage);
      toast({
        title: 'Failed to copy invite link',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const filteredUsers = searchQuery.trim()
    ? availableUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : availableUsers;

  return (
    <>
      <Modal isOpen={true} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center" gap={2}>
              Room Settings
              <Badge colorScheme={room.type === 'public' ? 'green' : room.type === 'direct' ? 'blue' : 'purple'}>
                {room.type}
              </Badge>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Room Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  isInvalid={formData.name.trim().length === 0}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add a room description..."
                  resize="vertical"
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Private Room</FormLabel>
                <Switch
                  isChecked={formData.isPrivate}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    isPrivate: e.target.checked 
                  }))}
                  isDisabled={!isCurrentUserOwner || room.type === 'direct'}
                />
              </FormControl>

              <Divider />

              {/* Invite Link Section */}
              <Box>
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontWeight="medium">Invitation</Text>
                  <Button
                    size="sm"
                    leftIcon={<CopyIcon />}
                    onClick={() => setShowInviteCode(!showInviteCode)}
                  >
                    {showInviteCode ? 'Hide' : 'Show'} Invite Link
                  </Button>
                </Flex>
                {showInviteCode && (
                  <Flex gap={2} mt={2}>
                    <Input value={inviteLink} isReadOnly />
                    <Button onClick={copyInviteLink}>Copy</Button>
                  </Flex>
                )}
              </Box>

              <Divider />

              <Box w="100%">
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontWeight="medium">Room Members ({formData.members.length})</Text>
                  <Badge>{isCurrentUserOwner ? 'Admin' : 'Member'}</Badge>
                </Flex>
                
                <InputGroup size="md" mb={3}>
                  <Input
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <InputRightElement>
                    <SearchIcon color="gray.400" />
                  </InputRightElement>
                </InputGroup>
                
                <Box 
                  maxH="200px" 
                  overflowY="auto" 
                  borderWidth="1px" 
                  borderRadius="md" 
                  borderColor={borderColor}
                  p={2}
                >
                  {isLoading ? (
                    <Flex justify="center" align="center" h="100px">
                      <Spinner />
                    </Flex>
                  ) : filteredUsers.length > 0 ? (
                    <Stack spacing={2}>
                      {filteredUsers.map((user: User) => (
                        <Checkbox
                          key={user.id}
                          isChecked={formData.members.some(member => member.id === user.id)}
                          onChange={() => handleMemberToggle(user)}
                          isDisabled={!isCurrentUserOwner || user.id === currentUserId}
                          bg={user.id === currentUserId ? highlightColor : undefined}
                          p={1}
                          borderRadius="md"
                        >
                          <Flex align="center" justify="space-between" width="100%">
                            <Text>{user.name}</Text>
                            {user.id === room.owner_id && (
                              <Badge colorScheme="purple" ml={2}>Owner</Badge>
                            )}
                            {user.id === currentUserId && (
                              <Badge colorScheme="blue" ml={2}>You</Badge>
                            )}
                          </Flex>
                        </Checkbox>
                      ))}
                    </Stack>
                  ) : (
                    <Text color="gray.500" textAlign="center" py={4}>
                      {searchQuery ? "No members found" : "No users available"}
                    </Text>
                  )}
                </Box>
              </Box>

              {/* Danger Zone */}
              {isCurrentUserOwner && (
                <>
                  <Divider />
                  <Box p={4} bg="red.50" borderRadius="md" borderWidth="1px" borderColor="red.200">
                    <Text fontWeight="bold" color="red.600" mb={2}>
                      Danger Zone
                    </Text>
                    <Button
                      leftIcon={<DeleteIcon />}
                      colorScheme="red"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(true)}
                      isLoading={isDeleting}
                      loadingText="Deleting..."
                      w="full"
                    >
                      Delete Room
                    </Button>
                  </Box>
                </>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              variant="ghost"
              mr="auto"
              onClick={() => setShowLeaveConfirm(true)}
              isLoading={isLeaving}
              loadingText="Leaving..."
              isDisabled={isLoading || isDeleting}
            >
              Leave Room
            </Button>
            <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading || isLeaving || isDeleting}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Saving..."
              isDisabled={!isValidForm || isLeaving || isDeleting}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Leave Room Confirmation */}
      <AlertDialog
        isOpen={showLeaveConfirm}
        leastDestructiveRef={cancelRef as React.RefObject<HTMLButtonElement>}
        onClose={() => setShowLeaveConfirm(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Leave Room
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to leave "{room.name}"? You will need to be invited back to rejoin.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setShowLeaveConfirm(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleLeaveRoom} ml={3} isLoading={isLeaving}>
                Leave Room
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Delete Room Confirmation */}
      <AlertDialog
        isOpen={showDeleteConfirm}
        leastDestructiveRef={cancelRef as React.RefObject<HTMLButtonElement>}
        onClose={() => setShowDeleteConfirm(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Room
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{room.name}"? This action cannot be undone.
              All messages and data will be permanently deleted.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteRoom} ml={3} isLoading={isDeleting}>
                Delete Room
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default RoomManagement;