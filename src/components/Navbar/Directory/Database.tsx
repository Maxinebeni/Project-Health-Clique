import React, { useState } from "react";
import { Box, Divider, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import { GrAdd } from "react-icons/gr";
import CreateDatabaseModal from "@/components/Modal/DatabaseModal/CreateDatabaseModal";
import router from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { IoIosAddCircleOutline } from "react-icons/io";
import { GrResources } from "react-icons/gr";



type DatabaseProps = {};

const Database: React.FC<DatabaseProps> = () => {
  const [open, setOpen] = useState(false);
  const [user] = useAuthState(auth);


  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleSeeResources = () => {
    router.push("/healthclique/Articles");
  };


  return (
    <>
      {user && (
      <CreateDatabaseModal open={open} handleClose={() => setOpen(false)} user={user} /> )}
      <MenuItem
        width="100%"
        fontSize={11}
        _hover={{ bg: "gray.100" }}
        onClick={handleOpenModal} // Handle click event to open modal
        mb={2}
        mt={4}
      >
        <Flex align="center">
        <Icon fontSize={22} mr ={2} as={IoIosAddCircleOutline} color ="brand.100"/>
          Add Resources
        </Flex>
      </MenuItem>
      <Divider color="brand.100"/>
      <MenuItem
      mt={2}
        width="100%"
        fontSize={11}
        _hover={{ bg: "gray.100" }}
        onClick={handleSeeResources} // Handle click event to open modal

      >
        <Flex align="center">
        <Icon fontSize={22} mr ={2} as={GrResources } color ="brand.100"/>
          Resource Corner
        </Flex>
      </MenuItem>
    </>
  );
};

export default Database;
