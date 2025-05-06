import {
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  Stack,
  useColorModeValue
} from '@chakra-ui/react';

interface ChatSkeletonProps {
  type: 'messages' | 'rooms';
}

const ChatSkeleton = ({ type }: ChatSkeletonProps) => {
  const bgColor = useColorModeValue('white', 'gray.700');

  if (type === 'messages') {
    return (
      <Stack spacing={4} w="full" p={4}>
        {[...Array(5)].map((_, i) => (
          <Flex key={i} gap={3} align="flex-start" justify={i % 2 === 0 ? 'flex-start' : 'flex-end'}>
            {i % 2 === 0 && <SkeletonCircle size="8" />}
            <Flex direction="column" maxW="70%">
              <Skeleton height="8px" width="60px" mb={2} />
              <Box
                bg={bgColor}
                borderRadius="lg"
                p={3}
              >
                <Skeleton height="20px" width={`${Math.random() * 200 + 100}px`} />
              </Box>
            </Flex>
            {i % 2 !== 0 && <SkeletonCircle size="8" />}
          </Flex>
        ))}
      </Stack>
    );
  }

  return (
    <Stack spacing={4} p={4}>
      {[...Array(6)].map((_, i) => (
        <Flex key={i} gap={3} align="center">
          <SkeletonCircle size="10" />
          <Box flex={1}>
            <Skeleton height="12px" width="140px" mb={2} />
            <Skeleton height="8px" width="100px" />
          </Box>
        </Flex>
      ))}
    </Stack>
  );
};

export default ChatSkeleton;