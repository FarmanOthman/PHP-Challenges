import { Box, Flex, keyframes, useColorModeValue } from '@chakra-ui/react';

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-5px); }
`;

interface TypingIndicatorProps {
  username: string;
}

const TypingIndicator = ({ username }: TypingIndicatorProps) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const dotColor = useColorModeValue('gray.500', 'gray.300');
  
  const animation = `${bounce} 1s infinite`;

  return (
    <Flex align="center" maxW="200px">
      <Box
        bg={bgColor}
        px={3}
        py={2}
        borderRadius="full"
        fontSize="sm"
        color="gray.500"
      >
        {username} is typing
        <Flex display="inline-flex" mx={1} gap={1}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              as="span"
              w="2px"
              h="2px"
              borderRadius="full"
              bg={dotColor}
              animation={animation}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </Flex>
      </Box>
    </Flex>
  );
};

export default TypingIndicator;