

import React from "react";
import NewsCard from "./NewsCard";
import newslist from "@/assets/news.json";
import { Box, Center, Text } from "@chakra-ui/react";

const HealthcareNewsPage = () => {
  return (
    <Box
      bg="gray.100"
      pt={16}
      px={4}
      textAlign="center"
      display="flex"
      flexDirection="column"
      maxWidth="900px" // Set maximum width here
      margin="auto" // Center the box horizontally

    >
      <Box mb={8}>
        <Text fontSize="3xl" fontWeight="bold">
          Latest in Health News
        </Text>
      </Box>
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        gridGap={4}
      >
        {newslist.articles.map((news, index) => (
          <NewsCard
            key={index}
            image={news.image}
            title={news.title}
            source={news.source.name}
            description={news.description}
            url={news.url}
          />
        ))}
      </Box>
    </Box>
  );
};

HealthcareNewsPage.displayName = "HealthcareNewsPage";

const HealthNewsPageWrapper = () => <HealthcareNewsPage />;
export default HealthNewsPageWrapper;
