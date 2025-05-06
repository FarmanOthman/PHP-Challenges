import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Heading,
  Input,
  VStack,
  HStack,
  Text,
  IconButton,
  Switch,
  Grid,
  GridItem,
  useColorModeValue,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  InputGroup,
  InputRightElement,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Skeleton,
  useDisclosure
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, EditIcon, CheckIcon, CloseIcon, DeleteIcon, LockIcon, BellIcon } from '@chakra-ui/icons';
import { FaUser, FaLock, FaBell, FaCog } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Define types for profile data
interface ProfileData {
  id: number;
  name: string;
  email: string;
  bio?: string;
  joinedAt: string;
  theme: string;
}

// Define types for notification settings
interface NotificationSettings {
  newMessage: boolean;
  mentions: boolean;
  roomInvites: boolean;
  newMembers: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
}

// Define types for account settings
interface AccountSettings {
  theme: string;
  fontSize: string;
  autoplayMedia: boolean;
  showReadReceipts: boolean;
  showTypingIndicators: boolean;
  enterToSend: boolean;
}

const Profile = () => {
  // Get user data from authentication context
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  
  // State for profile data
  const [profileData, setProfileData] = useState<ProfileData>({
    id: user?.id || 0,
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    joinedAt: new Date().toISOString(),
    theme: 'light',
  });
  
  // State for profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // State for notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    newMessage: true,
    mentions: true,
    roomInvites: true,
    newMembers: false,
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
  });
  
  // State for account preferences
  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    theme: 'system',
    fontSize: 'medium',
    autoplayMedia: true,
    showReadReceipts: true,
    showTypingIndicators: true,
    enterToSend: true,
  });

  // Delete account modal state
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const tabSelectedBg = useColorModeValue('blue.500', 'blue.300');
  const tabHoverBg = useColorModeValue('blue.50', 'blue.900');
  
  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would fetch this from your API
        // const response = await api.get('/user/profile');
        
        // For this demo, let's simulate an API call with a timeout
        setTimeout(() => {
          // This would normally come from the API response
          setProfileData({
            id: user?.id || 0,
            name: user?.name || 'User',
            email: user?.email || 'user@example.com',
            bio: 'Front-end developer passionate about creating beautiful user interfaces and experiences.',
            joinedAt: '2023-01-15T00:00:00Z',
            theme: 'light',
          });
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        toast({
          title: 'Error',
          description: 'Failed to load profile data.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user, toast]);

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      setIsSaving(true);
      
      // In a real app, you would make an API call
      // await api.put('/user/profile', profileData);
      
      // For this demo, simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        title: 'Error',
        description: 'Failed to update profile.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    // Validate password inputs
    if (!passwordData.currentPassword) {
      toast({
        title: 'Error',
        description: 'Please enter your current password.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'New password must be at least 8 characters.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New password and confirmation do not match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      setIsChangingPassword(true);
      
      // In a real app, you would make an API call
      // await api.put('/user/password', {
      //   current_password: passwordData.currentPassword,
      //   password: passwordData.newPassword,
      //   password_confirmation: passwordData.confirmPassword
      // });
      
      // For this demo, simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error changing password:', err);
      toast({
        title: 'Error',
        description: 'Failed to change password. Please check your current password.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle notification settings change
  const handleNotificationChange = (setting: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    // In a real app, you might want to save this to the server
    toast({
      title: 'Settings updated',
      description: 'Your notification settings have been saved.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // Handle account settings change
  const handleAccountSettingChange = (setting: keyof AccountSettings, value: string | boolean) => {
    setAccountSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    // In a real app, you might want to save this to the server
    toast({
      title: 'Settings updated',
      description: 'Your account settings have been saved.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast({
        title: 'Error',
        description: 'Please type DELETE to confirm.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      setIsDeleting(true);
      
      // In a real app, you would make an API call
      // await api.delete('/user/account');
      
      // For this demo, simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Account deleted',
        description: 'Your account has been deleted successfully.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      
      // Log the user out and redirect
      logout();
      navigate('/');
    } catch (err) {
      console.error('Error deleting account:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete account.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      onDeleteModalClose();
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Box
        bg={bgColor}
        borderRadius="xl"
        boxShadow="md"
        overflow="hidden"
      >
        {/* Profile Header */}
        <Box
          bg="blue.500"
          color="white"
          p={{ base: 6, md: 8 }}
          position="relative"
          h={{ base: '120px', md: '150px' }}
        >
          <Heading size="xl">My Profile</Heading>
          <Text mt={2} opacity={0.9}>Manage your account and preferences</Text>
        </Box>

        {/* Tabs */}
        <Tabs
          position="relative"
          variant="unstyled"
          mt={{ base: '-40px', md: '-50px' }}
          px={{ base: 4, md: 8 }}
        >
          <TabList
            bg={bgColor}
            borderRadius="lg"
            boxShadow="md"
            p={1}
            width={{ base: '90%', md: '80%', lg: '60%' }}
            mx="auto"
          >
            <Tab
              _selected={{ color: 'white', bg: tabSelectedBg }}
              _hover={{ bg: tabHoverBg }}
              borderRadius="md"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <FaUser /> Profile
            </Tab>
            <Tab
              _selected={{ color: 'white', bg: tabSelectedBg }}
              _hover={{ bg: tabHoverBg }}
              borderRadius="md"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <FaLock /> Security
            </Tab>
            <Tab
              _selected={{ color: 'white', bg: tabSelectedBg }}
              _hover={{ bg: tabHoverBg }}
              borderRadius="md"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <FaBell /> Notifications
            </Tab>
            <Tab
              _selected={{ color: 'white', bg: tabSelectedBg }}
              _hover={{ bg: tabHoverBg }}
              borderRadius="md"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <FaCog /> Preferences
            </Tab>
          </TabList>
          
          <TabPanels p={{ base: 4, md: 8 }}>
            {/* Profile Tab */}
            <TabPanel>
              <Box>
                <Flex
                  direction="column"
                  gap={6}
                >
                  {/* Profile Information */}
                  <Box>
                    <Flex justify="space-between" align="center" mb={6}>
                      <Heading size="md">Personal Information</Heading>
                      {!isEditing ? (
                        <Button
                          leftIcon={<EditIcon />}
                          onClick={() => setIsEditing(true)}
                          size="sm"
                          variant="outline"
                          colorScheme="blue"
                          isDisabled={isLoading}
                        >
                          Edit Profile
                        </Button>
                      ) : (
                        <HStack>
                          <Button
                            leftIcon={<CloseIcon />}
                            onClick={() => setIsEditing(false)}
                            size="sm"
                            variant="outline"
                            isDisabled={isSaving}
                          >
                            Cancel
                          </Button>
                          <Button
                            leftIcon={<CheckIcon />}
                            onClick={handleUpdateProfile}
                            size="sm"
                            colorScheme="blue"
                            isLoading={isSaving}
                            loadingText="Saving..."
                          >
                            Save Changes
                          </Button>
                        </HStack>
                      )}
                    </Flex>

                    <Grid
                      templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                      gap={6}
                    >
                      {/* Name */}
                      <FormControl>
                        <FormLabel>Full Name</FormLabel>
                        <Skeleton isLoaded={!isLoading}>
                          {isEditing ? (
                            <Input
                              value={profileData.name}
                              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            />
                          ) : (
                            <Input value={profileData.name} readOnly variant="filled" />
                          )}
                        </Skeleton>
                      </FormControl>

                      {/* Email */}
                      <FormControl>
                        <FormLabel>Email Address</FormLabel>
                        <Skeleton isLoaded={!isLoading}>
                          <Input value={profileData.email} readOnly variant="filled" />
                          {!isEditing && (
                            <FormHelperText>
                              Email cannot be changed
                            </FormHelperText>
                          )}
                        </Skeleton>
                      </FormControl>

                      {/* Bio */}
                      <GridItem colSpan={{ base: 1, md: 2 }}>
                        <FormControl>
                          <FormLabel>Bio</FormLabel>
                          <Skeleton isLoaded={!isLoading}>
                            {isEditing ? (
                              <Input
                                value={profileData.bio || ''}
                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                placeholder="Tell us about yourself"
                              />
                            ) : (
                              <Input 
                                value={profileData.bio || 'No bio provided'} 
                                readOnly 
                                variant="filled" 
                              />
                            )}
                          </Skeleton>
                        </FormControl>
                      </GridItem>
                      
                      {/* Member Since */}
                      <FormControl>
                        <FormLabel>Member Since</FormLabel>
                        <Skeleton isLoaded={!isLoading}>
                          <Input 
                            value={formatDate(profileData.joinedAt)} 
                            readOnly 
                            variant="filled" 
                          />
                        </Skeleton>
                      </FormControl>
                    </Grid>
                  </Box>
                </Flex>
              </Box>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel>
              <Box>
                <VStack spacing={8} align="stretch">
                  {/* Password Change Section */}
                  <Box>
                    <Heading size="md" mb={6}>
                      Change Password
                    </Heading>
                    <VStack spacing={4} maxW="md">
                      {/* Current Password */}
                      <FormControl isRequired>
                        <FormLabel>Current Password</FormLabel>
                        <InputGroup>
                          <Input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            placeholder="Enter your current password"
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                              icon={showCurrentPassword ? <ViewOffIcon /> : <ViewIcon />}
                              variant="ghost"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>

                      {/* New Password */}
                      <FormControl isRequired>
                        <FormLabel>New Password</FormLabel>
                        <InputGroup>
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            placeholder="Enter new password"
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                              icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                              variant="ghost"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            />
                          </InputRightElement>
                        </InputGroup>
                        <FormHelperText>Password must be at least 8 characters</FormHelperText>
                      </FormControl>

                      {/* Confirm New Password */}
                      <FormControl isRequired>
                        <FormLabel>Confirm New Password</FormLabel>
                        <InputGroup>
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            placeholder="Confirm new password"
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                              icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                              variant="ghost"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>

                      <Button
                        colorScheme="blue"
                        leftIcon={<LockIcon />}
                        onClick={handlePasswordChange}
                        isLoading={isChangingPassword}
                        loadingText="Updating..."
                        alignSelf="flex-start"
                      >
                        Update Password
                      </Button>
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Account Deletion Section */}
                  <Box>
                    <Heading size="md" mb={4} color="red.500">
                      Delete Account
                    </Heading>
                    <Text mb={4} color={textColor}>
                      Once you delete your account, all of your data will be permanently removed.
                      This action cannot be undone.
                    </Text>
                    <Button
                      colorScheme="red"
                      variant="outline"
                      leftIcon={<DeleteIcon />}
                      onClick={onDeleteModalOpen}
                    >
                      Delete My Account
                    </Button>
                  </Box>
                </VStack>
              </Box>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel>
              <Box>
                <Heading size="md" mb={6}>
                  Notification Settings
                </Heading>
                
                <VStack spacing={6} align="stretch">
                  {/* In-App Notifications */}
                  <Box>
                    <Text fontWeight="bold" mb={4}>
                      In-App Notifications
                    </Text>
                    <VStack spacing={4} align="start">
                      <HStack width="100%" justify="space-between">
                        <Text>New messages</Text>
                        <Switch
                          isChecked={notificationSettings.newMessage}
                          onChange={() => handleNotificationChange('newMessage')}
                          colorScheme="blue"
                        />
                      </HStack>
                      <HStack width="100%" justify="space-between">
                        <Text>Mentions and replies</Text>
                        <Switch
                          isChecked={notificationSettings.mentions}
                          onChange={() => handleNotificationChange('mentions')}
                          colorScheme="blue"
                        />
                      </HStack>
                      <HStack width="100%" justify="space-between">
                        <Text>Room invitations</Text>
                        <Switch
                          isChecked={notificationSettings.roomInvites}
                          onChange={() => handleNotificationChange('roomInvites')}
                          colorScheme="blue"
                        />
                      </HStack>
                      <HStack width="100%" justify="space-between">
                        <Text>New members in your rooms</Text>
                        <Switch
                          isChecked={notificationSettings.newMembers}
                          onChange={() => handleNotificationChange('newMembers')}
                          colorScheme="blue"
                        />
                      </HStack>
                    </VStack>
                  </Box>
                  
                  <Divider />
                  
                  {/* Notification Channels */}
                  <Box>
                    <Text fontWeight="bold" mb={4}>
                      Notification Channels
                    </Text>
                    <VStack spacing={4} align="start">
                      <HStack width="100%" justify="space-between">
                        <Text>Email notifications</Text>
                        <Switch
                          isChecked={notificationSettings.emailNotifications}
                          onChange={() => handleNotificationChange('emailNotifications')}
                          colorScheme="blue"
                        />
                      </HStack>
                      <HStack width="100%" justify="space-between">
                        <Text>Push notifications</Text>
                        <Switch
                          isChecked={notificationSettings.pushNotifications}
                          onChange={() => handleNotificationChange('pushNotifications')}
                          colorScheme="blue"
                        />
                      </HStack>
                      <HStack width="100%" justify="space-between">
                        <Text>Sound notifications</Text>
                        <Switch
                          isChecked={notificationSettings.soundEnabled}
                          onChange={() => handleNotificationChange('soundEnabled')}
                          colorScheme="blue"
                        />
                      </HStack>
                    </VStack>
                  </Box>
                  
                  <Divider />
                  
                  <Box>
                    <Button leftIcon={<BellIcon />} colorScheme="blue">
                      Test Notifications
                    </Button>
                  </Box>
                </VStack>
              </Box>
            </TabPanel>

            {/* Preferences Tab */}
            <TabPanel>
              <Box>
                <Heading size="md" mb={6}>
                  Account Preferences
                </Heading>
                
                <VStack spacing={6} align="stretch">
                  {/* General Preferences */}
                  <Box>
                    <Text fontWeight="bold" mb={4}>
                      General
                    </Text>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                      <FormControl>
                        <FormLabel>Theme</FormLabel>
                        <Select
                          value={accountSettings.theme}
                          onChange={(e) => handleAccountSettingChange('theme', e.target.value)}
                          aria-label="Select theme"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System Default</option>
                        </Select>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>Font Size</FormLabel>
                        <Select
                          value={accountSettings.fontSize}
                          onChange={(e) => handleAccountSettingChange('fontSize', e.target.value)}
                          aria-label="Select font size"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Box>
                  
                  <Divider />
                  
                  {/* Chat Preferences */}
                  <Box>
                    <Text fontWeight="bold" mb={4}>
                      Chat Experience
                    </Text>
                    <VStack spacing={4} align="start">
                      <HStack width="100%" justify="space-between">
                        <Text>Autoplay media in chat</Text>
                        <Switch
                          isChecked={accountSettings.autoplayMedia}
                          onChange={(e) => handleAccountSettingChange('autoplayMedia', e.target.checked)}
                          colorScheme="blue"
                        />
                      </HStack>
                      <HStack width="100%" justify="space-between">
                        <Text>Show read receipts</Text>
                        <Switch
                          isChecked={accountSettings.showReadReceipts}
                          onChange={(e) => handleAccountSettingChange('showReadReceipts', e.target.checked)}
                          colorScheme="blue"
                        />
                      </HStack>
                      <HStack width="100%" justify="space-between">
                        <Text>Show typing indicators</Text>
                        <Switch
                          isChecked={accountSettings.showTypingIndicators}
                          onChange={(e) => handleAccountSettingChange('showTypingIndicators', e.target.checked)}
                          colorScheme="blue"
                        />
                      </HStack>
                      <HStack width="100%" justify="space-between">
                        <Text>Press Enter to send messages</Text>
                        <Switch
                          isChecked={accountSettings.enterToSend}
                          onChange={(e) => handleAccountSettingChange('enterToSend', e.target.checked)}
                          colorScheme="blue"
                        />
                      </HStack>
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      
      {/* Account Deletion Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="red.500">Delete Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error" mb={4}>
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>Warning!</AlertTitle>
                <AlertDescription>
                  This action is irreversible. All your data, messages, and files will be permanently deleted.
                </AlertDescription>
              </Box>
            </Alert>
            
            <Text mb={4}>To confirm, type <strong>DELETE</strong> in the box below:</Text>
            <Input 
              value={deleteConfirmText} 
              onChange={(e) => setDeleteConfirmText(e.target.value)} 
              placeholder="Type DELETE to confirm"
            />
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onDeleteModalClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              onClick={handleDeleteAccount}
              isLoading={isDeleting}
              loadingText="Deleting..."
              isDisabled={deleteConfirmText !== 'DELETE'}
            >
              Delete Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Profile;