import React from "react";
import { Flex, Icon, Text, Stack, Button } from "@chakra-ui/react";
import { GrResources } from "react-icons/gr";
import router from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";

interface PremiumProps {
  recommendedArticles: string[]; // Array of links
  handleArticleClick: (articleId: string)=> Promise<void>;
}

const handleSeeResources = () => {
  router.push("/healthclique/Articles");
};

const Premium: React.FC<PremiumProps> = ({ recommendedArticles }) => {
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);

  const handleSeeResourcesClick = () => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
    } else {
      handleSeeResources();
    }
  };

  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      p="12px"
      border="1px solid"
      borderColor="gray.300"
      width="110%" // Adjust the width as needed
    >
      <Flex mb={2}>
        <Icon as={GrResources} fontSize={26} color="brand.100" mt={2} />
        <Stack spacing={1} fontSize="9pt" pl={2}>
          <Text fontWeight={600} fontSize={15} mt={2}>Resource Corner</Text>
          <Flex mb={2}>
            <Stack spacing={1} fontSize="9pt" >
              <Text fontWeight={400} fontSize={15} mb={2} mt={2}>Discover Relevant Articles.</Text>
            </Stack>
          </Flex>
        </Stack>
      </Flex>
      <Button
        height="30px"
        bg="brand.100"
        onClick={handleSeeResourcesClick} // Handle click event to open modal
        disabled={!user} // Disable the button if user is not logged in
      >
        See Resources
      </Button>
    </Flex>
  );
};

export default Premium;
