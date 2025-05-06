import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  VStack,
  Input,
  InputGroup,
  InputLeftElement, // Standard for icons in InputGroup
  Select,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Button,
  Text,
  Heading,
  Card,
  CardBody,
  Badge,
  Flex,
  IconButton,
  Spinner,
  Container,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { SearchIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import useSearchStore from '../store/searchStore';
import { useChatStore } from '../store/chatStore';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    roomId: '',
    fromDate: '',
    toDate: '',
    sender: '',
  });

  const { rooms } = useChatStore();
  const { searchResults, loading, error, searchMessages } = useSearchStore();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    if (initialQuery) {
      searchMessages(initialQuery, filters);
    }
  }, [initialQuery, filters, searchMessages]);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      searchMessages(query, filters);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const navigateToMessage = (roomId: string, messageId: number) => {
    navigate(`/chat/${roomId}?message=${messageId}`);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header with Back Button */}
        <Flex align="center" gap={4}>
          <IconButton
            icon={<Icon as={ChevronLeftIcon} />} // Corrected: Using icon prop
            aria-label="Back"
            variant="ghost"
            onClick={() => navigate(-1)}
          />
          <Heading size="lg">Search Messages</Heading>
        </Flex>

        {/* Search and Filters */}
        <Card bg={bgColor} borderColor={borderColor} variant="outline">
          <CardBody>
            <VStack spacing={6}>
              {/* Search Input */}
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.500" />
                </InputLeftElement>
                <Input
                  placeholder="Search messages..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </InputGroup>

              {/* Filters */}
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4} w="full">
                <GridItem>
                  <FormControl>
                    <FormLabel id="room-filter-label" htmlFor="room-filter">Room</FormLabel>
                    <Select
                      id="room-filter"
                      value={filters.roomId}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('roomId', e.target.value)}
                      aria-labelledby="room-filter-label"
                      placeholder="All Rooms"
                    >
                      {rooms.map(room => (
                        <option key={room.id} value={room.id}>
                          {room.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel htmlFor="from-date">From Date</FormLabel>
                    <Input
                      id="from-date"
                      name="from-date"
                      type="date"
                      value={filters.fromDate}
                      onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                      aria-label="Filter messages from date"
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel htmlFor="to-date">To Date</FormLabel>
                    <Input
                      id="to-date"
                      name="to-date"
                      type="date"
                      value={filters.toDate}
                      onChange={(e) => handleFilterChange('toDate', e.target.value)}
                      aria-label="Filter messages to date"
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel htmlFor="sender-input">Sender</FormLabel>
                    <Input
                      id="sender-input"
                      name="sender"
                      placeholder="Filter by sender..."
                      value={filters.sender}
                      onChange={(e) => handleFilterChange('sender', e.target.value)}
                      aria-label="Filter messages by sender name"
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              <Button colorScheme="blue" onClick={handleSearch} isLoading={loading}>
                Search
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Results */}
        <Box>
          {loading ? (
            <Flex justify="center" py={8}>
              <Spinner size="xl" />
            </Flex>
          ) : error ? (
            <Text color="red.500" textAlign="center">{error}</Text>
          ) : searchResults.length > 0 ? (
            <VStack spacing={4} align="stretch">
              <Text fontWeight="medium">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </Text>
              {searchResults.map((message) => {
                const room = rooms.find(r => r.id === message.roomId);
                return (
                  <Card
                    key={message.id}
                    cursor="pointer"
                    onClick={() => navigateToMessage(message.roomId, message.id)}
                    _hover={{ bg: cardHoverBg }}
                    variant="outline"
                  >
                    <CardBody>
                      <VStack align="stretch" spacing={2}>
                        <Flex justify="space-between" align="center">
                          <Flex gap={2} align="center">
                            <Text fontWeight="bold">{message.user.name}</Text>
                            <Badge colorScheme="blue">{room?.name || 'Unknown Room'}</Badge>
                          </Flex>
                          <Text color="gray.500" fontSize="sm">
                            {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
                          </Text>
                        </Flex>
                        <Text>{message.content}</Text>
                      </VStack>
                    </CardBody>
                  </Card>
                );
              })}
            </VStack>
          ) : query ? (
            <Text textAlign="center" color="gray.500" py={8}>
              No messages found matching your search
            </Text>
          ) : null}
        </Box>
      </VStack>
    </Container>
  );
};

export default SearchResults;