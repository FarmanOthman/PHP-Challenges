import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Button,
  Stack,
  Link,
  useColorMode,
  IconButton,
  useColorModeValue,
  Container,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  MenuDivider
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const Navigation = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={100}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
    >
      <Container maxW="container.xl">
        <Flex
          minH="60px"
          py={2}
          align="center"
          justify="space-between"
        >
          <Flex align="center" gap={8}>
            <Text
              as={RouterLink}
              to="/"
              fontSize="xl"
              fontWeight="bold"
              _hover={{ textDecoration: 'none' }}
            >
              Chat App
            </Text>

            <Stack direction="row" spacing={4}>
              <Link as={RouterLink} to="/" px={2}>
                Home
              </Link>
              <Link as={RouterLink} to="/about" px={2}>
                About
              </Link>
              {user && (
                <>
                  <Link as={RouterLink} to="/chat" px={2}>
                    Chat
                  </Link>
                  {user.role === 'admin' && (
                    <Link as={RouterLink} to="/admin" px={2}>
                      Admin
                    </Link>
                  )}
                </>
              )}
            </Stack>
          </Flex>

          <Stack direction="row" spacing={4} align="center">
            <IconButton
              aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
            />

            {user ? (
              <Menu>
                <MenuButton 
                  as={Button} 
                  rightIcon={<ChevronDownIcon />}
                  variant="ghost"
                >
                  <Flex align="center" gap={2}>
                    <Avatar 
                      size="xs" 
                      name={user.name} 
                    />
                    <Text display={{ base: 'none', md: 'block' }}>
                      {user.name}
                    </Text>
                  </Flex>
                </MenuButton>
                <MenuList>
                  <MenuItem 
                    as={RouterLink}
                    to="/profile"
                    icon={<FaUser />}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem icon={<FaCog />}>Settings</MenuItem>
                  <MenuDivider />
                  <MenuItem 
                    onClick={handleLogout}
                    icon={<FaSignOutAlt />}
                  >
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="ghost"
                >
                  Sign In
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  colorScheme="blue"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navigation;