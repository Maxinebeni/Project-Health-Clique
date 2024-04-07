import { Flex, Icon, Input} from "@chakra-ui/react";
import { FaUserDoctor } from "react-icons/fa6";
import { IoImageOutline } from "react-icons/io5";
import { BsLink45Deg } from "react-icons/bs";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import useDirectory from "@/hooks/useDirectory";
import { useRouter } from "next/router";

const CreatePostLink: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const { toggleMenuOpen } = useDirectory();

  const onClick = () => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    const { communityId } = router.query;

    if (communityId) {
      router.push(`/healthclique/${communityId}/submit`);
      return;
    }
    toggleMenuOpen();
  };

  return (
    <Flex
      justify="space-evenly"
      align="center"
      bg="white"
      height="100px"
      borderRadius={4}
      border="1px solid"
      borderColor="gray.300"
      p={2}
      mb={4}
      bgImage="url('images/cre.png')" // Background image URL
      bgSize="cover"
      bgPosition="center"

    >
      <Icon as={FaUserDoctor} fontSize={32} color="gray.400" mr={4} />
      <Input
        placeholder="Create Post in a Community"
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
        borderColor="gray.200"
        height="40px"
        borderRadius={4}
        mr={4}
        onClick={onClick}
      />
      <Icon
        as={IoImageOutline}
        fontSize={24}
        mr={4}
        color="gray.400"
        cursor="pointer"
        onClick={onClick}

      />
      <Icon as={BsLink45Deg} fontSize={24} color="gray.400" cursor="pointer" onClick={onClick}
/>
    </Flex>
  );
};

export default CreatePostLink;
