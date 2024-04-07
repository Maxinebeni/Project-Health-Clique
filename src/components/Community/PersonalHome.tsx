import React, { useState } from "react";
import { Button, Flex, Icon, Stack, Text, Box } from "@chakra-ui/react";
import { FaReddit } from "react-icons/fa";
import CreateCommunityModal from "../Modal/CreateCommunity/CreateCommunityModal";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";
import Image from "next/image";

const PersonalHome: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);

  const handleCreateCommunityClick = () => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
    } else {
      setIsModalOpen(true); // Open the modal
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreatePostClick = () => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
    } else {
      // Handle create post logic
    }
  };

  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor="gray.300"
      position="sticky"
      width="110%" // Adjust the width as needed
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="34px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url(/images/personal.png)"
        backgroundSize="cover"
      ></Flex>
      <Flex direction="column" p="12px">
        <Flex align="center" mb={3}>
          <Image
            src="/images/iconp.gif"
            alt="Iconp for Personal Home"
            width={40}
            height={40}
            style={{ marginRight: "3px" }} // Use inline style for margin-right
            />
          <Text fontWeight={600} fontSize={15}>
            Home
          </Text>
        </Flex>
        <Stack spacing={4}>
          <Text>
            Crafting Your Personalized Homepage: Tailored for You.
          </Text>
          <Flex>
            <Button
              width="100%"
              height="30px"
              justifyContent="center"
              bg="brand.100"
              onClick={handleCreatePostClick} // Add onClick handler
            >
              Create Post
            </Button>
          </Flex>
          <Flex>
            <Button
              variant="outline"
              height="30px"
              width="100%"
              onClick={handleCreateCommunityClick} // Add onClick handler
            >
              Create Community
            </Button>
          </Flex>
        </Stack>
      </Flex>
      <CreateCommunityModal open={isModalOpen} handleClose={handleCloseModal} />
    </Flex>
  );
};
export default PersonalHome;
