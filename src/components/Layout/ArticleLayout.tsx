import React, { useState } from "react";
import { Box, Flex, Button, useDisclosure, useMediaQuery, Portal } from "@chakra-ui/react";
import { GrAdd } from "react-icons/gr";

interface ArticleLayoutProps {
  maxWidth?: string;
  leftContent: React.ReactNode; // Define the left content prop
  rightContent?: React.ReactNode; // Define the right content prop (optional)
}

const ArticleLayout: React.FC<ArticleLayoutProps> = ({ leftContent, rightContent, maxWidth }) => {
  const [showRightContent, setShowRightContent] = useState(false);
  const [isSmallScreen] = useMediaQuery("(max-width: 768px)");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Flex justify="center" p="80px 0px" position="relative">
      {/* Button to toggle right content on small screens */}
      {isSmallScreen && rightContent && (
        <Button
          onClick={isOpen ? onClose : onOpen}
          position="absolute"
          top="10px"
          right="10px"
          zIndex="999"
          colorScheme="blue"
          borderRadius="50%"
          p="2"
        >
          <GrAdd />
        </Button>
      )}
      <Flex width="95%" justify="center" maxWidth={maxWidth || "860px"}>
        {/* Left Content */}
        <Flex
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: 6 }}
        >
          {leftContent}
        </Flex>
        {/* Right Content */}
        <Box
          display={{ base: isOpen ? "flex" : "none", md: "flex" }}
          flexDirection="column"
          flexGrow={1}
          position="relative"
          height="100%"
        >
          {isOpen && (
            <Box
              position="fixed"
              top="0"
              right="0"
              bottom="0"
              left="25%" // Change this value to open the drawer to 3/4 width
              bg="white"
              zIndex="998"
              p="20px"
              overflowY="scroll"
            >
              {rightContent}
            </Box>
          )}
          {rightContent}
          {isOpen && (
            <Portal>
              <Box
                position="fixed"
                top="0"
                right="0"
                bottom="0"
                left="0"
                zIndex="997"
                onClick={handleOverlayClick}
              />
            </Portal>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default ArticleLayout;