import React from "react";
import { Box, Image, Text, Link, useMediaQuery } from "@chakra-ui/react";

interface NewsCardProps {
  image: string;
  title: string;
  source: string;
  description: string;
  url: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  image,
  title,
  source,
  description,
  url,
}) => {
  const [isSmallScreen] = useMediaQuery("(max-width: 768px)");

  return (
    <Box
      borderRadius="8px"
      bg="gray.200"
      p={4}
      mb={4}
      boxShadow="md"
      display="flex"
      flexDirection={isSmallScreen ? "column" : "row"} // Change direction for small screens
    >
      {isSmallScreen ? ( // Render image on top for small screens
        <Image
          src={image}
          alt={title}
          mb={4}
          borderRadius="8px"
          objectFit="cover"
          maxWidth="100%"
          maxHeight="200px"
        />
      ) : (
        // Render image on the left for larger screens with fixed size
        <Image
          src={image}
          alt={title}
          mr={4}
          borderRadius="8px"
          objectFit="cover"
          width="300px" // Fixed width for big screens
          height="200px" // Fixed height for big screens
        />
      )}
      <Box>
        <Text fontWeight="bold" fontSize="md" mb={2} mt={4}>
          {title}
        </Text>
        <Text fontSize="sm" color="gray.500" mb={2}>
          {source}
        </Text>
        <Text fontSize="sm" mb={4}>
          {description}
        </Text>
        <Link
          href={url}
          isExternal
          color="blue.500"
          fontWeight="bold"
          textDecoration="underline"
        >
          Read more
        </Link>
      </Box>
    </Box>
  );
};

export default NewsCard;
