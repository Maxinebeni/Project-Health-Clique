import { Community } from "@/atoms/communitiesAtom";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";
import { FaReddit } from "react-icons/fa";
import { CiMedicalCase } from "react-icons/ci";
import { FaHandHoldingMedical } from "react-icons/fa";
import useCommunityData from "@/hooks/useCommunityData";




type HeaderProps = {
    communityData: Community;
  };
  
  const Header: React.FC<HeaderProps> = ({ communityData }) => {

    const {communityStateValue, onJoinOrLeaveCommunity, loading} = useCommunityData();
    const isJoined = !!communityStateValue.mySnippets.find(
      (item) => item.communityId === communityData.id
    );
  
    return (
      <Flex direction="column" width="100%" height="146px">
<Box height="50%" bg= "brand.100" 
/>
        <Flex justifyContent="center" bg="white" height="50%">
          <Flex width="95%" maxWidth="860px">
            {communityStateValue.currentCommunity?.imageURL ? (
              <Image
                borderRadius="full"
                boxSize="66px"
                src={communityStateValue.currentCommunity.imageURL}
                alt="Dan Abramov"
                position="relative"
                top={-3}
                color="blue.500"
                border="4px solid white"
              />
            ) : (
              <Icon
                as={FaHandHoldingMedical}
                fontSize={70}
                position="relative"
                top={-3}
                color="white"
                border="4px solid white"
                borderRadius="50%"
                background="blue.400"
              />)}
            <Flex padding="10px 16px">
              <Flex direction="column" mr={6}>
                <Text fontWeight={800} fontSize="16pt">
                  {communityData.id}
                </Text>
                <Text fontWeight={600} fontSize="10pt" color="gray.400">
                  {communityData.id}
                </Text>
              </Flex>
              <Flex>
                <Button
                  variant={isJoined ? "outline" : "solid"}
                  height="30px"
                  pr={6}
                  pl={6}
                  isLoading={loading}
                  onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
                //   isLoading={loading}
                >
                  {isJoined ? "Joined" : "Join"}
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  };
  export default Header;
  