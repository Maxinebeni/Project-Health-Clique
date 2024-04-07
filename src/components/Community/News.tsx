import React from "react";
import { Flex, Icon, Text, Stack, Button } from "@chakra-ui/react";
import { FaRegNewspaper } from "react-icons/fa6";
import router from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";

const Premium: React.FC = () => {
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);

  const redirectToHealthcareNewsPage = () => {
    router.push("healthclique/latestNews/HealthcareNewsPage"); // Replace with the actual path of the Healthcare News Page
  };

  const handleViewClick = () => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
    } else {
      redirectToHealthcareNewsPage();
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
        <Icon as={FaRegNewspaper} fontSize={26} color="brand.100" mt={2} />
        <Stack spacing={1} fontSize="9pt" pl={2}>
          <Text fontWeight={600} fontSize={15} mt={2} mb={2}>News Corner</Text>
          <Text textAlign="center" mb={2}>Stay Updated with the Latest Health News.</Text>
        </Stack>
      </Flex>
      <Button
        height="30px"
        bg="brand.100"
        onClick={handleViewClick}
        disabled={!user} // Disable the button if user is not logged in
      >
        View
      </Button>
    </Flex>
  );
};

export default Premium;
