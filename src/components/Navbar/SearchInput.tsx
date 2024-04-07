import { SearchIcon } from "@chakra-ui/icons";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";

type SearchInputProps ={

  user?: User | null;
  width?: { base: string; md: string }; // Make width prop optional

  };
  

const SearchInput: React.FC<SearchInputProps> = ({user, width}) => {
  return (
    <Flex flexGrow={1} mr={2} align="center"  maxWidth= {user ? "auto" : "600px"}>
      <InputGroup flex="1" alignItems="center" size="xs">
        <InputLeftElement pointerEvents="none" h="100%" display="flex" alignItems="center" pl={2}>
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search Health Clique"
          fontSize="10pt"
          _placeholder={{ color: "gray.500", ml: "32px" }} // Adjust left margin
          _hover={{ bg: "white", border: "1px solid", borderColor: "blue.500" }}
          _focus={{ outline: "none", border: "1px solid", borderColor: "blue.500" }}
          height="34px"
          bg="gray.50"
          pl="32px" // Adjusted left padding
          py="3px"
        />
      </InputGroup>
    </Flex>
  );
};

export default SearchInput;
