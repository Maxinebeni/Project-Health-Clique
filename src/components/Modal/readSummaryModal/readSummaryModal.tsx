import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Text } from "@chakra-ui/react";

interface ReadSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string; // Assuming the summary is a string
}

const ReadSummaryModal: React.FC<ReadSummaryModalProps> = ({ isOpen, onClose, summary }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Article Summary</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={3}>{summary}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReadSummaryModal;
