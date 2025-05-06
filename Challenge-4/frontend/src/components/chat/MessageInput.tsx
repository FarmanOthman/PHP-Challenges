import { useState, useCallback, useEffect, useRef } from 'react';
import {
  FormControl,
  Input,
  IconButton,
  Flex,
  useColorModeValue,
  Tooltip
} from '@chakra-ui/react';
import { FaPaperPlane, FaSmile } from 'react-icons/fa';
import { useChatStore } from '../../store/chatStore';
import socketService from '../../services/socket';
import { useAuth } from '../../hooks/useAuth';

interface MessageInputProps {
  roomId: string; // We'll keep this as it might be used in future implementations
}

const MessageInput: React.FC<MessageInputProps> = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, activeRoomId } = useChatStore();
  const { user } = useAuth();
  const inputBg = useColorModeValue('white', 'gray.700');
  
  // Create a ref outside of the debounce function
  const timeoutRef = useRef<number | undefined>(undefined);

  // Properly typed debounce function using useCallback
  const debounce = useCallback(<T extends (...args: unknown[]) => void>(
    func: T,
    wait: number
  ) => {
    return (...args: Parameters<T>) => {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => func(...args), wait);
    };
  }, []);

  // Send typing status to server
  const sendTypingStatus = useCallback((isTyping: boolean) => {
    if (activeRoomId && user) {
      socketService.sendTypingStatus(activeRoomId, isTyping);
    }
  }, [activeRoomId, user]);

  // Create a stable stop typing function first
  const stopTyping = useCallback(() => sendTypingStatus(false), [sendTypingStatus]);
  
  // Debounced version of setting typing to false using the stable functions
  const debouncedStopTyping = useCallback(
    () => debounce(stopTyping, 1000),
    [debounce, stopTyping]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

    if (newMessage && !message) {
      // Started typing
      sendTypingStatus(true);
    }
    
    if (newMessage) {
      // Continue typing, reset the stop typing timeout
      debouncedStopTyping()();
    } else {
      // Immediately stop typing if message is empty
      sendTypingStatus(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
      sendTypingStatus(false);
    }
  };

  // Cleanup typing status when unmounting
  useEffect(() => {
    return () => {
      if (message) {
        sendTypingStatus(false);
      }
      // Also clear any pending timeouts
      window.clearTimeout(timeoutRef.current);
    };
  }, [message, sendTypingStatus]);

  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <Flex gap={2}>
          <Tooltip label="Emoji picker (coming soon)" placement="top">
            <IconButton
              aria-label="Add emoji"
              icon={<FaSmile />}
              variant="ghost"
              isDisabled
            />
          </Tooltip>
          <Input
            value={message}
            onChange={handleChange}
            placeholder="Type a message..."
            bg={inputBg}
            borderRadius="full"
            _focus={{
              boxShadow: 'none',
              borderColor: 'blue.500'
            }}
          />
          <Tooltip label="Send message" placement="top">
            <IconButton
              type="submit"
              aria-label="Send message"
              icon={<FaPaperPlane />}
              colorScheme="blue"
              isDisabled={!message.trim()}
              borderRadius="full"
            />
          </Tooltip>
        </Flex>
      </FormControl>
    </form>
  );
};

export default MessageInput;