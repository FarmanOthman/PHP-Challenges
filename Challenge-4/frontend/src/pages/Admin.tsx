import {
  Box,
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useColorModeValue,
  Button,
  VStack,
  HStack,
  Text,
  useToast
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaUserShield, FaComments, FaUsers, FaChartLine } from 'react-icons/fa';

// Mock data - replace with actual API calls
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin', status: 'active' },
];

const mockRooms = [
  { id: 1, name: 'General', members: 150, messages: 1234, status: 'active' },
  { id: 2, name: 'Support', members: 45, messages: 567, status: 'active' },
];

const Admin = () => {
  const statCardBg = useColorModeValue('blue.50', 'blue.900');
  const toast = useToast();

  const handleAction = (action: string, type: string, id: number) => {
    toast({
      title: `${action} ${type}`,
      description: `${action} ${type} with ID: ${id}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box minH="calc(100vh - 60px)" bg={useColorModeValue('gray.50', 'gray.900')} pt={5}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <Heading size="lg">Admin Dashboard</Heading>
            <Button leftIcon={<FaUserShield />} colorScheme="blue">Admin Actions</Button>
          </HStack>

          {/* Statistics Cards */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
            <Card bg={statCardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Total Users</StatLabel>
                  <StatNumber>1,234</StatNumber>
                  <StatHelpText>Active users in platform</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={statCardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Active Rooms</StatLabel>
                  <StatNumber>56</StatNumber>
                  <StatHelpText>Chat rooms created</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={statCardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Messages Today</StatLabel>
                  <StatNumber>8,567</StatNumber>
                  <StatHelpText>↑20% from yesterday</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={statCardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>System Status</StatLabel>
                  <StatNumber>99.9%</StatNumber>
                  <StatHelpText>Uptime this month</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </Grid>

          {/* Main Content Tabs */}
          <Card>
            <CardBody>
              <Tabs variant="enclosed">
                <TabList>
                  <Tab><HStack><FaUsers /><Text>User Management</Text></HStack></Tab>
                  <Tab><HStack><FaComments /><Text>Room Management</Text></HStack></Tab>
                  <Tab><HStack><FaChartLine /><Text>Statistics</Text></HStack></Tab>
                </TabList>

                <TabPanels>
                  {/* User Management Panel */}
                  <TabPanel>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Email</Th>
                          <Th>Role</Th>
                          <Th>Status</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {mockUsers.map((user) => (
                          <Tr key={user.id}>
                            <Td>{user.name}</Td>
                            <Td>{user.email}</Td>
                            <Td>
                              <Badge colorScheme={user.role === 'admin' ? 'purple' : 'green'}>
                                {user.role}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge colorScheme={user.status === 'active' ? 'green' : 'red'}>
                                {user.status}
                              </Badge>
                            </Td>
                            <Td>
                              <HStack spacing={2}>
                                <IconButton
                                  aria-label="Edit user"
                                  icon={<FaEdit />}
                                  size="sm"
                                  onClick={() => handleAction('Edit', 'user', user.id)}
                                />
                                <IconButton
                                  aria-label="Delete user"
                                  icon={<FaTrash />}
                                  size="sm"
                                  colorScheme="red"
                                  onClick={() => handleAction('Delete', 'user', user.id)}
                                />
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TabPanel>

                  {/* Room Management Panel */}
                  <TabPanel>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Room Name</Th>
                          <Th>Members</Th>
                          <Th>Messages</Th>
                          <Th>Status</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {mockRooms.map((room) => (
                          <Tr key={room.id}>
                            <Td>{room.name}</Td>
                            <Td>{room.members}</Td>
                            <Td>{room.messages}</Td>
                            <Td>
                              <Badge colorScheme={room.status === 'active' ? 'green' : 'red'}>
                                {room.status}
                              </Badge>
                            </Td>
                            <Td>
                              <HStack spacing={2}>
                                <IconButton
                                  aria-label="Edit room"
                                  icon={<FaEdit />}
                                  size="sm"
                                  onClick={() => handleAction('Edit', 'room', room.id)}
                                />
                                <IconButton
                                  aria-label="Delete room"
                                  icon={<FaTrash />}
                                  size="sm"
                                  colorScheme="red"
                                  onClick={() => handleAction('Delete', 'room', room.id)}
                                />
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TabPanel>

                  {/* Statistics Panel */}
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <Text>Detailed statistics and analytics will be implemented here</Text>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default Admin;