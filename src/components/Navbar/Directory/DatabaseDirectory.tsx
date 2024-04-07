import { authModalState } from "@/atoms/authModalAtom";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, Button, MenuList, MenuItem, Icon, Flex, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import { MdGroups3 } from "react-icons/md";
import Communities from "./Communities";
import Database from "./Database";
import { MdOutlineLibraryBooks } from "react-icons/md";

const DatabaseMenu: React.FC= ()  =>{
    return(
        <Menu>
            <Tooltip label="Resources" fontSize={12}>
                <MenuButton
                    cursor='pointer'
                    padding ='0px 6px'
                    borderRadius={4}
                    mr ={2}
                    ml= {{base: 0, md: 2}}
                    _hover={{outline: '1px solid', outlineColor: 'blue.200'}}
                >
                    <Flex align= 'center' justify = 'space-between' width= {{base: 'auto', lg: "50px"}}>
                        <Flex align= 'center'>
                            <Icon fontSize={26} as={MdOutlineLibraryBooks} mr={{base:1, md:2}}/>
                        </Flex>
                        <ChevronDownIcon/>
                    </Flex>
                </MenuButton>
            </Tooltip>
            <MenuList>
                <Database/>
            </MenuList>
        </Menu>
    );
};

export default DatabaseMenu;
