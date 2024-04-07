import React, { useState } from "react";
import { Icon, Flex, Text, Tooltip } from "@chakra-ui/react";
import { BsArrowUpRightCircle, BsChatDots } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import { IoFilterCircleOutline, IoNotificationsOutline } from "react-icons/io5";
import { RiAdvertisementLine } from "react-icons/ri";
import { SiGooglenews } from "react-icons/si";
import AdModal from "@/components/Modal/adModal/adModal";
import { useRouter } from "next/router";
import CreateCommunityModal from "@/components/Modal/CreateCommunity/CreateCommunityModal";
import { PiNewspaperClipping } from "react-icons/pi";
import { BsCardHeading } from "react-icons/bs";
import { BsJournalMedical } from "react-icons/bs";

const Icons: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

  const handleAdvertisementClick = () => {
    setIsAdModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseAdModal = () => {
    setIsAdModalOpen(false);
  };

  const handleGoogleNewsClick = () => {
    router.push("/healthclique/latestNews/HealthcareNewsPage");
  };

  const handleArticleClick = () => {
    router.push("/healthclique/Articles");
  };

  const handleCreateCommunityClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  return (
    <Flex>
      <Flex
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        borderRight="1px solid"
        borderColor="gray.200"
      >
        <Tooltip label="Notifications" fontSize={12}>
          <Flex
            mr={1.5}
            ml={1.5}
            padding={1}
            cursor="pointer"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
          >
            <Icon as={IoNotificationsOutline} fontSize={22} />
          </Flex>
        </Tooltip>
        <Tooltip label="Advertisements" fontSize={12}>
          <Flex
            mr={1.5}
            ml={1.5}
            padding={1}
            cursor="pointer"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            onClick={handleAdvertisementClick}
          >
            <Icon as={RiAdvertisementLine} fontSize={22} />
          </Flex>
        </Tooltip>
        <AdModal isOpen={isAdModalOpen} onClose={handleCloseAdModal} />
      </Flex>
      <>
        <Tooltip label="Resources" fontSize={12}>
          <Flex
            mr={1.5}
            ml={1.5}
            padding={1}
            cursor="pointer"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            onClick={handleArticleClick}
          >
            <Icon as={BsJournalMedical} fontSize={20} />
          </Flex>
        </Tooltip>
        <Tooltip label="News" fontSize={12}>
          <Flex
            mr={1.5}
            ml={1.5}
            padding={1}
            cursor="pointer"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            onClick={handleGoogleNewsClick}
          >
            <Icon as={BsCardHeading} fontSize={22} />
          </Flex>
        </Tooltip>
        <Tooltip label="Create Community" fontSize={12}>
          <Flex
            display={{ base: "none", md: "flex" }}
            mr={1.5}
            ml={1.5}
            padding={1}
            cursor="pointer"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            onClick={handleCreateCommunityClick} // Add onClick handler
          >
            <Icon as={GrAdd} fontSize={20} color="brand.100" />
          </Flex>
        </Tooltip>
      </>
      <CreateCommunityModal open={isModalOpen} handleClose={handleCloseModal} />
    </Flex>
  );
};

export default Icons;
