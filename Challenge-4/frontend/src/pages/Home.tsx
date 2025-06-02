import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Image,
  Badge,
  Avatar,
  Stack
} from '@chakra-ui/react';
import { FaComments, FaUserFriends, FaLock, FaBell, FaRocket, FaShieldAlt, FaMobile, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { chakra } from '@chakra-ui/react';

// Create motion components with Chakra UI
const MotionBox = chakra(motion.div);
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

// Import keyframes from Chakra UI
import { keyframes } from '@chakra-ui/react';

// Testimonial component with proper TypeScript interfaces
interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

const Testimonial = ({ name, role, content, avatar }: TestimonialProps) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const quoteBg = useColorModeValue('blue.50', 'blue.900');
  
  return (
    <VStack
      spacing={4}
      p={6}
      bg={cardBg}
      borderRadius="xl"
      boxShadow="lg"
      height="100%"
      justify="space-between"
    >
      <Box
        bg={quoteBg}
        w="full"
        p={4}
        borderRadius="md"
        position="relative"
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '-12px',
          left: '24px',
          borderColor: `${quoteBg} transparent transparent transparent`,
          borderStyle: 'solid',
          borderWidth: '12px 12px 0 12px',
        }}
      >
        <Text fontStyle="italic">"{content}"</Text>
      </Box>
      <HStack spacing={4} align="center" alignSelf="flex-start" pt={4}>
        <Avatar name={name} src={avatar} size="md" />
        <Box>
          <Text fontWeight="bold">{name}</Text>
          <Text fontSize="sm" color="gray.500">{role}</Text>
        </Box>
      </HStack>
    </VStack>
  );
};

// Step component for How It Works section
interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step = ({ number, title, description }: StepProps) => {
  const circleBg = useColorModeValue('blue.500', 'blue.400');
  const borderColor = useColorModeValue('blue.100', 'blue.700');
  
  return (
    <Flex align="center" mb={6}>
      <Flex
        minW="48px"
        h="48px"
        align="center"
        justify="center"
        borderRadius="full"
        bg={circleBg}
        color="white"
        fontWeight="bold"
        fontSize="xl"
        mr={4}
      >
        {number}
      </Flex>
      <Box flex={1} borderLeft="1px" borderColor={borderColor} pl={4} py={2}>
        <Text fontWeight="bold" fontSize="lg">{title}</Text>
        <Text color={useColorModeValue('gray.600', 'gray.300')}>{description}</Text>
      </Box>
    </Flex>
  );
};

// Feature component with proper TypeScript interface
interface FeatureProps {
  icon: React.ElementType;
  title: string;
  text: string;
}

const Feature = ({ icon, title, text }: FeatureProps) => {
  const boxBg = useColorModeValue('white', 'gray.700');
  const boxShadow = useColorModeValue(
    '0px 4px 10px rgba(0, 0, 0, 0.05)',
    '0px 4px 10px rgba(0, 0, 0, 0.2)'
  );
  
  return (
    <VStack
      align="start"
      p={6}
      bg={boxBg}
      borderRadius="xl"
      boxShadow={boxShadow}
      height="100%"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: useColorModeValue(
          '0px 10px 20px rgba(0, 0, 0, 0.1)',
          '0px 10px 20px rgba(0, 0, 0, 0.3)'
        )
      }}
    >
      <Flex
        w="50px"
        h="50px"
        align="center"
        justify="center"
        borderRadius="md"
        bg={useColorModeValue('blue.50', 'blue.900')}
        color="blue.500"
        mb={2}
      >
        <Icon as={icon} w={6} h={6} />
      </Flex>
      <Text fontWeight="bold" fontSize="xl">
        {title}
      </Text>
      <Text color={useColorModeValue('gray.600', 'gray.300')}>
        {text}
      </Text>
    </VStack>
  );
};

const Home = () => {
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.600, purple.700)'
  );
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const heroBoxShadow = useColorModeValue(
    '0 4px 12px rgba(0, 0, 0, 0.1)',
    '0 4px 12px rgba(255, 255, 255, 0.1)'
  );
  const floatingAnimation = `${float} 6s ease-in-out infinite`;

  return (
    <Box>
      {/* Hero Section with enhanced styling */}
      <Box 
        bg={useColorModeValue('gray.50', 'gray.900')} 
        py={{ base: 16, md: 28 }}
        position="relative"
        overflow="hidden"
      >
        {/* Background decorative elements */}
        <Box 
          position="absolute"
          top={{ base: "-50px", md: "-150px" }}
          right="-100px"
          width="300px"
          height="300px"
          borderRadius="full"
          bg={useColorModeValue('blue.100', 'blue.900')}
          opacity="0.4"
        />
        <Box 
          position="absolute"
          bottom={{ base: "-80px", md: "-100px" }}
          left="-50px"
          width="200px"
          height="200px"
          borderRadius="full"
          bg={useColorModeValue('purple.100', 'purple.900')}
          opacity="0.5"
        />
        
        <Container maxW="container.xl" position="relative">
          <Flex 
            direction={{ base: "column", lg: "row" }}
            align="center" 
            justify="space-between"
            gap={10}
          >
            <VStack spacing={8} align={{ base: "center", lg: "start" }} textAlign={{ base: "center", lg: "left" }} flex={1}>
              <Badge 
                fontSize="md"
                colorScheme="blue" 
                px={3} 
                py={1} 
                borderRadius="full"
              >
                Version 2.0 Released
              </Badge>
              <Heading
                as="h1"
                size={{ base: "2xl", md: "3xl", lg: "4xl" }}
                bgGradient={bgGradient}
                bgClip="text"
                fontWeight="extrabold"
                lineHeight="1.2"
              >
                The Future of Team Communication is Here
              </Heading>
              <Text fontSize={{ base: "lg", md: "xl" }} color={textColor} maxW="600px">
                Connect with your team seamlessly, create organized spaces for every project, and collaborate in real-time with our modern chat platform.
              </Text>
              <Stack 
                direction={{ base: "column", sm: "row" }} 
                spacing={4} 
                w={{ base: "full", sm: "auto" }}
              >
                <Button
                  as={RouterLink}
                  to="/register"
                  size="lg"
                  fontSize="md"
                  colorScheme="blue"
                  px={8}
                  rounded="full"
                  fontWeight="bold"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                >
                  Get Started Free
                </Button>
                <Button
                  as={RouterLink}
                  to="/login"
                  size="lg"
                  fontSize="md"
                  variant="outline"
                  px={8}
                  rounded="full"
                  borderWidth="2px"
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                >
                  Sign In
                </Button>
              </Stack>
              <HStack spacing={4} color={textColor} mt={4}>
                <Flex align="center">
                  <Icon as={FaCheck} mr={2} color="green.500" />
                  <Text fontSize="sm">No credit card required</Text>
                </Flex>
                <Flex align="center">
                  <Icon as={FaCheck} mr={2} color="green.500" />
                  <Text fontSize="sm">Free forever plan</Text>
                </Flex>
              </HStack>
            </VStack>
            
            {/* Hero image/illustration */}
            <MotionBox
              maxW={{ base: "100%", lg: "50%" }}
              flex={1}
              animation={floatingAnimation}
              mt={{ base: 10, lg: 0 }}
            >
              <Box
                bg={useColorModeValue('white', 'gray.800')}
                p={6}
                borderRadius="2xl"
                boxShadow={heroBoxShadow}
                overflow="hidden"
              >
                <Image
                  src="https://static.vecteezy.com/system/resources/previews/029/917/185/original/chat-interface-application-with-dialogue-window-clean-mobile-ui-design-concept-sms-messenger-vector.jpg"
                  alt="Chat App Interface"
                  borderRadius="xl"
                  fallbackSrc="https://via.placeholder.com/500x300?text=Chat+Interface"
                />
              </Box>
            </MotionBox>
          </Flex>
        </Container>
      </Box>

      {/* Features Section with improved layout */}
      <Container maxW="container.xl" py={20}>
        <VStack spacing={16}>
          <VStack spacing={4} textAlign="center">
            <Text color="blue.500" fontWeight="bold" textTransform="uppercase">
              Powerful Features
            </Text>
            <Heading size={{ base: "xl", md: "2xl" }}>
              Everything You Need to Connect
            </Heading>
            <Text color={textColor} maxW="3xl" fontSize="lg">
              Our platform combines the best aspects of team messaging, file sharing, and real-time collaboration to create the ultimate communication experience.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
            <Feature
              icon={FaComments}
              title="Real-time Chat"
              text="Experience seamless real-time messaging with instant delivery and typing indicators to keep conversations flowing naturally."
            />
            <Feature
              icon={FaUserFriends}
              title="Team Spaces"
              text="Create dedicated spaces for teams, projects, or topics to keep conversations organized and accessible."
            />
            <Feature
              icon={FaLock}
              title="Secure Messaging"
              text="End-to-end encryption ensures your private conversations and shared files remain confidential and secure."
            />
            <Feature
              icon={FaBell}
              title="Smart Notifications"
              text="Customize notifications to stay informed about important messages while filtering out the noise."
            />
          </SimpleGrid>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full" pt={8}>
            <Feature
              icon={FaShieldAlt}
              title="Admin Controls"
              text="Comprehensive management tools give administrators full control over users, permissions, and content."
            />
            <Feature
              icon={FaRocket}
              title="Integrations"
              text="Connect with your favorite tools and services to streamline your workflow without switching context."
            />
            <Feature
              icon={FaMobile}
              title="Mobile Ready"
              text="Stay connected on the go with our fully responsive mobile experience for iOS and Android."
            />
            <Feature
              icon={FaUserFriends}
              title="Guest Access"
              text="Collaborate with external partners by inviting them as guests to specific channels without full access."
            />
          </SimpleGrid>
        </VStack>
      </Container>
      
      {/* How It Works Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.800')} py={20}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack textAlign="center" spacing={4}>
              <Text color="blue.500" fontWeight="bold" textTransform="uppercase">
                Simple Process
              </Text>
              <Heading size="xl">How Chat App Works</Heading>
              <Text color={textColor} maxW="2xl" fontSize="lg">
                Getting started is easy. Follow these simple steps to begin communicating with your team in minutes.
              </Text>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <VStack align="stretch" spacing={2}>
                <Step 
                  number={1} 
                  title="Create Your Account" 
                  description="Sign up with your email or social accounts in just seconds to get started."
                />
                <Step 
                  number={2} 
                  title="Create or Join Rooms" 
                  description="Create new chat rooms for your team or join existing ones with an invitation link."
                />
                <Step 
                  number={3} 
                  title="Invite Team Members" 
                  description="Add your colleagues to relevant rooms so everyone stays in the loop."
                />
                <Step 
                  number={4} 
                  title="Start Collaborating" 
                  description="Send messages, share files, and collaborate in real-time with your team."
                />
              </VStack>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: "0.5s", delay: "0.2s" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  bg={useColorModeValue('white', 'gray.700')}
                  p={6}
                  borderRadius="xl"
                  boxShadow="lg"
                  height="full"
                  width="full"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=80"
                    alt="Team collaboration"
                    borderRadius="lg"
                    fallbackSrc="https://via.placeholder.com/500x400?text=Team+Collaboration"
                  />
                </Box>
              </MotionBox>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxW="container.xl" py={20}>
        <VStack spacing={12}>
          <VStack textAlign="center" spacing={4}>
            <Text color="blue.500" fontWeight="bold" textTransform="uppercase">
              Testimonials
            </Text>
            <Heading size="xl">Loved by Teams Everywhere</Heading>
            <Text color={textColor} maxW="2xl" fontSize="lg">
              Here's what our customers have to say about how Chat App has transformed their team communication.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="full">
            <Testimonial
              name="Sarah Johnson"
              role="Product Manager at TechCorp"
              avatar="https://randomuser.me/api/portraits/women/2.jpg"
              content="Chat App has completely transformed how our team communicates. The interface is intuitive and the real-time features have boosted our productivity by at least 30%."
            />
            <Testimonial
              name="Michael Rodriguez"
              role="CTO at StartupX"
              avatar="https://randomuser.me/api/portraits/men/32.jpg"
              content="After trying multiple chat solutions, we finally found Chat App. The security features and custom integrations make it perfect for our development team's needs."
            />
            <Testimonial
              name="Emily Chang"
              role="Marketing Director at GlobalBrand"
              avatar="https://randomuser.me/api/portraits/women/10.jpg"
              content="The ability to organize conversations by project has been a game-changer for our marketing team. We can easily collaborate across departments without anything getting lost."
            />
          </SimpleGrid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box bg={useColorModeValue('blue.500', 'blue.600')} py={16}>
        <Container maxW="container.xl">
          <VStack spacing={6} textAlign="center">
            <Heading color="white" size="xl">
              Ready to transform your team communication?
            </Heading>
            <Text color="whiteAlpha.900" fontSize="lg" maxW="2xl">
              Join thousands of teams already using Chat App to collaborate more effectively and get work done faster.
            </Text>
            <Button
              as={RouterLink}
              to="/register"
              size="lg"
              colorScheme="whiteAlpha"
              rounded="full"
              px={8}
              fontWeight="bold"
              _hover={{ bg: 'whiteAlpha.300' }}
            >
              Get Started Now
            </Button>
            <Text color="whiteAlpha.800" fontSize="sm">
              No credit card required • Free plan available
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;