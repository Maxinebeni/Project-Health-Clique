import { Flex, Image, useMediaQuery, Spacer, Box } from "@chakra-ui/react";
import React from "react";
import SearchInput from "./SearchInput";
import RightContent from "./RightContent/RightContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import Directory from "./Directory/Directory";
import DatabaseDirectory from "./Directory/DatabaseDirectory";
import useDirectory from "@/hooks/useDirectory";
import { defaultMenuItem } from "@/atoms/directoryMenuAtom";

const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();
  const [isSmallScreen] = useMediaQuery("(max-width: 768px)");
  const [isTinyScreen] = useMediaQuery("(max-width: 480px)");

  const shouldRenderSearchInput = !isSmallScreen;
  const shouldRenderSecondLogo = !isSmallScreen && !isTinyScreen;

  return (
    <Flex
      bg="white"
      height="70px"
      padding="6px 12px"
      justify="space-between"
      alignItems="center"
      mr={{ base: 0, md: 2 }}
    >
      <Flex align="center" cursor="pointer">
        {isSmallScreen ? (
          // Show the first logo only on small screens
          <Image
            src="/images/2.png"
            height="40px"
            alt="Second Logo"
            onClick={() => onSelectMenuItem(defaultMenuItem)}
          />
        ) : (
          <>
            <Image
              src="/images/2.png"
              height="40px"
              alt="Second Logo"
              mr={shouldRenderSecondLogo ? 2 : 0}
              onClick={() => onSelectMenuItem(defaultMenuItem)}
            />
            {shouldRenderSecondLogo && (
              <Image src="/images/3.png" height="46px" alt="Main logo" />
            )}
          </>
        )}
        {shouldRenderSearchInput && (
          <Flex flexGrow={1} ml={2} mr={2}>
            <SearchInput user={user} width={{ base: "100%", md: "auto" }} />
          </Flex>
        )}
      </Flex>
      {/* Spacer to evenly space the elements */}
      <Spacer />
      {user && <Directory />}
      {user && <DatabaseDirectory />}
      <RightContent user={user} />
    </Flex>
  );
};

export default Navbar;
