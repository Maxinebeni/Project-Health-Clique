import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Text, Flex, Icon } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { IoPerson } from "react-icons/io5";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: User | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userData }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        bgImage="url('/images/f_page.png')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgAttachment="fixed"
        borderRadius="md"
        boxShadow="lg"
        p={5}
        // color="gray.800"
      >
        <ModalHeader>
          <Flex alignItems="center" justifyContent="center" mb={1} mt={5}>
            <Icon as={IoPerson} fontSize="4xl" color="brand.100" mr={2} />
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" alignItems="center" mb={5}>
            <Text textAlign="center" fontSize="lg" fontWeight="bold" mb={2}>Hey {userData?.displayName || userData?.email?.split("@")[0]}</Text>
            <Text fontSize="lg">Your Profile</Text>
          </Flex>
          <Text textAlign="center" >Email: {userData?.email}</Text>
          <Text textAlign="center" >Display Name: {userData?.displayName || userData?.email?.split("@")[0]}</Text>
          <Text color="brand.100" textAlign="center" mb={5}>Joined: {userData?.metadata.creationTime}</Text>
          {/* Add other user information as needed */}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProfileModal;
