import { authModalState } from "@/atoms/authModalAtom";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, Button, MenuList, MenuItem, Icon, Flex, Text, Image, Tooltip } from "@chakra-ui/react";
import React from "react";
import { MdGroups3 } from "react-icons/md";
import Communities from "./Communities";
import useDirectory from "@/hooks/useDirectory";

const Directory: React.FC= ()  =>{
    const {directoryState, toggleMenuOpen} = useDirectory();

    return(
        <Menu isOpen={directoryState.isOpen} onClose={toggleMenuOpen}>
            <Tooltip label="Community" fontSize={12}>
                <MenuButton
                    cursor='pointer'
                    padding ='0px 6px'
                    borderRadius={4}
                    mr ={2}
                    ml= {{base: 0, md: 2}}
                    _hover={{outline: '1px solid', outlineColor: 'blue.200'}}
                    onClick= {toggleMenuOpen}
                >
                    <Flex align= 'center' justify='space-between' width={{base: 'auto', lg: "50px"}}>
                        <Flex align= 'center'>
                            {directoryState.selectedMenuItem.imageURL ? (
                                <Image
                                    borderRadius="full"
                                    boxSize="24px"
                                    src={directoryState.selectedMenuItem.imageURL}
                                    mr={2}
                                    alt="selected community"
                                />
                            ) : (
                                <Icon
                                    fontSize={26}
                                    mr={{base:1, md:2}}
                                    as={directoryState.selectedMenuItem.icon}
                                    color={directoryState.selectedMenuItem.iconColor}
                                />
                            )}
                        </Flex>
                        <ChevronDownIcon/>
                    </Flex>
                </MenuButton>
            </Tooltip>
            <MenuList>
                <Communities/>
            </MenuList>
        </Menu>
    );
};

export default Directory;
