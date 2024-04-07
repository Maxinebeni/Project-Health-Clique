import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { MdHealthAndSafety } from "react-icons/md";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { firestore } from "../../firebase/clientApp";
import { Community as CommunityType } from "../../atoms/communitiesAtom"; // Import Community type from communitiesAtom
import useCommunityData from "@/hooks/useCommunityData";
import PageContent from "@/components/Layout/PageContent";
import AllCommunityModal from "@/components/Community/allCommunityModal";


interface Community {
  id: string;
  name: string;
  imageURL?: string;
  numberOfMembers: number;
  creatorId: string;
  privacyType: "public" | "restricted" | "private";
}

const AllCommunitiesPage: React.FC = () => {
  const [allCommunities, setAllCommunities] = useState<Community[]>([]);
  const [myCommunities, setMyCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { onJoinOrLeaveCommunity, communityStateValue } = useCommunityData();

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(firestore, "communities"));
        const communityData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.id, // Use the document ID as the community name
          ...doc.data(),
        })) as Community[];
        setAllCommunities(communityData);
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
      setLoading(false);
    };
    fetchCommunities();
  }, []);
  
  useEffect(() => {
    // Filter the communities based on the user's joined communities
    const filteredCommunities = allCommunities.filter((community) =>
      communityStateValue.mySnippets.some((snippet) => snippet.communityId === community.id)
    );

    setMyCommunities(filteredCommunities);
  }, [allCommunities, communityStateValue.mySnippets]);

  const handleJoinCommunity = async (communityId: string) => {
    const communityDoc = await getDoc(doc(firestore, "communities", communityId));

    if (communityDoc.exists()) {
      const communityData = communityDoc.data() as Community;

      const isJoined = myCommunities.some((community) => community.id === communityId);

      onJoinOrLeaveCommunity({ ...communityData, id: communityId }, isJoined);

      if (isJoined) {
        setMyCommunities(myCommunities.filter((community) => community.id !== communityId));
      } else {
        setMyCommunities([...myCommunities, communityData]);
      }

      router.push(`/healthclique/${communityId}`);
    } else {
      console.error("Community not found: ", communityId);
    }
  };


  return (
    <div
      style={{
        backgroundImage: "url('/images/bground.png')", // Assuming your image is located in the public/images directory
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh", // Ensure the background covers the entire page height
        backgroundColor: "gray.100", // Add background color here

      }}
    >
      <PageContent>
        <Flex direction="column" alignItems="center">
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Communities
          </Text>
          {loading ? (
            <Stack spacing={4} width="100%" maxWidth="800px">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} height="60px" borderRadius="md" />
              ))}
            </Stack>
          ) : (
            <Stack spacing={4} width="100%" maxWidth="800px">
              {allCommunities.map((community: Community, index: number) => (
                <React.Fragment key={community.id}>
                  <Flex
                    align="center"
                    justify="space-between"
                    bg="white"
                    borderRadius="md"
                    boxShadow="md"
                    p={4}
                  >
                    <Flex align="center">
                      {community.imageURL ? (
                        <Image
                          src={community.imageURL}
                          boxSize="50px"
                          borderRadius="full"
                          mr={4}
                        />
                      ) : (
                        <Icon as={MdHealthAndSafety} boxSize="50px" color="blue.500" mr={4} />
                      )}
                      <Link href={`/healthclique/${community.id}`}>
                        <Text color="black" fontWeight="bold" cursor="pointer">
                          {community.name}
                        </Text>
                      </Link>
                    </Flex>
                    <Button
                      onClick={() => handleJoinCommunity(community.id)}
                      variant={
                        myCommunities.some((c) => c.id === community.id) ? "outline" : "solid"
                      }
                      colorScheme={myCommunities.some((c) => c.id === community.id) ? "gray" : "blue"}
                      size="sm"
                      >
                        {myCommunities.some((c) => c.id === community.id) ? "Joined" : "Join"}
                      </Button>
                    </Flex>
                    {index !== allCommunities.length - 1 && (
                      <Box borderBottom="1px solid" borderColor="gray.200" />
                    )}
                  </React.Fragment>
                ))}
              </Stack>
            )}
          </Flex>
          <AllCommunityModal />
        </PageContent>
      </div>
    );
  };
  
  export default AllCommunitiesPage;
  
                     

