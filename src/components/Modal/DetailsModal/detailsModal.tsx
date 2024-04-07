import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  ModalFooter,
  Button,
  Checkbox,
  Flex,
  Box
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} colorScheme="black">
      <ModalOverlay bg="none" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader textAlign="center">Instructions</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column">
            <Text color="red" fontWeight="bold" mb={2}>
              Instructions for adding an article to the database:
            </Text>
            <Checkbox defaultChecked isDisabled>
              <Text color= "black">
                <Box as="span" color="red.500">*</Box> Post URL/PDF ONLY
              </Text>
            </Checkbox>
            <Checkbox defaultChecked isDisabled>
              <Text  color= "black">
                <Box as="span" color="red.500">*</Box> Article/Paper must be health-related. Non-health articles will be rejected.
              </Text>
            </Checkbox>
            <Checkbox defaultChecked isDisabled>
              <Text>
                <Box as="span" color="red.500">*</Box> Add a title to your post ALWAYS.
              </Text>
            </Checkbox>
            <Checkbox defaultChecked isDisabled>
              Be patient while your resource is being added, as the system is still checking.
            </Checkbox>
            <Checkbox defaultChecked isDisabled mb={3}>
              Do not add the same resource twice.
            </Checkbox>
            <Text mt={2} fontSize="sm">
              As the poster of the resource, you can delete it in the Resource Corner Page.
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            width="20%"
            height="36px"
            mb={2}
            mt={2}
            colorScheme="blue"
            onClick={onClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailsModal;
