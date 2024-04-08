import { Flex, Image, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import SearchInput from "./SearchInput";
import RightContent from "./RightContent/RightContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import Directory from "./Directory/Directory";
import DatabaseDirectory from "./Directory/DatabaseDirectory";
import useDirectory from "@/hooks/useDirectory";
import { defaultMenuItem } from "@/atoms/directoryMenuAtom";
import { User } from "firebase/auth";

const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();
  const [isSmallScreen] = useMediaQuery("(max-width: 500px)"); // Max width for small screens
  const [isverySmallScreen] = useMediaQuery("(max-width: 414px)"); // Max width for very small screens

  return (
    <Flex
      bg="white"
      height="70px"
      padding="6px 12px"
      justifyContent="space-between"
      alignItems="center"
    >
      <Flex
        align="center"
        width={{ base: "100px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
        cursor="pointer"
        onClick={() => onSelectMenuItem(defaultMenuItem)}
      >
        <Image
          src="/images/hq00.svg"
          width="100px"
          alt="First Logo"
          ml={2}
        />
        {!isSmallScreen && <Image src="/images/hq0.svg" height="140px" alt="Main logo" />}
      </Flex>
      {user && <Directory />}
      {user && <DatabaseDirectory />}
      <SearchInput user={user as User} />
      <RightContent user={user as User} />
    </Flex>
  );
};

export default Navbar;