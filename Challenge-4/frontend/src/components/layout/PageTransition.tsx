import { motion } from 'framer-motion';
import { chakra } from '@chakra-ui/react';

const MotionBox = chakra(motion.div);

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <MotionBox
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </MotionBox>
  );
};

export default PageTransition;