import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text, Button } from "@chakra-ui/react";

const AdModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg='none' backdropFilter='blur(10px)' />
      <ModalContent>
        <ModalHeader textAlign='center' >Advertisements</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text textAlign='center'>Nothing to see yet here. Check back in after a while.</Text>
        </ModalBody>
        <ModalFooter>
          <Button           
          width="20%"
          height="36px"
          mb={2}
          mt={2}
          colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdModal;
