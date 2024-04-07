import { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Image, Text, Flex } from "@chakra-ui/react";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const [hasClosedModal, setHasClosedModal] = useState(false);

  useEffect(() => {
    const hasClosed = localStorage.getItem('hasClosedSignUpModal');
    if (hasClosed === 'true') {
      setHasClosedModal(true);
    }
  }, []);

  const handleClose = () => {
    setHasClosedModal(true);
    localStorage.setItem('hasClosedSignUpModal', 'true');
    onClose();
  };

  if (!isOpen || hasClosedModal) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex align="center" justify="center" direction="column">
            <Image
              src="/images/2.png"
              width="130px"
              height="50px"
              alt="Signup"
              mb={4}
              mt={4} // Add margin bottom to create space between image and text
            />
            <Text align="center">
              Welcome to Health Clique!
            </Text>
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Text align="center">
            Thank you for signing up! We&apos;re excited to have you on board. Happy Collaboration!
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleClose}>
            GET STARTED
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignUpModal;
