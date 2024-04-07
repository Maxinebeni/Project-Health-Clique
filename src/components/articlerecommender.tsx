import React, { useState } from "react";
import { Flex, Text, Stack, Button, Icon, Divider } from "@chakra-ui/react";
import { FaRegBookmark } from "react-icons/fa"; // Import icon from react-icons library
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import CreateDatabaseModal from "./Modal/DatabaseModal/CreateDatabaseModal";


interface ArticleRecommenderProps {
  recommendedArticles: string[]; // Array of links
  handleArticleClick: (articleId: string) => Promise<void>;
}

const ArticleRecommender: React.FC<ArticleRecommenderProps> = ({
  recommendedArticles,
  handleArticleClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
    <Flex
    justify="space-between"
    align="center"
    p={3}
    color="white"
    bg="none"
    borderRadius="4px 4px 0px 0px"
    borderTopColor="gray.100"
    >
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      border="1px solid"
      borderColor="gray.300"
      width="110%" // Adjust the width as needed
      mt={8}
      p={4}
    >
      <Flex
        align="center"
        color="black"
        fontWeight={600}
        fontSize="18px"
        mb={4}
      >
        <FaRegBookmark size={24} color="#3182CE" /> {/* Icon */}
        <Text ml={2} fontSize={15}>Based on Your History</Text>
      </Flex>
      <Stack spacing={4} fontSize="15px">
        {/* Divider */}
        <hr style={{ borderTop: "1px solid #E2E8F0", width: "100%" }} />
        <Text fontSize="10pt" fontWeight={700} color= "black">
        Recommended For You..
        </Text>

        {/* Recommended articles */}
        {recommendedArticles.map((link, index) => (
          <Text key={index} color="blue.500">
            <a href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
          </Text>
        ))}
        {/* Button to add article */}
        <Button
          colorScheme="brand.100"
          variant="solid"
          onClick={openModal} // Open the modal when clicked
          >
          Add Article
        </Button>
      </Stack>
    </Flex>
    </Flex>
    <CreateDatabaseModal
  open={isModalOpen}
  handleClose={closeModal}
  user={null} // Pass null instead of undefined
/>
        </>
  
  );
};

export default ArticleRecommender;
