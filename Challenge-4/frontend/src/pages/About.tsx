import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Icon,
  Flex,
  Avatar,
  Link,
  Button,
  Badge,
  chakra,
  Image,
  useBreakpointValue,
  useColorModeValue
} from '@chakra-ui/react';
import {
  FaLaravel,
  FaReact,
  FaDatabase,
  FaLock,
  FaEnvelope,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone
} from 'react-icons/fa';
import { SiTypescript, SiChakraui, SiRedis } from 'react-icons/si';

// Create motion components with Chakra UI
const MotionBox = chakra(motion.div);

// Team Member component
const TeamMember = ({ 
  name, role, bio, image, socials 
}: { 
  name: string; 
  role: string; 
  bio: string; 
  image: string; 
  socials: { type: string; url: string; }[] 
}) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardShadow = useColorModeValue('md', 'dark-lg');
  const socialBg = useColorModeValue('gray.100', 'gray.700');
  const socialColor = useColorModeValue('blue.500', 'blue.300');
  
  const socialIcons = {
    github: FaGithub,
    twitter: FaTwitter,
    linkedin: FaLinkedin,
  };
  
  return (
    <MotionBox
      whileHover={{ y: -5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Box 
        p={6} 
        bg={cardBg} 
        borderRadius="xl" 
        boxShadow={cardShadow}
        overflow="hidden"
        height="100%"
      >
        <Stack spacing={4}>
          <Avatar 
            size="xl" 
            name={name} 
            src={image} 
            mb={2}
            border="4px solid"
            borderColor={useColorModeValue('blue.500', 'blue.400')}
          />
          <Stack spacing={1}>
            <Heading size="md">{name}</Heading>
            <Badge colorScheme="blue" fontSize="sm">{role}</Badge>
          </Stack>
          <Text fontSize="sm" textAlign="center" noOfLines={4}>
            {bio}
          </Text>
          <Stack direction="row" spacing={3} pt={2}>
            {socials.map(social => (
              <Link href={social.url} key={social.type} isExternal>
                <Box 
                  as="span" 
                  rounded="full" 
                  w={8} 
                  h={8} 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                  bg={socialBg}
                  color={socialColor}
                  transition="all 0.3s"
                  _hover={{ 
                    transform: 'scale(1.1)', 
                    bg: 'blue.500', 
                    color: 'white' 
                  }}
                >
                  <Icon as={socialIcons[social.type as keyof typeof socialIcons]} />
                </Box>
              </Link>
            ))}
          </Stack>
        </Stack>
      </Box>
    </MotionBox>
  );
};

// Tech Stack component
const TechStack = ({ icon, name, description }: { icon: React.ElementType; name: string; description: string }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.100', 'gray.600');
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  
  return (
    <MotionBox
      whileHover={{ y: -5 }}
      style={{ transition: 'all 0.3s ease' }}
    >
      <Box
        p={6}
        bg={cardBg}
        borderRadius="xl"
        boxShadow="lg"
        height="100%"
        border="1px solid"
        borderColor={borderColor}
      >
        <Stack spacing={4}>
          <Flex
            w="60px"
            h="60px"
            alignItems="center"
            justifyContent="center"
            borderRadius="xl"
            bg={bgColor}
            mb={2}
          >
            <Icon as={icon} w={8} h={8} color="blue.500" />
          </Flex>
          <Text fontWeight="bold" fontSize="lg">
            {name}
          </Text>
          <Text color={useColorModeValue('gray.600', 'gray.300')} textAlign="center">
            {description}
          </Text>
        </Stack>
      </Box>
    </MotionBox>
  );
};

// Contact Item component
const ContactItem = ({ icon, title, content, link = '' }: { icon: React.ElementType; title: string; content: string; link?: string }) => {
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  
  return (
    <Stack direction="row" spacing={4}>
      <Flex
        w="40px"
        h="40px"
        align="center"
        justify="center"
        borderRadius="lg"
        bg={bgColor}
      >
        <Icon as={icon} color="blue.500" />
      </Flex>
      <Stack align="flex-start" spacing={0}>
        <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')}>{title}</Text>
        {link ? (
          <Link href={link} color="blue.500" fontWeight="medium">
            {content}
          </Link>
        ) : (
          <Text fontWeight="medium">{content}</Text>
        )}
      </Stack>
    </Stack>
  );
};

const About = () => {
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const bgHighlight = useColorModeValue('gray.50', 'gray.800');
  const isSmallScreen = useBreakpointValue({ base: true, md: true });
  
  // Team data
  const team = [
    {
      name: "Farman Othman",
      role: "Full Stack Developer & Creator",
      bio: "Farman is a passionate developer with expertise in Laravel, React, and TypeScript. Dedicated to building intuitive and scalable applications that deliver seamless user experiences.",
      image: "https://github.com/FarmanOthman/FarmanOthman/blob/main/My%20photo.jpg?raw=true",
      socials: [
        { type: "github", url: "https://github.com/FarmanOthman" },
        // You can add more social links if needed
        // { type: "linkedin", url: "https://linkedin.com/in/your-profile" },
        // { type: "twitter", url: "https://twitter.com/your-handle" },
      ]
    }
  ];

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Box as="section" py={{ base: 10, md: 20 }} overflow="hidden">
        <Container maxW="container.xl">
          {/* Hero Section */}
          <Stack direction={{ base: 'column', lg: 'row' }} align="center" spacing={{ base: 8, lg: 16 }} pb={{ base: 16, md: 20 }}>
            <Stack spacing={4} maxW="lg">
              <Heading 
                as="h1" 
                size="2xl" 
                lineHeight="shorter" 
                fontWeight="bold"
              >
                Building the Future of Real-Time Communication
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }} color={textColor}>
                Our modern chat application combines powerful technology with intuitive design to deliver 
                a seamless communication experience for teams and individuals.
              </Text>
            </Stack>
            <Box
              w={{ base: 'full', md: '50%' }}
              h={{ base: '300px', md: '400px' }}
              position="relative"
              overflow="hidden"
              rounded="2xl"
              boxShadow="2xl"
            >
              <Image 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
                alt="Team collaboration" 
                objectFit="cover"
                w="full"
                h="full"
              />
            </Box>
          </Stack>

          {/* Divider */}
          <Box my={{ base: 8, md: 16 }} />

          {/* Technology Section */}
          <Box as="section" py={{ base: 8, md: 16 }} id="technology">
            <Stack spacing={{ base: 10, md: 16 }}>
              <Stack textAlign="center">
                <Heading as="h2" size="xl" mb={4}>Our Technology Stack</Heading>
                <Text fontSize="lg" maxW="2xl" mx="auto" color={textColor}>
                  We've built our platform using cutting-edge technologies to ensure reliability,
                  scalability, and outstanding performance.
                </Text>
              </Stack>
              
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={8} w="full">
                <TechStack 
                  icon={FaLaravel}
                  name="Laravel"
                  description="Robust backend framework powering our API and core business logic."
                />
                <TechStack 
                  icon={FaReact}
                  name="React"
                  description="Modern frontend library for building dynamic and responsive user interfaces."
                />
                <TechStack 
                  icon={SiTypescript}
                  name="TypeScript"
                  description="Static typing for JavaScript to enable safer, more predictable code."
                />
                <TechStack 
                  icon={SiChakraui}
                  name="Chakra UI"
                  description="Component library for building accessible and themeable React applications."
                />
                <TechStack 
                  icon={FaDatabase}
                  name="MySQL"
                  description="Relational database storage for user data and message history."
                />
                <TechStack 
                  icon={SiRedis}
                  name="Redis"
                  description="In-memory data structure store for caching and real-time operations."
                />
                <TechStack 
                  icon={FaReact}
                  name="WebSockets"
                  description="Full-duplex communication channels for real-time messaging."
                />
                <TechStack 
                  icon={FaLock}
                  name="JWT Auth"
                  description="Secure token-based authentication to protect user data."
                />
              </SimpleGrid>
            </Stack>
          </Box>

          {/* Features Section */}
          <Box as="section" py={{ base: 8, md: 16 }} bg={bgHighlight} mt={16} borderRadius="xl" id="features">
            <Container maxW="container.xl">
              <Stack spacing={{ base: 8, md: 12 }} align="start">
                <Stack spacing={4} align="start" w="full">
                  <Heading as="h2" size="xl">Key Features</Heading>
                  <Text fontSize="lg" color={textColor}>
                    Our application comes packed with features designed to enhance communication and collaboration.
                  </Text>
                </Stack>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={10} w="full">
                  <Box>
                    <Heading size="md" mb={4}>Communication</Heading>
                    <Stack spacing={2}>
                      <Text>Real-time messaging with instant delivery</Text>
                      <Text>Direct messaging between users</Text>
                      <Text>Group chat rooms with flexible permissions</Text>
                      <Text>Rich media sharing including images and files</Text>
                      <Text>Typing indicators and read receipts</Text>
                    </Stack>
                  </Box>
                  <Box>
                    <Heading size="md" mb={4}>User Experience</Heading>
                    <Stack spacing={2}>
                      <Text>Intuitive, responsive interface across devices</Text>
                      <Text>Dark and light mode support</Text>
                      <Text>Message search and history navigation</Text>
                      <Text>User presence indicators</Text>
                      <Text>Customizable notification settings</Text>
                    </Stack>
                  </Box>
                </SimpleGrid>
              </Stack>
            </Container>
          </Box>

          {/* Team Section */}
          <Box as="section" py={{ base: 8, md: 16 }} id="team">
            <Stack spacing={12}>
              <Stack spacing={4} textAlign="center">
                <Heading as="h2" size="xl">About the Developer</Heading>
                <Text fontSize="lg" maxW="2xl" mx="auto" color={textColor}>
                  The person behind this innovative communication platform.
                </Text>
              </Stack>
              
              <Flex justifyContent="center" w="full">
                <Box maxW="md" w="full">
                  <TeamMember 
                    name={team[0].name}
                    role={team[0].role}
                    bio={team[0].bio}
                    image={team[0].image}
                    socials={team[0].socials}
                  />
                </Box>
              </Flex>
            </Stack>
          </Box>

          {/* Contact Section */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={10} mt={16} id="contact">
            <Stack align="start" spacing={8}>
              <Stack align="start" spacing={4}>
                <Heading as="h2" size="xl">Get In Touch</Heading>
                <Text fontSize="lg">
                  Have questions about our platform or interested in learning more?
                  We'd love to hear from you!
                </Text>
              </Stack>
              
              <SimpleGrid columns={{ base: 1, sm: isSmallScreen ? 1 : 2 }} gap={6} w="full">
                <Button
                  colorScheme="blue"
                  size="lg"
                  borderRadius="lg"
                  as="a"
                  href="mailto:contact@chatapp.com"
                  leftIcon={<Icon as={FaEnvelope} />}
                >
                  Email Us
                </Button>
                
                <Stack spacing={4} align="start">
                  <ContactItem 
                    icon={FaMapMarkerAlt}
                    title="Our Location"
                    content="Iraq, Erbil, 44001"
                    link="https://goo.gl/maps/xyz123"
                  />
                  <ContactItem 
                    icon={FaPhone}
                    title="Phone Number"
                    content="+964 (750) 394-7964"
                    link="tel:+9647503947964"
                  />
                  <ContactItem 
                    icon={FaEnvelope}
                    title="Email Address"
                    content="farmaanothmaan@gmail.com"
                    link="mailto:farmaanothmaan@gmail.com"
                  />
                </Stack>
              </SimpleGrid>
              
              <SimpleGrid columns={2} width="100%" gap={4}>
                <Stack align="start" spacing={4}>
                  <Text fontWeight="bold">Connect With Us</Text>
                  <Stack direction="row" spacing={4}>
                    <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                      <Box
                        w={10}
                        h={10}
                        rounded="full"
                        bg="gray.100"
                        _dark={{ bg: "gray.700" }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        transition="all 0.3s"
                        _hover={{ bg: 'blue.500', color: 'white' }}
                      >
                        <Icon as={FaGithub} />
                      </Box>
                    </Link>
                    <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                      <Box
                        w={10}
                        h={10}
                        rounded="full"
                        bg="gray.100"
                        _dark={{ bg: "gray.700" }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        transition="all 0.3s"
                        _hover={{ bg: 'blue.500', color: 'white' }}
                      >
                        <Icon as={FaTwitter} />
                      </Box>
                    </Link>
                  </Stack>
                </Stack>
              </SimpleGrid>
            </Stack>
            
            <MotionBox 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition="0.5s ease 0.2s"
            >
              <Box 
                overflow="hidden" 
                borderRadius="xl" 
                boxShadow="xl" 
                height={{ base: '300px', md: '100%' }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                  alt="Our office"
                  objectFit="cover"
                  w="full"
                  h="full"
                />
              </Box>
            </MotionBox>
          </SimpleGrid>
        </Container>
      </Box>
    </MotionBox>
  );
};

export default About;
