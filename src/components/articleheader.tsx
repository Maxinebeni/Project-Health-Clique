import { Flex, Text, Image, Box } from "@chakra-ui/react";
import React from "react";
import { FaHandHoldingMedical } from "react-icons/fa";
import { FaSearch, FaBook } from "react-icons/fa"; // Import the search and book icons


const ArticleHeader: React.FC = () => {
  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="brand.100" />
      <Flex justifyContent="center" bg="white" height="50%">
        <Flex width="95%" maxWidth="860px" align="center">
          {/* <Image
            borderRadius="full"
            boxSize="70px"
            src="/images/blue.png" // Replace with your logo or use Icon component
            alt="Resource Corner Logo"
            position="relative"
            top={-3}
            color="blue.500"
            border="4px solid white"
          /> */}
          <Flex alignItems="center" padding="10px 16px">
            <FaBook size={24} />
            <Text ml={2} fontSize="3xl" fontWeight="bold">Resource Corner</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ArticleHeader;
