import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, Button, MenuList, MenuItem, Icon, Flex, MenuDivider } from "@chakra-ui/react";
import { User, signOut } from "firebase/auth";
import { set } from "firebase/database";
import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { Text } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { auth } from "@/firebase/clientApp";
import { authModalState } from "@/atoms/authModalAtom";
import { IoPerson } from "react-icons/io5";
import { communityState } from "@/atoms/communitiesAtom";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { FaNewspaper } from "react-icons/fa";
import { MdOutlineGroups3 } from "react-icons/md";
import router from "next/router";
import { IoHomeOutline } from "react-icons/io5";
import ProfileModal from "@/components/Modal/ProfileModal";
import { FaChartBar } from 'react-icons/fa';




const handleSeeResources = () => {
  router.push("/healthclique/Articles");
};

const handlehome = () => {
  router.push("/");
};

const handleNews = () => {
  router.push("/healthclique/latestNews/HealthcareNewsPage");
};


const handleallCommunities = () => {
  router.push("/healthclique/allCommunities");
};



type UserMenuProps ={

user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({user})  =>{
    const setAuthModalState = useSetRecoilState(authModalState);
    const resetCommunityState = useResetRecoilState(communityState);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const handleProfileClick = () => {
      setIsProfileModalOpen(true); // Open the profile modal
    };

    const handleHomeRedirect = () => {
      router.push("https://healthc.vercel.app/");
    };
    
  


    const logout = async () => {
      await signOut(auth);
      resetCommunityState();
      router.push("/"); // Redirect to home page after logging out
    };  

    return(
      <>

      <Menu>
        <MenuButton cursor='pointer' padding ='0px 6px' borderRadius={4} _hover={{outline: '1px solid', outlineColor: 'blue.200'}}>
        <Flex align= 'center'>
                <Flex align= 'center'>
            {user? (
                <>
                <Icon fontSize={20} as={IoPerson } mr ={1} color="gray.600"
                />
                <Flex          
                  display={{ base: "none", lg: "flex" }}
                  direction="column"
                  fontSize="8pt"
                  alignItems="flex-start"
                  
                  mr={8}
                >
                  <Text 
                  fontWeight={600}>
                    {user?.displayName || user?.email?.split("@")[0]}
                  </Text>
                </Flex>
                </>
            ): (
                <Icon fontSize={24} color= 'gray.400' mr={1} as={VscAccount}/>
            )
            }
              </Flex>
              <ChevronDownIcon/>
               </Flex>
            </MenuButton>
            <MenuList>
            {user? (
                <>
                <MenuItem
                // fontSize="10pt"
                fontWeight={600}
                _hover={{bg: "blue.500", color: "white"}}
                onClick={handleProfileClick} // Handle click event to open modal
                >
                <Flex align= "center" >
                <Icon fontSize={20} mr={2} as={CgProfile} color="gray.400"/>
                Profile        
                    </Flex>
                    </MenuItem>
                    <MenuDivider color= "blue.100"/>
                    <MenuItem
                 fontWeight={600}
                _hover={{bg: "blue.500", color: "white"}}
                onClick={handlehome} // Handle click event to open modal

                >
                <Flex align= "center" >
                <Icon fontSize={20} mr={2} as={ FaChartBar } color="gray.400"/>
                    Dashboard  
                    </Flex>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem
                  //  fontSize="10pt"
                 fontWeight={600}
                _hover={{bg: "blue.500", color: "white"}}
                onClick={handleallCommunities} // Handle click event to open modal

                >
                <Flex align= "center" >
                <Icon fontSize={20} mr={2} as={MdOutlineGroups3  } color="gray.400"/>

                    Communities      
                    </Flex>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem
                  //  fontSize="10pt"
                 fontWeight={600}
                _hover={{bg: "blue.500", color: "white"}}
                onClick={handleSeeResources} // Handle click event to open modal
                >
                <Flex align= "center" >
                <Icon fontSize={20} mr={2} as={MdOutlineLibraryBooks } color="gray.400"/>
                    Resource Corner    
                    </Flex>
                    </MenuItem>
                    <MenuDivider/>
                    
                    <MenuItem
                  //  fontSize="10pt"
                 fontWeight={600}
                _hover={{bg: "blue.500", color: "white"}}
                onClick={handleNews} // Handle click event to open modal

                >
                <Flex align= "center" >
                <Icon fontSize={20} mr={2} as={FaNewspaper } color="gray.400"/>
                    News      
                    </Flex>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem
                 fontWeight={600}
                _hover={{bg: "blue.500", color: "white"}}
                onClick={handleHomeRedirect} // Handle click event to redirect

                >
                <Flex align= "center" >
                <Icon fontSize={20} mr={2} as={IoHomeOutline} color="gray.400"/>
                    Home      
                    </Flex>
                    </MenuItem>
                    <MenuDivider/>

                    <MenuItem
                // fontSize="10pt"
                fontWeight={600}
                _hover={{bg: "blue.500", color: "white"}}
                onClick={logout} 
                >
                <Flex align= "center" >
                <Icon fontSize={20} mr={2} as={MdOutlineLogin} color="gray.400"/>
                Log Out 
                    </Flex>
                    </MenuItem>
                </>
            ): (
                <>
                <MenuItem
                // fontSize="10pt"
                fontWeight={600}
                _hover={{bg: "blue.500", color: "white"}}
                onClick={() => setAuthModalState({open:true, view: "login"}) }
                >
                <Flex align= "center" >
                <Icon fontSize={20} mr={2} as={CgProfile} color="gray.400"/>
                Login/Sign Up        
                    </Flex>
                    </MenuItem>
                    </>
            )}
 </MenuList>
</Menu>
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} userData={user} />
</>

    );
};
export default UserMenu;









