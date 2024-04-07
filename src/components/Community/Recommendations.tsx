import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdHealthAndSafety } from "react-icons/md";
import { Community } from "../../atoms/communitiesAtom";
import { firestore } from "../../firebase/clientApp";
import useCommunityData from "../../hooks/useCommunityData";
import router from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";

const Recommendations: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const { communityStateValue, onJoinOrLeaveCommunity } = useCommunityData();
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);

  const handleJoinButtonClick = (event: React.MouseEvent<HTMLButtonElement>, item: Community, isJoined: boolean) => {
    event.preventDefault(); // Prevent default behavior
    event.stopPropagation();
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    onJoinOrLeaveCommunity(item, isJoined);
  };

  const handleAllCommunitiesButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default behavior
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    router.push("/healthclique/allCommunities");
  };
  
  const getCommunityRecommendations = async () => {
    setLoading(true);
    try {
      const communityQuery = query(
        collection(firestore, "communities"),
        orderBy("numberOfMembers", "desc"),
        limit(5)
      );
      const communityDocs = await getDocs(communityQuery);
      const communities = communityDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCommunities(communities as Community[]);
    } catch (error: any) {
      console.log("getCommunityRecommendations error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCommunityRecommendations();
  }, []);

  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor="gray.300"
      width="110%"
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="70px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url('/images/home (1).png')"
        backgroundSize="cover"
      >
        Get Started with Top Communities
      </Flex>
      <Flex direction="column">
        {loading ? (
          <Stack mt={2} p={3}>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
          </Stack>
        ) : (
          <>
            {communities.map((item, index) => {
              const isJoined = !!communityStateValue.mySnippets.find(
                (snippet) => snippet.communityId === item.id
              );
              return (
<Link key={item.id} href={user ? `/healthclique/${item.id}` : "#"}>
  <Flex
    position="relative"
    align="center"
    // fontSize="10pt"
    borderBottom="1px solid"
    borderColor="gray.200"
    p="10px 12px"
    fontWeight={400}
    cursor={user ? "pointer" : "default"} // Set cursor to pointer only if user is logged in
    onClick={(e) => {
      if (!user) {
        e.preventDefault(); // Prevent redirection if user is not logged in
        setAuthModalState({ open: true, view: "login" });
      }
    }}
  >
    <Flex width="80%" align="center">
      <Flex width="15%">
        <Text mr={2}>{index + 1}</Text>
      </Flex>
      <Flex align="center" width="80%">
        {item.imageURL ? (
          <Image
            borderRadius="full"
            boxSize="28px"
            src={item.imageURL}
            mr={2}
            alt="Iconp for Recommendations Home"
          />
        ) : (
          <Icon
            as={MdHealthAndSafety}
            fontSize={30}
            color="brand.100"
            mr={2}
          />
        )}
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {`${item.id}`}
        </span>
      </Flex>
      </Flex>
      <Box position="absolute" right="10px">
      <Button
        height="22px"
        fontSize="8pt"
        onClick={(event) => handleJoinButtonClick(event, item, isJoined)}
        variant={isJoined ? "outline" : "solid"}
      >
        {isJoined ? "Joined" : "Join"}
      </Button>
      </Box>
      </Flex>
      </Link>
              );
            })}
            <Box p="10px 20px">
              <Button
                height="30px"
                width="100%"
                bg="brand.100"
                onClick={handleAllCommunitiesButtonClick}
              >
                View All
              </Button>
            </Box>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Recommendations;
