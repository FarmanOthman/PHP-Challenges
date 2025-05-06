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
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Checkbox,
  VStack,
  Box,
  Stack,
  useToast,
  useColorModeValue,
  Spinner
} from '@chakra-ui/react';
import { useChatStore } from '../../store/chatStore';
import type { User } from '../../types/chat';
import { useAuth } from '../../hooks/useAuth';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableUsers: User[];
}

const CreateRoomModal = ({ isOpen, onClose, availableUsers }: CreateRoomModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'public',
    is_private: false,
    members: [] as number[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createRoom } = useChatStore();
  const { user } = useAuth();
  const toast = useToast();
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData(prev => ({ ...prev, is_private: checked }));
  };

  const handleMemberToggle = (userId: number) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Room name required",
        description: "Please enter a name for the room.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createRoom(formData);
      setFormData({
        name: '',
        description: '',
        type: 'public',
        is_private: false,
        members: []
      });
      onClose();
      toast({
        title: "Room created",
        description: "Your new room has been created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create room",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = availableUsers.filter(u => u.id !== user?.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
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
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter room name"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter room description"
                resize="vertical"
              />
            </FormControl>

            <FormControl id="roomType">
              <FormLabel id="roomTypeLabel" htmlFor="roomType">Room Type</FormLabel>
              <Select
                id="roomType"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                aria-labelledby="roomTypeLabel"
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
                isChecked={formData.is_private}
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
                <Stack spacing={2}>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <Checkbox
                        key={user.id}
                        isChecked={formData.members.includes(user.id)}
                        onChange={() => handleMemberToggle(user.id)}
                      >
                        {user.name}
                      </Checkbox>
                    ))
                  ) : (
                    <Box textAlign="center" py={4}>
                      {isSubmitting ? (
                        <Spinner size="sm" />
                      ) : (
                        "No users available"
                      )}
                    </Box>
                  )}
                </Stack>
              </Box>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Creating..."
          >
            Create Room
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateRoomModal;